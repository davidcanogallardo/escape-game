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
        this.speed = 150;

        if ( this.anims.currentAnim==null) {
            this.anims.play('player-idle-down');
        } else {
            if (this.cursors.left?.isDown) {
                this.body.setVelocity(-this.speed, 0)
                this.anims.play('player-run-side',true)
                this.scaleX = -1;
                this.body.offset.x = 24;

            } else if (this.cursors.right?.isDown) {
                this.body.setVelocity(this.speed, 0)
                this.anims.play('player-run-side',true)
                this.scaleX = 1;
                this.body.offset.x = 8;
                                
            } else if (this.cursors.up?.isDown) {
                this.body.setVelocity(0, -this.speed)
                this.anims.play('player-run-up', true)
    
            } else if (this.cursors.down?.isDown) {
                this.body.setVelocity(0, this.speed)
                this.anims.play('player-run-down', true)
    
            } else {
                const parts = this.anims.currentAnim.key.split('-');
                parts[1] = 'idle';
                this.anims.play(parts.join('-'));
                this.body.setVelocity(0, 0);
            }
        }
    }

    centerBodyonBody(collider, player) {
        collider.x = player.body.x + player.body.halfWidth
        collider.y = player.body.y 
    }
}