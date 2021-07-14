const lc = new RTCPeerConnection()
const dc = lc.createDataChannel("123123")
dc.onmessage = e => {
    $("#mess").append($("<h3>").text('对方: '+e.data))
    roll()
    console.log("got it :" + e.data)
}
dc.onopen = e => {
    $("#mess").append($("<h2>").text('对方接收成功, 开始聊天'))
    console.log("connect!!!")
}

var restartConfig = {iceServers:[{urls:"stun:stun.gmx.net"}]}
lc.setConfiguration(restartConfig)

lc.onicecandidate = e => {
    $("#my_icecandidate").text(JSON.stringify(lc.localDescription))
    console.log("ice" + JSON.stringify(lc.localDescription))
}


//     lc.setRemoteDescription(JSON.parse($("#other_icecandidate")))
$(document).ready(function(){
    $("#send").click(function(){
        lc.createOffer({"iceRestart": true}).then(o => lc.setLocalDescription(o)).then(a=>console.log("set sucess"))
    })
    $("#start").click(function(){
        lc.setRemoteDescription(JSON.parse($("#other_icecandidate").val()))
    })
    $("#input").click(function(){
        let data = $("#content").val()
        $("#mess").append($("<h3>").text('我: '+data))
        roll()
        dc.send(data)
    })
})

function roll(){
    $("html, body").animate({
        scrollTop: $('html, body').get(0).scrollHeight
    }, 100);
}