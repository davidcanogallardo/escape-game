var session = JSON.parse(sessionStorage.getItem("session"))
let user
if (session) {
  // if (true) {
    console.log("sesion detectada");
    user = new User(
      session.username,
      session.friendsList,
      session.notifications,
      session.completedLevels,
      session.favMap,
      session.numTrophies
    )
  } else {
    user = null;
    console.log("no hay sesion");
}

var _url = "./petitions.php";

function showNotification(message,color) {
    var div = `<div class="notification">`+message+`</div>`
  
    $(div).appendTo("body")
    $(".notification").css({
        "bottom":"-5vw", 
        "opacity":"1",
        "background-color":color
    }).animate({"bottom":"1.5vw"}).delay(250).fadeTo(450, 0, () => {
        $(".notification").remove()
    })
}

