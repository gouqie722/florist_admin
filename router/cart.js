const Router = require('koa-router');
const Cart = require('../modules/Cart.js');
const Flower = require('../modules/Flower.js');

const router = new Router();

// (async function () {
//   await Cart.create({ flowerId: '63b05a79b0c158bd12b7fbdc', num: 2 });
//   const result = await Cart.find();
//   const newArr = result.map(item => item.flowerId);
//   const flowers = await Flower.find({ _id: { $in: newArr } });
//   console.log(result.map((item, index) => ({ ...flowers[index], num: result[index].num, addTime: result[index].addTime })), '购物车查询结果');
// })();


router.post('/add', async (ctx, next) => {
  const body = ctx.request.body;
  const cartItem = await Cart.findOne({ flowerId: body.flowerId });
  console.log('添加到购物车 userId', ctx.userId);
  if (cartItem) {
    cartItem.num += body.num;
    cartItem.save();
    console.log(cartItem, '已保存');
  } else {
    const result = await Cart.create({ ...body, userId: ctx.userId });
    console.log(result, '添加成功');
  }
  const list = await Cart.find({ userId: ctx.userId });
  // console.log(list, '购物车列表');
  ctx.success({ flowerId: body.flowerId, total: list.length });
  next();
});


router.get('/list', async (ctx, next) => {
  // console.log('购物车列表 userId', ctx.userId)
  const result = await Cart.find({ userId: ctx.userId });
  const newArr = result.map(item => item.flowerId);
  const flowers = await Flower.find({ _id: { $in: newArr } });
  const list = result.map((item, index) => ({
    ...flowers[index],
    num: result[index].num,
    addTime: result[index].addTime,
    flowerId: result[index].flowerId,
    cartItemId: result[index]._id,
  }));
  console.log(list, '购物车查询结果', result);
  ctx.success({ list });
  next();
})

/**
 * 购物车商品数量的加减
 */
router.post('/changeNum', async (ctx, next) => {
  const body = ctx.request.body;
  const cartItem = await Cart.findOne({ _id: body._id });
  cartItem.num = body.num;
  await cartItem.save();
  console.log(await Cart.findOne({ _id: body._id }), 'changeNum');
  ctx.success({ _id: body._id, num: cartItem.num });
  next();
});

router.post('/delete', async (ctx, next) => {
  const body = ctx.request.body;
  console.log(body, 'body');
  const res = await Cart.deleteOne({ _id: body._id });
  console.log('删除成功', res, await Cart.findById(body._id));
  ctx.success(res);
  next();
})

router.post('/clear', async (ctx, next) => {
  const result = await Cart.remove();
  console.log('清空购物车', result);
  ctx.success(null);
  next();
})

module.exports = router;