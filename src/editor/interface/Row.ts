import { RowFlex } from '../dataset/enum/Row'
import { IElement, IElementMetrics } from './Element'

export type IRowElement = IElement & {
  /**
   * 元素的度量信息，包含宽度、高度以及基线上下距离
   * 用于精确计算元素在行内的布局和渲染位置
   */
  metrics: IElementMetrics
  /**
   * 元素的字体样式字符串
   * 格式为："italic bold 16px Arial" 等CSS字体属性格式
   * 用于Canvas绘制时的字体设置
   */
  style: string
  /**
   * 元素相对于行起始位置的左偏移量，以像素为单位
   * 用于处理元素在行内的水平位置调整，如列表缩进、控件对齐等
   * 当元素需要向左偏移显示时使用此属性
   */
  left?: number
}

export interface IRow {
  width: number
  height: number
  ascent: number
  rowFlex?: RowFlex
  startIndex: number
  isPageBreak?: boolean
  isList?: boolean
  listIndex?: number
  offsetX?: number
  offsetY?: number
  elementList: IRowElement[]
  isWidthNotEnough?: boolean
  rowIndex: number
  isSurround?: boolean
}
