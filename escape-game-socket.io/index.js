const httpServer = require("http").createServer();
const ComunicacionServidor = require('./ComunicacionServidor.js')
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"]
    }
});

let serverCom = new ComunicacionServidor(io);

serverCom.listenConnection();


// io.on("connection", socket => {
//     socket.send("Hello!");

//     socket.on("message", (data) => {
//         console.log("SERVER:RANDOM MESSAGE => "+data);
//     });

//     socket.on("startQueue", (data) => {
//         console.log("Cola Iniciada: ");

//         const player = {
//             userame: data.username,
//             x: 0,
//             y: 0
//         }
//         queue.push(player);
//         //console.log(player);
//         console.log(queue);

//         if(queue.length == 2){
//             players.push(queue.slice(0,2));
//             console.log("Jugadores: ");
//             console.log(players);
//             socket.emit('matchFound', players);
//         }
//     })



// });


httpServer.listen(3000);