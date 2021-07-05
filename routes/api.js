const router = require('koa-router')()
const tools = require('../logic/tools')

var online = global.app.online

// 创建房间
router.get('/cre/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in online)) {
		online[room]={'alive':1}
		console.debug(`[debug] online: ${Object.keys(online)}`)
		ctx.body = {code:0, mess:'create room'}
	} else {
		ctx.body = {code:-1, mess:'room has been here'}
	}
})

router.get('/off/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in online)) {
		ctx.body = {code:-1, mess:'room not exit'}
		return
	}
	var result = await tools.waitting(()=>{
		return (room in online && 'ans' in online[room])
	}, global.app.waitTime)
	if (result) {
		ctx.body = {code:1, mess:online[room]['ans']}
		delete online[room]		// 清除房间
		console.debug(`[debug] del ${room}`)
	} else {
		// renew
		online[room]['alive'] = 1
		await tools.delay(global.app.delayTime)		// 鸽一会
		ctx.body = {code:0, mess:'no ans'}
	}
})

router.get('/ans/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in online)) {
		ctx.body = {code:-1, mess:'room not exit'}
		return
	}
	var result = await tools.waitting(()=>{
		return (room in online && 'off' in online[room])
	}, global.app.waitTime)
	if (result == 1) {
		ctx.body = {code:1, mess:online[room]['off']}
	} else {
		await tools.delay(global.app.delayTime)
		ctx.body = {code:0, mess:'no off'}
	}
})

// 上传ice
router.post('/:meth/:room', async (ctx, next) => {
	var room = ctx.params.room
	var meth = ctx.params.meth
	if (meth != 'off' && meth != 'ans') {
		ctx.body = {code:-1, mess:'not found'}
		return
	}
	if (!(room in online)) {
		ctx.body = {code:-1, mess:'room not exit'}
		return
	}
	if (meth in online[room]) {
		ctx.body = {code:0, mess:'room in use'}
	} else {
		online[room][meth] = ctx.request.body;
		console.log(`[debug] ${room} ${meth} ans is:${online[room][meth]}`)
		ctx.body = {code:1, mess:'succ'}
	}
})

module.exports = router.routes()