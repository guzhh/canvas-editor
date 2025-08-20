import JsBarcode from 'jsbarcode'
import { DataImageType } from '../../../../../dataset/enum/DataImage'
import { DataMap } from '../../../../../interface/DataImage'

export const generateBarcodeImage = (data: DataMap[DataImageType.BAR_CODE]) => {
// 定义SVG命名空间URI
  const SVG_NS = 'http://www.w3.org/2000/svg'

  // 创建SVG元素
  const svg = document.createElementNS(SVG_NS, 'svg')

  JsBarcode(svg, data.value, {
    format: 'code128',
    width: 1,
    height: 40,
    fontSize: 15,
    textMargin: 0,
    margin: 2
  })

  // 获取SVG字符串
  const serializer = new XMLSerializer()

  // 计算宽高（单位 px）
  // const rect = svg.getBoundingClientRect()
  const width = Number(svg.getAttribute('width')!.slice(0, -2))
  const height = Number(svg.getAttribute('height')!.slice(0, -2))
  const svgString = serializer.serializeToString(svg)

  return {
    image: `data:image/svg+xml;base64,${btoa(svgString)}`,
    width,
    height,
    mime: 'svg'
  }
}