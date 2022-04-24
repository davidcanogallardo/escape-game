class HelpDialog extends Phaser.Scene {
    constructor() {
        super("help_dialog")
    }

    preload() {
        
    }

    create() {
        console.log("helppp")
        let { width, height } = this.sys.game.canvas;
        this.add.image(width/2, height/2, 'passwd_bg');

        this.input.keyboard.on('keydown-X',()=>{
            this.scene.stop();
            this.scene.resume("game");
        })
        
    }

    update() {
        
    }
}