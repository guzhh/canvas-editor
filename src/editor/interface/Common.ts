export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null

export type Builtin = Primitive | Function | Date | Error | RegExp

// 递归地将类型 T 的所有属性设为必选属性
export type DeepRequired<T> = T extends Error
  ? Required<T>
  : T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<DeepRequired<K>, DeepRequired<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepRequired<K>, DeepRequired<V>>
  : T extends Set<infer U>
  ? Set<DeepRequired<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepRequired<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepRequired<U>>
  : T extends Promise<infer U>
  ? Promise<DeepRequired<U>>
  : T extends {}
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : Required<T>

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type IPadding = [
  top: number,
  right: number,
  bottom: number,
  left: number
]
