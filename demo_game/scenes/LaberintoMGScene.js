class LaberintoMGScene extends GenericMiniGame {
    constructor(room,type,difficulty,password) {
        super("LaberintoMGScene"+room+"_"+type, type, difficulty);
        this.type = type;
        this.difficulty = difficulty;

    }
    preload() {
        //FOR ALL USERS
        var path = "./demo_game/"
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("lab", path+"assets/tilemaps/mapa2prueba.json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('door', path+'assets/objects/door/door.png', path+'assets/objects/door/door.json');
        //mascara para oscurecer jugadores
        this.load.image('mask', path+'assets/mask1.png');
    }

    create() {
        //Create map settingsw
        //mapa del laberinto
        this.map = this.make.tilemap({key: "lab"});

        console.log(this.map)
        //texturas(Muros,suelo,etc)
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        //suelo
        let groundLayer = this.map.createStaticLayer('ground', this.tileset);
        let wallsLayer = this.map.createStaticLayer('walls', this.tileset);
        //capa vacio del tilemap
        this.voidLayer = this.map.createLayer('void', this.tileset);
        //capa para quitar visibilidad a la capa vacio
        this.voidLayer.visible = true
        //objetos(puerta)
        let objectLayer = this.map.getObjectLayer('objects');

        //FOR ALL USERS
        var that = this
        window.map = this.map
        
        if (this.type == "challenge") {
            //*****************************************Player**************************************************/
            this.player = new Player(this,socket.id,112.5,620,"player",true,"challenge");
            this.playerCollider = this.player.playerCollider;
            this.cameras.main.startFollow(this.player);
            this.player.setDepth(21);
            window.player = this.player;

            this.playersGroup = this.add.group(this.player);
        } else {
            this.player = new Player(this,socket.id,112.5,620,"player",false,"helper");
            this.playerCollider = this.player.playerCollider;
            this.cameras.main.startFollow(this.player);
            this.player.setDepth(21);
            window.player = this.player;
            
            this.playersGroup = this.add.group(this.player);

            socket.on("playerMoveResponse", (moveData) => {
                if(moveData.joystickMoved){
                    player.direction = moveData.direction;
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
                    
            });
        }
        

            
        
        
        // let wallsLayer = new WallsLayer(this);
        // window.wallLayerLab = wallsLayer
        
        wallsLayer.setDepth(20)
        console.log(wallsLayer)
        let rt = this.add.renderTexture(0, 0, 1000, 1000);
        rt.depth = 5
        window.rt = rt
        rt.fill(0x000000);


        var end = this.physics.add.staticGroup();
        var endTile = end.create(609,685);
        endTile.body.setSize(35,20);
        endTile.visible = false;

        this.physics.add.overlap(endTile, this.playerCollider, () => {
            // that.events.emit("end");
            if (this.type=='challenge') {
                console.log("fin de partida")
                socket.emit('passwordPuzzleComplete');
            }
            this.scene.stop();
            this.scene.resume("game");
        })

        this.spotlight = this.make.sprite({
            x: 0,
            y: 0,
            key: "mask",
            add: false
        });
        let mask = rt.createBitmapMask(this.spotlight)
        mask.invertAlpha = true;
        rt.setMask(mask);

        //Crear grupo donde se almacenan las puertas
        this.doorsGroup = this.physics.add.staticGroup();

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
                    break;
            }
        });

        //Añadir colider al grupo de puertas
        this.doorColider0 = this.physics.add.collider(this.player, this.doorsGroup.children.entries[0]);

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
        
        //toca el suelo o puerta? 
        this.touch = false
    }
    update(){
        //FOR ALL USERS
        var tile = this.voidLayer.getTileAtWorldXY(this.player.x, this.player.y);

        if (tile?.index == 357 && !this.touch) {
            this.touch = true
            this.player.stop()
            this.player.scale = 1
            console.log("toco el voidddd");
             this.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    this.time.removeEvent(this.fallingAnimation)
                    // this.fallingAnimation.remove()
                    this.touch = false
                    this.player.update()
                    this.player.x = 165
                    this.player.y = 640
                    this.player.rotation = 0
                    this.player.scale = 1
                    console.log("vuelve el personaje");
                },
                loop: false
            })

            this.fallingAnimation = this.time.addEvent({
                delay: 50,
                callback: ()=>{
                    console.log(this.player.scale)
                    if (this.player.scale > 0 && (this.player.scale-0.1) > 0) {
                        this.player.scale -= 0.05
                        console.log(this.player.scale)
                    }

                    this.player.rotation+=0.3
                },
                loop: true
            })
        } else if (tile == null) {
            // this.player.update()
        }

        if(this.type=='helper'){
            this.spotlight.x = this.player.x;
            this.spotlight.y = this.player.y;
        } else {
            this.player.update()
        }
    }
}   