### Node.js Express 框架

## Express 简介

Express 是一个简洁而灵活的 node.js Web 应用框架，提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。
使用 Express 可以快速地搭建一个完整功能的网站。
Express 框架核心特性：
    -  可以设置中间件来响应 HTTP 请求
    -  定义了路由表用于执行不同的 HTTP 请求动作
    -  可以通过向模板传递参数来动态渲染 HTML 页面


##　安装 Express

** npm install express --save

使用 npm 将 Express 框架安装在当前目录的 node_modules 目录中，node_modules 目录下会自动创建 express 目录。以下几个重要的模块是需要与 express框架一起安装的：
- body-parser  node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
- cookie-parser  这就是一个解析 Cookies 的工具，通过 req.cookies 可以取到传过来的 cookie，并把他们转成对象。
- multer  node.js 中间件，用于处理 enctype="multeipart/form-data" （设置表单的 MME 编码）的表单数据。

** npm install body-parser --save
** npm install cookie-parser --save
** npm install multer --save

可以使用 **npm list express** 查看当前 Express 的版本号


## 第一个 Express 框架实例
属于 Express 的 “Hello World”

# dome http://localhost:8081

```js
// express_demo.js 文件 http://localhost:8081
var express = require("express");
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World');
})

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
```


## 请求和响应

Express 应用使用回调函数的参数: request 和 response 对象来处理请求和响应的数据。

```js
app.get('/', function(req, res) {
    // ...
})
```

# Request 对象

request 对象表示 HTTP 请求，包含了请求查阅字符串，参数，内容，HTTP 头部等属性。常见的属性有：
1. req.app: 当 callback 为外部文件时，用 req.app 访问 express 的实例
2. req.baseUrl: 获取路由当前安装的 URL 路径
3. req.body/req.cookies: 获得 请求主体/Cookies
4. req.fresh/req.stale: 判断请求是否还新鲜
5. req.hostname/req.ip: 获取主机名和 IP 地址
6. req.originalUrl: 获取原始请求 URL
7. req.params: 获取路由的 parameters
8. req.path: 获取请求路径
9. req.protocol: 获取当前匹配的路由
10. req.query: 获取 URL 的查询参数串
11. req.route: 获取当前匹配的路由
12. req.subdomains: 获取子域名
13. req.accepts(): 检查可接受的请求的文档类型
14. req.acceptsCharsets()/req.acceptsEncodings/req.acceptsLanguages: 返回指定字符集的第一个可接受字符编码
15. req.get(): 获取指定的 HTTP 请求头
16. req.is(): 判断请求头 Content-Type 的 MME 类型

# Response 对象

response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。常见属性有：
1. res.app: 同 req.app
2. res.append(): 追加指定 HTTP 头
3. res.set() 在 res.append() 后将重置之前设置的头
4. res.cookie(name,value[, option]): 设置 Cookie
5. option: domain/expires/httpOnly/maxAge/path/secure/signed
6. res.clearCookie(): 清除 Cookie
7. res.download(): 传送指定路径的文件
8. res.get(): 返回指定的 HTTP 头
9. res.json(): 传送 JSON 响应
10. res.jsonp(): 传送 JSONP 响应
11. res.location(): 只设置响应的 Location HTTP 头，不设置状态码或者 close response
12. res.redirect(): 设置响应的 Location HTTP 头，并且设置状态码 302
13. res.render(view, [locals], callback): 渲染一个 view，同时向 callback 传递渲染后的字符串，如果在渲染过程汇总有错误发生 next(err) 将会被自动调用。callback 将会被传入一个可能发生的错误以及渲染后的野蛮，这样就不会自动输出了
14. res.send(): 传送 HTTP 响应
15. res.sendFile(path[, options][, fn]): 传送指定路径的文件会自动根据文件 extension 设定 Content-Type
16. res.set(): 设置 HTTP 头，传入 object 可以一次设置多个头
17. res.status(): 设置 HTTP 状态码
18. res.type(): 设置 Content-Type 的 MME 类型


## 路由

