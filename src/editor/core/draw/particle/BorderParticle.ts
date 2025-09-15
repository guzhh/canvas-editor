import { EDITOR_PREFIX } from '../../../dataset/constant/Editor'
import { IEditorOption } from '../../../interface/Editor'
import { IElement, IElementPosition } from '../../../interface/Element'
import { RangeManager } from '../../range/RangeManager'
import { Draw } from '../Draw'

export class BorderParticle {
  private options: Required<IEditorOption>
  private draw: Draw
  private range: RangeManager
  private pageRowElementPositions: Map<
    number,
    Map<number, Array<{ element: IElement; position: IElementPosition }>>
  >
  private container: HTMLDivElement
  private borderPopupContainer: HTMLDivElement // border悬浮提示容器

  constructor(draw: Draw) {
    this.draw = draw
    this.options = draw.getOptions()
    this.range = draw.getRange()
    this.container = draw.getContainer()
    this.pageRowElementPositions = new Map()
    this.borderPopupContainer = this._createBorderPopupContainer()
  }

  // 边框悬浮提示容器
  private _createBorderPopupContainer() {
    const popupContainer = document.createElement('div')
    popupContainer.classList.add(`${EDITOR_PREFIX}-border-tip-popup`)
    popupContainer.style.border = `1px solid ${this.options.activateBorder.borderColor}`
    popupContainer.style.color = this.options.activateBorder.color!
    popupContainer.style.backgroundColor = this.options.activateBorder.popupColor!
    popupContainer.style.setProperty('--dot-color', this.options.activateBorder.borderColor!)
    this.container.append(popupContainer)
    return popupContainer
  }

  private drawPopup() {
    if (this.pageRowElementPositions.size > 0) {
      // 拿到第一行
      const firstRow = this.pageRowElementPositions
        .values()
        .next()
        .value?.values()
        .next().value
      const { position, element } = firstRow![0]
      const {
        coordinate: {
          leftTop: [left, top]
        },
        pageNo
      } = position
      const height = this.draw.getHeight() // 页面高度
      const pageGap = this.draw.getPageGap() // 页面间距
      const preY = pageNo * (height + pageGap) // 拿到页面顶部坐标
      this.borderPopupContainer.innerHTML = ''
      if (element.control?.label) {
        this.borderPopupContainer.appendChild(
          Object.assign(document.createElement('p'), {
            textContent: `${element.control?.label}`
          })
        )
      }
      // if (element.control?.placeholder) {
      //   this.borderPopupContainer.appendChild(
      //     Object.assign(document.createElement('p'), {
      //       textContent: `提示：${element.control?.placeholder}`
      //     })
      //   )
      // }
      if (this.borderPopupContainer.children.length > 0) {
        this.borderPopupContainer.style.display = 'block'
        this.borderPopupContainer.style.left = `${left}px`
        this.borderPopupContainer.style.top = `${
          top + preY - this.borderPopupContainer.offsetHeight
        }px`
      }
    }
  }

  public clearBorderPopup() {
    this.borderPopupContainer.style.display = 'none'
  }

  // 计算元素及位置
  public calculateElementPositions() {
    const { startIndex: curIndex } = this.range.getRange()
    this.pageRowElementPositions = new Map()
    const elementList = this.draw.getElementList()
    const element = elementList[curIndex]
    const positionList = this.draw.getPosition().getPositionList()
    // 收集控件所有元素的位置信息
    const elementPositions = []
    if (element && element.control && element.controlId) {
      // 查找整个控件的所有元素
      let startIndex = curIndex
      let endIndex = curIndex
      // 向前查找控件起始位置
      while (
        startIndex > 0 &&
        elementList[startIndex - 1]?.controlId === element.controlId
      ) {
        startIndex--
      }
      // 向后查找控件结束位置
      while (
        endIndex < elementList.length - 1 &&
        elementList[endIndex + 1]?.controlId === element.controlId
      ) {
        endIndex++
      }
      for (let i = startIndex; i <= endIndex; i++) {
        if (positionList[i]) {
          elementPositions.push({
            element: elementList[i],
            position: positionList[i]
          })
        }
      }
    }

    // 按行分组
    this.pageRowElementPositions = new Map<
      number,
      Map<number, Array<{ element: IElement; position: IElementPosition }>>
    >()
    elementPositions.forEach(item => {
      if (!this.pageRowElementPositions.has(item.position.pageNo)) {
        this.pageRowElementPositions.set(item.position.pageNo, new Map())
      }
      if (
        !this.pageRowElementPositions
          .get(item.position.pageNo)
          ?.has(item.position.rowIndex)
      ) {
        this.pageRowElementPositions
          .get(item.position.pageNo)
          ?.set(item.position.rowIndex, [])
      }
      this.pageRowElementPositions
        .get(item.position.pageNo)
        ?.get(item.position.rowIndex)
        ?.push(item)
    })
    Array.from(this.pageRowElementPositions.entries()).forEach(
      ([pageNo, rowMap]) => {
        // 对每页的行进行排序
        this.pageRowElementPositions.set(
          pageNo,
          new Map(
            Array.from(rowMap.entries()).sort(([key1], [key2]) => {
              return key1 - key2
            })
          )
        )
      }
    )

    // 绘制悬浮提示
    this.drawPopup()
  }

