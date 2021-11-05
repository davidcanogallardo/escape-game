$(document).ready(function () {
    localStorage.setItem('isLogged', "true")
    
    if (localStorage.getItem("friendsList") == null) {
        var arr = ["Jorge", "Carlos", "Miguel", "Lucas", "Diego", "Mario"]
        localStorage.setItem("friendsList", JSON.stringify(arr))
    }
    if (localStorage.getItem("notificationList") == null) {
        var arr = ["Andrés", "Gerard", "Hugo", "Lucas", "Nora", "Sara"]
        localStorage.setItem("notificationList", JSON.stringify(arr))
    }
    if (localStorage.getItem("currentPage") == null) {
        localStorage.setItem("currentPage", "")
    }

    var array = JSON.parse(localStorage.getItem("friendsList"))
    array.forEach(name => {
        addFriend(name)
    });

    array = JSON.parse(localStorage.getItem("notificationList"))
    array.forEach(name => {
        addFriendRequest(name)
    });

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
        login($("#login-name").val())
    });

    $('.container').on('click','.recover-link', function () {
        changePage('recover-page')
    });
    
    $('.container').on('click','.send-invitation', function (event) {
        console.log($(this.parentNode)[0].childNodes[3].innerText);
        $(".pages .invitation-page").clone(true).appendTo('.container');
        $(".pages .invitation-page").remove()
    });

    $('.container').on('click','.send-friend-request', function (event) {
        var friendName = $("#user-request").val()
        if (friendName != "") {
            $(".friend-request").fadeTo(250, 1).delay(200).fadeTo(250, 0)
            addFriendRequest(friendName)
        }
    });

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

    $('.container').on('click','.friends-list', function () {
        rightMenu('slide-list-container')
    });

    $('.container').on('click','.notificacion-list', function () {
        rightMenu('notification-container')
    });
        
});

function addFriend(friendName) {
    var array = JSON.parse(localStorage.getItem("friendsList"))
    if (!array.includes(friendName)) {
        array[array.length] = friendName
        localStorage.setItem("friendsList", JSON.stringify(array))
    }
    let newFriend = `
        <div title="Ver perfil" class="list-item">
            <div class="icon-container pr-btn friend-profile-link">
                <i class="fas fa-user" aria-hidden="true"></i>
            </div>
            <span>`+friendName+`</span>
            <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation">
                <i class="fas fa-user-plus" aria-hidden="true"></i>
            </div>
        </div>
    `
    $(".slide-list-container .slide-list").append(newFriend)

}

function addFriendRequest(name) { 
    var array = JSON.parse(localStorage.getItem("notificationList"))
    if (!array.includes(name)) {
        array[array.length] = name
        localStorage.setItem("notificationList", JSON.stringify(array))
    } 
    let newRequest = `                
    <div class="list-item">
        <div class="icon-container pr-btn" >
            <i class="fas fa-user" aria-hidden="true"></i>
        </div>
        <span >`+name+`</span>
        <div class="btn green confirm">
            <i class="fas fa-check" aria-hidden="true"></i>
        </div>
        <div class="btn red confirm">
            <i class="fas fa-times" aria-hidden="true"></i>
        </div>
    </div> 
    `
    $(".notification-container .slide-list").append(newRequest)

}

function login(name) {
    localStorage.setItem('isLogged', "true")
    localStorage.setItem('username', name)
    console.log("logged");
    changeUsername()
    changePage("main");
}

function changeUsername() {
    $(".overlay-content h3 b")[0].innerHTML = localStorage.getItem('username')
    $(".profile h1")[0].innerHTML = localStorage.getItem('username')
}

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
            //$('.slide-menu > .'+ params).css("left","")
            //$('.slide-list-container').animate({ "right": "-=540px" }, "slow")
            $('.slide-menu > .'+ params).animate({"right":"0vw"})
        } else {
            $('.'+ params).animate({ "right": "-=400vw" }, "slow" ,function() { $('.slide-menu > *').remove();});
            $('.menus > .'+ params).animate({ "right": "-40vw" });
            
        }
    }
    
}

function changePage(pageName) {
    console.log("aaaaaaaaaaa");

    if (localStorage.getItem('isLogged') != "true" && pageName != "main" && pageName != "recover-page") {
        alert("Inicia sesión man")
        localStorage.setItem("currentPage", "login-page")
        $('.container .page').clone(true).appendTo(".pages");
        $('.container > *').remove()

        $(".pages .login-page").clone(true).appendTo('.container');
        $(".pages .login-page").remove()
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