Vue.component('change-language', {
    template: //html
    `   
    <div class="change_language">
        <h1>{{ $t("changelanguage") }}</h1>          
        <div class="change_language_options">
            <div class="btn blue" v-on:click="changeLanguageES()">Español</div>
            <div class="btn blue" v-on:click="changeLanguageEN()">English</div>
            <div class="btn blue" v-on:click="changeLanguageCA()">Català</div>
            <div class="btn red block volver settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">{{ $t("return") }}</div>
        </div>
    </div>
    `, 
    methods: {
        changeLanguageES() {
            this.$root._i18n.locale = 'es';
        },
        changeLanguageEN() {
            this.$root._i18n.locale = 'en';
        },
        changeLanguageCA() {
            this.$root._i18n.locale = 'en';
        }
    },
})