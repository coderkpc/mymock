import { isInteger, isNumber } from 'lodash-es';
import { GenerateRandomFloatOptions, GenerateRandomIntegerOptions, GenerateRandomNumberOptions } from '../types';

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
    if (!isNumber(min) || !isNumber(max)) throw new Error('最小值和最大值必须是数字');
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description 生成随机小数
 * @param {Object} options 参数
 * @returns
 * @example
 * generateRandomFloat({ min: 100, max: 200, decimalPlaces: 10}) // 生成100-200随机小数, 精确到10位小数
 */
export function generateRandomFloat({ min, max, decimalPlaces }: GenerateRandomFloatOptions): number {
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    if (!isNumber(min) || !isNumber(max)) throw new Error('最小值和最大值必须是数字');
    if (!isInteger(decimalPlaces) && decimalPlaces >= 0) throw new Error('小数位数必须是大于等于0的整数');
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(decimalPlaces));
}
