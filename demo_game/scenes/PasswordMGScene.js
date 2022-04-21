
class PasswordMGScene extends GenericMiniGame {
    constructor(room,type,difficulty,password) {
        super("PasswordMGScene"+room+"_"+type, type, difficulty);
        this.type = type;
        this.difficulty = difficulty;
        
        this.symbols = [0,1,2,3,4,5,6,7,8];
        this.shuffleSymbols = this.symbols.sort(() => Math.random() - 0.5);
        this.correctPassword = [];
        
        let shuffled = this.shuffleSymbols.sort(() => Math.random() - 0.5);
        for (let x = 0; x < 2+(2*this.getDiff(this.difficulty)); x++) {
            this.correctPassword.push(shuffled[x]);
        }
        // window.corr = 
        this.shuffleSymbols = [0,1,2,3,4,5,6,7,8];
        //Si al constructor no le llega ninguna contraseña este la genera automaticamente en el caso contrario la almacena
        if (password == null) {
            // if (difficulty = 'easy') {
            //     this.correctPassword = [0,1,2,3]
            // } else if (difficulty = 'medium') {
            //     this.correctPassword = [0,1,2,3,4,5]
            // } else if (difficulty = 'hard') {
            //     this.correctPassword = [0,1,2,3,4,5,6,7]
            // }
            let shuffled = this.shuffleSymbols.sort(() => Math.random() - 0.5);
            for (let x = 0; x < 2+(2*this.getDiff(this.difficulty)); x++) {
                this.correctPassword.push(shuffled[x]);
            }
        } else {
            this.correctPassword = password
        }
        
        
    }

    getPassword(){
        return this.correctPassword
    }

    setPassword(){
        
    }

    puzzle_buttons = [];
    selectedButtonIndex = 0;
    preload(){
//=============opciones jugador con ventana reto=========================================
//=============opciones jugador con ventana helper=========================================
    }

    create(){
//=============opciones jugador con ventana reto=========================================
        if (this.type=='challenge') {
            // this.correctAnswer = [0,1,2,3];
            this.correctAnswer = this.correctPassword
            var path2 = ""
            let { width, height } = this.sys.game.canvas;
            //console.log(this.sys.game.canvas.width);
            this.background = this.add.image(0, 0, 'passwd_bg');
            this.background.setScale(0.3);
            this.background.setOrigin(0,0);
            this.cursors = this.input.keyboard.createCursorKeys();

            var difficulty = this.getDiff(this.difficulty);
            let x = 0.50;
            for(let i=0; i<9; i++){
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
                    console.log(button);
                    this.puzzle_buttons[i] = button;
                }
                this.puzzle_buttons[i][0].setScale(0.3);
                this.puzzle_buttons[i][0].setOrigin(0,0);
                this.puzzle_buttons[i][1].setOrigin(0,0);
                this.puzzle_buttons[i][1].setDepth(1);
                window.b = button[0];
                console.log(this.correctAnswer.includes(this.puzzle_buttons[i][0].texture.key)); 
                //console.log(this.puzzle_buttons[i][0].texture.key === "simbol1")
                //this.puzzle_buttons[i][0].setTint(59000000);
            } 
            
            for (let i = 0; i < this.puzzle_buttons.length; i++) {
                this.puzzle_buttons[i].push(this.shuffleSymbols[i]);
            }
            
            this.result_rectangles = [];
            for(let i = 0; i<2+(2*difficulty); i++){
                if (difficulty==1) {
                    this.result_rectangles[i] = this.add.rectangle(2.5+(i*80), 30, 250, 250, 0x9966ff); //difficulty 1
                } else if (difficulty==2) {
                    this.result_rectangles[i] = this.add.rectangle(2.5+(i*50), 30, 150, 150, 0x9966ff); //difficulty 2
                } else if (difficulty==3) {
                    this.result_rectangles[i] = this.add.rectangle(2.5+(i*40), 30, 120, 120, 0x9966ff); //difficulty 3
                }
                this.result_rectangles[i].setStrokeStyle(4, 0xefc53f);

                this.result_rectangles[i].setScale(0.3);
                this.result_rectangles[i].setOrigin(0,0);
                
                console.warn(this.result_rectangles[i].x);
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
            this.input.keyboard.on('keydown-E', function () {
                let count = that.count;
                // console.warn((that.result_rectangles[count].width/2));
                console.warn((that.result_rectangles[count].x));
                var w = (that.result_rectangles[count].width/2)*0.3
                var h = (that.result_rectangles[count].height/2)*0.3
                var x = that.result_rectangles[count].x
                var y = that.result_rectangles[count].y

                that.password.push(that.puzzle_buttons[that.selectedButtonIndex][2])

                that.result_rectangles[count] = that.add.image(x+w,y+h,that.puzzle_buttons[that.selectedButtonIndex][0].texture.key);
                
                if (difficulty==1) {
                    that.result_rectangles[count].setScale(0.3); //difficulty 1
                } else if (difficulty==2) {
                    that.result_rectangles[count].setScale(0.2); //difficulty 2
                } else if (difficulty==3) {
                    that.result_rectangles[count].setScale(0.15); //difficulty 3
                }

                console.error(that.puzzle_buttons[that.selectedButtonIndex][2]);

                if (that.password.length == 2+(2*difficulty) && !that.arraysEqual(that.password,that.correctAnswer)) {
                    console.log("ERROR")
                    that.scene.stop();
                    that.scene.resume("game");
                }
                if (that.arraysEqual(that.password,that.correctAnswer)) {
                    that.win = true;
                }
                console.log(that.win);
                console.log(that.password);
                console.log(that.correctAnswer);
                console.log(that.arraysEqual(that.password,that.correctAnswer));
                that.count++;
                
            });
            
//=============opciones jugador con ventana helper=========================================
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
            for(let i=0; i<this.correctPassword.length; i++){
                //console.log(this.background.height);
                
                //if(i>=5){
                    this.puzzle_image[i] = this.add.image(85+(i*40), height/2-20, 'simbol'+this.correctPassword[i]);
                    x++;  
                // } else {
                //     this.puzzle_image[i] = this.add.image(0+(i*50), height/2+40, 'simbol'+this.correctPassword[i]);
                // }

                this.puzzle_image[i].setScale(0.15);
                this.puzzle_image[i].setOrigin(0,0);
            }  
        }
    }

    update(){
        var xKey = this.input.keyboard.addKey('X');
        var xKeyDown = xKey?.isDown;

        if(xKeyDown){
            this.scene.stop();
            this.scene.resume("game");
        }
//=============opciones jugador con ventana reto=========================================
        if (this.type=='challenge') {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.selectNextButton(-1);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.selectNextButton(1);
            }

            if(this.win){
                console.log("VICTORIA")
                this.scene.stop();
                this.scene.resume("game");
                socket.emit('passwordPuzzleComplete');
            }
            
//=============opciones jugador con ventana helper=========================================
        } else {
            // console.log(this);
            if(this.stickButtonActive){
                this.scene.stop();
                this.scene.resume("game");
                this.stickButtonActive = false;
            }
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

    arraysEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);

    }
}