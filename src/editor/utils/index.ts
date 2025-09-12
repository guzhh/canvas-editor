import { UNICODE_SYMBOL_REG } from '../dataset/constant/Regular'
import { IElementFillRect } from '../interface/Element'

export function debounce<T extends unknown[]>(
  func: (...arg: T) => unknown,
  delay: number
) {
  let timer: number
  return function (this: unknown, ...args: T) {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function throttle<T extends unknown[]>(
  func: (...arg: T) => unknown,
  delay: number
) {
  let lastExecTime = 0
  let timer: number
  return function (this: unknown, ...args: T) {
    const currentTime = Date.now()
    if (currentTime - lastExecTime >= delay) {
      window.clearTimeout(timer)
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        func.apply(this, args)
        lastExecTime = currentTime
      }, delay)
    }
  }
}

export function deepCloneOmitKeys<T, K>(obj: T, omitKeys: (keyof K)[]): T {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let newObj: any = {}
  if (Array.isArray(obj)) {
    newObj = obj.map(item => deepCloneOmitKeys(item, omitKeys))
  } else {
    // prettier-ignore
    (Object.keys(obj) as (keyof K)[]).forEach(key => {
      if (omitKeys.includes(key)) return
      return (newObj[key] = deepCloneOmitKeys((obj[key as unknown as keyof T] ), omitKeys))
    })
  }
  return newObj
}

export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj)
  }
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let newObj: any = {}
  if (Array.isArray(obj)) {
    newObj = obj.map(item => deepClone(item))
  } else {
    // prettier-ignore
    (Object.keys(obj) as (keyof T)[]).forEach(key => {
      return (newObj[key] = deepClone(obj[key]))
    })
  }
  return newObj
}

export function isBody(node: Element): boolean {
  return node && node.nodeType === 1 && node.tagName.toLowerCase() === 'body'
}

/**
 * 在 DOM 树中向上查找满足过滤条件的父节点
 * @param node - 起始查找的节点
 * @param filterFn - 过滤函数，用于判断节点是否符合条件
 * @param includeSelf - 是否将起始节点本身也纳入检查范围
 * @returns 返回满足条件的父节点，如果未找到则返回 null
 */
export function findParent(
  node: Element,
  filterFn: Function,
  includeSelf: boolean
) {
  // 检查起始节点是否存在且不是 body 节点
  if (node && !isBody(node)) {
    // 根据 includeSelf 参数决定从起始节点本身还是其父节点开始查找
    node = includeSelf ? node : (node.parentNode as Element)
    // 循环向上查找父节点
    while (node) {
      // 如果没有过滤函数，或者当前节点满足过滤条件，或者当前节点是 body 节点
      if (!filterFn || filterFn(node) || isBody(node)) {
        // 如果存在过滤函数且当前节点不满足过滤条件但为 body 节点，返回 null，否则返回当前节点
        return filterFn && !filterFn(node) && isBody(node) ? null : node
      }
      // 继续向上查找父节点
      node = node.parentNode as Element
    }
  }
  // 未找到满足条件的节点，返回 null
  return null
}

export function getUUID(): string {
  function S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

/**
 * 将输入的文本拆分为字符数组。
 * 优先使用 Intl.Segmenter 进行字符分割，如果浏览器不支持该 API，则使用正则表达式匹配的方式。
 * @param text - 需要拆分的文本
 * @returns 返回拆分后的字符数组
 */
export function splitText(text: string): string[] {
  // 用于存储拆分后的字符数组
  const data: string[] = []

  // 检查浏览器是否支持 Intl.Segmenter API
  if (Intl.Segmenter) {
    // 创建 Intl.Segmenter 实例
    const segmenter = new Intl.Segmenter()
    // 对输入文本进行字符分割
    const segments = segmenter.segment(text)
    // 遍历分割结果，将每个字符添加到结果数组中
    for (const { segment } of segments) {
      data.push(segment)
    }
  } else {
    // 如果浏览器不支持 Intl.Segmenter，使用正则表达式匹配字符
    // 创建一个 Map 用于存储匹配到的字符及其在文本中的索引
    const symbolMap = new Map<number, string>()
    // 使用正则表达式匹配文本中的所有字符
    for (const match of text.matchAll(UNICODE_SYMBOL_REG)) {
      // 将匹配到的字符及其索引存入 Map 中
      symbolMap.set(match.index!, match[0])
    }
    // 初始化遍历文本的索引
    let t = 0
    // 遍历文本
    while (t < text.length) {
      // 从 Map 中获取当前索引对应的字符
      const symbol = symbolMap.get(t)
      if (symbol) {
        // 如果存在匹配的字符，将其添加到结果数组中
        data.push(symbol)
        // 跳过已匹配字符的长度
        t += symbol.length
      } else {
        // 如果不存在匹配的字符，将当前字符添加到结果数组中
        data.push(text[t])
        // 索引递增 1
        t++
      }
    }
  }
  return data
}

export function downloadFile(href: string, fileName: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = fileName
  a.click()
}

export function threeClick(dom: HTMLElement, fn: (evt: MouseEvent) => any) {
  nClickEvent(3, dom, fn)
}

function nClickEvent(
  n: number,
  dom: HTMLElement,
  fn: (evt: MouseEvent) => any
) {
  let count = 0
  let lastTime = 0

  const handler = function (evt: MouseEvent) {
    const currentTime = new Date().getTime()
    count = currentTime - lastTime < 300 ? count + 1 : 0
    lastTime = new Date().getTime()
    if (count >= n - 1) {
      fn(evt)
      count = 0
    }
  }

  dom.addEventListener('click', handler)
}

export function isObject(type: unknown): type is Record<string, unknown> {
  return Object.prototype.toString.call(type) === '[object Object]'
}

export function isArray(type: unknown): type is Array<unknown> {
  return Array.isArray(type)
}

export function isNumber(type: unknown): type is number {
  return Object.prototype.toString.call(type) === '[object Number]'
}

export function isString(type: unknown): type is string {
  return Object.prototype.toString.call(type) === '[object String]'
}

export function mergeObject<T>(source: T, target: T): T {
  if (isObject(source) && isObject(target)) {
    const objectTarget = <Record<string, unknown>>target
    for (const [key, val] of Object.entries(source)) {
      if (!objectTarget[key]) {
        objectTarget[key] = val
      } else {
        objectTarget[key] = mergeObject(val, objectTarget[key])
      }
    }
  } else if (isArray(source) && isArray(target)) {
    target.push(...source)
  }
  return target
}

export function nextTick(fn: Function) {
  setTimeout(() => {
    fn()
  }, 0)
}

export function convertNumberToChinese(num: number) {
  const chineseNum = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九'
  ]
  const chineseUnit = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿'
  ]
  if (!num || isNaN(num)) return '零'
  const numStr = num.toString().split('')
  let result = ''
  for (let i = 0; i < numStr.length; i++) {
    const desIndex = numStr.length - 1 - i
    result = `${chineseUnit[i]}${result}`
    result = `${chineseNum[Number(numStr[desIndex])]}${result}`
  }
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十')
  result = result.replace(/零+/g, '零')
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万')
  result = result.replace(/亿万/g, '亿')
  result = result.replace(/零+$/, '')
  result = result.replace(/^一十/g, '十')
  return result
}

