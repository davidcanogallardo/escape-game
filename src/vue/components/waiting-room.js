Vue.component('waiting-room', {
    template: //html
    `
    <div class="waitingRoom">
        <h1>waiting Room</h1>
        <br>
        <p>1 / 2 Players</p>
        <div class="col-3">
            <div class="snippet" data-title=".dot-typing">
            <div class="stage">
                <div class="dot-typing"></div>
            </div>
            </div>
        </div>
        <div class="btn red block volver link" page="main" v-on:click="leaveRoom()">{{ $t("return") }}</div>
    </div>
    `,
    methods: {
        leaveRoom(){
            console.log("salgo socket");
            // socket.emit('leaveRoom',"a");
            this.$emit('change-page','home');
        },
    }
})


