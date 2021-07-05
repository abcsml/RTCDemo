const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const cors = require('koa2-cors')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

// conf
global.app = {
    // deadLine:10,    // min
    clearTime: 21,     // 回收器回收间隔
    delayTime: 0.5,    // 延迟响应时间
    waitTime: 10,      // 等待函数默认等待时间
    blockRoom: [
      '/favicon.ico',
      '/cre',
      '/off',
      '/ans',
    ],
    online: {}
}

// error handler
onerror(app, {redirect: '/error.html'})

// middlewares
app.use(bodyparser({enableTypes:['json', 'form', 'text']}))
app.use(cors())     // 跨域
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/static'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.use('/api', require('./routes/api'))
router.use('', require('./routes/index'))
app.use(router.routes())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

init()

module.exports = app

function init() {
    setInterval(function(){
        //console.log('clear.......');
        for(room in global.app.online) {
            if (global.app.online[room]['alive'] == 1) {
                global.app.online[room]['alive'] = 0
            } else {
                delete global.app.online[room]
                console.log(`[debug] del ${room}`)
            }
        }
    }, global.app.clearTime*1000)
}
