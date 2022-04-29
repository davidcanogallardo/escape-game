class HelpDialog extends Phaser.Scene {
    constructor() {
        super("help_dialog")
    }

    init (data) {
        this.helpMessage = data.message
        this.sceneKey = data.scene
    }

    preload() {
        
    }

    create() {
        window.helpd = this
        this.scene.bringToTop();
        let { width, height } = this.sys.game.canvas;
        if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
            this.dialogFrameScale = 0.8
            this.textSize = 15
            this.bottomTextSize = 20
            this.btnScale = 0.4
        } else {
            this.dialogFrameScale = 1.4
            this.textSize = 25
            this.bottomTextSize = 29
            this.btnScale = 0.6

        }
        console.log(this.helpMessage);
        this.helpDialogFrame = this.add.image(
            width/2, 
            height/2, 
            'passwd_bg'
        ).setScale(this.dialogFrameScale).setDepth(1000);
        
        var leftDialog = this.helpDialogFrame.x - (this.helpDialogFrame.displayWidth/2)
        var topDialog = this.helpDialogFrame.y - (this.helpDialogFrame.displayHeight/2)+80
        var bottomDialog = this.helpDialogFrame.y + (this.helpDialogFrame.displayHeight/2)-80

        this.awsd = this.add.image(0, this.helpDialogFrame.y-20, 'awsd').setScale(this.btnScale).setDepth(1001);
        this.blue = this.add.image(0, this.helpDialogFrame.y-20, 'blue').setScale(this.btnScale).setDepth(1001);
        this.red = this.add.image(0, this.helpDialogFrame.y-20, 'red').setScale(this.btnScale).setDepth(1001);
        this.green = this.add.image(0, this.helpDialogFrame.y-20, 'green').setScale(this.btnScale).setDepth(1001);

        // Guardo los botones en un array de arrays con el 
        // boton y el texto que tendrá debajo
        var buttons = [
            [this.awsd, window.i18n.t("game.keyHints.movement")],
            [this.blue, window.i18n.t("game.keyHints.action")],
            [this.green, window.i18n.t("game.keyHints.muteMic")],
            [this.red, window.i18n.t("game.keyHints.quit")]
        ]

        // Distancia en px entre imagen e imagen
        var pxDistance = this.helpDialogFrame.displayWidth/buttons.length

        // itero los botones para colocarlos
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            var distanceBetweenImg = ((i+1)*pxDistance)-(i*pxDistance)
            var xPos = leftDialog+(i*pxDistance)+(distanceBetweenImg/2)
            button[0].x = xPos

            var text = this.add.text(xPos,this.helpDialogFrame.y+30, button[1], {
                fontSize: this.textSize,
                fontFamily: 'sans'
            }).setDepth(1001)
            text.x -= text.displayWidth/2
        }

        var text = this.add.text(this.helpDialogFrame.x,this.helpDialogFrame.y+70, this.helpMessage, {
            fontSize: this.bottomTextSize,
            fontFamily: 'sans'
        }).setDepth(1001)
        text.x -= text.displayWidth/2

        this.input.keyboard.on('keydown-X',()=>{
            this.quit()
        })
        this.scene.get('ui').events.on('quit', this.quit, this);


    }

    quit() {
        console.log(this.scene);
        this.scene.resume(this.sceneKey);
        this.scene.stop();
    }

    update() {
        
    }
}