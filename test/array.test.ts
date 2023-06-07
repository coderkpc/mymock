import { describe, expect, it } from 'vitest';
import { generateRandomArray } from 'src/utils';

describe('generateRandomArray', () => {
    it('should generate an array with the specified length', () => {
        const length = 5;
        const array = generateRandomArray(length, () => 0);

        expect(array).toHaveLength(length);
    });

    it('should generate an array with random elements based on the generator function', () => {
        const length = 10;
        const array = generateRandomArray(length, () => Math.random());

        expect(array).toHaveLength(length);
        expect(array.every(element => typeof element === 'number')).toBe(true);
    });

    it('should generate an array with custom objects based on the generator function', () => {
        interface Person {
            name: string;
            age: number;
        }

        const length = 3;
        const array = generateRandomArray<Person>(length, () => ({
            name: 'John Doe',
            age: Math.floor(Math.random() * 50) + 20,
        }));

        expect(array).toHaveLength(length);
        expect(array.every(person => person.name === 'John Doe')).toBe(true);
        expect(array.every(person => person.age >= 20 && person.age < 70)).toBe(true);
    });
});
