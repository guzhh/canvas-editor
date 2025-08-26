import { IDataImageMap } from '../../../../../interface/DataImage'
import { DataImageType } from '../../../../../dataset/enum/DataImage'
import { BrowserQRCodeSvgWriter } from '@zxing/browser'
import { EncodeHintType } from '@zxing/library'

export const generateQrcodeImage = (data: IDataImageMap[DataImageType.QR_CODE]) => {

  const codeWriter = new BrowserQRCodeSvgWriter()
  const hints = new Map<EncodeHintType, any>()
  // 配置默认边距
  hints.set(EncodeHintType.MARGIN, 0)
  // 生成svg元素并增加命名空间
  const svgElement = codeWriter.write(data.value, 128, 128, hints)
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // 获取SVG字符串
  const serializer = new XMLSerializer()

  console.info()
  // 计算宽高（单位 px）
  // const rect = svg.getBoundingClientRect()
  const width = Number(svgElement.getAttribute('width'))
  const height = Number(svgElement.getAttribute('height'))
  const svgString = serializer.serializeToString(svgElement)
  return {
    image: `data:image/svg+xml;base64,${btoa(svgString)}`,
    width,
    height,
    mime: 'svg'
  }
}