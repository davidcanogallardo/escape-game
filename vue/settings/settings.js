Vue.component('settings', {
    template: //html
    `             
    <div class="settings_menu">
        <h1>Ajustes</h1>

        <div class="botones">
            <div class="btn blue block sound-link link" page="sound-settings-page" v-on:click="$emit('change-page','sound-settings')">SONIDO</div>
            <div class="btn blue block connect-controller-link link" page="connect-controller-page" v-on:click="$emit('change-page','connect-controller')">CONECTAR MANDO</div>
            <div class="btn blue block controller-settings-link link" page="controller-settings-page" v-on:click="$emit('change-page','test-controller')">PROBAR MANDO</div>
        </div>

        <div class="btn red block volver link" page="main" v-on:click="$emit('change-page','home')">Volver</div>
    </div>  
    `, 
})