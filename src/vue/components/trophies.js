Vue.component('level', {
    template: //html
    `             
    <div class="nivel">
        <img src="https://www.gametopia.es/learning/2017/img/blog/18-06/og-como-disenar-nivel-videojuego.png" alt="miniatura del nivel">
        <p class="texto">{{level.name}}</p>
        <p class="texto">{{level.time}}</p>
        <div class="trophys-container">
            <i class="fas fa-trophy" :class="getBronze()"></i>
            <i class="fas fa-trophy" :class="getSilver()"></i>
            <i class="fas fa-trophy" :class="getGold()"></i>
        </div>
    </div>
    `, 
    props: ["level"],
    methods: {
        getBronze() {
            if (this.level.trophies.bronze) {
                return "bronze"
            } else {
                return "white"
            }
        },
        getSilver() {
            if (this.level.trophies.silver) {
                return "silver"
            } else {
                return "white"
            }
        },
        getGold() {
            if (this.level.trophies.gold) {
                return "gold"
            } else {
                return "white"
            }
        },
    },
})

Vue.component('trophies', {
    template: //html
    `             
    <div class="trophys">
        <h1>{{ $t("levelslist") }}</h1>

        <div class="niveles scrollbar">
            <level
                v-for="level in levels"
                :key="level"
                :level="level"
            ></level>
            
        </div>

        <div class="btn red volver link" page="profile-page" v-on:click="$emit('change-page','profile')">{{ $t("return") }}</div>

    </div>
    `, 
    props: ["levels"]
})