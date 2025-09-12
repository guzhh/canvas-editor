import { ElementType, IEditorOption, IElement, RenderMode } from '../../..'
import {
  PUNCTUATION_LIST,
  METRICS_BASIS_TEXT
} from '../../../dataset/constant/Common'
import { DeepRequired } from '../../../interface/Common'
import { IRowElement } from '../../../interface/Row'
import { ITextMetrics } from '../../../interface/Text'
import { Draw } from '../Draw'

export interface IMeasureWordResult {
  width: number
  endElement: IElement
}

export class TextParticle {
  private draw: Draw
  private options: DeepRequired<IEditorOption>

  private ctx: CanvasRenderingContext2D
  private curX: number
  private curY: number
  private text: string
  private curStyle: string
  private curColor?: string
  public cacheMeasureText: Map<string, TextMetrics>

  constructor(draw: Draw) {
    this.draw = draw
    this.options = draw.getOptions()
    this.ctx = draw.getCtx()
    this.curX = -1
    this.curY = -1
    this.text = ''
    this.curStyle = ''
    this.cacheMeasureText = new Map()
  }

  /**
   * 测量基准文本的尺寸
   * @param ctx - Canvas 2D绘图上下文
   * @param font - 字体样式
   * @returns 返回基准文本的测量结果
   */
  public measureBasisWord(
    ctx: CanvasRenderingContext2D,
    font: string
  ): ITextMetrics {
    ctx.save()
    ctx.font = font
    // 测量基准文本的尺寸
    const textMetrics = this.measureText(ctx, {
      value: METRICS_BASIS_TEXT
    })
    ctx.restore()
    return textMetrics
  }

  /**
   * 测量连续匹配字符的总宽度，并返回结束元素
   * @param ctx - Canvas 2D绘图上下文
   * @param elementList - 元素列表
   * @param curIndex - 当前起始索引
   * @returns 包含总宽度和结束元素的对象
   */
  public measureWord(
    ctx: CanvasRenderingContext2D,
    elementList: IElement[],
    curIndex: number
  ): IMeasureWordResult {
    const LETTER_REG = this.draw.getLetterReg() // 获取字母正则表达式
    let width = 0 // 初始化总宽度
    let endElement: IElement = elementList[curIndex] // 初始化结束元素为当前索引对应的元素
    let i = curIndex // 初始化循环索引
    // 遍历元素列表，直到列表结束
    while (i < elementList.length) {
      const element = elementList[i]
      // 如果元素类型不是文本，或者元素值不匹配正则表达式，则停止遍历
      if (
        (element.type && element.type !== ElementType.TEXT) ||
        !LETTER_REG.test(element.value)
      ) {
        endElement = element // 更新结束元素
        break
      }
      width += this.measureText(ctx, element).width // 累加当前元素的宽度
      i++
    }
    // 返回总宽度和结束元素
    return {
      width,
      endElement
    }
  }

  /**
   * 测量标点符号宽度
   * @param ctx
   * @param element
   */
  public measurePunctuationWidth(
    ctx: CanvasRenderingContext2D,
    element: IElement
  ): number {
    if (!element || !PUNCTUATION_LIST.includes(element.value)) return 0
    return this.measureText(ctx, element).width
  }

  /**
   * 测量文本
   * @param ctx
   * @param element
   */
  public measureText(
    ctx: CanvasRenderingContext2D,
    element: IElement
  ): ITextMetrics {
    // 优先使用自定义字宽设置
    if (element.width) {
      // 测量指定文本在当前样式下的宽度
      const textMetrics = ctx.measureText(element.value)
      // TextMetrics是类无法解构
      return {
        width: element.width,
        actualBoundingBoxAscent: textMetrics.actualBoundingBoxAscent,
        actualBoundingBoxDescent: textMetrics.actualBoundingBoxDescent,
        actualBoundingBoxLeft: textMetrics.actualBoundingBoxLeft,
        actualBoundingBoxRight: textMetrics.actualBoundingBoxRight,
        fontBoundingBoxAscent: textMetrics.fontBoundingBoxAscent,
        fontBoundingBoxDescent: textMetrics.fontBoundingBoxDescent
      }
    }
    const id = `${element.value}${ctx.font}`
    const cacheTextMetrics = this.cacheMeasureText.get(id)
    if (cacheTextMetrics) {
      return cacheTextMetrics
    }
    const textMetrics = ctx.measureText(element.value)
    this.cacheMeasureText.set(id, textMetrics)
    return textMetrics
  }

  public complete() {
    this._render() // 绘制文字
    this.text = ''
  }

  /**
   * 记录文本元素信息，根据渲染模式和样式变化决定是否立即绘制或累积文本
   * @param ctx - Canvas 2D绘图上下文
   * @param element - 行文本元素
   * @param x - 文本绘制的起始 x 坐标
   * @param y - 文本绘制的起始 y 坐标
   */
  public record(
    ctx: CanvasRenderingContext2D,
    element: IRowElement,
    x: number,
    y: number
  ) {
    // 设置当前的绘图上下文
    this.ctx = ctx
    // 兼容模式立即绘制，不进行文本累积
    if (this.options.renderMode === RenderMode.COMPATIBILITY) {
      // 设置当前绘制的起始坐标
      this._setCurXY(x, y)
      // 设置当前文本内容
      this.text = element.value
      // 设置当前文本样式
      this.curStyle = element.style
      this.curColor = element.color
      // 完成绘制并清空文本缓存
      this.complete()
      return
    }
    // 如果当前没有累积的文本，说明是新一轮绘制，重设起始点
    if (!this.text) {
      // 设置当前绘制的起始坐标
      this._setCurXY(x, y)
    }
    // 当文本样式或颜色发生改变时，完成当前累积文本的绘制并重新开始
    if (
      (this.curStyle && element.style !== this.curStyle) ||
      element.color !== this.curColor
    ) {
      // 完成当前累积文本的绘制并清空文本缓存
      this.complete()
      // 设置新的绘制起始坐标
      this._setCurXY(x, y)
    }
    // 累积文本内容
    this.text += element.value
    // 更新当前文本样式
    this.curStyle = element.style
    // 更新当前文本颜色
    this.curColor = element.color
  }

  private _setCurXY(x: number, y: number) {
    this.curX = x
    this.curY = y
  }

  private _render() {
    if (!this.text || !~this.curX || !~this.curX) return
    this.ctx.save()
    this.ctx.font = this.curStyle
    this.ctx.fillStyle = this.curColor || this.options.defaultColor
    this.ctx.fillText(this.text, this.curX, this.curY)
    this.ctx.restore()
  }
}
