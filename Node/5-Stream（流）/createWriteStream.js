var fs = require("fs");
var data = "通过 createWriteStream.js 写入 Hello world";

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream("output.txt");

// 使用 utf-8 编码写入数据
writerStream.write(data, "UTF8");

// 标记文件末尾
writerStream.end();

// 处理流事件 --> finish、error
writerStream.on('finish', function() {
    console.log("已写入流");
});

writerStream.on('error', function(err) {
    console.log(err.stack);
});

console.log("写入流已执行完毕");