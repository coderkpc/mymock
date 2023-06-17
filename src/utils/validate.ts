import { isArray, isBoolean, isEmpty, isFunction, isInteger, isNumber, isObject, isString } from 'lodash-es';

const validateMap: Record<string, Function> = {
    string: isString,
    number: isNumber,
    boolean: isBoolean,
    array: isArray,
    object: isObject,
    function: isFunction,
    integer: isInteger,
};

/**
 * @description 验证参数类型
 * @param type 预期类型
 * @param args  参数
 * @example
 * validateType('string', '1', '2', '3') // 通过
 * validateType('string', '1', 2, '3') // 抛出异常
 */
export function validateType(type: string, ...args: any[]) {
    let errArgs: string[] = [];
    args.forEach(arg => {
        if (!validateMap[type](arg)) {
            errArgs.push(arg);
        }
    });

    if (errArgs.length) {
        throw new Error(`参数${errArgs.join(', ')}不是${type}类型`);
    }
}
