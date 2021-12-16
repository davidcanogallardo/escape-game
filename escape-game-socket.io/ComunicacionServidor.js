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
    }

    listenConnection(){
        this.io.on("connection", socket => {
            socket.on("message", (data) => {
                console.log("SERVER:RANDOM MESSAGE => "+data);
            });
            socket.on("startQueue", (data) => {
                console.log("Cola Iniciada: ");
                console.log(this.queue.length);
                if(this.queue.length==0){
                    console.log("Añado a la cola");
                    const player = {
                        id: socket.id,
                        userame: data.username,
                        x: 0,
                        y: 0
                    }
                    socket.join("gameRoom");
                    this.queue.push(player);
                } else {
                    const player = {
                        id: socket.id,
                        userame: data.username,
                        x: 0,
                        y: 0
                    }
                    socket.join("gameRoom");
                    this.queue.push(player);
                    //this.players.push(this.queue.slice(0,2));
                    //console.log("Jugadores: ");
                    //console.log(this.players);
                    this.io.in("gameRoom").emit('matchFound');
                }
                console.log(this.queue);
                console.log(this.io.sockets.adapter.rooms);
                console.log(socket.rooms);
            });
            socket.on("disconnect", () => {
                console.log("Un cliente se ha desconectado")
                let indexItemToRemove = this.queue.indexOf(this.queue.find(element => element.id == socket.id));
                this.queue.splice(indexItemToRemove, 1);
                console.log(this.queue);
            });
        });
    }
    /*listenConnection(){
        //evento conection
        //definicion de los eventos re repcepcion.
    }*/

    //Definir metodos para enviar informacion
    //definimos los eventos.
}
module.exports = ComunicacionServidor