Vue.component('chat', {
    template: //HTML
    `
    <div class="chat">
        <div class="chat-head">
            <p>{{friend}}</p>
            <i class="fas fa-times" v-on:click="$emit('open-modal','none')"></i>
        </div>
        <div class="chat-body scrollbar">

            <div :class="'msg '+item.sender" v-for="item in message">
                <p>{{item.message}} <span class="time">{{item.time}}</span></p>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Send Message...">
        </div>
    </div>
    `,
    props: [
        "user", "friend"
    ],
    data(){
        return {
            message: [
                {message: "Hola que tal",
                 sender: "user",
                 time: "10:20"   
                },
                {message: "Hola, yo muy bien",
                    sender: "friend",
                    time: "10:30"   
                },
               {message: "Me alegro! uwu",
                sender: "user",
                time: "10:40"   
                }
            ]
        }
    }
})