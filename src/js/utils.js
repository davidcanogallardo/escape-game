// import { connect } from "./chat-client.js";
//recover user session
function getSessionUser() {
  let sessionUser = JSON.parse(sessionStorage.getItem("session"));
  var user;
  if (sessionUser) {
    console.log("sesion detectada");
    user = new User(
      sessionUser.username,
      sessionUser.friendsList,
      sessionUser.notifications,
      sessionUser.completedLevels,
      sessionUser.favMap,
      sessionUser.numTrophies,
      sessionUser.profileImg,
      sessionUser.language
    );
    // connect()
  } else {
    user = "";
    console.log("no hay sesion");
  }
  return user;
}

//recover sound settings
function getSessionSoundConf() {
  let sessionSoundSettings = JSON.parse(sessionStorage.getItem("sound-settings"));
  let soundConf
  if (sessionSoundSettings) {
    console.log("settings de sonido");
    soundConf = new SoundSettings(
      sessionSoundSettings.volume,
      sessionSoundSettings.micVolume,
      sessionSoundSettings.micSensitivity,
    );
  } else {
    soundConf = new SoundSettings();
    console.log("no hay settings de sonido ");
  }
  return soundConf
}

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

export {getSessionUser, getSessionSoundConf, showNotification}