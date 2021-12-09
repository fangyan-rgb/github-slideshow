// 导入 mongoose 模块
const mongoose = require("mongoose");

// 设置 Mongoose 连接
const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;

// 将连接与错误时间绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误;'));