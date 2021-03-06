const httpServer = require("http").createServer();
const axios = require('axios').default;
const ComunicacionServidor = require('./ComunicacionServidor.js');
const io = require("socket.io")(httpServer, {  
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.use((socket, next) => {
  next();
});

let serverCom = new ComunicacionServidor(io, axios);
serverCom.listenConnection();

httpServer.listen(3000);
