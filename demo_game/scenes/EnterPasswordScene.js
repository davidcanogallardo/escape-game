class EnterPasswordScene extends Phaser.Scene {
    /*
        TODO
        * RESETEAR CAMPOS RESPUESTA CON TECLA R
        * RESETEAR CAMPOS RESPUESTA INCORRECTO
        * PONER IMAGEN EN SU SITIO
        * DESACTIVAR ICONO CUANDO SE PONE
        * ACABAR PUZZLE
    */

    selectedButtonIndex = 0;
    puzzle_buttons = [];

    correctAnswer = ["simbol0","simbol1","simbol2","simbol3"];

    constructor() {
        super("enterPasswordScene")
    }

    preload() {

    }

    create() {
        var path2 = ""
        let { width, height } = this.sys.game.canvas;
        //console.log(this.sys.game.canvas.width);
        this.background = this.add.image(0, 0, 'passwd_bg');
        this.background.setScale(0.3);
        this.background.setOrigin(0,0);
        this.cursors = this.input.keyboard.createCursorKeys();



        let x = 0.50;
        for(let i=0; i<9; i++){
            console.log(this.background.height);
            let button = [];
            if(i>=5){
                button[0] = this.add.image(0+(x*60), height/2+40, 'simbol'+i);
                button[1] = this.add.rectangle(10+(x*60), height/2+50, 55, 55);
                button[1].setStrokeStyle(2, 0xffffff);
                button[1].setVisible(false);
                this.puzzle_buttons[i] = button;
                x++;  
            } else {
                button[0] = this.add.image(0+(i*60), height/3+40, 'simbol'+i);
                button[1] = this.add.rectangle(10+(i*60), height/3+50, 55, 55);
                button[1].setStrokeStyle(2, 0xffffff);
                button[1].setVisible(false);
                this.puzzle_buttons[i] = button;
            }
            this.puzzle_buttons[i][0].setScale(0.3);
            this.puzzle_buttons[i][0].setOrigin(0,0);
            this.puzzle_buttons[i][1].setOrigin(0,0);
            this.puzzle_buttons[i][1].setDepth(1);
            
            console.log(this.correctAnswer.includes(this.puzzle_buttons[i][0].texture.key)); 
            //console.log(this.puzzle_buttons[i][0].texture.key === "simbol1")
            //this.puzzle_buttons[i][0].setTint(59000000);
        }  
        
        this.result_rectangles = [];
        for(let i = 0; i<4; i++){
            this.result_rectangles[i] = this.add.rectangle(2.5+(i*80), 30, 250, 250, 0x9966ff);
            this.result_rectangles[i].setStrokeStyle(4, 0xefc53f);

            this.result_rectangles[i].setScale(0.3);
            this.result_rectangles[i].setOrigin(0,0);
        }
        console.log(this.puzzle_buttons[0]);
        this.selectIcon(0);

    }


    update(){
        var xKey = this.input.keyboard.addKey('X');
        var xKeyDown = xKey?.isDown

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.selectNextButton(-1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.selectNextButton(1);
        }

        if(xKeyDown){
            this.scene.stop();
            this.scene.resume("game");

        }
    }

    selectIcon(index){
        console.log(this.puzzle_buttons);
        const currentIcon = this.puzzle_buttons[this.selectedButtonIndex][0];
        const currentIconBorder = this.puzzle_buttons[this.selectedButtonIndex][1]
        //currentIcon.setTint(59000000);
        currentIconBorder.setVisible(false);

        const icon = this.puzzle_buttons[index][0];
        const iconBorder = this.puzzle_buttons[index][1]
        //icon.setTint(0xffffff);
        iconBorder.setVisible(true);
        
        this.selectedButtonIndex = index;
    }

    selectNextButton(change){
        let index = this.selectedButtonIndex + change

        // wrap the index to the front or end of array
        if (index >= this.puzzle_buttons.length)
        {
            index = 0
        }
        else if (index < 0)
        {
            index = this.puzzle_buttons.length - 1
        }

        this.selectIcon(index)
    }

    confirmSelection(){
	    // get the currently selected button
        const button = this.buttons[this.selectedButtonIndex][0]

        // emit the 'selected' event
        button.emit('selected')
    }

}