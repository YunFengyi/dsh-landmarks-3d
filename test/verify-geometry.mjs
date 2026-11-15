/**
 * 几何校验：不开浏览器、不建 DOM，直接把四个模型建出来，检查
 * 三角形数据、真实比例，以及渲染器算出的取景是否把整座模型框在视野内。
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 脚本位于 <仓库>/test/ 下，被测文件是上一级的 client.js
const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(HERE, '..', 'client.js')
let code = readFileSync(SRC, 'utf8')
const anchor = "\t\treturn {\n\t\t\tinject: ['slots'],"
if (!code.includes(anchor)) throw new Error('cannot find factory return to hook')
code = code.replace(anchor, '\t\tglobalThis.__MODELS__ = MODELS\n' + anchor)

const dir = mkdtempSync(join(tmpdir(), 'l3d-geo-'))
const file = join(dir, 'client.mjs')
writeFileSync(file, code)

let captured = null
globalThis.window = {
	__ModuleLoader__: { load: (spec) => { captured = spec } },
	devicePixelRatio: 1,
	matchMedia: () => ({ matches: false }),
}
globalThis.document = { addEventListener() {}, removeEventListener() {} }
await import('file://' + file)
captured.factory((name) => {
	if (name === 'react') return { createElement: () => null }
	throw new Error('unexpected require ' + name)
})
const MODELS = globalThis.__MODELS__

/* proportions from the real buildings: width / height */
const RATIO = { eiffel: [0.3, 0.62], wall: [3, 12], palace: [2, 6], colosseum: [2.2, 5.5] }
const FOV_Y = (32 * Math.PI) / 180
const ASPECT = 1.4
const problems = []

