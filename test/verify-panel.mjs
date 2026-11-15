/**
 * client.js 的静态校验，不需要浏览器。
 *
 * - 用假的 __ModuleLoader__ 截获并加载客户端模块
 * - 以可记录的 ctx（slots / locale / effect）调用 apply()
 * - 校验两处槽位注册：sidebar.panellist 与 main，且两边的 id 必须一致
 * - 用最小 React 垫片渲染两个组件并遍历元素树
 * - 校验每个翻译 key 都能解析、每个渲染出的 className 都有对应样式
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// 脚本位于 <仓库>/test/ 下，被测文件是上一级的 client.js
const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(HERE, '..', 'client.js')
const code = readFileSync(SRC, 'utf8')

/* ---------- minimal React shim ---------- */
const ELEMENTS = new Set()
function createElement(type, props, ...children) {
	const el = { type, key: props && props.key !== undefined ? props.key : null, props: { ...(props || {}) } }
	const flat = []
	for (const child of children) {
		if (Array.isArray(child)) flat.push(...child.flat(4).filter((c) => c !== null && c !== undefined && c !== false))
		else if (child !== null && child !== undefined && child !== false) flat.push(child)
	}
	if (flat.length) el.props.children = flat.length === 1 ? flat[0] : flat
	ELEMENTS.add(el)
	return el
}
const React = {
	createElement,
	Fragment: 'fragment',
	useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
	useRef: (init) => ({ current: init === undefined ? null : init }),
	useEffect: () => {},
	useMemo: (fn) => fn(),
	useCallback: (fn) => fn,
}

/* ---------- fake module loader ---------- */
let captured = null
globalThis.window = {
	__ModuleLoader__: {
		load(spec) {
			captured = spec
		},
	},
	devicePixelRatio: 1,
	matchMedia: () => ({ matches: false }),
	addEventListener() {},
	removeEventListener() {},
}
globalThis.document = { addEventListener() {}, removeEventListener() {}, visibilityState: 'visible' }
globalThis.self = globalThis

new Function('window', 'document', code)(globalThis.window, globalThis.document)
if (!captured) throw new Error('module loader was never called')
console.log('module id:', captured.id)

const mod = captured.factory((name) => {
	if (name === 'react') return React
	throw new Error('unexpected require: ' + name)
})

/* ---------- fake ctx ---------- */
const registrations = []
const dictionary = new Map()
const ctx = {
	effect(fn, label) {
		const dispose = fn()
		return typeof dispose === 'function' ? dispose : () => {}
	},
	on() {},
	get(name) {
		throw new Error('ctx.get(' + name + ') is not available')
	},
	slots: {
		inject(name, cb) {
			cb()
			return () => {}
		},
		register(options, component) {
			registrations.push({ options, component })
			return () => {}
		},
	},
	locale: null,
}
ctx.locale = {
	register(namespace, dicts) {
		dictionary.set(namespace, dicts)
		return () => {}
	},
	bind() {
		return (key) => {
			const dicts = dictionary.values().next().value || {}
			const value = (dicts.en || {})[key]
			return value === undefined ? '<<MISSING:' + key + '>>' : value
		}
	},
}

if (!Array.isArray(mod.inject)) throw new Error('module has no inject list')
console.log('inject:', mod.inject.join(', '))
mod.apply(ctx)

/* ---------- assertions ---------- */
const fail = []
const assert = (ok, message) => {
	if (!ok) fail.push(message)
}

const sidebar = registrations.find((r) => r.options.name === 'sidebar.panellist')
const main = registrations.find((r) => r.options.name === 'main')
assert(registrations.length === 2, 'expected exactly 2 registrations, got ' + registrations.length)
assert(!!sidebar, 'no sidebar.panellist registration')
assert(!!main, 'no main registration')
assert(sidebar && sidebar.options.id === main.options.key, 'sidebar id and main key differ')
assert(sidebar && typeof sidebar.options.label === 'function', 'sidebar label is not a thunk')
assert(sidebar && sidebar.options.locale === main.options.locale, 'locale namespaces differ')

