var fs = require('fs');

// 创建可读流
var readerStream = fs.createReadStream("input.txt");

// 创建可写流
var writerStream = fs.createWriteStream("output.txt");

// 进行管道操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log("pipe 完毕");