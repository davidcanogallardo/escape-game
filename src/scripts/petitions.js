$(document).ready(function () {
    //La url tiene que ser desde la raiz
    var _url = "./petitions.php";

    //checkLocalStorage()

    //PETICION REGISTER
    function a(param) {  

        
        //RECUPERAR PASS
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
    
        //SOLICITUD DE AMISTAD
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
    
        //RANKING
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
    }

    $('.container').on('click','.login-link', function (event) {
        var form_data = $("#login").serializeArray()

        $.ajax({
            // En data puedes utilizar un objeto JSON, un array o un query string
            data: {
                "petition" : "login", 
                "params" : {
                    "user": form_data[0].value,
                    "password":form_data[1].value
                }
            },
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
                sessionStorage.setItem("session",JSON.stringify(data.userData))

                console.log(data.message);
                setLoginInStorage(data.userData.usuario)
                changeProfile(data.userData)
                console.log(data.userData.friendList);
                createFriendsList(data.userData.friendList)
                createRequestList(data.userData.friendsRequest)
                changePage("main");
             } else {
                console.log(data.message);
                $("#login").append("<p>El usuario no existe</p>")
                //TODO: función que muestre mensaje de error al usuario
             }
         }
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
            }
        });
    });

    $(".container").on("click",".signup-link", () => {
        var form_data = $("#signup").serializeArray()
        $.ajax({
            // En data puedes utilizar un objeto JSON, un array o un query string
            data: {
                "petition" : "register", 
                "params" : {
                    "email":form_data[0].value, 
                    "user":form_data[1].value,
                    "password":form_data[2].value
                }
            },
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
    })



})

function createFriendsList(friendsList) {
    //var array = JSON.parse(localStorage.getItem("friendsList"))
    //if (!array.includes(friendName)) {
    //    array[array.length] = friendName
    //    localStorage.setItem("friendsList", JSON.stringify(array))
    //}
    friendsList.forEach(name => {
        let newFriend = `
        <div title="Ver perfil" class="list-item">
            <div class="icon-container pr-btn friend-profile-link link" page="friend-profile-page">
                <i class="fas fa-user" aria-hidden="true"></i>
            </div>
            <span>`+name+`</span>
            <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation">
                <i class="fas fa-user-plus" aria-hidden="true"></i>
            </div>
        </div>
        `
        $(".slide-list-container .slide-list").append(newFriend)
    });
}

function createRequestList(requestList) { 
    //var array = JSON.parse(localStorage.getItem("notificationList"))
    //if (!array.includes(name)) {
    //    array[array.length] = name
    //    localStorage.setItem("notificationList", JSON.stringify(array))
    //} 
    requestList.forEach(name => {
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
    });

}

function setLoginInStorage(name) {
    localStorage.setItem('isLogged', "true")
    localStorage.setItem('username', name)
    console.log("user logged");
}

function checkLocalStorage() {
    //Para cerrar sesión descomenta la línea de abajo, refresca la página y luego coméntalo
    localStorage.setItem('isLogged', "false")
    
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

function changeProfile(data) {
    $("#profile-name").text(data.name)
    $("#invite-name").text(data.name)
    $("#fav-map").text(data.favMap)
    $("#total-trophys").text(data.numCopas)

    Object.entries(data.completeLevels).forEach((level) => {
        if (level[1].trophies.bronze) {
            var bronzeClass = "bronze"
        } else {
            var bronzeClass = "white"
        }
        if (level[1].trophies.silver) {
            var silverClass = "silver"
        } else {
            var silverClass = "white"
        }
        if (level[1].trophies.gold) {
            var goldClass = "gold"
        } else {
            var goldClass = "white"
        }

        var newLevel = `
            <div class="nivel">
                <img src="https://www.gametopia.es/learning/2017/img/blog/18-06/og-como-disenar-nivel-videojuego.png" alt="miniatura del nivel">
                <p class="texto">`+level[0]+`</p>
                <p class="texto">`+level[1].time+`</p>
                <div class="trophys-container">
                    <i class="fas fa-trophy `+ bronzeClass +`"></i>
                    <i class="fas fa-trophy `+ silverClass +`"></i>
                    <i class="fas fa-trophy `+ goldClass +`"></i>
                </div>
            </div>
        `
        $(".niveles").append(newLevel)
    })
    

}