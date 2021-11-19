class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    //map.getLayer("walls").data[5][5].properties?.horitzontalWall
    preload() {
        this.segundos = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", "assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", "assets/tilemaps/mapa.json");
        this.load.atlas('player', 'assets/character/player.png', 'assets/character/player.json');
        this.load.atlas('chest', 'assets/objects/chest.png', 'assets/objects/chest.json');
    }

    create() {
        //Mapa, layers..
        var map = this.make.tilemap({
            key: "map"
        });

        var tileset = map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = map.createStaticLayer('ground', tileset);
        var itemLayer = map.createStaticLayer('items', tileset);
        var wallsLayer = map.createStaticLayer('walls', tileset);
        
        wallsLayer.setCollisionByProperty({ colides: true })
        wallsLayer.debug = true;
        
        //Player
        this.player = this.physics.add.sprite(100, 250, 'player','walk-down-3.png' );
        this.player.body.setSize(this.player.width*0.5, this.player.height * 0.3).setOffset(8,20)
        
        this.physics.add.collider(this.player, wallsLayer)
        
        //Cofre
        var chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
        this.physics.add.existing(chest)
        
        //Tiempo
        this.title = this.add.text(5,0, 'Tiempo: ', {
            fontSize: 9,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        
        //Evento para terminar la partida
        this.physics.add.overlap(this.player, chest, () => {this.scene.start("gameover",{ score : this.segundos})})
        
        //Evento que se ejecturá en bucle cada 1s y actualizará el tiempo
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
    }
  
    update() {
        var speed = 200

        var leftDown = this.cursors.left?.isDown
        var rightDown = this.cursors.right?.isDown
        var upDown = this.cursors.up?.isDown
        var downDown = this.cursors.down?.isDown

        // Aqui indicamos las animaciones del personaje al pulsar cada boton
        if (leftDown) {
            this.anims.play('walk-side-3', true)
            this.player.setVelocity(-speed, 0)

        } else if (rightDown) {
            this.anims.play('walk-side-3', true)
            this.player.setVelocity(speed, 0)

        } else if (upDown) {
            this.anims.play('walk-side-3', true)
            this.player.setVelocity(0, -speed)

        } else if (downDown) {
            this.anims.play('walk-side-3', true)
            this.player.setVelocity(0, speed)

        } else
        {
            this.anims.play('walk-side-3', true)
            this.player.setVelocity(0, 0)
        }
    }

    formatTime(seconds){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }
    
    
    updateTime () {
        this.segundos += 1;
        this.title.setText('Tiempo: ' + this.formatTime(this.segundos));
    }


}
