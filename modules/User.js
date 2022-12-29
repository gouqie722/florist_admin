// 1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const userSchema = new mongoose.Schema({
  // Schema 的配置
  username: String,
  password: String,
}); // versionKey: 用于解决并发冲突


userSchema.plugin(updateIfCurrentPlugin);
// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('User', userSchema);