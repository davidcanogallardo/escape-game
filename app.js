function rightMenu(params) {
    var list = $(".slide-menu >"+ params)

    if ($.trim($('.slide-menu').html()) === "") {
        var menu = $(".menus > ."+ params)
        var menuClone = menu.clone()
        var xd = $.trim(`<div style="width: 100%;height: 100%;background: #e1e1e14a;position: absolute;top: 0;left: 0; z-index:5;" onclick="rightMenu('.`+params+`')"></div>`)
        //pensar un nombre para la variable uwu
        $('.slide-menu').append(menuClone).append(xd);
        $('.slide-menu > .'+ params).css("width","0%")
        $('.slide-menu > .'+ params).animate({width:"20%"}, 10)
    } else {
        $('.slide-menu > *').animate({width:"0%"}, 10).remove()
    }


}