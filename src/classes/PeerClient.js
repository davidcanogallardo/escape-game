class PeerClient {
    constructor(peer, isInitiator, socket) {
        this.peer = peer
        this.isInitiator = isInitiator
        this.id = undefined
        this.socket = socket
        this.name = this.socket.id;
    }

    connection() {
        this.peer.on("signal", (data) => {
            this.id = data;
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
            // document.getElementById("remoteVideoStream").srcObject = stream;
            // document.getElementById("remoteVideoStream").play();
            // const audio = window.audio2
            // audio.controls = true;
            // audio.autoplay = true;
            // audio.srcObject = stream;
            var video = document.getElementById("cam");
            video.srcObject = stream;
            video.play();
        });

        this.peer.on("connect", () => {
            console.log("Conexion Establecida");
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
