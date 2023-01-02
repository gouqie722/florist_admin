const Koa = require('koa');
const static = require('koa-static');
// const Router = require('koa-router');
const session = require('koa-session');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body').default;
const path = require('path');

require('./modules/index.js');
const routerResponse = require('./router/routerResponse.js');

const routerApi = require('./router/index.js');

const jwt = require('./router/jwt.js');

const app = new Koa();

app.keys = ['some secret hurr'];

app.use(session({
  key: 'koa.sess',
  maxAge: 29999000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: false, /** (boolean) secure cookie*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */

}, app));

app.use(cors({
  origin: '*',
  credentials: true,
}));


// 统一响应返回的数据
app.use(routerResponse());

// 静态资源
app.use(static(__dirname + '/public', {
  index: true,
  hidden: false,
  defer: true,
}));

const filter = ['/api/user/login', '/api/user/register'];

app.use(async (ctx, next) => {
  const result = jwt.verify(ctx);
  const isApi = /^\/api/;
  const url = ctx.request.url;
  // 认证失败
  // console.log(url, filter.includes(url), result);
  if (isApi.test(url) && !filter.includes(url) && !result) {
    ctx.fail('登录失效', 403);
    return;
  }
  // console.log(result, '验证');
  if (isApi.test(url) && !filter.includes(url)) {
    ctx.userId = result.userId;
  }
  await next();
});

app.use(koaBody({
  multipart: true,
  formidable: {
    // 上传存放的路劲
    uploadDir: path.join(__dirname,'./public/upload'),
    // 保持后缀名
    keepExtensions: true,
    // 文件大小
    // maxFileSize: 5000,
    onFileBegin: (name, file) => {
      // 获取后缀, 如: .js  .txt
      const reg = /\.[A-Za-z]+$/g;
      const ext = file.originalFilename.match(reg)[0];
      //修改上传文件名
      // file.filepath = path.join(__dirname, '/public/upload/', 123 + ext);
      // console.log(file, 'file对象', name);
    },
    onError(err) {
      console.log(err)
    }
  }
}))

app.use(bodyParser());

// api
app.use(routerApi.routes());

app.listen(3000, () => console.log('server is running'));