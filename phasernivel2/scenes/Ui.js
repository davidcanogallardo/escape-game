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
}