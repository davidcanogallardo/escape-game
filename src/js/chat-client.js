import {app} from "../vue/App.js"

console.log("before connecting");
//console.log(socket);

let sender = ""
let receiver = ""

socket.on("message", data => {
  console.log(data);
  console.log(socket.id);
});

socket.on("newMessage", data => {
  console.log(data);
  console.log();
  let data2 = {
    message: data.message,
    sender: "friend",
    time: "10:20"   
  }
  append(data2)
})

function connect() {
  console.log("fdffdf");
  console.log("=>"+socket);
  // socket.auth = { "hola": "sgd" };
  socket.connect();
  sender = app.user.username
  socket.emit("chatUserConnect", sender);
}

function setReceiver(name) {
  receiver = name
}

function sendMessage(text) {
  console.log(receiver+" ...--------");
  let messagee = text;
  socket.emit("sendChatMessage",{"users": {sender, receiver}, "message": messagee}, (response) => {
    if (response.success) {
      console.log("mensaje enviado");
      console.log(messagee);
      let data = {
        message: messagee,
        sender: "user",
        time: "10:20"   
      }
      append(data)
    } else {
      console.log("no");
    }
  })
}

function disconnect() {
  socket.disconnect()
}

function append(params) {
  app.lastMessage = params
}

export { connect, setReceiver, sendMessage, disconnect }