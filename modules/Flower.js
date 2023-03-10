// 1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const { plugin } = require('mongoose-auto-increment-fix');

const FlowerSchema = new mongoose.Schema({
  // 花的名字
  name: String,
  // 图片
  coverImg: String,
  // 上架时间
  putTime: {
    type: Number,
    default: () => new Date().getTime(),
  },
  // 花的种类
  type: String,
  // 过期时间
//   expiration: Number,
  // 价格
  price: String,
  // 热门级别
  hot: Number,
  // 库存
  stockNum: Number,
  // 描述信息
  describe: String,
  // 是否已下架 00 01
  lower: {
    type: String,
    default: '01',
  },
}); // versionKey: 用于解决并发冲突

FlowerSchema.plugin(updateIfCurrentPlugin);
FlowerSchema.plugin(plugin, { model: 'Flower', field: 'number' });

// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('Flower', FlowerSchema);;