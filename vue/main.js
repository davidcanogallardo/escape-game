Vue.component('mainn', {
    template: //html
    `             
    <div>   
        <div class="icon-container settings-btn-container main-icon settings-link link" page="settings-page">
            <i class="fas fa-cog"></i>
        </div>

        <div id="title">
            <span class="red-title">Escape</span>
            <span class="blue-title">Game</span>
        </div>

        <div id="game" onload=""></div>


        <div class="btn play">Jugar</div>

        <div class="right-menu">
            <div class="icon-container main-icon own-profile-link link" page="profile-page">
                <i class="fas fa-user"></i>
            </div>
            <div class="icon-container main-icon friends-list slide-link" page=".slide-list-container" v-on:click="$emit('change-page','friend')">
                <i class="fas fa-user-friends"></i>
            </div>
            <div class="icon-container main-icon notificacion-list slide-link" page=".notification-container" v-on:click="$emit('change-page','noti')">
                <i class="fas fa-bell"></i>
            </div>
            <div class="icon-container main-icon ranking-link link" page="ranking-page">
                <i class="fas fa-list-ol"></i>
            </div>
        </div>

        <div class="slide-menu"></div>
    </div>
    `, 
 
})

