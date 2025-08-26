import { DataImageType } from '../dataset/enum/DataImage'

interface MHBase {
  firstYear?: number; // 初潮年龄（岁）
  durationDays?: number; // 持续天数（天）
  durationDays2?: number; // 持续天数（天）
  cycleDays?: number; // 生理周期（天）
  cycleDays2?: number; // 生理周期（天）
}

interface MHWithLastDate extends MHBase {
  lastDate: string; // 末次月经日期
  lastYear?: never; // 确保 lastYear 不存在
}

interface MHWithLastYear extends MHBase {
  lastYear: number; // 闭经年龄（岁）
  lastDate?: never; // 确保 lastDate 不存在
}

// 牙位图
export interface IFDIBase {
  name: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'A' | 'B' | 'C' | 'D' | 'E';
  value: string;
  // E?: string;
  // D?: string;
  // C?: string;
  // B?: string;
  // A?: string;
  // '8'?: string;
  // '7'?: string;
  // '6'?: string;
  // '5'?: string;
  // '4'?: string;
  // '3'?: string;
  // '2'?: string;
  // '1'?: string;
}

export interface IDataImageMap {
  [DataImageType.QR_CODE]: {
    value: string,
  },
  [DataImageType.BAR_CODE]: {
    value: string,
  },
  // 月经史
  [DataImageType.MH]: MHWithLastDate | MHWithLastYear;
  // 胎心位置
  [DataImageType.HR]: {
    1?: boolean, // 肚脐左上位
    2?: boolean, // 肚脐右上位
    3?: boolean, // 腹壁左方
    4?: boolean, // 腹壁右方
    5?: boolean, // 肚脐左下方
    6?: boolean, // 肚脐右下方
  },
  // 牙位图
  [DataImageType.FDI]: {
    '1': IFDIBase[],
    '2': IFDIBase[],
    '3': IFDIBase[],
    '4': IFDIBase[],
  }
}

export interface IDataImage {
  type: DataImageType
  // Data类型和type一一对应
  data: IDataImageMap[DataImageType]
}