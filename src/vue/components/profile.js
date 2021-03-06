Vue.component("change", {
  //html
  template: `
    <div class="container-change">
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
                <div class="btn blue link changeSave" v-on:click="saveChanges(); $emit('change-img', false), $emit('changeProfileImg',this.profileImg);">{{ $t("save") }}</div>
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
  data() {
    return {
      currentBG: this.user.profileImg.iconBG,
      currentIcon: this.user.profileImg.icon,
      currentIconColor: this.user.profileImg.iconColor,

      icons: [
        { icon: "user" },
        { icon: "angry" },
        { icon: "beer" },
        { icon: "biohazard" },
        { icon: "bomb" },
      ],

      colors: [
        { color: "red" },
        { color: "blue" },
        { color: "purple" },
        { color: "pink" },
        { color: "black" },
      ],
    };
  },
  props: ["user"],

  methods: {
    changeBG(color) {
      if (this.currentIconColor != color) {
        this.currentBG = color;
      }
    },
    changeIC(color) {
      if (this.currentBG != color) {
        this.currentIconColor = color;
      }
    },
    saveChanges() {
      profileImg = {
        iconBG: this.currentBG,
        icon: this.currentIcon,
        iconColor: this.currentIconColor,
      };
      this.$root.user.profileImg = profileImg;
      this.$root.updatePhoto(profileImg);
      sessionStorage.setItem("session", JSON.stringify(this.$root.user));
    },
  },
});
Vue.component("profile", {
  //html
  template: `             
    
    <div class="profile">
    <change v-if="page == 'profile' && changeImg == true" class="change" v-on:change-img="changeImg = $event" v-on:changeProfileImg="profileImg = $event" :user="user"></change>
        <h1 id="profile-name">{{user.username}}</h1>
        <div class="container-profile" v-on:click="changeImg = true">
            <profile-photo  :photo="profileImg" class="icon icon-profile" style="position:relative; font-size: 9vw;">
              <i v-if="page == 'profile'" class="fas fa-edit edit-icon" aria-hidden="true"></i>
            </profile-photo>
            <br>
        </div>
        <div v-if="page == 'profile'" style="width: 130vw;">
            <div class="btn blue close-sesion" v-on:click="close()">{{ $t("closesession") }}</div>
            <div class="btn blue link" page="trophy-page" v-on:click="history()">{{ $t("seetrophies") }}</div>
        </div>
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
            {{ $t("return") }}
        </div>
    </div>
    
    `,
  props: ["user", "page", "changeImg"],
  data() {
    return {
      profileImg: {
        iconBG: this.user.profileImg.iconBG,
        icon: this.user.profileImg.icon,
        iconColor: this.user.profileImg.iconColor,
      },
    };
  },

  methods: {
    close() {
      console.log(this.user);
      this.$root.closeSession(this.user.username);
    },
    history() {
      //this.$root.getUserHistory()
      this.$emit('change-page','trophies')
    },
  },
});
