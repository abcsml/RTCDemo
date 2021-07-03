async function delay(time) {
	return new Promise(function(resolve, reject) {
		setTimeout(function(){
			resolve()
		}, time)
	})
}
async function createRoom(room, delTime) {
	global.app.online[room]={'alive':1}
	//setTimeout(function(){
	//	if (room in online) {
	//		delete online[room];
	//		console.log(`[debug] Timeout ${room}`)
	//	}
	//}, delTime);
}
async function waitother(room, other, waittime) {
	return new Promise(function(resolve, reject) {
		var t = new Date()
		var it = setInterval(function(){
			if (!(room in global.app.online)) {clearInterval(it);resolve(-1)};
			if (room in global.app.online && other in global.app.online[room]) {
				clearInterval(it)
				console.log("[debug] exit wait return 1")
				resolve(1)
			}
			if ((Date.now() - t)/1000 > waittime) {
				clearInterval(it)
				console.log("[debug] exit wait return 0")
				resolve(0)
			}
		}, 50)
	})
}

exports.delay = delay
exports.createRoom = createRoom
exports.waitother = waitother
