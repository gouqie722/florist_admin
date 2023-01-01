const Router = require('koa-router');
const Cart = require('../modules/Cart.js');
const Flower = require('../modules/Flower.js');
const Order = require('../modules/Order.js');

const router = new Router();

router.post('/create', async (ctx, next) => {
  const body = ctx.request.body;
  const { flowers } = body;
  if (!flowers || !flowers.length) {
    ctx.fail('参数不能为空');
  } else {
    const newArr = flowers.map(item => item.id);
    // 查询所有商品的价格并且相加
    const allPriceArr = await Flower.find({ _id: { $in: newArr } }, { price: 1 });
    const result = await Order.create({
      flowers,
      total: allPriceArr.reduce((prev, item) => prev + item, 0),
      address: '广东省广州市天河区',
    });
    const res = await Cart.deleteMany({ flowerId: { $in: newArr } });
    console.log('创建订单并且删除购物车', res);
    ctx.success({ id: result._id });
  }
  next();
});




// 查看订单详情
router.get('/detail/:id', async (ctx, next) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    ctx.success(result);
  }
  next();
});

// 取消订单
router.post('/cancel', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.status = '02';
    result.save();
    ctx.success({ id });
  }
  next();
});


router.post('/done', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.status = '04';
    result.save();
    ctx.success({ id });
  }
  next();
})

module.exports = router;