class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    //map.getLayer("walls").data[5][5].properties?.horitzontalWall
    init(data){
        let playersArray = [];
        data.forEach(element => {
            this.player = new Player(this, element.id, element.x, element.y, "player");
            playersArray.push(this.player);
        });
        this.playersGroup = this.add.group(playersArray);
    }

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
        socket.on("playerMoveResponse", (moveData) => {
            this.playersGroup.getChildren().forEach(player => {
                if(moveData.id == player.id){
                    if (moveData.direction == 'left') {
                        player.move(-moveData.speed,0);
                    }
                    if (moveData.direction == 'right') {
                        player.move(moveData.speed,0);
                    }
                    if (moveData.direction == 'up') {
                        player.move(0,-moveData.speed);
                    }
                    if (moveData.direction == 'down') {
                        player.move(0,moveData.speed);
                    }
                    if (moveData.direction == 'idle') {
                        player.move(0,0);
                    }
                    if (moveData.direction == 'player-idle-down') {
                        player.move(null,null);
                    }
                    console.log(moveData)
                   
                    // let moveData = {
                    //     id: player.id,
                    //     speed: player.speed,
                    //     x: player.x,
                    //     y: player.y
                    // }
                    // socket.emit("playerMoved", moveData);
                }
            });
        })

        var that = this

        this.events.on("tiempo", (tiempo) => {
            that.scene.remove('time')
            console.log("tiempo recibido "+ tiempo)
            that.scene.start("gameover",{ score : tiempo})
        }, this)

        this.map = this.make.tilemap({
            key: "map"
        });
        
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', this.tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        
        //*****************************************Players**************************************************/
        //console.log(this.playersGroup);
        //this.player = new Player(this);
        //this.playerCollider = this.player.playerCollider

        var end = this.physics.add.staticGroup();
        var endTile = end.create(158,14)
        endTile.body.setSize(35,20)
        endTile.visible = false

        this.playersGroup.getChildren().forEach(player => {
            this.physics.add.overlap(endTile, player, function () {
                //player.active = false;
                player.inZone = true;
                //
            });
        });


        socket.on("endGame", () => {
            console.log("fin de partida");
            that.events.emit("end");
        });
        // this.physics.add.overlap(endTile, this.playersGroup, function () {
        //     console.log("fin de partida")
        //     that.events.emit("end");
        // })

        this.wallsLayer = new WallsLayer(this);
        
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
                    this.physics.add.collider(this.table, this.playersGroup);
                    this.table.body.immovable = true
                    //Agregar puerta al grupo de puertas
                    this.tablesGroup.add(this.table);
                    this.tableCollider = this.physics.add.image(this.table.x, this.table.y);
                    this.tableCollider.setSize(this.table.width, this.table.height)
                    this.tableCollider.body.immovable = true
                    this.physics.add.collider(this.tableCollider, this.playersGroup);

                    break;
            }
        });
        //Añadir colider al grupo de puertas

        this.doorsColider = this.physics.add.collider(this.playersGroup, this.doorsGroup);
        //console.log("Pone el collider");
        // ******************************************************************************************************************

        //**************************************Cofre**************************************
        this.chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
        this.physics.add.existing(this.chest);
        //collider para que el personaje con el cofre
        this.physics.add.collider(this.chest, this.playersGroup);
        this.chest.body.setSize(this.chest.width*0.5, this.chest.height*0.8);
        
        this.playersGroup.getChildren().forEach(player => {
            this.physics.add.overlap(player.playerCollider, this.chest, function (player,chest) {
                if(chest.y < player.y){
                    that.player.setDepth(10);
                } else {
                    that.player.setDepth(0);
                }
    
                if (eKey.isDown) {
                    that.scene.launch('seepass');
                }
            });
        });

        /*this.physics.add.overlap(this.playerCollider, this.chest, function (player,chest) {
            if(chest.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown) {
                that.scene.launch('seepass');
            }
        });*/
        this.chest.body.immovable = true
        // ****************************************************************************
        
        // *********************************************puerta****************************************************
        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.canDoPuzzle = true

        this.playersGroup.getChildren().forEach(player => {
            this.physics.add.overlap(player.playerCollider, this.table, function (player,table) {
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
        });
        /*this.physics.add.overlap(this.playerCollider, this.table, function (player,table) {
            if(table.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown && that.canDoPuzzle) {
                that.scene.launch('enterPasswordScene');
                that.scene.pause();
            }
        });*/

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
        socket.on("passwordPuzzleResolved", (data) => {
            this.doorsGroup.playAnimation('opening-door');
            this.physics.world.removeCollider(this.doorsColider);
            // this.table.disableBody();
            that.canDoPuzzle = false
        });
        // this.scene.get('enterPasswordScene').events.on('victoria', () => {
        //     this.doorsGroup.playAnimation('opening-door');
        //     this.physics.world.removeCollider(this.doorsColider);
        //     // this.table.disableBody();
        //     that.canDoPuzzle = false
        // });
    }
  
    update() {
        this.playersGroup.getChildren().forEach(player => {
            // console.log(player);
            let count = 0;
            // console.log(count);
            if(player.inZone==true){
                count++;
                // console.log(count);
            }
            if(count == 2){
                // console.log(count);
                socket.emit("playerInEndZone", player);
            }
        });

        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                player.update();
                
            }
        });

        
        //this.playersGroup.update()
    }
}
