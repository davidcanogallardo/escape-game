class Pause_scene extends Phaser.Scene {
    constructor() {
        super("pause_scene")
    }

    preload() {
        
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'PAUSE', {
            fontSize: 27,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setDepth(10)
        title.setOrigin(0.5, 0.5)

        this.add.text(width / 2, height / 2+50, 'Presiona ESC para volver', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setDepth(10)
        .setOrigin(0.5)

        this.veil = this.add.graphics({x: 0, y:0})
        this.veil.fillStyle('0x000000', 0.3)
        this.veil.fillRect(0,0,width, height)
        
        // this.input.keyboard.once('keydown-ESC', () => {
        //     this.scene.resume('game');
        //     this.scene.stop();
        // })
        this.scene.bringToTop();
    }
    update(){
        if (game.scene.game.hasFocus) {
            this.scene.resume('game');
            this.scene.stop();
        }
    }
}