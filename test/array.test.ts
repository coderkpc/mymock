import { describe, expect, it } from 'vitest';
import { generateRandomArray } from '../src/utils';

describe('生成随机数组', () => {
    it('生成长度为3的随机数组', () => {
        const length = 3;
        const array = generateRandomArray({
            length,
            generator: () => {
                return {
                    name: 'John Doe',
                    age: Math.floor(Math.random() * 50) + 20,
                };
            },
        });

        expect(array).toHaveLength(length);
        expect(array.every(person => person.name === 'John Doe')).toBe(true);
        expect(array.every(person => person.age >= 20 && person.age < 70)).toBe(true);
    });
});
