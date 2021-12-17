const socket = io("ws://localhost:3000", {
  autoConnect: false
});
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
  socket.auth = { "hola": "sgd" };
  socket.connect();
  sender = this.app.user.username
  socket.emit("userConnect", sender);
}

function setReceiver(name) {
  receiver = name
}

function sendMessage(text) {
  console.log(receiver+" ...--------");
  let messagee = text;
  socket.emit("sendMessage",{"users": {sender, receiver}, "message": messagee}, (response) => {
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

function append(params) {
  this.app.lastMessage = params
}