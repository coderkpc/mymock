/**
 * @description 生成随机数组
 * @param length 数组的长度
 * @param generator 生成数组元素的函数
 * @returns 生成的数组
 */
export function generateRandomArray<T = any>(length: number, generator: () => T): T[] {
    const result: T[] = [];
    for (let i = 0; i < length; i++) {
        const element = generator();
        result.push(element);
    }

    return result;
}
