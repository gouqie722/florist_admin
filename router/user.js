const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../modules/User.js');
// 设置前缀
const router = new Router();

// 秘钥
const secret = 'florist_admin';
// User.create({
//   username: '123',
//   password: '456'
// });
router.post('/login', async (ctx) => {
  // ctx.session.isLogin = true;
  const body = ctx.request.body;
  const { username, password } = body;
  if (!username || !password) {
    ctx.fail(!username ? '用户名不能为空' : '密码不能为空');
    return;
  }

  const result = await User.find({
    username,
    password,
  });
  if (!result.length) {
    ctx.fail(username + ' 该用户不存在');
    return;
  }
  const token = jwt.sign({
    id: 1,
    username,
  }, secret, {
    expiresIn: 5,// 多少秒后过期
  });
  console.log(result, '查询结果');
  // 验证 如果验证不通过抛出错误
  // console.log(jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiIxMjMiLCJpYXQiOjE2NzIzMjkzMDcsImV4cCI6MTY3MjMyOTMxMn0.Iya7Pgoih1Laq0OhbNU46B9PdXoNCuk4e7hrkusybuc', secret, 'verify'));
  console.log(body, 'login', token);
  // console.log(jwt.decode(token), '解密');
  // //设置session
  // ctx.session.userState = true;
  // ctx.session.username = body.username;
  // //设置cookie
  // ctx.cookies.set(
  //     'sessionId',// name
  //     body.username,    //value(可替换为token)
  // );
  ctx.success({ token });
});

router.get('/getUsers', async (ctx, next) => {
  console.log(ctx.session, 'session');
  console.log(ctx.cookies.request.headers.cookie, 'cookie');
  const userState = ctx.session.userState;
  const username = ctx.session.username;
  if (ctx.session.userState) {
    console.log(username);
  }
  ctx.success('getUsers === ');
  next();
})

router.get('/register', async (ctx, next) => {
  ctx.body = 'register';
  next();
})

module.exports = router;