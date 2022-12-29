const Koa = require('koa');
const static = require('koa-static');
// const Router = require('koa-router');
const session = require('koa-session');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');

require('./modules/index.js');
const routerResponse = require('./router/routerResponse.js');

const routerApi = require('./router/index.js');

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

// app.use(cors({
//   origin: 'http://localhost:3000/'
// }));

// 静态资源
app.use(static(__dirname + '/public', {
  index: true,
  hidden: false,
  defer: true,
}))

app.use(bodyParser());

// 统一响应返回的数据
app.use(routerResponse());

// api
app.use(routerApi.routes());

app.listen(3000, () => console.log('server is running'));