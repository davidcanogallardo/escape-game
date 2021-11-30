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
                app.currentPage="home"
                app.user = user
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

function recoverPassword(mail){
    $.ajax({
        data: {
            "petition" : "recover", 
            "params" : {
                "mail":mail
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
}

function sendFriendRequest(friend) {
    $.ajax({
        data: {
            "petition" : "send_request",
            "params" : {
                "user" : app.user.username,
                "friend" : friend
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
            showNotification("Petición de amistad enviada a "+friend, "#49EE63")
            app.user.notifications.push(friend)
            sessionStorage.setItem("session", JSON.stringify(app.user))
        }
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
            console.log(textStatus);
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
        app.profileInfo = newProfile
        app.currentPage="friend"
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
        }
    });
    
}

function closeSession(user) {
    $.ajax({
        data: {
            "petition" : "close-sesion",
            "params" : {
                "user" : user,
            }
        },
        type: "POST",
        dataType: "json",
        url: _url,
    })
    .done(function(data) {
        console.log("sesion cerrada");
        console.log(data);
        if (data.success) {
            app.user = null
            sessionStorage.clear()
            app.currentPage="home"
        }
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
            console.log(textStatus);
        }
    });
}

function friendRequest(user, friend, accept) {
    $.ajax({
        data: {
            "petition" : "friend-request",
            "params" : {
                "user" : user,
                "friend" : friend,
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
            // updateFriendList(event, accept, friendName)
            if (accept) {
                app.user.friendsList.push(friend)
                
            }
            var index = app.user.notifications.indexOf(friend);
            if (index !== -1) {
                app.user.notifications.splice(index, 1);
            }
            sessionStorage.setItem("session", JSON.stringify(app.user))
        }
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
            console.log(textStatus);
        }
    });
}

//Función para Actualizar ranking / lista de niveles al acabar partida
function PUT_ranking() {
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

// FUNCIONES QUE SUSTITUIR
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