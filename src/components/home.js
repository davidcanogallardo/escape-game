//const socket = io("ws://localhost:3000");
document.getElementById("agent").innerHTML = getLang();
Vue.component('home', {
    template: //html
    `       
    <span id="agent">      
    <div>   
        <div class="icon-container settings-btn-container main-icon settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">
            <i class="fas fa-cog"></i>
        </div>

        <div id="title">
            <span class="red-title">Escape</span>
            <span class="blue-title">Game</span>
        </div>

        <div id="game"></div>

        <div class="btn play" v-on:click="searchGame()">Jugar</div>

        <div class="right-menu">
            <div class="icon-container main-icon own-profile-link link" page="profile-page" v-on:click="profile()">
                <i class="fas fa-user"></i>
            </div>
            <div class="icon-container main-icon friends-list slide-link" page=".slide-list-container" v-on:click="$emit('open-menu','friend')">
                <i class="fas fa-user-friends"></i>
            </div>
            <div class="icon-container main-icon notificacion-list slide-link" page=".notification-container" v-on:click="$emit('open-menu','noti')">
                <i class="fas fa-bell"></i>
            </div>
            <div class="icon-container main-icon ranking-link link" page="ranking-page" v-on:click="ranking()">
                <i class="fas fa-list-ol"></i>
            </div>
        </div>

        <div class="slide-menu"></div>
    </div>
    `, 
    props: ["user2"],
    methods: {
        profile() {
            if (this.user2) {
                var newProfile =  {
                    username : this.user2.username,
                    favMap : this.user2.favMap,
                    numTrophies : this.user2.numTrophies
                }
                this.$emit('update-profile',newProfile)
            }
            this.$emit('change-page','profile')
        },
        ranking(){
            //Petición PHP
            this.$root.getRankingData()
            this.$emit('change-page','ranking')

        },
        searchGame(){
            //Cambiar al juego
            // this.$emit('change-page','waiting-room')
            this.$emit('change-page','game')
        }
    },
 
})

//<div class="btn play" v-on:click="$emit('change-page','game')">Jugar</div>

