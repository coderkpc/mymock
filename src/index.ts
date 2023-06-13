import { isEmpty, isFunction, isObject, isString } from 'lodash-es';
import { MockOptions } from './types';
import { DefaultMockFunction, DefaultCharPools, parse } from './utils';

// 亮点
// 对部分外部的调用传入参数错误的情况进行了校验与提示，做到了异常前置
// 代码注释较多，容易理解
// - 场景分析较多，尽可能列举了实际使用中会出现的种种场景
// - 对部分输入做了参数校验，做到了异常前置
// - 单测较多，针对正常情况与异常情况都有做覆盖，覆盖率较高

// 问题点
// 生成随机数时使用 Math.round 进行取舍，导致边界值与中间值的生成概率不一致 √
// 根据不同的类型调用不同的函数时，使用 switch / if-else 的形式进行串行处理 √
// 部分函数拆分不够细，如 ParseArgvs 函数中聚合了所有类型的规则解析逻辑，导致针对函数的单测粒度过大 √
// 单元测试仅针对对外暴露的接口进行测试，忽略了一些内部公用函数的测试 √
// ts 部分类型定义可以使用工具类型进行简化 √
// - xmind 的 API 中列出了一些内部的函数，如 parse，仅关注对外的 API 即可 √
// - demo 中部分语法的描述与给出的例子不一致，如数字类型 √
// - 单测中部分测试的检验条件有问题，如验证 boolean 生成概率的参数检验条件为生成的内容是否为 boolean √
// - 部分 API 定义不合理，如数组的生成仅提供了 length 参数指定一个固定的长度，如果需要一个范围内的变长将无法满足
// - 存在多值化的判断逻辑使用 if-else / switch 进行分发，不利于后续维护 √

class Mock {
    public mockFunction: Record<string, Function> = DefaultMockFunction;
    public charPools: Record<string, string> = DefaultCharPools;

    /**
     * @description 扩展默认字符集, 会覆盖已有的字符集
     * @param charPools 字符集
     * @example extendCharPools({ lower: 'abc', zh_cn: '中文', }); // charPools.lower = 'abc', charPools.zh_cn = '中文'
     */
    public extendsCharPools(charPools: Record<string, string>) {
        Object.assign(this.charPools, charPools);
    }

    /**
     * @description 扩展mock方法的方法
     * @param key 扩展的方法名
     * @param fn 扩展的函数逻辑
     */
    public extend(key: string, fn: Function) {
        // 判断参数是否合法
        if (!isString(key) || typeof fn !== 'function') {
            throw new Error('Invalid arguments');
        }
        this.mockFunction[key] = fn;
    }

    /**
     * @description 生成基本数据类型的mock数据
     * @param template
     * @returns mock数据
     */
    private simple(template: string) {
        // 生成基本数据类型的mock数据
        const { type, params } = parse({
            template,
            mockFunction: this.mockFunction,
            pools: this.charPools,
        });
        return this.mockFunction[type](params);
    }

    /**
     * @description 生成复杂数据类型的mock数据
     * @param template
     * @returns mock数据
     */
    private complex(template: MockOptions) {
        // 判断数组
        if (template.type === 'array') {
            if (!isFunction(template.params.generator)) throw new Error('Invalid template');
            return this.mockFunction['array']({
                length: template.params.length,
                generator: template.params.generator,
            });
        }
        // 判断对象
        if (template.type === 'object' && !isEmpty(template.properties)) {
            const result: Record<string, any> = {};
            for (const key in template.properties) {
                result[key] = this.template(template.properties[key]);
            }
            return result;
        }
        throw new Error('Invalid template');
    }

    /**
     * @description 根据模板生成mock数据
     * @param template
     * @returns mock数据
     */
    public template(template: string | MockOptions) {
        if (isString(template)) return this.simple(template);
        if (isObject(template)) return this.complex(template);
        throw new Error('Invalid template');
    }
}

export default Mock;
