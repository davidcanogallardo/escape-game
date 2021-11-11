$(document).ready(function () {

    /**************************************************************************************** */
    changePage('main')

    $('.container').on('click','.link', function (event) {
        changePage(event.currentTarget.attributes["page"].value)
    })
    $('.container').on('click','.slide', function (event) {
        rightMenu(event.currentTarget.attributes.page.value)
    })

    //*******************************************************************************************//
    
    //Enviar/recibir invitación
    $('.container').on('click','.send-invitation', function (event) {
        console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
        $('.container > *').fadeOut(1);
        $('.container > *').fadeIn(500);
    });

    //Enviar solicitud de amistad
    $('.container').on('click','.send-friend-request', function (event) {
        var friendName = $("#user-request").val()
        if (friendName != "") {
            $(".friend-request").animate({"bottom":"5vw"}).delay(250).fadeTo(450, 0)
            addFriendRequest(friendName)
        }
    });

    //Borrar una notificación
    $('.container').on('click','.list-item .btn', function (event) {
        var friendName = event.currentTarget.parentElement.childNodes[3].innerHTML
        if (event.currentTarget.classList.contains("green")) {
            addFriend(friendName)
        }
        var arr = JSON.parse(localStorage.getItem("notificationList"))
        if (arr.includes(friendName)) {
            arr.splice(arr.indexOf(friendName),1)
            localStorage.setItem("notificationList", JSON.stringify(arr))
        }
        
        $(event.currentTarget.parentElement).fadeOut(500, function (event) {$(this).remove  })
    });
});

function click() {
    
}

function rightMenu(params) {
    var isLogged = JSON.parse(localStorage.getItem('isLogged'))
    if (!isLogged) {
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages .login-warning").clone(true).appendTo('.container');
        $(".pages .login-warning").remove()

        $('.container .login-warning').fadeOut(1);
        $('.container .login-warning').fadeIn(500);
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
    var isLogged = JSON.parse(localStorage.getItem('isLogged'))
    if (!isLogged && pageName != "main" && pageName != "recover-page" && pageName != "login-page") {
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages .login-warning").clone(true).appendTo('.container');
        $(".pages .login-warning").remove()

        $('.container > *').fadeOut(1);
        $('.container > *').fadeIn(500);
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