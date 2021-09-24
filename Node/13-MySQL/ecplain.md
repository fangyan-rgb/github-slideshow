### Node.js 连接 MySQL


## 安装驱动

```js
    npm install mysql
```


## 连接数据库

```js
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
})

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if(error) throw error;
    console.log('The solution is: ', results[0].solution);
})
```