class Ui extends Phaser.Scene {
    constructor() {
        super("ui")
    }

    preload() {
        if(this.isMobile()){
            this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        }
    }

    create() {
        window.ui = this
        //Tiempo
        this.scene.launch('time');
        let { width, height } = this.sys.game.canvas;

        this.helpFrame = this.add.image(0, height, 'helpBtn').setScale(1.3);


        this.helpTitle = this.add.text(0,0, window.i18n.t("game.help"), {
            fontSize: 19,
            fontFamily: 'sans'
        })
        
        if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
            this.helpFrame.setScale(0.9)
            this.helpTitle.setFontSize(13)
            
            this.redBtn = this.add.image(width-100, height-100, 'red').setScale(0.7).setDepth(2000);
            this.blueBtn = this.add.image(width-200 , height-100, 'blue').setScale(0.7).setDepth(2000);
            this.greenBtn = this.add.image(width-300, height-100, 'green').setScale(0.7).setDepth(2000);
            this.greenBtn2 = this.add.image(width-400, height-100, 'green').setScale(0.7).setDepth(2000);
    
            (this.blueBtn).setInteractive().on('pointerup', function(pointer){
                this.events.emit('interactuate');
            }, this);
    
            (this.redBtn).setInteractive().on('pointerup', function(pointer){
                this.events.emit('quit');
            }, this);
    
            (this.greenBtn).setInteractive().on('pointerdown', function(pointer){
                this.events.emit('mute');
            }, this);
    
            (this.greenBtn2).setInteractive().on('pointerdown', function(pointer){
                this.events.emit('help');
            }, this);
            this.blueBtn.y += 50 
            this.redBtn.y += 50 
            this.greenBtn.y += 50 
            this.greenBtn2.y += 50 
            // this.blueBtn.x += 50 
            // this.redBtn.x += 50 
            // this.greenBtn.x += 50 
            // this.greenBtn2.x += 50 
        }
        this.helpFrame.x += (this.helpFrame.displayWidth/2)+10
        this.helpFrame.y -= (this.helpFrame.displayHeight/2)+10

        this.helpTitle.x = this.helpFrame.x
        this.helpTitle.y = this.helpFrame.y

        this.helpTitle.x -= (this.helpTitle.displayWidth/2)
        this.helpTitle.y -= (this.helpTitle.displayHeight/2)

        if(this.isMobile()){
            console.log("Mobile");
            this.virtualJoyStick = this.game.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 50,
                y: height/2,
                radius: 30,
                base: this.add.circle(0, 0, 30, 0x888888),
                thumb: this.add.circle(0, 0, 20, 0xcccccc),
                // dir: '8dir',
                // forceMin: 16,
                // fixed: true,
                // enable: true
            });
            this.virtualJoyStick.base.setDepth(999);
            this.virtualJoyStick.thumb.setDepth(999);

            //Mover personaje con joystick
            // console.log(game.scene.getScene("game").moveVirtualJoyStick());
            this.virtualJoyStick.on('update', this.moveVirtualJoyStick, this);
            // if(navigator.userAgentData.mobile){
                
            // }
            

            // this.buttonA = this.add.group(this);
            // this.buttonACirc = this.add.circle(40, 300, 20, 0x888888);
            // this.buttonAText = this.add.text(40, 300, 'A');
            // this.buttonA.add(this.buttonACirc);
            // this.buttonA.add(this.buttonAText);
            // this.buttonA.incX(40);
            // this.buttonA.incY(300);

            // this.buttonB = this.add.group(this);
            // this.buttonBCirc = this.add.circle(55, 300, 20, 0x888888);
            // this.buttonBText = this.add.text(55, 300, 'B');
            // this.buttonB.add(this.buttonBCirc);
            // this.buttonB.add(this.buttonBText);
            // this.buttonB.incX(55);
            // this.buttonB.incY(300);
        }

    }

    moveVirtualJoyStick(){
        var cursorKeys = this.virtualJoyStick.createCursorKeys();
        var direction = '';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                direction += `${name} `;
            }
        }
        
        
        let moveData = {
            angle: this.virtualJoyStick.angle,
            direction: direction
        }
        game.scene.getScene("game").moveVirtualJoyStickInGame(moveData);
    }

    update() {
        this.scene.bringToTop();
    }

    getTime() {
        return this.game.scene.keys["time"].getTime()
    }

    isMobile(){
        if(navigator.userAgent.toLowerCase().match("android")!=null || navigator.userAgent.toLowerCase().match("iphone") !=null){
            return true
        } else {
            return false;
        }
    }
}