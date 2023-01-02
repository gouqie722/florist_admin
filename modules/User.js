// 1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const uuid = require('uuid').v4;

const userSchema = new mongoose.Schema({
  // Schema 的配置
  uuid: {
    type: String,
    default: uuid(),
    // 将该字段设置为索引
    index: true,
    // 特殊索引，唯一索引
    unique: true,
  },
  username: String,
  password: String,
  headImg: String,
  role: {
    type: String,
    default: 'editor', // 用户角色 editor表示用户，admin表示系统管理员
  },
  phone: {
    type: Number || String,
    default: null,
  },
  createTime: {
    type: Number,
    default: Date.now(),
  },
  introduce: {
    type: String,
    default: '',
  }
}); // versionKey: 用于解决并发冲突


userSchema.plugin(updateIfCurrentPlugin);
// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('User', userSchema);