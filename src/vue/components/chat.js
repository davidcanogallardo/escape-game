import {connect, setReceiver, sendMessage} from "./../../js/chat-client.js"
import {app} from "./../App.js"

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
            console.log("watcher last")
            this.messages.push(newM);
            $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
            if (app.peopleUnread.indexOf(this.friend) != -1) {
                var friendIndex = app.peopleUnread.indexOf(this.friend)
                app.peopleUnread.splice(friendIndex,1)
                if (app.peopleUnread.length == 0) {
                    app.messagesunread = false
                }
            }
        }
    },
    created() {
        // this.messages= []
        setReceiver(this.friend)
        if (app.messages[this.friend]) {
            this.messages = app.messages[this.friend]
        }
        
        if (app.peopleUnread.indexOf(this.friend) != -1) {
            var friendIndex = app.peopleUnread.indexOf(this.friend)
            app.peopleUnread.splice(friendIndex,1)
            if (app.peopleUnread.length == 0) {
                app.messagesunread = false
            }
        }
        // connect()
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


