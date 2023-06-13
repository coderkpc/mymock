import { isNumber } from 'lodash-es';
import { GenerateRandomBooleanOptions } from '../types';

/**
 * @description 生成随机布尔值
 * @param {Object} options 参数
 * @returns 随机布尔值
 * @example
 * generateRandomBoolean({ prob: 0.5 }) // 生成true的概率为50%
 * generateRandomBoolean({ prob: 1 }) // 生成true的概率为100%
 */
export function generateRandomBoolean(options: GenerateRandomBooleanOptions = {}) {
    const { prob = 0.5 } = options;
    if (!isNumber(prob) || prob < 0 || prob > 1) throw new Error('概率必须是0-1之间的数字');
    return Math.random() < prob;
}
