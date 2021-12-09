// 获取 Mongoose 
const mongoose = require("mongoose");

// 定义一个模式
const Schema = mongoose.Schema;

let SomeModelSchema = new Schema({
    a_string: String,
    a_date: Date
});

// 使用模式“编译”模型
const SomeModel = mongoose.model('SomeModel', SomeModelSchema);

const schema = new Schema({
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, default: Date.now },
    age: { type: Number, min: 18, max: 65, required: true },
    mixed: Schema.Types.Mixed,
    _someId: Schema.Types.ObjectId,
    array: [],
    ofString: [String], // 其他类型也可使用数组
    nested: { stuff: { type: String, lowercase: true, trim: true } }
})