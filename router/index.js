const Router = require('koa-router');
const user = require('./user.js');
const flower = require('./flower.js');
const cart = require('./cart.js');
const order = require('./order.js');

// 设置前缀
const router = new Router({
  prefix: '/api'
});

router.use('/user', user.routes());

router.use('/flower', flower.routes());

router.use('/cart', cart.routes());

router.use('/order', order.routes());

router.use('/log', ctx => {

});


router.post('/upload', async (ctx, next) => {
  const files = ctx.request.files; // 获取上传的image数据
  const filepath = 'http://39.108.186.101:3000/upload/' + files.file.newFilename;
  // console.log(filepath, '文件');
  ctx.success({ filepath });
  next();
})


module.exports = router;