$(document).ready(function () {
    //Eventos que activan las peticiones al servidor
    var _url = "./petitions.php";

    // login
    $('.container').on('click','.login-link', function (event) {
        var form_data = $("#login").serializeArray()
        $.ajax({
            data: {
                "petition" : "login", 
                "params" : {
                    "user": form_data[0].value,
                    "password":form_data[1].value
                }
            },
            type: "POST",
            dataType: "json",
            url: _url,
        })
        .done(function( data, textStatus, jqXHR ) {
            if ( console && console.log ) {
                console.log( "La solicitud se ha completado correctamente." );
                console.log( data );
                login(data)
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
            }
        });
    });

    // signup
    $(".container").on("click",".signup-link", () => {
        var form_data = $("#signup").serializeArray()
        console.log(form_data);
        $.ajax({
            data: {
                "petition" : "register", 
                "params" : {
                    "email":form_data[0].value, 
                    "user":form_data[1].value,
                    "password":form_data[2].value
                }
            },
            type: "PUT",
            dataType: "json",
            contentType: "application/json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
        })
        .fail(function(XMLHttpRequest, textStatus, errorThrown) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
                console.log(XMLHttpRequest);
                console.log(errorThrown);
            }
        });
    })

    // recover
    $(".container").on("click",".recover-pass", () => {
        var form_data = $("#form-recover").serializeArray()
        $.ajax({
            data: {
                "petition" : "recover", 
                "params" : {
                    "mail":form_data[0].value
                }
            },
            type: "POST",
            dataType: "json",
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

    // friend profile
    $(".container").on("click",".friend-profile-link", () => {
        var name = event.originalTarget.attributes.name.value
        $.ajax({
            data: {
                "petition" : "friendData", 
                "params" : {
                    "friendUser":name
                }
            },
            type: "POST",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
            updateFriendProfile(data)
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
            }
        });
    })

    // ranking
    $(".container").on("click",".ranking-link", () => {
        $.ajax({
            data: {"petition" : "ranking"},
            type: "POST",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
            updateRanking(data)
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
            }
        });
    })

    // aceptar / cancelar solicitud de amistad
    $('.container').on('click','.list-item .btn', function (event) {
        var friendName = event.currentTarget.parentElement.childNodes[3].innerHTML
        var accept
        if (event.currentTarget.classList.contains("accept")) {
            accept = true;
        } else {
            accept = false;
        }

        $.ajax({
            data: {
                "petition" : "friend-request",
                "params" : {
                    "user" : JSON.parse(sessionStorage.getItem("session")).usuario,
                    "friend" : friendName,
                    "accept" : accept
                }
            },
            type: "PUT",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
            if (data.success) {
                updateFriendList(event, accept, friendName)
            }
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
                console.log(textStatus);
            }
        });
        
        
    });

    // enviar solicitud
    $('.container').on('click','.send-friend-request', function (event) {
        var friendName = $("#user-request").val()
        $.ajax({
            data: {
                "petition" : "send_request",
                "params" : {
                    "user" : JSON.parse(sessionStorage.getItem("session")).usuario,
                    "friend" : friendName
                }
            },
            type: "PUT",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
            if (data.success) {
                console.log(data.params);
                updateFriendNotification(friendName)
            }
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
                console.log(textStatus);
            }
        });
    });

    // cerrar sesion
    $('.container').on('click','.close-sesion', function (event) {
        $.ajax({
            data: {
                "petition" : "close-sesion",
                "params" : {
                    "user" : JSON.parse(sessionStorage.getItem("session")).usuario,
                }
            },
            type: "POST",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log(data);
            if (data.success) {
                closeSession()
            }
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud a fallado: " +  textStatus);
                console.log(textStatus);
            }
        });
    });
})

