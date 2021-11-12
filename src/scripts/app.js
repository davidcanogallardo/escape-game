$(document).ready(function () {
    /*****************************************************************************************/
    loadPages()
    changePage('main')

    $('.container').on('click','.link', function (event) {
        changePage(event.currentTarget.attributes["page"].value)
    })
    $('.container').on('click','.slide', function (event) {
        rightMenu(event.currentTarget.attributes.page.value)
    })

    //*******************************************************************************************//
    
    //Enviar/recibir invitación a una partida
    $('.container').on('click','.send-invitation', function (event) {
        console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
        $('.container > *').fadeOut(1);
        $('.container > *').fadeIn(500);
    });


});

function loadPages() {
    $(".pages .main").load("./pages/main.html", () => {
        $(".pages .profile-page").load("./pages/profile.html", () => {
            $(".pages .trophy-page").load("./pages/trophys.html", () => {
                if (sessionStorage.getItem("session") != null) {
                    console.log("session");
                    var data = JSON.parse(sessionStorage.getItem("session"))
                    changeProfile(data)
                    console.log(data.friendList);
                    createFriendsList(data.friendList)
                    createRequestList(data.friendsRequest)
                } else {
                    console.log("object");
                }
            });
        });
    });
    $(".pages .settings-page").load("./pages/settings_pages/menu_ajustes.html")
    $(".pages .login-page").load("./pages/login_signup.html")
    $(".pages .recover-page").load("./pages/password_recover.html")
    $(".pages .connect-controller-page").load("./pages/settings_pages/sincronizar_mando.html")
    $(".pages .controller-settings-page").load("./pages/settings_pages/probar_mando.html")
    $(".pages .sound-settings-page").load("./pages/settings_pages/ajustes_sonido.html")
    $(".pages .friend-profile-page").load("./pages/profile_friend.html")
    $(".pages .ranking-page").load("./pages/ranking.html")
    $(".pages .invitation-page").load("./pages/invitation.html")
    $(".pages .login-warning").load("./pages/login_warning.html")
}

function rightMenu(params) {
    //var isLogged = JSON.parse(localStorage.getItem('isLogged'))
    if (!isLogged()) {
        changePage("login-warning")
    } else {
        if ($.trim($('.slide-menu').html()) === "") {
            var menu = $(".menus > "+ params)
            var menuClone = menu.clone()
            var xd = $.trim(`<div class="menu-close" onclick="rightMenu('`+params+`')"></div>`)
            //pensar un nombre para la variable uwu
            $('.slide-menu').append(menuClone).append(xd);
            $('.slide-menu > '+ params).animate({"right":"0vw"})
        } else {
            $(params).animate({ "right": "-=400vw" }, "slow" ,function() { $('.slide-menu > *').remove();});
            $('.menus > '+ params).animate({ "right": "-40vw" });
        }
    }
}

function changePage(pageName) {
    if (!isLogged() && pageName != "main" && pageName != "recover-page" && pageName != "login-page" && pageName != "login-warning") {
        changePage("login-warning")
    } else {
        localStorage.setItem("currentPage", pageName)
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()
    
        $(".pages ."+ pageName).clone(true).appendTo('.container');
        $(".pages ."+ pageName).remove()

        $('.container > *').fadeOut(1);
        $('.container > *').fadeIn(500);
            
    }
}

function isLogged() {  
    return sessionStorage.getItem('session')
}