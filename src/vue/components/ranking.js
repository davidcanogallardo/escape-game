Vue.component('ranking-sub-table', { 
    template:
    `
    <table>
        <thead>
            <th>name</th>
            <th>Games Played</th>
            <th>Score</th>
        </thead>
        <tbody>
            <tr 
                v-for="(item) in item"
            >
                <td>{{item.name}}</td>
                <td>{{item.nGames}}</td>
                <td>{{item.avgScore}}</td>
            </tr>
        </tbody>
    </table>
    `,
    props:["item"]
});

Vue.component('ranking-table', {
    template: //html
    `             
    <div>
        <h3 class="level-name">{{diffName}}</h3>
        <div class="all-levels">
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th 
                                v-for="(item, name) in diffItem"
                            >{{name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td 
                                v-for="item in diffItem"
                            >
                                <ranking-sub-table
                                    :item = "item"
                                >
                                </ranking-sub-table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `, 
    props:["diffName", "diffItem"]
})
Vue.component('ranking', {
    template: //html
    `
    <div class="ranking">
        <div class="ranking_diff">
            <div class="ranking_diff_easy selected" v-on:click="changeDiff($event, 'easy')">Easy</div>
            <div class="ranking_diff_medium" v-on:click="changeDiff($event, 'medium')">Medium</div>
            <div class="ranking_diff_hard" v-on:click="changeDiff($event, 'hard')">Hard</div>
        </div>
        <ranking-table 
            v-for="(item, name) in ranking"
            v-if="currentDiff == name"
            :diffName = "name"
            :diffItem = "item"
        >
        </ranking-table>
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
            {{ $t("return") }}
        </div>
    </div>
    `, 
    props:["ranking"],
    data() {
        return {
            currentDiff: "easy"
        }
    },
    methods:{
        changeDiff(event, diff){
            //console.log(this);
            $(".ranking_diff > div").removeClass('selected')
            event.target.classList.add("selected")
            this.currentDiff = diff
        }
    }
})