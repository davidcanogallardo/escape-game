Vue.component('friend-item', {
    template: //html
    `
    <div>
      <div title="Ver perfil" class="list-item friend-profile-link" page="friend-profile-page" :name="name" v-on:click="profile2()">
        <div class="icon-container pr-btn" :name="name">
          <i class="fas fa-user" aria-hidden="true" :name="name"></i>
        </div>
        <span :name="name" >{{name}}</span>
        <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation" onclick="return false">
          <i class="fas fa-user-plus" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    `,
    props: ["name"],
    methods: {
      profile2() {
          getFriendData(this.name)
          this.$emit('change-page','profile')
        }

    },
})

Vue.component('friend', {
    template: //html
    `             
    <div class="slide-list-container">
        <div class="slide-header">
            <i class="fas fa-user-friends" aria-hidden="true">
                <span>Lista de amigos</span>
            </i>
            <i class="fas fa-times friends-list slide-link" page=".slide-list-container" aria-hidden="true" v-on:click="$emit('open-menu','none')"></i>
        </div>
        
        <div class="slide-list" id="friend-list">
            <friend-item
                v-for="name in friends"
                :key="name"
                :name="name"
            ></friend-item>
        </div>
        
        <div class="form-fr-request">
            Enviar solicitud a:
            <input type="text" id="user-request" >
            <button id="send" class="btn blue send-friend-request"> Enviar</button>
        </div>
    </div>
    `,
    props: ["friends"],

})