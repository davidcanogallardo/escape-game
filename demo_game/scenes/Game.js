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
        //console.log(this.playersGroup);
        this.activeScene = "game";
        this.infoScene = "SeePass";
        this.playableScene = "enterPasswordScene";
    }   

    preload() {
        var path = "./demo_game/"
        this.segundos = 0;
        this.challenge = 0;
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
        this.buttonActive = false;
        this.stickButtonActive = false;
        this.stickActive = false;
        if(this.controllerConnected){
            console.log("Controller Connected");
            this.bluetoothConnection.setCallbackButtonA(this.pressBtn);
            this.bluetoothConnection.setCallbackButtonJoystick(this.pressStick);
            this.bluetoothConnection.setCallbackJoystick(this.moveStick);
            this.bluetoothConnection.start();
        }
    }

    create() {
        socket.on("playerMoveResponse", (moveData) => {
            this.playersGroup.getChildren().forEach(player => {
                if(moveData.id == player.id){
                    if(this.stickActive){
                        player.move(moveData.speed_x, moveData.speed_y);
                    } else {
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
                    }


                    //console.log(moveData)
                   
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
                player.inZone = true;
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
        this.doorColider0 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[0]);
        this.doorColider1 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[1]);
        this.doorColider2 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[2]);
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
            if(player.id == socket.id){
                //Añadir colision al jugador con el mismo socket
                //Cofre
                this.physics.add.overlap(player.playerCollider, this.chest, function (player, chest) {
                    if(chest.y < player.y){
                        that.player.setDepth(10);
                    } else {
                        that.player.setDepth(0);
                    }
                    if (eKey.isDown) {
                        //Launch infoScene
                        //that.scene.launch('SeePass'); 
                        that.scene.launch(that.infoScene);
                        that.activeScene = that.infoScene;
                    }

                    

                    if(that.buttonActive == true){
                        //that.scene.launch('SeePass');
                        that.scene.launch(that.infoScene);
                        that.buttonActive = false;
                        that.activeScene = that.infoScene;

                        //mirar si esta activa escena
                        //recupera escena as objeto
                        //llamo funcion buttonActive()
                    }

                });
                //Mesa
                this.physics.add.overlap(player.playerCollider, this.table, function (player,table) {
                    if(table.y < player.y){
                        that.player.setDepth(10);
                    } else {
                        that.player.setDepth(0);
                    }
        
                    if (eKey.isDown && that.canDoPuzzle) {
                        //pass this.playableScene
                        //that.scene.launch('enterPasswordScene');
                        that.scene.launch(that.playableScene);
                        that.activeScene = that.playableScene;
                        //that.scene.pause();
                    }

                    if(that.buttonActive){
                        //that.scene.launch('enterPasswordScene');
                        that.scene.launch(that.playableScene);
                        that.activeScene = that.playableScene;
                        that.buttonActive = false;
                    }
                });


            }
        });

        /*this.physics.add.overlap(this.playerCollider, this.chest, function (player,chest) {
            if(chest.y < player.y){
                that.player.setDepth(10);
            } else {
                that.player.setDepth(0);
            }

            if (eKey.isDown) {
                that.scene.launch('SeePass');
            }
        });*/
        this.chest.body.immovable = true
        // ****************************************************************************
        
        // *********************************************puerta****************************************************
        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        this.canDoPuzzle = true



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
            console.log("Puzzle complete");
            this.challenge++;

            objectLayer.objects.forEach(object => {
                switch(object.type){
                    case 'door':
                        // console.log(object);
                        // console.log("door");
                        // console.log(object.properties[0].value);
                        // console.log(this.challenge);
                        if (object.properties[0].value == this.challenge && this.challenge == 1) {
                            console.log("Primer if");
                            this.doorsGroup.children.entries[0].play('opening-door');
                            this.doorsGroup.children.entries[1].play('opening-door'); 
                            this.physics.world.removeCollider(this.doorColider0);
                            this.physics.world.removeCollider(this.doorColider1);
                            this.physics.world.removeCollider(this.doorsColider);
                            this.table.disableBody();
                            that.canDoPuzzle = false
                        } else if (this.challenge == 1) {
                            console.log("Segundo if");
                            this.doorsGroup.children.entries[2].play('opening-door');
                            this.physics.world.removeCollider(this.doorColider2);
                        }
                        break;
                }
            })
        });
        // this.scene.get('enterPasswordScene').events.on('victoria', () => {
        //     this.doorsGroup.playAnimation('opening-door');
        //     this.physics.world.removeCollider(this.doorsColider);
        //     // this.table.disableBody();
        //     that.canDoPuzzle = false
        // });

        //mute button

        this.input.keyboard.on('keydown-M',()=>{
            if (window.stream.getAudioTracks()[0].enabled == true) {
                window.stream.getAudioTracks()[0].enabled = false;
                console.log(window.stream.getAudioTracks()[0].enabled)
            } else {
                window.stream.getAudioTracks()[0].enabled = true;
            }
        });
        
        
    }
  
    update() {
        this.playersGroup.getChildren().forEach(player => {
            let count = 0;
            if(player.inZone==true){
                count++;
            }
            if(count == 2){
                socket.emit("playerInEndZone", player);
            }
        });

        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                if(this.stickActive){
                    player.x_speed = this.speeds['x'];
                    player.y_speed = this.speeds['y'];
                }
                player.update();
            }
        });
    }

    moveStick(data){
        console.log("My callback move stick");
        let gameScene = game.scene.getScene('game');

        // let data = "x:10,22;y:120,1";
        let x = data.split(';')[0];
        let y = data.split(';')[1];
        x = x.split(':')[1];
        y = y.split(':')[1];
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        let speeds = {x:x,y:y};
        console.log(speeds);
        //let stickDirection = getStickDirection(speeds);

        if(gameScene.activeScene=="game"){
            gameScene.stickActive = true;
            gameScene.speeds = speeds;
            //gameScene.stickDirection= stickDirection;
        } else { 
            //game.scene.getScene(gameScene.activeScene).moveStick(speeds, stickDirection);
            game.scene.getScene(gameScene.activeScene).moveStick(speeds);
        }



        // let activeScenes = game.scene.getScenes();
        //     for(let i = 1; i<activeScenes.length; i++){
        //         activeScenes[i].moveStick(speeds, stickDirection);
        //     }
    } 

    getStickDirection(data){
        //TODO Funcion devuelve left, right, up, down
    }
    
    pressStick(data){
        console.log("My callback pressStick");
        let gameScene = game.scene.getScene('game');
        // data = 1;
        if(data == 1){

            if(gameScene.activeScene=="game"){
                gameScene.stickButtonActive = true;
            } else { 
                game.scene.getScene(gameScene.activeScene).activeJoystickButton();
                gameScene.activeScene="game";
            }

            /*
            game.scene.getScene('game').stickButtonActive = true;
            let activeScenes = game.scene.getScenes();
            for(let i = 1; i<activeScenes.length; i++){
                activeScenes[i].stickButtonActive = true;
                console.log(activeScenes[i]);
            }*/
        }
    }
    
    pressBtn(data){
        let gameScene = game.scene.getScene('game');
        console.log("My callback presbutton");
        console.log(gameScene.activeScene);
        if(gameScene.activeScene=="game"){

            console.log("HagoClic");
            gameScene.buttonActive = true;
        } else { 
            game.scene.getScene(gameScene.activeScene).activeButton();
        }

        /*
        if(data == 1){
            game.scene.getScene('game').buttonActive = true;
        }*/
    }

    setBluetoothConnection(_bluetoothConnection){
        this.bluetoothConnection = _bluetoothConnection;
        this.controllerConnected = true;
    }
}
