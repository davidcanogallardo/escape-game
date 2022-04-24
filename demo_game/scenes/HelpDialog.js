class HelpDialog extends Phaser.Scene {
    constructor() {
        super("help_dialog")
    }

    preload() {
        
    }

    create() {
        console.log("helppp22")
        let { width, height } = this.sys.game.canvas;
        this.dialog = this.add.image(width/2, height/2, 'passwd_bg');

        var leftDialog = this.dialog.x - (this.dialog.displayWidth/2)
        var topDialog = this.dialog.y - (this.dialog.displayHeight/2)+80
        var bottomDialog = this.dialog.y + (this.dialog.displayHeight/2)-80

        this.awsd = this.add.image(0, this.dialog.y-20, 'awsd').setScale(0.6);
        this.blue = this.add.image(0, this.dialog.y-20, 'blue').setScale(0.6);
        this.red = this.add.image(0, this.dialog.y-20, 'red').setScale(0.6);

        // Guardo los botones en un array de arrays con el 
        // boton y el texto que tendrá debajo
        var buttons = [
            [this.awsd,"Movimiento"],
            [this.blue,"Interactuar"],
            [this.red,"Salir"]
        ]

        // Distancia en px entre imagen e imagen
        var pxDistance = this.dialog.displayWidth/buttons.length

        // itero los botones para colocarlos
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            var distanceBetweenImg = ((i+1)*pxDistance)-(i*pxDistance)
            var xPos = leftDialog+(i*pxDistance)+(distanceBetweenImg/2)
            button[0].x = xPos

            var text = this.add.text(xPos,this.dialog.y+30, button[1], {
                fontSize: 25,
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            })
            text.x -= text.displayWidth/2
        }

        window.help = this

        this.input.keyboard.on('keydown-X',()=>{
            this.scene.stop();
            this.scene.resume("game");
        })
        
    }

    update() {
        
    }
}