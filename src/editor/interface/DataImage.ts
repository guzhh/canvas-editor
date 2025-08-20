import { DataImageType } from '../dataset/enum/DataImage'

export interface DataMap {
  [DataImageType.QR_CODE]: {
    value: string,
  },
  [DataImageType.BAR_CODE]: {
    value: string,
  }
}

export interface IDataImage {
  type: DataImageType
  // Data类型和type一一对应
  data: DataMap[DataImageType]
}