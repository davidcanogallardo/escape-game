import {connect, setReceiver, sendMessage} from "./../../js/chat-client.js"

Vue.component('chat', {
    template: //HTML
    `
    <div class="chat">
        <div class="chat-head">
            <p>{{friend}}</p>
            <i class="fas fa-times" v-on:click="$emit('open-modal','none')"></i>
        </div>
        <div class="chat-body scrollbar">

            <div :class="'msg '+item.sender" v-for="item in messages">
                <p>{{item.message}} <span class="time">{{item.time}}</span></p>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" v-on:keyup.enter="sendd()" v-model="send" placeholder="Send Message...">
        </div>
    </div>
    `,
    props: [
        "user", "friend", "lastmessage"
    ],
    data(){
        return {
            messages: [],
            send:""
        }
    },
    watch: {
        lastmessage: function (newM, old) {
            this.messages.push(newM)
        }
    },
    created() {
        setReceiver(this.friend)
        connect()
    },
    methods: {
        sendd() {
            if (this.send != "") {
                sendMessage(this.send)
                this.send = ""
            }
        }
    },
})