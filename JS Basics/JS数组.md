# 数组常用属性及方法

Array.length：用来表示数组长度（直接赋值会改变数组长度，效率比较低下）改变原数组
Array.push(a, b, c...)：依次添加指定的元素到数组的末尾（返回数组长度）改变原数组
Array.unshift(a, b, c...)：依次添加指定的元素到数组的前面（返回数组长度）改变原数组
Array.pop()：删除并返回数组的最后一个元素 改变原数组
Array.shift()：删除并返回数组的第一个元素 改变原数组
Array.splice(x, y, a, b...)：基本用法可实现指定删除、指定替换、指定添加（添加和删除的区别就是第二个参数是否为0）,改变原数组，xy必填
    删除：arr.splice(0, 2);  从下标0开始删除2个元素
    替换：arr.splice(0, 2, "a"); 从下标0开始到0+2位置的元素替换成"a"
    添加：arr.splice(1, 0, "a"); 在下标1的位置添加元素"a"，可添加多个

Array.slice(x, y)：返回数组位置x到y-1之间的元素的数组，y省略时返回x位置到数组末尾的数组，不会改变原数组
Array.sort(arr || function)：传入类型是数组时，按照数组中元素的每位字符从左至右进行比较，比较出Unicode编码哪个大就是哪个元素大，不会比较后面的字符。一般排序使用函数改变规则，改变原数组
Array.concat(arr1, arr2, arr3...)：合并数组，不会改变原数组，按照顺序拼接
Array.reverse()：数组按元素下标进行逆序， 改变原数组
Array.join(str): 数组按照str分隔符连接成一个字符串，参数省略时分隔符为","  不改变原数组
Array.forEach(function(currentValue[,index[,array]])[,thisArg]): 对数组元素执行一次回调函数，操作元素会改变原数组
	currentValue 参数：必需参数，表示正在处理的数组元素（当前元素）；
	index 参数：可选参数，表示正在处理的当前元素的索引；
	array 参数：可选参数，表示方法正在操作的数组；
	thisArg 参数，可选参数，取值通常为 this，为空时取值为 undefined。

Array.filter(function(currentValue[,index[,array]])[,thisArg])：返回一个新数组，新数组组成是返回所有使回调函数返回值为 true 的元素，不改变原数组
	参数规则与forEach一样
Array.map(function(currentValue[,index[,array]])[,thisArg])：创建一个新的数组，其中的每个元素是指定数组的对应元素调用指定函数处理后的值，不改变原数组
	参数规则与forEach一样
Array.some(function(currentValue[,index[,array]])[,thisArg])：对元素进行回调函数操作，并返回一个Boolean值，只要有一个元素满足条件就会返回ture，并且不再往下执行，不改变原数组
	参数规则与forEach一样
Array.every(function(currentValue[,index[,array]])[,thisArg])：对元素进行回调函数操作，并返回一个Boolean值，全部元素满足条件才能返回ture，不改变原数组
	参数规则与forEach一样
Array.reduce(function(result, item, index, array), init)：按照索引顺序使用回调函数对数组中的每个元素进行处理，并将处理进行汇总返回，不改变原数组
	参数规则：
		result：必传，表示初始值（init）或者回调函数处理后的返回值；（如果init不传，初始值就为array[0]，此时item为array[1]）
		item：必传，当前正在处理的数组元素
		index：可选，当前正在处理的数组元素索引
		array：可选，当前进行reduce操作的数组
		init：可选，回调函数的第一次调用的第一个参数的值（如果进行reduce操作的是空数组，必须指定init值，否则会报错）

Array.reduceRight(function(result, item, index, array), init)：作用与reduce一样，只不过执行顺序按照索引逆序开始执行
	参数规则与reduce一样
Array.find(function(currentValue[,index[,array]])[,thisArg])：获取使回调函数值为 true 的第一个数组元素。如果没有符合条件的元素，将返回 undefined
	参数规则与forEach一样
Array.findIndex(function(currentValue[,index[,array]])[,thisArg])：获取使回调函数值为 true 的第一个数组元素索引值。如果没有符合条件的元素，将返回 -1
	参数规则与forEach一样
