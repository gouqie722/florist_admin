// 1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const CartSchema = new mongoose.Schema({
  num: Number,
  flowerId: String,
  addTime: {
    type: Number,
    default: () => new Date().getTime(),
  },
  userId: {
    type: String,
    required: true,
  }
}); // versionKey: 用于解决并发冲突


CartSchema.plugin(updateIfCurrentPlugin);
// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('Cart', CartSchema);