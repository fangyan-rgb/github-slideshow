var fs = require('fs');

// 同步的获取文件
// var data = fs.readFileSync('./input.txt');

// console.log("data", data); 1

// console.log("data.toString", data.toString()); 2
// 同步执行

// 异步
var data = fs.readFile('input.txt', function(err, data) {
    if(err) return console.error(err);
    console.log(data.toString());
});

console.log("异步执行");