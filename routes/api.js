const router = require('koa-router')()
const tools = require('../logic/tools')

router.get('/cre/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in global.app.online)) {
		tools.createRoom(room, 10*60*1000)
		ctx.response.body = {code:0,mess:'create room'}
		return
	}
})

router.get('/off/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in global.app.online)) {
		// createRoom(room, 10*60*1000);
		// ctx.response.body = {code:0,mess:'create room'};
		// return;
		ctx.response.body = {code:-1,mess:'room not exit'}
		return
	}
	var result = await tools.waitother(room, 'ans', global.app.waittime)
	if (result == 1) {
		ctx.response.body = {code:1,mess:global.app.online[room]['ans']}
		delete global.app.online[room]
		console.log(`[debug] del ${room}`)
	} else {
		// renew
		global.app.online[room]['alive'] = 1
		await tools.delay(global.app.delayTime)
		ctx.response.body = {code:0,mess:'no ans'}
	}
})
router.get('/ans/:room', async (ctx, next) => {
	var room = ctx.params.room
	if (!(room in global.app.online)) {
		ctx.response.body = {code:-1,mess:'room not exit'}
		return
	}
	var result = await tools.waitother(room, 'off', global.app.waittime)
	if (result == 1) {
		ctx.response.body = {code:1,mess:global.app.online[room]['off']}
	} else {
		ctx.response.body = {code:0,mess:'no off'}
	}
})
router.post('/:meth/:room', async (ctx, next) => {
	var room = ctx.params.room
	var meth = ctx.params.meth
	console.log(meth)
	console.log(typeof(meth))
	if (meth != 'off'&&meth != 'ans') {ctx.response.body = {code:-1,mess:'not found'};return;}
	if (!(room in global.app.online)) {ctx.response.body = {code:-1,mess:'room not exit'};return;}
	if (meth in global.app.online[room]) {
		ctx.response.body = {code:0,mess:'room in use'}
	} else {
		global.app.online[room][meth] = ctx.request.body;
		console.log(`[info] ${room} ${meth} ans is:${global.app.online[room][meth]}`)
		console.log(global.app.online[room][meth])
		ctx.response.body = {code:1,mess:'succ'}
	}
})

module.exports = router