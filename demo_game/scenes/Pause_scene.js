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
        })
        title.setOrigin(0.5, 0.5)

        this.add.text(width / 2, height / 2+50, 'Presiona ESC para volver', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        .setOrigin(0.5)
    
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.resume('game');
            this.scene.stop();
        })
    }
}