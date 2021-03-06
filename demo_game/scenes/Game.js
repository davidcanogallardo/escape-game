class Game extends Phaser.Scene {
    constructor() {
        super("game")
    }
    init(data){
        this.playersArray = [];
        this.chest = [];
        this.objectsForGuest = null;
        data.players.forEach(player => {
            console.log('players', player);
            this.player = new Player(this, player.id, player.x, player.y, "player", player.initiator, player.username);
            this.playersArray.push(this.player);
            if (player.id == socket.id) {
                this.isInitiator = player.initiator; 
                this.playerInfo = player
            } else {
                this.partnerInfo = player 
            }
        });
        window.player =this.playersArray
        this.diff=data.diff;

        //lista de minijuegos disponibles
        this.gamesAvailable = ["PasswordMGScene","LaberintoMGScene"]
        // this.gamesAvailable = ["LaberintoMGScene"]

        //lista de minijuegos que tendra la escena
        this.games = []
        //Set map
        this.level = data.map;

        this.gamesList = []
        
        this.playersGroup = this.add.group(this.playersArray);
        this.activeScene = "game";
        window.activeScene = this.activeScene
        this.infoScene = "PasswordMGScene_helper"; 
        this.passwordminigame = "PasswordMGScene"; 
        this.playableScene = "PasswordMGScene_challenge";
        this.roleScene = "helper"
        this.loadedScenes = [];
        this.speeds = {
            x: 0,
            y: 0
        }
        this.canDoPuzzle = true
    }   

    preload() {
        if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
            this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        }
        var path = "./demo_game/"
        this.segundos = 0;
        this.challenge = 0;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/"+this.level.name+".json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('chest', path+'assets/objects/chest.png', path+'assets/objects/chest.json');
        this.load.image("password_background", path+"assets/password_paper.png");
        this.load.image("time_frame", path+"assets/timeFrame.png");
        this.load.image("awsd", path+"assets/helpDialog/awsd.png");
        this.load.image("blue", path+"assets/helpDialog/blue.png");
        
        this.load.image("xkey", path+"assets/helpDialog/xkey.png");
        this.load.image("ekey", path+"assets/helpDialog/ekey.png");
        this.load.image("hkey", path+"assets/helpDialog/hkey.png");
        this.load.image("mkey", path+"assets/helpDialog/mkey.png");

        this.load.image("red", path+"assets/helpDialog/red.png");
        this.load.image("green", path+"assets/helpDialog/green.png");
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        this.load.image('table', path+'assets/tilesets/TSMapa/PNG/table.png');
        this.load.image('passwd_bg', path+'assets/BGTable.png');
        this.load.image('helpBtn', path+'assets/helpBtn.png');
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        this.cursors = this.input.keyboard.createCursorKeys();
        for(let i=0; i<9; i++){
            this.load.image('simbol'+i, path+'assets/passwd/simbol'+i+'.png');
        }
        this.buttonActive = false;
        this.stickButtonActive = false;
        this.stickActive = false;
        //this.controllerConnected = false;
        if(this.controllerConnected){
            console.log("Controller Connected");
            this.bluetoothConnection.setCallbackButtonA(this.pressBtn);
            this.bluetoothConnection.setCallbackButtonJoystick(this.pressStick);
            this.bluetoothConnection.setCallbackJoystick(this.moveStick);
            this.bluetoothConnection.start();
        }
    }

    help() {
        console.log("help f");
        this.scene.launch('help_dialog',{"message":window.i18n.t("game.gameHint"),"scene":this.scene.key})
    }

    mute() {
        console.log("mute");
        if (window.stream.getAudioTracks()[0].enabled == true) {
            window.stream.getAudioTracks()[0].enabled = false;
            console.log(window.stream.getAudioTracks()[0].enabled)
        } else {
            window.stream.getAudioTracks()[0].enabled = true;
        }
    }

    openChallenge() {
        if (this.scene.isActive()) {
            var table = this.tableInRange
            this.keyPressed = false
            this.scene.pause();
            this.scene.launch(this.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge");
            this.activeScene = this.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge";
            window.activeScene = this.activeScene
        }
    }
    openHelper() {
        if (this.scene.isActive()) {
            var chest = this.chestInRange
            this.keyPressed = false
            this.scene.pause();
            this.scene.launch(this.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper");
            this.activeScene = this.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper";
            this.buttonActive = false;
            window.activeScene = this.activeScene

        }
    }

    create() {
        this.keyPressed = false
        let { width, height } = this.sys.game.canvas;
        this.scene.get('ui').events.on('help', this.help, this);
        this.scene.get('ui').events.on('mute', this.mute, this);
        this.scene.get('ui').events.on('interactuate', function () {
            if (this.scene.isActive()) {
                this.keyPressed = !this.keyPressed
            }
        }, this);
        window.this = this
        // if(navigator.userAgentData.mobile){
        //     this.virtualJoyStick = this.game.plugins.get('rexvirtualjoystickplugin').add(this, {
        //         x: 50,
        //         y: 250,
        //         radius: 20,
        //         base: this.add.circle(0, 0, 20, 0x888888),
        //         thumb: this.add.circle(0, 0, 10, 0xcccccc),
        //         // dir: '8dir',
        //         // forceMin: 16,
        //         // fixed: true,
        //         // enable: true
        //     });
        //     this.virtualJoyStick.base.setDepth(1000);
        //     this.virtualJoyStick.thumb.setDepth(1000);

        //     //Mover personaje con joystick
        //     this.virtualJoyStick.on('update', this.moveVirtualJoyStick, this);
        //     // if(navigator.userAgentData.mobile){
                
        //     // }
            

        //     // this.buttonA = this.add.group(this);
        //     // this.buttonACirc = this.add.circle(40, 300, 20, 0x888888);
        //     // this.buttonAText = this.add.text(40, 300, 'A');
        //     // this.buttonA.add(this.buttonACirc);
        //     // this.buttonA.add(this.buttonAText);
        //     // this.buttonA.incX(40);
        //     // this.buttonA.incY(300);

        //     // this.buttonB = this.add.group(this);
        //     // this.buttonBCirc = this.add.circle(55, 300, 20, 0x888888);
        //     // this.buttonBText = this.add.text(55, 300, 'B');
        //     // this.buttonB.add(this.buttonBCirc);
        //     // this.buttonB.add(this.buttonBText);
        //     // this.buttonB.incX(55);
        //     // this.buttonB.incY(300);
        // }

        
        // **********************************************inicializacion de weas******************************************************
        var that = this
        this.map = this.make.tilemap({
            key: "map"
        });
        this.nChallenges = this.map.objects[2].objects[0].properties[0].value
        
        this.events.on("tiempo", (tiempo) => {
            that.scene.remove('time')
            console.log("tiempo recibido "+ tiempo)
            that.scene.start("gameover",{ score : tiempo})
        }, this)

        
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');


        //**********************************GENERAR ESCENARIO*********************************************************************/
        var groundLayer = this.map.createStaticLayer('ground', this.tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        this.wallsLayer = new WallsLayer(this);

        // ****************************final de partida*****************************************************
        // SE crea un objeto invisible que cuando los jugadores lo toquen se termine la partida
        var end = this.physics.add.staticGroup();
        var endSpawn = this.map.objects[0].objects.filter(this.endFilter);
        var endTile = end.create(endSpawn[0].x+18,endSpawn[0].y+20)
        endTile.body.setSize(endSpawn[0].width,endSpawn[0].height)
        endTile.visible = false

        // cada vez que un usuario toca la zona de final de juego
        //la variable inZone del jugador se vuelve true
        this.playersGroup.getChildren().forEach(player => {
            this.physics.add.overlap(endTile, player, function () {
                player.inZone = true;
            });
        });

        // cuando el servidor informa que es el final de partida se borran las escenas
        // y se cambia a la escena de final de partida
        socket.on("endGame", () => {
            this.loadedScenes.forEach(scene => {
                this.game.scene.remove(scene);
            });
            
            this.scene.start("EndGameScene", 
                {
                    nChallenges: this.nChallenges, 
                    players: {"player":this.playerInfo, "partner":this.partnerInfo}, 
                    map: this.level,
                    time: this.game.scene.getScene('time').getTime()
                }
            );

            game.scene.getScene("ui").scene.stop();
    
            // equivalente a cerrar el chat de voz
            window.stream = undefined;
        });

        // *****************************************************
        // *********************************************************************************************************
        
        //************************ui  */
        this.scene.launch('ui');
        /**************************************************************************************** */
        
        //*****************************************Players**************************************************/
        // zoom dependiendo si est?? en pc o m??vil
        // TODO deja de usar este bucle pls
        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                if(navigator.userAgent.toLowerCase().match('android') != null || navigator.userAgent.toLowerCase().match('iphone') != null){
                    this.cameras.main.zoom = 3.5;
                } else {
                    this.cameras.main.zoom = 5;
                }
                
                this.cameras.main.startFollow(player);
            }
        });

        //Se recibe el el movimiento del otro jugador para mover al personaje
        // en el cliente.
        socket.on("playerMoveResponse", (moveData) => {
            this.playersGroup.getChildren().forEach(player => {
                //console.log(moveData.direction);
                if (!moveData.laberinth) {
                    
                    if(moveData.id == player.id){
                        //console.log(this.stickActive);
                        if(moveData.joystickMoved){
                            //console.log("Joystick activado, Muevo otro jugador");
                            player.direction = moveData.direction;
                            player.move(moveData.speed_x, moveData.speed_y);
                            moveData.joystickMoved = false;
                            this.stickActive = false;
                            
                        } else if(moveData.virtualJoyStickMoved){
                            if(moveData.direction.trim() == "left"){
                                player.move(-150,0);
                            }else if(moveData.direction.trim() == "right"){
                                player.move(150, 0);
                            } else if (moveData.direction.trim() == "up"){
                                player.move(0, -150);
                            } else if(moveData.direction.trim() == "down") {
                                player.move(0, 150)
                            } else if (moveData.direction.trim() == "up left"){
                                player.move(-150, -150);
                            } else if (moveData.direction.trim() == "up right"){
                                player.move(150, -150);
                            } else if (moveData.direction.trim() == "down left"){
                                player.move(-150, 150);
                            } else if (moveData.direction.trim() == "down right"){
                                player.move(150, 150);
                            } else {
                                player.move(0,0);
                            }
                            this.virtualJoyStickIsActive = false;
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
                }
            });
        })
        // *********************************************************************************************************
        
        this.input.keyboard.on('keydown-H',()=>{
            console.log("h apretada22");
            this.help()

            // h.create()
        })

        // ***************************************PUERTAS****************************************************************************

        //Crear grupo donde se almacenan las puertas
        this.doorsGroup = this.physics.add.staticGroup();

        this.doorsColiders = [];

        //iterar por todos los objetos de la capa de objetos
        objectLayer.objects.forEach(object => {
            //Popriedades de cada objeto
            const {x = 0, y = 0, height, width, type, name} =  object;
            switch(type){
                case 'door':
                    //Cambiar la hitbox de la puerta cerrada
                    this.door = this.physics.add.staticSprite(x+(width/2),y-(height/2), 'door', 'door-closed');
                    this.door.body.setSize(width, height*0.1).setOffset(width-33,height-5);
                    var collider = this.physics.add.collider(this.door, this.playersGroup)
                    // Se le asigna al objeto de phaser la variable "challenge" para indicar de qu?? reto
                    // es la puerta, para solo abrir la puertas con reto X cuando se pasa de reto
                    this.door.challenge = object.properties[0].value
                    //Agregar puerta al grupo de puertas
                    this.doorsGroup.add(this.door);
                    this.doorsColiders[this.doorsGroup.length] = collider
                    break;
            }
        });

        // 
        let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        

        this.anims.create({
            key: 'door-closed',
            frames: [{key: 'door', frame: 'door-0.png'}],
        })

        this.anims.create({
            key: 'opening-door',
            frames: this.anims.generateFrameNames('door',{start: 0 , end: 3, prefix: 'door-',suffix: '.png'}),
            repeat: 0,
            frameRate: 5
        })

        // ******************************************************MESAS/COFRES************************************************************
        // se generan tantas mesas y cofres como retos haya en la leyenda
        // las mesas se guardan en this.table y los cofres en this.chest
        this.table = [];
        this.tableCollider = [];
        this.chestCollider = [];
        var nChallenges = this.map.objects[2].objects[0].properties[0].value
        for (let i = 0; i < nChallenges; i++) {
            //************************ mesas*/
            this.table[i] = this.physics.add.sprite(0,0, 'table');
            this.physics.add.collider(this.table[i], this.playersGroup);
            this.table[i].body.immovable = true
            this.table[i].challenge = (i+1)

            this.tableCollider[i] = this.physics.add.image(this.table[i].x, this.table[i].y);
            this.tableCollider[i].setSize(this.table[i].width, this.table[i].height)
            this.tableCollider[i].body.immovable = true
            this.physics.add.collider(this.tableCollider[i], this.playersGroup);

            //************************ cofres*/
            this.chest[i] = this.physics.add.sprite(0,0,'chest','chest_empty_open_anim_f0.png');
            // this.physics.add.existing(this.chest[i]);
            //collider para que el personaje con el cofre
            this.physics.add.collider(this.chest[i], this.playersGroup);
            this.chest[i].body.setSize(this.chest[i].width*0.5, this.chest[i].height*0.8);
            this.chest[i].body.immovable = true
            this.chest[i].challenge = (i+1)

            this.chestCollider[i] = this.physics.add.image(this.chest[i].x, this.chest[i].y);
            this.chestCollider[i].setSize(this.chest[i].width*0.5, this.chest[i].height*0.8)
            this.chestCollider[i].body.immovable = true
            this.physics.add.collider(this.chestCollider[i], this.playersGroup);
        }

        // colisi??n e interacciones con mesa y cofre
        // TODO
        this.playersGroup.getChildren().forEach(player => {
            if(player.id == socket.id){
                //A??adir colision al jugador con el mismo socket
                //Cofre
                that.keyPressed = false
                
                this.physics.add.overlap(player.playerCollider, this.chest, function (player, chest) {
                    that.chestInRange = chest

                    if(chest.y < player.y){
                        that.player.setDepth(10);
                    } else {
                        that.player.setDepth(0);
                    }
                    if(eKey.isDown && that.canDoPuzzle || that.keyPressed){
                        that.openHelper()
                    }

                    // if(that.buttonActive && that.canDoPuzzle){
                    //     that.scene.pause();
                    //     that.scene.launch(that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper");
                    //     that.activeScene = that.gamesList[chest.challenge-1]+(chest.challenge-1)+"_helper";
                    //     that.buttonActive = false;
                    // }

                });

                //Mesa
                this.physics.add.overlap(player.playerCollider, this.table, function (player,table) {
                    that.tableInRange = table
                    if(table.y < player.y){
                        that.player.setDepth(10);
                    } else {
                        that.player.setDepth(0);
                    }
                    if (eKey.isDown && that.canDoPuzzle || that.keyPressed) {
                        that.openChallenge()
                        // that.scene.pause();
                        // that.scene.launch(that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge");
                        // that.activeScene = that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge";
                        // 
                    }

                    if(that.buttonActive && that.canDoPuzzle){
                        // that.openChallenge()
                        // that.scene.pause();
                        // that.scene.launch(that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge");
                        // that.activeScene = that.gamesList[table.challenge-1]+(table.challenge-1)+"_challenge";
                        // that.buttonActive = false;
                    }
                });
            }
        });
        // ****************************************************************************
        

        
        // **********************************ESCENA DE PAUSA QUE CREO QYUE YA NO VA******************************************
        //necesario para que el juego pause al cambiar la ventana correctamente
        game.scene.game.hasFocus = true;
        if(game.scene.game.hasFocus == false){
            this.scene.launch('pause_scene')
            this.scene.pause();
        }
        //************************EVENTO DE PUZZLE COMPLETADO********************************
        socket.on("passwordPuzzleResolved", (data) => {
            console.log("Puzzle complete");
            this.challenge++;
            window.activeScene = "game"
            // this.game.scene.keys[window.activeScene].stop();
       

            this.doorsGroup.children.entries.forEach(door => {
                if (door.challenge == this.challenge) {
                    door.play('opening-door');
                    door.disableBody()
                    this.physics.world.removeCollider(door);
                } else if (this.challenge == this.nChallenges) {
                    door.play('opening-door');
                    door.disableBody()
                    that.canDoPuzzle = false
                }
            });

            for (let i = 0; i < this.chest.length; i++) {
                if (this.chest[i].challenge == this.challenge) {
                    this.chest[i].disableBody()
                }
                if (this.table[i].challenge == this.challenge) {
                    this.table[i].disableBody()
                }
                // const element = this.chest[i];
                // console.log("challenge", this.chest[i].challenge);
                // console.log("challenge", this.table[i].challenge);
                // this.chest[i].disableBody()
            }
            // TODO hacer lo mismo para cofres y mesas
        });
        //************************************************* */

        //HACK PARA TERMINAR PARTIDA XD
        // this.input.keyboard.on('keydown-Z',()=>{
        //     console.log("HACK ACTIVAD TERMINAR PARTIDA");
        //     for(let i=0;i<2;i++){
        //         socket.emit("playerInEndZone");
        //     }
        // })
        // this.input.keyboard.on('keydown-Z',()=>{
        //     console.log("HACK ACTIVAD TERMINAR PARTIDA");
        //         socket.emit("passwordPuzzleComplete");
        // })

        //************************MUTEAR MICROFONO********************************
        this.input.keyboard.on('keydown-M',()=>{
            this.mute()
        });
        //********************************************************************** */


        // ************************************GENERAR ESCENAS EN BASE A LA LEYENDA************************
        if (this.isInitiator) {
            //generador de spawns para jugador
            this.spawns = this.map.objects[0].objects;
            this.spawnsP1 = this.spawns.filter(this.playerFilter,1);
            this.spawnsP2 = this.spawns.filter(this.playerFilter,2);
            this.randpos = Phaser.Math.Between(0, this.spawnsP1.length-1);

            //generador de spawns random para objetos
            this.spawnsObjects = [];

            //bucle en base a la leyenda
            for (let i = 1; i <= this.map.objects[2].objects[0].properties[0].value; i++) {
                this.spawnsObjects[i-1] = this.spawns.filter(this.challengeFilter,i);
                
            }

            //generador de escenas
            this.helper = [];
            this.challenge = []

            for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
                console.log("leyenda", this.map.objects[2].objects[0].properties);
                this.gamesList.push(this.gamesAvailable[Math.floor(Math.random()*this.gamesAvailable.length)]);
                
                this.game.scene.add(this.gamesList[i]+i+"_challenge",eval("new "+this.gamesList[i]+"("+i+",'challenge','"+this.diff+"')"))
                this.game.scene.add(this.gamesList[i]+i+"_helper",eval("new "+this.gamesList[i]+"("+i+",'helper','"+this.diff+"')"))
                console.error(this.game.scene.keys[this.gamesList[i]+i+"_challenge"].correctPassword);
                this.loadedScenes.push(this.gamesList[i]+i+"_helper")
                this.loadedScenes.push(this.gamesList[i]+i+"_challenge")
                var password = this.game.scene.keys[this.gamesList[i]+i+"_challenge"].correctPassword
                this.game.scene.keys[this.gamesList[i]+i+"_helper"].correctPassword=password
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
                },
                "gamesList": this.gamesList
            }

            //crear spawns de cofres y mesas
            this.spawnsObjects.forEach(element => {
                var chestPlayer = Phaser.Math.Between(1, 3-1) 
                var tablePlayer 
                
                if (chestPlayer == 1) {
                    tablePlayer = 2
                } else {
                    tablePlayer = 1
                }
                
                this.tablesFilter = element.filter(this.objectFilterPlayer,tablePlayer);
                this.chestsFilter = element.filter(this.objectFilterPlayer,chestPlayer);
                var randTable = Phaser.Math.Between(0, this.tablesFilter.length-1);
                var randChest = Phaser.Math.Between(0, this.chestsFilter.length-1);

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
            });


            //almacenar contrase??as de los escenarios en los spawns
            for (let i = 0; i < this.map.objects[2].objects[0].properties[0].value; i++) {
                spawns.objects.table[i].type = this.gamesList[i]
                spawns.objects.chest[i].type = this.gamesList[i]
                if (this.gamesList[i] == "PasswordMGScene") {
                    spawns.objects.table[i].password = this.game.scene.keys[this.gamesList[i]+i+"_challenge"].getPassword()
                    spawns.objects.chest[i].password = this.game.scene.keys[this.gamesList[i]+i+"_challenge"].getPassword()
                }
                
            }
            socket.emit("spawns", spawns);
            console.log(spawns,spawns);
            this.placeItems(spawns);
        } else {
            if(this.objectsForGuest != null){
                this.placeItems(this.objectsForGuest);
            }
        }


    }

  
    update() {
        // controla si los dos jugadores han salido por la puerta
        this.playersGroup.getChildren().forEach(player => {
            let count = 0;
            if(player.inZone==true){
                count++;
            }
            if(count == 2){
                socket.emit("playerInEndZone", player);
            }
        });

        //Mover con Joystick
        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                if(this.stickActive){
                    player.x_speed = this.speeds['x'];
                    player.y_speed = this.speeds['y'];
                    player.direction = this.stickDirection;
                } else if(this.virtualJoyStickIsActive){
                    player.x_speed = this.speeds['x'];
                    player.y_speed = this.speeds['y'];
                    player.direction = this.stickDirection;
                }
                player.update();
            }
        });


    }

    moveVirtualJoyStickInGame(moveData){
        // this.virtualJoyStickIsActive = true;
        this.playersGroup.getChildren().forEach(player => {
            if(socket.id == player.id){
                this.speeds['x'] = moveData.angle;
                this.speeds['y'] = moveData.angle;
                this.stickDirection = moveData.direction;
                //console.log(this.speeds);
                //console.log(this.stickDirection);
            }
        });

        player.x_speed = this.speeds['x'];
        player.y_speed = this.speeds['y'];
        player.direction = this.stickDirection;
        this.virtualJoyStickIsActive = true;
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

    endFilter(objects) {
        return objects.name == "end";
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
        console.log(spawns);
        //spawn jugadores
        this.gamesList = spawns.gamesList;

        //jugador 1
        this.playersGroup.children.entries[0].x = spawns.players.p1.x
        this.playersGroup.children.entries[0].y = spawns.players.p1.y

        //jugador 2
        this.playersGroup.children.entries[1].x = spawns.players.p2.x
        this.playersGroup.children.entries[1].y = spawns.players.p2.y

        //asignar los spawns de los cofres
        for (let i = 0; i < spawns.objects.chest.length; i++) {
            this.chest[i].x = spawns.objects.chest[i].x;
            this.chest[i].y = spawns.objects.chest[i].y;
            this.chest[i].challenge = spawns.objects.chest[i].challenge;

            this.chestCollider[i].x = this.chest[i].x;
            this.chestCollider[i].y = this.chest[i].y;
        }

        // asignar los spawns de las mesas
        for (let i = 0; i < spawns.objects.table.length; i++) {
            this.table[i].x = spawns.objects.table[i].x
            this.table[i].y = spawns.objects.table[i].y
            this.table[i].challenge = spawns.objects.table[i].challenge
            this.tableCollider[i].x = this.table[i].x;
            this.tableCollider[i].y = this.table[i].y;
        }

        //generar las escenas del segundo jugador con las contrase??as 
        for (let i = 0; i < spawns.gamesList.length; i++) {
            if (!this.isInitiator) {
                this.game.scene.add(spawns.gamesList[i]+i+"_helper",eval("new "+spawns.gamesList[i]+"("+i+",'helper','"+this.diff+"',"+JSON.stringify(spawns.objects.chest[i].password)+")"))
                this.game.scene.add(spawns.gamesList[i]+i+"_challenge",eval("new "+spawns.gamesList[i]+"("+i+",'challenge','"+this.diff+"',"+JSON.stringify(spawns.objects.table[i].password)+")"))
                this.loadedScenes.push(spawns.gamesList[i]+i+"_helper");
                this.loadedScenes.push(spawns.gamesList[i]+i+"_challenge");
                console.error(this.map);
            }
        }
    }
    
    start(players){
        this.playersArray = [];

        players.forEach(element => {
            this.player = new Player(this, element.id, element.x, element.y, "player", element.initiator);
            this.playersArray.push(this.player);
            if (element.id == socket.id) {
                this.isInitiator = element.initiator; 
            }
        });
        this.diff=data.diff;
        
        this.playersGroup = this.add.group(this.playersArray);
        this.activeScene = "game";
        this.infoScene = "PasswordMGScene"; 
        this.playableScene = "enterPasswordScene";
        this.roleScene = "helper"
        this.game.scene.add(this.infoScene, eval("new "+this.infoScene+"('"+this.roleScene+"',"+diff+")"))
    }

}
