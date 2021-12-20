const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {  
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
let users = {}
console.log("---------------");
console.log(users);

io.use((socket, next) => {
  // console.log(socket);
  next();
});

io.on("connection", socket => {
  socket.send("keionn");

  socket.on("message", data => {  
    console.log(data);
  });

  socket.on('disconnect', function () {
    console.log("disconnect");
    for (const user in users) {
      if (users[user] == socket.id) {
        delete users[user]
        console.log(users);
      }
    }
  });

  socket.on("userConnect", (username) => {
    users[username] = socket.id
    console.log(`New user `+ username);
    console.log(users);
  })

  socket.on("sendMessage", (data, callback) => {
    let success = canSendMessage(data.users)
    callback({
      "success": success
    })
    if (success) {
      let socketId = users[data.users.receiver]
      io.to(socketId).emit("newMessage", data)
    }
  });
});

function canSendMessage(users) {
  return true
}

httpServer.listen(3000);