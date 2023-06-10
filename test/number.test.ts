/*
 * @Date: 2023-06-10 09:28:06
 * @LastEditors: coderkpc kepengcheng314@163.com
 * @LastEditTime: 2023-06-10 17:44:30
 */
import { describe, expect, it } from 'vitest';
import { generateRandomNumber, generateRandomInteger, generateRandomFloat } from '../src/utils/number';
import { NUMBER_TYPE } from 'src/types';

describe('生成随机数', () => {
    it('生成50-100的随机整数', () => {
        const result = generateRandomNumber(50, 100, NUMBER_TYPE.int);

        expect(result).toBeGreaterThanOrEqual(50);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('生成1-100的随机浮点数，小数点保留2位', () => {
        const result = generateRandomNumber(1, 100, NUMBER_TYPE.float, 2);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(2); // Ensure it has 2 decimal places
    });

    it('在type为float但是没有设置保留小数位数时，默认生成1-100的随机整数', () => {
        const result = generateRandomNumber(100, 200, NUMBER_TYPE.float);

        expect(result).toBeGreaterThanOrEqual(100);
        expect(result).toBeLessThanOrEqual(200);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('没有传参时，默认生成1-100的随机整数', () => {
        const result = generateRandomNumber();

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });
});

describe('生成随机整数', () => {
    it('生成1-100的整数', () => {
        const result = generateRandomInteger(1, 100);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('传入的最小值大于传入的最大值，抛出异常', () => {
        expect(() => generateRandomInteger(100, 50)).toThrowError('最小值不能大于等于最大值');
    });

    it('传入的最大值和最小值不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomInteger('1', 100)).toThrowError('最小值和最大值必须是数字');
        //@ts-ignore
        expect(() => generateRandomInteger(1, '100')).toThrowError('最小值和最大值必须是数字');
    });
});

describe('生成随机浮点数', () => {
    it('生成1-100的随机浮点数，小数点保留5位', () => {
        const result = generateRandomFloat(1, 100, 5);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(5); // Ensure it has 5 decimal places
    });

    it('传入的最小值大于传入的最大值，抛出异常', () => {
        expect(() => generateRandomFloat(100, 50, 2)).toThrowError('最小值不能大于等于最大值');
    });

    it('传入的最大值和最小值不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomFloat('1', 100, 2)).toThrowError('最小值和最大值必须是数字');
        //@ts-ignore
        expect(() => generateRandomFloat(1, '100', 2)).toThrowError('最小值和最大值必须是数字');
    });

    it('传入的保留小数点位数不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomFloat(1, 100, '2')).toThrowError('小数位数必须是大于等于0的整数');
    });
});
