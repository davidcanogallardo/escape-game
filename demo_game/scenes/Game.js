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
        //lista de minijuegos disponibles
        this.gamesAvailable = ["PasswordMGScene"]
        this.games = []
        this.map = this.getRandomMap();
        this.gamesList = []
        
        this.playersGroup = this.add.group(playersArray);
        this.activeScene = "game";
        this.infoScene = "PasswordMGScene_helper"; 
        this.passwordminigame = "PasswordMGScene"; 
        this.playableScene = "PasswordMGScene_challenge";
        this.roleScene = "helper"
        this.loadedScenes = [];
        //this.game.scene.add("SeePass", new SeePass('test'))
        //this.game.scene.add("SeePass", eval("new SeePass('test')")
        
    }   

    preload() {
        var path = "./demo_game/"
        this.segundos = 0;
        this.challenge = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/1-1.json");
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

        window.table = this.table;
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
                    if(eKey.isDown && that.canDoPuzzle){
                        console.log(that.gamesList);
                        that.scene.pause();
                        that.scene.launch(that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper");
                        that.activeScene = that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper";
                        that.buttonActive = false;
                    }

                    if(that.buttonActive && that.canDoPuzzle){
                        //that.scene.launch('enterPasswordScene');
                        that.scene.pause();
                        that.scene.launch(that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper");
                        that.activeScene = that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper";
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
                        that.scene.launch(that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge");
                        that.activeScene = that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge";
                        
                    }

                    if(that.buttonActive && that.canDoPuzzle){
                        //that.scene.launch('enterPasswordScene');
                        that.scene.pause();
                        that.scene.launch(that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge");
                        that.activeScene = that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge";
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
                if (element.challenge == this.challenge) {
                    console.log("Primer if");
                    element.play('opening-door');
                    element.disableBody()
                    this.physics.world.removeCollider(element);
                    // this.table.disableBody();
                } else if (this.challenge == this.nChallenges) {
                    console.log("Segundo if");
                    element.play('opening-door');
                    element.disableBody()
                    that.canDoPuzzle = false
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

        window.map = this.map;
        if (this.isInitiator) {
            console.log("ES INICIADOR");
            //this.game.scene.add(this.infoScene, eval("new "+this.passwordminigame+"('helper','medium')"))
            //this.game.scene.add(this.playableScene, eval("new "+this.passwordminigame+"('challenge','medium')"))
            

            //generador de spawns para jugador
            this.spawns = this.map.objects[0].objects;
            this.spawnsP1 = this.spawns.filter(this.playerFilter,1);
            this.spawnsP2 = this.spawns.filter(this.playerFilter,2);
            this.randpos = Phaser.Math.Between(0, this.spawnsP1.length-1);

            //generador de spawns random para objetos
            this.spawnsObjects = [];

            // window.map = this.map;
            for (let i = 1; i <= this.map.objects[2].objects[0].properties[0].value; i++) {
                this.spawnsObjects[i-1] = this.spawns.filter(this.challengeFilter,i);
                
            }

            //generador de escenas
            this.helper = [];
            this.challenge = []
            for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
                this.gamesList.push(this.gamesAvailable[Math.floor(Math.random()*this.gamesAvailable.length)]);
                //this.game.scene.add(this.games[i]+"_helper", eval("new "+this.games[i]+"('helper','medium')"))
                console.log(this.gamesList[i]+i+"_helper");
                //this.game.scene.add(this.games[i]+"_challenge",eval("new "+this.games[i]+"('challenge','medium')"))
                console.log(this.gamesList[i]+i+"_challenge");
                //this.game.scene.add(this.games[i]+i+"_helper", new PasswordMGScene(i,'helper','medium'));
                this.game.scene.add(this.gamesList[i]+i+"_helper",eval("new "+this.gamesList[i]+"("+i+",'helper','easy')"))
                this.game.scene.add(this.gamesList[i]+i+"_challenge",eval("new "+this.gamesList[i]+"("+i+",'challenge','easy')"))
                this.loadedScenes.push(this.gamesList[i]+i+"_helper")
                this.loadedScenes.push(this.gamesList[i]+i+"_challenge")
            }
            

            //this.game.scene.add(this.games[0]+"1_challenge",eval("new "+this.games[0]+"('challenge','medium','1')"))
            //this.game.scene.add(this.games[1]+"2_challenge",eval("new "+this.games[1]+"('challenge','medium','2')"))
            console.log(this.gamesList);

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
                },
                "gamesList": this.gamesList
            }

            //crear spawns de cofres y mesas
            this.spawnsObjects.forEach(element => {
                this.tablesFilter = element.filter(this.objectFilterPlayer,1);
                this.chestsFilter = element.filter(this.objectFilterPlayer,2);
                var randTable = Phaser.Math.Between(0, this.tablesFilter.length-1);
                var randChest = Phaser.Math.Between(0, this.chestsFilter.length-1);
                this.tablePosition = [this.tablesFilter[randTable].x,this.tablesFilter[randTable].y, this.tablesFilter[randTable].properties[0].value];
                this.chestPosition = [this.chestsFilter[randChest].x,this.chestsFilter[randChest].y, this.chestsFilter[randChest].properties[0].value];
                var table = {
                    x: this.tablesFilter[randTable].x,
                    y: this.tablesFilter[randTable].y,
                    challenge: this.tablesFilter[randTable].properties[0].value
                }
                var chest = {
                    x: this.chestsFilter[randChest].x,
                    y: this.chestsFilter[randChest].y,
                    challenge: this.chestsFilter[randChest].properties[0].value
                }
                spawns.objects.table.push(table);
                spawns.objects.chest.push(chest);
                console.error(this.tablePosition);
            });


            //almacenar contraseñas de los escenarios en los spawns
            for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
                spawns.objects.table[i].type = this.gamesList[i]
                spawns.objects.chest[i].type = this.gamesList[i]
                if (this.gamesList[i] == "PasswordMGScene") {
                    spawns.objects.table[i].password = this.game.scene.keys[this.gamesList[i]+i+"_helper"].getPassword()
                    spawns.objects.chest[i].password = this.game.scene.keys[this.gamesList[i]+i+"_helper"].getPassword()
                }
                
            }
            console.log(spawns);
            socket.emit("spawns", spawns);
            this.placeItems(spawns);
        } else {
            socket.on("getSpawns", (spawns) => {
                this.placeItems(spawns);
            })
            
        }
        console.log(this.loadedScenes);
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
        console.log(spawns);
        this.gamesList = spawns.gamesList;
        this.playersGroup.children.entries[0].x = spawns.players.p1.x
        this.playersGroup.children.entries[0].y = spawns.players.p1.y

        this.playersGroup.children.entries[1].x = spawns.players.p2.x
        this.playersGroup.children.entries[1].y = spawns.players.p2.y

        //asignar los spawns de los cofres
        for (let i = 0; i < spawns.objects.chest.length; i++) {
            this.chest[i].x = spawns.objects.chest[i].x;
            this.chest[i].y = spawns.objects.chest[i].y;
            this.chest[i].challenge = spawns.objects.chest[i].challenge;
        }

        // asignar los spawns de las mesas
        for (let i = 0; i < spawns.objects.table.length; i++) {
            this.table[i].x = spawns.objects.table[i].x
            this.table[i].y = spawns.objects.table[i].y
            this.table[i].challenge = spawns.objects.table[i].challenge
            this.tableCollider[i].x = this.table[i].x;
            this.tableCollider[i].y = this.table[i].y;
        }

        //generar las escenas del segundo jugador con las contraseñas 
        for (let i = 0; i < spawns.gamesList.length; i++) {
            if (!this.isInitiator) {
                // console.error(spawns.objects.chest[i].password);
                // console.error("new "+spawns.gamesList[i]+"("+i+",'challenge','medium',"+JSON.stringify(spawns.objects.table[i].password)+")");
                // console.error("new "+spawns.gamesList[i]+"("+i+",'helper','medium',"+JSON.stringify(spawns.objects.chest[i].password)+")");
                this.game.scene.add(spawns.gamesList[i]+i+"_helper",eval("new "+spawns.gamesList[i]+"("+i+",'helper','easy',"+JSON.stringify(spawns.objects.chest[i].password)+")"))
                this.game.scene.add(spawns.gamesList[i]+i+"_challenge",eval("new "+spawns.gamesList[i]+"("+i+",'challenge','easy',"+JSON.stringify(spawns.objects.table[i].password)+")"))
                this.loadedScenes.push(spawns.gamesList[i]+i+"_helper");
                this.loadedScenes.push(spawns.gamesList[i]+i+"_challenge");
                console.error(this.map);
            }
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
    getRandomMap(diff){
        $.ajax({
            type: "GET",
            url: "http://localhost:1111/api/getmaps/"+diff
        })
        .done((data) => {
            //LLegan todos los ids de los mapas con la dificultad elegida
            console.log(data);
          
        })
        .fail(function () {
            showNotification("Fallo servidor", "red");
        });
    }

}
