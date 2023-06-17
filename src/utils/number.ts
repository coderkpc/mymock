/*
 * @Date: 2023-06-10 09:28:06
 * @LastEditors: Perfecto kepengcheng314@163.com
 * @LastEditTime: 2023-06-17 15:18:18
 */
import { isInteger, isNumber } from 'lodash-es';
import { GenerateRandomFloatOptions, GenerateRandomIntegerOptions, GenerateRandomNumberOptions } from '../types';
import { validateType } from './validate';

/**
 * @description 生成随机数
 * @param {Object} options 参数
 * @returns 随机数
 * @example
 * generateRandomNumber({ min: 1, max: 100, decimalPlaces: 2 }) // 生成50-100随机小数，小数点保留2位
 * generateRandomNumber({ min: 100, max: 200}) // 生成100-200随机整数
 * generateRandomNumber() // 生成1-100随机整数
 */
export function generateRandomNumber(options: GenerateRandomNumberOptions = {}): number {
    let { min = 1, max = 100, decimalPlaces = 0 } = options;

    if (decimalPlaces) {
        return generateRandomFloat({ min, max, decimalPlaces });
    } else {
        return generateRandomInteger({ min, max });
    }
}

/**
 * @description 生成随机整数
 * @param {Object} options 参数
 * @returns
 * @example
 * generateRandomInteger({ min: 100, max: 200}) // 生成100-200随机整数
 */
export function generateRandomInteger({ min, max }: GenerateRandomIntegerOptions): number {
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    validateType('number', min, max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @description 生成随机小数
 * @param {Object} options 参数
 * @returns
 * @example
 * generateRandomFloat({ min: 100, max: 200, decimalPlaces: 10}) // 生成100-200随机小数, 精确到10位小数
 */
export function generateRandomFloat({ min, max, decimalPlaces }: GenerateRandomFloatOptions): number {
    validateType('number', min, max);
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    validateType('integer', decimalPlaces);
    if (decimalPlaces < 0) throw new Error('小数位数必须大于等于0');

    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(decimalPlaces));
}
