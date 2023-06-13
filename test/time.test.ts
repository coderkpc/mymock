import { describe, expect, it } from 'vitest';
import { generateRandomTime } from '../src/utils';

describe('生成随机时间', () => {
    it('默认以hh:mm:ss为格式生成随机时间', () => {
        const result = generateRandomTime({});
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('以HH:mm为格式生成时间', () => {
        const result = generateRandomTime({ format: 'HH:mm' });
        const regex = /^\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });
});
