$(document).ready(function () {
    loadPages()
    /*****************************************************************************************/
    //changePage("main")
    
    $('.container').on('click','.link', function (event) {
        changePage(event.currentTarget.attributes["page"].value)
    })

    $('.container').on('click','.slide-link', function (event) {
        rightMenu(event.currentTarget.attributes.page.value)
    })

    //*******************************************************************************************//
    
    //Enviar/recibir invitación a una partida
    $('.container').on('click','.send-invitation', function (event) {
        // console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
        $('.container > .invitation-page').fadeOut(1)
        $('.container > .invitation-page').fadeIn(220);
    });

    //SLIDER RANKING
    $(".container").on('click', '.level-slider img', function(e) {
        $(".container").find(".selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        $(".container .level-name").text(e.currentTarget.id);
    });

});

function loadPages() {
    $(".pages .main").load("./pages/main.html", () => {
        console.log(0);
        $(".menus .slide-list-container").load("./pages/menus/friend-list.html", () => {
            $(".menus .notification-container").load("./pages/menus/notifications.html", () => {
                $(".pages .settings-page").load("./pages/settings_pages/menu_ajustes.html", () => {
                    console.log(1);
                    $(".pages .login-page").load("./pages/login_signup.html", () => {
                        console.log(2);
                        $(".recover-page").load("./pages/password_recover.html", () => {
                            console.log(3);
                            $(".pages .connect-controller-page").load("./pages/settings_pages/sincronizar_mando.html", () => {
                                console.log(3);
                                $(".pages .controller-settings-page").load("./pages/settings_pages/probar_mando.html", () => {
                                    console.log(4);
                                    $(".pages .sound-settings-page").load("./pages/settings_pages/ajustes_sonido.html", () => {
                                        console.log(5)
                                        console.log(6);
                                        $(".pages .profile-page").load("./pages/profile.html", () => {
                                            console.log(7);
                                            $(".pages .friend-profile-page").load("./pages/profile_friend.html", () => {
                                                console.log(8);
                                                $(".pages .ranking-page").load("./pages/ranking.html", () => {
                                                    console.log(9);
                                                    $(".pages .invitation-page").load("./pages/invitation.html", () => {
                                                        console.log(10);
                                                        $(".pages .login-warning").load("./pages/login_warning.html", () => {
                                                            console.log(11);
                                                            $(".pages .trophy-page").load("./pages/trophys.html", () => {
                                                                console.log(12);
                                                                console.log("session");
                                                                afterLoad()
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })  
    })  
}

function afterLoad() {
    var data = JSON.parse(sessionStorage.getItem("session"))
    window.d = data
    if (data) {
        console.log("sesion detectada");
        let user = new User(
            data.username, 
            data.friendsList, 
            data.notifications, 
            data.completedLevels,
            data.favMap,
            data.numTrophies
        )
        user.createProfile()
        //user.createFriendList()
        user.createNotifications()
        // vue()
    } else {
        console.log("no hay sesion");
    }
    changePage("main")
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
            var xd = $.trim(`<div class="menu-close slide-link" page="`+params+`"></div>`)
            $(xd).appendTo(".slide-menu");
            //pensar un nombre para la variable uwu
            $(".menus > "+ params).clone(true).appendTo(".slide-menu")
            $(".menus > "+ params).remove()
            $('.slide-menu > '+ params).animate({"right":"0vw"}, "slow")
        }
    }
}

function changePage(pageName) {
    console.log("cambio de página");
    if (!isLogged() && pageName != "main" && pageName != "recover-page" && pageName != "login-page" && pageName != "login-warning") {
        changePage("login-warning")
    } else {
        localStorage.setItem("currentPage", pageName)
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()
    
        $(".pages ."+ pageName).clone(true).appendTo('.container');
        $(".pages ."+ pageName).remove()

        $('.container > *').fadeOut(1);
        $('.container > *').fadeIn(500).css({"opacity":"1"});
            
    }
}

function isLogged() {  
    return sessionStorage.getItem('session')
}

function showNotification(message,color) {
    var div = `<div class="notification">`+message+`</div>`

    $(div).appendTo("body")
    $(".notification").css({
        "bottom":"-5vw", 
        "opacity":"1",
        "background-color":color
    }).animate({"bottom":"1.5vw"}).delay(250).fadeTo(450, 0, () => {
        $(".notification").remove()
    })
}
