import { GenerateDataOptions, MockOptions } from 'src/types';
import { generateData } from './mock';

/**
 * @description 生成随机对象
 * @param properties 对象的属性
 * @param options mock参数
 * @returns
 */
export function generateRandomObject(
    properties: {
        [key: string]: string | MockOptions;
    },
    options: GenerateDataOptions<MockOptions>,
) {
    const result: Record<string, any> = {};
    for (const key in properties) {
        // 递归调用generateData方法生成mock数据
        result[key] = generateData({
            ...options,
            template: properties[key],
        });
    }
    return result;
}
