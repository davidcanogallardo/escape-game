import {connect, setReceiver, sendMessage} from "./../../js/chat-client.js"

Vue.component('chat', {
    template: //HTML
    `
    <div class="chat">
        <div class="chat-head">
            <p>{{friend}}</p>
            <i class="fas fa-times" v-on:click="$emit('open-modal','none')"></i>
        </div>
        <div id="chat-body" class="chat-body scrollbar">

            <div id="data" :class="'msg '+item.sender" v-for="item in messages">
                <div class="textMessage">{{item.message}}</div>
                <span class="time">{{item.time}}</span>
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
            this.messages.push(newM);
            $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
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
});


