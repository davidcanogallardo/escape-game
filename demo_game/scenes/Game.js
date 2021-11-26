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
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        //Mapa, layers..
        this.map = this.make.tilemap({
            key: "map"
        });
        window.test = this.map
        
        var tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', tileset);
        var itemLayer = this.map.createStaticLayer('items', tileset);
        var wallsLayer = this.map.createLayer('walls', tileset);
        wallsLayer.renderDebug
        wallsLayer.setDepth(2)
        
        window.wall = wallsLayer
        wallsLayer.debug = true;

        //Player
        this.player = this.physics.add.sprite(100, 250, 'player','walk-down-3.png' );
        this.player.body.setSize(this.player.width*0.5, this.player.height * 0.3).setOffset(8,18)
        this.player.setDepth(0)
        this.physics.add.collider(this.player, wallsLayer)
        window.p = this.player

        //Player action area
        this.playerCollider = this.physics.add.image()
        


        this.wallGroup = this.physics.add.staticGroup();
        wallsLayer.forEachTile(tile => {
            if (tile.properties.wall == true) {
                //Quito la propiedad de colisión del tile
                tile.properties.colides = false
                // console.log(tile);
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                //Creo el nuevo tile
                const new_tile = this.wallGroup.create(x,y);
                //Le pongo tamaño y lo posiciono (setOffset)
                new_tile.body.setSize(tile.width, tile.height*0.1).setOffset(tile.width-7,tile.height+5)
                //Añado la colisión al nuevo tile
                this.physics.add.collider(this.player, new_tile)

                //Lo hago invisible así solo se ve el muro, pero la colision es con el new_tile
                new_tile.visible = false
            }
        })
        
        wallsLayer.setCollisionByProperty({ colides: true })
        const debugGraphics = this.add.graphics().setAlpha(0.7)
        wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,234, 48, 255 ),
            faceColor: new Phaser.Display.Color(40,39,37, 255)
        })

        
        //Cofre
        this.chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
        this.physics.add.existing(this.chest);

        
        
        var eKey = this.input.keyboard.addKey('E');
        var eKeyDown = eKey?.isDown
        //this.physics.add.overlap(this.player, chest, () => {this.scene.start("gameover",{ score : this.segundos})})

        this.physics.add.overlap(this.playerCollider, this.chest, () => {
            this.input.keyboard.once('keydown-E', () => {
                this.scene.switch('password_scene');
            })
        });

        window.wg = this.wallGroup;
        this.physics.add.overlap(this.playerCollider, this.wallGroup, () => {
            for (let i = 0; i < this.wallGroup.children.entries.length; i++) {
                if (this.player.y > this.wallGroup.children.entries[i].y && this.player._depth != 10) {
                    this.player.setDepth(10);
                    console.log("a")
                }
            }
        });

        //Tiempo
        this.title = this.add.text(5,0, 'Tiempo: ', {
            fontSize: 9,
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        
        //Evento para terminar la partida
        //this.physics.add.overlap(this.player, chest, () => {this.scene.start("gameover",{ score : this.segundos})})

        //Evento que se ejecturá en bucle cada 1s y actualizará el tiempo
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });

        for (let i = 0; i < this.map.getLayer("walls").data[i]; i++) {
            for (let j = 0; j < this.map.getLayer("walls").data[i][j]; j++) {
                if (this.map.getLayer("walls").data[i][j].properties.horizontalWalls === true) {
                    this.map.test.getLayer("walls").data[i][j].height = 2
                }
                
            }
            
        }

        //animaciones personaje
    	//stoped
        this.anims.create({
            key: 'player-idle-down',
            frames: [{key: 'player', frame: 'walk-down-3.png'}],
        })

        //arriba
        this.anims.create({
            key: 'player-run-down',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-down-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        //abajo
        this.anims.create({
            key: 'player-run-up',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-up-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        //side
        this.anims.create({
            key: 'player-run-side',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-side-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        
    }
  
    update() {
        let speed = 100
        let eKey = this.input.keyboard.addKey('E');
        let eKeyDown = eKey?.isDown

        // Aqui indicamos las animaciones del personaje al pulsar cada boton
        if (this.cursors.left?.isDown) {
            this.player.setVelocity(-speed, 0)
            this.player.anims.play('player-run-side',true)
            this.player.scaleX = -1;
            this.player.body.offset.x = 24;

        } else if (this.cursors.right?.isDown) {
            this.player.setVelocity(speed, 0)
            this.player.anims.play('player-run-side',true)
            this.player.scaleX = 1;
            this.player.body.offset.x = 8;

        } else if (this.cursors.up?.isDown) {
            this.player.setVelocity(0, -speed)
            this.player.anims.play('player-run-up', true)

        } else if (this.cursors.down?.isDown) {
            this.player.setVelocity(0, speed)
            this.player.anims.play('player-run-down', true)

        } else {
            this.player.anims.play('player-idle-down')
            this.player.setVelocity(0, 0)
        }

        this.centerBodyonBody(this.playerCollider.body, this.player.body);

        //console.log(this.player.y - this.chest.y);

        // if(this.player.x - this.chest.x < 30 && this.player.y - this.chest.y < 30){
        //     if(this.player.x - this.chest.x > -30 && this.player.y - this.chest.y > -30){
        //         //console.log("El jugador esta cerca del cofre");
        //         if(eKeyDown){
        //             this.scene.switch('password_scene');
        //         }
        //     }
        // }
        
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

    centerBodyonBody(collider, player) {
        collider.position.set(
            player.x + player.halfWidth - collider.halfWidth,
            player.y + player.halfHeight - collider.halfHeight
        );
    }

}
