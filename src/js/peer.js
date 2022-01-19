import Peer from '../../node_modules/simple-peer-light/simplepeer.min.js';
var peer = undefined;


function getMyPeerId() {
	console.log("I'm the initiator and i'm ready to get my Peer ID");
	peer = new Peer({
		//initiator: true, //qui inicia la trucada
		initiator: true,
		trickle: false,
		//stream: myStream,
	});

	//Handshake per iniciar la comunicació sense server
	peer.on("signal", (data) => {
		//enviar via socket.io les dades d'inici de trucada.
		/**
		 * infomració que tindria que enviar via socket.io per localitzar i pasar la ifnormació a l'altre
		 * peer.
		 * id <-- id de l'usuari que vull trucar.
		 * data <-- les dades qeu envio
		 * el meu id
		 */
		console.log("MY ID TO MAKE A CALL:");
		console.log(data);
		addLogMessage("SIGNALING TYPE : " + data.type);

		if (data.type == "offer") {
			document.getElementById("yourID").value = JSON.stringify(data);
		} else {
			addLogMessage(JSON.stringify(data));
		}
	});
	peer.on("data", (data) => {
		addLogMessage(data);
	});
	peer.on("stream", (stream) => {
		//Stream de dades que rebo de l'altre costat
		console.log("event on stream from initiator");
		document.getElementById("remoteVideoStream").srcObject = stream;
		document.getElementById("remoteVideoStream").play();
	});

	peer.on("connect", () => {
		addLogMessage("Connection Established!!!");
	});
	peer.on("close", () => {
		addLogMessage("Connection Closed");
		var controlsStreamingButton = document.getElementById("sendVideoStream");

		controlsStreamingButton.innerHTML = "START STREAMING";
		controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
	peer.on("error", (err) => {
		addLogError(err);
		var controlsStreamingButton = document.getElementById("sendVideoStream");

		controlsStreamingButton.innerHTML = "START STREAMING";
		controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
}


function addLogMessage(txt) {
	console.log(txt);
}

export {addLogMessage, getMyPeerId}