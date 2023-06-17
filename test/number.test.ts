import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRandomNumber, generateRandomInteger, generateRandomFloat } from '../src/utils/number';
import { isInteger } from 'lodash-es';

describe('生成随机数', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('生成50-100的随机整数，测试Math.random边界值', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(
            generateRandomNumber({
                min: 50,
                max: 100,
            }),
        ).toBe(50);

        vi.spyOn(Math, 'random').mockReturnValue(0.999999999999999999999);
        expect(
            generateRandomNumber({
                min: 50,
                max: 100,
            }),
        ).toBeLessThanOrEqual(100);

        vi.spyOn(Math, 'random').mockRestore();
        expect(
            isInteger(
                generateRandomNumber({
                    min: 50,
                    max: 100,
                }),
            ),
        ).toBeTruthy();
    });

    it('生成1-100的随机浮点数，小数点保留2位', () => {
        const result = generateRandomNumber({ min: 1, max: 100, decimalPlaces: 2 });

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(2); // Ensure it has 2 decimal places
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
        const result = generateRandomInteger({ min: 1, max: 100 });

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('传入的最小值大于传入的最大值，抛出异常', () => {
        expect(() => generateRandomInteger({ min: 100, max: 50 })).toThrowError('最小值不能大于等于最大值');
    });

    it('传入的最大值和最小值不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomInteger({ min: '1', max: 100 })).toThrowError('参数1不是number类型');
        //@ts-ignore
        expect(() => generateRandomInteger({ min: 1, max: '100' })).toThrowError('参数100不是number类型');
    });
});

describe('生成随机浮点数', () => {
    it('生成1-100的随机浮点数，小数点保留5位', () => {
        const result = generateRandomFloat({ min: 1, max: 100, decimalPlaces: 5 });

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(5); // Ensure it has 5 decimal places
    });

    it('传入的最小值大于传入的最大值，抛出异常', () => {
        expect(() => generateRandomFloat({ min: 100, max: 50, decimalPlaces: 2 })).toThrowError(
            '最小值不能大于等于最大值',
        );
    });

    it('传入的最大值和最小值不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomFloat({ min: '1', max: 100, decimalPlaces: 2 })).toThrowError('参数1不是number类型');
        //@ts-ignore
        expect(() => generateRandomFloat({ min: 1, max: '100', decimalPlaces: 2 })).toThrowError(
            '参数100不是number类型',
        );
    });

    it('传入的保留小数点位数不是数字类型，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomFloat({ min: 1, max: 100, decimalPlaces: '2' })).toThrowError(
            '参数2不是integer类型',
        );
    });

    it('传入的保留小数点位数小于0，抛出异常', () => {
        //@ts-ignore
        expect(() => generateRandomFloat({ min: 1, max: 100, decimalPlaces: -1 })).toThrowError(
            '小数位数必须大于等于0',
        );
    });
});
