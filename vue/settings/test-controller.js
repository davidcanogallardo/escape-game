Vue.component('test-controller', {
    template: //html
    `             
    <div class="probar_mando">
        <h1>Probar Mando</h1>
        <div class="controller_action">
            <p>Haz el siguiente movimiento</p>
            <i class="fas fa-redo-alt gesto"></i>
        </div>
        <div class="btn red block volver settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">Volver</div>
    </div>
    `, 
})