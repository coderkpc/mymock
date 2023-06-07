import { describe, expect, it } from 'vitest';
import { generateRandomTime } from '../src/utils';

describe('generateRandomTime', () => {
    it('should generate a random time with default format', () => {
        const result = generateRandomTime();
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('should generate a random time with custom format', () => {
        const result = generateRandomTime('HH:mm');
        const regex = /^\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });
});
