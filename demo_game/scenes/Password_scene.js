class Password_scene extends Phaser.Scene {
    constructor() {
        super("password_scene")
    }

    preload() {

    }

    create() {
        let background = this.add.image(150, 150, "password_background");
        background.setScale(0.3);

        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'password', {
            fontSize: 27,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona "E" para volver', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        .setOrigin(0.5)
    }

    update(){
        var spaceKey = this.input.keyboard.addKey('E');
        var spaceKeyDown = spaceKey?.isDown

        if(spaceKeyDown){
            this.scene.switch("game")
        }
    }
}