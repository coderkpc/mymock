import dayjs from 'dayjs';
import { GenerateRandomTimeOptions } from '../types';

/**
 * @description 生成随机时间, 范围：00:00:00到23:59:59
 * @param {Object} options 参数
 * @returns 随机时间字符串
 * @example
 * generateRandomTime() // 生成随机时间，格式为 'HH:mm:ss'
 * generateRandomTime('HH:mm') // 生成随机时间，格式为 'HH:mm'
 */
export function generateRandomTime(options: GenerateRandomTimeOptions): string {
    const { format = 'HH:mm:ss' } = options;
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const randomSecond = Math.floor(Math.random() * 60);
    const randomTime = dayjs().hour(randomHour).minute(randomMinute).second(randomSecond);

    return randomTime.format(format);
}
