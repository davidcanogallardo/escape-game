import { app } from "../App.js"

Vue.component('select-solo-duo', {
    template: //html
    `
    <div class="select-solo-duo">
        <h1>How you wanna play?</h1>
        <br>
        <div class="gamemodes"> 
            <div v-on:click="searchSolo" class="btn blue solo"> Public </div>
            <div v-on:click="searchDuo" v-if="this.notLogged" class="btn blue duo"> Private </div>
        </div>
        <div class="difficulty">
            <br>
            <h2>Select Difficulty</h2>
            <select class="selector" name="difficulty" id="difficulty" @change="setDifficulty($event)">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
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
