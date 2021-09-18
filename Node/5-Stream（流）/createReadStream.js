var fs = require("fs");
var data = "";

// 创建可读流
var readerStream = fs.createReadStream("input.txt");

// 设置编码为 utf-8
readerStream.setEncoding("UTF8");

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
    data += chunk;
});

readerStream.on('end', function(){
    console.log('end', data);
});

readerStream.on('error', function(err) {
    console.log('error', err.stack);
});

console.log('流事件读取完毕');