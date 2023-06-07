import { describe, expect, it } from 'vitest';
import { generateRandomNumber, generateRandomInteger, generateRandomFloat } from '../src/utils/number';
import { NUMBER_TYPE } from 'src/types'; // 替换为你的NUMBER_TYPE路径

describe('generateRandomNumber', () => {
    it('should generate a random integer within the specified range', () => {
        const result = generateRandomNumber(50, 100, NUMBER_TYPE.int);

        expect(result).toBeGreaterThanOrEqual(50);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('should generate a random float within the specified range and decimal places', () => {
        const result = generateRandomNumber(1, 100, NUMBER_TYPE.float, 2);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(2); // Ensure it has 2 decimal places
    });

    it('should generate a random integer without decimal places', () => {
        const result = generateRandomNumber(1, 100, NUMBER_TYPE.float);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('should generate a random integer within the default range', () => {
        const result = generateRandomNumber();

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });
});

describe('generateRandomInteger', () => {
    it('should generate a random integer within the specified range', () => {
        const result = generateRandomInteger(1, 100);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('should generate a random integer within the specified range', () => {
        const result = generateRandomInteger(100, 200);

        expect(result).toBeGreaterThanOrEqual(100);
        expect(result).toBeLessThanOrEqual(200);
        expect(Number.isInteger(result)).toBeTruthy();
    });

    it('should throw an error when min is greater than or equal to max', () => {
        expect(() => generateRandomInteger(100, 50)).toThrowError('最小值不能大于等于最大值');
    });

    it('should throw an error when min or max is not a number', () => {
        //@ts-ignore
        expect(() => generateRandomInteger('1', 100)).toThrowError('最小值和最大值必须是数字');
        //@ts-ignore
        expect(() => generateRandomInteger(1, '100')).toThrowError('最小值和最大值必须是数字');
    });
});

describe('generateRandomFloat', () => {
    it('should generate a random float within the specified range and decimal places', () => {
        const result = generateRandomFloat(1, 100, 5);

        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(100);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBeLessThanOrEqual(5); // Ensure it has 5 decimal places
    });

    it('should generate a random float within the specified range and decimal places', () => {
        const result = generateRandomFloat(100, 200, 10);

        expect(result).toBeGreaterThanOrEqual(100);
        expect(result).toBeLessThanOrEqual(200);
        expect(result % 1).not.toBe(0); // Ensure it is a decimal
        expect(result.toString().split('.')[1].length).toBe(10); // Ensure it has 10 decimal places
    });

    it('should throw an error when min is greater than or equal to max', () => {
        expect(() => generateRandomFloat(100, 50, 2)).toThrowError('最小值不能大于等于最大值');
    });

    it('should throw an error when min or max is not a number', () => {
        //@ts-ignore
        expect(() => generateRandomFloat('1', 100, 2)).toThrowError('最小值和最大值必须是数字');
        //@ts-ignore
        expect(() => generateRandomFloat(1, '100', 2)).toThrowError('最小值和最大值必须是数字');
    });

    it('should throw an error when decimalPlaces is not an integer', () => {
        //@ts-ignore
        expect(() => generateRandomFloat(1, 100, '2')).toThrowError('小数位数必须是大于等于0的整数');
    });
});
