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
                // login(data)
                let user = new User(
                    data.userData.username, 
                    data.userData.friendsList, 
                    data.userData.notifications, 
                    data.userData.completedLevels,
                    data.userData.favMap,
                    data.userData.numTrophies
                )
                sessionStorage.setItem("session",JSON.stringify(user))
                user.createProfile()
                user.createFriendList()
                user.createNotifications()
                changePage("main")
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
            if ( console && console.log ) {
                console.log( "La solicitud ha fallado: " +  textStatus);
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
                console.log( "La solicitud ha fallado: " +  textStatus);
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
                console.log( "La solicitud ha fallado: " +  textStatus);
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
                console.log( "La solicitud ha fallado: " +  textStatus);
            }
        });
    })

    // ranking
    $(".container").on("click",".ranking-link", () => {
        console.log(notification);
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
                console.log( "La solicitud ha fallado: " +  textStatus);
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
                    "user" : JSON.parse(sessionStorage.getItem("session")).username,
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
                console.log( "La solicitud ha fallado: " +  textStatus);
                console.log(textStatus);
            }
        });
        
        
    });

    // enviar solicitud
    $('.container').on('click','.send-friend-request', function (event) {
        var friendName = $("#user-request").val();
        $("#user-request").val('');
        if(friendName!=''){
            $.ajax({
                data: {
                    "petition" : "send_request",
                    "params" : {
                        "user" : JSON.parse(sessionStorage.getItem("session")).username,
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
                    console.log( "La solicitud ha fallado: " +  textStatus);
                    console.log(textStatus);
                }
            });
        } else {
            console.log("Esta vacio");
        }
        
    });

    // cerrar sesion
    $('.container').on('click','.close-sesion', function (event) {
        $.ajax({
            data: {
                "petition" : "close-sesion",
                "params" : {
                    "user" : JSON.parse(sessionStorage.getItem("session")).username,
                }
            },
            type: "POST",
            dataType: "json",
            url: _url,
        })
        .done(function(data) {
            console.log("efgwf");
            console.log(data);
            if (data.success) {
                closeSession()
            }
        })
        .fail(function(textStatus) {
            if ( console && console.log ) {
                console.log( "La solicitud ha fallado: " +  textStatus);
                console.log(textStatus);
            }
        });
    });
})

//Funciones para gestionar las respuestas




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

//USUARIO
function updateFriendList(event, accept, friendName) {
    $(event.currentTarget.parentElement).fadeOut(500, function (event) {
        $(this).remove()  
    })

    var new_session = JSON.parse(sessionStorage.getItem("session"))
    if (accept) {
        user.addFriend(friendName)
    }
    new_session.friendsRequest.pop(friendName)
    sessionStorage.setItem("session", JSON.stringify(new_session))
}

function updateFriendNotification(friendName) {
    showNotification("Petición de amistad enviada a "+friendName, "#49EE63")
    var new_session = JSON.parse(sessionStorage.getItem("session"))
    new_session.friendsRequest.push(friendName)
    createRequestList(new_session.friendsRequest)
    sessionStorage.setItem("session", JSON.stringify(new_session))
}

function closeSession() {
    changePage('main'); 
    sessionStorage.clear()
}

//************************************************************************************************************************//

// AMIGOS
function updateFriendProfile(data) {  
    changeFriendProfile(data.userData)
    changePage("friend-profile-page")
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
            console.log( "La solicitud ha fallado: " +  textStatus);
            console.log(textStatus);
        }
    });
}

