const rc = new RTCPeerConnection()

var restartConfig = {iceServers:[{urls:"stun:stun.gmx.net"}]}
rc.setConfiguration(restartConfig)

rc.onicecandidate = e => {
    $("#my_icecandidate").text(JSON.stringify(rc.localDescription))
    console.log("ice" + JSON.stringify(rc.localDescription))
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
        console.log("connect!!")
    }
}

console.log("over")

$(document).ready(function(){
    $("#receive").click(function(){
        console.log("...")
        rc.setRemoteDescription(JSON.parse($("#other_icecandidate").val()))
        rc.createAnswer({"iceRestart": true}).then(a => rc.setLocalDescription(a)).then(a=>{
            console.log("ans create")
        })
    })
    $("#input").click(function(){
        let data = $("#content").val()
        $("#mess").append($("<h3>").text('我: '+data))
        roll()
        rc.dc.send(data)
    })
})

function roll(){
    $("html, body").animate({
        scrollTop: $('html, body').get(0).scrollHeight
    }, 100);
}