import {app} from "./../App.js"

Vue.component('notification-item', {
    template: //html
    `
    <div class="list-item">
        <div class="icon-container pr-btn" >
            <i class="fas fa-user" aria-hidden="true"></i>
        </div>
        <span >{{name}}</span>
        <div class="btn accept" v-on:click="request(true)">
            <i class="fas fa-check" aria-hidden="true"></i>
        </div>
        <div class="btn cancel" v-on:click="request(false)">
            <i class="fas fa-times" aria-hidden="true"></i>
        </div>
    </div> 
    `,
    props: ["name"],
    methods: {
        request(type) {
            //TODO
            this.$root.friendRequest(app.username, this.name, type)
        }
    },
})

Vue.component('notification', {
    template: //html
    `             
    <div class="notification-container">
        <div class="slide-header">
            <i class="fas fa-bell" aria-hidden="true">
                <span>{{ $t("notifications") }}</span>
            </i>
            
            <i class="fas fa-times notificacion-list slide-link close-sidebar" page=".notification-container" aria-hidden="true" v-on:click="$emit('open-menu','none')"></i>
        </div>

        <div class="slide-list" id="notification-list">
            <notification-item
                v-for="name in notifications"
                :key="name"
                :name="name"
            ></notification-item>
        </div>
    </div>
    `,
    props: ["notifications"],
    created() {
        console.log("created");
        console.log(app.notificationunsread);
        if (app.notificationunsread) {
            app.notificationunsread = false
        }
    }
})