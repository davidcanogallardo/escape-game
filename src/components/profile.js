Vue.component('change',{
    template: //html
    `
    <div class="container-change" >
        <div class="close" v-on:click="$emit('change-img', false)">
            <i class="fas fa-times"></i>
        </div>

        <h2>Elige tu foto de perfil</h2>
        <div class="change-options">
            <div class="current-img">
                <div :class="'current-bg bg-'+currentBG">
                    <i :class="'fas fa-'+currentIcon+' current-icon color-'+currentIconColor" aria-hidden="true"></i>
                </div>
                <br>
                <div class="btn blue link changeSave" v-on:click="logs()">Guardar</div>
            </div>

            <div class="options-img">
                <h2>Icono</h2>
                <div class="container-icon-bg">
                    <div class="icon-bg" v-for="item in icons">
                        <i :class="'fas fa-'+item.icon" aria-hidden="true" v-on:click="currentIcon=item.icon"></i>
                    </div>
                </div>
                <h2>Color del icono</h2>
                <div class="container-color">

                    <div class="color-icon" v-for="item in colors">
                        <i :class="'fas fa-user color-'+item.color" aria-hidden="true" v-on:click="currentIconColor=item.color"></i>
                    </div>

                </div>
                <h2>Color del fondo</h2>
                <div class="container-color">
                    <div v-for="item in colors" :class="'color-bg bg-'+item.color" v-on:click="currentBG=item.color"></div>
                </div>
                <br>
            </div>
        </div>
    </div>

    `,
    data(){
        
        return{
            currentBG: "white",
            currentIcon: "user",
            currentIconColor: "grey",

            icons: [
                {icon: "user"},
                {icon: 'angry'},
                {icon: 'beer'},
                {icon: 'biohazard'},
                {icon: 'bomb'},
            ],
            colors: [
                {color: "red"},
                {color: 'blue'},
                {color: 'purple'},
                {color: 'pink'},
                {color: 'black'},
            ],
        }
    },
    methods: {
        logs(){
            console.log(this.currentBG)
            console.log(this.currentIcon)
            console.log(this.currentIconColor)
        }
    },
    //v-on:click="$emit('change-img',false)"
})
Vue.component('profile', {
    template: //html
    `             
    
    <div class="profile">
    <change v-if="page == 'profile' && changeImg == true" class="change" v-on:change-img="changeImg = $event"></change>
        <h1 id="profile-name">{{user.username}}</h1>
        <div class="container-profile">
            <div class="icon icon-profile" v-on:click="changeImg = true">
                <i class="fas fa-user i-profile" aria-hidden="true"></i>
            </div>
            <br>
            <table class="table-profile">
                <tbody><tr>
                    <td class="td-width"><i class="fas fa-trophy i-table" aria-hidden="true"></i> {{ $t("trophiesobtained") }}</td>
                    <td id="total-trophys" class="center">{{user.numTrophies}}</td>
                </tr>
                <tr>
                    <td class="td-width"><i class="fas fa-star i-table" aria-hidden="true"></i> {{ $t("prefmap") }}</td>
                    <td id="fav-map" class="center">{{user.favMap}}</td>
                </tr>
            </tbody></table>
        </div>
        <div v-if="page == 'profile'">
            <div class="btn blue close-sesion" v-on:click="close()">{{ $t("closesession") }}</div>
            <div class="btn blue link" page="trophy-page" v-on:click="$emit('change-page','trophies')">{{ $t("seetrophies") }}</div>
        </div>
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
            {{ $t("return") }}
        </div>
    </div>
    
    `,  
    props: ["user", "page","changeImg"],
    
    methods: {
        close() {
            //console.log(user);
            this.$root.closeSession(user.username)
        }
    },
})