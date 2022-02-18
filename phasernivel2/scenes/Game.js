class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    preload() {
        var path = "./"
        this.segundos = 0;
        this.challenge = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/mapa2.json");
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
        this.load.image('mask', 'assets/mask1.png');
    }

    create() {
        var that = this

        this.events.on("tiempo", (tiempo) => {
            that.scene.remove('time')
            console.log("tiempo recibido "+ tiempo)
            that.scene.start("gameover",{ score : tiempo})
        }, this)
        
        this.map = this.make.tilemap({
            key: "map"
        });
        window.map = this.map
        //valor leyenda: window.map.objects[1].objects[0].properties[0].value
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', this.tileset);
        this.voidLayer = this.map.createStaticLayer('void', this.tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        window.object = objectLayer
        
        //*****************************************Players**************************************************/
        this.player = new Player(this);
        this.playerCollider = this.player.playerCollider
        this.cameras.main.startFollow(this.player);
        this.player.setDepth(1)
        
        this.wallsLayer = new WallsLayer(this);
        // this.wallsLayer = this.map.createStaticLayer("walls", this.tileset)

        // this.wallsLayer.setDepth(1)
        let rt = this.add.renderTexture(0, 0, 1000, 1000);
        rt.depth = 20
        window.rt = rt
        rt.fill(0x000000);

        this.spotlight = this.make.sprite({
            x: 400,
            y: 300,
            key: "mask",
            add: false
        });

        let mask = rt.createBitmapMask(this.spotlight)
        mask.invertAlpha = true;
        rt.setMask(mask);


        var end = this.physics.add.staticGroup();
        var endTile = end.create(158,14)
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
        this.doorColider1 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[1]);
        this.doorColider2 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[2]);
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
        this.canDoPuzzle = true
        this.physics.add.overlap(this.playerCollider, this.table, function (player,table) {
            if(table.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown && that.canDoPuzzle) {
                that.scene.launch('enterPasswordScene');
                that.scene.pause();
            }
        });

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

        // ******************************************************************************************************************

        //*******************************************************TIEMPO  */
        this.scene.launch('ui');
        /**************************************************************************************** */

        //necesario para que el juego pause al cambiar la ventana correctamente
        game.scene.game.hasFocus = true;
        if(game.scene.game.hasFocus == false){
            this.scene.launch('pause_scene')
            this.scene.pause();
        }
        //*************************************************************Escena de victoria
        this.scene.get('enterPasswordScene').events.on('victoria', () => {
            this.challenge++;
            
            objectLayer.objects.forEach(object => {
                switch(object.type){
                    case 'door':
                        if (object.properties[0].value == this.challenge && this.challenge == 1) {
                            this.doorsGroup.children.entries[0].play('opening-door');
                            this.doorsGroup.children.entries[1].play('opening-door'); 
                            this.physics.world.removeCollider(this.doorColider0);
                            this.physics.world.removeCollider(this.doorColider1);
                            this.table.disableBody();
                            that.canDoPuzzle = false
                        } else if (this.challenge == 1) {
                            this.doorsGroup.children.entries[2].play('opening-door');
                            this.physics.world.removeCollider(this.doorColider2);
                        }
                        break;
    
                }
            })
        });

        

        

        
    }
  
    update() {
        this.player.update()
        this.spotlight.x = this.player.x;
        this.spotlight.y = this.player.y;

        var tile = this.voidLayer.getTileAtWorldXY(this.player.x, this.player.y);
        if (tile?.index == 357) {
          console.log("toco el voidddd");
        }


    }
}