import { describe, expect, it } from 'vitest';
import { generateRandomDate } from '../src/utils'; // 替换为实际的模块路径

describe('generateRandomDate', () => {
    it('should generate a random date with default format', () => {
        const result = generateRandomDate();
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('should generate a random date with custom format', () => {
        const result = generateRandomDate('YYYY/MM/DD');
        const regex = /^\d{4}\/\d{2}\/\d{2}$/;
        expect(result).toMatch(regex);
    });
});
