import { generateRandomArray } from './array';
import { generateRandomBoolean } from './boolean';
import { generateRandomDate } from './date';
import { generateRandomNumber } from './number';
import { generateRandomString } from './string';
import { generateRandomTime } from './time';

/**
 * @description 默认mock方法
 *
 */
export const DefaultMockFunction = {
    number: generateRandomNumber,
    string: generateRandomString,
    boolean: generateRandomBoolean,
    date: generateRandomDate,
    time: generateRandomTime,
    array: generateRandomArray,
};
/**
 * @description 默认字符集
 */
export const DefaultCharPools: Record<string, string> = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*()[]',
};

export * from './number';
export * from './string';
export * from './boolean';
export * from './date';
export * from './time';
export * from './array';
export * from './parse';
