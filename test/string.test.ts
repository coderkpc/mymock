import { generateRandomChar, generateRandomString } from '../src/utils/string';
import { describe, it, expect } from 'vitest';

describe('生成随机字符', () => {
    it('生成随机字符', () => {
        const charPool = '1234567890asdqwxcqdqwdfgdL:"><?';
        const result = generateRandomChar(charPool);

        expect(result).toHaveLength(1);
        expect(charPool.includes(result)).toBeTruthy();
    });

    it('生成字符时传入空字符串，抛出异常', () => {
        expect(() => generateRandomChar('')).toThrow('字符集不能为空');
    });

    it('生成字符时传入非字符串的参数，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomChar(123)).toThrow('字符集必须是字符串');
    });
});

describe('生成随机字符串', () => {
    it('生成100位包括数字+小写字母的随机字符串', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString({
            pools,
            pool: ['number', 'letter'],
            length: 100,
        });

        expect(result).toHaveLength(100);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('生成包括小写字母的随机字符串，不传长度默认生成10位', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString({
            pools,
            pool: 'letter',
        });

        expect(result).toHaveLength(10);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('生成包括所有给定字符集内容的字符串，长度100位', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString({ pools, pool: 'all', length: 100 });
        expect(result).toHaveLength(100);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('使用不存在的字符集生成字符串，抛出异常', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };

        expect(() => generateRandomString({ pools, pool: 'symbol' })).toThrow('字符集symbol不存在');
    });

    it('使用不存在的多个字符集生成字符串，抛出异常', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };

        expect(() => generateRandomString({ pools, pool: ['symbol', 'zh_CN'] })).toThrow('字符集symbol不存在');
    });
});
