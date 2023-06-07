import { isNumber } from 'lodash-es';

/**
 * @description 生成随机布尔值
 * @param prob 生成true的概率
 * @returns 随机布尔值
 * @example
 * generateRandomBoolean(0.5) // 生成true的概率为50%
 * generateRandomBoolean(0.1) // 生成true的概率为10%
 * generateRandomBoolean(0.9) // 生成true的概率为90%
 * generateRandomBoolean(1) // 生成true的概率为100%
 */
export function generateRandomBoolean(prob: number = 0.5) {
    if (!isNumber(prob) || prob < 0 || prob > 1) throw new Error('概率必须是0-1之间的数字');
    return Math.random() < prob;
}
