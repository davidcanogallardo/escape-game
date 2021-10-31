function rightMenu(params) {
    var list = $(".slide-menu >"+ params)

    if ($.trim($('.slide-menu').html()) === "") {
        var menu = $(".right-menuu > ."+ params)
        var a = menu.clone()
        $('.slide-menu').append(a);
        $('.slide-menu > .'+ params).css("width","0%")
        $('.slide-menu > .'+ params).animate({width:"20%"}, 10)
    } else {
        $('.slide-menu> .'+ params).animate({width:"0%"}, 10).remove()
    }


}