import { DefaultCharPools } from './index';
import { GenerateDataOptions, MockOptions } from 'src/types';
import { parse } from './parse';
import { isObject, isString } from 'lodash-es';
import { DefaultMockFunction } from '.';
import { generateRandomObject } from './object';
import { validateType } from './validate';

/**
 * @description 根据模板生成mock数据
 * @param {GenerateDataOptions} options
 * @returns mock数据
 */
export function generateData(options: GenerateDataOptions<string | MockOptions>) {
    const { template } = options;
    if (isString(template)) return generateSimpleData(options as GenerateDataOptions<string>);
    if (isObject(template)) return generateComplexData(options as GenerateDataOptions<MockOptions>);
    throw new Error('模板解析错误');
}

/**
 * @description 生成基本数据类型的mock数据
 * @param {GenerateDataOptions} options
 * @returns mock数据
 */
export function generateSimpleData({
    template,
    mockFunction = DefaultMockFunction,
    charPools = DefaultCharPools,
}: GenerateDataOptions<string>) {
    // 生成基本数据类型的mock数据
    const { type, params } = parse({
        template,
        mockFunction: mockFunction,
        pools: charPools,
    });
    return mockFunction[type](params);
}

/**
 * @description 生成复杂数据类型的mock数据
 * @param {GenerateDataOptions} options
 * @returns mock数据
 */
export function generateComplexData(options: GenerateDataOptions<MockOptions>) {
    const { template, mockFunction = DefaultMockFunction } = options;
    const { type } = template;
    // 判断数组
    if (type === 'array') {
        const { length, generator } = template.params;
        return mockFunction.array({
            length: length,
            generator: generator as () => any,
        });
    }
    // 判断对象
    if (type === 'object') {
        const { properties } = template;
        return generateRandomObject(properties, options);
    }
    throw new Error('模板解析错误');
}
