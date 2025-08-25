import { DataMap } from '../../../../../interface/DataImage'
import { DataImageType } from '../../../../../dataset/enum/DataImage'
import { convertStringToBase64 } from '../../../../../utils'

export const generateFetalHeartbeatLocationImage = (data: DataMap[DataImageType.HR]) => {
  let svg = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0,0,60,60" width="60" height="60" type="fetalHeart">
    <g style="stroke:#000; stroke-width:1">
    <!--中间竖线-->
    <line x1="30" y1="0" x2="30" y2="60"></line>
    <!--最左侧横线-->
    <line x1="0" y1="30" x2="10" y2="30"></line>
    <!--左侧第二列第一个横线-->
    <line x1="15" y1="15" x2="25" y2="15"></line>
    <!--左侧第二列第二个横线-->
    <line x1="15" y1="30" x2="25" y2="30"></line>
    <!--左侧第二列第三个横线-->
    <line x1="15" y1="45" x2="25" y2="45"></line>
    <!--右侧第二列第一个横线-->
    <line x1="35" y1="15" x2="45" y2="15"></line>
    <!--右侧第二列第二个横线-->
    <line x1="35" y1="30" x2="45" y2="30"></line>
    <!--右侧第二列第三个横线-->
    <line x1="35" y1="45" x2="45" y2="45"></line>
    <!--最右侧横线-->
    <line x1="50" y1="30" x2="60" y2="30"></line>
    <!--左侧第二列第一个竖线 【1】-->
<!--    <line x1="20" y1="10" x2="20" y2="20"></line>-->
    <!--右侧第二列第一个竖线 【2】-->
<!--    <line x1="40" y1="10" x2="40" y2="20"></line>-->
    <!--左侧第二列第二个竖线 【3】-->
<!--    <line x1="20" y1="25" x2="20" y2="35"></line>-->
    <!--右侧第二列第二个竖线 【4】-->
<!--    <line x1="40" y1="25" x2="40" y2="35"></line>-->
    <!--左侧第二列第三个竖线 【5】-->
<!--    <line x1="20" y1="40" x2="20" y2="50"></line>-->
    <!--右侧第二列第三个竖线 【6】-->
<!--    <line x1="40" y1="40" x2="40" y2="50"></line>-->
<!--    </g>-->
<!--    </svg>-->
  `

  const keyMap: Record<keyof DataMap[DataImageType.HR], string> = {
    1: `<line x1="20" y1="10" x2="20" y2="20"></line>`,
    2: `<line x1="40" y1="10" x2="40" y2="20"></line>`,
    3: `<line x1="20" y1="25" x2="20" y2="35"></line>`,
    4: `<line x1="40" y1="25" x2="40" y2="35"></line>`,
    5: `<line x1="20" y1="40" x2="20" y2="50"></line>`,
    6: `<line x1="40" y1="40" x2="40" y2="50"></line>`
  }

  Object.keys(data).forEach(key => {
    const k = Number(key) as keyof DataMap[DataImageType.HR]
    if (data[k]) {
      svg += keyMap[k]
    }
  })

  svg = `${svg}</g></svg>`

  // 使用 TextEncoder 处理包含中文的 SVG 字符串
  const base64Svg = convertStringToBase64(svg)

  const parser = new DOMParser()
  // 将svg字符串转为dom
  const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement
  console.info(svgElement, svgElement.getAttribute('height'))
  const width = Number(svgElement.getAttribute('width') || 120)
  const height = Number(svgElement.getAttribute('height') || 60)

  return {
    image: `data:image/svg+xml;base64,${base64Svg}`,
    width,
    height,
    mime: 'svg'
  }
}
