class Enter_password_scene extends Phaser.Scene {
    constructor() {
        super("enter_password_scene")
    }

    preload() {

    }

    create() {
        let { width, height } = this.sys.game.canvas;
        console.log(this.sys.game.canvas.width);
        this.background = this.add.rectangle(0, 0, width, height, 0x6666ff);
        this.background.setOrigin(0,0);
        

        this.puzzle_image= [];
        let x = 0.50;
        for(let i=0; i<9; i++){
            console.log(this.background.height);
            
            if(i>=5){
                this.puzzle_image[i] = this.add.image(0+(x*60), this.background.height/2+40, 'simbol'+i);
                x++;  
            } else {
                this.puzzle_image[i] = this.add.image(0+(i*60), this.background.height/3+40, 'simbol'+i);
            }
            this.puzzle_image[i].setScale(0.3);
            this.puzzle_image[i].setOrigin(0,0);
        }  
        
        this.result_rectangles = [];
        for(let i = 0; i<4; i++){
            this.result_rectangles[i] = this.add.rectangle(2.5+(i*80), 30, 250, 250, 0x9966ff);
            this.result_rectangles[i].setStrokeStyle(4, 0xefc53f);

            this.result_rectangles[i].setScale(0.3);
            this.result_rectangles[i].setOrigin(0,0);
        }

    }

    update(){
        var xKey = this.input.keyboard.addKey('X');
        var xKeyDown = xKey?.isDown

        if(xKeyDown){
            this.scene.stop();
            this.scene.resume("game");

        }
    }
}