import { app } from "../App.js"

Vue.component('select-solo-duo', {
    template: //html
    `
    <div class="select-solo-duo">
        <h1>{{ $t("selectDifficulty.title") }}</h1>
        <br>
        <div class="gamemodes"> 
            <div v-on:click="searchSolo" class="btn blue solo"> {{ $t("selectDifficulty.public") }} </div>
            <div v-on:click="searchDuo" v-if="this.notLogged" class="btn blue duo"> {{ $t("selectDifficulty.private") }} </div>
        </div>
        <div class="difficulty">
            <br>
            <h2>{{ $t("selectDifficulty.subtitle") }}</h2>
            <select class="selector" name="difficulty" id="difficulty" @change="setDifficulty($event)">
                <option value="easy">{{ $t("selectDifficulty.easy") }}</option>
                <option value="medium" selected>{{ $t("selectDifficulty.medium") }}</option>
                <option value="hard">{{ $t("selectDifficulty.hard") }}</option>
            </select>
        </div>
        <br>
        <div class="btn red block volver link" page="main" v-on:click="$emit('change-page','home')">{{ $t("return") }}</div>
    </div>
    `,
    data(){
        return {
            difficulty: "medium"
        }
    },
    mounted() {
        if (app.user == null) {
            this.notLogged = true
            
        } else{
            this.notLogged = false
        }
    },
    methods: {
        searchSolo(){
            if (app.user == null) {
                socket.emit('startQueue', ["guest", this.difficulty]);
            } else {
                socket.emit('startQueue', [app.user.username, this.difficulty]);
            }
            this.$emit('change-page','waiting-room');
        },
        searchDuo(){
            console.log("Private");
            this.$emit('change-page','private-room');
        },
        setDifficulty(event){
            this.difficulty = event.target.value;
            console.log(this.difficulty);
        }
    }
})
