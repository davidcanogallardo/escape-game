class BluetoothGamePadReciver{
    constructor(_callbackButtonA = null, _callbackButtonJoystick = null, _callbackJoystick = null){
        //define properties
        this.started = false;
        this.autorefresh = false; //in case you wanna autorefresh values automaticly
        this.refreshTime = 250; //
        this.callbackButtonA = null; // what function should be called when new value arrives
        this.callbackButtonJoystick = null; // what function should be called when new value arrives
        this.callbackJoystick = null; // what function should be called when new value arrives
        this.bluetoothDeviceDetected = null;
        this.bleService = "47cb56ca-869d-11ec-a8a3-0242ac120002";
        this.bleCharacteristic1 = "f974e804-869e-11ec-a8a3-0242ac120002";//Button A
        this.bleCharacteristic2 = "40044cf4-2cba-4c9a-9bac-c24f4e816b84";//Button Joy
        this.bleCharacteristic3 = "c575531e-1b95-4dae-9a2a-05195bd7ac2a";//Joystick
        this.gattCharacteristic = null;
        this.gattCharacteristic2 = null;
        this.gattCharacteristic3 = null;
        this.global_service
        this.decoder = new TextDecoder('utf8');
        //end define properties
        console.log("BluetoothReciver constructor");
        this.callbackButtonA = _callbackButtonA;
        this.callbackButtonJoystick = _callbackButtonJoystick;
        this.callbackJoystick = _callbackJoystick;
        this.connected = false;
        this.interval = null;
        this.JoystickData = null;
        this.buttonAData = null;
        this.joystickButtonData = null;
        
    }

    isWebBLEAvailable(){
        if(!navigator.bluetooth){
            return false;
        }
        return true;
    }
    getDeviceInfo() {
        var deviceNamePrefix = "Arduino"
        let option = {
            // acceptAllDevices: true,
            optionalServices:[this.bleService],
            filters: [
                { 
                    //name: deviceName
                    namePrefix: deviceNamePrefix
                }
            ]
        }
        console.log("Requesting bluetooth devices...");
        return navigator.bluetooth.requestDevice(option)
        .then(device => {
            device.addEventListener("gattserverdisconnected",event => {
                console.log("disconnected device "+event.target.name);
                console.log(event)
            })
    
            console.log(device);
            console.log("name  =>  "+device.name);
            
            this.bluetoothDeviceDetected = device;
        } ).catch(error =>  {
            console.log("Requesting device ERROR => "+error);
        });
    }

    connectGATT(){
        console.log("!!!connecteGATT function =>");
        console.log(this.bluetoothDeviceDetected);
        if(this.bluetoothDeviceDetected.gatt.connected && this.gattCharacteristic){
            return Promise.resolve()
        }
        return this.bluetoothDeviceDetected.gatt.connect()
        .then(server => {
            console.log("Getting GATT service...");
            return server.getPrimaryService(this.bleService)
        })
        .then(service => {
            this.global_service = service;
            console.log("Getting GATT characteristic...");
            return service.getCharacteristic(this.bleCharacteristic1)
        })
        .then(characteristic => {
            console.log("characteristic Button A");
            this.gattCharacteristic = characteristic;
            //this.gattCharacteristic.addEventListener('characteristicvaluechanged', handleChangedCharacteristicValue)
            
            return this.global_service.getCharacteristic(this.bleCharacteristic2)
        })
        .then(characteristic => {
            console.log("characteristic Button Joystick");
            this.gattCharacteristic2 = characteristic;
            //this.gattCharacteristic2.addEventListener('characteristicvaluechanged', handleChangedCharacteristicValue)
            return this.global_service.getCharacteristic(this.bleCharacteristic3)

        })
        .then(characteristic => {
            console.log("characteristic Joystick");
            this.gattCharacteristic3 = characteristic;
            //this.gattCharacteristic3.addEventListener('characteristicvaluechanged', handleChangedCharacteristicValue)
        })
        .catch(error => {
            this.connected = false;
            console.log("ConnectGATT _ Waiting to start reading: "+error);
        });
    
    }
    readBLECharactristicButtonA(){
        this.gattCharacteristic.readValue().then(
            read => { 
                var data = this.decoder.decode(read);
                if (this.buttonAData != data){
                    this.buttonAData = data;
                    console.log("Characteristic Button A: "+data)
                    if(this.callbackButtonA){
                        this.callbackButtonA(data);
                    }
                }
            }
        )
    }
    readBLECharactristicButtonJoystick(){
        this.gattCharacteristic2.readValue().then(
            read => { 
                var data = this.decoder.decode(read);
                if(this.joystickButtonData != data){
                    this.joystickButtonData = data;
                    console.log("Characteristic button Joystick: "+data) 
                    if(this.callbackButtonJoystick){
                        this.callbackButtonJoystick(data);
                    }
                }
            }
        )
    }
    readBLECharactristicJoystick(){
        this.gattCharacteristic3.readValue().then(
            read => { 
                var data = this.decoder.decode(read)
                if(this.JoystickData != data){
                    this.JoystickData = data;
                    console.log("Characteristic Joystick: "+data) 
                    if(this.callbackJoystick){
                        this.callbackJoystick(data);
                    }
                }
            }
        )
    }   
    stop(){
        if (this.connected){
            if(this.started){
                clearInterval(this.interval);
                //anular setInterval
                this.started = false;
            }
        }
    }
    start(){
        if(this.connected){
            if(!this.started){
                this.interval = setInterval(this.checkChanges.bind(this), 250);
                //setinterval per check canvis
                this.started = true;
            }
        }
        
    }
    connect(){
        return (this.bluetoothDeviceDetected ? Promise.resolve() : this.getDeviceInfo())
        .then(this.connectGATT.bind(this))
        .then (_ => {
            this.connected = true;
            console.log("Reading Characteristic...");
            var read  = this.gattCharacteristic.readValue();
            read  = this.gattCharacteristic2.readValue();
            //console.log("read");
            //console.log(read);
            return read
        })/*.then(read => {
            console.log("after read");
            
            console.log(this.decoder.decode(read));
            var temp = read
        })*/
        .catch(error => {
            this.connected = false;
            console.log("connect: Waiting to start reading: "+error);
        })
    }
    refreshButtonA(){
        if(this.started){
            //console.log("refreshButtonA");
            this.readBLECharactristicButtonA();
        }
    }
    refreshButtonJoystick(){
        if(this.started){
            //console.log("refreshButtonJoystick");
            this.readBLECharactristicButtonJoystick()
        }
    }
    refreshJoystick(){
        if(this.started){
            //console.log("refreshJoystick");
            this.readBLECharactristicJoystick();
        }
    }
    checkChanges(){
        //console.log("checking changes");
        this.refreshButtonA();
        this.refreshButtonJoystick();
        this.refreshJoystick();
    }

    setCallbackButtonA(_callbackButtonA = null){
        this.callbackButtonA = _callbackButtonA;
    }

    setCallbackButtonJoystick(_callbackButtonJoystick = null){
        this.callbackButtonJoystick = _callbackButtonJoystick;
    }

    setCallbackJoystick(_callbackJoystick = null){
        this.callbackJoystick = _callbackJoystick;
    }

}

