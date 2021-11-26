$(document).ready(function () {
  Vue.component('friend', {
    template: //html
    `
    <div title="Ver perfil" class="list-item friend-profile-link" page="friend-profile-page" :name="name" >
    <div class="icon-container pr-btn" :name="name">
    <i class="fas fa-user" aria-hidden="true" :name="name"></i>
    </div>
      <span :name="name">{{name}}</span>
      <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation" onclick="return false">
      <i class="fas fa-user-plus" aria-hidden="true"></i>
      </div>
      </div>
      `,
      props: ["name"]
  })
  var fr = new Vue({
      el: '#friend-list',
      data: {
        friends: JSON.parse(sessionStorage.getItem("session")).friendsList
      },
  })

  Vue.component('notification', {
    template: //html
    `                
        <div class="list-item">
            <div class="icon-container pr-btn" >
                <i class="fas fa-user" aria-hidden="true"></i>
            </div>
            <span >{{name}}</span>
            <div class="btn accept">
                <i class="fas fa-check" aria-hidden="true"></i>
            </div>
            <div class="btn cancel">
                <i class="fas fa-times" aria-hidden="true"></i>
            </div>
        </div> 
      `,
      props: ["name"]
  })

  var notification = new Vue({
      el: '#notification-list',
      data: {
        notifications: JSON.parse(sessionStorage.getItem("session")).notifications
      },
  })
})