  public clearElementPositions() {
    this.pageRowElementPositions = new Map()
    this.clearBorderPopup()
  }

  public render(ctx: CanvasRenderingContext2D, pageNo: number): void {
    if (
      this.pageRowElementPositions.size === 0 ||
      !this.pageRowElementPositions.has(pageNo)
    )
      return
    // 转换为数组并按页码和行索引排序
    const sortedRows = Array.from(
      this.pageRowElementPositions.get(pageNo)!.entries()
    ).map(entry => entry[1])

    ctx.save()
    // ctx.translate(0, 1) // 边框偏移1px
    ctx.lineWidth = this.options.activateBorder.lineWidth!
    ctx.strokeStyle = this.options.activateBorder.borderColor!
    ctx.beginPath()
    // 如果只有一行，使用简单矩形边框
    if (sortedRows.length === 1) {
      const firstItem = sortedRows[0][0]
      const lastItem = sortedRows[0][sortedRows[0].length - 1]
      const x = firstItem.position.coordinate.leftTop[0]
      const y = firstItem.position.coordinate.leftTop[1]
      const width = lastItem.position.coordinate.rightBottom[0] - x
      const height = lastItem.position.coordinate.rightBottom[1] - y
      ctx.rect(x, y, width, height)
      ctx.stroke()
      ctx.restore()
      return
    }
    // 多行边框绘制
    // 处理第一行
    const firstRow = sortedRows[0]
    const firstItem = firstRow[0]
    const firstRowLastItem = firstRow[firstRow.length - 1]
    // 移动到第一行左上角
    ctx.moveTo(
      firstItem.position.coordinate.leftTop[0],
      firstItem.position.coordinate.leftTop[1]
    )
    // 绘制第一行顶边
    ctx.lineTo(
      firstRowLastItem.position.coordinate.rightTop[0],
      firstRowLastItem.position.coordinate.rightTop[1]
    )
    // 绘制左边框连接线（连接所有行的左边框）
    for (let i = 0; i < sortedRows.length; i++) {
      const currentRowFirstItem = sortedRows[i][0]
      const nextRowFirstItem = sortedRows[i + 1]?.[0]

      // 绘制当前行的左边框
      ctx.moveTo(
        currentRowFirstItem.position.coordinate.leftTop[0],
        currentRowFirstItem.position.coordinate.leftTop[1]
      )
      ctx.lineTo(
        currentRowFirstItem.position.coordinate.leftBottom[0],
        currentRowFirstItem.position.coordinate.leftBottom[1]
      )

      if (nextRowFirstItem) {
        // 连接当前行底部和下一行顶部
        ctx.moveTo(
          currentRowFirstItem.position.coordinate.leftBottom[0],
          currentRowFirstItem.position.coordinate.leftBottom[1]
        )
        ctx.lineTo(
          nextRowFirstItem.position.coordinate.leftTop[0],
          nextRowFirstItem.position.coordinate.leftTop[1]
        )
      }
      // 链接当前行右边框和下一行的有边框
      const currentRowLastItem = sortedRows[i][sortedRows[i].length - 1]
      const nextRowLastItem = sortedRows[i + 1]?.[sortedRows[i + 1].length - 1]
      // 绘制当前行的右边框
      ctx.moveTo(
        currentRowLastItem.position.coordinate.rightTop[0],
        currentRowLastItem.position.coordinate.rightTop[1]
      )
      ctx.lineTo(
        currentRowLastItem.position.coordinate.rightBottom[0],
        currentRowLastItem.position.coordinate.rightBottom[1]
      )
      if (nextRowLastItem) {
        ctx.moveTo(
          currentRowLastItem.position.coordinate.rightBottom[0],
          currentRowLastItem.position.coordinate.rightBottom[1]
        )
        ctx.lineTo(
          nextRowLastItem.position.coordinate.rightTop[0],
          nextRowLastItem.position.coordinate.rightTop[1]
        )
      }
    }

    // 绘制最后一行底边
    const lastRow = sortedRows[sortedRows.length - 1]
    const lastItem = lastRow[0]
    const lastRowLastItem = lastRow[lastRow.length - 1]
    // 绘制最后一行底边
    ctx.moveTo(
      lastItem.position.coordinate.leftBottom[0],
      lastItem.position.coordinate.leftBottom[1]
    )
    ctx.lineTo(
      lastRowLastItem.position.coordinate.rightBottom[0],
      lastRowLastItem.position.coordinate.rightBottom[1]
    )

    ctx.stroke()
    ctx.restore()
  }
}
