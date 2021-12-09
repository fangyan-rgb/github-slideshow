const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genreSchema = new Schema({
    // 出版项
    name: {type: String, required: true}
  }
);

// 虚拟属性'url'：藏书副本 URL
genreSchema
  .virtual('url')
  .get(function () {
    return '/catalog/genre/' + this._id;
  });

// 导出 genre 模型
module.exports = mongoose.model('genre', genreSchema);