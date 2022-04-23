class Ui extends Phaser.Scene {
    constructor() {
        super("ui")
    }

    preload() {
        
    }

    create() {
        //Tiempo
        this.scene.launch('time');
    }

    update() {
        
    }

    getTime() {
        return this.game.scene.keys["time"].getTime()
    }
}