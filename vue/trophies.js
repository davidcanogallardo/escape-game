Vue.component('trophies', {
    template: //html
    `             
    <div class="trophys">
        <h1>Lista de niveles</h1>

        <div class="niveles scrollbar">

            
        </div>

        <div class="btn red volver link" page="profile-page" v-on:click="$emit('change-page','profile')">Volver</div>

    </div>
    `, 
})