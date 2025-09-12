// 部分浏览器canvas上下文支持设置以下属性
interface CanvasRenderingContext2D {
  // 控制字符之间的间距, 默认值为0, 正值增加字符间距，负值减少字符间距
  letterSpacing: string
  // 控制单词之间的间距,
  wordSpacing: string
  /**
   * 控制文本渲染的优化方式
   * "auto": 浏览器在绘制文本时根据情况对速度、易读性和几何精确性进行优化。
   * "optimizeSpeed": 浏览器在绘制文本时优先考虑渲染速度，而不是易读性和几何精确性。它禁用字距调整和连字。
   * "optimizeLegibility": 浏览器在绘制文本时优先考虑易读性，而不是渲染速度和几何精确性。这启用了字距调整和可选连字。
   * "geometricPrecision": 浏览器在绘制文本时优先考虑几何精确性，而不是渲染速度和易读性
   */
  textRendering: string
}
