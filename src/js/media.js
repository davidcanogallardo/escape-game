var getusermedia = window.getUserMedia

var devices = undefined;
var webcamStarted = false;
var audio = document.createElement('audio');

/**
 * Get all the devices and populate the SELECT Html TAG called "webcam"
 * So we can recover the id of any devive and start the webcam
 *
 * We put this code inside of a promise, otherwise if we don't have permissions from the user yet
 * we couldn't recive the información and we would need to reload.
 * If we place the code in the "then" part of the promise, the code is gonna run just in the moment
 * when we got answer from the user.
 */
var mediaDevicesPromise = navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true,
});

mediaDevicesPromise
	.then(function () {
		var enumeratorPromise = navigator.mediaDevices
			.enumerateDevices()
			.then(function (_devices) {
				devices = _devices;
				var camArray = [];
				var micArray = [];
				_devices.forEach(function (device) {
					// console.log(
					// 	device.kind + ":" + device.label + "id =" + device.deviceId
					// );
					if (device.kind == "videoinput") {
						var cam = {
							label: device.label,
							id: device.deviceId
						}
						// var option = document.createElement("option");
						// option.innerHTML = device.label;
						// option.value = device.deviceId;

						if (constraintsObject.deviceId == undefined) {
							//Checking the right one
							constraintsObject.deviceId = device.deviceId;
						}
						camArray.push(cam)
						// camArray.appendChild(option);
					} else if (device.kind == "audioinput") {
						var mic = {
							label: device.label,
							id: device.deviceId
						}
						// var option = document.createElement("option");
						// option.innerHTML = device.label;
						// option.value = device.deviceId;

						if (constraintsObject.deviceId == undefined) {
							//Checking the right one
							constraintsObject.deviceId = device.deviceId;
						}
						micArray.push(mic)
						// micArray.appendChild(option);
					}
					window.mic = micArray
					console.log(micArray);
					window.cam = camArray
				});
			})
			.catch(function (err) {
				console.log(err.name + ":" + err.message);
			});
	})
	.catch(function () {
		//Handle errors
		console.log("Error with navigator.mediaDevices Promise");
	});

/**
 * Library to wrap navigator.getUserMedia and handle errors for all the diferent kind of browsers.
 */

function testMic(idMic) {
	micButton = document.getElementById("micTest");
	if (webcamStarted) {
		console.log("turining OFF web cam");
		micButton.innerHTML = "TEST MICROPHONE";

		if (audio) {
			console.log("hay audio");
			window.stream.getAudioTracks().forEach(track => track.stop());
			console.log("he parado los tracks");
			window.stream = null;
			audio.pause();
			audio.currentTime = 0;
			audio.srcObject = null;
		}
	} else {
		audio = document.createElement('audio');
		console.log("turning ON webcam");
		micButton.innerHTML = "STOP TEST";
		startMic(idMic);
	}
	webcamStarted = !webcamStarted;
}
function startMic(idMic) {
	var constraintMic = {
		deviceId: {exact:idMic},
	};	
	
	getusermedia(
		{
			//video: true,
			video: false,
			audio: constraintMic
		},
		function (err, stream) {
			if (err) {
				console.log(err);
			} else {
				//We can create the object dinamycly if we need to
				//video = document.createElement("video");
				//document.body.appendChild(video);
				audio.controls = true;
				audio.autoplay = true;
				window.stream = stream;
				audio.srcObject = stream;
			}
		}
	);
}

/**
 * TEST constraints example
 */

var constraintsObject = {
	deviceId: {
		exact: undefined,
	},
};

function micTest() {
	micButton = document.getElementById("micTest");
	if (navigator.mediaDevices) {
		const constraints = window.constraints = {
			audio: true,
			video: false
		}
		navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError)
	}
	micButton.innerHTML = "STOP TEST";
}

// Based On https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/audio

function handleSuccess(stream) {
	if (window.stream) {
		window.stream.getAudioTracks().forEach(track => track.stop());
		
		window.stream = null;
		micButton.innerHTML = "TEST MICROPHONE";

	} else {
		const audio = document.createElement('audio');
		audio.controls = true;
		audio.autoplay = true;
		window.stream = stream;
		audio.srcObject = stream;

		stream.oninactive = function () {
			console.log('Stream ended');
		};
	}
}

function handleError(e) { console.log("ruin", e.message); }