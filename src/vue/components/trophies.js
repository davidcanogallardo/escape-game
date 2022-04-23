import {app} from "../App.js"

Vue.component('level', {
    template: //html
    `             
    <div class="nivel">
        <p class="texto">
            <profile-photo :photo="level.profile_photo" style="width: 4vw;height: 4vw;"/>
            {{level.name}}
        </p>
        <p class="texto">{{ $t("difficulty") }}: {{level.difficulty}}</p>
        <p class="texto">{{ $t("score") }}: {{level.score}}</p>
        <div v-on:click="">Add friend<br/><i class="fas fa-user-plus" aria-hidden="true"></i></div>
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