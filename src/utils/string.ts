import { isString } from 'lodash-es';

/**
 *
 * @param pools 完整的字符集
 * @param pool 需要使用的字符集
 * @param length 生成的字符串长度
 * @returns 随机字符串
 * @example
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, ['number', 'letter'], 10) // 生成10位数字和字母组成的字符串
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, ['number', 'letter']) // 生成10位数字和字母组成的字符串
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, 'number', 10) // 生成10位数字组成的字符串
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, 'letter', 50) // 生成50位字母组成的字符串
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, 'all', 100) // 生成100位数字和字母组成的字符串
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, 'symbol') // 报错, 字符集symbol不存在
 * generateRandomString({ number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' }, ['symbol']) // 报错, 字符集symbol不存在
 */
export function generateRandomString(
    pools: Record<string, string>,
    pool: string | string[] = 'all',
    length: number = 10,
): string {
    let curPool = '';
    let result = '';

    if (Array.isArray(pool)) {
        // 如果pool是数组，循环拼接字符集
        pool.forEach(item => {
            // 错误先行，不可包含all和不存在的字符集
            if (item === 'all' || !isString(pools[item])) throw new Error(`字符集${item}不存在`);
            curPool += pools[item];
        });
    } else {
        // 错误先行，不可是不存在的字符集
        if (!isString(pools[pool]) && pool !== 'all') throw new Error(`字符集${pool}不存在`);
        if (pool === 'all') {
            // 将所有字符集相连
            curPool = Object.values(pools).join('');
        } else {
            // 使用单个字符集
            curPool = pools[pool];
        }
    }

    // 循环生成随机字符组成随机字符串
    for (let i = 0; i < length; i++) {
        result += generateRandomChar(curPool);
    }
    return result;
}

/**
 * @description 生成随机字符
 * @param charPool 字符集
 * @returns 随机字符
 * @example
 * generateRandomChar('1234567890') // 生成0-9的一个随机字符
 * generateRandomChar('abcdefghijklmnopqrstuvwxyz') // 生成a-z的一个随机字符
 * generateRandomChar('abcdefghijklmnopqrstuvwxyz1234567890') // 生成a-z和0-9的一个随机字符
 * generateRandomChar('') // 报错，字符集不能为空
 * generateRandomChar(123) // 报错，字符集必须是字符串
 */
export function generateRandomChar(charPool: string): string {
    if (!isString(charPool)) throw new Error('字符集必须是字符串');
    if (charPool.length === 0) throw new Error('字符集不能为空');

    return charPool.charAt(Math.floor(Math.random() * charPool.length));
}
