import { isInteger, isNumber } from 'lodash-es';
import { NUMBER_TYPE } from 'src/types';

/**
 * @description 生成随机数
 * @param min 最小值 默认1
 * @param max 最大值 默认100
 * @param type 类型 默认整数
 * @param decimalPlaces 小数位数 默认0位
 * @returns 随机数
 * @example
 * generateRandomNumber(50, 100, NUMBER_TYPE.int) // 生成50-100随机整数
 * generateRandomNumber(1, 100, NUMBER_TYPE.float, 2) // 生成1-100随机小数, 精确到2位小数
 * generateRandomNumber(100, 200) // 生成100-200随机整数
 * generateRandomNumber() // 生成1-100随机整数
 */
export function generateRandomNumber(
    min: number = 1,
    max: number = 100,
    type: NUMBER_TYPE = NUMBER_TYPE.int,
    decimalPlaces: number = 0,
): number {
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    if (!isNumber(min) || !isNumber(max)) throw new Error('最小值和最大值必须是数字');
    if (!isInteger(decimalPlaces) && decimalPlaces >= 0) throw new Error('小数位数必须是大于等于0的整数');
    if (type === NUMBER_TYPE.int) {
        return generateRandomInteger(min, max);
    }
    if (type === NUMBER_TYPE.float && decimalPlaces) {
        return generateRandomFloat(min, max, decimalPlaces);
    }
    return generateRandomInteger(min, max);
}

/**
 * @description 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns
 * @example
 * generateRandomInteger(1, 100) // 生成1-100随机整数
 * generateRandomInteger(100, 200) // 生成100-200随机整数
 */
export function generateRandomInteger(min: number, max: number): number {
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    if (!isNumber(min) || !isNumber(max)) throw new Error('最小值和最大值必须是数字');
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description 生成随机小数
 * @param min 最小值
 * @param max 最大值
 * @param decimalPlaces 小数位数
 * @returns
 * @example
 * generateRandomFloat(1, 100, 5) // 生成1-100随机小数, 精确到5位小数
 * generateRandomFloat(100, 200, 10) // 生成100-200随机小数, 精确到10位小数
 */
export function generateRandomFloat(min: number, max: number, decimalPlaces: number): number {
    if (min >= max) throw new Error('最小值不能大于等于最大值');
    if (!isNumber(min) || !isNumber(max)) throw new Error('最小值和最大值必须是数字');
    if (!isInteger(decimalPlaces)) throw new Error('小数位数必须是大于等于0的整数');
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(decimalPlaces));
}
