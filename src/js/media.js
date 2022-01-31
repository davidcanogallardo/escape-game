var getusermedia = window.getUserMedia

var devices = undefined;
var webcamStarted = false;
var audio = document.createElement('audio');

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

						
						micArray.push(mic)
						// micArray.appendChild(option);
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
		//Handle errors
		console.log("Error with navigator.mediaDevices Promise");
	});

/**
 * Library to wrap navigator.getUserMedia and handle errors for all the diferent kind of browsers.
 */

function testMic() {

	micButton = document.getElementById("micTest");
	if (webcamStarted) {
		console.log("turining OFF web cam");
		micButton.innerHTML = "TEST MICROPHONE";
		document.getElementById("video").removeChild(video);
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
		startMedia();
	}
	webcamStarted = !webcamStarted;
}
function startMedia() {
	var constraintMic = {
		deviceId: {exact:window.mic[0].id},
	};	
	
	getusermedia(
		{
			//video: true,
			video: window.cam[0].id,
			audio: constraintMic
		},
		function (err, stream) {
			if (err) {
				console.log(err);
			} else {
				//We can create the object dinamycly if we need to
				video = document.createElement("video");
				document.getElementById("video").appendChild(video);
				audio.controls = true;
				audio.autoplay = true;
				window.stream = stream;
				audio.srcObject = stream;
				return "a"
			}
		}
	);
}
