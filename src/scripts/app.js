$(document).ready(function () {
    //Prueba ajax

    //La url tiene que ser desde la raiz
    var _url = "./petitions.php";

    $.ajax({
        // En data puedes utilizar un objeto JSON, un array o un query string
        data: {"petition" : "login", "params" : {"user":"Alex","password":"1234"}},
        //Cambiar a type: POST si necesario
        type: "POST",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: _url,
    })
    .done(function( data, textStatus, jqXHR ) {
     if ( console && console.log ) {
         console.log( "La solicitud se ha completado correctamente." );
         console.log( data );
         if(data.success){

         } else {

         }
     }
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
    });

    //PETICON REGISTER
    $.ajax({
        // En data puedes utilizar un objeto JSON, un array o un query string
        data: {"petition" : "register", "params" : {"email":"pruebaemail@gmail.com", "user":"oscar","password":"1234"}},
        //Cambiar a type: POST si necesario
        type: "POST",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: _url,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
    });
    
    $.ajax({
        // En data puedes utilizar un objeto JSON, un array o un query string
        data: {"petition" : "recover", "params" : {"user":"pruebaemail@gmail.com"}},
        //Cambiar a type: POST si necesario
        type: "POST",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: _url,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
    });

    $.ajax({
        // En data puedes utilizar un objeto JSON, un array o un query string
        data: {"petition" : "friendData", "params" : {"friendUser":"Alex"}},
        //Cambiar a type: POST si necesario
        type: "POST",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: _url,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
    });

    $.ajax({
        // En data puedes utilizar un objeto JSON, un array o un query string
        data: {"petition" : "ranking"},
        //Cambiar a type: POST si necesario
        type: "POST",
        // Formato de datos que se espera en la respuesta
        dataType: "json",
        // URL a la que se enviará la solicitud Ajax
        url: _url,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
        }
    });











    checkLocalStorage()

    $('.container').on('click','.link', function (event) {
        changePage(event.currentTarget.attributes["page"].value)
    })
    $('.container').on('click','.slide', function (event) {
        rightMenu(event.currentTarget.attributes.page.value)
    })

    //*******************************************************************************************//

    $('.container').on('click','.login-link', function (event) {
        login($("#login-name").val())
    });
    
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
        <div class="btn accept">
            <i class="fas fa-check" aria-hidden="true"></i>
        </div>
        <div class="btn cancel">
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

function checkLocalStorage() {
    //Para cerrar sesión descomenta la línea de abajo, refresca la página y luego coméntalo
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
}

function changeUsername() {
    $(".overlay-content h3 b")[0].innerHTML = localStorage.getItem('username')
    $(".profile h1")[0].innerHTML = localStorage.getItem('username')
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