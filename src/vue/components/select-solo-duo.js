Vue.component('select-solo-duo', {
    template: //html
    `
    <div class="select-solo-duo">
        <h1>How you wanna play?</h1>
        <br>
        <div class="gamemodes"> 
            <div v-on:click="searchSolo" class="solo"> <h1>Public</h1> </div>
            <div v-on:click="searchDuo" class="Duo"> <h1>Private</h1> </div>
        </div>
        <div class="difficulty">
            <h1>Select Difficulty</h1>
            <select name="difficulty" id="difficulty" @change="setDifficulty($event)">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    </div>
    `,
    data(){
        return {
            difficulty: "medium"
        }
    },

    methods: {
        searchSolo(){
            console.log("Public");
            console.log([this.user2, this.difficulty]);
            socket.emit('startQueue', [this.user2, this.difficulty]);
            this.$emit('change-page','waiting-room');
        },
        searchDuo(){
            console.log("Private");
        },
        setDifficulty(event){
            this.difficulty = event.target.value;
            console.log(this.difficulty);
        }
    }
})
