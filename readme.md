# Mymock

一个可以mock数据的typescript库，可以生成各种类型的随机数据，包括但不限于数字、字符串、日期、布尔值、数组、对象等（用于练手）。

# 使用方法

## 基本数据类型

### 数字

语法：'number|最小值|最大值|保留几位小数'

```js
// 默认生成1-100的自然数
mock.template('number')
// 使用模板mock生成1-100的浮点数，保留两位
mock.template('number|1|100|2')
```

### 字符串

语法：'string|字符串长度|字符集1.字符集2'

```js
// 默认生成长度为10的随机字符串
mock.template('string')
// 生成长度为5的随机小写字符串
mock.template('string|5|lower')
// 生成50位大写+标点符号的字符串
mock.template('string|50|uppper.symbol')
```

### 布尔值

语法：'boolean|出现true的概率'

```js
// 随机布尔值
mock.template('boolean')
// 以70%的概率生成为true的布尔值
mock.template('boolean|0.7')
```

### 日期

范围：1970-01-01到2023-12-31

语法：'date|占位符'

```js
// 默认以YYYY-MM-DD的格式生成随机日期
mock.template('date')
// 生成随机日期, 以YYYY/MM/DD的格式生成随机日期
mock.template('date|YYYY/MM/DD')
```

### 时间

范围：00:00:00到23:59:59

语法：'time|占位符'

```js
// 默认以HH:mm:ss的格式生成随机时间
mock.template('time')
// 以HH:mm的格式生成随机时间
mock.template('time|HH:mm')
```



## 复杂数据类型

### 数组

```js
// 生成5个1-100自然数
mock.template({
    type: 'array',
    params: {
        length: 5,
        generator: generateRandomNumber,
    },
})
// 输出 [12, 3, 64, 45, 98]
```



### 对象

```js
// 生成一个对象
mock.template({
    type: 'object',
    properties: {
        prop1: 'string|5|lower',
        prop2: 'number',
    },
})
// 输出
//{
//	prop1: 'dasdqweras',
//  prop1: 56
//}
```



## 扩展mock逻辑

### 生成UUID

```js
// 注册扩展
mock.extend('uuid', () => {
	let d = new Date().getTime();
	if (window.performance && typeof window.performance.now === "function") {
    	d += performance.now(); // use high-precision timer if available
  	}
  	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	let r = (d + Math.random() * 16) % 16 | 0;
    	d = Math.floor(d / 16);
    	return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  	});
  	return uuid;
})
// 使用
mock.template('uuid') // a2c429f7-7eb9-483b-8f3f-b8065889d4d1
mock.template({
    type: 'object',
    properties: {
        name: 'uuid',
    }
})
// {
//     name: a2c429f7-7eb9-483b-8f3f-b8065889d4d1
// }
```



### 生成身份证号码

```js
// 注册扩展
mock.extend('idcard', () => {
    // 随机生成地区代码（前6位数字）
    let areaCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // 随机生成出生日期（8位数字）
    let birthYear = Math.floor(Math.random() * (2015 - 1950 + 1)) + 1950;
    let birthMonth = Math.floor(Math.random() * 12) + 1;
    if (birthMonth < 10) {
        birthMonth = '0' + birthMonth;
    }
    let birthDay = Math.floor(Math.random() * 28) + 1;
    if (birthDay < 10) {
        birthDay = '0' + birthDay;
    }
    let birthday = '' + birthYear + birthMonth + birthDay;
    // 随机生成顺序码（3位数字）
    let orderCode = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    // 计算校验码
    let idNumber = '' + areaCode + birthday + orderCode;
    let idArray = idNumber.split('');
    let idWeight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let idCheckCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    for (let i = 0; i < idArray.length; i++) {
        sum += idArray[i] * idWeight[i];
    }
    let remainder = sum % 11;
    let checkCode = idCheckCode[remainder];
    // 生成身份证号码并返回
    return '' + areaCode + birthday + orderCode + checkCode;
})

// 使用
mock.template('idcard') // 142085200409262114
mock.template({
    type: 'object',
    properties: {
        idcard: 'idcard',
    }
})
// {
//     idcard: 723583199208069690
// }
```



## 扩展字符集

默认包含，小写、大写、标点符号、中文4种字符集，支持拓展新的字符集

```js
// 注册新的字符集
mock.extendsCharPools('japaniese', 'おはようございます')
// 使用mock生成日文
mock.template('string|10|japaniese') // おはいますようござう
mock.template({
    type: 'object',
    properties: {
        name: 'string|10|japaniese',
    }
})
// {
//     name: おはいますようござう
// }
```



## 生成大量数据

```js
// 生成0-100随机自然数，重复100次，返回一个数组
mock.templateRepeat('number', 100)
/** [
  44, 60, 33, 59, 38, 56, 38, 43, 59, 49, 86, 16,
   3, 75, 19, 44, 45, 85, 62, 55, 43, 10, 43, 17,
  82, 13,  5, 20, 38, 60, 38, 91, 95, 59, 74, 24,
  16, 74, 49, 85, 68, 62, 63, 32, 82, 66, 34, 31,
   2, 49, 88, 68, 32, 60, 15, 22, 93, 68, 93, 19,
  29, 92, 94, 70, 48, 59, 95, 90, 88, 58,  6, 61,
  16, 44, 93,  6, 40,  1, 39,  8, 47, 63, 81, 75,
  94, 98, 37, 27, 81, 21, 22, 87, 35, 39, 87, 74,
  35, 27, 75, 15
] */
```

