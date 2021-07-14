var pathName = document.location.pathname
const room = pathName.substr(1)

function roll(){
    $("html, body").animate({
        scrollTop: $('html, body').get(0).scrollHeight
    }, 100)
}