export interface MockOptions {
  [key: string]: any;
}

export enum DATA_TYPE {
  number,
  string,
  boolean,
  date,
  time,
  array,
  object,
}

export type CHAR_POOL = 'lower' | 'upper' | 'number' | 'symbol' | 'all';

export type DATA_RULE = any;

export interface ParseFuncReturnType {
  type: keyof typeof DATA_TYPE;
  rule: DATA_RULE;
}
