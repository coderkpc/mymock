import dayjs from 'dayjs';

/**
 * @description 生成随机时间
 * @param format 占位符，默认值为 'hh:mm:ss'，根据传入的占位符返回格式化后的时间
 * @returns 随机时间字符串
 * @example
 * generateRandomTime() // 生成随机时间，格式为 'hh:mm:ss'
 * generateRandomTime('HH:mm') // 生成随机时间，格式为 'HH:mm'
 */
export function generateRandomTime(format: string = 'hh:mm:ss'): string {
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const randomSecond = Math.floor(Math.random() * 60);
    const randomTime = dayjs().hour(randomHour).minute(randomMinute).second(randomSecond);

    return randomTime.format(format);
}
