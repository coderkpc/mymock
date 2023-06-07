import { beforeEach, describe, expect, it, vi } from 'vitest';
import Mock from '../src';
import { MockOptions } from 'src/types';
import { isInteger, isNumber } from 'lodash-es';

describe('Mock', () => {
    let mock: Mock;

    beforeEach(() => {
        mock = new Mock();
    });

    describe('extendsCharPools', () => {
        it('should extend the default character pools', () => {
            mock.extendsCharPools({
                lower: 'abc',
                zh_cn: '中文',
            });

            expect(mock.CharPools).toEqual({
                lower: 'abc',
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                number: '0123456789',
                symbol: '!@#$%^&*()[]',
                zh_cn: '中文',
            });
        });
    });

    describe('extend', () => {
        it('should extend the mock functions', () => {
            const customFn = vi.fn();

            mock.extend('custom', customFn);

            expect(mock['mockFunction']['custom']).toBe(customFn);
        });

        it('should throw an error for invalid arguments', () => {
            // @ts-ignore
            expect(() => mock.extend('custom', 'invalid')).toThrowError('Invalid arguments');
        });

        it('should extend the mock functions', () => {
            const customFn = vi.fn();
            mock.extend('custom', customFn);
            const mockData = mock.template('custom');

            expect(mockData).toBe(customFn());
        });
    });

    describe('parse', () => {
        it('should parse the mock template for number type', () => {
            const template = 'number|1|100|2';
            const parsed = mock.parse(template);

            expect(parsed).toEqual({
                type: 'number',
                params: {
                    min: 1,
                    max: 100,
                    decimalPlaces: 2,
                },
            });
        });

        it('should parse the mock template for string type', () => {
            const template = 'string|5|lower';
            const parsed = mock.parse(template);

            expect(parsed).toEqual({
                type: 'string',
                params: {
                    length: 5,
                    pool: ['lower'],
                },
            });
        });

        it('should parse the mock template for boolean type', () => {
            const template = 'boolean|0.5';
            const parsed = mock.parse(template);

            expect(parsed).toEqual({
                type: 'boolean',
                params: {
                    prob: 0.5,
                },
            });
        });

        it('should parse the mock template for date type', () => {
            const template = 'date|yyyy-MM-dd';
            const parsed = mock.parse(template);

            expect(parsed).toEqual({
                type: 'date',
                params: {
                    format: 'yyyy-MM-dd',
                },
            });
        });

        it('should parse the mock template for time type', () => {
            const template = 'time|HH:mm:ss';
            const parsed = mock.parse(template);

            expect(parsed).toEqual({
                type: 'time',
                params: {
                    format: 'HH:mm:ss',
                },
            });
        });

        it('should throw an error for invalid template', () => {
            const template = 'invalid|template';
            expect(() => mock.parse(template)).toThrowError('Invalid template');
        });
    });

    describe('template', () => {
        it('should generate float number mock data for number type template', () => {
            const template = 'number|1|100|2';
            const mockData = mock.template(template);

            expect(isNumber(mockData)).toBe(true);
            expect(mockData.toString().split('.')[1].length).toBeLessThanOrEqual(2);
        });

        it('should generate int number mock data for number type template', () => {
            const template = 'number';
            const mockData = mock.template(template);

            expect(isNumber(mockData) && isInteger(mockData)).toBe(true);
        });

        it('should generate mock data for string type template', () => {
            const template = 'string|5|lower';
            const mockData = mock.template(template);

            expect(typeof mockData).toBe('string');
        });

        it('should generate mock data for string type template without params', () => {
            const template = 'string';
            const mockData = mock.template(template);

            expect(typeof mockData).toBe('string');
        });

        it('should generate mock data for boolean type template', () => {
            const template = 'boolean|0.5';
            const mockData = mock.template(template);

            expect(typeof mockData).toBe('boolean');
        });

        it('should generate mock data for boolean type template without params', () => {
            const template = 'boolean';
            const mockData = mock.template(template);

            expect(typeof mockData).toBe('boolean');
        });

        it('should generate mock data for date type template', () => {
            const template = 'date|YYYY-MM-DD';
            const mockData = mock.template(template);

            expect(/^\d{4}-\d{2}-\d{2}$/.test(mockData)).toBe(true);
        });

        it('should generate mock data for date type template without params', () => {
            const template = 'date';
            const mockData = mock.template(template);

            expect(/^\d{4}-\d{2}-\d{2}$/.test(mockData)).toBe(true);
        });

        it('should generate mock data for time type template', () => {
            const template = 'time|HH:mm:ss';
            const mockData = mock.template(template);

            expect(/^\d{2}:\d{2}:\d{2}$/.test(mockData)).toBe(true);
        });

        it('should generate mock data for time type template without params', () => {
            const template = 'time';
            const mockData = mock.template(template);

            expect(/^\d{2}:\d{2}:\d{2}$/.test(mockData)).toBe(true);
        });

        it('should generate mock data for array type template with generator function', () => {
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

        it('should generate mock data for array type template with generator template string', () => {
            const template: MockOptions = {
                type: 'array',
                params: {
                    length: 5,
                    generator: 'number',
                },
            };
            const mockData = mock.template(template);

            expect(Array.isArray(mockData)).toBe(true);
            expect(mockData.length).toBe(5);
            expect(mockData.every((element: number) => typeof element === 'number')).toBe(true);
        });

        it('should throw an error for invalid template array', () => {
            const template: MockOptions = {
                type: 'array',
                params: {
                    length: 5,
                    // @ts-ignore
                    generator: 123,
                },
            };
            expect(() => mock.template(template)).toThrowError('Invalid template array');
        });

        it('should generate mock data for object type template', () => {
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

        it('should throw an error for invalid template string', () => {
            const template = 'invalid|template';
            expect(() => mock.template(template)).toThrowError('Invalid template string');
        });

        it('should throw an error for invalid template object', () => {
            const template = {
                type: 'invalid',
                properties: {
                    prop: 'string',
                },
            };
            // @ts-ignore
            expect(() => mock.template(template)).toThrowError('Invalid template object');
        });

        it('should throw an error for invalid template', () => {
            const template = 123;
            // @ts-ignore
            expect(() => mock.template(template)).toThrowError('Invalid template');
        });
    });
});
