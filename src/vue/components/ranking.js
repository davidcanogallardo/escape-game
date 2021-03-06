Vue.component('ranking-sub-table', { 
    template:
    `
    <table>
        <thead>
            <th>{{ $t("username") }}</th>
            <th>{{ $t("gamesPlayed") }}</th>
            <th>{{ $t("avgScore") }}</th>
        </thead>
        <tbody>
            <tr 
                v-for="(item) in item"
            >
                <td style="display: flex;align-items: center; gap: 0.4vw;">
                    <profile-photo :photo="item.profile_photo" style="width: 3vw;height: 3vw;" />
                    {{item.name}}
                </td>
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
        <h3 class="level-name">{{ $t("rankingSubtitle"+diffName) }}</h3>
        <div class="all-levels">
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th 
                                v-for="(item, name) in diffItem"
                            >{{ $t(name) }}</th>
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
    // TODO internacionalizacion
    `
    <div class="ranking">
        <div id="ranking_title">{{ $t("rankingTitle") }}</div>
        <div class="ranking_diff">
            <div class="btn blue selected" v-on:click="changeDiff($event, 'easy')">{{ $t("easyDifficulty") }}</div>
            <div class="btn blue" v-on:click="changeDiff($event, 'medium')">{{ $t("mediumDifficulty") }}</div>
            <div class="btn blue" v-on:click="changeDiff($event, 'hard')">{{ $t("hardDifficulty") }}</div>
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