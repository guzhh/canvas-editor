import { EDITOR_PREFIX } from '../../dataset/constant/Editor'
import { EventBusMap } from '../../interface/EventBus'
import { Draw } from '../draw/Draw'
import { CanvasEvent } from '../event/CanvasEvent'
import { EventBus } from '../event/eventbus/EventBus'
import { pasteByEvent } from '../event/handlers/paste'

export class CursorAgent {
  private draw: Draw
  private container: HTMLDivElement
  private agentCursorDom: HTMLTextAreaElement
  private canvasEvent: CanvasEvent
  private eventBus: EventBus<EventBusMap>

  constructor(draw: Draw, canvasEvent: CanvasEvent) {
    this.draw = draw
    this.container = draw.getContainer()
    this.canvasEvent = canvasEvent
    this.eventBus = draw.getEventBus()
    // 代理光标绘制
    const agentCursorDom = document.createElement('textarea')
    agentCursorDom.autocomplete = 'off' // 禁用自动完成
    agentCursorDom.classList.add(`${EDITOR_PREFIX}-inputarea`)
    agentCursorDom.innerText = ''
    this.container.append(agentCursorDom)
    this.agentCursorDom = agentCursorDom
    // 事件
    // 按下键盘按键时触发
    agentCursorDom.onkeydown = (evt: KeyboardEvent) => this._keyDown(evt)
    // 输入事件
    agentCursorDom.oninput = this._input.bind(this)
    // 粘贴事件
    agentCursorDom.onpaste = (evt: ClipboardEvent) => this._paste(evt)

    // 文本合成系统如 input method editor（即输入法编辑器）
    // 开始新的输入合成时会触发 compositionstart 事件。
    // 例如，当用户使用拼音输入法开始输入汉字时，这个事件就会被触发。
    agentCursorDom.addEventListener(
      'compositionstart',
      this._compositionstart.bind(this)
    )
    // 当文本段落的组成完成或取消时，compositionend 事件将被触发
    // (具有特殊字符的触发，需要一系列键和其他输入，如语音识别或移动中的字词建议)。
    agentCursorDom.addEventListener(
      'compositionend',
      this._compositionend.bind(this)
    )
  }

  public getAgentCursorDom(): HTMLTextAreaElement {
    return this.agentCursorDom
  }

  private _keyDown(evt: KeyboardEvent) {
    this.canvasEvent.keydown(evt)
  }

  private _input(evt: Event) {
    const data = (<InputEvent>evt).data
    if (data) {
      this.canvasEvent.input(data)
    }
    if (this.eventBus.isSubscribe('input')) {
      this.eventBus.emit('input', evt)
    }
  }

  private _paste(evt: ClipboardEvent) {
    const isReadonly = this.draw.isReadonly()
    if (isReadonly) return
    const clipboardData = evt.clipboardData
    if (!clipboardData) return
    pasteByEvent(this.canvasEvent, evt)
    evt.preventDefault()
  }

  private _compositionstart() {
    this.canvasEvent.compositionstart()
  }

  private _compositionend(evt: CompositionEvent) {
    this.canvasEvent.compositionend(evt)
  }
}
