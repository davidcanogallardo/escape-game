var getusermedia = window.getUserMedia

var devices = undefined;
var micStarted = false;
var audio = document.createElement('audio');
var video = document.createElement('video');

var mediaDevicesPromise = navigator.mediaDevices.getUserMedia({
	audio: true,
	video: false,
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
					if (device.kind == "videoinput") {
						var cam = {
							label: device.label,
							id: device.deviceId
						}
						camArray.push(cam)
					} else if (device.kind == "audioinput") {
						var mic = {
							label: device.label,
							id: device.deviceId
						}
						micArray.push(mic)
					}
					window.mic = micArray
					window.cam = camArray
				});
			})
			.catch(function (err) {
				console.log(err.name + ":" + err.message);
			});
	})
	.catch(function () {
		console.log("Error with navigator.mediaDevices Promise");
	});

function startTestMic() {
	micButton = document.getElementById("micTest");
	if (micStarted) {
		console.log("turining OFF mic");
		micButton.innerHTML = "TEST MICROPHONE";
		if (audio) {
			window.stream.getAudioTracks().forEach(track => track.stop());
			window.stream = null;
			audio.pause();
			audio.currentTime = 0;
			audio.srcObject = null;
		}
	} else {
		audio = document.createElement('audio');
		console.log("turning ON mic");
		micButton.innerHTML = "STOP TEST";
		audio.controls = true;
		audio.autoplay = true;
		audio.srcObject = window.stream;
		video.srcObject = window.stream;

	}
	micStarted = !micStarted;
}
function testMic(micID) {
	var constraintMic = {
		deviceId: { exact: micID },
	};
	startStream(startTestMic, constraintMic, false);
}

function startPeerStream(callback, data) {
	var micID = window.mic[0].id;
	if (window.cam[0] == null) {
		var constraintCam = false;
	} else {
		var constraintCam = {
			deviceId: { exact: window.cam[0].id },
			width: 400,
			height: 250
		}
	}

	var constraintMic = {
		deviceId: { exact: micID },
	};

	startStream(callback, constraintMic, constraintCam, data)
}

function startStream(callback, constraintMic, constraintCam, data) {
	if (window.stream) {
		callback("Ya tenia el stream!")
	} else {
		getusermedia(
			{
				video: constraintCam,
				audio: constraintMic
			},
			function (err, stream) {
				if (err) {
					console.log(err);
				} else {
					window.stream = stream;
					if (data) {
						callback(data)
					} else {
						callback()
					}
				}

			}
		);
	}
}
