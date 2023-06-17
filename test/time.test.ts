import { describe, expect, it, vi, afterEach } from 'vitest';
import { generateRandomTime } from '../src/utils';

describe('生成随机时间', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('默认以HH:mm:ss为格式生成随机时间', () => {
        const result = generateRandomTime({});
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('以HH:mm为格式生成时间', () => {
        const result = generateRandomTime({ format: 'HH:mm' });
        const regex = /^\d{2}:\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('边界值检查，生成当天0点', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(generateRandomTime({})).toBe('00:00:00');
    });

    it('边界值检查，生成当天最后一秒', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999999999999);
        expect(generateRandomTime({})).toBe('23:59:59');
    });
});
