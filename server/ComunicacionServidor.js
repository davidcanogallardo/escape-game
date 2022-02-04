class ComunicacionServidor {
    //atributos 
        //io;
        //estructuras de datos
        //estados
        //consutrcutro (io)
        constructor(io){
            this.io = io;
            this.queue = [];
            this.players = [];
            this.chatUsers = {};
        }
    
        listenConnection(){
            this.io.on("connection", socket => {
                socket.on("message", (data) => {
                    console.log("SERVER:RANDOM MESSAGE => "+data);
                });
                socket.on("startQueue", (data) => {
                    this.manageQueue(socket, data);
                });
                socket.on("chatUserConnect", (username) => {
                    this.connectUserToChat(username, socket);
                });
                socket.on("sendChatMessage", (data, callback) => {
                    this.sendChatMessage(data, callback);
                });
                socket.on("disconnect", () => {
                    console.log("Un cliente se ha desconectado")
                    let indexItemToRemove = this.queue.indexOf(this.queue.find(element => element.id == socket.id));
                    this.queue.splice(indexItemToRemove, 1);
                    console.log(this.queue);
                });

                socket.on("playerMoved", (moveData) => {
                    socket.in("gameRoom").emit("playerMoveResponse", moveData);
                });


                //Create Peer Connection
                socket.on("startPeer", (hostID) => {
                    socket.in("gameRoom").emit("sendHostID", hostID);
                });

                socket.on("sendGuestID", (guestID) => {
                    socket.in("gameRoom").emit("getGuestID", guestID);
                });

                socket.on("switchToGame", () => {
                    this.io.in("gameRoom").emit("windowGame");
                });

                socket.on("passwordPuzzleComplete", () => {
                    this.io.in("gameRoom").emit("passwordPuzzleResolved")
                });

                let playerCount = 0;
                socket.on("playerInEndZone", (players) => {
                    console.log(socket.room.countEndZone);
                    socket.room.countEndZone++;
                    console.log(socket.room.countEndZone);
                    //console.log(playerCount);
                    if(socket.room.countEndZone==2){
                        this.io.in("gameRoom").emit("endGame");
                    }
                });
            });
        }
    
        manageQueue(socket, data){
            console.log("Cola Iniciada: ");
                    console.log(this.queue.length);
                    if(this.queue.length==0){
                        console.log("Añado a la cola");
                        const player = {
                            id: socket.id,
                            userame: data.username,
                            x: 100,
                            y: 250,
                            initiator: true
                        }
                        socket.join("gameRoom");
                        //console.log(socket.rooms.get("gameRoom"));
                        console.log(this.io.sockets.adapter.rooms.get("gameRoom"));
                        var _room = this.io.sockets.adapter.rooms.get("gameRoom");
                        socket.room = _room;
                        socket.room.countEndZone = 0;
                        this.queue.push(player);
                    } else {
                        const player = {
                            id: socket.id,
                            userame: data.username,
                            x: 250,
                            y: 250,
                            initiator: false
                        }
                        socket.join("gameRoom");
                        let _room = this.io.sockets.adapter.rooms.get("gameRoom");
                        socket.room = _room; 
                        console.log("countEndZone del room:"+socket.room.countEndZone)
                        this.queue.push(player);
                        //this.players.push(this.queue.slice(0,2));
                        //console.log("Jugadores: ");
                        console.log("PARTIDA ENCONTRADA");
                        this.io.in("gameRoom").emit('matchFound', this.queue);
                    }
                    console.log(this.queue);
                    console.log(this.io.sockets.adapter.rooms);
                    console.log(socket.rooms);
        }
    
        connectUserToChat(username, socket){
            this.chatUsers[username] = socket.id
            console.log(`New user `+ username);
            console.log(this.chatUsers);
        }
    
        sendChatMessage(data, callback){
            let success = this.canSendMessage(data.users)
            callback({
              "success": success
            })
            if (success) {
              let socketId = this.chatUsers[data.users.receiver]
              this.io.to(socketId).emit("newMessage", data)
            }
        }
    
        canSendMessage(users) {
            return true
        }
    
    
        /*listenConnection(){
            //evento conection
            //definicion de los eventos re repcepcion.
        }*/
    
        //Definir metodos para enviar informacion
        //definimos los eventos.
}
module.exports = ComunicacionServidor