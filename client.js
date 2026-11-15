window.__ModuleLoader__.load({
	id: 'dsh-landmarks-3d',
	factory(require) {
		const React = require('react')
		const h = React.createElement

		/* ------------------------------------------------------------------ *
		 * Identity
		 * ------------------------------------------------------------------ */
		const NS = 'landmarks3d'
		const PANEL_ID = 'landmarks-3d'
		const IDS = ['eiffel', 'wall', 'palace', 'colosseum']

		/* ------------------------------------------------------------------ *
		 * Strings
		 * ------------------------------------------------------------------ */
		const EN = {
			title: 'Landmarks in 3D',
			subtitle: 'Four iconic structures, modelled in code and rendered in real time',
			hint: 'Drag or arrow keys to rotate · Scroll to zoom · Double-click to reset',
			hintTouch: 'Drag to rotate · Pinch to zoom · Double-tap to reset',
			autoRotate: 'Auto-rotate',
			resetView: 'Reset view',
			canvasLabel: 'Interactive 3D model',
			note: 'Models are procedural geometry, not survey-grade data.',
			buildFailed: 'WebGL could not start in this browser, so the 3D models cannot be shown.',
			eiffelName: 'Eiffel Tower',
			eiffelWhere: 'Paris, France',
			eiffelDesc: 'Erected for the World\u2019s Fair as a temporary exhibit, from 18,038 iron parts and 2.5 million rivets. It was meant to stand for twenty years; Paris kept it.',
			eiffelFA: 'Height',
			eiffelVA: '330 m',
			eiffelFB: 'Completed',
			eiffelVB: '1889',
			eiffelFC: 'Material',
			eiffelVC: 'Puddled iron',
			wallName: 'Great Wall',
			wallWhere: 'Northern China',
			wallDesc: 'A defensive system strung along the ridges of northern China and rebuilt at imperial scale under the Ming. Brick and stone follow the terrain instead of cutting through it.',
			wallFA: 'Total length',
			wallVA: '21,196 km',
			wallFB: 'First built',
			wallVB: '7th c. BC',
			wallFC: 'Best known',
			wallVC: 'Badaling, Ming',
			palaceName: 'Forbidden City',
			palaceWhere: 'Beijing, China',
			palaceDesc: 'The imperial palace of the Ming and Qing, home to 24 emperors. Three great halls sit on a white-marble terrace along a single axis; the rest is a grid of courtyards behind the gates.',
			palaceFA: 'Completed',
			palaceVA: '1420',
			palaceFB: 'Area',
			palaceVB: '72 ha',
			palaceFC: 'Rooms',
			palaceVC: 'About 8,700',
			colosseumName: 'Colosseum',
			colosseumWhere: 'Rome, Italy',
			colosseumDesc: 'The Flavian amphitheatre opened with a hundred days of games, on the site of Nero\u2019s Golden House. Three arcaded storeys and a solid attic ringed an arena of sand over timber vaults; the north side has fallen away.',
			colosseumFA: 'Height',
			colosseumVA: '48 m',
			colosseumFB: 'Opened',
			colosseumVB: 'AD 80',
			colosseumFC: 'Capacity',
			colosseumVC: '50,000+'
		}

		const ZH = {
			title: '世界地标 3D',
			subtitle: '四座标志性建筑，全部由代码程序化建模、实时渲染',
			hint: '拖动或方向键旋转 · 滚轮缩放 · 双击复位',
			hintTouch: '拖动旋转 · 双指缩放 · 双击复位',
			autoRotate: '自动旋转',
			resetView: '复位视角',
			canvasLabel: '可交互 3D 模型',
			note: '模型为程序化几何示意，非测绘数据。',
			buildFailed: '当前浏览器无法启动 WebGL，3D 模型无法显示。',
			eiffelName: '埃菲尔铁塔',
			eiffelWhere: '法国 · 巴黎',
			eiffelDesc: '为巴黎世博会而建的一座临时展馆：18,038 个锻铁构件、250 万颗铆钉。它原本只打算立二十年，巴黎把它留了下来。',
			eiffelFA: '高度',
			eiffelVA: '330 米',
			eiffelFB: '落成',
			eiffelVB: '1889 年',
			eiffelFC: '材质',
			eiffelVC: '熟铁',
			wallName: '万里长城',
			wallWhere: '中国 · 北方',
			wallDesc: '沿中国北方山脊铺开的防御体系，明代在旧墙基上大规模重筑。砖石顺着山势起伏，随地形转折。',
			wallFA: '总长',
			wallVA: '21,196 公里',
			wallFB: '始建',
			wallVB: '公元前 7 世纪',
			wallFC: '代表段落',
			wallVC: '明长城 · 八达岭',
			palaceName: '紫禁城',
			palaceWhere: '中国 · 北京',
			palaceDesc: '明清两代的皇宫，先后有 24 位皇帝在此居住。三大殿坐落在汉白玉台基上，沿一条中轴排开，其余是层层院落组成的网格。',
			palaceFA: '建成',
			palaceVA: '1420 年',
			palaceFB: '占地',
			palaceVB: '72 公顷',
			palaceFC: '房间',
			palaceVC: '约 8,700 间',
			colosseumName: '罗马斗兽场',
			colosseumWhere: '意大利 · 罗马',
			colosseumDesc: '弗拉维王朝的圆形剧场，开幕时连演百日，建在尼禄金宫旧址上。三层拱廊加一圈实墙围住沙地竞技场，如今北侧外墙已经坍塌。',
			colosseumFA: '高度',
			colosseumVA: '48 米',
			colosseumFB: '落成',
			colosseumVB: '公元 80 年',
			colosseumFC: '容量',
			colosseumVC: '5 万人以上'
		}

		const DICTS = { en: EN, zh: ZH }

		/* ------------------------------------------------------------------ *
		 * Tiny math
		 * ------------------------------------------------------------------ */
		function srgb(value) {
			const v = Math.max(0, Math.min(255, value)) / 255
			return Math.pow(v, 2.2)
		}

		function hex(code) {
			const value = parseInt(code.slice(1), 16)
			return [srgb((value >> 16) & 255), srgb((value >> 8) & 255), srgb(value & 255)]
		}

		function mixc(a, b, t) {
			const k = Math.max(0, Math.min(1, t))
			return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
		}

		function clamp01(v) {
			return v < 0 ? 0 : v > 1 ? 1 : v
		}

		function smoothstep(edge0, edge1, x) {
			const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6))
			return t * t * (3 - 2 * t)
		}

		function lerp(a, b, t) {
			return a + (b - a) * t
		}

		function m4Perspective(fovy, aspect, near, far) {
			const f = 1 / Math.tan(fovy / 2)
			const nf = 1 / (near - far)
			return new Float32Array([
				f / aspect, 0, 0, 0,
				0, f, 0, 0,
				0, 0, (far + near) * nf, -1,
				0, 0, 2 * far * near * nf, 0
			])
		}

		function m4LookAt(eye, center, up) {
			let zx = eye[0] - center[0]
			let zy = eye[1] - center[1]
			let zz = eye[2] - center[2]
			let len = Math.hypot(zx, zy, zz) || 1
			zx /= len
			zy /= len
			zz /= len
			let xx = up[1] * zz - up[2] * zy
			let xy = up[2] * zx - up[0] * zz
			let xz = up[0] * zy - up[1] * zx
			len = Math.hypot(xx, xy, xz) || 1
			xx /= len
			xy /= len
			xz /= len
			const yx = zy * xz - zz * xy
			const yy = zz * xx - zx * xz
			const yz = zx * xy - zy * xx
			return new Float32Array([
				xx, yx, zx, 0,
				xy, yy, zy, 0,
				xz, yz, zz, 0,
				-(xx * eye[0] + xy * eye[1] + xz * eye[2]),
				-(yx * eye[0] + yy * eye[1] + yz * eye[2]),
				-(zx * eye[0] + zy * eye[1] + zz * eye[2]),
				1
			])
		}

		function m4Multiply(a, b) {
			const out = new Float32Array(16)
			for (let i = 0; i < 4; i += 1) {
				for (let j = 0; j < 4; j += 1) {
					out[i * 4 + j] =
						a[j] * b[i * 4] + a[4 + j] * b[i * 4 + 1] + a[8 + j] * b[i * 4 + 2] + a[12 + j] * b[i * 4 + 3]
				}
			}
			return out
		}

		function m4Model(scale, ty) {
			return new Float32Array([scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, ty, 0, 1])
		}

		function m3FromM4(m) {
			return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]])
		}

		/* ------------------------------------------------------------------ *
		 * Geometry builder: every primitive emits flat-shaded triangles
		 * ------------------------------------------------------------------ */
		function Builder() {
			this.p = []
			this.n = []
			this.c = []
		}

		Builder.prototype.tri = function tri(a, b, c, color) {
			const ux = b[0] - a[0]
			const uy = b[1] - a[1]
			const uz = b[2] - a[2]
			const vx = c[0] - a[0]
			const vy = c[1] - a[1]
			const vz = c[2] - a[2]
			let nx = uy * vz - uz * vy
			let ny = uz * vx - ux * vz
			let nz = ux * vy - uy * vx
			const len = Math.hypot(nx, ny, nz)
			if (len < 1e-9) return
			nx /= len
			ny /= len
			nz /= len
			this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2])
			this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz)
			this.c.push(color[0], color[1], color[2], color[0], color[1], color[2], color[0], color[1], color[2])
		}

		Builder.prototype.quad = function quad(a, b, c, d, color) {
			this.tri(a, b, c, color)
			this.tri(a, c, d, color)
		}

		/* Axis-aligned box anchored on its bottom face. */
		Builder.prototype.box = function box(cx, y0, cz, w, hgt, d, color) {
			const x0 = cx - w / 2
			const x1 = cx + w / 2
			const y1 = y0 + hgt
			const z0 = cz - d / 2
			const z1 = cz + d / 2
			this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], color)
			this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], color)
			this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], color)
			this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], color)
			this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], color)
			this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], color)
		}

		/* Box given a centre and three half-extent axes (all unit length). */
		Builder.prototype.frameBox = function frameBox(c, u, v, w, hu, hv, hw, color) {
			const at = (i, j, k) => [
				c[0] + u[0] * hu * i + v[0] * hv * j + w[0] * hw * k,
				c[1] + u[1] * hu * i + v[1] * hv * j + w[1] * hw * k,
				c[2] + u[2] * hu * i + v[2] * hv * j + w[2] * hw * k
			]
			const a = at(1, -1, -1)
			const b = at(1, 1, -1)
			const cc = at(1, 1, 1)
			const d = at(1, -1, 1)
			this.quad(a, b, cc, d, color)
			this.quad(at(-1, -1, 1), at(-1, 1, 1), at(-1, 1, -1), at(-1, -1, -1), color)
			this.quad(at(-1, 1, -1), at(-1, 1, 1), at(1, 1, 1), at(1, 1, -1), color)
			this.quad(at(-1, -1, 1), at(-1, -1, -1), at(1, -1, -1), at(1, -1, 1), color)
			this.quad(at(-1, -1, 1), at(1, -1, 1), at(1, 1, 1), at(-1, 1, 1), color)
			this.quad(at(1, -1, -1), at(-1, -1, -1), at(-1, 1, -1), at(1, 1, -1), color)
		}

		/* Rectangular bar running from point a to point c. */
		Builder.prototype.strut = function strut(a, c, tw, td, color) {
			const dx = c[0] - a[0]
			const dy = c[1] - a[1]
			const dz = c[2] - a[2]
			const len = Math.hypot(dx, dy, dz)
			if (len < 1e-6) return
			const u = [dx / len, dy / len, dz / len]
			const ref = Math.abs(u[1]) > 0.94 ? [0, 0, 1] : [0, 1, 0]
			let vx = ref[1] * u[2] - ref[2] * u[1]
			let vy = ref[2] * u[0] - ref[0] * u[2]
			let vz = ref[0] * u[1] - ref[1] * u[0]
			const vl = Math.hypot(vx, vy, vz) || 1
			vx /= vl
			vy /= vl
			vz /= vl
			const w = [u[1] * vz - u[2] * vy, u[2] * vx - u[0] * vz, u[0] * vy - u[1] * vx]
			this.frameBox(
				[(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2],
				u, [vx, vy, vz], w,
				len / 2, tw / 2, td / 2,
				color
			)
		}

		Builder.prototype.frustum = function frustum(cx, y0, cz, r0, r1, hgt, seg, color, capped) {
			const y1 = y0 + hgt
			for (let i = 0; i < seg; i += 1) {
				const a0 = (i / seg) * Math.PI * 2
				const a1 = ((i + 1) / seg) * Math.PI * 2
				const p0 = [cx + Math.cos(a0) * r0, y0, cz + Math.sin(a0) * r0]
				const p1 = [cx + Math.cos(a1) * r0, y0, cz + Math.sin(a1) * r0]
				const q0 = [cx + Math.cos(a0) * r1, y1, cz + Math.sin(a0) * r1]
				const q1 = [cx + Math.cos(a1) * r1, y1, cz + Math.sin(a1) * r1]
				this.quad(p0, p1, q1, q0, color)
			}
			if (capped !== false) {
				const centre = [cx, y0, cz]
				const top = [cx, y1, cz]
				for (let i = 0; i < seg; i += 1) {
					const a0 = (i / seg) * Math.PI * 2
					const a1 = ((i + 1) / seg) * Math.PI * 2
					this.tri(centre, [cx + Math.cos(a0) * r0, y0, cz + Math.sin(a0) * r0], [cx + Math.cos(a1) * r0, y0, cz + Math.sin(a1) * r0], color)
					if (r1 > 1e-4) this.tri(top, [cx + Math.cos(a1) * r1, y1, cz + Math.sin(a1) * r1], [cx + Math.cos(a0) * r1, y1, cz + Math.sin(a0) * r1], color)
				}
			}
		}

		Builder.prototype.disc = function disc(cx, y, cz, rx, rz, seg, color) {
			const centre = [cx, y, cz]
			for (let i = 0; i < seg; i += 1) {
				const a0 = (i / seg) * Math.PI * 2
				const a1 = ((i + 1) / seg) * Math.PI * 2
				this.tri(centre, [cx + Math.cos(a1) * rx, y, cz + Math.sin(a1) * rz], [cx + Math.cos(a0) * rx, y, cz + Math.sin(a0) * rz], color)
			}
		}

		Builder.prototype.finish = function finish() {
			return {
				pos: new Float32Array(this.p),
				nrm: new Float32Array(this.n),
				col: new Float32Array(this.c),
				count: this.p.length / 3
			}
		}

		/* ------------------------------------------------------------------ *
		 * Landmark 1 — Eiffel Tower
		 * ------------------------------------------------------------------ */
		function buildEiffel() {
			const b = new Builder()
			const iron = hex('#7d5f3c')
			const ironLit = hex('#96744a')
			const ironDark = hex('#5d4527')
			const deck = hex('#6b5231')

			/* stepped stone plinth; the tower legs enter it, so nothing sits below grade */
			b.box(0, 0, 0, 10.2, 0.2, 10.2, hex('#c6bcaa'))
			b.box(0, 0.2, 0, 8.6, 0.2, 8.6, hex('#b6ab97'))

			const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
			/* y0, y1, half-spread at y0, at y1, section half at y0, at y1 */
			const stages = [
				[0.3, 3.45, 3.78, 2.05, 0.46, 0.3],
				[3.45, 6.97, 2.05, 1.22, 0.3, 0.2],
				[6.97, 16.9, 1.22, 0.26, 0.2, 0.075]
			]
			const levels = [4, 3, 9]

			for (let s = 0; s < stages.length; s += 1) {
				const [y0, y1, sp0, sp1, sec0, sec1] = stages[s]
				const steps = levels[s]
				for (let k = 0; k < steps; k += 1) {
					const t0 = k / steps
					const t1 = (k + 1) / steps
					const ya = lerp(y0, y1, t0)
					const yb = lerp(y0, y1, t1)
					const spa = lerp(sp0, sp1, t0)
					const spb = lerp(sp0, sp1, t1)
					const sa = lerp(sec0, sec1, t0)
					const sb = lerp(sec0, sec1, t1)
					/* four legs */
					for (let c = 0; c < 4; c += 1) {
						const [sx, sz] = corners[c]
						b.strut([sx * spa, ya, sz * spa], [sx * spb, yb, sz * spb], sa * 2, sa * 2, iron)
					}
					/* horizontal belts + X bracing on the four faces */
					for (let f = 0; f < 4; f += 1) {
						const c0 = corners[f]
						const c1 = corners[(f + 1) % 4]
						const a0 = [c0[0] * spa, ya, c0[1] * spa]
						const b0 = [c1[0] * spa, ya, c1[1] * spa]
						const a1 = [c0[0] * spb, yb, c0[1] * spb]
						const b1 = [c1[0] * spb, yb, c1[1] * spb]
						const thin = s === 2 ? 0.055 : 0.075
						b.strut(a0, b0, thin, thin * 1.3, ironDark)
						b.strut(a0, b1, thin, thin, ironLit)
						b.strut(b0, a1, thin, thin, ironLit)
					}
				}
			}

			/* the four base arches */
			const archSpring = 0.55
			const archR = 2.45
			for (let f = 0; f < 4; f += 1) {
				const side = f === 0 || f === 1 ? 1 : -1
				const along = f < 2 ? 'z' : 'x'
				for (let i = 0; i < 9; i += 1) {
					const t0 = (Math.PI * i) / 9
					const t1 = (Math.PI * (i + 1)) / 9
					const p = (t) => {
						const c = Math.cos(t) * archR
						const y = archSpring + Math.sin(t) * archR
						const spread = lerp(3.9, 2.05, Math.min(1, y / 3.45))
						return along === 'z' ? [side * spread, y, c] : [c, y, side * spread]
					}
					b.strut(p(t0), p(t1), 0.13, 0.13, ironLit)
				}
			}

			/* platforms, railings and the little glass pavilions */
			const platform = (y, half, thick, cabin) => {
				b.box(0, y, 0, half * 2, thick, half * 2, deck)
				b.box(0, y + thick, 0, half * 2 + 0.08, 0.24, half * 2 + 0.08, iron)
				b.box(0, y + thick + 0.02, 0, half * 2 - 0.12, 0.26, half * 2 - 0.12, cabin)
				b.box(0, y + thick + 0.28, 0, half * 2 - 0.2, 0.1, half * 2 - 0.2, ironDark)
			}
			platform(3.45, 2.45, 0.26, ironLit)
			platform(6.97, 1.6, 0.22, ironLit)
			platform(16.9, 0.66, 0.16, ironLit)

			/* top mast */
			b.frustum(0, 16.9, 0, 0.3, 0.16, 1.4, 12, iron, false)
			b.frustum(0, 18.3, 0, 0.14, 0.05, 1.9, 12, ironLit, false)
			b.box(0, 20.2, 0, 0.07, 0.55, 0.07, ironDark)
			b.box(0, 20.75, 0, 0.34, 0.22, 0.34, hex('#c8642f'))

			/* curb around the edge of the plinth */
			const rim = hex('#a89d88')
			const curb = 4.9
			const curbLen = curb * 2 - 0.22
			b.box(0, 0.2, curb, curbLen, 0.14, 0.22, rim)
			b.box(0, 0.2, -curb, curbLen, 0.14, 0.22, rim)
			b.box(curb, 0.2, 0, 0.22, 0.14, curbLen, rim)
			b.box(-curb, 0.2, 0, 0.22, 0.14, curbLen, rim)

			return { main: b.finish() }
		}

		/* ------------------------------------------------------------------ *
		 * Landmark 2 — Great Wall
		 * ------------------------------------------------------------------ */
		const WALL_X = 22.5
		const WALL_HALF = 0.95
		const WALL_WALK = 1.18
		const WALL_PARA = 1.62

		function ridgeZ(x) {
			return 4.4 * Math.sin(x * 0.115) + 1.3 * Math.sin(x * 0.27 + 1.3)
		}

		function wallGround(x, z) {
			const rz = ridgeZ(x)
			const dz = (z - rz) / 4.0
			const ridge = 5.3 * Math.exp(-dz * dz) * (0.72 + 0.28 * Math.sin(x * 0.13 + 0.5))
			const bumps = 1.35 * Math.sin(x * 0.33 + 0.4) * Math.cos(z * 0.41 - 0.9) + 0.9 * Math.sin((x * 0.7 + z) * 0.17 + 2.1)
			const hgt = ridge + bumps * 0.55 + 0.3
			const rim = Math.max(Math.abs(x) / 24, Math.abs(z) / 13)
			return Math.max(0, hgt * (1 - smoothstep(0.82, 1.0, rim)))
		}

		function buildWall() {
			const b = new Builder()
			const stone = hex('#b3a88f')
			const stoneLit = hex('#cec3a8')
			const stoneDark = hex('#8d846f')
			const turf = hex('#5f7247')
			const dry = hex('#a8a178')
			const rock = hex('#9a9282')

			/* terrain */
			const NX = 40
			const NZ = 26
			const X0 = -24
			const X1 = 24
			const Z0 = -13
			const Z1 = 13
			const grid = []
			for (let i = 0; i <= NX; i += 1) {
				const row = []
				for (let j = 0; j <= NZ; j += 1) {
					const x = lerp(X0, X1, i / NX)
					const z = lerp(Z0, Z1, j / NZ)
					row.push([x, wallGround(x, z), z])
				}
				grid.push(row)
			}
			for (let i = 0; i < NX; i += 1) {
				for (let j = 0; j < NZ; j += 1) {
					const p00 = grid[i][j]
					const p10 = grid[i + 1][j]
					const p11 = grid[i + 1][j + 1]
					const p01 = grid[i][j + 1]
					const hm = (p00[1] + p10[1] + p11[1] + p01[1]) / 4
					const tint = mixc(turf, dry, smoothstep(0.6, 6.2, hm))
					const jitter = ((Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1 + 1) % 1
					const cell = mixc(tint, rock, jitter * 0.22)
					b.quad(p00, p10, p11, p01, cell)
				}
			}

			/* the wall itself: a closed profile swept along the ridge */
			const STEPS = 54
			const pts = []
			const rights = []
			for (let i = 0; i < STEPS; i += 1) {
				const x = lerp(-WALL_X, WALL_X, i / (STEPS - 1))
				const z = ridgeZ(x)
				pts.push([x, wallGround(x, z) + 0.06, z])
			}
			for (let i = 0; i < STEPS; i += 1) {
				const a = pts[Math.max(0, i - 1)]
				const c = pts[Math.min(STEPS - 1, i + 1)]
				const tx = c[0] - a[0]
				const tz = c[2] - a[2]
				const len = Math.hypot(tx, tz) || 1
				rights.push([tz / len, 0, -tx / len])
			}
			const profile = [
				[-WALL_HALF, -0.5],
				[-WALL_HALF, WALL_PARA],
				[-WALL_HALF + 0.26, WALL_PARA],
				[-WALL_HALF + 0.26, WALL_WALK],
				[WALL_HALF - 0.26, WALL_WALK],
				[WALL_HALF - 0.26, WALL_PARA],
				[WALL_HALF, WALL_PARA],
				[WALL_HALF, -0.5]
			]
			const bands = [stone, stoneLit, stoneDark, stoneDark, stoneDark, stoneLit, stone, stoneDark]
			for (let i = 0; i < STEPS - 1; i += 1) {
				const p = pts[i]
				const q = pts[i + 1]
				const rp = rights[i]
				const rq = rights[i + 1]
				for (let k = 0; k < profile.length; k += 1) {
					const k2 = (k + 1) % profile.length
					const A = [p[0] + rp[0] * profile[k][0], p[1] + profile[k][1], p[2] + rp[2] * profile[k][0]]
					const B = [p[0] + rp[0] * profile[k2][0], p[1] + profile[k2][1], p[2] + rp[2] * profile[k2][0]]
					const Cc = [q[0] + rq[0] * profile[k2][0], q[1] + profile[k2][1], q[2] + rq[2] * profile[k2][0]]
					const D = [q[0] + rq[0] * profile[k][0], q[1] + profile[k][1], q[2] + rq[2] * profile[k][0]]
					b.quad(A, B, Cc, D, bands[k])
				}
			}

			/* merlons along both parapets */
			for (let i = 1; i < STEPS; i += 3) {
				const p = pts[i]
				const r = rights[i]
				for (const side of [-1, 1]) {
					const off = side * (WALL_HALF - 0.13)
					b.box(p[0] + r[0] * off, p[1] + WALL_PARA, p[2] + r[2] * off, 0.34, 0.26, 0.62, stoneLit)
				}
			}

			/* watchtowers */
			const towers = [7, 17, 27, 37, 47]
			for (let n = 0; n < towers.length; n += 1) {
				const idx = towers[n]
				const p = pts[idx]
				b.box(p[0], p[1] - 0.6, p[2], 2.5, 3.0, 2.5, stone)
				b.box(p[0], p[1] + 2.4, p[2], 2.72, 0.22, 2.72, stoneLit)
				for (let m = 0; m < 3; m += 1) {
					const o = -0.78 + m * 0.78
					b.box(p[0] + o, p[1] + 2.62, p[2] + 1.1, 0.38, 0.42, 0.28, stoneLit)
					b.box(p[0] + o, p[1] + 2.62, p[2] - 1.1, 0.38, 0.42, 0.28, stoneLit)
					b.box(p[0] + 1.1, p[1] + 2.62, p[2] + o, 0.28, 0.42, 0.38, stoneLit)
					b.box(p[0] - 1.1, p[1] + 2.62, p[2] + o, 0.28, 0.42, 0.38, stoneLit)
				}
				b.box(p[0], p[1] + 0.9, p[2] + 1.2, 0.5, 1.1, 0.3, stoneDark)
			}

			/* a few conifers down the slopes */
			for (let k = 0; k < 90; k += 1) {
				const hx = Math.sin(k * 12.9898) * 43758.5453
				const hz = Math.sin(k * 78.233 + 1.7) * 43758.5453
				const x = (hx - Math.floor(hx)) * 44 - 22
				const z = (hz - Math.floor(hz)) * 23 - 11.5
				const y = wallGround(x, z)
				if (y < 1.1 || y > 5.6) continue
				if (Math.abs(z - ridgeZ(x)) < 2.6) continue
				const sc = 0.55 + ((hx * 3.11) % 1 + 1) % 1 * 0.5
				b.frustum(x, y + 0.1, z, 0.42 * sc, 0.02, 1.5 * sc, 6, hex('#42552f'), false)
			}

			return { main: b.finish() }
		}

		/* ------------------------------------------------------------------ *
		 * Landmark 3 — Forbidden City
		 * ------------------------------------------------------------------ */
		/* Chinese hip roof: swept eave line with upturned corners, ridge beam,
		 * four hip lines. Reads as one of the great halls at a glance. */
		function hipRoof(b, cx, baseY, cz, w, d, hgt, ridgeHalf, lift, fill, line) {
			const N = 6
			const hw = w / 2
			const hd = d / 2
			const ridgeY = baseY + hgt
			const edgeY = (s) => baseY + lift * Math.pow(Math.abs(s - 0.5) * 2, 2.6)
			const clampRidge = (x) => cx + Math.max(-ridgeHalf, Math.min(ridgeHalf, x - cx))

			const front = []
			const back = []
			for (let i = 0; i <= N; i += 1) {
				const s = i / N
				const x = cx - hw + w * s
				front.push([x, edgeY(s), cz + hd])
				back.push([x, edgeY(s), cz - hd])
			}
			for (let i = 0; i < N; i += 1) {
				const f0 = front[i]
				const f1 = front[i + 1]
				b.quad(f0, f1, [clampRidge(f1[0]), ridgeY, cz], [clampRidge(f0[0]), ridgeY, cz], fill)
				const b0 = back[i]
				const b1 = back[i + 1]
				b.quad(b1, b0, [clampRidge(b0[0]), ridgeY, cz], [clampRidge(b1[0]), ridgeY, cz], fill)
			}

			const left = []
			const right = []
			for (let i = 0; i <= N; i += 1) {
				const s = i / N
				const z = cz + hd - d * s
				left.push([cx - hw, edgeY(s), z])
				right.push([cx + hw, edgeY(s), z])
			}
			for (let i = 0; i < N; i += 1) {
				b.tri(left[i], left[i + 1], [cx - ridgeHalf, ridgeY, cz], fill)
				b.tri(right[i + 1], right[i], [cx + ridgeHalf, ridgeY, cz], fill)
			}

			/* ridge beam + the four hip lines + a finial at each end */
			b.box(cx, ridgeY - 0.05, cz, ridgeHalf * 2 + 0.12, 0.12, 0.2, line)
			const r0 = [cx - ridgeHalf, ridgeY, cz]
			const r1 = [cx + ridgeHalf, ridgeY, cz]
			b.strut(r0, [cx - hw, baseY + lift, cz + hd], 0.11, 0.11, line)
			b.strut(r0, [cx - hw, baseY + lift, cz - hd], 0.11, 0.11, line)
			b.strut(r1, [cx + hw, baseY + lift, cz + hd], 0.11, 0.11, line)
			b.strut(r1, [cx + hw, baseY + lift, cz - hd], 0.11, 0.11, line)
			b.box(cx - ridgeHalf, ridgeY, cz, 0.2, 0.22, 0.26, line)
			b.box(cx + ridgeHalf, ridgeY, cz, 0.2, 0.22, 0.26, line)

			/* eave fascia so the roof keeps a crisp edge in silhouette */
			for (let i = 0; i < N; i += 1) {
				b.quad(front[i], front[i + 1], [front[i + 1][0], front[i + 1][1] - 0.16, front[i + 1][2]], [front[i][0], front[i][1] - 0.16, front[i][2]], line)
				b.quad(back[i + 1], back[i], [back[i][0], back[i][1] - 0.16, back[i][2]], [back[i + 1][0], back[i + 1][1] - 0.16, back[i + 1][2]], line)
			}
			for (let i = 0; i < N; i += 1) {
				b.quad(left[i + 1], left[i], [left[i][0], left[i][1] - 0.16, left[i][2]], [left[i + 1][0], left[i + 1][1] - 0.16, left[i + 1][2]], line)
				b.quad(right[i], right[i + 1], [right[i + 1][0], right[i + 1][1] - 0.16, right[i + 1][2]], [right[i][0], right[i][1] - 0.16, right[i][2]], line)
			}
		}

		function buildPalace() {
			const b = new Builder()
			const red = hex('#9c3b30')
			const redDark = hex('#7d2c24')
			const gold = hex('#c99a37')
			const goldLine = hex('#a2761f')
			const marble = hex('#e0d8c6')
			const marbleDark = hex('#c9bfa9')
			const paving = hex('#b3a58c')
			const pavingDark = hex('#9b8d76')

			/* ground + courtyard */
			b.box(0, 0, 0, 27.5, 0.16, 21.5, pavingDark)
			b.box(0, 0.02, 0, 24.6, 0.16, 18.6, paving)
			b.box(0, 0.02, 0.4, 12.4, 0.17, 13.6, mixc(paving, marble, 0.35))

			/* perimeter wall with gold coping */
			const ring = [
				[0, 9.4, 25.6, 0.9],
				[0, -9.4, 25.6, 0.9],
				[-12.4, 0, 0.9, 18.8],
				[12.4, 0, 0.9, 18.8]
			]
			for (const [cx, cz, w, d] of ring) {
				b.box(cx, 0.08, cz, w, 1.72, d, red)
				b.box(cx, 1.8, cz, w + 0.24, 0.14, d + 0.24, goldLine)
				b.box(cx, 1.94, cz, w + 0.12, 0.08, d + 0.12, gold)
			}

			/* corner towers */
			for (const sx of [-12.4, 12.4]) {
				for (const sz of [-9.4, 9.4]) {
					b.box(sx, 0.08, sz, 1.9, 2.2, 1.9, red)
					b.box(sx, 2.28, sz, 2.1, 0.12, 2.1, goldLine)
					hipRoof(b, sx, 2.4, sz, 2.7, 2.7, 0.85, 0.4, 0.16, gold, goldLine)
				}
			}

			/* main gate on the south wall */
			b.box(0, 0.08, 9.4, 5.4, 2.9, 1.5, red)
			b.box(0, 0.08, 9.42, 1.5, 1.9, 1.6, redDark)
			hipRoof(b, 0, 2.98, 9.4, 6.2, 2.5, 1.15, 1.5, 0.2, gold, goldLine)

			/* marble terrace, three tiers */
			const tiers = [[12.6, 7.8], [11.7, 7.0], [10.8, 6.2]]
			let ty = 0.18
			for (const [tw, td] of tiers) {
				b.box(0, ty, -1.4, tw, 0.34, td, marble)
				b.box(0, ty + 0.34, -1.4, tw - 0.5, 0.05, td - 0.5, marbleDark)
				ty += 0.39
			}
			/* balustrade posts around the top tier */
			const top = 18
			for (let i = 0; i <= top; i += 1) {
				const x = lerp(-5.3, 5.3, i / top)
				b.box(x, ty, -1.4 - 3.0, 0.14, 0.34, 0.14, marble)
				b.box(x, ty, -1.4 + 3.0, 0.14, 0.34, 0.14, marble)
			}
			for (let i = 0; i <= top; i += 1) {
				const z = lerp(-4.4, 1.6, i / top)
				b.box(-5.3, ty, z, 0.14, 0.34, 0.14, marble)
				b.box(5.3, ty, z, 0.14, 0.34, 0.14, marble)
			}
			b.box(0, ty + 0.34, -4.4, 10.8, 0.08, 0.32, marble)
			b.box(0, ty + 0.34, 1.6, 10.8, 0.08, 0.32, marble)

			/* main hall */
			const hallBase = ty
			const hcz = -1.4
			b.box(0, hallBase, hcz, 7.6, 2.15, 4.6, red)
			/* front colonnade + gold doors */
			for (let i = 0; i < 8; i += 1) {
				const x = lerp(-3.3, 3.3, i / 7)
				b.frustum(x, hallBase, hcz + 2.3, 0.13, 0.13, 2.1, 8, redDark)
			}
			b.box(0, hallBase + 0.1, hcz + 2.32, 2.6, 1.9, 0.16, goldLine)
			b.box(0, hallBase + 0.1, hcz + 2.34, 2.2, 1.75, 0.14, gold)
			/* lattice windows on the flanks */
			for (let i = 0; i < 3; i += 1) {
				const x = -2.1 + i * 2.1
				b.box(x, hallBase + 0.9, hcz + 2.31, 1.1, 0.9, 0.12, goldLine)
			}

			/* double eave roof */
			hipRoof(b, 0, hallBase + 2.15, hcz, 9.6, 6.4, 1.5, 1.7, 0.36, gold, goldLine)
			b.box(0, hallBase + 2.15 + 1.1, hcz, 5.7, 0.72, 3.4, red)
			hipRoof(b, 0, hallBase + 2.15 + 1.82, hcz, 7.4, 4.6, 1.55, 1.3, 0.3, gold, goldLine)

			/* side halls */
			for (const sx of [-8.2, 8.2]) {
				b.box(sx, 0.18, -1.4, 2.8, 1.35, 2.0, red)
				hipRoof(b, sx, 1.53, -1.4, 3.7, 2.9, 0.95, 0.6, 0.2, gold, goldLine)
			}
			/* rear hall */
			b.box(0, 0.18, -6.8, 4.6, 1.6, 2.5, red)
			hipRoof(b, 0, 1.78, -6.8, 5.9, 3.6, 1.2, 1.0, 0.24, gold, goldLine)

			/* two bronze ornaments flanking the stairs */
			for (const sx of [-1.9, 1.9]) {
				b.box(sx, 0.2, 2.35, 0.3, 0.55, 0.3, hex('#6f5a34'))
			}

			return { main: b.finish() }
		}

		/* ------------------------------------------------------------------ *
		 * Landmark 4 — Roman Colosseum
		 * ------------------------------------------------------------------ */
		function buildColosseum() {
			const b = new Builder()
			const trav = hex('#d0c3a6')
			const travLit = hex('#e2d6ba')
			const travDark = hex('#ab9d80')
			const inner = hex('#b3a486')
			const sand = hex('#c9ab7b')
			const seatCol = hex('#b9aa8d')

			const RX = 8.6
			const RZ = 6.7
			const BAYS = 36
			const LEVEL_H = 1.18
			const R_IN = 0.78
			const R_OUT = 1.0

			const at = (theta, radiusMul, y) => [Math.cos(theta) * RX * radiusMul, y, Math.sin(theta) * RZ * radiusMul]
			const tangent = (theta) => {
				const tx = -Math.sin(theta) * RX
				const tz = Math.cos(theta) * RZ
				const len = Math.hypot(tx, tz) || 1
				return [tx / len, 0, tz / len]
			}
			const normal = (theta) => {
				const nx = Math.cos(theta) * RZ
				const nz = Math.sin(theta) * RX
				const len = Math.hypot(nx, nz) || 1
				return [nx / len, 0, nz / len]
			}

			b.disc(0, 0.01, 0, RX * 1.1, RZ * 1.1, 64, hex('#b0a68f'))

			/* arena + podium */
			b.disc(0, 0.1, 0, RX * 0.36, RZ * 0.36, 64, sand)
			for (let i = 0; i < BAYS; i += 1) {
				const t0 = (i / BAYS) * Math.PI * 2
				const t1 = ((i + 1) / BAYS) * Math.PI * 2
				const tm = (t0 + t1) / 2
				const tan = tangent(tm)
				const nrm = normal(tm)
				const c = at(tm, 0.4, 0.1)
				const halfW = (Math.hypot(tangent(t0)[0], tangent(t0)[2]) * 0 + 1) * 0.24
				b.frameBox([c[0], 0.42, c[2]], nrm, tan, [0, 1, 0], halfW, 0.36 + halfW, 0.42, travDark)
			}

			/* stepped seating */
			for (let s = 0; s < 9; s += 1) {
				const t = s / 9
				const rm = lerp(0.42, R_IN, t)
				const y = 0.35 + s * 0.46
				for (let i = 0; i < BAYS; i += 1) {
					const t0 = (i / BAYS) * Math.PI * 2
					const t1 = ((i + 1) / BAYS) * Math.PI * 2
					const tm = (t0 + t1) / 2
					const p0 = at(t0, rm, y)
					const p1 = at(t1, rm, y)
					const p2 = at(t1, rm + 0.055, y + 0.46)
					const p3 = at(t0, rm + 0.055, y + 0.46)
					b.quad(p0, p1, p2, p3, s % 2 === 0 ? seatCol : mixc(seatCol, inner, 0.35))
					const q0 = at(t0, rm + 0.055, y + 0.46)
					const q1 = at(t1, rm + 0.055, y + 0.46)
					b.quad(p0, p1, q1, q0, travDark)
				}
			}

			/* inner ring wall seen through the arches */
			for (let i = 0; i < BAYS; i += 1) {
				const t0 = (i / BAYS) * Math.PI * 2
				const t1 = ((i + 1) / BAYS) * Math.PI * 2
				const tm = (t0 + t1) / 2
				const c = at(tm, R_IN + 0.06, 0)
				const tan = tangent(tm)
				const nrm = normal(tm)
				b.frameBox([c[0], 2.2, c[2]], nrm, tan, [0, 1, 0], Math.hypot(c[0], c[2]) * 0.06, Math.hypot(c[0], c[2]) * 0.055, 2.2, i % 2 === 0 ? inner : mixc(inner, travDark, 0.3))
			}

			/* outer ring: piers, arches, spandrels, attic */
			const RUIN_FROM = 22
			const RUIN_TO = 32
			for (let i = 0; i < BAYS; i += 1) {
				const ruined = i >= RUIN_FROM && i <= RUIN_TO
				const t0 = (i / BAYS) * Math.PI * 2
				const t1 = ((i + 1) / BAYS) * Math.PI * 2
				const tm = (t0 + t1) / 2
				const tan = tangent(tm)
				const nrm = normal(tm)
				const radius = Math.hypot(at(tm, 1, 0)[0], at(tm, 1, 0)[2])
				const bayArc = (Math.PI * 2 * radius) / BAYS
				const pierHalf = bayArc * 0.15
				const levels = ruined ? 2 : 4

				for (let lv = 0; lv < levels; lv += 1) {
					const y0 = lv * LEVEL_H
					const yTop = Math.min(
						(lv + 1) * LEVEL_H,
						ruined ? 1.5 + ((i * 37) % 7) * 0.14 : 99
					)
					const hgt = yTop - y0
					if (hgt <= 0.05) continue
					const isAttic = lv === 3

					/* the two piers that separate this bay from its neighbours */
					for (const theta of [t0, t1]) {
						const c = at(theta, (R_IN + R_OUT) / 2, 0)
						const tanP = tangent(theta)
						const nrmP = normal(theta)
						const depth = Math.hypot(c[0], c[2]) * (R_OUT - R_IN) * 0.5
						b.frameBox(
							[c[0], y0 + hgt / 2, c[2]],
							nrmP, tanP, [0, 1, 0],
							depth, pierHalf, hgt / 2,
							lv % 2 === 0 ? trav : mixc(trav, travDark, 0.18)
						)
					}

					if (isAttic) {
						/* solid attic storey with small windows */
						const c = at(tm, (R_IN + R_OUT) / 2, 0)
						const depth = Math.hypot(c[0], c[2]) * (R_OUT - R_IN) * 0.5
						b.frameBox([c[0], y0 + hgt / 2, c[2]], nrm, tan, [0, 1, 0], depth, bayArc * 0.5, hgt / 2, travDark)
						const wc = at(tm, R_OUT, 0)
						b.frameBox([wc[0], y0 + hgt * 0.52, wc[2]], nrm, tan, [0, 1, 0], 0.1, bayArc * 0.12, hgt * 0.18, hex('#4a4132'))
						continue
					}

					/* arch opening: masonry above a semicircular head */
					const spring = y0 + hgt * 0.46
					const archR = bayArc * 0.29
					const apex = Math.min(yTop - 0.1, spring + archR)
					const faceC = at(tm, R_OUT - 0.1, 0)
					const depthFace = Math.hypot(faceC[0], faceC[2]) * 0.12
					for (let k = 0; k < 7; k += 1) {
						const a0 = (Math.PI * k) / 7
						const a1 = (Math.PI * (k + 1)) / 7
						const arc = (a) => {
							const c = at(tm, R_OUT - 0.1, 0)
							const off = Math.cos(a) * archR
							return [c[0] + tan[0] * off, spring + Math.sin(a) * archR, c[2] + tan[2] * off]
						}
						b.strut(arc(a0), arc(a1), 0.2, 0.22, travLit)
					}
					/* spandrel above the arch head */
					if (yTop - apex > 0.06) {
						b.frameBox([faceC[0], (apex + yTop) / 2, faceC[2]], nrm, tan, [0, 1, 0], depthFace, bayArc * 0.42, (yTop - apex) / 2, trav)
					}
					/* impost band at the spring line */
					b.frameBox([faceC[0], spring, faceC[2]], nrm, tan, [0, 1, 0], depthFace * 1.2, bayArc * 0.4, 0.06, travLit)
				}
			}

			/* top cornice */
			for (let i = 0; i < BAYS; i += 1) {
				if (i >= RUIN_FROM && i <= RUIN_TO) continue
				const t0 = (i / BAYS) * Math.PI * 2
				const t1 = ((i + 1) / BAYS) * Math.PI * 2
				const tm = (t0 + t1) / 2
				const tan = tangent(tm)
				const nrm = normal(tm)
				const c = at(tm, R_OUT - 0.06, 0)
				const bayArc = (Math.PI * 2 * Math.hypot(c[0], c[2])) / BAYS
				b.frameBox([c[0], 4 * LEVEL_H + 0.09, c[2]], nrm, tan, [0, 1, 0], Math.hypot(c[0], c[2]) * 0.12, bayArc * 0.52, 0.09, travLit)
			}

			return { main: b.finish() }
		}

		/* ------------------------------------------------------------------ *
		 * Landmark registry
		 * ------------------------------------------------------------------ */
		const MODELS = {
			/* Only the opening angles are hand-set. Where the camera sits, what it
			 * looks at and how big the ground disc is all follow the built geometry,
			 * so a taller or longer model cannot end up cropped. */
			eiffel: { build: buildEiffel, yaw: 0.66, pitch: 0.2 },
			wall: { build: buildWall, yaw: 0.42, pitch: 0.34 },
			palace: { build: buildPalace, yaw: 0.52, pitch: 0.3 },
			colosseum: { build: buildColosseum, yaw: 0.95, pitch: 0.24 }
		}

		/* ------------------------------------------------------------------ *
		 * WebGL renderer
		 * ------------------------------------------------------------------ */
		const VERT = [
			'attribute vec3 aPos;',
			'attribute vec3 aNrm;',
			'attribute vec3 aCol;',
			'uniform mat4 uMVP;',
			'uniform mat4 uModel;',
			'uniform mat3 uNormal;',
			'varying vec3 vNrm;',
			'varying vec3 vWorld;',
			'varying vec3 vCol;',
			'void main() {',
			'  vec4 world = uModel * vec4(aPos, 1.0);',
			'  vWorld = world.xyz;',
			'  vNrm = uNormal * aNrm;',
			'  vCol = aCol;',
			'  gl_Position = uMVP * vec4(aPos, 1.0);',
			'}'
		].join('\n')

		const FRAG = [
			'precision mediump float;',
			'varying vec3 vNrm;',
			'varying vec3 vWorld;',
			'varying vec3 vCol;',
			'uniform vec3 uEye;',
			'uniform vec3 uKey;',
			'uniform vec3 uFill;',
			'uniform float uIsGround;',
			'uniform vec2 uShadowC;',
			'uniform float uShadowR;',
			'uniform float uGroundR;',
			'void main() {',
			'  vec3 n = normalize(vNrm);',
			'  if (!gl_FrontFacing) n = -n;',
			'  vec3 v = normalize(uEye - vWorld);',
			'  float hemi = 0.5 + 0.5 * n.y;',
			'  float key = max(dot(n, uKey), 0.0);',
			'  float fill = max(dot(n, uFill), 0.0);',
			'  vec3 c = vCol * (0.26 * hemi + 0.06 + 0.66 * key + 0.2 * fill + 0.12 * max(n.y, 0.0));',
			'  float spec = pow(max(dot(reflect(-uKey, n), v), 0.0), 24.0) * 0.09;',
			'  c += vec3(spec);',
			'  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.07;',
			'  c += vCol * rim;',
			'  float alpha = 1.0;',
			'  if (uIsGround > 0.5) {',
			'    float d = length(vWorld.xz - uShadowC);',
			'    c *= mix(0.58, 1.0, smoothstep(0.0, 1.0, d / uShadowR));',
			'    alpha = 1.0 - smoothstep(0.72, 1.0, length(vWorld.xz) / uGroundR);',
			'  }',
			'  gl_FragColor = vec4(pow(max(c, vec3(0.0)), vec3(0.4545)), alpha);',
			'}'
		].join('\n')

		function compile(gl, type, source) {
			const shader = gl.createShader(type)
			gl.shaderSource(shader, source)
			gl.compileShader(shader)
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				const log = gl.getShaderInfoLog(shader)
				gl.deleteShader(shader)
				throw new Error('shader: ' + log)
			}
			return shader
		}

		function createProgram(gl) {
			const program = gl.createProgram()
			const vs = compile(gl, gl.VERTEX_SHADER, VERT)
			const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
			gl.attachShader(program, vs)
			gl.attachShader(program, fs)
			gl.linkProgram(program)
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				throw new Error('link: ' + gl.getProgramInfoLog(program))
			}
			gl.deleteShader(vs)
			gl.deleteShader(fs)
			return program
		}

		function prefersReducedMotion() {
			try {
				return window.matchMedia('(prefers-reduced-motion: reduce)').matches
			} catch (e) {
				return false
			}
		}

		/* Builds the whole scene driver around one canvas. Returns null when the
		 * browser cannot give us a WebGL context. */
		function createScene(canvas, options) {
			const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
			if (!gl) return null

			let program = null
			try {
				program = createProgram(gl)
			} catch (error) {
				// A browser that cannot compile the program gets the fallback note, not a crash.
				return null
			}
			const loc = {
				pos: gl.getAttribLocation(program, 'aPos'),
				nrm: gl.getAttribLocation(program, 'aNrm'),
				col: gl.getAttribLocation(program, 'aCol'),
				mvp: gl.getUniformLocation(program, 'uMVP'),
				model: gl.getUniformLocation(program, 'uModel'),
				normal: gl.getUniformLocation(program, 'uNormal'),
				eye: gl.getUniformLocation(program, 'uEye'),
				key: gl.getUniformLocation(program, 'uKey'),
				fill: gl.getUniformLocation(program, 'uFill'),
				isGround: gl.getUniformLocation(program, 'uIsGround'),
				shadowC: gl.getUniformLocation(program, 'uShadowC'),
				shadowR: gl.getUniformLocation(program, 'uShadowR'),
				groundR: gl.getUniformLocation(program, 'uGroundR')
			}

			const cache = new Map()
			const state = {
				id: null,
				yaw: 0,
				pitch: 0.28,
				dist: 30,
				base: 30,
				target: [0, 2, 0],
				fit: null,
				zoomed: false,
				zoom: 1,
				auto: options.auto !== false,
				anim: 0,
				pause: 0,
				running: true
			}

			let raf = 0
			let last = 0
			let disposed = false
			let width = 0
			let height = 0

			function upload(geo) {
				const make = (data) => {
					const buffer = gl.createBuffer()
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
					gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
					return buffer
				}
				return {
					pos: make(geo.pos),
					nrm: make(geo.nrm),
					col: make(geo.col),
					count: geo.count
				}
			}

			function groundGeo(radius) {
				const b = new Builder()
				b.disc(0, 0, 0, radius, radius, 72, [0.72, 0.7, 0.66])
				return b.finish()
			}

			function fitOf(geo) {
				const pos = geo.pos
				const count = geo.count
				let minX = Infinity
				let maxX = -Infinity
				let minY = Infinity
				let maxY = -Infinity
				let minZ = Infinity
				let maxZ = -Infinity
				for (let i = 0; i < count; i += 1) {
					const x = pos[i * 3]
					const y = pos[i * 3 + 1]
					const z = pos[i * 3 + 2]
					if (x < minX) minX = x
					if (x > maxX) maxX = x
					if (y < minY) minY = y
					if (y > maxY) maxY = y
					if (z < minZ) minZ = z
					if (z > maxZ) maxZ = z
				}
				return {
					center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
					/* horizontal circumradius: unchanged by yaw, so one distance fits every angle */
					halfR: 0.5 * Math.hypot(maxX - minX, maxZ - minZ),
					halfHeight: 0.5 * (maxY - minY)
				}
			}

			function ensure(id) {
				if (cache.has(id)) return cache.get(id)
				const spec = MODELS[id]
				const built = spec.build()
				const fit = fitOf(built.main)
				const groundR = Math.max(4, fit.halfR * 1.55)
				const entry = {
					main: upload(built.main),
					ground: upload(groundGeo(groundR)),
					groundR,
					fit,
					spec
				}
				cache.set(id, entry)
				return entry
			}

			function aspect() {
				return width > 1 && height > 1 ? width / height : 1.35
			}

			/* Distance that keeps the whole model inside the frustum at the current
			 * pitch, whatever the yaw. Recomputed on resize and on a new landmark. */
			function setFittedDistance() {
				if (!state.fit) return
				const tanY = Math.tan((32 * Math.PI) / 360)
				const tanX = tanY * Math.max(0.4, aspect())
				const halfV = state.fit.halfHeight * Math.cos(state.pitch) + state.fit.halfR * Math.abs(Math.sin(state.pitch))
				/* the nearest corner of the model is halfR closer than its centre, so the */
				/* required distance is the frustum bound plus that halfR */
				const distH = state.fit.halfR / tanX + state.fit.halfR
				const distV = halfV / tanY + state.fit.halfR
				const dist = Math.max(distH, distV) * 1.08
				state.base = dist
				state.dist = state.zoomed
					? Math.max(dist * 0.4, Math.min(dist * 2.2, dist * state.zoom))
					: dist
			}

			function resize() {
				const dpr = Math.min(window.devicePixelRatio || 1, 2)
				const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
				const hgt = Math.max(1, Math.round(canvas.clientHeight * dpr))
				if (w === width && hgt === height) return false
				width = w
				height = hgt
				canvas.width = w
				canvas.height = hgt
				setFittedDistance()
				return true
			}

			function bindAttribs(geo) {
				gl.bindBuffer(gl.ARRAY_BUFFER, geo.pos)
				gl.enableVertexAttribArray(loc.pos)
				gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, 0, 0)
				gl.bindBuffer(gl.ARRAY_BUFFER, geo.nrm)
				gl.enableVertexAttribArray(loc.nrm)
				gl.vertexAttribPointer(loc.nrm, 3, gl.FLOAT, false, 0, 0)
				gl.bindBuffer(gl.ARRAY_BUFFER, geo.col)
				gl.enableVertexAttribArray(loc.col)
				gl.vertexAttribPointer(loc.col, 3, gl.FLOAT, false, 0, 0)
			}

			function draw(now) {
				if (disposed) return
				if (!state.id) return
				resize()
				if (width < 2 || height < 2) return

				const entry = ensure(state.id)

				const aspect = width / height
				const fovy = (32 * Math.PI) / 180
				const proj = m4Perspective(fovy, aspect, 0.5, 220)
				const cp = Math.cos(state.pitch)
				const eye = [
					state.target[0] + Math.sin(state.yaw) * cp * state.dist,
					state.target[1] + Math.sin(state.pitch) * state.dist,
					state.target[2] + Math.cos(state.yaw) * cp * state.dist
				]
				const view = m4LookAt(eye, state.target, [0, 1, 0])

				const ease = state.anim >= 1 ? 1 : 1 - Math.pow(1 - state.anim, 3)
				const model = m4Model(0.92 + 0.08 * ease, (1 - ease) * -2.4)
				const mvp = m4Multiply(m4Multiply(proj, view), model)

				gl.viewport(0, 0, width, height)
				gl.clearColor(0, 0, 0, 0)
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
				gl.enable(gl.DEPTH_TEST)
				gl.disable(gl.CULL_FACE)
				gl.enable(gl.BLEND)
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
				gl.useProgram(program)

				gl.uniformMatrix4fv(loc.mvp, false, mvp)
				gl.uniformMatrix4fv(loc.model, false, model)
				gl.uniformMatrix3fv(loc.normal, false, m3FromM4(model))
				gl.uniform3fv(loc.eye, new Float32Array(eye))
				gl.uniform3fv(loc.key, new Float32Array([0.45, 0.72, 0.53]))
				gl.uniform3fv(loc.fill, new Float32Array([-0.62, 0.34, -0.7]))
				gl.uniform1f(loc.groundR, entry.groundR)
				gl.uniform2fv(loc.shadowC, new Float32Array([0, 0]))
				gl.uniform1f(loc.shadowR, entry.groundR * 0.34)

				gl.uniform1f(loc.isGround, 1)
				bindAttribs(entry.ground)
				gl.drawArrays(gl.TRIANGLES, 0, entry.ground.count)

				gl.uniform1f(loc.isGround, 0)
				bindAttribs(entry.main)
				gl.drawArrays(gl.TRIANGLES, 0, entry.main.count)

				gl.flush()
			}

			function step(now) {
				raf = 0
				if (disposed || !state.running) return
				const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
				last = now
				if (state.pause > 0) state.pause = Math.max(0, state.pause - dt)
				if (state.auto && state.pause === 0) state.yaw += dt * 0.14
				if (state.anim < 1) state.anim = Math.min(1, state.anim + dt / 0.55)
				draw(now)
				if (state.auto || state.anim < 1) schedule()
			}

			function schedule() {
				if (raf || disposed || !state.running) return
				raf = requestAnimationFrame(step)
			}

			const observer = typeof ResizeObserver === 'function'
				? new ResizeObserver(() => { if (resize()) schedule() })
				: null
			if (observer) observer.observe(canvas)

			const onVisibility = () => {
				state.running = !document.hidden
				last = 0
				if (state.running) schedule()
			}
			document.addEventListener('visibilitychange', onVisibility)

			function show(id) {
				if (!MODELS[id]) return
				const entry = ensure(id)
				state.id = id
				const spec = MODELS[id]
				state.fit = entry.fit
				state.yaw = spec.yaw
				state.pitch = spec.pitch
				state.target = entry.fit.center.slice()
				state.zoomed = false
				state.zoom = 1
				setFittedDistance()
				state.anim = options.reducedMotion ? 1 : 0
				last = 0
				schedule()
			}

			return {
				show,
				setAuto(value) {
					state.auto = !!value
					last = 0
					schedule()
				},
				reset() {
					if (!state.id) return
					const spec = MODELS[state.id]
					state.yaw = spec.yaw
					state.pitch = spec.pitch
					state.target = state.fit ? state.fit.center.slice() : state.target
					state.zoomed = false
					state.zoom = 1
					setFittedDistance()
					last = 0
					state.pause = 0
					schedule()
				},
				orbit(dx, dy) {
					state.pause = 1.4
					state.yaw -= dx * 0.008
					state.pitch = Math.max(-0.05, Math.min(1.32, state.pitch + dy * 0.006))
					setFittedDistance()
					schedule()
				},
				zoom(factor) {
					if (!state.id) return
					state.zoomed = true
					state.dist = Math.max(state.base * 0.4, Math.min(state.base * 2.2, state.dist * factor))
					state.zoom = state.dist / state.base
					state.pause = 1.4
					schedule()
				},
				refresh() {
					if (resize()) schedule()
				},
				dispose() {
					disposed = true
					if (raf) cancelAnimationFrame(raf)
					if (observer) observer.disconnect()
					document.removeEventListener('visibilitychange', onVisibility)
					for (const entry of cache.values()) {
						for (const key of ['pos', 'nrm', 'col']) gl.deleteBuffer(entry.main[key])
						for (const key of ['pos', 'nrm', 'col']) gl.deleteBuffer(entry.ground[key])
					}
					gl.deleteProgram(program)
					const lose = gl.getExtension('WEBGL_lose_context')
					if (lose) lose.loseContext()
				}
			}
		}

		/* ------------------------------------------------------------------ *
		 * Icons
		 * ------------------------------------------------------------------ */
		function LandmarkIcon(id, size) {
			const common = {
				width: size || 18,
				height: size || 18,
				viewBox: '0 0 24 24',
				fill: 'none',
				stroke: 'currentColor',
				strokeWidth: 1.55,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				'aria-hidden': 'true'
			}
			if (id === 'eiffel') {
				return h('svg', common,
					h('path', { key: 'a', d: 'M12 2.6v3.1' }),
					h('path', { key: 'b', d: 'M12 5.7c-1.5 3.3-3.6 8.2-6.5 12.9' }),
					h('path', { key: 'c', d: 'M12 5.7c1.5 3.3 3.6 8.2 6.5 12.9' }),
					h('path', { key: 'd', d: 'M10.3 10.6h3.4' }),
					h('path', { key: 'e', d: 'M7.7 15.3h8.6' }),
					h('path', { key: 'f', d: 'M4.9 21.2h14.2' })
				)
			}
			if (id === 'wall') {
				return h('svg', common,
					h('path', { key: 'a', d: 'M2.6 19.4c2.6 0 3.4-6 6.2-6 2.6 0 2.2 4.3 4.6 4.3 2.4 0 2.6-6.6 4.6-6.6 1.6 0 2.4 1.8 3.4 1.8' }),
					h('path', { key: 'b', d: 'M6.4 13.4v-2.2M9.4 12.4V10.2M15.2 13.6v-2.2M18.2 12.2V10' })
				)
			}
			if (id === 'palace') {
				return h('svg', common,
					h('path', { key: 'a', d: 'M4 11.2c1.4-.6 2.6-1.4 3.6-2.4L12 4.6l4.4 4.2c1 1 2.2 1.8 3.6 2.4' }),
					h('path', { key: 'b', d: 'M6.6 11.4v7.4h10.8v-7.4' }),
					h('path', { key: 'c', d: 'M3.4 19.2h17.2' }),
					h('path', { key: 'd', d: 'M12 12.4v6.4' })
				)
			}
			return h('svg', common,
				h('path', { key: 'a', d: 'M3.6 20.4V9.6a8.4 5.4 0 0 1 16.8 0v10.8' }),
				h('path', { key: 'b', d: 'M3.6 14.2h16.8' }),
				h('path', { key: 'c', d: 'M7 20.4v-3.4a2 2 0 0 1 4 0v3.4' }),
				h('path', { key: 'd', d: 'M13 20.4v-3.4a2 2 0 0 1 4 0v3.4' })
			)
		}

		/* ------------------------------------------------------------------ *
		 * Styles
		 * ------------------------------------------------------------------ */
		const CSS = `
.l3d-page {
	width: 100%;
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	font-size: 13px;
	line-height: 1.5;
	color: var(--dsw-alias-label-primary);
	background: var(--dsw-alias-bg-base);
	container-type: inline-size;
}
.l3d-head { padding: 28px 12px 14px; }
.l3d-titles { min-width: 0; }
.l3d-title { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
.l3d-sub { margin: 3px 0 0; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.l3d-tabs {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 8px;
	padding: 0 12px 12px;
}
.l3d-tab {
	display: flex;
	align-items: center;
	gap: 9px;
	min-width: 0;
	padding: 8px 10px;
	border-radius: 10px;
	border: 1px solid var(--dsw-alias-border-l2);
	background: var(--dsw-alias-bg-layer-1);
	color: inherit;
	font: inherit;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.16s ease, background 0.16s ease;
}
.l3d-tab:hover { background: var(--dsw-alias-interactive-bg-hover); }
.l3d-tab[aria-pressed="true"] {
	border-color: var(--dsw-alias-brand-primary);
	background: var(--dsw-alias-bg-layer-2);
}
.l3d-tab:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.l3d-tab:disabled { opacity: 0.45; cursor: default; }
.l3d-tab-icon { flex: none; display: flex; color: var(--dsw-alias-label-secondary); }
.l3d-tab[aria-pressed="true"] .l3d-tab-icon { color: var(--dsw-alias-brand-primary); }
.l3d-tab-name { min-width: 0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.l3d-body { flex: 1 1 auto; min-height: 0; display: flex; gap: 12px; padding: 0 12px 12px; overflow: hidden; }
.l3d-stage {
	position: relative;
	flex: 1 1 auto;
	min-width: 0;
	min-height: 150px;
	border-radius: 10px;
	border: 1px solid var(--dsw-alias-border-l2);
	overflow: hidden;
	background:
		radial-gradient(120% 90% at 50% 8%, var(--dsw-alias-bg-layer-2), var(--dsw-alias-bg-layer-1) 62%),
		var(--dsw-alias-bg-layer-1);
}
.l3d-canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: grab; outline: none; }
.l3d-canvas:active { cursor: grabbing; }
.l3d-canvas:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: -2px; }
.l3d-actions { position: absolute; top: 9px; right: 9px; display: flex; gap: 6px; }
.l3d-pill {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 3px 11px;
	border-radius: 999px;
	border: 1px solid var(--dsw-alias-border-l2);
	background: var(--dsw-alias-bg-layer-1);
	color: var(--dsw-alias-label-secondary);
	font: inherit;
	font-size: 12px;
	cursor: pointer;
	white-space: nowrap;
	transition: border-color 0.16s ease, background 0.16s ease, color 0.16s ease;
}
.l3d-pill:hover {
	border-color: var(--dsw-alias-label-secondary);
	background: var(--dsw-alias-interactive-bg-hover);
	color: var(--dsw-alias-label-primary);
}
.l3d-pill[aria-pressed="true"] {
	border-color: var(--dsw-alias-brand-primary);
	color: var(--dsw-alias-brand-primary);
}
.l3d-pill:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
.l3d-dot { width: 5px; height: 5px; border-radius: 999px; background: currentColor; opacity: 0.8; }
.l3d-hint {
	position: absolute;
	left: 9px;
	bottom: 9px;
	max-width: calc(100% - 18px);
	padding: 3px 11px;
	border-radius: 999px;
	background: var(--dsw-alias-bg-layer-1);
	border: 1px solid var(--dsw-alias-border-l2);
	color: var(--dsw-alias-label-secondary);
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	pointer-events: none;
}
.l3d-info { flex: 0 0 262px; min-width: 0; display: flex; flex-direction: column; gap: 10px; overflow: hidden auto; }
.l3d-card {
	background: var(--dsw-alias-bg-layer-1);
	border: 1px solid var(--dsw-alias-border-l2);
	border-radius: 10px;
	padding: 12px 14px;
}
.l3d-info-name { margin: 0; font-size: 15px; font-weight: 600; line-height: 22px; }
.l3d-info-where { margin: 2px 0 0; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.l3d-stats { display: grid; grid-template-columns: minmax(0, 1fr); gap: 7px; margin-top: 12px; }
.l3d-stat { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; min-width: 0; }
.l3d-stat-label { flex: none; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.l3d-stat-value { min-width: 0; font-size: 12.5px; font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.l3d-desc { margin: 0; font-size: 12.5px; line-height: 1.62; }
.l3d-note { margin: 0; font-size: 12px; line-height: 1.55; color: var(--dsw-alias-label-secondary); }
.l3d-failed {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	text-align: center;
	color: var(--dsw-alias-label-secondary);
	font-size: 12.5px;
	line-height: 1.6;
}
@container (max-width: 800px) {
	.l3d-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.l3d-body { flex-direction: column; overflow-y: auto; }
	.l3d-stage { flex: none; height: 320px; min-height: 0; }
	/* a vertical drag here belongs to the page: the stage is the tallest thing on screen */
	.l3d-canvas { touch-action: pan-y; }
	.l3d-info { flex: none; overflow: visible; }
}
@media (prefers-reduced-motion: reduce) {
	.l3d-tab, .l3d-pill { transition: none; }
}
`

		/* ------------------------------------------------------------------ *
		 * Client half
		 * ------------------------------------------------------------------ */
		return {
			inject: ['slots'],
			apply(ctx) {
				let locale = null
				try {
					locale = ctx.locale || ctx.get('locale')
				} catch (error) {
					locale = null
				}

				const t = locale && typeof locale.bind === 'function'
					? locale.bind(NS)
					: (key) => (EN[key] === undefined ? key : EN[key])

				if (locale && typeof locale.register === 'function') {
					ctx.effect(() => locale.register(NS, DICTS), 'landmarks-3d: locale')
				}

				/* The panel owns its stylesheet as a React element: it is mounted with
				 * the panel and removed with it, and nothing is appended to <head>. */
				function LandmarksPanel() {
					const [active, setActive] = React.useState(IDS[0])
					const [coarse] = React.useState(() => typeof window !== 'undefined'
						&& typeof window.matchMedia === 'function'
						&& window.matchMedia('(pointer: coarse)').matches)
					const [auto, setAuto] = React.useState(() => !prefersReducedMotion())
					const [failed, setFailed] = React.useState(false)
					const canvasRef = React.useRef(null)
					const sceneRef = React.useRef(null)

					React.useEffect(() => {
						const canvas = canvasRef.current
						if (!canvas) return undefined
						const scene = createScene(canvas, { auto, reducedMotion: prefersReducedMotion() })
						if (!scene) {
							setFailed(true)
							return undefined
						}
						sceneRef.current = scene
						scene.show(IDS[0])

						/* Native listeners: the wheel handler must not be passive. */
						let drag = null
						const pointers = new Map()
						let pinch = 0
						const twoFingerSpan = () => {
							const [a, b] = Array.from(pointers.values())
							return Math.hypot(a.x - b.x, a.y - b.y)
						}
						const onWheel = (event) => {
							event.preventDefault()
							scene.zoom(event.deltaY > 0 ? 1.08 : 0.93)
						}
						const onDown = (event) => {
							if (event.pointerType === 'mouse' && event.button !== 0) return
							pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
							try { canvas.setPointerCapture(event.pointerId) } catch (error) { /* ignore */ }
							if (pointers.size > 1) {
								/* a second finger means pinch to zoom, not orbit */
								drag = null
								pinch = twoFingerSpan()
								return
							}
							drag = { x: event.clientX, y: event.clientY }
							canvas.style.cursor = 'grabbing'
						}
						const onMove = (event) => {
							if (!pointers.has(event.pointerId)) return
							pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
							if (pointers.size > 1) {
								const span = twoFingerSpan()
								if (pinch > 0 && span > 0) scene.zoom(pinch / span)
								pinch = span
								return
							}
							if (!drag) return
							scene.orbit(event.clientX - drag.x, event.clientY - drag.y)
							drag = { x: event.clientX, y: event.clientY }
						}
						const onUp = (event) => {
							pointers.delete(event.pointerId)
							if (pointers.size < 2) pinch = 0
							try { canvas.releasePointerCapture(event.pointerId) } catch (error) { /* ignore */ }
							canvas.style.cursor = ''
							if (pointers.size === 0) drag = null
						}
						canvas.addEventListener('wheel', onWheel, { passive: false })
						canvas.addEventListener('pointerdown', onDown)
						canvas.addEventListener('pointermove', onMove)
						canvas.addEventListener('pointerup', onUp)
						canvas.addEventListener('pointercancel', onUp)

						return () => {
							canvas.removeEventListener('wheel', onWheel)
							canvas.removeEventListener('pointerdown', onDown)
							canvas.removeEventListener('pointermove', onMove)
							canvas.removeEventListener('pointerup', onUp)
							canvas.removeEventListener('pointercancel', onUp)
							sceneRef.current = null
							scene.dispose()
						}
						// eslint-disable-next-line react-hooks/exhaustive-deps
					}, [])

					React.useEffect(() => {
						if (sceneRef.current) sceneRef.current.show(active)
					}, [active])

					React.useEffect(() => {
						if (sceneRef.current) sceneRef.current.setAuto(auto)
					}, [auto])

				const onKeyDown = (event) => {
						const scene = sceneRef.current
						if (!scene) return
						if (event.key === 'ArrowLeft') scene.orbit(-14, 0)
						else if (event.key === 'ArrowRight') scene.orbit(14, 0)
						else if (event.key === 'ArrowUp') scene.orbit(0, -12)
						else if (event.key === 'ArrowDown') scene.orbit(0, 12)
						else if (event.key === '+' || event.key === '=') scene.zoom(0.92)
						else if (event.key === '-') scene.zoom(1.08)
						else return
						event.preventDefault()
					}

					const name = t(active + 'Name')
					const hintText = t(coarse ? 'hintTouch' : 'hint')
					const stage = h('div', { className: 'l3d-stage' },
						failed
							? h('div', { className: 'l3d-failed', role: 'status' }, t('buildFailed'))
							: h('canvas', {
								ref: canvasRef,
								className: 'l3d-canvas',
								tabIndex: 0,
								role: 'application',
								'aria-label': name + ' — ' + t('canvasLabel'),
								'aria-describedby': 'l3d-hint',
								'aria-keyshortcuts': 'ArrowLeft ArrowRight ArrowUp ArrowDown Plus Minus',
								onKeyDown,
								onDoubleClick: () => sceneRef.current && sceneRef.current.reset()
							}),
						failed ? null : h('div', { className: 'l3d-actions' },
								h('button', {
									type: 'button',
									className: 'l3d-pill',
									'aria-pressed': auto ? 'true' : 'false',
									onClick: () => setAuto((value) => !value)
								},
									h('span', { className: 'l3d-dot', 'aria-hidden': 'true' }),
									h('span', null, t('autoRotate'))
								),
								h('button', {
									type: 'button',
									className: 'l3d-pill',
									onClick: () => sceneRef.current && sceneRef.current.reset()
								}, t('resetView'))
							),
						failed ? null : h('div', { className: 'l3d-hint', id: 'l3d-hint' }, hintText)
					)

					return h('div', { className: 'l3d-page' },
					h('style', { key: 'l3d-css' }, CSS),
						h('div', { className: 'l3d-head' },
							h('div', { className: 'l3d-titles' },
								h('h1', { className: 'l3d-title' }, t('title')),
								h('p', { className: 'l3d-sub' }, t('subtitle'))
							)
						),
						h('div', { className: 'l3d-tabs', role: 'group', 'aria-label': t('title') },
							IDS.map((id) => h('button', {
								key: id,
								type: 'button',
								className: 'l3d-tab',
								'aria-pressed': id === active ? 'true' : 'false',
								disabled: failed,
								onClick: () => setActive(id)
							},
								h('span', { className: 'l3d-tab-icon' }, LandmarkIcon(id)),
								h('span', { className: 'l3d-tab-name' }, t(id + 'Name'))
							))
						),
						h('div', { className: 'l3d-body' },
							stage,
							h('aside', { className: 'l3d-info' },
								h('div', { className: 'l3d-card' },
									h('h2', { className: 'l3d-info-name', 'aria-live': 'polite' }, name),
									h('p', { className: 'l3d-info-where' }, t(active + 'Where')),
									h('div', { className: 'l3d-stats' },
										h('div', { className: 'l3d-stat' },
											h('span', { className: 'l3d-stat-label' }, t(active + 'FA')),
											h('span', { className: 'l3d-stat-value' }, t(active + 'VA'))
										),
										h('div', { className: 'l3d-stat' },
											h('span', { className: 'l3d-stat-label' }, t(active + 'FB')),
											h('span', { className: 'l3d-stat-value' }, t(active + 'VB'))
										),
										h('div', { className: 'l3d-stat' },
											h('span', { className: 'l3d-stat-label' }, t(active + 'FC')),
											h('span', { className: 'l3d-stat-value' }, t(active + 'VC'))
										)
									)
								),
								h('div', { className: 'l3d-card' },
									h('p', { className: 'l3d-desc' }, t(active + 'Desc'))
								),
								h('div', { className: 'l3d-card' },
									h('p', { className: 'l3d-note' }, t('note'))
								)
							)
						)
					)
				}

				const SidebarIcon = (props) => LandmarkIcon('eiffel', props && typeof props.size === 'number' ? props.size : 18)

				ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
					name: 'sidebar.panellist',
					id: PANEL_ID,
					order: 30,
					label: () => t('title'),
					locale: NS
				}, SidebarIcon))

				ctx.slots.inject('main', () => ctx.slots.register({
					name: 'main',
					key: PANEL_ID,
					locale: NS
				}, LandmarksPanel))
			}
		}
	}
})
