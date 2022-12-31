const jwt = require('jsonwebtoken');
const secret = 'florist_admin';


exports.publish = function (ctx, maxAge = 3600 * 24, info = {}) {
  const token = jwt.sign(info, secret, { expiresIn: maxAge });
  ctx.success({ token });
  return token;
}


exports.verify = function (ctx) {
  const token = ctx.request.headers.token;
  // 没有token
  if (!token) {
    return null;
  }
  try {
    const result = jwt.verify(token, secret);
    return result;
  } catch {
    return null;
  }  
}