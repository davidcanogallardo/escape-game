import {app} from "./../App.js"

Vue.component('friend-item', {
    template: //html
    `
    <div>
      <div title="Ver perfil" class="list-item friend-profile-link" page="friend-profile-page" :name="name" v-on:click="profile(); " >
        <div class="icon-container pr-btn" :name="name">
          <i class="fas fa-user" aria-hidden="true" :name="name"></i>
        </div>
        <span :name="name" >{{name}}</span>
        <div title="Chatear" class="icon-container add-btn send-invitation" v-on:click.stop="chat();" style="position:relative;">
          <i class="far fa-comment-dots"></i>
          <i v-if="hasNewMessages()" class="fas fa-circle" aria-hidden="true" style="position: absolute;top: -0.2vw;right: 0vw;font-size: 3vw;color: red;font-size: 1.2vw !important;text-shadow: none;"></i>
        </div>
      </div>
    </div>
    `,
    props: ["name"],
    methods: {
      profile() {
          this.$root.getFriendData(this.name)
          this.$emit('change-page','profile')
        },
        chat() {
          this.$root.modalOpen = null;
          this.$nextTick(() => {
            this.$root.modalOpen ="chat";
            this.$root.friendChat = this.name;
          });
      },
      hasNewMessages() {
        if (app.peopleUnread.indexOf(this.name) != -1) {
          return true
        } 
        return false
      }


    },
})

Vue.component('friend', {
    template: //html
    `             
    <div class="slide-list-container">
        <div class="slide-header">
            <i class="fas fa-user-friends" aria-hidden="true">
                <span>{{ $t("friend_list") }}</span>
            </i>
            <i class="fas fa-times friends-list slide-link close-sidebar" page=".slide-list-container" aria-hidden="true" v-on:click="$emit('open-menu','none')"></i>
        </div>
        
        <div class="slide-list" id="friend-list">
            <friend-item
                v-for="name in friends"
                :key="name"
                :name="name"
            ></friend-item>
        </div>
        
        <div class="form-fr-request">
            {{ $t("sendsolicitude") }}
            <input type="text" id="user-request" v-model="friend" >
            <button id="send" class="btn blue send-friend-request" v-on:click="request()"> {{ $t("send") }}</button>
        </div>
    </div>
    `,
    props: ["friends"],
    data() {
      return {
          friend: ""
      }
    },
    methods:{
        request(){
          this.$root.sendFriendRequest(this.friend);
          this.friend = ""
        }
    }

})