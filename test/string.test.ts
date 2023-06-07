import { generateRandomChar, generateRandomString } from '../src/utils/string';
import { describe, it, expect } from 'vitest';

describe('generateRandomChar', () => {
    it('should generate a random character from the specified character pool', () => {
        const charPool = '1234567890';
        const result = generateRandomChar(charPool);

        expect(result).toHaveLength(1);
        expect(charPool.includes(result)).toBeTruthy();
    });

    it('should generate a random character from the specified character pool', () => {
        const charPool = 'abcdefghijklmnopqrstuvwxyz';
        const result = generateRandomChar(charPool);

        expect(result).toHaveLength(1);
        expect(charPool.includes(result)).toBeTruthy();
    });

    it('should generate a random character from the specified character pool', () => {
        const charPool = 'abcdefghijklmnopqrstuvwxyz1234567890';
        const result = generateRandomChar(charPool);

        expect(result).toHaveLength(1);
        expect(charPool.includes(result)).toBeTruthy();
    });

    it('should throw an error for an empty character pool', () => {
        expect(() => generateRandomChar('')).toThrow('字符集不能为空');
    });

    it('should throw an error for a non-string character pool', () => {
        //@ts-ignore
        expect(() => generateRandomChar(123)).toThrow('字符集必须是字符串');
    });
});

describe('generateRandomString', () => {
    it('should generate a random string with the specified character pools and length', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString(pools, ['number', 'letter'], 10);

        expect(result).toHaveLength(10);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('should generate a random string with the specified character pools and default length', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString(pools, ['number', 'letter']);

        expect(result).toHaveLength(10);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('should generate a random string with the specified character pool and length', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString(pools, 'number', 10);

        expect(result).toHaveLength(10);
        expect(result).toMatch(/^[0-9]+$/);
    });

    it('should generate a random string with the specified character pool and length', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString(pools, 'letter', 50);
        expect(result).toHaveLength(50);
        expect(result).toMatch(/^[a-z]+$/);
    });

    it('should generate a random string with all character pools and length', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };
        const result = generateRandomString(pools, 'all', 100);
        expect(result).toHaveLength(100);
        expect(result).toMatch(/^[0-9a-z]+$/);
    });

    it('should throw an error for an invalid character pool', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };

        expect(() => generateRandomString(pools, 'symbol')).toThrow('字符集symbol不存在');
    });

    it('should throw an error for an invalid character pool in an array', () => {
        const pools = { number: '0123456789', letter: 'abcdefghijklmnopqrstuvwxyz' };

        expect(() => generateRandomString(pools, ['symbol'])).toThrow('字符集symbol不存在');
    });
});