Array.indexOf(value, index)：从数组的开头开始向后寻找，返回要查找的项所在数组中首次出现的位置，没找到的话就返回-1
	value：必传，要查找的元素
	index：可选，开始检索的位置，不传默认为0
Array.lastIndexOf(value, index)：从数组的末尾开始向前寻找，返回要查找的项所在数组中首次出现的位置，没找到的话就返回-1
	参数规则与indexOf一样，只是index是从末尾开始算0
Array.keys()： 数组下标组成的类数组 Array.from(arr.keys());
Array.values()： 数组的每一项元素组成的类数组
Array.entries()： 数组的每一项是由当前下标和元素组成的数组，最后返回类数组
Array.includes(search, Index)： 用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false，不改变原数组
	search： 可选。需要查找的元素值；
	Index： 可选。从该索引处开始查找 search。如果为负值，则按升序从 array.length + Index 的索引开始搜索。默认为 0

Array.from(object)：  用于类似数组的对象（即有length属性的对象）和可遍历对象转为真正的数组
Array.of(a, b, c, d...)：  将一组值转变为数组，参数不分类型，只分数量，数量为0返回空数组
Array.fill(value, start, end)： 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引，改变原数组
	value： 必需。填充的值
	start： 可选。开始填充位置。如果这个参数是负数，那么它规定的是从数组尾部开始算起
	end： 可选。停止填充位置 (默认为 array.length)。如果这个参数是负数，那么它规定的是从数组尾部开始算起

Array.copyWithin(target, start, end)： 用于从数组的指定位置拷贝元素到数组的另一个指定位置中，会覆盖原有成员
	target：  必需。从该位置开始替换数据。
	start：  可选。从该位置开始读取数据，默认为 0 。如果为负值，表示倒数。
	end： 可选。到该位置前停止读取数据 (默认为 array.length)。如果为负值，表示倒数



# 字符串常用方法

str.charAt(index)： 返回 str 中 index 位置的字符，位置从0开始
str.charCodeAt(unicode)： 返回 str 中 index 位置的 unicode 值
String.fromCharcode(s1, s2, s3...)： 将一组 unicode 值转换为字符
str.concat(s1, s2, s3...)： 将多个字符串拼接并返回，不改变原有字符串
str.indexOf(str2, start)： 返回 str2 在 str 中第一次出现的索引，没有找到则返回 -1， start（可选）表示搜索的起始位置
str.lastIndexOf(str2, start)： 返回 str2 在 str 中最后一次出现的索引，没有找到则返回 -1， start（可选）表示搜索的起始位置
str.match(regexp)： 根据正则表达式 regexp 在 str 中搜索匹配项，没有匹配项则返回一个信息数组或 null
str.replace(regexp/str2, str3):  将字符串 str 中匹配字符串 str2 或匹配正则表达式 regexp 的字符串替换为 str3
str.search(regexp)： 返回匹配正则表达式 regexp 的字符串的起始位置，没找到则返回-1
str.slice(start, end)： 提取字符串 str 中从 start 开始到 end（可选）位置的所有字符， end 不传则提取 start 后面的所有字符
str.split(str2, limit)： 将字符串 str 按照字符 str2 分割成数组并返回，limit（整数，可选）为返回数组的最大长度
str.substr(start, length)： 返回字符串中从索引 start 开始的 length（可选） 个字符，没有length则返回start之后的全部字符
str.substring(start, end)： 提取字符串 str 中从 start 开始到 end（可选）位置的所有字符， end 不传则提取 start 后面的所有字符
str.toLowerCase()： 将字符串 str 的所有字符全部转换为小写并返回
str.toUpperCase()： 将字符串 str 的所有字符全部转换为大写并返回
str.includes(str2)： 检查字符串 str 中是否出现字符串 str2 ，有则返回一个布尔值 true，否则返回 false
str.endsWith(str2)： 检查字符串 str 是否以字符串 str2 结束，是则返回true，否则返回false
str.repeat(num)： 构造拼接 num 次 str 并返回
str.valueOf()： 返回一个String对象的原始值，等同于 String.prototype.toString()
str.trim()： 删除字符串 str 两端的所有空白字符



