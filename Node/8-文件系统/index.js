var fs = require("fs");

// 异步打开文件
console.log("准备打开文件");
fs.open("input.txt", "a", function(err, fd){
    if(err) {
        return console.log('err： ', err);
    }
    console.log("文件打开成功");
});