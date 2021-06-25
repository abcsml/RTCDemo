// var pathName = document.location.pathname
// var index = pathName.substr(1).indexOf("/")
// const room = pathName.substr(0,index+1)

const lc = new RTCPeerConnection()
const dc = lc.createDataChannel("123123")
dc.onmessage = e => {
    $("#mess").append($("<h3>").text('对方: '+e.data))
    roll()
    console.log("got it :" + e.data)
}
dc.onopen = e => {
    $("#info").text('对方接收成功, 开始聊天')
    console.log("connect!!!")
}
lc.onicecandidate = e => {
    if (lc.iceGatheringState=="complete"){
        axios.post("http://abcs.ml:9999/off/test",lc.localDescription)
    }
    // $("#my_icecandidate").text(JSON.stringify(lc.localDescription))
    console.log("ice" + JSON.stringify(lc.localDescription))
    console.log(`c: ${lc.iceConnectionState}, G: ${lc.iceGatheringState}`)
}

//     lc.setRemoteDescription(JSON.parse($("#other_icecandidate")))
$(document).ready(function(){
    init()
    
    $("#input").click(function(){
        let data = $("#content").val()
        $("#mess").append($("<h3>").text('我: '+data))
        roll()
        dc.send(data)
    })
})

async function init(){
    var restartConfig = {iceServers:[{urls:"stun:stun.gmx.net"}]}
    await lc.setConfiguration(restartConfig)
    var o = await lc.createOffer({"iceRestart": true})
    await lc.setLocalDescription(o)
    console.log("set sucess")
    var result = await axios.get('http://abcs.ml:9999/off/test')
    // var result = await axios.post("http://abcs.ml:9999/off/test",lc.localDescription)
    var ans = setInterval(async function(){
        var result = await axios.get('http://abcs.ml:9999/off/test')
        if (result.data.code){
            await lc.setRemoteDescription(result.data.mess)
            console.log(result.data.mess)
            clearInterval(ans)

            setTimeout(()=>{
                if (lc.iceConnectionState!="connected"){
                    alert("连接失败")
                }
            },6*1000)
        }
    },5*1000)
    // o = await sendOffer()
    // console.log(`send off ${o}`)
}

function roll(){
    $("html, body").animate({
        scrollTop: $('html, body').get(0).scrollHeight
    }, 100);
}