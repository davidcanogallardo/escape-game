class PeerClient {
    constructor(peer, isInitiator, socket) {
        this.peer = peer
        this.isInitiator = isInitiator
        this.socket = socket
        this.name = this.socket.id;
    }

    connection() {
        this.peer.on("signal", (data) => {
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
        });

        this.peer.on("stream", (stream) => {
            //Stream de dades que rebo de l'altre costat
            var audio = document.getElementById("mic");
            audio.controls = true;
            audio.autoplay = true;
            audio.srcObject = stream;
        });

        this.peer.on("connect", () => {
            console.log("Peer Establecido");
            if(this.isInitiator){
                this.socket.emit("clientInitGame");
            }
        });

        this.peer.on("renegotiate", () => {
            this.socket.emit("switchToGame");
        });

        this.peer.on("close", () => {
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

    disconnect(){
        this.peer.destroy();
    }

    sendText(message) {
        console.log("message => " + message);
        this.peer.send(message);
    }
}
