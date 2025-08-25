import { ImageParticle } from '../ImageParticle'
import { DataMap, IDataImage } from '../../../../interface/DataImage'
import { IElement } from '../../../../interface/Element'
import { DataImageType } from '../../../../dataset/enum/DataImage'
import { generateBarcodeImage } from './utils/BarcodeUtils'
import { generateQrcodeImage } from './utils/QrcodeUtils'
import { generateOthersImage } from './utils/OthersUtils'
import { ImageDisplay } from '../../../../dataset/enum/Common'
import { generateMenstrualHistoryImage } from './utils/MhUtils'
import { generateFetalHeartbeatLocationImage } from './utils/HrUtils'

export class DataImageParticle extends ImageParticle {
  // 生成数据图片
  public static dataToImage(data: IDataImage): { image: string, width: number, height: number, mime: string, } {
    if (data.type === DataImageType.BAR_CODE) {
      return generateBarcodeImage(data.data as DataMap[DataImageType.BAR_CODE])
    }
    if (data.type === DataImageType.QR_CODE) {
      return generateQrcodeImage(data.data as DataMap[DataImageType.QR_CODE])
    }
    // 月经史
    if (data.type === DataImageType.MH){
      return generateMenstrualHistoryImage(data.data as DataMap[DataImageType.MH])
    }
    // 胎心位置
    if (data.type === DataImageType.HR){
      return generateFetalHeartbeatLocationImage(data.data as DataMap[DataImageType.HR])
    }
    return generateOthersImage()
  }

  public createFloatImage(element: IElement) {
    super.createFloatImage(element)
    this.floatImage!.src = element.dataImageUrl!
  }

  // 渲染图片
  public render(ctx: CanvasRenderingContext2D, element: IElement, x: number, y: number) {
    const { scale } = this.options
    const width = element.width! * scale
    const height = element.height! * scale

    // 判断图片缓存中是否存在
    const imageCacheKey = JSON.stringify(element.imageData)
    if (this.imageCache.has(imageCacheKey)) {
      const img = this.imageCache.get(imageCacheKey)!
      ctx.drawImage(img, x, y, width, height)
    } else {
      const imageLoadPromise = new Promise((resolve, reject) => {
        const img = new Image()
        img.src = element.dataImageUrl!
        img.onload = () => {
          this.imageCache.set(imageCacheKey, img)
          resolve(element)
          if (element.imgDisplay === ImageDisplay.FLOAT_BOTTOM){
            this.draw.render({
              isCompute: false,
              isSetCursor: false,
              isSubmitHistory: false
            })
          }else {
            ctx.drawImage(img, x, y, width, height)
          }
        }
        img.onerror = error => {
          reject(error)
        }
      })
      this.addImageObserver(imageLoadPromise)
    }
  }
}