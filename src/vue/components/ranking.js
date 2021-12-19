Vue.component('ranking-table', {
    template: //html
    `             
    <div>
        <h3 class="level-name">{{levelName}}</h3>
        <div class="all-levels">
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>{{ $t("position") }}</th>
                            <th class="name">{{ $t("name") }}</th>
                            <th>{{ $t("time") }}</th>
                        </tr>
                    </thead>
                    <tbody
                        v-for="(key, value, index) in levelData"
                    >
                        <tr>
                            <td>{{index+1}}</td>
                            <td class="name">{{value}}</td>
                            <td>{{key}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `, 
    props:["levelName", "levelData"]
})
Vue.component('ranking', {
    template: //html
    `             
    <div class="ranking">
    <div class="level-slider">
        <img 
            src="./src/images/lvl1.jpg" id="Nivel 1" alt="Nivel 1"
            v-for="(item, name, index) in ranking.levels"
            v-on:click="changeLevel($event, name)"
        >
    </div>
        <ranking-table 
            v-for="(item, name) in ranking.levels"
            v-if="currentLevel == name"
            :levelName = "name"
            :levelData = "item"
            >
                {{name}}{{item}}
            </ranking-table>
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
            {{ $t("return") }}
        </div>

    </div>
    `, 
    props:["ranking"],
    data() {
        return {
            currentLevel: {
                default: "tomatoTown"
            }
        }
    },
    methods:{
        changeLevel(event, name){
            $(".level-slider > img").removeClass('selected')
            event.target.classList.add("selected")
            this.currentLevel = name
        }
    }
})