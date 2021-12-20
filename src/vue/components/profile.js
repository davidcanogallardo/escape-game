Vue.component('change',{
    template: //html
    `
    <div class="container-change" >
        <div class="close" v-on:click="$emit('change-img', false)">
            <i class="fas fa-times"></i>
        </div>

        <h2>{{ $t("choosepic") }}</h2>
        <div class="change-options">
            <div class="current-img">
                <div :class="'current-bg bg-'+currentBG">
                    <i :class="'fas fa-'+currentIcon+' current-icon color-'+currentIconColor" aria-hidden="true"></i>
                </div>
                <br>
                <div class="btn blue link changeSave" v-on:click="saveChanges();  $emit('change-img', false);">{{ $t("save") }}</div>
            </div>

            <div class="options-img">

                <h2>{{ $t("icon") }}</h2>
                <div class="container-color">
                    <div class="icon-bg" v-for="item in icons" v-on:click="currentIcon=item.icon">
                        <i :class="'fas fa-'+item.icon" aria-hidden="true" ></i>
                    </div>
                </div>

                <h2>{{ $t("iconcolor") }}</h2>
                <div class="container-color">
                    <div class="color-icon" v-for="item in colors" v-on:click="changeIC(item.color)">
                        <i :class="'fas fa-user color-'+item.color" aria-hidden="true" ></i>
                    </div>
                </div>

                <h2>{{ $t("iconbkg") }}</h2>
                <div class="container-color">
                    <div v-for="item in colors" :class="'color-bg bg-'+item.color" v-on:click="changeBG(item.color)"></div>
                </div>
                <br>
            </div>
        </div>
    </div>

    `,
    data(){
        return{
            currentBG: this.$root.user.profileImg.currentBG,
            currentIcon: this.$root.user.profileImg.currentIcon,
            currentIconColor: this.$root.user.profileImg.currentIconColor,

            icons: [
                {icon: 'user'},
                {icon: 'angry'},
                {icon: 'beer'},
                {icon: 'biohazard'},
                {icon: 'bomb'},
            ],
            colors: [
                {color: 'red'},
                {color: 'blue'},
                {color: 'purple'},
                {color: 'pink'},
                {color: 'black'},
            ]
        }
    },
    props:["user", "page","changeImg"],

    methods: {
        changeBG(color){
            if (this.currentIconColor!=color) {
                this.currentBG=color;
            }
        },
        changeIC(color){
            if (this.currentBG!=color) {
                this.currentIconColor=color;
            }
        },
        logs(){
            console.log(this.currentBG)
            console.log(this.currentIcon)
            console.log(this.currentIconColor)
        },
        saveChanges(){
            userCopy=this.$root.user;
            profileImg={
                currentBG: this.currentBG,
                currentIcon: this.currentIcon,
                currentIconColor: this.currentIconColor,
            };
            console.log(this.$root.user);
            userCopy.profileImg=profileImg;
            this.$root.updateUser(userCopy);
        }
    },
})
Vue.component('profile', {
    template: //html
    `             
    
    <div class="profile">
    <change v-if="page == 'profile' && changeImg == true" class="change" v-on:change-img="changeImg = $event"></change>
        <h1 id="profile-name">{{user.username}}</h1>
        <div class="container-profile">
            <div :class="'icon icon-profile '+currentBG"v-on:click="changeImg = true">
                <i :class="'i-profile '+currentIcon+' '+currentIconColor" aria-hidden="true"></i>
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
    data(){
        return{
            currentBG: 'bg-'+this.$root.user.profileImg.currentBG,
            currentIcon: 'fas fa-'+this.$root.user.profileImg.currentIcon,
            currentIconColor: 'color-'+this.$root.user.profileImg.currentIconColor
        }
    },
    props: ["user", "page","changeImg"],
    
    methods: {
        close() {
            console.log(this.user);
            this.$root.closeSession(this.user.username)
        }
    },
})