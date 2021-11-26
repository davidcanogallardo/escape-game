Vue.component('notification-item', {
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

Vue.component('notification', {
    template: //html
    `             
    <div class="notification-container">
        <div class="slide-header">
            <i class="fas fa-bell" aria-hidden="true">
                <span>Notificaciones</span>
            </i>
            
            <i class="fas fa-times notificacion-list slide-link" page=".notification-container" aria-hidden="true" v-on:click="$emit('change-page','none')"></i>
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
})