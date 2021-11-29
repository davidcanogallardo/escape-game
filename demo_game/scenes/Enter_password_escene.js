class Enter_password_scene extends Phaser.Scene {
    constructor() {
        super("enter_password_scene")
    }

    preload() {

    }

    create() {
        let { canvas_width, canvas_height } = this.sys.game.canvas;
        console.log(canvas_width);
        let background = this.add.rectangle(150, 160, canvas_width, canvas_height, 0x6666ff);

        this.puzzle_image= [];
        let x = 0.50;
        for(let i=0; i<9; i++){
            console.log(i);
            
            if(i>=5){
                this.puzzle_image[i] = this.add.image(0+(x*60), background.height/2, 'simbol'+i);
                x++;  
            } else {
                this.puzzle_image[i] = this.add.image(0+(i*60), background.height/2, 'simbol'+i);
            }
            this.puzzle_image[i].setScale(0.3);
            this.puzzle_image[i].setOrigin(0,0);
        }  
        
        this.result_rectangles = [];
        for(let i = 0; i<4; i++){
            this.result_rectangles[i] = this.add.rectangle(0+(i*60), background.height+100, 50, 200, 0x9966ff);
            this.result_rectangles[i].setStrokeStyle(4, 0xefc53f);

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