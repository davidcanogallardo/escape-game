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
        this.load.image("password_background", "assets/password_paper.png");
        // this.load.spritesheet('closed_door', 'assets/closed_door.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('opened_door', 'assets/opened_door.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // })
        this.load.atlas('door', 'assets/objects/door/door.png', 'assets/objects/door/door.json');
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
        let objectLayer = this.map.getObjectLayer('objects');
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
        //collider para que el personaje con el cofre
        this.physics.add.collider(this.chest, this.player);
        //hacer que el pj no empuje al cofre
        this.chest.body.immovable = true


        //Player action area
        this.playerCollider = this.physics.add.image(200, 50);
        //hitbox redonda
        // this.playerCollider.setCircle(18)
        
        
        //this.physics.add.overlap(this.player, chest, () => {this.scene.start("gameover",{ score : this.segundos})})

        //Puzzle para abrir puerta
        let chestIsOpen = false;

        //Crear grupo donde se almacenan las puertas
        this.closed_doorGroup = this.physics.add.staticGroup();
        this.opened_doorGroup = this.physics.add.staticGroup();

        //iterar por todos los objetos de la capa de objetos
        objectLayer.objects.forEach(object => {
            //Popriedades de cada objeto
            const {x = 0, y = 0, height, width, id, name} =  object;

            switch(name){
                case 'closed_door':
                    //Cambiar la hitbox de la puerta cerrada
                    this.closed_door = this.physics.add.staticSprite(x+(width/2),y-(height/2), 'door', 'door-closed');
                    //this.closed_door.anims.play('door-closed');
                    this.closed_door.body.setSize(width, height*0.1).setOffset(width-33,height-5);
                    
                    //Agregar puerta al grupo de puertas
                    this.closed_doorGroup.add(this.closed_door);
                    break;
                // case 'opened_door':
                //     this.opened_door = this.physics.add.sprite(x+(x+(width/2),y-(height/2), 'opened_door'));
                //     this.opened_doorGroup.add(this.opened_door);
                //     this.opened_doorGroup.setVisible(true);
                //     console.log(this.opened_door);
                //     break;
            }
            //this.physics.add.collider(this.player, door);
        });
        //Añadir colider al grupo de puertas
        let closed_doorColider = this.physics.add.collider(this.player, this.closed_doorGroup);

        this.physics.add.overlap(this.playerCollider, this.chest, () => {
            this.input.keyboard.once('keydown-E', () => {
                this.scene.switch('password_scene');
                this.physics.world.removeCollider(closed_doorColider);
                this.closed_doorGroup.playAnimation('opening-door');
            })
        });

        window.wg = this.wallGroup;
        window.pc = this.playerCollider;
        this.physics.add.overlap(this.playerCollider, this.wallGroup,function (player,walls) {
                if(walls.y < player.y){
                    window.p.setDepth(10);
                } else {
                    window.p.setDepth(0);
                }

        });
        //params.body.world.bodies.entries[].center.y
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

        //necesario para que el juego pause al cambiar la ventana correctamente
        game.scene.game.hasFocus = true;
        //estados personaje
    	//lado
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

        //animaciones personaje
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
        //lado
        this.anims.create({
            key: 'player-run-side',
            frames: this.anims.generateFrameNames('player',{start: 1 , end: 8, prefix: 'run-side-',suffix: '.png'}),
            repeat: -1,
            frameRate: 15
        })
        
        //puerta
        //this.door = this.physics.add.sprite(100, 250, 'player','walk-down-3.png' );
        this.anims.create({
            key: 'door-closed',
            frames: [{key: 'door', frame: 'door-0.png'}],
        })
        // this.door

        this.anims.create({
            key: 'opening-door',
            frames: this.anims.generateFrameNames('door',{start: 0 , end: 3, prefix: 'door-',suffix: '.png'}),
            repeat: 0,
            frameRate: 5
        })
    }
  
    update() {
        

        let speed = 200
        let eKey = this.input.keyboard.addKey('E');
        let eKeyDown = eKey?.isDown
        let escKey = this.input.keyboard.addKey('ESC');
        let escKeyDown = escKey?.isDown

        //menu de pausa "ESC" o al cambiar de ventana
        if(escKeyDown || game.scene.game.hasFocus == false){
            this.scene.launch('pause_scene')
            this.scene.pause();
        }

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
