class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    //map.getLayer("walls").data[5][5].properties?.horitzontalWall
    preload() {
        var path = "./demo_game/"
        this.segundos = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/mapa.json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('chest', path+'assets/objects/chest.png', path+'assets/objects/chest.json');
        this.load.image("password_background", path+"assets/password_paper.png");
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        this.load.image('table', path+'assets/tilesets/TSMapa/PNG/table.png');
        this.load.image('passwd_bg', path+'assets/BGTable.png');
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        this.cursors = this.input.keyboard.createCursorKeys();
        for(let i=0; i<9; i++){
            this.load.image('simbol'+i, path+'assets/passwd/simbol'+i+'.png');
        }
    }

    create() {
        
    /**************************************Mapa, layers...****************************/
        this.map = this.make.tilemap({
            key: "map"
        });
        window.test = this.map
        
        var tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', tileset);
        var wallsLayer = this.map.createLayer('walls', tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        wallsLayer.setDepth(2)
        
        window.wall = wallsLayer

        //*************************************************Player
        this.player = this.physics.add.sprite(100, 250, 'player','walk-down-3.png' );
        this.player.body.setSize(this.player.width*0.5, this.player.height * 0.3).setOffset(8,18)
        this.player.setDepth(0)
        this.physics.add.collider(this.player, wallsLayer)
        window.p = this.player


        //Player action area
        this.playerCollider = this.physics.add.image(200, 50);
        //hitbox redonda
        // this.playerCollider.setCircle(18)

        /*************************************************************************************** */
        
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
        // DEBUGGER DE MUROS
        // const debugGraphics = this.add.graphics().setAlpha(0.7)
        // wallsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243,234, 48, 255 ),
        //     faceColor: new Phaser.Display.Color(40,39,37, 255)
        // })

        
        //****************************************************************************Cofre
        this.chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
        this.physics.add.existing(this.chest);
        //collider para que el personaje con el cofre
        this.physics.add.collider(this.chest, this.player);
        this.chest.body.setSize(this.chest.width*0.5, this.chest.height*0.8);
        var that = this;

        this.physics.add.overlap(this.playerCollider, this.chest, function (player,chest) {
            if(chest.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown) {
                console.log('show pass chest');
                that.scene.launch('seepass');
                // that.scene.pause();
            }
        });
        let cursors = this.input.keyboard.createCursorKeys();
        window.cursors = cursors
        //hacer que el pj no empuje al cofre
        this.chest.body.immovable = true

        /******************************************************************************************** */

        //Añadir objeto para introducir contraseña temporal
        // this.password_input = this.add.rectangle(56, 200, 20, 20, 0x6666ff);
        // this.physics.add.existing(this.password_input);
        // this.physics.add.collider(this.chest, this.player);
        // this.password_input.body.immovable = true;




        //Puzzle para abrir puerta
        let chestIsOpen = false;

        //Crear grupo donde se almacenan las puertas
        this.doorsGroup = this.physics.add.staticGroup();
        this.chestsGroup = this.physics.add.staticGroup();
        this.tablesGroup = this.physics.add.staticGroup();

        //iterar por todos los objetos de la capa de objetos
        objectLayer.objects.forEach(object => {
            //Popriedades de cada objeto
            const {x = 0, y = 0, height, width, type, name} =  object;
            console.log(type);
            switch(type){
                case 'door':
                    //Cambiar la hitbox de la puerta cerrada
                    this.door = this.physics.add.staticSprite(x+(width/2),y-(height/2), 'door', 'door-closed');
                    //this.closed_door.anims.play('door-closed');
                    this.door.body.setSize(width, height*0.1).setOffset(width-33,height-5);
                    //Agregar puerta al grupo de puertas
                    this.doorsGroup.add(this.door);
                    break;
                case 'chest':
                    // //Cambiar la hitbox del cofre
                    // this.chest = this.physics.add.staticSprite(x+(width/2),y-(height/2), 'chest', 'open-chest');
                    // //this.closed_door.anims.play('door-closed');
                    // this.chest.body.setSize(width, height*0.1).setOffset(width-33,height-5);
                    // //Agregar cofre al grupo de cofres
                    // this.chestsGroup.add(this.chest);
                    break;
                case 'table':
                    //Cambiar la hitbox de la mesa
                    this.table = this.physics.add.sprite(x+(width/2),y-(height/2), 'table');
                    //Hitbox de la mesa y que no se pueda mover
                    this.physics.add.collider(this.table, this.player);
                    this.table.body.immovable = true
                    //Agregar puerta al grupo de puertas
                    this.tablesGroup.add(this.table);
                    this.tableCollider = this.physics.add.image(this.table.x, this.table.y);
                    this.tableCollider.setSize(this.table.width, this.table.height)
                    this.tableCollider.body.immovable = true
                    this.physics.add.collider(this.tableCollider, this.player);

                    break;
            }
        });
        //Añadir colider al grupo de puertas
        this.doorsColider = this.physics.add.collider(this.player, this.doorsGroup);

        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.physics.add.overlap(this.playerCollider, this.table, function (player,table) {
            
            if(table.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown) {
                console.log('presiona e');
                that.scene.launch('enterPasswordScene');
                that.scene.pause();
                
            }
        });

        window.wg = this.wallGroup;
        window.pc = this.playerCollider;
        this.physics.add.overlap(this.playerCollider, this.wallGroup,function (player,walls) {
                if(walls.y < player.y){
                    that.player.setDepth(10);
                } else {
                    that.player.setDepth(0);
                }

        });
        //params.body.world.bodies.entries[].center.y
        
        //*******************************************************TIEMPO  */
        
        this.scene.launch('ui');

        for (let i = 0; i < this.map.getLayer("walls").data[i]; i++) {
            for (let j = 0; j < this.map.getLayer("walls").data[i][j]; j++) {
                if (this.map.getLayer("walls").data[i][j].properties.horizontalWalls === true) {
                    this.map.test.getLayer("walls").data[i][j].height = 2
                }
            }
        }

        /**************************************************************************************** */

        //necesario para que el juego pause al cambiar la ventana correctamente
        game.scene.game.hasFocus = true;


        //*************************************************************Escena de victoria
        this.scene.get('enterPasswordScene').events.on('victoria', () => {
            this.doorsGroup.playAnimation('opening-door');
            this.physics.world.removeCollider(this.doorsColider);
            this.table.disableBody();
            
        });
        /**************************************************************************************** */

        //*************************************************************estados personaje
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

        //*****************************************************************animaciones personaje
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
        let speed = 150
        let eKey = this.input.keyboard.addKey('E');
        let eKeyDown = eKey?.isDown
        let escKey = this.input.keyboard.addKey('ESC');
        let escKeyDown = escKey?.isDown

        //menu de pausa "ESC" o al cambiar de ventana
        //TODO animacion puerta
        if(game.scene.game.hasFocus == false){
            this.scene.launch('pause_scene')
            this.scene.pause();
        }
        

        // Aqui indicamos las animaciones del personaje al pulsar cada boton
        if ( this.player.anims.currentAnim==null) {
            this.player.anims.play('player-idle-down');
        } else {
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
                const parts = this.player.anims.currentAnim.key.split('-');
                parts[1] = 'idle';
                this.player.anims.play(parts.join('-'));
                this.player.setVelocity(0, 0);
            }
        }
        

        this.centerBodyonBody(this.playerCollider.body, this.player.body);
    }
    

    

    centerBodyonBody(collider, player) {
        collider.position.set(
            player.x + player.halfWidth - collider.halfWidth,
            player.y + player.halfHeight - collider.halfHeight
        );
    }

    

}
