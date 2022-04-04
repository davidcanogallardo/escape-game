import {app} from "../App.js"

Vue.component('level', {
    template: //html
    `             
    <div class="nivel">
        <p class="texto">
            <profile-photo :photo="level.profile_photo" style="width: 4vw;height: 4vw;"/>
        </p>
        <p class="texto">{{level.name}}</p>
        <div class="trophys-container">
        </div>
    </div>
    `, 
    props: ["level"],
})

Vue.component('trophies', {
    template: //html
    `             
    <div class="trophys">
        <h1>{{ $t("levelslist") }}</h1>

        <div class="niveles scrollbar">
            <level
                v-for="level in fl"
                :level="level"
            ></level>
        </div>
        <div class="btn red volver link" page="profile-page" v-on:click="$emit('change-page','profile')">{{ $t("return") }}</div>

    </div>
    `, 
    props: ["levels"],
    data() {
        return {
            fl: app.history
        }
    },
})