const dicts = [...dictionary.values()][0] || {}
for (const lang of ['en', 'zh']) {
	assert(dicts[lang] && Object.keys(dicts[lang]).length > 20, 'dictionary missing or short: ' + lang)
}
const enKeys = Object.keys(dicts.en || {}).sort().join(',')
const zhKeys = Object.keys(dicts.zh || {}).sort().join(',')
assert(enKeys === zhKeys, 'en/zh dictionaries have different keys')

/* render the sidebar icon */
const iconEl = sidebar.component({ size: 18, active: false })
assert(iconEl && iconEl.type === 'svg', 'sidebar icon root is not an svg')

/* render the panel */
const pageEl = main.component({})
assert(pageEl && pageEl.type === 'div', 'panel root is not a div')

const classNames = new Set()
const texts = []
const types = []
let styleText = ''
let canvasProps = null
function walk(node, parentKey) {
	if (node === null || node === undefined || node === false) return
	if (typeof node === 'string' || typeof node === 'number') {
		texts.push(String(node))
		return
	}
	if (Array.isArray(node)) {
		node.forEach((child, index) => walk(child, (parentKey || '') + '/' + index))
		return
	}
	types.push(node.type)
	const props = node.props || {}
	if (typeof props.className === 'string') {
		props.className.split(/\s+/).filter(Boolean).forEach((c) => classNames.add(c))
	}
	if (node.type === 'style') {
		styleText = typeof props.children === 'string' ? props.children : String(props.children || '')
	}
	if (node.type === 'canvas') canvasProps = props
	walk(props.children, (parentKey || '') + '/' + String(props.key || node.type))
}
walk(pageEl)

assert(styleText.length > 500, 'panel does not mount the stylesheet (<style> missing or empty)')
assert(!!canvasProps, 'no <canvas> in the panel')
assert(canvasProps && canvasProps.tabIndex === 0, 'canvas is not keyboard focusable')
assert(canvasProps && typeof canvasProps['aria-label'] === 'string' && canvasProps['aria-label'].length > 4, 'canvas has no accessible name')

const missing = texts.filter((t) => t.includes('<<MISSING:'))
assert(missing.length === 0, 'unresolved translation keys: ' + missing.join(' | '))
const untranslatedMarkers = texts.filter((t) => /^[a-z]+[A-Z]\w+$/.test(t))
assert(untranslatedMarkers.length === 0, 'raw keys rendered as text: ' + untranslatedMarkers.join(', '))

const buttons = []
;(function collect(el) {
	if (!el || typeof el !== 'object') return
	if (Array.isArray(el)) return el.forEach(collect)
	if (el.type === 'button') buttons.push(el.props)
	if (el.props) collect(el.props.children)
})(pageEl)
assert(buttons.length >= 6, 'expected 4 landmark tabs + 2 pill buttons, got ' + buttons.length)
assert(buttons.every((b) => b.type === 'button'), 'a button is missing type="button"')

/* every rendered class must exist in the stylesheet selectors */
const cssClasses = new Set([...styleText.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
const unstyled = [...classNames].filter((c) => !cssClasses.has(c))
assert(unstyled.length === 0, 'rendered classes with no CSS rule: ' + unstyled.join(', '))
const unused = [...cssClasses].filter((c) => !classNames.has(c))
if (unused.length) console.log('note: CSS classes not used in this render:', unused.join(', '))

/* placeholder / lorem checks */
const suspicious = texts.filter((t) => /lorem|TODO|undefined|NaN|\[object/i.test(t))
assert(suspicious.length === 0, 'suspicious rendered text: ' + suspicious.join(' | '))

console.log('registrations:', registrations.map((r) => r.options.name + ':' + (r.options.id || r.options.key)).join(', '))
console.log('dictionary keys:', Object.keys(dicts.en || {}).length, 'en /', Object.keys(dicts.zh || {}).length, 'zh')
console.log('rendered nodes:', types.length, '| classes:', classNames.size, '| buttons:', buttons.length)
console.log('css bytes:', styleText.length)
console.log('sample text:', texts.slice(0, 6).join(' / '))

if (fail.length) {
	console.error('\nFAILED:')
	for (const line of fail) console.error(' - ' + line)
	process.exit(1)
}
console.log('\nOK: static verification passed')
