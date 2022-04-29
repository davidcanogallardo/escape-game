class Ui extends Phaser.Scene {
    constructor() {
        super("ui")
    }

    preload() {
        
    }

    create() {
        window.ui = this
        //Tiempo
        this.scene.launch('time');
        let { width, height } = this.sys.game.canvas;

        this.helpFrame = this.add.image(0, height, 'helpBtn').setScale(1.3);


        this.helpTitle = this.add.text(0,0, window.i18n.t("game.help"), {
            fontSize: 19,
            fontFamily: 'sans'
        })
        
        if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
            this.helpFrame.setScale(0.9)
            this.helpTitle.setFontSize(13)
            
            this.blueBtn = this.add.image(width-100 , height-100, 'blue').setScale(0.7).setDepth(999);
            this.redBtn = this.add.image(width-200, height-100, 'red').setScale(0.7).setDepth(999);
            this.greenBtn = this.add.image(width-300, height-100, 'green').setScale(0.7).setDepth(999);
            this.greenBtn2 = this.add.image(width-400, height-100, 'green').setScale(0.7).setDepth(999);
    
            (this.blueBtn).setInteractive().on('pointerdown', function(pointer){
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
            this.blueBtn.y += 50 
            this.redBtn.y += 50 
            this.greenBtn.y += 50 
            this.greenBtn2.y += 50 
            // this.blueBtn.x += 50 
            // this.redBtn.x += 50 
            // this.greenBtn.x += 50 
            // this.greenBtn2.x += 50 
        }
        this.helpFrame.x += (this.helpFrame.displayWidth/2)+10
        this.helpFrame.y -= (this.helpFrame.displayHeight/2)+10

        this.helpTitle.x = this.helpFrame.x
        this.helpTitle.y = this.helpFrame.y

        this.helpTitle.x -= (this.helpTitle.displayWidth/2)
        this.helpTitle.y -= (this.helpTitle.displayHeight/2)
    }

    update() {
        this.scene.bringToTop();
    }

    getTime() {
        return this.game.scene.keys["time"].getTime()
    }
}