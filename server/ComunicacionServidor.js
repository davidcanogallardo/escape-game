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
            this.roomName;
        }
    
        listenConnection(){
            this.io.on("connection", socket => {
                socket.on("message", (data) => {
                    console.log("SERVER:RANDOM MESSAGE => "+data);
                });
                socket.on("startQueue", (data) => { 
                    //console.log(roomName);
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
                    socket.in(this.roomName).emit("playerMoveResponse", moveData);
                });


                //Create Peer Connection
                socket.on("startPeer", (hostID) => {
                    socket.in(this.roomName).emit("sendHostID", hostID);
                });

                socket.on("sendGuestID", (guestID) => {
                    socket.in(this.roomName).emit("getGuestID", guestID);
                });

                socket.on("switchToGame", () => {
                    this.io.in(this.roomName).emit("windowGame");
                });

                socket.on("passwordPuzzleComplete", () => {
                    this.io.in(this.roomName).emit("passwordPuzzleResolved")
                });

                socket.on("playerInEndZone", (players) => {
                    socket.room.countEndZone++;
                    if(socket.room.countEndZone==2){
                        this.io.in(this.roomName).emit("endGame");
                    }
                });

                socket.on("iniciarRenegociacion", (playerId) => {
                    console.log("iniciarRenegociacion");
                    //console.log(playerId);
                    //console.log(this.roomName)
                    console.log(this.players.length)
                    this.players.forEach(player => {
                        if (player.id==playerId) {
                            console.log("player initiator: "+player.initiator);
                            console.log("id player room"+player.id);
                            console.log("playerId: "+playerId);
                            if (player.id==playerId) {
                                this.io.to(playerId).emit("renegotiation",player.initiator);
                            }
                            
                        }
                        
                        

                        
                    });
                });
            });
        }
    
        manageQueue(socket, data){
            if(this.queue.length==0){
                console.log("Añado a la cola");
                const player = {
                    id: socket.id,
                    userame: data.username,
                    x: 100,
                    y: 250,
                    initiator: true
                }
                this.roomName = "Room_"+socket.id;
                console.log("Nombre de la sala: "+this.roomName);
                socket.join(this.roomName);
                //console.log(socket.rooms.get(this.roomName));
                console.log(this.io.sockets.adapter.rooms.get(this.roomName));
                var _room = this.io.sockets.adapter.rooms.get(this.roomName);
                socket.room = _room;
                socket.room.countEndZone = 0;
                this.queue.push(player);
                this.players.push(player);
            } else {
                const player = {
                    id: socket.id,
                    userame: data.username,
                    x: 250,
                    y: 250,
                    initiator: false
                }
                console.log("Nombre de la sala 2: "+this.roomName);
                socket.join(this.roomName);
                let _room = this.io.sockets.adapter.rooms.get(this.roomName);
                socket.room = _room; 
                console.log("countEndZone del room:"+socket.room.countEndZone)
                this.queue.push(player);
                //this.players.push(this.queue.slice(0,2));
                //console.log("Jugadores: ");
                console.log("PARTIDA ENCONTRADA");
                this.io.in(this.roomName).emit('matchFound', this.queue);
                
                this.players.push(player);
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