export function cloneProperty<T>(
  properties: (keyof T)[],
  sourceElement: T,
  targetElement: T
) {
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    const value = sourceElement[property]
    if (value !== undefined) {
      targetElement[property] = value
    } else {
      delete targetElement[property]
    }
  }
}

/**
 * 从给定对象中选取指定键对应的属性，返回一个包含这些属性的新对象。
 * @param object - 源对象，从中选取属性。
 * @param pickKeys - 要选取的属性键数组。
 * @returns 返回一个新对象，仅包含源对象中指定键对应的属性。
 * @typeParam T - 源对象的类型。
 */
export function pickObject<T>(object: T, pickKeys: (keyof T)[]): T {
  // 初始化一个空对象，用于存储选取的属性
  const newObject: T = <T>{}
  // 遍历源对象的所有属性
  for (const key in object) {
    // 检查当前属性键是否在要选取的键数组中
    if (pickKeys.includes(key)) {
      // 如果存在，则将该属性添加到新对象中
      newObject[key] = object[key]
    }
  }
  return newObject
}

export function omitObject<T>(object: T, omitKeys: (keyof T)[]): T {
  const newObject: T = <T>{}
  for (const key in object) {
    if (!omitKeys.includes(key)) {
      newObject[key] = object[key]
    }
  }
  return newObject
}

export function convertStringToBase64(input: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const charArray = Array.from(data, byte => String.fromCharCode(byte))
  const base64 = window.btoa(charArray.join(''))
  return base64
}

export function findScrollContainer(element: HTMLElement) {
  let parent = element.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    const overflowY = style.getPropertyValue('overflow-y')
    if (
      parent.scrollHeight > parent.clientHeight &&
      (overflowY === 'auto' || overflowY === 'scroll')
    ) {
      return parent
    }
    parent = parent.parentElement
  }
  return document.documentElement
}

export function isArrayEqual(arr1: unknown[], arr2: unknown[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  return !arr1.some(item => !arr2.includes(item))
}

export function isObjectEqual(obj1: unknown, obj2: unknown): boolean {
  if (!isObject(obj1) || !isObject(obj2)) return false
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }
  return !obj1Keys.some(key => obj2[key] !== obj1[key])
}

export function isRectIntersect(
  rect1: IElementFillRect,
  rect2: IElementFillRect
): boolean {
  const rect1Left = rect1.x
  const rect1Right = rect1.x + rect1.width
  const rect1Top = rect1.y
  const rect1Bottom = rect1.y + rect1.height
  const rect2Left = rect2.x
  const rect2Right = rect2.x + rect2.width
  const rect2Top = rect2.y
  const rect2Bottom = rect2.y + rect2.height
  if (
    rect1Left > rect2Right ||
    rect1Right < rect2Left ||
    rect1Top > rect2Bottom ||
    rect1Bottom < rect2Top
  ) {
    return false
  }
  return true
}

export function isNonValue(value: unknown): boolean {
  return value === undefined || value === null
}

export function normalizeLineBreak(text: string): string {
  return text.replace(/\r\n|\r/g, '\n')
}
