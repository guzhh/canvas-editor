import { FlexDirection, LocationPosition } from '../dataset/enum/Common'
import {
  ControlType,
  ControlIndentation,
  ControlState
} from '../dataset/enum/Control'
import { EditorZone } from '../dataset/enum/Editor'
import { MoveDirection } from '../dataset/enum/Observer'
import { RowFlex } from '../dataset/enum/Row'
import { IDrawOption } from './Draw'
import { IElement } from './Element'
import { IPositionContext } from './Position'
import { IRange } from './Range'
import { IRow, IRowElement } from './Row'

export interface IValueSet {
  value: string
  code: string
}

export interface IControlSelect {
  code: string | null
  valueSets: IValueSet[]
  // 2025年8月8日17:19:46， 新增支持自定义弹窗，用于用户自己控制弹出层
  isCustomPopup?: boolean
  // 是否允许多选
  isMultiSelect?: boolean
  // 多选时的值分隔符
  multiSelectDelimiter?: string
  // 下拉选择独有的选项配置
  selectExclusiveOptions?: {
    // 是否允许输入
    inputAble?: boolean
  }
}

export interface IControlCheckbox {
  code: string | null
  min?: number
  max?: number
  flexDirection: FlexDirection
  valueSets: IValueSet[]
}

export interface IControlRadio {
  code: string | null
  flexDirection: FlexDirection
  valueSets: IValueSet[],
  // 日期选择独有的选项配置
  dateExclusiveOptions?: {
    // 是否允许输入
    inputAble?: boolean
  }
}

export interface IControlDate {
  // 2025年8月8日17:19:46， 新增支持自定义弹窗，用于用户自己控制弹出层
  isCustomPopup?: boolean
  dateFormat?: string
}

export interface IControlHighlightRule {
  keyword: string
  alpha?: number
  backgroundColor?: string
}

export interface IControlHighlight {
  ruleList: IControlHighlightRule[]
  id?: string
  conceptId?: string
}

export interface IControlRule {
  deletable?: boolean
  disabled?: boolean
  pasteDisabled?: boolean
  hide?: boolean
}

export interface IControlBasic {
  type: ControlType
  value: IElement[] | null
  label?: string // 控件标签
  placeholder?: string
  conceptId?: string
  prefix?: string
  postfix?: string
  minWidth?: number
  underline?: boolean
  border?: boolean
  extension?: unknown
  indentation?: ControlIndentation
  rowFlex?: RowFlex
  preText?: string
  postText?: string
}

export interface IControlStyle {
  font?: string
  size?: number
  bold?: boolean
  highlight?: string
  italic?: boolean
  strikeout?: boolean
}

export type IControl = IControlBasic &
  IControlRule &
  Partial<IControlStyle> &
  Partial<IControlSelect> &
  Partial<IControlCheckbox> &
  Partial<IControlRadio> &
  Partial<IControlDate>

export interface IControlOption {
  placeholderColor?: string
  bracketColor?: string
  prefix?: string
  postfix?: string
  borderWidth?: number
  borderColor?: string
  activeBackgroundColor?: string
  disabledBackgroundColor?: string
  existValueBackgroundColor?: string
  noValueBackgroundColor?: string
}

export interface IControlInitOption {
  index: number
  isTable?: boolean
  trIndex?: number
  tdIndex?: number
  tdValueIndex?: number
}

export interface IControlInitResult {
  newIndex: number
}

export interface IControlInstance {
  setElement(element: IElement): void
  getElement(): IElement
  getValue(context?: IControlContext): IElement[]
  setValue(
    data: IElement[],
    context?: IControlContext,
    options?: IControlRuleOption
  ): number
  keydown(evt: KeyboardEvent): number | null
  cut(): number
}

export interface IControlContext {
  range?: IRange
  elementList?: IElement[]
}

export interface IControlRuleOption {
  isIgnoreDisabledRule?: boolean // 忽略禁用校验规则
  isIgnoreDeletedRule?: boolean // 忽略删除校验规则
  isAddPlaceholder?: boolean // 是否添加占位符
}

export interface IGetControlValueOption {
  id?: string
  conceptId?: string
  areaId?: string
}

export type IGetControlValueResult = (Omit<IControl, 'value'> & {
  value: string | null
  innerText: string | null
  zone: EditorZone
  elementList?: IElement[]
})[]

export interface ISetControlValueOption {
  id?: string
  conceptId?: string
  areaId?: string
  value: string | IElement[] | null
  isSubmitHistory?: boolean
}

export interface ISetControlExtensionOption {
  id?: string
  conceptId?: string
  areaId?: string
  extension: unknown
}

export type ISetControlHighlightOption = IControlHighlight[]

export type ISetControlProperties = {
  id?: string
  conceptId?: string
  areaId?: string
  properties: Partial<Omit<IControl, 'value'>>
  isSubmitHistory?: boolean
}

export type IRepaintControlOption = Pick<
  IDrawOption,
  'curIndex' | 'isCompute' | 'isSubmitHistory' | 'isSetCursor'
>

export interface IControlChangeOption {
  context?: IControlContext
  controlElement?: IElement
  controlValue?: IElement[]
}

export interface INextControlContext {
  positionContext: IPositionContext
  nextIndex: number
}

export interface IInitNextControlOption {
  direction?: MoveDirection
}

export interface ILocationControlOption {
  position: LocationPosition
}

export interface ISetControlRowFlexOption {
  row: IRow
  rowElement: IRowElement
  availableWidth: number
  controlRealWidth: number
}

export interface IControlChangeResult {
  state: ControlState
  control: IControl
  controlId: string
}

export interface IControlContentChangeResult {
  control: IControl
  controlId: string
}

export interface IDestroyControlOption {
  isEmitEvent?: boolean
}

export interface IRemoveControlOption {
  id?: string
  conceptId?: string
}
