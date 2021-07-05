const router = require('koa-router')()
const tools = require('../logic/tools')
const fs = require("fs")

router.get(global.app.blockRoom, async (ctx, next) => {
	ctx.set("Content-Type", "text/html;charset=utf-8")
	ctx.body = '<h1>not allow<h1>'
})

router.get(['/:room'], async (ctx, next) => {
	ctx.set("Content-Type", "text/html;charset=utf-8")
	var room = ctx.params.room
	if (room in global.app.online) {		// answer
		var htmlContent = fs.readFileSync("static/answer.html")
		ctx.body = htmlContent;
	} else {								// offer
		var htmlContent = fs.readFileSync("static/offer.html")
		ctx.body = htmlContent
	}
})

router.get('/', async (ctx, next) => {
	ctx.set("Content-Type", "text/html;charset=utf-8")
	ctx.body = '/'
})

module.exports = router.routes()
