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



module.exports = router;