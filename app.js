const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const cors = require('koa2-cors')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const fs = require('fs')

const index = require('./routes/index')
const api = require('./routes/api')

// conf
//const deadLine = 10 // min
// const clearTime = 21 // sec
// const delayTime = 1 // sec
// const waittime = 10 // sec

global.app = {
    // deadLine:10,    // min
    clearTime:21,
    delayTime:1,
    waittime:10,
    blockRoom:['favicon.ico','off','ans'],

    online:{}
}

// var online = {};
// const blockRoom = ['favicon.ico','off','ans'];

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(cors())     // 跨域
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/static'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(api.routes(), api.allowedMethods())

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
