const Router = require('koa-router');
// const jwt = require('jsonwebtoken');
const User = require('../modules/User.js');
const jwt = require('./jwt.js');
// 设置前缀
const router = new Router();

(async function () {
  // await User.create({
  //   username: '123',
  //   password: '456',
  //   headImg: 'http://localhost:3000/upload/94329cd243cd027f123cde700.png',
  // });
  // await User.deleteMany({
  //   _id: '63b04cb517d5885412c706f6'
  // });
  // await User.remove();
  // const result = await User.find({ _id: { $in: ['63b0533bd2082c8609e05fd0', '63b05356c0f567f180f1875c'] } });
  // console.log(result, '查询结果');
  // const result = await User.findOne({ username: 'editor' })
  // result.phone = 123;
  // result.introduce = '用户';
  // result.save();
  // console.log(result, '修改成功');
})();

// 秘钥
const secret = 'florist_admin';

router.post('/login', async (ctx) => {
  const body = ctx.request.body;
  const { username, password } = body;
  if (!username || !password) {
    ctx.fail(!username ? '用户名不能为空' : '密码不能为空');
    return;
  }

  const result = await User.find({
    username,
  });
  console.log(result, '登录');
  if (!result.length) {
    ctx.fail(username + ' 该用户不存在');
    return;
  }
  // 验证密码是否正确
  const token = jwt.publish(ctx, 3600 * 2, {
    userId: result[0]._id,
    role: result[0].role,
  })
  console.log(result[0]._id, '查询结果 用户id', token);
  // 验证 如果验证不通过抛出错误
  // console.log(jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiIxMjMiLCJpYXQiOjE2NzIzMjkzMDcsImV4cCI6MTY3MjMyOTMxMn0.Iya7Pgoih1Laq0OhbNU46B9PdXoNCuk4e7hrkusybuc', secret, 'verify'));
  // console.log(body, 'login', token);
  // console.log(jwt.decode(token), '解密');
  // //设置session
  // ctx.session.userState = true;
  // ctx.session.username = body.username;
  // //设置cookie
  // ctx.cookies.set(
  //     'sessionId',// name
  //     body.username,    //value(可替换为token)
  // );
  ctx.success({ token, ...result[0] });
});


// 退出登录
router.post('/loginOut', async (ctx, next) => {
  ctx.success('退出登录成功');
  next();
})

router.get('/info/:id', async (ctx, next) => {
  const result = await User.findById(ctx.params.id);
  console.log(result, '用户信息');
  ctx.success(result);
  next();
})

router.post('/register', async (ctx, next) => {
  const body = ctx.request.body;
  const { username, password, headImg } = body;
  if (!username || !password) {
    ctx.fail('用户名或密码不能为空');
    next();
    return;
  }
  if (!headImg) {
    ctx.fail('头像不能为空');
    next();
    return;
  }
  const result = await User.find({
    username,
  });
  if (result.length) {
    ctx.fail('该用户已存在');
    next();
    return;
  }
  console.log(body, '注册 result ====', result);
  await User.create(body);
  ctx.success({ username });
  next();
})

router.post('/update', async (ctx, next) => {
  const body = ctx.request.body;
  const { _id, ...reset } = body;
  const result = await User.findOne({ _id });
  if (!result) {
    ctx.fail('该用户不存在');
  } else {
    // console.log(reset, '更新前的信息');
    const res = await User.updateOne({ _id }, { ...reset });
    ctx.success({ _id: body._id });
  }
  next();
})

router.get('/roles', async (ctx, next) => {
  ctx.success({ list: [
    { name: 'admin', description: '管理员', level: 0 },
    { name: 'editor', description: '编辑人员', level: 1 }
  ] });
  next();
});


router.get('/list', async (ctx, next) => {
  const result = await User.find();
  ctx.success({ list: result });
  next();
})

router.post('/delete', async (ctx, next) => {
  const { _id } = ctx.request.body;
  const result = await User.findOne({ _id });
  if (!result) {
    ctx.fail('该用户不存在');
  } else {
    await User.deleteOne({ _id });
    ctx.success();
  }
  next();
})

router.post('/recharge', async (ctx, next) => {
  const { _id, number } = ctx.request.body;
  const result = await User.findOne({ _id });
  result.balance += Number(number);
  await result.save();
  ctx.success();
  next();
})
module.exports = router;