$(document).ready(function () {
    localStorage.setItem('isLogged', "false")
    $('.container').on('click','.settings-link', function () {
        changePage("settings-page");
    });

    $('.container').on('click','.volver', function () {
        changePage("main");
    });
    
    $('.container').on('click','.own-profile-link', function () {
        changePage('profile-page')
    });
    
    $('.container').on('click','.ranking-link', function () {
        changePage('ranking-page')
    });
    
    $('.container').on('click','.sound-link', function () {
        changePage('sound-settings-page')
    });
    
    $('.container').on('click','.connect-controller-link', function () {
        changePage('connect-controller-page')
    });
    
    $('.container').on('click','.controller-settings-link', function () {
        changePage('controller-settings-page')
    });
    
    $('.container').on('click','.friend-profile-link', function () {
        changePage('friend-profile-page')
    });

    $('.container').on('click','.login-link', function (event) {
        login(event)
    });

    $('.container').on('click','.recover-link', function () {
        changePage('recover-page')
    });
    
    $('.container').on('click','.send-invitation', function (event) {
        console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
    });

    $('.container').on('click','.friends-list', function () {
        rightMenu('slide-list-container')
    });

    $('.container').on('click','.notificacion-list', function () {
        rightMenu('notification-container')
    });
        
});

function login(event) {
    localStorage.setItem('isLogged', "true")
    localStorage.setItem('username', event.currentTarget.parentElement[0].value)
    console.log("logged");
    changeUsername()
    changePage("main");
}

function changeUsername() {
    $(".overlay-content h3 b")[0].innerHTML = localStorage.getItem('username')
    $(".profile h1")[0].innerHTML = localStorage.getItem('username')
}

let currentPage = ""

function rightMenu(params) {
    if (localStorage.getItem('isLogged') != "true") {
        alert("Inicia sesión man")
        currentPage == "login-page"
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages .login-page").clone(true).appendTo('.container');
        $(".pages .login-page").remove()
    } else {
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
    
}

function changePage(pageName) {
    console.log("aaaaaaaaaaa");
    var data = window.localStorage;

    if (data.getItem('isLogged') != "true" && pageName != "main" && pageName != "recover-page") {
        alert("Inicia sesión man")
        currentPage == "login-page"
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages .login-page").clone(true).appendTo('.container');
        $(".pages .login-page").remove()
    } else {
        if (currentPage !=pageName) {
            currentPage == pageName
            $('.container .page').clone(true).appendTo(".pages");
            $('.container > *').remove()
    
            $(".pages ."+ pageName).clone(true).appendTo('.container');
            $(".pages ."+ pageName).remove()
        }
    }
}