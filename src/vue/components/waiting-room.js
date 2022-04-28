Vue.component('waiting-room', {
    template: //html
    `
    <div class="waitingRoom">
        <h1>waiting Room</h1>
        <br>
        <p style="font-size: 4vw;">1/2 Players</p>
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
            socket.emit('leaveRoom', socket.id);
            this.$emit('change-page','home');
        },
    }
})


