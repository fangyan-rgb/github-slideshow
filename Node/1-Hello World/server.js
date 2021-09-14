var http = require('http');

http.createServer(function(request, response){
    // writeHead -> 发送 HTTP 头部
    // HTTP 状态值：200
    // 内容类型: text/plain
    response.writeHead(200, {"Content-Type": "text/plain"});

    // end -> 发送响应数据 "Hello World"
    response.end("Hello World\n");
}).listen(8888);

console.log("端口号为8888的服务器响应");