/*
 * @Date: 2023-06-17 00:32:40
 * @LastEditors: Perfecto kepengcheng314@163.com
 * @LastEditTime: 2023-06-17 11:51:47
 */
import { ParsedArguments, ParseOptions } from '../types';

/**
 * @description 获取调用mock方法所需的参数
 * @param {Object} options 参数
 * @returns 调用mock方法所需的参数
 * @example
 * parse({ template: 'number|1|100|2' }) // { min: 1, max: 100, decimalPlaces: 2 }
 * parse({ template: 'string|10|number' }) // { length: 10, pool: 'number' }
 * parse({ template: 'boolean|0.5' }) // { prob: 0.5 }
 */
function getParams(options: ParseOptions) {
    const { template, mockFunction } = options;
    const mockFunctions = Object.keys(mockFunction);
    const [type] = template.split('|');

    const parseRules: Record<string, (template: string) => any> = {
        number: getNumberParams,
        string: getStringParams,
        boolean: getBooleanParams,
        date: getDateTimeParams,
        time: getDateTimeParams,
    };

    if (!Object.keys(parseRules).includes(type) && !mockFunctions.includes(type)) {
        // 如果解析出的类型既不在默认类型也不在扩展类型中, 则抛出异常
        throw new Error('模板解析错误');
    }
    return parseRules[type] ? parseRules[type](template) : {};
}
/**
 * @description 解析mock模板
 * @param {Object} options 参数
 * @example 解析后的参数
 * parse({ template: 'number|1-100|2', mockFunction }); // { type: 'number',  params: { min: 1, max: 100, decimalPlaces: 2 } }
 * parse({ template: 'string|5|all', mockFunction }); // { type: 'string',  params: { length: 5, pool: 'all' } }
 * parse({ template: 'string|5|lower', mockFunction }); // { type: 'string',  params: { length: 5, pool: 'lower' } }
 * parse({ template: 'boolean|0.5', mockFunction }); // { type: 'boolean',  params: { prob: 0.5 } }
 * parse({ template: 'date|yyyy-MM-dd', mockFunction }); // { type: 'date',  params: { format: 'yyyy-MM-dd' } }
 * parse({ template: 'time|HH:mm:ss', mockFunction }); // { type: 'time',  params: { format: 'HH:mm:ss' } }
 */
export function parse(options: ParseOptions): ParsedArguments {
    const { template } = options;
    const parsed: ParsedArguments = {
        type: '',
        params: {},
    };

    // 获取类型
    const [type] = template.split('|');
    parsed.type = type;

    // 获取参数并设置默认值
    parsed.params = getParams(options);
    // 返回解析好的参数
    return parsed;
}

export function getNumberParams(template: string) {
    const [_, min, max, decimalPlaces] = template.split('|');
    return {
        min: min ? Number(min) : 1,
        max: max ? Number(max) : 100,
        decimalPlaces: decimalPlaces ? Number(decimalPlaces) : 0,
    };
}

export function getStringParams(template: string) {
    const [_, length, pool] = template.split('|');
    return {
        length: length ? Number(length) : 1,
        pool: pool ? pool.split('.') : 'all',
    };
}
export function getBooleanParams(template: string) {
    const [_, prob] = template.split('|');
    return {
        prob: prob ? Number(prob) : 0.5,
    };
}
export function getDateTimeParams(template: string) {
    const [type, param1] = template.split('|');
    const defaultFormat = type === 'date' ? 'YYYY-MM-DD' : 'hh:mm:ss';

    return {
        format: param1 ? param1 : defaultFormat,
    };
}
