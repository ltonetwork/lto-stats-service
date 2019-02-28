export type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };
export interface Dynamic { [x: string]: any; }