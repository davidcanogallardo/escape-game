$(document).ready(function () {
    /*****************************************************************************************/
    loadPages()
    changePage("main")

    $('.container').on('click','.link', function (event) {
        changePage(event.currentTarget.attributes["page"].value)
    })
    $('.container').on('click','.slide-link', function (event) {
        rightMenu(event.currentTarget.attributes.page.value)
    })

    //*******************************************************************************************//
    
    //Enviar/recibir invitación a una partida
    $('.container').on('click','.send-invitation', function (event) {
        console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
        $('.container > .invitation-page').fadeOut(1)
        $('.container > .invitation-page').fadeIn(220);
    });


});

function loadPages() {
    $(".pages .settings-page").load("./pages/settings_pages/menu_ajustes.html", () => {
        console.log(1);
        $(".pages .login-page").load("./pages/login_signup.html", () => {
            console.log(2);
            $(".pages .recover-page").load("./pages/password_recover.html", () => {
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