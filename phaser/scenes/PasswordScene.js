class PasswordScene extends Phaser.Scene {
    constructor() {
        super("passwordScene")
    }

    preload() {

    }

    create() {
        let background = this.add.image(150, 150, "password_background");
        background.setScale(0.3);

        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'password', {
            fontSize: 27,
            fontFamily: 'sans'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona "X" para volver', {
            fontFamily: 
            
        })
        .setOrigin(0.5)
    }

    update(){
        var xKey = this.input.keyboard.addKey('X');
        var xKeyDown = xKey?.isDown

        if(xKeyDown){
            this.scene.stop();
            this.scene.resume("game");

        }
    }
}