bluetoothPad = new BluetoothGamePadReciver ();

// /**
//  * 
//  * BLE Functions
//  * 
//  */
// var bluetoothDeviceDetected = null;
// var bleService = "47cb56ca-869d-11ec-a8a3-0242ac120002";
// var bleCharacteristic1 = "f974e804-869e-11ec-a8a3-0242ac120002";
//  var bleCharacteristic2 = "40044cf4-2cba-4c9a-9bac-c24f4e816b84";
// // var bleCharacteristic3 = "3f0e1e64-869d-11ec-a8a3-0242ac120002";

// var gattCharacteristic
// var gattCharacteristic2
// var global_service
// var decoder = new TextDecoder('utf8');
// var temp
// function isWebBLEAvailable(){
//     if(!navigator.bluetooth){
//         return false;
//     }
//     return true;
// }
// function getDeviceInfo() {
//     //var  deviceName  = "ArduinoBlocksBLE_1";
//      var  deviceName  = "ArduinoBLE_2";
//      //var deviceNamePrefix = "NullPointerPad"
//      var deviceNamePrefix = "Arduino"
//     let option = {
//         // acceptAllDevices: true,
//         optionalServices:[bleService],
//         filters: [
//             { 
//                 //name: deviceName
//                 namePrefix: deviceNamePrefix
//               }
//         ]
//     }
//     console.log("Requesting bluetooth devices...");
//     return navigator.bluetooth.requestDevice(option)
    
//     .then(device => {
        
        
//         device.addEventListener("gattserverdisconnected",event => {
//             console.log("disconnected device "+event.target.name);
//             console.log(event)
//         })

