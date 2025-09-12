import { TextDecorationStyle } from '../dataset/enum/Text'

export interface ITextMetrics {
  /**
   * 文本宽度
   */
  width: number
  /**
   * 从文本基线到顶线的距离
   */
  actualBoundingBoxAscent: number
  /**
   * 从文本基线到底线的距离
   */
  actualBoundingBoxDescent: number
  /**
   * 从水平对齐方式的对齐点到行框最左边的距离
   */
  actualBoundingBoxLeft: number
  /**
   * 从水平对齐方式的对齐点到行框最右边的距离
   */
  actualBoundingBoxRight: number
  /**
   * 从文本基线到行框顶部的距离
   */
  fontBoundingBoxAscent: number
  /**
   * 从文本基线到行框底部的距离
   */
  fontBoundingBoxDescent: number
}

export interface ITextDecoration {
  style?: TextDecorationStyle
}
