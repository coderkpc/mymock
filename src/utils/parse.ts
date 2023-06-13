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
    const [type, param1, param2, param3] = template.split('|');

    const parseRules: Record<string, Function> = {
        number: () => {
            return {
                min: param1 ? Number(param1) : 1,
                max: param2 ? Number(param2) : 100,
                decimalPlaces: param3 ? Number(param3) : 0,
            };
        },
        string: () => {
            return {
                length: param1 ? Number(param1) : 1,
                pool: param2 ? param2.split('.') : 'all',
            };
        },
        boolean: () => {
            return {
                prob: param1 ? Number(param1) : 0.5,
            };
        },
        date: () => {
            return {
                format: param1 ? param1 : 'YYYY-MM-DD',
            };
        },
        time: () => {
            return {
                format: param1 ? param1 : 'hh:mm:ss',
            };
        },
    };

    if (!Object.keys(parseRules).includes(type) && !mockFunctions.includes(type)) {
        // 如果解析出的类型既不在默认类型也不在扩展类型中, 则抛出异常
        throw new Error('Invalid template string');
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
