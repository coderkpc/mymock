import dayjs from 'dayjs';
import { GenerateRandomDateOptions } from '../types';

/**
 * @description 生成随机日期
 * @param {Object} options 参数
 * @returns 随机日期字符串
 * @example
 * generateRandomDate() // 生成随机日期，格式为 'YYYY-MM-DD'
 * generateRandomDate({ format: 'YYYY/MM/DD' }) // 生成随机日期，格式为 'YYYY/MM/DD'
 */
export function generateRandomDate(options: GenerateRandomDateOptions = {}): string {
    const { format = 'YYYY-MM-DD' } = options;

    const currentDate = dayjs();
    const randomYear = Math.floor(Math.random() * 10) + currentDate.year() - 5;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 31) + 1;
    const randomDate = dayjs(`${randomYear}-${randomMonth}-${randomDay}`);

    return randomDate.format(format);
}
