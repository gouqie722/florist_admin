const Router = require('koa-router');
const user = require('./user.js');

// 设置前缀
const router = new Router({
  prefix: '/api'
});

router.use('/user', user.routes());

router.use('/log', ctx => {

});

module.exports = router;