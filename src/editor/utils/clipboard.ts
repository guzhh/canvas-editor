import { EDITOR_CLIPBOARD } from '../dataset/constant/Editor'
import { DeepRequired } from '../interface/Common'
import { IEditorOption } from '../interface/Editor'
import { IElement } from '../interface/Element'
import { createDomFromElementList, zipElementList } from './element'

export interface IClipboardData {
  text: string
  elementList: IElement[]
}

export function setClipboardData(data: IClipboardData) {
  localStorage.setItem(
    EDITOR_CLIPBOARD,
    JSON.stringify({
      text: data.text,
      elementList: data.elementList
    })
  )
}

export function getClipboardData(): IClipboardData | null {
  const clipboardText = localStorage.getItem(EDITOR_CLIPBOARD)
  return clipboardText ? JSON.parse(clipboardText) : null
}

export function removeClipboardData() {
  localStorage.removeItem(EDITOR_CLIPBOARD)
}

export function writeClipboardItem(
  text: string,
  html: string,
  elementList: IElement[]
) {
  if (!text && !html && !elementList.length) return
  const plainText = new Blob([text], { type: 'text/plain' })
  const htmlText = new Blob([html], { type: 'text/html' })
  if (window.ClipboardItem) {
    // @ts-ignore
    const item = new ClipboardItem({
      [plainText.type]: plainText,
      [htmlText.type]: htmlText
    })
    window.navigator.clipboard.write([item])
  } else {
    const fakeElement = document.createElement('div')
    fakeElement.setAttribute('contenteditable', 'true')
    fakeElement.innerHTML = html
    document.body.append(fakeElement)
    // add new range
    const selection = window.getSelection()
    const range = document.createRange()
    // 增加尾行换行字符避免dom复制缺失
    const br = document.createElement('span')
    br.innerText = '\n'
    fakeElement.append(br)
    // 扩选选区并执行复制
    range.selectNodeContents(fakeElement)
    selection?.removeAllRanges()
    selection?.addRange(range)
    document.execCommand('copy')
    fakeElement.remove()
  }
  // 编辑器结构化数据
  setClipboardData({ text, elementList })
}

export function writeElementList(
  elementList: IElement[],
  options: DeepRequired<IEditorOption>
) {
  const clipboardDom = createDomFromElementList(elementList, options)
  // 写入剪贴板
  document.body.append(clipboardDom)
  const text = clipboardDom.innerText
  // 先追加后移除，否则innerText无法解析换行符
  clipboardDom.remove()
  const html = clipboardDom.innerHTML
  if (!text && !html && !elementList.length) return
  writeClipboardItem(text, html, zipElementList(elementList))
}

/**
 * 检查剪贴板数据中是否包含文件
 * @param clipboardData - DataTransfer 对象，代表剪贴板数据
 * @returns 如果包含文件则返回 true，否则返回 false
 */
export function getIsClipboardContainFile(clipboardData: DataTransfer) {
  // 标记剪贴板中是否包含文件
  let isFile = false
  // 遍历剪贴板中的所有项目
  for (let i = 0; i < clipboardData.items.length; i++) {
    // 获取当前遍历到的剪贴板项目
    const item = clipboardData.items[i]
    // 如果当前项目的类型是文件，则标记为包含文件并跳出循环
    if (item.kind === 'file') {
      isFile = true
      break
    }
  }
  return isFile
}
