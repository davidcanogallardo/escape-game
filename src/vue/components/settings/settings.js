Vue.component('settings', {
    template: //html
    `             
    <div class="settings_menu">
        <h1>{{ $t("settings") }}</h1>

        <div class="botones">
            <div class="btn blue block sound-link link" page="sound-settings-page" v-on:click="$emit('change-page','sound-settings')">{{ $t("sound") }}</div>
            <div class="btn blue block connect-controller-link link" page="connect-controller-page" v-on:click="$emit('change-page','connect-controller')">{{ $t("connectcontroller") }}</div>
            <div class="btn blue block controller-settings-link link" page="controller-settings-page" v-on:click="$emit('change-page','test-controller')">{{ $t("testcontroller") }}</div>
            <div class="btn blue block controller-settings-link link" page="change-language-page" v-on:click="$emit('change-page','change-language')">{{ $t("changelanguage") }}</div>
        </div>

        <div class="btn red block volver link" page="main" v-on:click="$emit('change-page','home')">{{ $t("return") }}</div>
    </div>  
    `, 
})