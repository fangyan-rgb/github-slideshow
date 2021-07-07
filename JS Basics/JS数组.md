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
Array.forEach(function(currentValue[,index[,array]])[,thisArg]): 对数组元素执行一次回调函数，不改变原数组
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