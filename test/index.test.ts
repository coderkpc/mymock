import { beforeEach, describe, expect, it } from 'vitest';
import { MockDataGenerator } from '../src/index';

describe('MockDataGenerator', () => {
  let mockDataGenerator: any;

  beforeEach(() => {
    mockDataGenerator = new MockDataGenerator();
  });

  describe('generateNumber', () => {
    it('should generate a random number within the specified range', () => {
      const min = 1;
      const max = 10;
      const number = mockDataGenerator.generateNumber(min, max);
      expect(number).toBeGreaterThanOrEqual(min);
      expect(number).toBeLessThanOrEqual(max);
      expect(Number.isInteger(number)).toBe(true);
    });

    it('should throw an error for invalid parameters', () => {
      expect(() => {
        mockDataGenerator.generateNumber('invalid', 10);
      }).toThrow('Invalid parameter');

      expect(() => {
        mockDataGenerator.generateNumber(10, 5);
      }).toThrow('Invalid parameter');
    });
  });

  describe('generateChar', () => {
    it('should generate a random character from the specified pool', () => {
      const char = mockDataGenerator.generateChar('lower');
      expect(typeof char).toBe('string');
      expect(char).toMatch(/[a-z]/);
    });
  });

  describe('generateString', () => {
    it('should generate a random string of the specified length and character pool', () => {
      const length = 10;
      const pool = 'lower';
      const string = mockDataGenerator.generateString(length, pool);
      expect(typeof string).toBe('string');
      expect(string).toHaveLength(length);
      expect(string).toMatch(/[a-z]+/);
    });

    it('should throw an error for invalid parameters', () => {
      expect(() => {
        mockDataGenerator.generateString('invalid', 'lower');
      }).toThrow('Invalid parameter');

      expect(() => {
        mockDataGenerator.generateString(10, 'invalid');
      }).toThrow('Invalid parameter');
    });
  });

  describe('generateBoolean', () => {
    it('should generate a random boolean value', () => {
      const boolean = mockDataGenerator.generateBoolean();
      expect(typeof boolean).toBe('boolean');
    });
  });

  describe('generateDate', () => {
    it('should generate a random date in the specified format', () => {
      const format = 'YYYY-MM-DD';
      const date = mockDataGenerator.generateDate(format);
      expect(typeof date).toBe('string');
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('generateTime', () => {
    it('should generate a random time in the specified format', () => {
      const format = 'HH:mm:ss';
      const time = mockDataGenerator.generateTime(format);
      expect(typeof time).toBe('string');
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('generateArray', () => {
    it('should generate a random array of the specified length using the provided generator', () => {
      const length = 5;
      const generator = () => 'element';
      const array = mockDataGenerator.generateArray(length, generator);
      expect(Array.isArray(array)).toBe(true);
      expect(array).toHaveLength(length);
      expect(array.every(element => element === 'element')).toBe(true);
    });
  });

  describe('generate', () => {
    it('should generate random data based on the provided options', () => {
      const options = {
        numberField: 'number|1-10',
        stringField: 'string|5-lower',
        booleanField: 'boolean',
        dateField: 'date|YYYY-MM-DD',
        dateField2: 'date',
        timeField: 'time|HH:mm:ss',
        timeField2: 'time2',
      };

      const generatedData = mockDataGenerator.generate(options);

      expect(typeof generatedData.numberField).toBe('number');
      expect(generatedData.numberField).toBeGreaterThanOrEqual(1);
      expect(generatedData.numberField).toBeLessThanOrEqual(10);

      expect(typeof generatedData.stringField).toBe('string');
      expect(generatedData.stringField).toHaveLength(5);
      expect(generatedData.stringField).toMatch(/[a-z]+/);

      expect(typeof generatedData.booleanField).toBe('boolean');

      expect(typeof generatedData.dateField).toBe('string');
      expect(generatedData.dateField).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      expect(typeof generatedData.dateField2).toBe('string');
      expect(generatedData.dateField).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      expect(typeof generatedData.timeField).toBe('string');
      expect(generatedData.timeField).toMatch(/^\d{2}:\d{2}:\d{2}$/);

      expect(typeof generatedData.timeField2).toBe('string');
      expect(generatedData.timeField).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });
});
