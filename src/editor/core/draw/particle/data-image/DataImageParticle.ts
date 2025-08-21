import { ImageParticle } from '../ImageParticle'
import { IDataImage } from '../../../../interface/DataImage'
import { IElement } from '../../../../interface/Element'
import { DataImageType } from '../../../../dataset/enum/DataImage'
import { generateBarcodeImage } from './utils/BarcodeUtils'
import { generateQrcodeImage } from './utils/QrcodeUtils'
import { generateOthersImage } from './utils/OthersUtils'
import { ImageDisplay } from '../../../../dataset/enum/Common'

export class DataImageParticle extends ImageParticle {
  // 生成数据图片
  public static dataToImage(data: IDataImage): { image: string, width: number, height: number, mime: string, } {
    if (data.type === DataImageType.BAR_CODE) {
      return generateBarcodeImage(data.data)
    }
    if (data.type === DataImageType.QR_CODE) {
      return generateQrcodeImage(data.data)
    }
    // return {
    //   mime: 'jpg',
    //   image: `data:image/jpg;base64,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`,
    //   width: 128,
    //   height: 128
    // }
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