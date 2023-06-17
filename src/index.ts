import { isString } from 'lodash-es';
import { MockOptions } from './types';
import { DefaultMockFunction, DefaultCharPools } from './utils';
import { generateData } from './utils/mock';
import { validateType } from './utils/validate';

/**
 * 第一次评价:
 * 亮点
 * 对部分外部的调用传入参数错误的情况进行了校验与提示，做到了异常前置
 * 代码注释较多，容易理解
 *
 * 问题点
 * 生成随机数时使用 Math.round 进行取舍，导致边界值与中间值的生成概率不一致
 * 根据不同的类型调用不同的函数时，使用 switch / if-else 的形式进行串行处理
 * 部分函数拆分不够细，如 ParseArgvs 函数中聚合了所有类型的规则解析逻辑，导致针对函数的单测粒度过大
 * 单元测试仅针对对外暴露的接口进行测试，忽略了一些内部公用函数的测试
 * ts 部分类型定义可以使用工具类型进行简化
 *
 * 评级说明
 * 整体完成度不高，功能上需要进一步补充，从目前代码来看可维护性要需要提升
 *
 * 改进建议
 * 注意模块/函数的拆分与代码的可维护性
 * 进一步完善功能
 * 编码时摸索一下更好的逻辑实现方式
 */

/**
 * 第二次评价
 * 亮点
 * 场景分析较多，尽可能列举了实际使用中会出现的种种场景
 * 对部分输入做了参数校验，做到了异常前置
 * 单测较多，针对正常情况与异常情况都有做覆盖，覆盖率较高
 *
 * 问题点
 * xmind 的 API 中列出了一些内部的函数，如 parse，仅关注对外的 API 即可
 * demo 中部分语法的描述与给出的例子不一致，如数字类型
 * 单测中部分测试的检验条件有问题，如验证 boolean 生成概率的参数检验条件为生成的内容是否为 boolean
 * 部分 API 定义不合理，如数组的生成仅提供了 length 参数指定一个固定的长度，如果需要一个范围内的变长将无法满足
 * 存在多值化的判断逻辑使用 if-else / switch 进行分发，不利于后续维护
 *
 * 评级说明
 * 功能点发散、拆解清晰，API 定义存在一些不合理的地方；单测覆盖率高，但测试方式存在不合理的地方
 *
 * 改进建议
 * 编码风格优化，增强可读性与可维护性
 * API 参数定义的可拓展性
 * 单测的判断条件与测试点需要更合理，不要仅追求覆盖率
 */

/**
 * 第三次评价:
 * 亮点
 * 重构作业：能够做到函数分层，将易变逻辑与不变逻辑进行抽离，将易变逻辑集中在一个函数中进行处理，有利于后续拓展；能够将一些短小的执行逻辑抽取函数，通过函数名称了解执行其功能，有较强的可读性
 * 整体模块拆分清晰，代码较简洁
 * 单测能够覆盖正常场景与异常场景，对参数也基本都有用例覆盖，覆盖率较高
 * 单测能够用 mock 将随机逻辑劫持，保持测试执行结果的统一
 *
 * 问题点
 * √ generateComplexData 函数的实现中存在相同代码逻辑但层次不同的问题，array 的 template 参数校验在 if 块内，而 object 的 template 校验参数在 if 条件上，但实际两者的逻辑是一致的，建议保持写法的统一
 * √ getParams 函数作为总入口分发各个类型生成的入参不太合理，应该每个函数有自己一个独立的入口，就不会出现参数解析出现 param1 / param2 / param3 等无意义的变量命名，对单测来讲也可以以更小的粒度进行测试
 * √ 错误日志不统一，有的中文有的英文，建议统一格式
 * √ 单测中没有劫持所有的随机逻辑，如生成随机整数中，可以劫持 Math.random 返回 0 与 1 用于测试边界值有没有问题，而不是执行真正的随机逻辑
 * 对一些复用多次的逻辑没有进行抽取，如范围内随机整数的生成
 *
 * 评级说明
 * 重构代码 ok，作业代码整体较简洁干净，但存在一些编码细节、代码复用问题可以优化
 *
 * 改进建议
 * 将单测中随机逻辑进行劫持，充分测试边界条件
 * 内部函数也可以进一步做拆分，方便测试
 */

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
        validateType('string', key);
        validateType('function', fn);

        this.mockFunction[key] = fn;
    }

    /**
     * @description 根据模板生成mock数据
     * @param template
     * @returns mock数据
     */
    public template(template: string | MockOptions) {
        return generateData({ template, mockFunction: this.mockFunction, charPools: this.charPools });
    }

    /**
     * @description 根据模板重复n次生成mock数据
     * @param template 模板
     * @param count 次数
     * @returns mock数据数组
     */
    public templateRepeat(template: string | MockOptions, count: number): any[] {
        validateType('number', count);

        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(this.template(template));
        }

        return result;
    }
}

export default Mock;
