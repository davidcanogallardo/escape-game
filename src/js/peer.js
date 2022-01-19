import Peer from '../../node_modules/simple-peer-light/simplepeer.min.js';
var peer = undefined;
var streamingStarted = false;

// step 1
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
			addLogMessage(JSON.stringify(data))
			// document.getElementById("yourID").value = JSON.stringify(data);
		} else {
			console.log("a");
			addLogMessage(JSON.stringify(data));
		}
	});
	peer.on("data", (data) => {
		addLogMessage(data);
	});
	peer.on("stream", (stream) => {
		//Stream de dades que rebo de l'altre costat
		console.log("event on stream from initiator");
		// document.getElementById("remoteVideoStream").srcObject = stream;
		// document.getElementById("remoteVideoStream").play();
	});

	peer.on("connect", () => {
		addLogMessage("Connection Established!!!");
	});
	peer.on("close", () => {
		addLogMessage("Connection Closed");
		// var controlsStreamingButton = document.getElementById("sendVideoStream");

		// controlsStreamingButton.innerHTML = "START STREAMING";
		// controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
	peer.on("error", (err) => {
		addLogError(err);
		// var controlsStreamingButton = document.getElementById("sendVideoStream");

		// controlsStreamingButton.innerHTML = "START STREAMING";
		// controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
}

// step 2
function signalMyPeer(remoteID) {
	console.log("Signaling my peer");
	peer = new Peer({
		initiator: false,
		trickle: false,
		//stream: myStream,
	});
	peer.on("signal", (data) => {
		//es crida cada cop que es crea un nou objecte Peer
		console.log("MY ID TO ACCEPT CALL:");
		console.log(data);
		addLogMessage("SIGNALING TYPE : " + data.type);
		if (data.type == "answer") {
			console.log(JSON.stringify(data));
			// document.getElementById("yourID").value = JSON.stringify(data);
		} else {
			addLogMessage(JSON.stringify(data));
		}
	});
	peer.on("data", (data) => {
		addLogMessage(data);
	});
	peer.on("stream", (stream) => {
		//Stream de dades que rebo de l'altre costat

		// console.log("event on stream from NO initiator user");

		// document.getElementById("remoteVideoStream").srcObject = stream;
		// document.getElementById("remoteVideoStream").play();
	});

	//Need to signal the initiator to be abble to get our ID
	console.log(remoteID);
	console.log(typeof remoteID);
	peer.signal(remoteID);

	peer.on("connect", () => {
		addLogMessage("Connection Established!!!");
	});
	peer.on("close", () => {
		addLogMessage("Connection Closed");
		// var controlsStreamingButton = document.getElementById("sendVideoStream");

		// controlsStreamingButton.innerHTML = "START STREAMING";
		// controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
	peer.on("error", (err) => {
		addLogMessage(err);
		// var controlsStreamingButton = document.getElementById("sendVideoStream");

		// controlsStreamingButton.innerHTML = "START STREAMING";
		// controlsStreamingButton.style.backgroundColor = "lightcoral";
		streamingStarted = false;
	});
}

// step 3
function step3(remoteID) {
	peer.signal(JSON.stringify(remoteID));
}

function addLogMessage(txt) {
	console.error(txt);
}

export {addLogMessage, getMyPeerId, signalMyPeer, step3}