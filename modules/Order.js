// 1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const OrderSchema = new mongoose.Schema({
  flowers: {
    type: [{
      num: Number,
      id: String,
      price: Number,
    }],
    required: true,
  },
  orderNo: {
    type: Number,
    default: () => new Date().getTime(),
  },
  total: Number,
  createTime: {
    type: Number,
    default: () => new Date().getTime(),
  },
  // 订单有效时间
  expiration: {
    type: Number,
    default: new Date().getTime() + 1000 * 60 * 60 * 2,
  },
  // 配送地址
  // address: {
  //   type: String,
  //   required: true,
  // },
  // 订单状态 00: 未支付  01: 已支付  02: 已取消  03: 已发货 04：已完成 05：超时未支付 06: 商家关闭
  status: {
    type: String,
    default: '00',
  },
  userId: {
    type: String,
    required: true,
  }
}); // versionKey: 用于解决并发冲突


OrderSchema.plugin(updateIfCurrentPlugin);
// 2. 通过User Schema定义模型，最终导出模型
module.exports = mongoose.model('Order', OrderSchema);