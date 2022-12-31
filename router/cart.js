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

});


router.get('/list', async (ctx, next) => {
  const result = await Cart.find();
  const newArr = result.map(item => item.flowerId);
  const flowers = await Flower.find({ _id: { $in: newArr } });
  const list = result.map((item, index) => ({ ...flowers[index], num: result[index].num, addTime: result[index].addTime }));
  console.log(list, '购物车查询结果');
  ctx.success({ list });
  next();
})


module.exports = router;