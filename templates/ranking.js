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
                            <th>Posición</th>
                            <th class="name">Nombre</th>
                            <th>Tiempo</th>
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
            class = "selected"
            src="./src/images/lvl1.jpg" id="Nivel 1" alt="Nivel 1"
            v-for="(item, name) in ranking.levels"
            v-on:click="changeLevel(name)"
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
            Volver
        </div>

    </div>
    `, 
    props:["ranking","currentLevel"],
    methods:{
        changeLevel(name){
            this.currentLevel = name
            
        }
    }
})