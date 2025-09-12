import { ZERO } from '../../../dataset/constant/Common'
import { ulStyleMapping } from '../../../dataset/constant/List'
import { ElementType } from '../../../dataset/enum/Element'
import { KeyMap } from '../../../dataset/enum/KeyMap'
import { ListStyle, ListType, UlStyle } from '../../../dataset/enum/List'
import { DeepRequired } from '../../../interface/Common'
import { IEditorOption } from '../../../interface/Editor'
import { IElement, IElementPosition } from '../../../interface/Element'
import { IRow, IRowElement } from '../../../interface/Row'
import { getUUID } from '../../../utils'
import { RangeManager } from '../../range/RangeManager'
import { Draw } from '../Draw'

export class ListParticle {
  private draw: Draw
  private range: RangeManager
  private options: DeepRequired<IEditorOption>

  // 非递增样式直接返回默认值
  private readonly UN_COUNT_STYLE_WIDTH = 20
  private readonly MEASURE_BASE_TEXT = '0'
  private readonly LIST_GAP = 10

  constructor(draw: Draw) {
    this.draw = draw
    this.range = draw.getRange()
    this.options = draw.getOptions()
  }

  public setList(listType: ListType | null, listStyle?: ListStyle) {
    const isReadonly = this.draw.isReadonly()
    if (isReadonly) return
    const { startIndex, endIndex } = this.range.getRange()
    if (!~startIndex && !~endIndex) return
    // 需要改变的元素列表
    const changeElementList = this.range.getRangeParagraphElementList()
    if (!changeElementList || !changeElementList.length) return
    // 如果包含列表则设置为取消列表
    const isUnsetList = changeElementList.find(
      el => el.listType === listType && el.listStyle === listStyle
    )
    if (isUnsetList || !listType) {
      this.unsetList()
      return
    }
    // 设置值
    const listId = getUUID()
    changeElementList.forEach(el => {
      el.listId = listId
      el.listType = listType
      el.listStyle = listStyle
    })
    // 光标定位
    const isSetCursor = startIndex === endIndex
    const curIndex = isSetCursor ? endIndex : startIndex
    this.draw.render({ curIndex, isSetCursor })
  }

  public unsetList() {
    const isReadonly = this.draw.isReadonly()
    if (isReadonly) return
    const { startIndex, endIndex } = this.range.getRange()
    if (!~startIndex && !~endIndex) return
    // 需要改变的元素列表
    const changeElementList = this.range
      .getRangeParagraphElementList()
      ?.filter(el => el.listId)
    if (!changeElementList || !changeElementList.length) return
    // 如果列表最后字符不是换行符则需插入换行符
    const elementList = this.draw.getElementList()
    const endElement = elementList[endIndex]
    if (endElement.listId) {
      let start = endIndex + 1
      while (start < elementList.length) {
        const element = elementList[start]
        if (element.value === ZERO && !element.listWrap) break
        if (element.listId !== endElement.listId) {
          this.draw.spliceElementList(elementList, start, 0, [
            {
              value: ZERO
            }
          ])
          break
        }
        start++
      }
    }
    // 取消设置
    changeElementList.forEach(el => {
      delete el.listId
      delete el.listType
      delete el.listStyle
      delete el.listWrap
    })
    // 光标定位
    const isSetCursor = startIndex === endIndex
    const curIndex = isSetCursor ? endIndex : startIndex
    this.draw.render({ curIndex, isSetCursor })
  }

