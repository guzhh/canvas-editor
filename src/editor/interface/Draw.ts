import { ImageDisplay } from '../dataset/enum/Common'
import { EditorMode, EditorZone } from '../dataset/enum/Editor'
import { IElement, IElementPosition } from './Element'
import { IRow } from './Row'

export interface IDrawOption {
  // 初始绘制元素索引
  curIndex?: number
  // 是否设置光标
  isSetCursor?: boolean
  // 是否提交历史记录
  isSubmitHistory?: boolean
  // 是否重新计算
  isCompute?: boolean
  // 是否懒渲染
  isLazy?: boolean
  // 是否初始化
  isInit?: boolean
  // 是否来源历史记录
  isSourceHistory?: boolean
  // 是否首次渲染
  isFirstRender?: boolean
}

export interface IForceUpdateOption {
  isSubmitHistory?: boolean
}

export interface IDrawImagePayload {
  id?: string
  conceptId?: string
  width: number
  height: number
  value: string
  imgDisplay?: ImageDisplay
  extension?: unknown
}

export interface IDrawRowPayload {
  elementList: IElement[]
  positionList: IElementPosition[]
  rowList: IRow[]
  pageNo: number
  startIndex: number
  innerWidth: number
  zone?: EditorZone
  isDrawLineBreak?: boolean
}

export interface IDrawFloatPayload {
  pageNo: number
  imgDisplays: ImageDisplay[]
}

export interface IDrawPagePayload {
  elementList: IElement[]
  positionList: IElementPosition[]
  rowList: IRow[]
  pageNo: number
}

export interface IPainterOption {
  isDblclick: boolean
}

export interface IGetValueOption {
  pageNo?: number
  extraPickAttrs?: Array<keyof IElement>
}

export type IGetOriginValueOption = Omit<IGetValueOption, 'extraPickAttrs'>

export interface IAppendElementListOption {
  isPrepend?: boolean
  isSubmitHistory?: boolean
}

export interface IGetImageOption {
  pixelRatio?: number
  mode?: EditorMode
}

export interface IComputeRowListPayload {
  // 可用区域宽度
  innerWidth: number
  // 元素列表
  elementList: IElement[]
  // 起始 X 坐标
  startX?: number
  // 起始 Y 坐标
  startY?: number
  // 是否来自表格
  isFromTable?: boolean
  // 是否为分页模式
  isPagingMode?: boolean
  // 页面高度
  pageHeight?: number
  // 主内容区域外部高度
  mainOuterHeight?: number
  // 环绕元素列表
  surroundElementList?: IElement[]
}
