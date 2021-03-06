Vue.component('change-language', {
    template: //html
    `   
    <div class="change_language">
        <h1>{{ $t("changelanguage") }}</h1>          
        <div class="change_language_options">
            <div class="btn blue" v-on:click="changeLanguage('es')">Español</div>
            <div class="btn blue" v-on:click="changeLanguage('en')">English</div>
            <div class="btn blue" v-on:click="changeLanguage('ca')">Català</div>
            <div class="btn red block volver settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">{{ $t("return") }}</div>
        </div>
    </div>
    `, 
    methods: {
        changeLanguage(lang) {
            console.log(lang);
            this.$root._i18n.locale = lang;
            localStorage.setItem("locale", lang)
            // sessionStorage.setItem("session", JSON.stringify(userCopy));
        },
    },
})