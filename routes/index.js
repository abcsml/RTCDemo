const router = require('koa-router')()
const tools = require('../logic/tools')
const fs = require("fs")

router.get(['/:room'], async (ctx, next) => {
	ctx.set("Content-Type", "text/html;charset=utf-8")
	var room = ctx.params.room;
	if (global.app.blockRoom.includes(room)) {
		ctx.response.body = `<h1>not allow<h1>`;
		return;
	}
	if (room in global.app.online) {		// answer
		var htmlContent = fs.readFileSync("static/answer.html");
		ctx.response.body = htmlContent;
	} else {					// offer
		tools.createRoom(room, 5000);
		var htmlContent = fs.readFileSync("static/offer.html");
		ctx.response.body = htmlContent;
	}
})

module.exports = router
