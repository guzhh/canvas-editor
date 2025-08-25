import { DataImageType } from '../dataset/enum/DataImage'

interface MHBase {
  firstYear: number; // 初潮年龄（岁）
  durationDays: number; // 持续天数（天）
  durationDays2: number; // 持续天数（天）
  cycleDays: number; // 生理周期（天）
  cycleDays2: number; // 生理周期（天）
}

interface MHWithLastDate extends MHBase {
  lastDate: string; // 末次月经日期
  lastYear?: never; // 确保 lastYear 不存在
}

interface MHWithLastYear extends MHBase {
  lastYear: number; // 闭经年龄（岁）
  lastDate?: never; // 确保 lastDate 不存在
}

export interface DataMap {
  [DataImageType.QR_CODE]: {
    value: string,
  },
  [DataImageType.BAR_CODE]: {
    value: string,
  },
  // 月经史
  [DataImageType.MH]:  MHWithLastDate | MHWithLastYear;
  // 胎心位置
  [DataImageType.HR]: {
    1?: boolean, // 肚脐左上位
    2?: boolean, // 肚脐右上位
    3?: boolean, // 腹壁左方
    4?: boolean, // 腹壁右方
    5?: boolean, // 肚脐左下方
    6?: boolean, // 肚脐右下方
  }
}

export interface IDataImage {
  type: DataImageType
  // Data类型和type一一对应
  data: DataMap[DataImageType]
}