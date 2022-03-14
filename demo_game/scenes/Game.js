class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    //map.getLayer("walls").data[5][5].properties?.horitzontalWall
    init(data){
        let playersArray = [];
        console.log(data);
        data.players.forEach(element => {
            this.player = new Player(this, element.id, element.x, element.y, "player", element.initiator);
            playersArray.push(this.player);
            if (element.id == socket.id) {
                this.isInitiator = element.initiator; 
            }
        });
        this.diff=data.diff;
        console.log("this.diff");
        console.log(this.diff);
        this.miniGames = ["PasswordMGScene"]
        this.playersGroup = this.add.group(playersArray);
        this.activeScene = "game";
        this.infoScene = "PasswordMGScene_helper"; 
        this.passwordminigame = "PasswordMGScene"; 
        this.playableScene = "PasswordMGScene_challenge";
        this.roleScene = "helper"
        this.loadedScenes = [this.infoScene];
        //this.game.scene.add("SeePass", new SeePass('test'))
        //this.game.scene.add("SeePass", eval("new SeePass('test')"))
        this.game.scene.add(this.infoScene, eval("new "+this.passwordminigame+"('helper','medium')"))
        this.game.scene.add(this.playableScene, eval("new "+this.passwordminigame+"('challenge','medium')"))

    }   

    preload() {
        var path = "./demo_game/"
        this.segundos = 0;
        this.challenge = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/2-1.json");
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
        //this.controllerConnected = false;
        console.log("Cargo Juego");
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
                //console.log(moveData.direction);
                if(moveData.id == player.id){
                    //console.log(this.stickActive);
                    if(moveData.joystickMoved){
                        //console.log("Joystick activado, Muevo otro jugador");
                        player.direction = moveData.direction;
                        player.move(moveData.speed_x, moveData.speed_y);
                        //this.stickActive = false;
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
                }
            });
        })

        var that = this
        
        this.map = this.make.tilemap({
            key: "map"
        });
        this.nChallenges = this.map.objects[2].objects[0].properties[0].value
        console.log(this.nChallenges)
        
        this.playerCollider = this.player.playerCollider

        this.events.on("tiempo", (tiempo) => {
            that.scene.remove('time')
            console.log("tiempo recibido "+ tiempo)
            that.scene.start("gameover",{ score : tiempo})
        }, this)

        
        
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', this.tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        
        //*****************************************Players**************************************************/

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
            //Terminar Partida
            this.loadedScenes.forEach(scene => {
                game.scene.remove(scene);
                console.log(game.scene.scenes);
            });

            game.scene.getScene("ui").scene.stop();
            game.scene.getScene("time").scene.stop();
            window.stream = undefined;
            app.currentPage="home";
        });

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
                    this.physics.add.collider(this.door, this.playersGroup)
                    this.door.challenge = object.properties[0].value
                    //Agregar puerta al grupo de puertas
                    this.doorsGroup.add(this.door);
                    window.door = this.doorsGroup;
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
                    this.table = [];
                    this.tableCollider = [];
                    for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
                        this.table[i] = this.physics.add.sprite(x+(width/2),y-(height/2), 'table');
                        this.physics.add.collider(this.table[i], this.playersGroup);
                        this.table[i].body.immovable = true

                        this.tablesGroup.add(this.table[i]);
                        this.tableCollider[i] = this.physics.add.image(this.table[i].x, this.table[i].y);
                        this.tableCollider[i].setSize(this.table[i].width, this.table[i].height)
                        this.tableCollider[i].body.immovable = true
                        this.physics.add.collider(this.tableCollider[i], this.playersGroup);

                        
                    }
                    //Cambiar la hitbox de la mesa
                    //Hitbox de la mesa y que no se pueda mover
                    

                    break;
            }
        });
        //Añadir colider al grupo de puertas
        console.log();
        this.doorsFilter = this.map.objects[1].objects.filter(this.doorFilter);
        this.doorsFilter.forEach(element => {
            console.log(element)
        });
        this.doorsColiders = [];
        for (let i = 0; i < this.doorsFilter.length; i++) {
            this.doorsColiders[i] = this.physics.add.collider(this.playersGroup, this.doorsGroup[i]);
        }
        this.physics.add.collider(this.playersGroup, this.doorsGroup);
        console.log(this.doorsColiders);
        //console.log("Pone el collider");
        // ******************************************************************************************************************

        //**************************************Cofre**************************************
        this.chest = [];
        for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
            this.chest[i] = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
            this.physics.add.existing(this.chest[i]);
            //collider para que el personaje con el cofre
            this.physics.add.collider(this.chest[i], this.playersGroup);
            this.chest[i].body.setSize(this.chest[i].width*0.5, this.chest[i].height*0.8);
            this.chest[i].body.immovable = true

        }
        

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
                    if(that.buttonActive == true){
                        that.scene.pause();
                        that.scene.launch(that.infoScene);
                        that.activeScene = that.infoScene;
                        that.buttonActive = false;
                    }

                    if(that.buttonActive && that.canDoPuzzle){
                        //that.scene.launch('enterPasswordScene');
                        that.scene.pause();
                        that.scene.launch(that.infoScene);
                        that.activeScene = that.infoScene;
                        that.buttonActive = false;
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
                        that.scene.pause();
                        that.scene.launch(that.playableScene);
                        that.activeScene = that.playableScene;
                        
                    }

                    if(that.buttonActive && that.canDoPuzzle){
                        //that.scene.launch('enterPasswordScene');
                        that.scene.pause();
                        that.scene.launch(that.playableScene);
                        that.activeScene = that.playableScene;
                        that.buttonActive = false;
                    }
                });
                


            }
        });
        // ****************************************************************************
        
        // *********************************************puerta****************************************************
        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        this.canDoPuzzle = true

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
            console.log(this.challenge);
            this.challenge++;
            console.log(this.challenge);
            console.log(this.nChallenges);

            this.doorsGroup.children.entries.forEach(element => {
                if (element.challenge == this.challenge && this.challenge == 1) {
                    console.log("Primer if");
                    element.play('opening-door');
                    element.disableBody()
                    this.physics.world.removeCollider(element);
                    // this.table.disableBody();
                    that.canDoPuzzle = false
                } else if (this.challenge == this.nChallenges) {
                    console.log("Segundo if");
                    element.play('opening-door');
                    element.disableBody()
                    // this.table.disableBody();

                    // this.physics.world.removeCollider(this.doorColider2);
                }
            });
        });
        // this.scene.get('enterPasswordScene').events.on('victoria', () => {
        //     this.doorsGroup.playAnimation('opening-door');
        //     this.physics.world.removeCollider(this.doorsColider);
        //     // this.table.disableBody();
        //     that.canDoPuzzle = false
        // });

        //mute button

        //HACK PARA TERMINAR PARTIDA XD
        // this.input.keyboard.on('keydown-Z',()=>{
        //     console.log("HACK ACTIVAD TERMINAR PARTIDA");
        //     for(i=0;i<2;i++){
        //         socket.emit("playerInEndZone");
        //     }
        // })
        this.input.keyboard.on('keydown-Z',()=>{
            console.log("HACK ACTIVAD TERMINAR PARTIDA");
            // for(i=0;i<2;i++){
                socket.emit("passwordPuzzleComplete");
            // }
        })
        window.owo = () => {

        }

        this.input.keyboard.on('keydown-M',()=>{
            if (window.stream.getAudioTracks()[0].enabled == true) {
                window.stream.getAudioTracks()[0].enabled = false;
                console.log(window.stream.getAudioTracks()[0].enabled)
            } else {
                window.stream.getAudioTracks()[0].enabled = true;
            }
        });

        this.playerCollider = this.player.playerCollider
        window.player = this.playersGroup
        console.log(this.isInitiator);    

        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                this.cameras.main.startFollow(player);
            }
        });

        if (this.isInitiator) {
            console.log("ES INICIADOR");
            
            //generador de spawns para jugador
            this.spawns = this.map.objects[0].objects;
            this.spawnsP1 = this.spawns.filter(this.playerFilter,1);
            this.spawnsP2 = this.spawns.filter(this.playerFilter,2);
            this.randpos = Phaser.Math.Between(0, this.spawnsP1.length-1);

            //generador de spawns random para objetos
            this.spawnsObjects = [];

            window.map = this.map;
            for (let i = 1; i <= this.map.objects[2].objects[0].properties[0].value; i++) {
                this.spawnsObjects[i-1] = this.spawns.filter(this.challengeFilter,i);
                
            }

            var spawns = {
                "players":{
                    "p1": {
                        "x":this.spawnsP1[this.randpos].x,
                        "y":this.spawnsP1[this.randpos].y
                    },
                    "p2": {
                        "x":this.spawnsP2[this.randpos].x,
                        "y":this.spawnsP2[this.randpos].y
                    }
                },
                "objects":{
                    "table": [],
                    
                    "chest": []
                }

            }

            //crear spawns de cofres y mesas
            this.spawnsObjects.forEach(element => {
                this.tablesFilter = element.filter(this.objectFilterPlayer,1);
                this.chestsFilter = element.filter(this.objectFilterPlayer,2);
                var randTable = Phaser.Math.Between(0, this.tablesFilter.length-1);
                var randChest = Phaser.Math.Between(0, this.chestsFilter.length-1);
                this.tablePosition = [this.tablesFilter[randTable].x,this.tablesFilter[randTable].y];
                this.chestPosition = [this.chestsFilter[randChest].x,this.chestsFilter[randChest].y];
                spawns.objects.table.push(this.tablePosition);
                spawns.objects.chest.push(this.chestPosition);
            });

            this.placeItems(spawns);

            socket.emit("spawns", spawns);
        } else {
            socket.on("getSpawns", (spawns) => {
                this.placeItems(spawns);
            })
        }
        
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
                    //console.log(this.stickDirection);
                    player.direction = this.stickDirection;
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
        let direction = game.scene.getScene(gameScene.activeScene).getStickDirection(speeds);
        //console.log(speeds);
        //let stickDirection = getStickDirection(speeds);
        //console.log(gameScene.activeScene);
        if(gameScene.activeScene=="game"){
            gameScene.stickActive = true;
            gameScene.speeds = speeds;
            gameScene.getStickDirection(speeds);
        } else { 
            //game.scene.getScene(gameScene.activeScene).moveStick(speeds, stickDirection);
            game.scene.getScene(gameScene.activeScene).moveStick(speeds, direction);
        }
        // if(speeds.x != 0 && speeds.y != 0){

        // }




        // let activeScenes = game.scene.getScenes();
        //     for(let i = 1; i<activeScenes.length; i++){
        //         activeScenes[i].moveStick(speeds, stickDirection);
        //     }
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

    getStickDirection(speeds){
        let gameScene = game.scene.getScene('game');
        console.log("speeds kachow: "+speeds);
        let x = Math.abs(speeds.x);
        let y = Math.abs(speeds.y);

        if (x>y) {
            if (Math.sign(speeds.x)==1) {
                gameScene.stickDirection = 'right'
            } else {
                gameScene.stickDirection = 'left'
            }
        } else if(x<y){
            if (Math.sign(speeds.y)==1) {
                gameScene.stickDirection = 'down'
            } else {
                gameScene.stickDirection = 'up'
            }
        }else{
            if (speeds.x == 0 && speeds.y == 0) {
                gameScene.stickDirection = 'idle'
            }else if(Math.sign(speeds.x)==1){
                gameScene.stickDirection = 'diagonal_right'
            } else if(Math.sign(speeds.x)==-1){
                gameScene.stickDirection = "diagonal_left"
            }
            
        }

        console.log(gameScene.stickDirection);
    }
    
    pressBtn(data){
        let gameScene = game.scene.getScene('game');
        console.log("My callback presbutton");
        console.log(gameScene.activeScene);
        if(data==1){
            if(gameScene.activeScene=="game"){
                console.log("HagoClic");
                gameScene.buttonActive = true;
            } else { 
                game.scene.getScene(gameScene.activeScene).activeButton();
            }
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

    playerFilter(spawns, player) {
        return spawns.name == "player" && spawns.properties[0].value  == this;
    }

    objectFilterPlayer(spawns, player) {
        return spawns.properties[1].name == "player" && spawns.properties[1].value  == this;
    }

    objectFilter(spawns, object) {
        return spawns.name == "object" && spawns.properties[1].value == this;
    }

    challengeFilter(spawns, challenge) {
        return spawns.name == "object" && spawns.properties[0].value == this;
    }

    doorFilter(objects) {
        return objects.name == "door";
    }

    doorChallengeFilter(doors, challenge) {
        return doors.properties[0].value == this;
    }

    getDiff(diff){
        switch (diff.toLowerCase()) {
            case 'easy':
                return 1
            case 'medium':
                return 2
            case 'hard':
                return 3
        }
    }
    placeItems(spawns){
        //spawn jugadores
        this.playersGroup.children.entries[0].x = spawns.players.p1.x
        this.playersGroup.children.entries[0].y = spawns.players.p1.y

        this.playersGroup.children.entries[1].x = spawns.players.p2.x
        this.playersGroup.children.entries[1].y = spawns.players.p2.y

        for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
            this.table[i].x = spawns.objects.table[i][0]
            this.table[i].y = spawns.objects.table[i][1]
            this.tableCollider[i].x = this.table[i].x;
            this.tableCollider[i].y = this.table[i].y;

            this.chest[i].x = spawns.objects.chest[i][0]
            this.chest[i].y = spawns.objects.chest[i][1]
        }
    }
    start(players){
        let playersArray = [];

        players.forEach(element => {
            this.player = new Player(this, element.id, element.x, element.y, "player", element.initiator);
            playersArray.push(this.player);
            if (element.id == socket.id) {
                this.isInitiator = element.initiator; 
            }
        });
        this.diff=data.diff;
        
        this.playersGroup = this.add.group(playersArray);
        this.activeScene = "game";
        this.infoScene = "PasswordMGScene"; 
        this.playableScene = "enterPasswordScene";
        this.roleScene = "helper"
        //this.game.scene.add("SeePass", new SeePass('test'))
        //this.game.scene.add("SeePass", eval("new SeePass('test')"))
        this.game.scene.add(this.infoScene, eval("new "+this.infoScene+"('"+this.roleScene+"',"+diff+")"))
    }

}
