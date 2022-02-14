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
            if(audio.reneg){
                audio.pause();
                audio.currentTime = 0;
                audio.srcObject = null;
                audio.reneg = false;
            }
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


        //renegociaciones
        socket.on("renegotiation", (peer) =>{
            console.log(peer)
            audio.reneg = true;
            this.peer.emit("signal",peer);
        })

        
    }

    sendText(message) {
        console.log("message => " + message);
        this.peer.send(message);
    }
}
