class PasswordMGScene extends GenericMiniGame {
    constructor(type,difficulty) {
        super("passwordScene", type, difficulty)
        this.symbols = ['simbol0','simbol1','simbol2','simbol3','simbol4','simbol5','simbol6','simbol7','simbol8'];
        this.shuffleSymbols = symbols.sort((a, b) => 0.5 - Math.random());
        this.correctPassword = [];
        this.answerPlayer = [];

        if (difficulty=='easy') {
            for (let x = 0; x < 4; x++) {
                this.correctPassword.push(this.shuffleSymbols[x]);
            }
            
        }else if(difficulty=='medium'){
            for (let x = 0; x < 6; x++) {
                this.correctPassword.push(this.shuffleSymbols[x]);
            }
        }else{
            for (let x = 0; x < 9; x++) {
                this.correctPassword.push(this.shuffleSymbols[x]);
            }
        }

    }

    preload(){

    }

    create(){
        if (this.type=='challenge') {
            this.correctAnswer = ["cross1R","cross1B","cross2Y","cross2G"];
            var path2 = ""
            let { width, height } = this.sys.game.canvas;
            //console.log(this.sys.game.canvas.width);
            this.background = this.add.image(0, 0, 'passwd_bg');
            this.background.setScale(0.3);
            this.background.setOrigin(0,0);
            this.cursors = this.input.keyboard.createCursorKeys();



            let x = 0.50;
            for(let i=0; i<9; i++){
                let button = [];
                if(i>=5){
                    button[0] = this.add.image(0+(x*60), height/2+40, this.symbols[i]);
                    button[1] = this.add.rectangle(10+(x*60), height/2+50, 55, 55);
                    button[1].setStrokeStyle(2, 0xffffff);
                    button[1].setVisible(false);
                    this.puzzle_buttons[i] = button;
                    x++;  
                } else {
                    button[0] = this.add.image(0+(i*60), height/3+40, this.symbols[i]);
                    button[1] = this.add.rectangle(10+(i*60), height/3+50, 55, 55);
                    button[1].setStrokeStyle(2, 0xffffff);
                    button[1].setVisible(false);
                    this.puzzle_buttons[i] = button;
                }
                this.puzzle_buttons[i][0].setScale(0.3);
                this.puzzle_buttons[i][0].setOrigin(0,0);
                this.puzzle_buttons[i][1].setOrigin(0,0);
                this.puzzle_buttons[i][1].setDepth(1);
                window.b = button[0];
                //console.log(this.correctAnswer.includes(this.puzzle_buttons[i][0].texture.key)); 
                //console.log(this.puzzle_buttons[i][0].texture.key === "simbol1")
                //this.puzzle_buttons[i][0].setTint(59000000);
            } 
            
            for (let i = 0; i < this.puzzle_buttons.length; i++) {
                switch (i) {
                    case 0:
                        this.puzzle_buttons[i].push('cross1R');
                        break;
                    case 1:
                        this.puzzle_buttons[i].push('cross1B');
                        break;
                    case 2:
                        this.puzzle_buttons[i].push('cross2Y');
                        break;
                    case 3:
                        this.puzzle_buttons[i].push('cross2G');
                        break;
                    case 4:
                        this.puzzle_buttons[i].push('cross1Y');
                        break;
                    case 5:
                        this.puzzle_buttons[i].push('cross1G');
                        break;
                    case 6:
                        this.puzzle_buttons[i].push('cross3R');
                        break;
                    case 7:
                        this.puzzle_buttons[i].push('cross3B');
                        break;
                    case 8:
                        this.puzzle_buttons[i].push('cross2R');
                        break;
                    default:
                        break;
                }
                
            }
            
            this.result_rectangles = [];
            for(let i = 0; i<4; i++){
                this.result_rectangles[i] = this.add.rectangle(2.5+(i*80), 30, 250, 250, 0x9966ff);
                this.result_rectangles[i].setStrokeStyle(4, 0xefc53f);

                this.result_rectangles[i].setScale(0.3);
                this.result_rectangles[i].setOrigin(0,0);
                
                //console.warn(this.result_rectangles[i].x);
                // console.warn(this.result_rectangles[i].width);
                // console.warn(this.result_rectangles[i].height);

            }
            this.selectIcon(0);
            this.password = []
            window.pass = this.password
            var that = this;
            window.r = this.result_rectangles;
            this.count = 0;
            this.win = false;
            this.input.keyboard.on('keydown-K', function () {
                let count = that.count;
                // console.warn((that.result_rectangles[count].width/2));
                //console.warn((that.result_rectangles[count].x));
                var w = (that.result_rectangles[count].width/2)*0.3
                var h = (that.result_rectangles[count].height/2)*0.3
                var x = that.result_rectangles[count].x
                var y = that.result_rectangles[count].y


                that.password.push(that.puzzle_buttons[that.selectedButtonIndex][2])

                that.result_rectangles[count] = that.add.image(x+w,y+h,that.puzzle_buttons[that.selectedButtonIndex][0].texture.key);
                that.result_rectangles[count].setScale(0.3);
                //console.error(that.puzzle_buttons[that.selectedButtonIndex][2]);

                if (that.password.length == 4 && !that.arraysEqual(that.password,that.correctAnswer)) {
                    //console.log("ERROR")
                    that.scene.stop();
                    that.scene.resume("game");
                }
                if (that.arraysEqual(that.password,that.correctAnswer)) {
                    that.win = true;
                }
                // console.log(that.win);
                // console.log(that.password);
                // console.log(that.correctAnswer);
                // console.log(that.arraysEqual(that.password,that.correctAnswer));
                that.count++;
            });
        } else {
            let {width, height} = this.sys.game.canvas;
            this.background = this.add.image(0, 0, 'passwd_bg');
            this.background.setScale(0.12);
            this.background.setOrigin(-0.2 , -0.7);

            window.h = height;
            window.w = width;
            window.bgg = this.background;

            this.puzzle_image= [];

            let x = 0.50;
            for(let i=0; i<4; i++){
                //console.log(this.background.height);
                
                if(i>=5){
                    this.puzzle_image[i] = this.add.image(0+(x*50), height/2+40, this.symbols[i]);
                    x++;  
                } else {
                    this.puzzle_image[i] = this.add.image(60+(i*50), height/3+20, this.symbols[i]);
                }

                this.puzzle_image[i].setScale(0.2);
                this.puzzle_image[i].setOrigin(0,0);
            }  
        }
    }

    update(){
        if (this.type=='challenge') {
            
        } else {
            var xKey = this.input.keyboard.addKey('X');
            var xKeyDown = xKey?.isDown

            if(xKeyDown){
                this.scene.stop();
                this.scene.resume("game");
            }

            // console.log(this);
            if(this.stickButtonActive){
                this.scene.stop();
                this.scene.resume("game");
                this.stickButtonActive = false;
            }
        }
    }
}