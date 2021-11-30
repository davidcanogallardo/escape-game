var data = JSON.parse(sessionStorage.getItem("session"))
let user
if (data) {
  // if (true) {
    console.log("sesion detectada");
    user = new User(
      data.username,
      data.friendsList,
      data.notifications,
      data.completedLevels,
      data.favMap,
      data.numTrophies
    )
  } else {
    user = null;
    console.log("no hay sesion");
}
// sessionStorage.clear()
var app = new Vue({
    el: '#app',
    data: {
      currentPage: "home",
      menuOpen: "none",
      user: user,
      profileInfo: null,
      modalOpen: "none"
    },
    watch: {
      // whenever question changes, this function will run
      currentPage: function (newPage, oldPage) {
        if (!sessionStorage.getItem("session") && newPage != "home" && newPage != "game" && newPage != "login" && newPage != "password-recover") {
          console.log("no hay sesión");
          this.currentPage = "login-warning"
        } else {
          console.log("hay sesión");
        }
        this.menuOpen = "none"
      },
      menuOpen: function () {
        if (!sessionStorage.getItem("session") ) {
          console.log("no hay sesión");
          this.currentPage = "login-warning"
        } else {
          console.log("hay sesión");
        }
      }
    },

})

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