  /**
   * 计算列表样式的宽度
   * @param ctx - Canvas 2D 渲染上下文
   * @param elementList - 元素列表
   * @returns 返回一个 Map，键为列表 ID，值为对应列表样式的宽度
   */
  public computeListStyle(
    ctx: CanvasRenderingContext2D,
    elementList: IElement[]
  ): Map<string, number> {
    // 用于存储列表 ID 和对应列表样式宽度的映射
    const listStyleMap = new Map<string, number>()
    // 当前遍历的起始索引
    let start = 0
    // 当前处理的列表 ID
    let curListId = elementList[start]?.listId
    // 当前列表的元素集合
    let curElementList: IElement[] = []
    // 元素列表的长度
    const elementLength = elementList.length
    // 遍历元素列表
    while (start < elementLength) {
      // 获取当前元素
      const curElement = elementList[start]
      // 如果当前元素属于当前处理的列表，则将其添加到当前列表元素集合中
      if (curListId && curListId === curElement.listId) {
        curElementList.push(curElement)
      } else {
        // 如果当前元素有列表 ID 且与当前处理的列表 ID 不同，说明当前列表结束
        if (curElement.listId && curElement.listId !== curListId) {
          // 列表结束，计算当前列表样式的宽度并存储到映射中
          if (curElementList.length) {
            const width = this.getListStyleWidth(ctx, curElementList)
            listStyleMap.set(curListId!, width)
          }
          // 更新当前处理的列表 ID
          curListId = curElement.listId
          // 初始化新列表的元素集合
          curElementList = curListId ? [curElement] : []
        }
      }
      // 移动到下一个元素
      start++
    }
    // 处理最后一个列表的样式宽度
    if (curElementList.length) {
      const width = this.getListStyleWidth(ctx, curElementList)
      listStyleMap.set(curListId!, width)
    }
    return listStyleMap
  }

  public getListStyleWidth(
    ctx: CanvasRenderingContext2D,
    listElementList: IElement[]
  ): number {
    const { scale, checkbox } = this.options
    const startElement = listElementList[0]
    // 非递增样式返回固定值
    if (
      startElement.listStyle &&
      startElement.listStyle !== ListStyle.DECIMAL
    ) {
      if (startElement.listStyle === ListStyle.CHECKBOX) {
        return (checkbox.width + this.LIST_GAP) * scale
      }
      return this.UN_COUNT_STYLE_WIDTH * scale
    }
    // 计算列表数量
    const count = listElementList.reduce((pre, cur) => {
      if (cur.value === ZERO) {
        pre += 1
      }
      return pre
    }, 0)
    if (!count) return 0
    // 以递增样式最大宽度为准
    const text = `${this.MEASURE_BASE_TEXT.repeat(String(count).length)}${
      KeyMap.PERIOD
    }`
    const textMetrics = ctx.measureText(text)
    return Math.ceil((textMetrics.width + this.LIST_GAP) * scale)
  }

  public drawListStyle(
    ctx: CanvasRenderingContext2D,
    row: IRow,
    position: IElementPosition
  ) {
    const { elementList, offsetX, listIndex, ascent } = row
    const startElement = elementList[0]
    if (startElement.value !== ZERO || startElement.listWrap) return
    // tab width
    let tabWidth = 0
    const { defaultTabWidth, scale, defaultFont, defaultSize } = this.options
    for (let i = 1; i < elementList.length; i++) {
      const element = elementList[i]
      if (element?.type !== ElementType.TAB) break
      tabWidth += defaultTabWidth * scale
    }
    // 列表样式渲染
    const {
      coordinate: {
        leftTop: [startX, startY]
      }
    } = position
    const x = startX - offsetX! + tabWidth
    const y = startY + ascent
    // 复选框样式特殊处理
    if (startElement.listStyle === ListStyle.CHECKBOX) {
      const { width, height, gap } = this.options.checkbox
      const checkboxRowElement: IRowElement = {
        ...startElement,
        checkbox: {
          value: !!startElement.checkbox?.value
        },
        metrics: {
          ...startElement.metrics,
          width: (width + gap * 2) * scale,
          height: height * scale
        }
      }
      this.draw.getCheckboxParticle().render({
        ctx,
        x: x - gap * scale,
        y,
        index: 0,
        row: {
          ...row,
          elementList: [checkboxRowElement, ...row.elementList]
        }
      })
    } else {
      let text = ''
      if (startElement.listType === ListType.UL) {
        text =
          ulStyleMapping[<UlStyle>(<unknown>startElement.listStyle)] ||
          ulStyleMapping[UlStyle.DISC]
      } else {
        text = `${listIndex! + 1}${KeyMap.PERIOD}`
      }
      if (!text) return
      ctx.save()
      ctx.font = `${defaultSize * scale}px ${defaultFont}`
      ctx.fillText(text, x, y)
      ctx.restore()
    }
  }
}
