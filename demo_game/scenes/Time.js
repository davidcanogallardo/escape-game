class Time extends Phaser.Scene {
    constructor() {
        super("time")
    }

    preload() {
        this.segundos = 0;
    }

    create() {
        window.time = this
        this.title = this.add.text(0,0, window.i18n.t("game.time")+": 0:00", {
            fontSize: 35,
            fontFamily: 'sans'
        })




        this.title.setDepth(100)
        //Evento que se ejecturá en bucle cada 1s y actualizará el tiempo
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });

        this.scene.get('game').events.on("end", this.end, this);

        this.timeFrame = this.add.image(5, 0, 'time_frame').setScale(0.8);
        this.timeFrame.setDepth(99)


        if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
            this.title.setFontSize(22)
            this.timeFrame.setScale(0.5)
        }

        this.timeFrame.x = (5+(this.timeFrame.displayWidth/2))
        this.timeFrame.y = (5+(this.timeFrame.displayHeight/2))

        this.title.x = this.timeFrame.x-(this.title.displayWidth/2)
        this.title.y = this.timeFrame.y-(this.title.displayHeight/2)


        
    }

    update() {
        // 
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
        this.title.setText(window.i18n.t("game.time")+': ' + this.formatTime(this.segundos));
    }


}