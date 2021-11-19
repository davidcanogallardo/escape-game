class Titlescreen extends Phaser.Scene {
    constructor() {
        super("titlescreen")
    }

    preload() {

    }

    create() {
        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'La grieta del summoner', {
            fontSize: 27,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona espacio para empezar', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        .setOrigin(0.5)
    
        this.input.keyboard.once('keyup_SPACE', () => {
            console.log("object");
            this.scene.start("game")
        })
    }
}
