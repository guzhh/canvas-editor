import { maxHeightRadioMapping } from '../../../dataset/constant/Common'
import { EditorZone } from '../../../dataset/enum/Editor'
import { DeepRequired } from '../../../interface/Common'
import { IEditorOption } from '../../../interface/Editor'
import { IElement, IElementPosition } from '../../../interface/Element'
import { IRow } from '../../../interface/Row'
import { pickSurroundElementList } from '../../../utils/element'
import { Position } from '../../position/Position'
import { Zone } from '../../zone/Zone'
import { Draw } from '../Draw'

export class Header {
  private draw: Draw
  private position: Position
  private zone: Zone
  private options: DeepRequired<IEditorOption>

  private elementList: IElement[]
  private rowList: IRow[]
  private positionList: IElementPosition[]

  constructor(draw: Draw, data?: IElement[]) {
    this.draw = draw
    this.position = draw.getPosition()
    this.zone = draw.getZone()
    this.options = draw.getOptions()

    this.elementList = data || []
    this.rowList = []
    this.positionList = []
  }

  public getRowList(): IRow[] {
    return this.rowList
  }

  public setElementList(elementList: IElement[]) {
    this.elementList = elementList
  }

  public getElementList(): IElement[] {
    return this.elementList
  }

  public getPositionList(): IElementPosition[] {
    return this.positionList
  }

  public compute() {
    this.recovery()
    this._computeRowList()
    this._computePositionList()
  }

  public recovery() {
    this.rowList = []
    this.positionList = []
  }

  private _computeRowList() {
    const innerWidth = this.draw.getInnerWidth()
    const margins = this.draw.getMargins()
    const surroundElementList = pickSurroundElementList(this.elementList)
    this.rowList = this.draw.computeRowList({
      startX: margins[3],
      startY: this.getHeaderTop(),
      innerWidth,
      elementList: this.elementList,
      surroundElementList
    })
  }

  private _computePositionList() {
    const headerTop = this.getHeaderTop()
    const innerWidth = this.draw.getInnerWidth()
    const margins = this.draw.getMargins()
    const startX = margins[3]
    const startY = headerTop
    this.position.computePageRowPosition({
      positionList: this.positionList,
      rowList: this.rowList,
      pageNo: 0,
      startRowIndex: 0,
      startIndex: 0,
      startX,
      startY,
      innerWidth,
      zone: EditorZone.HEADER
    })
  }

  public getHeaderTop(): number {
    const {
      header: { top, disabled },
      scale
    } = this.options
    if (disabled) return 0
    return Math.floor(top * scale)
  }

  public getMaxHeight(): number {
    const {
      header: { maxHeightRadio }
    } = this.options
    const height = this.draw.getHeight()
    return Math.floor(height * maxHeightRadioMapping[maxHeightRadio])
  }

  public getHeight(): number {
    const maxHeight = this.getMaxHeight()
    const rowHeight = this.getRowHeight() // 获取页眉所有行累计的高度
    return rowHeight > maxHeight ? maxHeight : rowHeight
  }

  public getRowHeight(): number {
    return this.rowList.reduce((pre, cur) => pre + cur.height, 0)
  }

  /**
   * 获取页眉的额外高度
   * 计算逻辑为：页眉上边距 + 实际高 - 页面上边距
   * 如果计算结果小于等于 0，则返回 0
   * @returns 页眉的额外高度
   */
  public getExtraHeight(): number {
    // 获取页面边距，margins[0] 表示页面上边距
    const margins = this.draw.getMargins()
    // 获取页眉内容的实际高度
    const headerHeight = this.getHeight()
    // 获取页眉的上边距
    const headerTop = this.getHeaderTop()
    // 计算页眉的额外高度（这样计算的原因再有 页面上下边距不控制页眉页脚，只控制正文）
    const extraHeight = headerTop + headerHeight - margins[0]
    // 如果额外高度小于等于 0，则返回 0，否则返回计算结果
    return extraHeight <= 0 ? 0 : extraHeight
  }

  public render(ctx: CanvasRenderingContext2D, pageNo: number) {
    ctx.save()
    ctx.globalAlpha = this.zone.isHeaderActive()
      ? 1
      : this.options.header.inactiveAlpha
    const innerWidth = this.draw.getInnerWidth()
    const maxHeight = this.getMaxHeight()
    // 超出最大高度不渲染
    const rowList: IRow[] = []
    let curRowHeight = 0
    for (let r = 0; r < this.rowList.length; r++) {
      const row = this.rowList[r]
      if (curRowHeight + row.height > maxHeight) {
        break
      }
      rowList.push(row)
      curRowHeight += row.height
    }
    this.draw.drawRow(ctx, {
      elementList: this.elementList,
      positionList: this.positionList,
      rowList,
      pageNo,
      startIndex: 0,
      innerWidth,
      zone: EditorZone.HEADER
    })
    ctx.restore()
  }
}
