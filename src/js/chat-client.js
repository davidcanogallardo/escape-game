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
  var today = new Date();
  var mins = ('0'+today.getMinutes()).slice(-2);
  console.log(data);
  console.log();
  let data2 = {
    message: data.message,
    sender: "friend",
    time: today.getHours() + ":" + mins 
  }
  if(!app.messages[data.users.sender]) {
    app.messages[data.users.sender] = []
  }

  if (app.peopleUnread.indexOf(data.users.sender) == -1) {
      app.peopleUnread.push(data.users.sender)
      if (!app.messagesunread) {
        app.messagesunread = true
      }
  }

  app.messages[data.users.sender].push(data2)

  append(data2)
})

function connect() {
  console.log("conectado a socket server");
  console.log("=>"+socket);
  socket.connect();
  sender = app.user.username
  socket.emit("chatUserConnect", sender);
}

function setReceiver(name) {
  receiver = name
}

function sendMessage(text) {
  var today = new Date();
  var mins = ('0'+today.getMinutes()).slice(-2);
  // console.log(receiver+" ...--------");
  let messagee = text;
  socket.emit("sendChatMessage",{"users": {sender, receiver}, "message": messagee}, (response) => {
    if (response.success) {
      console.log("mensaje enviado");
      console.log(messagee);
      let data = {
        message: messagee,
        sender: "user",
        time: today.getHours() + ":" + mins 
      }
      if(!app.messages[receiver]) {
        app.messages[receiver] = []
      }
      app.messages[receiver].push(data)
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