import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRandomBoolean } from '../src/utils';

describe('生成随机布尔值', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('默认以50%的概率生成true或false', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        expect(generateRandomBoolean({})).toBe(true);
        vi.spyOn(Math, 'random').mockReturnValue(0.51);
        expect(generateRandomBoolean({})).toBe(false);
        vi.spyOn(Math, 'random').mockRestore();
        expect(typeof generateRandomBoolean({})).toBe('boolean');
    });

    it('生成70%概率为true的随机布尔值', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.71);
        expect(generateRandomBoolean({ prob: 0.7 })).toBe(false);
        vi.spyOn(Math, 'random').mockReturnValue(0.69);
        expect(generateRandomBoolean({ prob: 0.7 })).toBe(true);
    });

    it('传入大于1或小于0的数字、字符串，抛出异常', () => {
        expect(() => generateRandomBoolean({ prob: -0.5 })).toThrowError('概率必须是0-1之间的数字');
        expect(() => generateRandomBoolean({ prob: 1.5 })).toThrowError('概率必须是0-1之间的数字');
        // @ts-ignore
        expect(() => generateRandomBoolean({ prob: '0.5' })).toThrowError('概率必须是0-1之间的数字');
    });
});
