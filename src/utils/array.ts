import { GenerateRandomArrayOptions } from '../types';

/**
 * @description 生成随机数组
 * @param {Object} options 参数
 * @param generator 生成数组元素的函数
 */
export function generateRandomArray(options: GenerateRandomArrayOptions): any[] {
    const { length, generator } = options;
    const result = [];
    for (let i = 0; i < length; i++) {
        const element = generator();
        result.push(element);
    }
    return result;
}
