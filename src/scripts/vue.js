var app = new Vue({
    el: '#app',
    data: {
      currentPage: "main",
      menuOpen: "none",
      friendsArray: ["uwu", "owo",],
      notificationsArray: ["a", "b","c", "d","e", "f"],
    }
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
