import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateRandomDate } from '../src/utils'; // 替换为实际的模块路径

describe('生成随机日期', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('默认按YYYY-MM-DD生成随机日期', () => {
        const result = generateRandomDate({});
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('按YYYY/MM/DD生成随机日期', () => {
        const result = generateRandomDate({
            format: 'YYYY/MM/DD',
        });
        const regex = /^\d{4}\/\d{2}\/\d{2}$/;
        expect(result).toMatch(regex);
    });

    it('边界值检查，生成1970/01/01', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(
            generateRandomDate({
                format: 'YYYY/MM/DD',
            }),
        ).toBe('1970/01/01');
    });

    it('边界值检查，生成2023最后一天', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999999999999);
        expect(
            generateRandomDate({
                format: 'YYYY/MM/DD',
            }),
        ).toBe('2023/12/31');
    });
});
