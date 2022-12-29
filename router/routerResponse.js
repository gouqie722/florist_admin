module.exports = function (options = {}) {
  return async function (ctx, next) {
    ctx.success = function (data) {
      ctx.type = options.type || 'json'
      ctx.body = {
        code: options.code || 0,
        msg: options.msg || 'success',
        data
      }
    }

    ctx.fail = function (data) {
      ctx.type = options.type || 'json'
      ctx.body = {
        code: options.code || 500,
        msg: data || 'fail',
        // data
      }
    }

    await next();
  }
}