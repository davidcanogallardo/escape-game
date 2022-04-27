class Ui extends Phaser.Scene {
    constructor() {
        super("ui")
    }

    preload() {
        
    }



    create() {
        //Tiempo
        this.scene.launch('time');
        window.jkk = this.scene
        console.log("222")
        let { width, height } = this.sys.game.canvas;

        this.help = this.add.image(0, height, 'helpBtn');

        this.help.setScale(1.5)
        
        this.help.x += (this.help.displayWidth/2)+10
        this.help.y -= (this.help.displayHeight/2)+10

        this.blueBtn = this.add.image(width-100 , height-100, 'blue').setScale(0.7).setDepth(999);
        this.redBtn = this.add.image(width-200, height-100, 'red').setScale(0.7).setDepth(999);
        this.greenBtn = this.add.image(width-300, height-100, 'green').setScale(0.7).setDepth(999);
        this.greenBtn2 = this.add.image(width-400, height-100, 'green').setScale(0.7).setDepth(999);

        // (this.blueBtn).setInteractive().on('pointerdown', function(pointer){
        //     this.events.emit('interactuate');
        // }, this);
        (this.blueBtn).setInteractive().on('pointerup', function(pointer){
            this.events.emit('interactuate');
        }, this);

        (this.redBtn).setInteractive().on('pointerup', function(pointer){
            this.events.emit('quit');
        }, this);

        (this.greenBtn).setInteractive().on('pointerdown', function(pointer){
            this.events.emit('mute');
        }, this);

        (this.greenBtn2).setInteractive().on('pointerdown', function(pointer){
            this.events.emit('help');
        }, this);



        this.title = this.add.text(this.help.x,this.help.y, window.i.t("game.help"), {
            fontSize: 28,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        this.title.x -= (this.title.displayWidth/2)
        this.title.y -= (this.title.displayHeight/2)

        window.ui = this
    }

    update() {
        this.scene.bringToTop();
    }

    getTime() {
        return this.game.scene.keys["time"].getTime()
    }
}