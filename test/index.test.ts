import { beforeEach, describe, expect, it, vi } from 'vitest';
import Mock from '../src';
import { MockOptions } from '../src/types';
import { isInteger, isNumber } from 'lodash-es';
import { DefaultCharPools, DefaultMockFunction, generateRandomNumber, parse } from '../src/utils';

describe('Mock', () => {
    let mock: Mock;

    beforeEach(() => {
        mock = new Mock();
    });

    describe('扩展默认字符集', () => {
        it('扩展默认字符集', () => {
            mock.extendsCharPools({
                lower: 'abc',
                zh_cn: '中文',
            });

            expect(mock.charPools).toEqual({
                lower: 'abc',
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                number: '0123456789',
                symbol: '!@#$%^&*()[]',
                zh_cn: '中文',
            });
        });
    });

    describe('扩展mock方法', () => {
        it('扩展mock方法', () => {
            const customFn = vi.fn();
            mock.extend('custom', customFn);

            expect(mock['mockFunction']['custom']).toBe(customFn);
        });

        it('扩展mock方法时传入非法参数', () => {
            // @ts-ignore
            expect(() => mock.extend('custom', 'invalid')).toThrowError('参数invalid不是function类型');
        });

        it('调用扩展后的mock方法', () => {
            const customFn = vi.fn();
            mock.extend('custom', customFn);
            const mockData = mock.template('custom');

            expect(mockData).toBe(customFn());
        });
    });

    describe('解析模板', () => {
        it('将模板解析成生成数字的参数', () => {
            const template = 'number|1|100|2';
            const parsed = parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools });

            expect(parsed).toEqual({
                type: 'number',
                params: {
                    min: 1,
                    max: 100,
                    decimalPlaces: 2,
                },
            });
        });

        it('将模板解析成生成字符串的参数', () => {
            const template = 'string|5|lower';
            const parsed = parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools });

            expect(parsed).toEqual({
                type: 'string',
                params: {
                    length: 5,
                    pool: ['lower'],
                },
            });
        });

        it('将模板解析成生成布尔值的参数', () => {
            const template = 'boolean|0.5';
            const parsed = parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools });

            expect(parsed).toEqual({
                type: 'boolean',
                params: {
                    prob: 0.5,
                },
            });
        });

        it('将模板解析成生成日期的参数', () => {
            const template = 'date|yyyy-MM-dd';
            const parsed = parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools });

            expect(parsed).toEqual({
                type: 'date',
                params: {
                    format: 'yyyy-MM-dd',
                },
            });
        });

        it('将模板解析成生成时间的参数', () => {
            const template = 'time|HH:mm:ss';
            const parsed = parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools });

            expect(parsed).toEqual({
                type: 'time',
                params: {
                    format: 'HH:mm:ss',
                },
            });
        });

        it('解析模板时传入非法模板', () => {
            const template = 'invalid|template';
            expect(() => parse({ template, mockFunction: DefaultMockFunction, pools: DefaultCharPools })).toThrowError(
                '模板解析错误',
            );
        });
    });

    describe('对外暴露的mock入口', () => {
        describe('基本类型', () => {
            describe('数字类型', () => {
                it('使用模板mock生成1-100的浮点数，保留两位', () => {
                    const template = 'number|1|100|2';
                    const mockData = mock.template(template);

                    expect(isNumber(mockData)).toBe(true);
                    expect(mockData.toString().split('.')[1].length).toBeLessThanOrEqual(2);
                });

                it('默认生成1-100的自然数', () => {
                    const template = 'number';
                    const mockData = mock.template(template);

                    expect(isNumber(mockData) && isInteger(mockData)).toBe(true);
                });
            });

            describe('字符串类型', () => {
                it('生成长度为5的随机小写字符串', () => {
                    const template = 'string|5|lower';
                    const mockData = mock.template(template);

                    expect(typeof mockData).toBe('string');
                });

                it('默认生成长度为10的随机字符串', () => {
                    const template = 'string';
                    const mockData = mock.template(template);

                    expect(typeof mockData).toBe('string');
                });
            });

            describe('布尔值类型', () => {
                it('生成布尔值', () => {
                    const template = 'boolean';
                    const mockData = mock.template(template);

                    expect(typeof mockData).toBe('boolean');
                });

                it('以70%的概率生成为true的布尔值', () => {
                    const template = 'boolean|0.7';
                    const mockData = mock.template(template);

                    expect(typeof mockData).toBe('boolean');
                });
            });

            describe('日期类型', () => {
                it('以YYYY/MM/DD的格式生成随机日期', () => {
                    const template = 'date|YYYY/MM/DD';
                    const mockData = mock.template(template);

                    expect(/^\d{4}\/\d{2}\/\d{2}$/.test(mockData)).toBe(true);
                });

                it('默认以YYYY-MM-DD的格式生成随机日期', () => {
                    const template = 'date';
                    const mockData = mock.template(template);

                    expect(/^\d{4}-\d{2}-\d{2}$/.test(mockData)).toBe(true);
                });
            });

            describe('时间类型', () => {
                it('以HH:mm:ss的格式生成随机时间', () => {
                    const template = 'time|HH:mm:ss';
                    const mockData = mock.template(template);

                    expect(/^\d{2}:\d{2}:\d{2}$/.test(mockData)).toBe(true);
                });

                it('默认以hh:mm:ss的格式生成随机时间', () => {
                    const template = 'time';
                    const mockData = mock.template(template);

                    expect(/^\d{2}:\d{2}:\d{2}$/.test(mockData)).toBe(true);
                });
            });
        });
        describe('复杂类型', () => {
            describe('数组类型', () => {
                it('生成一个长度为5的数组, 自定义构造函数', () => {
                    const template: MockOptions = {
                        type: 'array',
                        params: {
                            length: 5,
                            generator: () => 'element',
                        },
                    };
                    const mockData = mock.template(template);

                    expect(Array.isArray(mockData)).toBe(true);
                    expect(mockData.length).toBe(5);
                    expect(mockData.every((element: string) => element === 'element')).toBe(true);
                });

                it('生成一个长度为5的数组, 元素全是1-100的自然数', () => {
                    const template: MockOptions = {
                        type: 'array',
                        params: {
                            length: 5,
                            generator: generateRandomNumber,
                        },
                    };
                    const mockData = mock.template(template);

                    expect(Array.isArray(mockData)).toBe(true);
                    expect(mockData.length).toBe(5);
                    expect(mockData.every((element: number) => typeof element === 'number')).toBe(true);
                });

                it('生成数组的参数错误', () => {
                    const template: MockOptions = {
                        type: 'array',
                        params: {
                            length: 5,
                            // @ts-ignore
                            generator: 123,
                        },
                    };
                    expect(() => mock.template(template)).toThrowError('参数123不是function类型');
                });
            });

            describe('对象类型', () => {
                it('生成一个mock对象', () => {
                    const template: MockOptions = {
                        type: 'object',
                        properties: {
                            prop1: 'string|5|lower',
                            prop2: 'number|1|10|0',
                        },
                    };
                    const mockData = mock.template(template);

                    expect(typeof mockData).toBe('object');
                    expect(Object.keys(mockData)).toEqual(['prop1', 'prop2']);
                    expect(typeof mockData['prop1']).toBe('string');
                    expect(typeof mockData['prop2']).toBe('number');
                });

                it('生成一个嵌套对象的对象', () => {
                    const template: MockOptions = {
                        type: 'object',
                        properties: {
                            second: {
                                type: 'object',
                                properties: {
                                    prop1: 'string|5|lower',
                                    prop2: 'number|1|10|0',
                                },
                            },
                        },
                    };
                    const mockData = mock.template(template);

                    expect(typeof mockData['second']).toBe('object');
                    expect(Object.keys(mockData['second'])).toEqual(['prop1', 'prop2']);
                    expect(typeof mockData['second']['prop1']).toBe('string');
                    expect(typeof mockData['second']['prop2']).toBe('number');
                });

                it('生成一个嵌套数组的对象', () => {
                    const template: MockOptions = {
                        type: 'object',
                        properties: {
                            prop1: 'string|5|lower',
                            prop2: 'number|1|10|0',
                            second: {
                                type: 'array',
                                params: {
                                    length: 5,
                                    generator: () => Math.random(),
                                },
                            },
                        },
                    };
                    const mockData = mock.template(template);

                    expect(Array.isArray(mockData['second'])).toBe(true);
                    expect(mockData['second'].length).toBe(5);
                    expect(mockData['second'].every((element: number) => typeof element === 'number')).toBe(true);
                });
            });

            it('生成复杂类型数据时传入非法配置对象', () => {
                const template = {
                    type: 'invalid',
                    properties: {
                        prop: 'string',
                    },
                };
                // @ts-ignore
                expect(() => mock.template(template)).toThrowError('模板解析错误');
            });
        });

        it('模板调用时传入非法参数', () => {
            const template = 123;
            // @ts-ignore
            expect(() => mock.template(template)).toThrowError('模板解析错误');
        });
    });

    describe('根据模板大量生成数据', () => {
        it('生成100次1到100随机自然数', () => {
            const template = 'number';
            const mockData = mock.templateRepeat(template, 100);
            expect(mockData.length).toBe(100);

            expect(mockData.every(item => isInteger(item))).toBe(true);
            expect(mockData.every(item => item >= 1 && item <= 100)).toBe(true);
        });
        it('传入非法参数, 抛出异常', () => {
            const template = 'number';
            // @ts-ignore
            expect(() => mock.templateRepeat(template, '100')).toThrowError('参数100不是number类型');
        });
    });
});
