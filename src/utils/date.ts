import dayjs from 'dayjs';

/**
 * @description 生成随机日期
 * @param format 占位符，默认值为 'YYYY-MM-DD'，根据传入的占位符返回格式化后的日期
 * @returns 随机日期字符串
 * @example
 * generateRandomDate() // 生成随机日期，格式为 'YYYY-MM-DD'
 * generateRandomDate('YYYY/MM/DD') // 生成随机日期，格式为 'YYYY/MM/DD'
 */
export function generateRandomDate(format: string = 'YYYY-MM-DD'): string {
    const currentDate = dayjs();
    const randomYear = Math.floor(Math.random() * 10) + currentDate.year() - 5;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 31) + 1;
    const randomDate = dayjs(`${randomYear}-${randomMonth}-${randomDay}`);

    return randomDate.format(format);
}