//Funciones para gestionar las respuestas
function login(data) {
    if (data.success) {
        sessionStorage.clear()
    
        sessionStorage.setItem("session",JSON.stringify(data.userData))
    
        console.log(data.message);
        changeProfile(data.userData)
        console.log(data.userData.friendList);
        createFriendsList(data.userData.friendList)
        createRequestList(data.userData.friendsRequest)
        changePage("main");
    } else {
        //TODO: poner animación al mensaje de error
        console.log(data.message);
        $(".error > *").remove()
        $(".error").append("<p>El usuario no existe</p>")
    }
}

function updateFriendProfile(data) {  
    changeFriendProfile(data.userData)
    changePage("friend-profile-page")
}

function updateRanking(data) {
    $(".all-levels > *").remove();
    var contador = 1;

    for (i in data.levels) {
        var table = `
        <div id="`+(i+1)+`">
        <table>
            <thead>
                <tr>
                    <th>Posición</th>
                    <th class="name">Nombre</th>
                    <th>Tiempo</th>
                </tr>
            </thead>
            <tbody>
        `
        Object.entries(data.levels[i]).forEach((l) =>{
            
            table+=`
            <tr>
                <td>`+(contador++)+`</td>
                <td class="name">`+l[0]+`</td>
                <td>`+l[1]+`</td>
            </tr>
            `
        })
        table+=`</tbody> </table> </div>`;
        $(".all-levels").append(table);
    }


}

function createTable(){

    var new_table = ''
}

function updateFriendList(event, accept, friendName) {
    $(event.currentTarget.parentElement).fadeOut(500, function (event) {
        $(this).remove()  
    })
    var new_session = JSON.parse(sessionStorage.getItem("session"))
    if (accept) {
        new_session.friendList.push(friendName)
        createFriendsList(new_session.friendList)
    }
    new_session.friendsRequest.pop(friendName)
    sessionStorage.setItem("session", JSON.stringify(new_session))
}

function updateFriendNotification(friendName) {
    $(".friend-request").animate({"bottom":"5vw"}).delay(250).fadeTo(450, 0)
    var new_session = JSON.parse(sessionStorage.getItem("session"))
    new_session.friendsRequest.push(friendName)
    createRequestList(new_session.friendsRequest)
    sessionStorage.setItem("session", JSON.stringify(new_session))
}

function closeSession(params) {
    changePage('main'); 
    sessionStorage.clear()
}

//************************************************************************************************************************//

function createFriendsList(friendsList) {
    $(".slide-list-container .slide-list > *").remove()

    friendsList.forEach(name => {
        let newFriend = `
        <div title="Ver perfil" class="list-item friend-profile-link" page="friend-profile-page" name="`+name+`" >
            <div class="icon-container pr-btn" name="`+name+`">
                <i class="fas fa-user" aria-hidden="true" name="`+name+`"></i>
            </div>
            <span name="`+name+`">`+name+`</span>
            <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation" onclick="return false">
                <i class="fas fa-user-plus" aria-hidden="true"></i>
            </div>
        </div>
        `
        $(".slide-list-container .slide-list").append(newFriend)
    });
}

function createRequestList(requestList) { 
    $(".notification-container .slide-list > *").remove()

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

function changeProfile(data) {
    $("#profile-name").text(data.usuario)
    $("#invite-name").text(data.usuario)
    $("#fav-map").text(data.favMap)
    $("#total-trophys").text(data.numCopas)

    $(".niveles > *").remove()
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

function changeFriendProfile(data) {  
    $("#fr-profile-name").text(data.usuario)
    $("#fr-fav-map").text(data.favMap)
    $("#fr-total-trophys").text(data.numCopas)
}

//Función para Actualizar ranking / lista de niveles al acabar partida
function PUT_ranking() {
    var _url = "./petitions.php";

    $.ajax({
        data: {
            "petition" : "ranking",
            "params" : {
                "players" : [ "david", "adnan" ],
                "time" : "00:12:13",
                "level" : "summonerRift"
            }
        },
        type: "PUT",
        dataType: "json",
        url: _url,
    })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud a fallado: " +  textStatus);
            console.log(textStatus);
        }
    });
}