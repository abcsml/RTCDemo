const rc = new RTCPeerConnection()

rc.onicecandidate = e => {
    // $("#my_icecandidate").text(JSON.stringify(rc.localDescription))
    if (rc.iceGatheringState=="complete"){
        axios.post("http://abcs.ml:9999/ans/test",rc.localDescription)
        setTimeout(()=>{
            if (rc.iceConnectionState!="connected"){
                alert("连接失败")
            }
        },6*1000)
    }
    console.log("ice" + JSON.stringify(rc.localDescription))
    console.log(`c: ${rc.iceConnectionState}, G: ${rc.iceGatheringState}`)
}
rc.ondatachannel = e => {
    rc.dc = e.channel
    rc.dc.onmessage = e => {
        rec = e
        $("#mess").append($("<h3>").text('对方: '+e.data))
        roll()
        console.log("data:"+e.data)
    }
    rc.dc.onopen = e => {
        $("#info").text('对方接收成功, 开始聊天')
        console.log("connect!!")
    }
}

// console.log("over")

$(document).ready(function(){
    init()
    $("#input").click(function(){
        let data = $("#content").val()
        $("#mess").append($("<h3>").text('我: '+data))
        roll()
        rc.dc.send(data)
    })
})

async function init(){
    var restartConfig = {iceServers:[{urls:"stun:stun.gmx.net"}]}
    await rc.setConfiguration(restartConfig)
    var result = await axios.get('http://abcs.ml:9999/ans/test')
    if (result.data.code == -1) {
        alert("房间不存在")
        return
    }
    var ans = setInterval(async function(){
        var result = await axios.get('http://abcs.ml:9999/ans/test')
        console.log(result)
        if (result.data.code){
            await rc.setRemoteDescription(result.data.mess)
            var o = await rc.createAnswer({"iceRestart": true})
            console.log("createAnswer")
            await rc.setLocalDescription(o)
            // var result = await axios.post("http://abcs.ml:9999/ans/test",rc.localDescription)
            if (result == -1) {alert("无法建立连接")}
            clearInterval(ans)
        }
    },5*1000)
}

function roll(){
    $("html, body").animate({
        scrollTop: $('html, body').get(0).scrollHeight
    }, 100);
}