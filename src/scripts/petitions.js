var _url = "./petitions.php";


function rankingData() {
    $.ajax({
        data: {"petition" : "ranking"},
        type: "POST",
        dataType: "json",
        url: _url,
    })
    .done(function(data) {
        console.log(data);
        app.rankingData = data;
    })
    .fail(function(textStatus) {
        if ( console && console.log ) {
            console.log( "La solicitud ha fallado: " +  textStatus);
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