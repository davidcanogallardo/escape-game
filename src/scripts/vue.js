var data = JSON.parse(sessionStorage.getItem("session"))
let user 
// if (data) {
if (true) {
    console.log("sesion detectada");
    user = new User(
      "david", 
      "david", 
      "david", 
      "david",
      "david",
      "david"
    )
    window.u = user
    console.log(user);
    // user.createProfile()
    // user.createFriendList()
    // user.createNotifications()
    // $.getScript("./src/scripts/vue.js");
} else {
    console.log("no hay sesion");
}
sessionStorage.clear()
var app = new Vue({
    el: '#app',
    data: {
      currentPage: "home",
      menuOpen: "none",
      friendsArray: ["uwu", "owo",],
      notificationsArray: ["a", "b","c", "d","e", "f"],
      user: user,
    },
    watch: {
      // whenever question changes, this function will run
      currentPage: function (newPage, oldPage) {
        if (!sessionStorage.getItem("session") && newPage != "home" && newPage != "game" && newPage != "login") {
          console.log("no hay sesión");
          this.currentPage = "login-warning"
        } else {
          console.log("hay sesión");
        }
        this.menuOpen = "none"
      }
    },

})



  // Vue.component('notification', {
  //   template: //html
  //   `                
  //       <div class="list-item">
  //           <div class="icon-container pr-btn" >
  //               <i class="fas fa-user" aria-hidden="true"></i>
  //           </div>
  //           <span >{{name}}</span>
  //           <div class="btn accept">
  //               <i class="fas fa-check" aria-hidden="true"></i>
  //           </div>
  //           <div class="btn cancel">
  //               <i class="fas fa-times" aria-hidden="true"></i>
  //           </div>
  //       </div> 
  //     `,
  //     props: ["name"]
  // })


  // var notification = new Vue({
  //     el: '#notification-list',
  //     data: {
  //       notifications: JSON.parse(sessionStorage.getItem("session")).notifications
  //     },
  // })



  // var fr = new Vue({
  //     el: '#friend-list',
  //     data: {
  //      // friends: JSON.parse(sessionStorage.getItem("session")).friendsList
  //      friends: ["asda", "ojioij", "Pol"]
  //     },      methods: {
  //       addFriend: function(friend){
  //         this.friends.push(friend);

  //       }
  //     }
  // })
