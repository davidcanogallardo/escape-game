Vue.component('login-warning', {
    template: //html
    `             
    <div class="login_warning">
        <h1>Iniciar Sesión</h1>
        
        <div class="botones_warning">
            <p>Tienes que iniciar sesión para acceder a esta página</p>
            <div class="btn blue link" page="login-page" v-on:click="$emit('change-page','login')">Iniciar Sesión</div>
        </div>
        
        <div class="btn red block volver link" page="main" v-on:click="$emit('change-page','home')">Volver</div>
    </div>
    `, 
})

