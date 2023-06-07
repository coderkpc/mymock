import { isEmpty, isFunction, isInteger, isObject, isString } from 'lodash-es';
import { MockOptions, NUMBER_TYPE, ParsedArguments } from './types';
import {
    generateRandomArray,
    generateRandomBoolean,
    generateRandomDate,
    generateRandomNumber,
    generateRandomString,
} from './utils';

class Mock {
    /**
     * @private
     * @description 默认字符集
     */
    public CharPools: Record<string, string> = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        number: '0123456789',
        symbol: '!@#$%^&*()[]',
    };

    /**
     * @private
     * @description mock方法
     */
    public mockFunction: Record<string, Function> = {
        number: generateRandomNumber,
        string: generateRandomString,
        boolean: generateRandomBoolean,
        date: generateRandomDate,
        time: generateRandomDate,
        array: generateRandomArray,
    };

    /**
     * @description 扩展默认字符集, 会覆盖已有的字符集
     * @param charPools 字符集
     * @example
     * extendCharPools({
     *    lower: 'abc',
     *    zh_cn: '中文',
     * }); // CharPools.lower = 'abc', CharPools.zh_cn = '中文'
     */
    public extendsCharPools(charPools: Record<string, string>) {
        this.CharPools = {
            ...this.CharPools,
            ...charPools,
        };
    }

    /**
     * @description 扩展mock方法的方法
     * @param key 扩展的方法名
     * @param fn 扩展的函数逻辑
     */
    public extend(key: string, fn: Function) {
        if (isString(key) && typeof fn === 'function') {
            this.mockFunction[key] = fn;
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @description 解析mock模板的方法
     * @param template
     * @example
     * parse('number|1-100|2'); // { type: 'number',  params: { min: 1, max: 100, decimalPlaces: 2 } }
     * parse('string|5|all'); // { type: 'string',  params: { length: 5, pool: 'all' } }
     * parse('string|5|lower'); // { type: 'string',  params: { length: 5, pool: 'lower' } }
     * parse('boolean|0.5'); // { type: 'boolean',  params: { prob: 0.5 } }
     * parse('date|yyyy-MM-dd'); // { type: 'date',  params: { format: 'yyyy-MM-dd' } }
     * parse('time|HH:mm:ss'); // { type: 'time',  params: { format: 'HH:mm:ss' } }
     */
    public parse(template: string): ParsedArguments {
        const parsed: ParsedArguments = {
            type: '',
            params: {},
        };
        const mockFunctions = Object.keys(this.mockFunction);

        // 获取类型
        const [type, param1, param2, param3] = template.split('|');
        parsed.type = type;

        // 获取参数并设置默认值
        if (parsed.type === 'number') {
            parsed.params.min = param1 ? Number(param1) : 1;
            parsed.params.max = param2 ? Number(param2) : 100;
            parsed.params.decimalPlaces = param3 ? Number(param3) : 0;
        } else if (parsed.type === 'string') {
            parsed.params.length = param1 ? Number(param1) : 1;
            parsed.params.pool = param2 ? param2.split('.') : 'all';
        } else if (parsed.type === 'boolean') {
            parsed.params.prob = param1 ? Number(param1) : 0.5;
        } else if (parsed.type === 'date') {
            parsed.params.format = param1 ? param1 : 'YYYY-MM-DD';
        } else if (parsed.type === 'time') {
            parsed.params.format = param1 ? param1 : 'hh:mm:ss';
        } else if (!mockFunctions.includes(parsed.type)) {
            // 如果解析出的类型既不在默认类型也不在扩展类型中, 则抛出异常
            throw new Error('Invalid template string');
        }
        // 返回解析好的参数
        return parsed;
    }

    /**
     * @description 根据模板生成mock数据
     * @param template
     * @returns mock数据
     */
    public template(template: string | MockOptions) {
        if (isString(template)) {
            // 生成基本数据类型的mock数据
            const parsedArguments = this.parse(template);
            if (parsedArguments.type === 'number') {
                return this.mockFunction['number'](
                    parsedArguments.params.min,
                    parsedArguments.params.max,
                    parsedArguments.params.decimalPlaces ? NUMBER_TYPE.float : NUMBER_TYPE.int,
                    parsedArguments.params.decimalPlaces,
                );
            } else if (parsedArguments.type === 'string') {
                return this.mockFunction['string'](
                    this.CharPools,
                    parsedArguments.params.pool,
                    parsedArguments.params.length,
                );
            } else if (parsedArguments.type === 'boolean') {
                return this.mockFunction['boolean'](parsedArguments.params.prob);
            } else if (parsedArguments.type === 'date') {
                return this.mockFunction['date'](parsedArguments.params.format);
            } else if (parsedArguments.type === 'time') {
                return this.mockFunction['time'](parsedArguments.params.format);
            } else if (this.mockFunction[parsedArguments.type]) {
                return this.mockFunction[parsedArguments.type]();
            }
        } else if (isObject(template)) {
            // 生成复杂数据类型的mock数据
            // 判断数组
            if (template.type === 'array' && isInteger(template.params.length) && template.params.length) {
                // 如果构造器是函数, 则调用
                if (isFunction(template.params.generator)) {
                    return this.mockFunction['array'](template.params.length, template.params.generator);
                } else if (isString(template.params.generator)) {
                    // 如果构造器是模板, 则递归解析
                    const result: any[] = [];
                    for (let i = 0; i < template.params.length; i++) {
                        result.push(this.template(template.params.generator));
                    }
                    return result;
                }
                throw new Error('Invalid template array');
            }
            // 判断对象
            else if (template.type === 'object' && !isEmpty(template.properties)) {
                const result: Record<string, any> = {};
                for (const key in template.properties) {
                    result[key] = this.template(template.properties[key]);
                }
                return result;
            }
            throw new Error('Invalid template object');
        }
        throw new Error('Invalid template');
    }
}

export default Mock;
