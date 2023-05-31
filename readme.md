# Mymock

一个可以mock数据的typescript库，可以生成各种类型的随机数据，包括但不限于数字、字符串、日期、布尔值、数组、对象等（用于练手的）。

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

### 

## 复杂数据类型

### 数组

```js
// 生成10个0-100自然数
mock.template({
	type: 'array',
    generator: 'number|0~100',
    length: 10
})
```



### 对象

```js
// 生成一个对象如 
//{
//	name: 'dasdqweras',
//    company: {
//        address: 'asxzcqwdqwd'
//    }
//}
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
```

