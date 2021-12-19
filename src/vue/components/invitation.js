Vue.component('invitation', {
    template: //html
    `             
    <div id="overlay" >
        <div class="overlay-content">
            <h3 id="invite-name">{{username}}</h3>
            <p>{{ $t("invitation") }}</p>
            <div class="cancel_confirm">
                <div id="confirm" class="btn accept link" page="main" v-on:click="invitation(true)">
                    <i class="fas fa-check" aria-hidden="true"></i>
                </div>
                <div id="cancel" class="btn cancel link" page="main" v-on:click="invitation(false)">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
    `, 
    props: ["username"],
    methods: {
        invitation(accept) {
            if (accept) {
                this.$root.modalOpen ="none";
                this.$emit('change-page','game')
            } else {
                this.$root.modalOpen ="none";
                this.$emit('change-page','home')
            }
        }
    },
})

