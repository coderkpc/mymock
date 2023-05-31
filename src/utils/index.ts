import { isArray } from 'lodash-es';
import type { ParseFuncReturnType } from 'src/types';

/**
 * 解析参数
 * @param val - 参数
 * @returns obj - 解析后的参数, 包含数据类型和规则
 */
export function ParseArgvs(val: string): ParseFuncReturnType {
  const obj: ParseFuncReturnType = {
    type: 'string',
    rule: {},
  };
  // 判断数字类型
  if (/^number/.test(val)) {
    obj.type = 'number';
    // 获取最大最小值
    const [min, max] = val.split('|')[1].split('-');
    obj.rule = {
      min: Number(min),
      max: Number(max),
    };
  }
  // 判断布尔类型
  else if (/^boolean/.test(val)) {
    obj.type = 'boolean';
  }
  // 判断字符串类型
  else if (/^string/.test(val)) {
    obj.type = 'string';
    // 获取字符串长度和字符类型
    const [length, pool] = val.split('|')[1].split('-');
    obj.rule = {
      length: Number(length),
      pool,
    };
  }
  // 判断日期类型
  else if (/^date/.test(val)) {
    obj.type = 'date';
    // 获取日期格式
    const format = val.split('|')[1];
    obj.rule = {
      format: format || 'YYYY-MM-DD',
    };
  }
  // 判断时间类型
  else if (/^time/.test(val)) {
    obj.type = 'time';
    // 获取时间格式
    const format = val.split('|')[1];
    obj.rule = {
      format: format || 'HH:mm:ss',
    };
  }

  return obj;
}