# 数字类型的常用方法

Number.toLocaleString()：将一个 Number 对象转换为本地格式的字符串
num.toString()： 将数字 num 转换为字符串
Number(item)： 将变量转换为数字，使用于隐式转换
parseInt(item)： 解析一个数字或字符串并返回一个整数，如果无法解析则返回 NaN
parseFloat(item)： 解析一个数字或字符串并返回一个浮点数，如果无法解析则返回 NaN
Math.min(n1, n2, n3...)： 返回一组数字中最小的数字，其中如果出现非数字则返回 NaN
Math.max(n1, n2, n3...)： 返回一组数字中最大的数字，其中如果出现非数字则返回 NaN
Math.abs(num): 返回数字 num 的绝对值，num 如果是非数字则返回 NaN
Math.ceil(num)： 返回大于或等于数字 num 的最近整数，向上取整，num 如果是非数字则返回 NaN
Math.foll(num)： 返回小于或等于数字 num 的最近整数，向下取整，num 如果是非数字则返回 NaN
Number.isInteger(num)： 判断数字 num 是否为整数，是则返回 true，否则返回 false
isNaN(item)： 检查 item 是否是非数字，返回一个布尔值
Math.trunc(num)： 去除数字 num 的小数部分并返回整数部分，num 如果是非数字则返回 NaN
Math.sign(num)： 判断数字 num 是否为正数、负数或+-0，分别返回 +1、-1或+-0，num 如果是非数字则返回 NaN
num.toFixed(num2)： 将数字 num 保留 num2 位小数并返回



# Object 常用方法
Object.assign({}, o1, o2...)： 返回所有可枚举属性的值组成的对象并返回，若属性名冲突后面的会覆盖前面的
Object.create(pro, settingAttr)： 创建一个新对象，从原型上继承pro，可以通过settingAttr指定对象属性，返回这个新对象
Object.defineProperties(obj, setting)： 在对象 obj 上新增属性或修改属性，并返回该对象
Object.defineProperty(obj, key, setting)： 修改对象 obj 中 key 属性的描述 setting （描述对象）
Object.keys(obj)： 返回一个包含 obj 自身所有可枚举属性名的数组
Object.values(obj)： 返回一个包含 obj 自身所有可枚举属性值的数组
Object.getOwnPropertyNames(obj)： 返回包含obj所有属性名的数组
Object.is(v1, v2)： 判断 v1 和 v2 的值是否相同，会判断类型（NaN 等于 NaN），返回一个布尔值
Object.entries(obj)： 返回对象 obj 的可枚举属性的键值对数组，顺序与 for...in 遍历该对象时一样
Object.freeze(obj)： 冻结对象 obj，在这之后 obj 对象的一切属性都不能再做更改，也不能新增和删除属性，也包括原型
Object.getOwnPropertyDescriptor(obj, key)： 获取对象 obj 中 key 属性的描述
obj.hasOwnProperty(key)： 判断对象 obj 本身是否存在 key 属性，不包含原型链，返回一个布尔值
obj1.isPrototypeOf(obj2)： 判断对象 obj1 是否存在于对象 obj2 的原型链上，或者说对象 obj2 是否继承自对象 obj1，返回一个布尔值
obj.propertyIsEnumerable(key)： 判断对象 obj 的 key 属性是否可枚举，返回一个布尔值
obj.toString()： 返回一个表示 obj 对象的字符串，可以用来检测对象类型
obj.watch(key, function(key, old, new))： 监听对象中 key属性的变化，并进行回调处理
obj.unwatch(key, function(key, old, new))： 监听对象中 key属性的变化，并进行回调处理
obj.valueOf()： 返回对象obj 的原始值
Object.getPrototypeOf(obj)： 返回对象 obj 的原型	
Object.setPrototypeOf(obj1, obj2)： 设置对象 obj1 的原型为 obj2


对象的 __proto__ 指向的是创建它的函数的 prototype
对象的原型链是沿着__proto__这条线走的，最后指向 Object.prototype
在函数中this到底取何值，是在函数真正被调用执行的时候确定的，函数定义的时候确定不了
javascript没有块级作用域，只有全局作用域和函数作用域