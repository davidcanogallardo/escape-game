class Time extends Phaser.Scene {
    constructor() {
        super("time")
    }

    preload() {
        if(navigator.userAgentData.mobile){
            this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        }
        this.segundos = 0;
    }

    create() {
        this.title = this.add.text(25,30, 'Tiempo: ', {
            fontSize: 35,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        window.timee = this


        this.title.setDepth(100)
        //Evento que se ejecturá en bucle cada 1s y actualizará el tiempo
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });

        this.scene.get('game').events.on("end", this.end, this);

        this.time = this.add.image(5, 0, 'time_frame');
        this.time.setDepth(99)
        this.time.setScale(1)
        this.time.x = (5+(this.time.displayWidth/2))
        this.time.y = (5+(this.time.displayHeight/2))

        window.time = this.time

        if(navigator.userAgentData.mobile){
            this.virtualJoyStick = this.game.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 50,
                y: 250,
                radius: 20,
                base: this.add.circle(0, 0, 20, 0x888888),
                thumb: this.add.circle(0, 0, 10, 0xcccccc),
                // dir: '8dir',
                // forceMin: 16,
                // fixed: true,
                // enable: true
            });
            this.virtualJoyStick.base.setDepth(1000);
            this.virtualJoyStick.thumb.setDepth(1000);

            //Mover personaje con joystick
            this.virtualJoyStick.on('update', this.moveVirtualJoyStick, this);
            // if(navigator.userAgentData.mobile){
                
            // }
            

            // this.buttonA = this.add.group(this);
            // this.buttonACirc = this.add.circle(40, 300, 20, 0x888888);
            // this.buttonAText = this.add.text(40, 300, 'A');
            // this.buttonA.add(this.buttonACirc);
            // this.buttonA.add(this.buttonAText);
            // this.buttonA.incX(40);
            // this.buttonA.incY(300);

            // this.buttonB = this.add.group(this);
            // this.buttonBCirc = this.add.circle(55, 300, 20, 0x888888);
            // this.buttonBText = this.add.text(55, 300, 'B');
            // this.buttonB.add(this.buttonBCirc);
            // this.buttonB.add(this.buttonBText);
            // this.buttonB.incX(55);
            // this.buttonB.incY(300);
        }
    }

    update() {
        // 
    }

    moveVirtualJoyStick(){
        // this.playersGroup.getChildren().forEach(player => {
        //     if(socket.id == player.id){
        //         var cursorKeys = this.virtualJoyStick.createCursorKeys();
        //         var direction = '';
        //         for (var name in cursorKeys) {
        //             if (cursorKeys[name].isDown) {
        //                 direction += `${name} `;
        //             }
        //         }
        //         this.virtualJoyStickIsActive = true;
        //         //console.log(this.virtualJoyStick.angle);
                
        //         // this.speeds['x'] = this.virtualJoyStick.angle;
        //         // this.speeds['y'] = this.virtualJoyStick.angle;
        //         // this.stickDirection = direction;
        //         //console.log(this.speeds);
        //         //console.log(this.stickDirection);
        //     }
        // });
        //console.log("Se movio el joystick");

        // player.x_speed = this.speeds['x'];
        // player.y_speed = this.speeds['y'];
        // player.direction = this.stickDirection;
    }

    getTime(){
        return this.segundos;
    }

    end() {
        console.log("End en time");
        this.time.removeEvent(this.timedEvent);
        this.scene.get('EndGameScene').events.emit("tiempo", this.segundos)
    }

    formatTime(seconds){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }
    
    
    updateTime () {
        this.segundos += 1;
        this.title.setText('Tiempo: ' + this.formatTime(this.segundos));
    }
}