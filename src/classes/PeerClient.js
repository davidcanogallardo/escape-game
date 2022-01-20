class PeerClient {
    constructor(peer, isInitiator) {
        this.peer = peer
        this.isInitiator = isInitiator
    }

    connection() {
        //Handshake per iniciar la comunicació sense server


        this.peer.on("data", (data) => {
            console.log(data);
        });

        this.peer.on("stream", (stream) => {
            //Stream de dades que rebo de l'altre costat
            console.log("event on stream from initiator");
            // document.getElementById("remoteVideoStream").srcObject = stream;
            // document.getElementById("remoteVideoStream").play();
        });

        this.peer.on("connect", () => {
            console.log("Connection Established!!!");
        });

        this.peer.on("close", () => {
            console.log("Connection Closed");
            // var controlsStreamingButton = document.getElementById("sendVideoStream");

            // controlsStreamingButton.innerHTML = "START STREAMING";
            // controlsStreamingButton.style.backgroundColor = "lightcoral";
            streamingStarted = false;
        });
        
        this.peer.on("error", (err) => {
            console.error(err);
            // var controlsStreamingButton = document.getElementById("sendVideoStream");

            // controlsStreamingButton.innerHTML = "START STREAMING";
            // controlsStreamingButton.style.backgroundColor = "lightcoral";
            streamingStarted = false;
        });
    }
}
