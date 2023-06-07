import { describe, expect, it } from 'vitest';
import { generateRandomBoolean } from '../src/utils';

describe('generateRandomBoolean', () => {
    it('should generate a random boolean with the specified probability', () => {
        const result1 = generateRandomBoolean(0.5);
        const result2 = generateRandomBoolean(0.1);
        const result3 = generateRandomBoolean(0.9);
        const result4 = generateRandomBoolean(1);

        expect(typeof result1).toBe('boolean');
        expect(typeof result2).toBe('boolean');
        expect(typeof result3).toBe('boolean');
        expect(typeof result4).toBe('boolean');
    });

    it('should generate a random boolean with the default probability (0.5)', () => {
        const result = generateRandomBoolean();

        expect(typeof result).toBe('boolean');
    });

    it('should throw an error when probability is not a number or not between 0 and 1', () => {
        expect(() => generateRandomBoolean(-0.5)).toThrowError('概率必须是0-1之间的数字');
        expect(() => generateRandomBoolean(1.5)).toThrowError('概率必须是0-1之间的数字');
        // @ts-ignore
        expect(() => generateRandomBoolean('0.5')).toThrowError('概率必须是0-1之间的数字');
    });
});
