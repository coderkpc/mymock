import dayjs from 'dayjs';
import { isInteger } from 'lodash-es';
import { MockOptions } from './types';
import { ParseArgvs } from './utils';

export class MockDataGenerator {
  /**
   * 生成随机数字
   * @param min - 最小值
   * @param max - 最大值
   * @returns 随机数字
   */
  public generateNumber(min: number, max: number): number {
    // 判断参数是否合法
    if (isInteger(min) && isInteger(max) && min <= max) {
      return Math.round(Math.random() * (max - min)) + min;
    }
    throw new Error('Invalid parameter');
  }

  /**
   * 生成随机字符
   * @param length - 字符串长度
   * @param type - 字符类型
   * @returns 随机字符串
   */
  public generateChar(pool: 'lower' | 'upper' | 'number' | 'symbol' | 'all' = 'all'): string {
    // 定义字符集
    const charPools = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      number: '0123456789',
      symbol: '!@#$%^&*()[]',
      all: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]',
    };
    // 在字符串的长度范围内生成一个随机索引并返回对应的字符
    return charPools[pool].charAt(this.generateNumber(0, charPools[pool].length - 1));
  }

  /**
   * 生成随机字符串
   * @param length - 字符串长度
   * @param type - 字符类型
   * @returns 随机字符串
   */
  public generateString(length: number = 10, pool: 'lower' | 'upper' | 'number' | 'symbol' | 'all' = 'all'): string {
    // 判断参数是否合法
    if (isInteger(length) && length > 0 && ['lower', 'upper', 'number', 'symbol', 'all'].includes(pool)) {
      // 生成指定长度的字符串
      let result = '';
      for (let i = 0; i < length; i++) {
        result += this.generateChar(pool);
      }
      return result;
    }
    throw new Error('Invalid parameter');
  }

  /**
   * 生成随机布尔值
   * @returns 随机布尔值
   */
  public generateBoolean(): boolean {
    // 生成 0 到 1 之间的随机数，小于 0.5 则返回 true，大于等于 0.5 则返回 false
    return Math.random() < 0.5;
  }

  /**
   * 生成随机日期
   * @param format - 格式
   * @returns 随机日期
   */
  public generateDate(format: string): string {
    // 设置起始日期为 1970 年 1 月 1 日
    const start = dayjs('1970-01-01');
    // 设置结束日期为当前日期
    const end = dayjs();
    // 计算日期差值（毫秒）
    const diff = end.diff(start, 'millisecond');
    // 生成随机的日期差值
    const randomDiff = this.generateNumber(0, diff);
    // 根据随机日期差值计算日期并返回
    return start.add(randomDiff, 'millisecond').format(format);
  }

  /**
   * 生成随机时间
   * @param format - 格式
   * @returns 随机时间
   */
  public generateTime(format: string): string {
    // 生成随机的小时、分钟和秒
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    // 使用 dayjs 设置时间，并按照 HH:mm:ss 格式化返回
    return dayjs().set('hour', hours).set('minute', minutes).set('second', seconds).format(format);
  }

  /**
   * 生成随机数组
   * @param length - 数组长度
   * @param generator - 数组元素的生成器
   * @returns 随机数组
   */
  public generateArray(length: number, generator: () => any): any[] {
    // TODO: 待完善
    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(generator());
    }
    return array;
  }

  // TODO: 待完善
  public generateObject(): any {}

  /**
   * 生成随机数据
   * @param options - 数据生成配置
   * @returns 随机数据
   */
  public generate(options: MockOptions): any {
    for (const key in options) {
      const argvs = ParseArgvs(options[key]);
      switch (argvs.type) {
        case 'number':
          options[key] = this.generateNumber(argvs.rule.min, argvs.rule.max);
          break;
        case 'string':
          options[key] = this.generateString(argvs.rule.length, argvs.rule.pool);
          break;
        case 'boolean':
          options[key] = this.generateBoolean();
          break;
        case 'date':
          options[key] = this.generateDate(argvs.rule.format);
          break;
        case 'time':
          options[key] = this.generateTime(argvs.rule.format);
          break;
      }
    }
    return options;
  }
}
