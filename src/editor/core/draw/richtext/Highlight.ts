import { AbstractRichText } from './AbstractRichText'
import { IEditorOption } from '../../../interface/Editor'
import { Draw } from '../Draw'

export class Highlight extends AbstractRichText {
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    super()
    this.options = draw.getOptions()
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (!this.fillRect.width) return
    const { highlightAlpha } = this.options
    const { x, y, width, height } = this.fillRect
    ctx.save()
    ctx.globalAlpha = highlightAlpha // 设置透明度
    ctx.fillStyle = this.fillColor!
    // 2025年8月14日10:55:31，gzh 为高亮区域添加一个上下的边距
    ctx.fillRect(x, y + 1, width, height - 2)
    ctx.restore()
    this.clearFillInfo()
  }
}
