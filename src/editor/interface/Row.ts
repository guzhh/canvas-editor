import { RowFlex } from '../dataset/enum/Row'
import { IElement, IElementMetrics } from './Element'
import { VerticalAlign } from '../dataset/enum/VerticalAlign'

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
  /**
   * 行的总宽度，以像素为单位
   * 表示该行所有元素宽度的累加值
   */
  width: number
  /**
   * 行的高度，以像素为单位
   * 由行内最高元素决定整行高度
   */
  height: number
  /**
   * 行的基线到顶部的距离
   * 用于垂直对齐元素，特别是不同大小的文本和图像
   */
  ascent: number
  /**
   * 行的对齐方式
   * 可选值：左对齐(LEFT)、居中(CENTER)、右对齐(RIGHT)、两端对齐(JUSTIFY)
   * 控制整行内容在可用空间内的水平对齐方式
   */
  rowFlex?: RowFlex

  /**
   * 行的垂直对齐方式
   */
  verticalAlign?: VerticalAlign
  /**
   * 该行第一个元素在整个文档元素列表中的索引
   * 用于定位和引用文档中的具体位置
   */
  startIndex: number
  /**
   * 标识该行是否为分页符
   * 用于处理分页逻辑
   */
  isPageBreak?: boolean
  /**
   * 标识该行是否为列表项
   * 用于特殊处理列表格式
   */
  isList?: boolean
  /**
   * 列表项的索引号
   * 用于生成列表编号或项目符号
   */
  listIndex?: number
  /**
   * 行的水平偏移量，以像素为单位
   * 用于微调行的水平位置，如首行缩进或特殊布局需求
   */
  offsetX?: number
  /**
   * 行的垂直偏移量，以像素为单位
   * 用于调整行的垂直位置
   */
  offsetY?: number
  /**
   * 构成该行的所有元素列表
   * 包含文本、图像、控件等各种类型的元素
   */
  elementList: IRowElement[]
  /**
   * 标识行宽度是否不足
   * 当行内容超过可用宽度时设置为true
   */
  isWidthNotEnough?: boolean
  /**
   * 行在文档中的索引位置
   * 表示这是文档中的第几行
   */
  rowIndex: number
  /**
   * 标识该行是否包含环绕元素（如浮动图片）
   * 影响行的布局计算方式，如需要为环绕元素留出空间
   */
  isSurround?: boolean
}
