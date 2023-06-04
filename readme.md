# Mymock

一个可以mock数据的typescript库，可以生成各种类型的随机数据，包括但不限于数字、字符串、日期、布尔值、数组、对象等（用于练手）。

# 使用方法

## 基本数据类型

### 数字

语法：'number|最小值~最大值.保留几位小数'

```js
// 生成0-100自然数
mock.template('number|0~100')
// 生成0-100的小数 保留小数点后两位
mock.template('number|0~100.2')
// 生成-100到0的整数
mock.template('number|-100~0')
```

### 字符串

语法：'string|字符串长度|字符集1.字符集2'

```js
// 生成10位包括完整字符集的字符串
mock.template('string|10|all')
// 生成100位只有小写的字符串
mock.template('string|100|lower')
// 生成50位排除小写的字符串
mock.template('string|50|uppper.symbol.chinese')
// 生成10位包括中文+标点的字符串
mock.template('string|50|symbol.chinese')
```

### 布尔值

语法：'boolean|出现true的概率'

```js
// 以50%的概率生成true和false
mock.template('boolean')
// 以75%的概率生成true
mock.template('boolean|75')
```

### 日期

语法：'date|开始范围|结束范围|格式'

```js
// 以1970-01-01到今天为范围生成随机日期
mock.template('date|1970-01-01|now')
// 以2000-01-01到2100-01-01为范围生成随机日期
mock.template('date|2000-01-01|2100-01-01')
// 以1970-01-01到今天为范围生成随机日期, 格式为YYYY:MM:DD
mock.template('date|2000-01-01|2100-01-01|YYYY:MM:DD')
```

### 时间

语法：'time|开始范围|结束范围|格式'

```js
// 以24小时为范围生成随机时间，格式为hh:mm:ss
mock.template(’time‘)
// 生成12到24点的随机时间，格式为hh:mm:ss
mock.template(’time|12:00:00‘)
// 生成12到24点的随机时间，格式为HH:mm:ss
mock.template(’time|12:00:00|23:59:59|HH:mm:ss‘)
```



## 复杂数据类型

### 数组

```js
// 生成10个0-100自然数
mock.template({
	type: 'array',
    generator: 'number|0~100',
    length: 10
})
// 输出 [1,27,12,7,23,89,45,21,76,43]
```



### 对象

```js
// 生成一个对象
mock.template({
	type: 'object',
    properties: {
        name: 'string|10|all'
        company: {
        	type: 'object',
        	properties: {
        		address: 'string|10|all'
    		}
    	}
    }
})
// 输出
//{
//	name: 'dasdqweras',
//    company: {
//        address: 'asxzcqwdqwd'
//    }
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

