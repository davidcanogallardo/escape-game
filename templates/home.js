Vue.component('home', {
    template: //html
    `             
    <div>   
        <div class="icon-container settings-btn-container main-icon settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">
            <i class="fas fa-cog"></i>
        </div>

        <div id="title">
            <span class="red-title">Escape</span>
            <span class="blue-title">Game</span>
        </div>

        <div id="game"></div>

        <div class="btn play" v-on:click="$emit('change-page','game')">Jugar</div>

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
    props: ["user"],
    methods: {
        profile() {
            if (user) {
                var newProfile =  {
                    username : this.user.username,
                    favMap : this.user.favMap,
                    numTrophies : this.user.numTrophies
                }
                this.$emit('update-profile',newProfile)
            }
            this.$emit('change-page','profile')
        },
        ranking(){
            //Petición PHP
            rankingData()
            this.$emit('change-page','ranking')

        }
    },
 
})

