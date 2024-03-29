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
      await result.save();
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

router.get('/flower_types', async (ctx, next) => {
  const list = [
  {
    type: '00',
    v: '切花'
  },
  {
    type: '01',
    v: '切叶'
  },
  {
    type: '02',
    v: '绿植'
  },
  {
    type: '03',
    v: '盆花'
  },
  {
    type: '04',
    v: '玫瑰'
  },
  {
    type: '05',
    v: '其他'
  },
];
  ctx.success({
    list,
  });
  next();
});


router.get('/detail/:id', async (ctx, next) => {
  const { id } = ctx.params;
  const result = await Flower.findOne({ _id: id });
  ctx.success({ result });
  next();
});

router.get('/batch', async (ctx, next) => {
  const { list } = ctx.query;
  let ids = JSON.parse(list);
  ids = ids.map(item => ({ _id: item }));
  const result = await Flower.find({ $or: ids });
  console.log('params', ids);
  ctx.success({ list: result });
  next();
})

router.post('/delete', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Flower.deleteOne({ _id: id });
    console.log(result, '删除商品');
    ctx.success(null);
  }
  next();
})


router.post('/update', async (ctx, next) => {
  const { _id, ...rest } = ctx.request.body;
  console.log(_id, rest, '更新');
  if (!_id) {
    ctx.fail('参数不能为空');
  } else {
    const result = await Flower.updateOne({ _id, ...rest });
    console.log(result, '更新商品');
    ctx.success({ id: result._id });
  }
  next();
})

module.exports = router;