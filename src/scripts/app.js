$(document).ready(function () {
    /*****************************************************************************************/
    loadPages()
    changePage("main")
    

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
    var load_pages = [
        {
            path: "./pages/profile.html",
            selector: ".pages .profile-page",
            done: false
        },
        {
            path: "./pages/trophys.html",
            selector: ".pages .trophy-page",
            done: false
        },
        {
            path: "./pages/settings_pages/menu_ajustes.html",
            selector: ".pages .settings-page",
            done: false
        },
        {
            path: "./pages/login_signup.html",
            selector: ".pages .login-page",
            done: false
        },
        {
            path: "./pages/password_recover.html",
            selector: ".pages .recover-page",
            done: false
        },
        {
            path: "./pages/login_warning.html",
            selector: ".pages .login-warning",
            done: false
        },
        {
            path: "./pages/settings_pages/sincronizar_mando.html",
            selector: ".pages .connect-controller-page",
            done: false
        },
        {
            path: "./pages/settings_pages/probar_mando.html",
            selector: ".pages .controller-settings-page",
            done: false
        },
        {
            path: "./pages/settings_pages/ajustes_sonido.html",
            selector: ".pages .sound-settings-page",
            done: false
        },
        {
            path: "./pages/profile_friend.html",
            selector: ".pages .friend-profile-page",
            done: false
        },
        {
            path: "./pages/ranking.html",
            selector: ".pages .ranking-page",
            done: false
        },
        {
            path: "./pages/invitation.html",
            selector: ".pages .invitation-page",
            done: false
        },
        {
            path: "./pages/login_warning.html",
            selector: ".pages .login-warning",
            done: false
        },
    ];


    load_page("")

    function load_page(page_name) {
        console.log(page_name);
        load_pages.forEach(page => {
            if(page.path == page_name) page.done = true;
        });

        var count = 0;
        load_pages.forEach(page => {
            if (!page.done) {
                $(page.selector).load(page.path, load_page(page.path))
                return
            } else{
                count++;
            }
            console.log(page.done+count);
            
        });
        
        if(count == load_pages.length){
            console.log("session");
            var data = JSON.parse(sessionStorage.getItem("session"))
            if (data) {
                console.log("sesion detectada");
                changeProfile(data)
                console.log(data.friendList);
                createFriendsList(data.friendList)
                createRequestList(data.friendsRequest)
                
            } else {
                console.log("no hay sesion");
            }
        }
    }
}

function rightMenu(params) {
    if (!isLogged()) {
        changePage("login-warning")
    } else {
        if ($.trim($('.slide-menu').html()) !== "") {
            $('.slide-menu > '+ params).clone(true).appendTo(".menus")
            $('.slide-menu > '+ params).animate({ "right": "-=400vw" }, "slow", () => {
                $(".slide-menu > *").remove()
            });
            $('.menus > '+ params).animate({ "right": "-40vw" }, "slow");
        } else {
            var xd = $.trim(`<div class="menu-close" onclick="rightMenu('`+params+`')"></div>`)
            $(xd).appendTo(".slide-menu");
            //pensar un nombre para la variable uwu
            $(".menus > "+ params).clone(true).appendTo(".slide-menu")
            $(".menus > "+ params).remove()
            $('.slide-menu > '+ params).animate({"right":"0vw"}, "slow")
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