class Ui extends Phaser.Scene {
    constructor() {
        super("ui")
    }

    preload() {
        
    }

    create() {
        //Tiempo
        this.scene.launch('time');

        console.log("222")
        let { width, height } = this.sys.game.canvas;

        this.help = this.add.image(0, height, 'helpBtn');

        this.help.setScale(1.5)
        
        this.help.x += (this.help.displayWidth/2)+10
        this.help.y -= (this.help.displayHeight/2)+10

        this.input.keyboard.on('keydown-H',()=>{
            console.log("mensaje de ayuda22233");
            console.log(this.scene);
            this.scene.launch('help_dialog')
        })

        this.title = this.add.text(this.help.x,this.help.y, 'Press H for help', {
            fontSize: 30,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        this.title.x -= (this.title.displayWidth/2)
        this.title.y -= (this.title.displayHeight/2)

        window.ui = this
    }

    update() {
        
    }

    getTime() {
        return this.game.scene.keys["time"].getTime()
    }
}