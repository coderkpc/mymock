import { describe, expect, it } from 'vitest';
import { generateRandomDate } from '../src/utils'; // 替换为实际的模块路径

describe('生成随机日期', () => {
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
});
