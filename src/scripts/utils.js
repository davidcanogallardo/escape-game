//recover session
let sessionUser = JSON.parse(sessionStorage.getItem("session"));
var user;
if (sessionUser) {
  // if (true) {
  console.log("sesion detectada");
  user = new User(
    sessionUser.username,
    sessionUser.friendsList,
    sessionUser.notifications,
    sessionUser.completedLevels,
    sessionUser.favMap,
    sessionUser.numTrophies
  );
} else {
  user = null;
  console.log("no hay sesion");
}

//recover sound settings
let sessionSoundSettings = JSON.parse(sessionStorage.getItem("sound-settings"));
if (sessionSoundSettings) {
  console.log("settings de sonido");
  var soundSettings2 = new SoundSettings(
    sessionSoundSettings.volume,
    sessionSoundSettings.micVolume,
    sessionSoundSettings.micSensitivity,
  );
} else {
  var soundSettings2 = new SoundSettings();
  console.log("no hay settings de sonido ");
}

let _url = "./petitions.php";

function showNotification(message, color) {
  var div = `<div class="notification">` + message + `</div>`;

  $(div).appendTo("body");
  $(".notification")
    .css({
      bottom: "-5vw",
      opacity: "1",
      "background-color": color,
    })
    .animate({
      bottom: "1.5vw"
    })
    .delay(250)
    .fadeTo(450, 0, () => {
      $(".notification").remove();
    });
}