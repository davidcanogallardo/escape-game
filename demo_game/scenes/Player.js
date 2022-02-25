class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, id, x, y, sprite) {
        super(scene, x, y, sprite);
        this.id = id;
        this.speed = 150;
        scene.add.existing(this);
        this.setDepth(5);
        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.physics.world.enableBody(this);
        this.body.setSize(this.width*0.5, this.height * 0.3).setOffset(8,18);
        //console.log("BODY!")
        //console.log(this.body);
        this.playerCollider = scene.physics.add.image(200, 50);
        //console.log(this.playerCollider);
        this.direction = 'idle'
        this.x_speed = 150;
        this.y_speed = 150;
    

        this.anims.create({
            key: 'player-idle-side',
            frames: [{key: 'player', frame: 'walk-side-3.png'}],
        })
        //arriba
        this.anims.create({
            key: 'player-idle-up',
            frames: [{key: 'player', frame: 'walk-up-3.png'}],
        })
        //abajo
        this.anims.create({
            key: 'player-idle-down',
            frames: [{key: 'player', frame: 'walk-down-3.png'}],
        })

        this.anims.create({
            key: 'player-run-down',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-down-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'player-run-up',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-up-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'player-run-side',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-side-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
    }

    update() {
        this.centerBodyonBody(this.playerCollider,this)

        //console.log(game.scene.getScene("game").stickActive);
        if ( this.anims.currentAnim==null) {
            this.anims.play('player-idle-down');
        } else if(!game.scene.getScene("game").stickActive) {
            if (this.cursors.left?.isDown) {
                this.move(-this.x_speed,0)
                this.direction = 'left'
    
            } else if (this.cursors.right?.isDown) {
                this.move(this.x_speed,0)
                this.direction = 'right'
                
    
            } else if (this.cursors.up?.isDown) {
                this.move(0,-this.y_speed)
                this.direction = 'up'
    
            } else if (this.cursors.down?.isDown) {
                this.move(0,this.y_speed)
                this.direction = 'down'
    
            } else {
                const parts = this.anims.currentAnim.key.split('-');
                parts[1] = 'idle';
                this.anims.play(parts.join('-'));
                this.body.setVelocity(0, 0);
                this.direction = 'idle'
            }
            this.moveOtherPlayer(false)
        } else {
            //console.log("Muevo joystick");
            //console.log(this.x_speed, this.y_speed);
            this.move(this.x_speed,this.y_speed)
            this.moveOtherPlayer(true)
        }

        if(this.inZone && !this.end){
            //Enviar al serve jugador end
            socket.emit("playerInEndZone");
            this.end = true;
        }
    }
    moveOtherPlayer(_joystickMoved){
        let moveData = {
            id: this.id,
            speed: this.speed,
            speed_x: this.x_speed,
            speed_y: this.y_speed,
            x: this.x,
            y: this.y,
            direction: this.direction,
            joystickMoved: _joystickMoved
        }
        //console.log("Muevo otro Jugador");

        socket.emit("playerMoved", moveData);
    }
    move(leftright, updown) {
        this.body.setVelocity(leftright, updown)
        // this.anims.play('player-run-side',true)
        //console.log(this.direction);
        if (leftright<0 || this.direction == "left") {
            //console.log("1");
            this.anims.play('player-run-side', true)
            this.scaleX = -1;
            this.body.offset.x = 24;
        } 
        if(leftright>0 || this.direction == "right") {
            //console.log("2");
            this.anims.play('player-run-side', true)
            this.scaleX = 1;
            this.body.offset.x = 8;
        } 
        // if(this.direction== "diagonal_left"){
        //     console.log("1");
        //     this.anims.play('player-run-side', true)
        //     this.scaleX = -1;
        //     this.body.offset.x = 24;
        // }
        // if (updown>0 || this.direction == "down") {
        //     // console.log("3");
        //     this.anims.play('player-run-down', true)
        // } 

        if(this.direction == "diagonal_left"){
            //console.log("1");
            this.anims.play('player-run-side', true)
            this.scaleX = -1;
            this.body.offset.x = 24;
        } else if(this.direction == "diagonal_right"){
            //console.log("2");
            this.anims.play('player-run-side', true)
            this.scaleX = 1;
            this.body.offset.x = 8;
        } else if (updown<0 || this.direction == "up") {
            //console.log("4");
            this.anims.play('player-run-up', true)
        } else if (updown>0 || this.direction == "down") {
            // console.log("3");
            this.anims.play('player-run-down', true)
        } 

        if((updown==0 && leftright == 0 )|| this.direction == "idle" ){
            if ( this.anims.currentAnim==null) {
                this.anims.play('player-idle-down');
            }else{
                const parts = this.anims.currentAnim.key.split('-');
                parts[1] = 'idle';
                this.anims.play(parts.join('-'));
            }
           
        }

        if((updown==null && leftright == null) || this.direction == null){
            this.anims.play('player-idle-down');
        }
        this.centerBodyonBody(this.playerCollider,this)
    }

    centerBodyonBody(collider, player) {
        collider.x = player.body.x + player.body.halfWidth
        collider.y = player.body.y 
    }
}