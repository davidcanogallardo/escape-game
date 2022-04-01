class LaberitnoMGScene extends Phaser.Scene {
    constructor(room,type,difficulty,) {
        super("PasswordMGScene"+room+"_"+type, type, difficulty);
    }
    preload() {
        var path = "./"
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/mapa2.json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        
        //mascara para oscurecer jugadores
        this.load.image('mask', 'assets/mask1.png');

        //mapa del laberinto
        this.map = this.make.tilemap({key: "map"});

        //texturas(Muros,suelo,etc)
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        //suelo
        this.groundLayer = this.map.createStaticLayer('ground', this.tileset);

        //capa vacio del tilemap
        this.voidLayer = this.map.createStaticLayer('void', this.tileset);

        //quita visibilidad a la capa vacio
        this.voidLayer.visible = false

        this.objectLayer = this.map.getObjectLayer('objects');
        
    }

    create() {
        var that = this
        
        window.map = this.map
        
        
        //*****************************************Players**************************************************/
        this.player = new Player(this);
        this.playerCollider = this.player.playerCollider
        this.cameras.main.startFollow(this.player);
        this.player.setDepth(6)
        window.player = this.player
        
        this.wallsLayer = new WallsLayer(this);
        //this.wallsLayer.visible = false;

        // this.wallsLayer = this.map.createStaticLayer("walls", this.tileset)

        // this.wallsLayer.setDepth(1)
        let rt = this.add.renderTexture(0, 0, 1000, 1000);
        rt.depth = 5
        window.rt = rt
        rt.fill(0x000000);

        this.spotlight = this.make.sprite({
            x: 0,
            y: 0,
            key: "mask",
            add: false
        });

        let mask = rt.createBitmapMask(this.spotlight)
        mask.invertAlpha = true;
        rt.setMask(mask);

        

        var end = this.physics.add.staticGroup();
        var endTile = end.create(609,685)
        endTile.body.setSize(35,20)
        endTile.visible = false


        this.physics.add.overlap(endTile, this.playerCollider, function () {
            console.log("fin de partida")
            that.events.emit("end");
        })

         // ***************************************LEYENDA****************************************************************************

         

        //Crear grupo donde se almacenan las puertas
        this.doorsGroup = this.physics.add.staticGroup();
        this.chestsGroup = this.physics.add.staticGroup();
        this.tablesGroup = this.physics.add.staticGroup();

        //iterar por todos los objetos de la capa de objetos
        objectLayer.objects.forEach(object => {
            //Popriedades de cada objeto
            const {x = 0, y = 0, height, width, type, name} =  object;
            switch(type){
                case 'door':
                    //Cambiar la hitbox de la puerta cerrada
                    this.door = this.physics.add.staticSprite(x+(width/2),y-(height/2), 'door', 'door-closed');
                    //this.closed_door.anims.play('door-closed');
                    this.door.body.setSize(width, height*0.1).setOffset(width-33,height-5);
                    //Agregar puerta al grupo de puertas
                    this.doorsGroup.add(this.door);
                    window.door = this.doorsGroup;
                    //Propiedades challenge de las puertas 
                    //window.map.objects[0].objects[0].properties[0].value
                    //window.map.objects[0].objects[1].properties[0].value
                    //window.map.objects[0].objects[5].properties[0].value
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
        this.doorColider0 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[0]);
        // ******************************************************************************************************************

        //**************************************Cofre**************************************
        this.chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
        this.physics.add.existing(this.chest);
        //collider para que el personaje con el cofre
        this.physics.add.collider(this.chest, this.player);
        this.chest.body.setSize(this.chest.width*0.5, this.chest.height*0.8);
        

        this.physics.add.overlap(this.playerCollider, this.chest, function (player,chest) {
            if(chest.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown) {
                that.scene.launch('seepass');
            }
        });
        this.chest.body.immovable = true
        // ****************************************************************************
        
        // *********************************************puerta****************************************************
        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
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

        this.scene.launch('ui');

        game.scene.game.hasFocus = true;
        if(game.scene.game.hasFocus == false){
            this.scene.launch('pause_scene')
            this.scene.pause();
        }
        this.physics.add.overlap(this.playerCollider, this.doorsGroup.children.entries[1], function (playerCollider, door) {
            var removecol
            if (eKey.isDown) {
                door.play('opening-door'); 
                removecol = () => {
                    that.physics.world.removeCollider(that.doorColider1);
                }
                door.on ('animationcomplete', removecol);
            }
        });

        this.touch = false

        

        
    }
}   