console.log('model       tris    size (x·y·z)          w/h    ground  dist  cover')
for (const id of Object.keys(MODELS)) {
	const spec = MODELS[id]
	const { pos, nrm, col, count } = spec.build().main
	const tris = count / 3
	const min = [Infinity, Infinity, Infinity]
	const max = [-Infinity, -Infinity, -Infinity]
	let bad = 0
	for (let i = 0; i < count; i += 1) {
		for (let k = 0; k < 3; k += 1) {
			const v = pos[i * 3 + k]
			if (!Number.isFinite(v)) bad += 1
			if (v < min[k]) min[k] = v
			if (v > max[k]) max[k] = v
		}
	}
	let worstNormal = 0
	for (let i = 0; i < count; i += 1) {
		worstNormal = Math.max(worstNormal, Math.abs(Math.hypot(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]) - 1))
	}
	let colOut = 0
	for (let i = 0; i < count * 3; i += 1) if (!(col[i] >= 0 && col[i] <= 1)) colOut += 1
	let degenerate = 0
	for (let t = 0; t < count; t += 3) {
		const a = t * 3
		const same = (x, y) => pos[x] === pos[y] && pos[x + 1] === pos[y + 1] && pos[x + 2] === pos[y + 2]
		if (same(a, a + 3) || same(a + 3, a + 6) || same(a, a + 6)) degenerate += 1
	}

	const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
	const width = Math.max(size[0], size[2])
	const ratio = width / size[1]
	const halfR = 0.5 * Math.hypot(size[0], size[2])
	const halfH = 0.5 * size[1]
	const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]

	/* mirror createScene: the same fitted-distance formula */
	const pitch = spec.pitch
	const tanY = Math.tan(FOV_Y / 2)
	const tanX = tanY * ASPECT
	const halfV = halfH * Math.cos(pitch) + halfR * Math.abs(Math.sin(pitch))
	const distH = halfR / tanX + halfR
	const distV = halfV / tanY + halfR
	const dist = Math.max(distH, distV) * 1.08
	const groundR = Math.max(4, halfR * 1.55)

	/* project the eight box corners from the opening camera and measure coverage */
	const eye = [center[0] + Math.sin(spec.yaw) * Math.cos(pitch) * dist, center[1] + Math.sin(pitch) * dist, center[2] + Math.cos(spec.yaw) * Math.cos(pitch) * dist]
	const view = lookAt(eye, center)
	let maxX = 0
	let maxY = 0
	let nearest = Infinity
	for (let i = 0; i < 8; i += 1) {
		const p = [(i & 1 ? max[0] : min[0]), (i & 2 ? max[1] : min[1]), (i & 4 ? max[2] : min[2])]
		const v = transform(view, p)
		if (-v[2] < nearest) nearest = -v[2]
		maxX = Math.max(maxX, Math.abs(v[0] / -v[2]) / tanX)
		maxY = Math.max(maxY, Math.abs(v[1] / -v[2]) / tanY)
	}
	const fill = Math.max(maxX, maxY)
	if (process.env.DBG && id === process.env.DBG) { for (let i = 0; i < 8; i += 1) { const p = [(i & 1 ? max[0] : min[0]), (i & 2 ? max[1] : min[1]), (i & 4 ? max[2] : min[2])]; const v = transform(view, p); console.log(i, p.map(n=>n.toFixed(2)), v.map(n=>n.toFixed(2))) } console.log("dist", dist, "tanX", tanX, "tanY", tanY) }

	if (bad) problems.push(id + ': ' + bad + ' non-finite coordinates')
	if (tris < 300) problems.push(id + ': only ' + tris + ' triangles')
	if (worstNormal > 1e-3) problems.push(id + ': normals not unit (' + worstNormal.toFixed(4) + ')')
	if (colOut) problems.push(id + ': ' + colOut + ' colour channels outside [0,1]')
	if (degenerate) problems.push(id + ': ' + degenerate + ' degenerate triangles')
	if (min[1] < -0.001) {
		let lowest = -1
		for (let i = 0; i < count; i += 1) if (pos[i * 3 + 1] <= min[1] + 1e-9) { lowest = i; break }
		const lp = [pos[lowest * 3], pos[lowest * 3 + 1], pos[lowest * 3 + 2]]
		const lc = [col[lowest * 3], col[lowest * 3 + 1], col[lowest * 3 + 2]]
		problems.push(id + ': geometry below grade (' + min[1].toFixed(4) + ') at ' + lp.map((n) => n.toFixed(2)).join(',') + ' colour ' + lc.map((n) => n.toFixed(2)).join(','))
	}
	const range = RATIO[id]
	if (ratio < range[0] || ratio > range[1]) problems.push(id + ': width/height ' + ratio.toFixed(2) + ' outside ' + range)
	if (maxX > 1 || maxY > 1) problems.push(id + ': camera crops the model (x ' + maxX.toFixed(2) + ', y ' + maxY.toFixed(2) + ')')
	if (fill < 0.5) problems.push(id + ': model covers only ' + (fill * 100).toFixed(0) + '% of the frame')
	if (nearest < 0.5) problems.push(id + ': camera inside the near plane (' + nearest.toFixed(2) + ')')
	if (groundR < halfR) problems.push(id + ': ground disc smaller than the model')

	console.log(
		id.padEnd(11),
		String(tris).padStart(5),
		' ' + [size[0], size[1], size[2]].map((v) => v.toFixed(1)).join('·').padEnd(20),
		ratio.toFixed(2).padStart(5),
		groundR.toFixed(1).padStart(6),
		dist.toFixed(1).padStart(6),
		(fill * 100).toFixed(0).padStart(4) + '%'
	)
}

rmSync(dir, { recursive: true, force: true })

function lookAt(eye, center) {
	const f = norm([center[0] - eye[0], center[1] - eye[1], center[2] - eye[2]])
	const up = [0, 1, 0]
	const s = norm(cross(f, up))
	const u = cross(s, f)
	return { s, u, f, eye }
}
function transform(view, p) {
	const dx = p[0] - view.eye[0]
	const dy = p[1] - view.eye[1]
	const dz = p[2] - view.eye[2]
	return [
		view.s[0] * dx + view.s[1] * dy + view.s[2] * dz,
		view.u[0] * dx + view.u[1] * dy + view.u[2] * dz,
		-(view.f[0] * dx + view.f[1] * dy + view.f[2] * dz)
	]
}
function cross(a, b) {
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}
function norm(a) {
	const l = Math.hypot(a[0], a[1], a[2]) || 1
	return [a[0] / l, a[1] / l, a[2] / l]
}

if (problems.length) {
	console.log('\nPROBLEMS:')
	for (const p of problems) console.log(' - ' + p)
	process.exit(1)
}
console.log('\nOK: all models are sound, proportioned and fully framed')
