const Router = require('koa-router');
const Flower = require('../modules/Flower.js');

const router = new Router();

router.post('/add', async (ctx, next) => {
  const body = ctx.request.body;
  const result = await Flower.create(body);
  console.log(result, '添加成功');
  ctx.success({
    id: result._id,
  });
  next();
})

router.post('/upper_or_lower', async (ctx, next) => {
  const { lower, id } = ctx.request.body;
  if (!lower || !id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Flower.findOne({ _id: id });
    if (!result) {
      ctx.fail('该花品不存在');
    } else {
      result.lower = lower;
      result.save();
      ctx.success({ id: result._id });
    }
  }
  next();
});

router.get('/list', async (ctx, next) => {
  const result = await Flower.find();
  ctx.success({
    list: result,
  });
  next();
});


router.get('/detail/:id', async (ctx, next) => {
  const { id } = ctx.params;
  const result = await Flower.findOne({ _id: id });
  ctx.success({ result });
  next();
})

router.post('/delete', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Flower.findOneAndDelete({ _id: id });
    console.log(result, '删除商品');
    ctx.success(null);
  }
  next();
})


router.post('/update', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Flower.findByIdAndUpdate({ _id: id });
    console.log(result, '删除商品');
    ctx.success({ id: result._id });
  }
  next();
})

module.exports = router;