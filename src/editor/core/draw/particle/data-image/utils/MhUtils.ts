import { IDataImageMap } from '../../../../../interface/DataImage'
import { DataImageType } from '../../../../../dataset/enum/DataImage'
import { convertStringToBase64 } from '../../../../../utils'

export const generateMenstrualHistoryImage = (data: IDataImageMap[DataImageType.MH]) => {
  const svg = data.lastDate ? `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,170,60" width="170" height="60" type="women">
    <text x="15" y="35" style="text-anchor: middle"> ${data.firstYear ? data.firstYear + '岁' : ''}</text>
    <text x="60" y="20" style="text-anchor: middle; font-size:9pt;"> ${data.durationDays ?? ''}～${data.durationDays2 ?? ''} </text>
    <text x="60" y="50" style="text-anchor: middle; font-size:9pt;"> ${data.cycleDays ?? ''}～${data.cycleDays2 ?? ''} </text>
    <text x="125" y="35" style="text-anchor: middle"> ${data.lastDate ?? ''} </text>
    <line x1="30" y1="30" x2="83" y2="30" style="stroke:rgb(0,0,0);stroke-width:2"></line>
  </svg>
  ` : `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,120,60" width="120" height="60" type="women">
    <text x="15" y="35" style="text-anchor: middle"> ${data.firstYear ? data.firstYear + '岁' : ''} </text>
    <text x="60" y="20" style="text-anchor: middle; font-size:9pt;"> ${data.durationDays ?? ''}～${data.durationDays2 ?? ''} </text>
    <text x="60" y="50" style="text-anchor: middle; font-size:9pt;"> ${data.cycleDays ?? ''}～${data.cycleDays2 ?? ''} </text>
    <text x="100" y="35" style="text-anchor: middle"> ${data.lastYear ? data.lastYear + '岁' : ''} </text>
    <line x1="30" y1="30" x2="83" y2="30" style="stroke:rgb(0,0,0);stroke-width:2"></line>
  </svg>
  `

  // 使用 TextEncoder 处理包含中文的 SVG 字符串
  const base64Svg = convertStringToBase64(svg)

  const parser = new DOMParser()
  // 将svg字符串转为dom
  const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement
  const width = Number(svgElement.getAttribute('width') || 170)
  const height = Number(svgElement.getAttribute('height') || 60)

  return {
    image: `data:image/svg+xml;base64,${base64Svg}`,
    width,
    height,
    mime: 'svg'
  }
}
