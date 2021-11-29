var _url = "./petitions.php";
$(document).ready(function () {
    //Eventos que activan las peticiones al servidor

    // ranking
    $(".container").on("click",".ranking-linkk", () => {
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
    $('.container').on('click','.klist-item .btn', function (event) {
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

    // cerrar sesion
    $('.container').on('clickk','.kclose-sesion', function (event) {
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

function loginPetition(form_data) {
    $.ajax({
        data: {
            "petition" : "login", 
            "params" : {
                "user": form_data.username,
                "password":form_data.password
            }
        },
        type: "POST",
        dataType: "json",
        url: "./petitions.php",
    })
    .done(function( data, textStatus, jqXHR ) {
        if ( console && console.log ) {
            console.log( "La solicitud se ha completado correctamente." );
            console.log( data );
            // login(data)
            if (data.success) {
                let user = new User(
                    data.userData.username, 
                    data.userData.friendsList, 
                    data.userData.notifications, 
                    data.userData.completedLevels,
                    data.userData.favMap,
                    data.userData.numTrophies
                )
                sessionStorage.setItem("session",JSON.stringify(user))
                // user.createProfile()
                // user.createFriendList()
                // user.createNotifications()
                app.currentPage="home"
                app.user = user
                // changePage("main")
                
            } else {
                console.log(data.message);
            }
        }
    })
    .fail(function( jqXHR, textStatus, errorThrown ) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
        }
    });
}

function signupPetition(form_data) {
    console.log(form_data);
    $.ajax({
        data: {
            "petition" : "register", 
            "params" : {
                "email":form_data.email, 
                "user":form_data.username,
                "password":form_data.password
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
}

function getFriendData(friendName) {
    $.ajax({
        data: {
            "petition" : "friendData", 
            "params" : {
                "friendUser": friendName
            }
        },
        type: "POST",
        dataType: "json",
        url: _url,
    })
    .done((data) => {
        console.log(data);
        if (data.success) {
            console.log("el usuario existe");
        } else {
            console.log("el usuario no existe");
        }
        var newProfile =  {
            username : data.userData.usuario,
            favMap : data.userData.favMap,
            numTrophies : data.userData.numCopas
        }
        app.profile = newProfile
        app.currentPage="friend"
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
        }
    });
    
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
    console.log("cerrar sesión");
    app.currentPage="home"; 
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

