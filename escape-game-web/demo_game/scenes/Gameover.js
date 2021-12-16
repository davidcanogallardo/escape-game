class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover")
    }
    //Datos de otra instancia
    init (data) {
        console.log('init', data);
        this.segundos = data.score;
    }
    preload() {

    }

    create() {
        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'Partida terminada', {
            fontSize: 27,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona espacio para volver a la menú principal', {
            fontSize: 13,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        .setOrigin(0.5)
    
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("titlescreen")
        })
    }
}