我们已经了解了 HTTP 请求的基本应用，而路由决定了由谁（指定脚本）去响应客户端请求。
在 HTTP 请求中，我们可以通过路由提取出请求的 URL 以及 GET/POST 参数。
接下来我们扩展 Hello World，添加一些功能来处理更多类型的 HTTP 请求。

# demo2 http://localhost:8081

```js
// express_demo2.js
var express = require('express');
var app = express();

// 主页输出 "Hello World"
app.get("/", function(req, res) {
    console.log("主页 GET 请求");
    res.send("Hello GET");
});

// POST 请求
app.post('/', function(req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
});

// /del_user 页面响应
app.get('/del_user', function(req, res){
    console.log("/del_user 响应 DELETE 请求");
    res,send("删除页面");
});

// /list_user 页面 GET 请求
app.get('/list_user', function(req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
});

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
```


## 静态文件

Express 提供了内置的中间件 express.static 来设置静态文件如：图片，CSS，JavaScript等。
你可以使用 express.static 中间件来设置静态文件路径。例如，如果你将乳片，CSS，JavaScript 文件放在 public 目录下，你可以这么写：

```js
app.use('/public', express.static('public'));
```

添加 public/images 目录，并放上些图片。
再修改下 “Hello World” 应用添加处理静态文件的功能。

# demo http://localhost:8081/public/images/2021032315371.jpeg

```js
// express_demo3.js

var express = require('express');
var app = express();

app.use('/public', express.static('public'));

app.get('/', function(req, res) {
    res.send('Hello World');
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
})
```


## GET 方法

# demo -> /GET

```html
<!-- index.html -->
<html>
    <body>
        <form action="http://127.0.0.1:8081/process_get" method="GET">
            first Name: <input type="text" name="first_name"/> <br/>
            Last Name: <input type="text" name="last_name">
            <input type="submit" value="Submit">
        </form>
    </body>
</html>
```

```js
// server_get.js
var express = require("express");
var app = express();

app.use('/public', express.static('public'));

app.get('/index.html', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

app.get('/process', function(req, res) {
    // 输出 JSON 格式
    var response = {
        "first_name": req.query.first_name,
        "last_name": req.query.last_name
    }
    console.log(response);
    res.end(JSON.stringify(response));
});

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
```


## POST 方法

# demo -> /POST

```js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParse = bodyParser.urlencoded({extended: false});

app.use('/public', express.static('public'));

app.get('/index.html', function(req, res) {
    res.sendFile( __dirname + "/" + "index.html");
});

app.post("/process", urlencodedParse, function(req, res) {
    // 输出 JSON 格式
    var response = {
        "first_name": req.query.first_name,
        "last_name": req.query.last_name
    }
    console.log(response);
    res.end(JSON.stringify(response));
});

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
```


## 文件上传

# demo -> /upload

```html
<html>
    <head>
        <title>文件上传表单</title>
    </head>
    <body>
        <h3>文件上传</h3>
        选择一个文件上传：<br/>
        <form action="/file_upload" method="post" enctype="multipart/form-data">
            <input type="file" name="image" size="50"/> <br/>
            <input type="submit" value="上传">
        </form>
    </body>
</html>
```

```js
var express = require("express");
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');
const { response } = require("express");

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: '/tmp'}).array('image'));

app.get("/upload.html", function(req, res) {
    res.sendFile( __dirname + "/upload.html");
});

app.post('/file_upload', function(req, res) {
    console.log(req.files[0]); // 上传的文件信息

    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function(err, data) {
        fs.writeFile(des_file, data, function(err) {
            if(err) {
                console.log(err);
            } else {
                 var response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                }
            }
            console.log(response);
            res.end( JSON.stringify( response ));
        });
    });
});

var server = app.listen(8081, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
```


## Cookie 管理

通过中间件 cookie-parser 向 Node.js 服务器发送 cookies 信息：

```js
// express_cookie.js
var  express = require('express');
var cookieParser = require('cookie-parser');
var util = require("util");

var app = express();
app.use(cookieParser());

app.get("/", function(req, res) {
    console.log("Cookies:" + util.inspect(req.cookies));
});

app.listen(8081);
```