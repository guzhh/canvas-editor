import { IDataImageMap } from '../../../../../interface/DataImage'
import { DataImageType } from '../../../../../dataset/enum/DataImage'
import { convertStringToBase64 } from '../../../../../utils'

export const generateFDIImage = (data: IDataImageMap[DataImageType.FDI]) => {
  // 1 左上
  const tspan1List = data['1'].sort((a, b)=>{
    const isNumA = !isNaN(a.name as any)
    const isNumB = !isNaN(b.name as any)
    // 如果都是数字或都是字母，按字典序倒序排序
    if (isNumA === isNumB) return b.name.localeCompare(a.name)
    // 字母在前，数字在后
    return isNumA ? 1 : -1
  }).map(item => {
    return `${item.name}<tspan style="font-size:10pt" baseline-shift="super"></tspan>`
  })
  // 2 右上
  const tspan2List = data['2'].sort((a, b)=>{
    const isNumA = !isNaN(a.name as any)
    const isNumB = !isNaN(b.name as any)
    // 如果都是数字或都是字母，按字典序排序
    if (isNumA === isNumB) return a.name.localeCompare(b.name)
    // 字母在前，数字在后
    return isNumA ? 1 : -1
  }).map(item => {
    return `${item.name}<tspan style="font-size:10pt" baseline-shift="super"></tspan>`
  })

  // 3 左下
  const tspan3List = data['3'].sort((a, b)=>{
    const isNumA = !isNaN(a.name as any)
    const isNumB = !isNaN(b.name as any)
    // 如果都是数字或都是字母，按字典序倒序排序
    if (isNumA === isNumB) return b.name.localeCompare(a.name)
    // 数字在前，字母在后
    return isNumA ? -1 : 1
  }).map(item => {
    return `${item.name}<tspan style="font-size:10pt" baseline-shift="super"></tspan>`
  })

  // 4 右下
  const tspan4List = data['4'].sort((a, b)=>{
    const isNumA = !isNaN(a.name as any)
    const isNumB = !isNaN(b.name as any)
    // 如果都是数字或都是字母，按字典序排序
    if (isNumA === isNumB) return a.name.localeCompare(b.name)
    // 数字在前，字母在后
    return isNumA ? -1 : 1
  }).map(item => {
    return `${item.name}<tspan style="font-size:10pt" baseline-shift="super"></tspan>`
  })

  const svg = `
  <svg id="1756176074220" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,200,60" width="200" height="60" type="tooth">
    <text x="95" y="25" style="text-anchor: end">
      ${tspan1List.join('')}
    </text>
    <text x="105" y="25" style="text-anchor: start">
      ${tspan2List.join('')}
    </text>
    <text x="95" y="52" style="text-anchor: end">
      ${tspan3List.join('')}
    </text>
    <text x="105" y="52" style="text-anchor: start ">
      ${tspan4List.join('')}
    </text>
    <line x1="0" y1="30" x2="200" y2="30" style="stroke:rgb(0,0,0);stroke-width:2"></line>
    <line x1="100" y1="0" x2="100" y2="60" style="stroke:rgb(0,0,0);stroke-width:2"></line>
  </svg>
  `
  // 使用 TextEncoder 处理包含中文的 SVG 字符串
  const base64Svg = convertStringToBase64(svg)

  const parser = new DOMParser()
  // 将svg字符串转为dom
  const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement
  const width = Number(svgElement.getAttribute('width') || 200)
  const height = Number(svgElement.getAttribute('height') || 60)

  return {
    image: `data:image/svg+xml;base64,${base64Svg}`,
    width,
    height,
    mime: 'svg'
  }
}