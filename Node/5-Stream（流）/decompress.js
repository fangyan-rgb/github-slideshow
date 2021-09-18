var fs = require("fs");
var zlib = require('zlib');

// 解压 inpu.txt.gz 文件为 input.txt 
fs.createReadStream('input.txt.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('input.txt'));

console.log("文件解压完成");