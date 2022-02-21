class PeerClient {
    constructor(peer, isInitiator, socket) {
        this.peer = peer
        this.isInitiator = isInitiator
        this.socket = socket
        this.name = this.socket.id;
    }

    connection() {
        this.peer.on("signal", (data) => {
            console.log(data)
            if(this.isInitiator && data.type == "offer"){
                socket.emit("startPeer", data);
            } else if(!this.isInitiator && data.type == "answer"){
                socket.emit("sendGuestID", data);
            }else{
                socket.emit("renegotiate",data);
            }
        });
        //Handshake per iniciar la comunicació sense server
        this.peer.on("data", (data) => {
            console.log(data);
        });

        this.peer.on("stream", (stream) => {
            //Stream de dades que rebo de l'altre costat
            console.log("event on stream from initiator");
            var audio = document.getElementById("mic");
            audio.controls = true;
            audio.autoplay = true;
            audio.srcObject = stream;
        });

        this.peer.on("connect", () => {
            console.log("Conexion Establecida");
            this.socket.emit("switchToGame");
        });

        this.peer.on("renegotiate", () => {
            console.log("Conexion renegociandose");
            this.socket.emit("switchToGame");
        });

        this.peer.on("close", () => {
            console.log("Connection Closed");
            // var controlsStreamingButton = document.getElementById("sendVideoStream");

            // controlsStreamingButton.innerHTML = "START STREAMING";
            // controlsStreamingButton.style.backgroundColor = "lightcoral";
            //streamingStarted = false;
        });
        
        this.peer.on("error", (err) => {
            console.error(err);
            // var controlsStreamingButton = document.getElementById("sendVideoStream");

            // controlsStreamingButton.innerHTML = "START STREAMING";
            // controlsStreamingButton.style.backgroundColor = "lightcoral";
            //streamingStarted = false;
        });
    }

    sendText(message) {
        console.log("message => " + message);
        this.peer.send(message);
    }
}
