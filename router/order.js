const Router = require('koa-router');
const Cart = require('../modules/Cart.js');
const Flower = require('../modules/Flower.js');
const Order = require('../modules/Order.js');
const User = require('../modules/User.js');

const router = new Router();

router.post('/create', async (ctx, next) => {
  const body = ctx.request.body;
  const { flowers, address } = body;
  console.log('userId', ctx.userId);
  if (!flowers || !flowers.length) {
    ctx.fail('参数不能为空');
  } else {
    const newArr = flowers.map(item => item.id);
    const userInfo = await User.findOne({ _id: ctx.userId });
    // 查询所有商品的价格并且相加
    const allPriceArr = await Flower.find({ _id: { $in: newArr } }, { price: 1 });
    const result = await Order.create({
      flowers,
      total: flowers.reduce((prev, item) => prev + item.num * item.price, 0),
      userId: ctx.userId,
      address: address || '',
    });
    const res = await Cart.deleteMany({ flowerId: { $in: newArr } });
    console.log('创建订单并且删除购物车', res);
    ctx.success({ id: result._id });
  }
  next();
});


router.get('/list', async (ctx, next) => {
  const { role, userId } = ctx;
  let result = [];
  // 如果是系统管理员则返回全部订单
  if (role === 'admin') {
    result = await Order.find();
  } else {
    result = await Order.find({ userId });
  }
  ctx.success({
    list: result,
  });
  next();
});


router.get('/all_status', async (ctx, next) => {
  const list = [
    {
      type: '00',
      v: '未支付',
    },
    {
      type: '01',
      v: '已支付',
    },
    {
      type: '02',
      v: '已取消',
    },
    {
      type: '03',
      v: '已发货',
    },
    {
      type: '04',
      v: '已完成',
    },
    {
      type: '05',
      v: '超时未支付',
    },
    {
      type: '06',
      v: '商家关闭',
    },
  ];
  ctx.success({
    list,
  });
  next();
})


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
  const { role } = ctx;
  console.log(role, '身份');
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.status = role === 'admin' ? '06' : '02';
    result.save();
    ctx.success({ id });
  }
  next();
});


// 完成订单
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

/**
 * 订单支付
 */
router.post('/pay', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    const { userId } = ctx;
    const userInfo = await User.findOne({ _id: userId });
    // 判断用户余额是否大于订单的金额
    const { total } = result;
    const { balance } = userInfo;
    if (balance < total) {
      ctx.fail('余额不足， 请联系管理员充值', 100001);
    } else {
      console.log(userInfo, '发起支付的用户', id);
      result.status = '01';
      result.payType = '余额支付';
      userInfo.balance = balance - total;
      await result.save();
      await userInfo.save();
      ctx.success({ id, msg: '支付成功' });
    }
  }
  next();
})


/**
 * 删除订单
 */
router.post('/delete', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.deleteOne({ _id: id });
    console.log(result, '删除订单');
    ctx.success(null);
  }
  next();
});

/**
 * 修改订单
 */
router.post('/update', async (ctx, next) => {
  const { id, address } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.address = address;
    await result.save();
    ctx.success(null);
  }
  next();
});

/**
 * 订单出库
 */
router.post('/shipped', async (ctx, next) => {
  const { id } = ctx.request.body;
  console.log('ctx.params', ctx.params);
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.status = '03';
    await result.save();
    ctx.success(null);
  }
  next();
})

router.post('/sign', async (ctx, next) => {
  const { id } = ctx.request.body;
  console.log('sign', id);
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Order.findOne({ _id: id });
    result.status = '04';
    await result.save();
    ctx.success(null);
  }
  next();
});

module.exports = router;