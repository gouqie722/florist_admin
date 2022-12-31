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
    type: Number,
    default: 0, // 用户角色 0表示用户，1表示系统管理员
  },
  phone: {
    type: Number,
    default: null,
  }
}); // versionKey: 用于解决并发冲突


userSchema.plugin(updateIfCurrentPlugin);
// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('User', userSchema);