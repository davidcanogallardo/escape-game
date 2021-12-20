Vue.component('login-warning', {
    template: //html
    `             
    <div class="login_warning">
        <h1>{{ $t("login") }}</h1>
        
        <div class="botones_warning">
            <p>{{ $t("loginwarning") }}</p>
            <div class="btn blue link" page="login-page" v-on:click="$emit('change-page','login')">{{ $t("login") }}</div>
        </div>
        
        <div class="btn red block volver link" page="main" v-on:click="$emit('change-page','home')">{{ $t("return") }}</div>
    </div>
    `, 
})

