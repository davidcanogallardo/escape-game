$(document).ready(function () {
    $('.container').on('click','.settings-btn-container', function () {
        changePage("settings");
    });
    $('.container').on('click','.volver', function () {
        changePage("main");
    });
    $('.container').on('click','.friends-list', function () {
        rightMenu('slide-list-container')
    });
    $('.container').on('click','.notificacion-list', function () {
        rightMenu('notification-container')
    });
    $('.container').on('click','.own-profile', function () {
        changePage('profilee')
    });
    
    $('.container').on('click','.ranking-link', function () {
        changePage('ranking-page')
    });
    $('.container').on('click','.sound-link', function () {
        changePage('sound-settings')
    });
    $('.container').on('click','.connect-controller-link', function () {
        changePage('connect-controller')
    });
    $('.container').on('click','.controller-settings-link', function () {
        changePage('controller-settings')
    });
    $('.container').on('click','.friend-profile-link', function () {
        changePage('friend-profile')
    });

});

let currentPage = ""


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

function changePage(pageName) {
    console.log("aaaaaaaaaaa");
    if (currentPage !=pageName) {
        currentPage == pageName
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages ."+ pageName).clone(true).appendTo('.container');
        $(".pages ."+ pageName).remove()
    }
}