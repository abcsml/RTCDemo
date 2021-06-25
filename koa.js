const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');

const app = new Koa();
const router = new Router();

//const deadLine = 10 // min
const clearTime = 30 // sec
const delayTime = 2 // sec

var online = {};
const blockRoom = ['favicon.ico','off','ans'];

setInterval(function(){
	//console.log('clear.......');
	for(room in online) {
		if (online[room]['alive'] == 1) {
			online[room]['alive'] = 0;
		} else {
			delete online[room];
			console.log(`[debug] del ${room}`)
		}
	}
}, clearTime*1000);

async function delay(time) {
	return new Promise(function(resolve, reject) {
		setTimeout(function(){
			resolve();
		}, time);
	});
};
async function createRoom(room, delTime) {
	online[room]={'alive':1};
	//setTimeout(function(){
	//	if (room in online) {
	//		delete online[room];
	//		console.log(`[debug] Timeout ${room}`)
	//	}
	//}, delTime);
}

app.use(static(__dirname+'/static'))
app.use(bodyParser());
// 跨域
app.use(cors());
app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	//console.log(online);
	await next();
});
app.use(async (ctx, next) => {
	//await delay(5000);
	ctx.set("Content-Type", "application/json")
	await next();
});


router.get('/off/:room', async (ctx, next) => {
	var room = ctx.params.room;
	if (!(room in online)) {
		createRoom(room, 10*60*1000);
		ctx.response.body = {code:0,mess:'create room'};
		return;
	}
	if ('ans' in online[room]) {
		ctx.response.body = {code:1,mess:online[room]['ans']};
		delete online[room];
		console.log(`[debug] del ${room}`)
	} else {
		// renew
		online[room]['alive'] = 1;
		await delay(delayTime);
		ctx.response.body = {code:0,mess:'no ans'};
	}
});
router.get('/ans/:room', async (ctx, next) => {
	var room = ctx.params.room;
	if (!(room in online)) {
		ctx.response.body = {code:-1,mess:'room not exit'};
		return;
	}
	if ('off' in online[room]) {
		ctx.response.body = {code:1,mess:online[room]['off']};
	} else {
		await delay(delayTime);
		ctx.response.body = {code:0,mess:'no off'};
	}
});
router.post('/:meth/:room', async (ctx, next) => {
	var room = ctx.params.room;
	var meth = ctx.params.meth;
	console.log(meth);
	console.log(typeof(meth));
	if (meth != 'off'&&meth != 'ans') {ctx.response.body = {code:-1,mess:'not found'};return;}
	if (!(room in online)) {ctx.response.body = {code:-1,mess:'room not exit'};return;}
	if (meth in online[room]) {
		ctx.response.body = {code:0,mess:'room in use'};
	} else {
		online[room][meth] = ctx.request.body;
		console.log(`[info] ${room} ${meth} ans is:${online[room][meth]}`);
		console.log(online[room][meth])
		ctx.response.body = {code:1,mess:'succ'};
	}
});
router.get(['/:room','/'], async (ctx, next) => {
	ctx.set("Content-Type", "text/html;charset=utf-8")
	var room = ctx.params.room;
	if (blockRoom.includes(room)) {
		ctx.response.body = `<h1>not allow<h1>`;
		return;
	}
	if (room in online) {
		ctx.response.body = `<h2>again!!<h2>`;
	}else{
		createRoom(room, 5000);
		ctx.response.body = `<h1>${room}!</h1>`;
	}
});
//router.get('/', async (ctx, next) => {
//	ctx.response.body = {a:'2',b:'we'};
//});

app.use(router.routes());

app.listen(9999);
console.log('app started at port 9999...');