//         console.log(device);
//         console.log("name  =>  "+device.name);
        
//         bluetoothDeviceDetected = device;
//     } ).catch(error =>  {
//         console.log("Requesting device ERROR => "+error);
//     });
// }
// function ble_read(){
//     return (bluetoothDeviceDetected ? Promise.resolve() : getDeviceInfo())
//     .then(connectGATT)
//     .then (_ => {

//         console.log("Reading Characteristic...");
//         var read  = gattCharacteristic.readValue();
//         console.log("read");
//         console.log(read);
//         return read
//     }).then(read => {
//         console.log("after read");
        
//         console.log(decoder.decode(read));
//         temp = read
//     })
//     .catch(error => {
//         console.log("Waiting to start reading: "+error);
//     })

// }
// function ble_start(){
//     console.log("ble_start function");
//     gattCharacteristic.addEventListener('characteristicvaluechanged',
//         handleChangedCharacteristicValue);
//     gattCharacteristic.startNotifications()
//     .then(_=> {
//         console.log("start reading ...");
//        console.log(_);
//         console.log('Notifications started');
//         _.addEventListener('characteristicvaluechanged',
//         handleChangedCharacteristicValue);
//         document.getElementById("ble_start").disabled = true;
//         document.getElementById("ble_stop").disabled = false;
//     })
//     .catch(error => {
//         console.log("ble_start ERROR--> "+error);
//     })
// }
// function ble_stop(){
//     gattCharacteristic.stopNotifications()
//     .then(_=> {
//         console.log("stop reading ...");
//         _.removeEventListener('characteristicvaluechanged',
//         handleChangedCharacteristicValue);
//         document.getElementById("ble_start").disabled = false;
//         document.getElementById("ble_stop").disabled = true;

//     })
//     .catch(error => {
//         console.log("ble_stop ERROR--> "+error);
//     })

// }
// function connectGATT(){
//     console.log("connecteGATT function =>");
//     console.log(bluetoothDeviceDetected);
//     if(bluetoothDeviceDetected.gatt.connected && gattCharacteristic){
//         return Promise.resolve()
//     }
//     return bluetoothDeviceDetected.gatt.connect()
//     .then(server => {
//         console.log("Getting GATT service...");
//         return server.getPrimaryService(bleService)
//     })
//     .then(service => {
//         global_service = service;
//         console.log("Getting GATT characteristic...");
//         return service.getCharacteristic(bleCharacteristic1)
//     })
//     .then(characteristic => {
//         gattCharacteristic = characteristic;
//         gattCharacteristic.addEventListener('characteristicvaluechanged', handleChangedCharacteristicValue)
        
//         document.getElementById("ble_start").disabled = false;
//         document.getElementById("ble_stop").disabled = true;

//         return global_service.getCharacteristic(bleCharacteristic2)
//     })
//     .then(characteristic => {
//         gattCharacteristic2 = characteristic;
//         gattCharacteristic2.addEventListener('characteristicvaluechanged', handleChangedCharacteristicValue)
//     });

// }
function handleChangedCharacteristicValue(event){
    console.log("handleChangedCharacteristic");
    temp = event;
    console.log(event);
    let value = event.target.value;
    var now = new Date();
    var decoder = new TextDecoder('utf8');
    console.log("> "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+": Value is "+decoder.decode(value));

}

// function readBLECharactristic(){
//     gattCharacteristic.readValue().then(
//         read => { 
//             console.log(decoder.decode(read)) 
//         }
//     )
// }
// function readBLECharactristic2(){
//     gattCharacteristic2.readValue().then(
//         read => { 
//             console.log(decoder.decode(read)) 
//         }
//     )
// }

// /**
//  * General code
//  */

// // document.getElementById("ble_connector").addEventListener("click", function(event){
// //     console.log("BLE_Connector  click  event");
// //     if(isWebBLEAvailable()){
// //         getDeviceInfo();
// //     }
// // });
// document.getElementById("ble_start").addEventListener("click", function(event){
//     console.log("BLE_Start  click  event");
//     if(isWebBLEAvailable()){
//         ble_start();
//     }
// });
// document.getElementById("ble_stop").addEventListener("click", function(event){
//     console.log("BLE_Stop  click  event");
//     if(isWebBLEAvailable()){
//         ble_stop();
//     }
// });
// document.getElementById("ble_read").addEventListener("click", function(event){
//     console.log("BLE_Read  click  event");
//     if(isWebBLEAvailable()){
//       ble_read();

//     }
// });