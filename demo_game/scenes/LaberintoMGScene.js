class LaberintoMGScene extends GenericMiniGame {
    constructor(room,type,difficulty,password) {
        super("LaberintoMGScene"+room+"_"+type, type, difficulty);
        this.type = type;
        this.difficulty = difficulty;
        this.win = false
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

        this.cam = this.cameras.main;
        window.cam = this.cam
        this.cam._zoomX = 3;
        if (this.type == "helper" && this.difficulty != "easy") {
            this.timedEvent = this.time.addEvent({ delay: 10000, callback: this.rotateCam, callbackScope: this, loop: true }); 
        }
        
        if (this.type == "challenge") {
            //*****************************************Player**************************************************/
            this.player = new Player(this,socket.id,this.map.objects[1].objects[2].x,this.map.objects[1].objects[2].y,"player",true,"challenge");
            this.playerCollider = this.player.playerCollider;
            this.cameras.main.startFollow(this.player);
            this.player.setDepth(21);
            window.player = this.player;

            this.playersGroup = this.add.group(this.player);
        } else {
            this.player = new Player(this,socket.id,this.map.objects[1].objects[2].x,this.map.objects[1].objects[2].y,"player",false,"helper");
            this.playerCollider = this.player.playerCollider;
            this.cameras.main.startFollow(this.player);
            this.player.setDepth(21);
            window.player = this.player;
            
            this.playersGroup = this.add.group(this.player);

            socket.on("playerMoveResponse", (moveData) => {
                if (moveData.laberinth && !this.win) {
                    if(moveData.joystickMoved){
                        player.direction = moveData.direction;
                        player.move(moveData.speed_x, moveData.speed_y);
                    } else {
                        this.player.x = moveData.x
                        this.player.y = moveData.y
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
        }
        
        // this.wallGroup = this.physics.add.staticGroup();
        // wallsLayer.forEachTile(tile => {
        //     if (tile.properties.wall == true) {
        //         //Quito la propiedad de colisión del tile
        //         tile.properties.colides = false
        //         // console.log(tile);
        //         const x = tile.getCenterX();
        //         const y = tile.getCenterY();

        //         //Creo el nuevo tile
        //         const new_tile = this.wallGroup.create(x,y);
        //         //Le pongo tamaño y lo posiciono (setOffset)
        //         new_tile.body.setSize(tile.width, tile.height*0.1).setOffset(tile.width-7,tile.height+5)
        //         //Añado la colisión al nuevo tile
        //         this.physics.add.collider(this.player, new_tile)

        //         //Lo hago invisible así solo se ve el muro, pero la colision es con el new_tile
        //         new_tile.visible = false
        //     }
        // })
        // this.physics.add.collider(this.player, wallsLayer)
        // this.physics.add.collider(this.player, this.wallGroup)
        // this.setCollisionByProperty({ colides: true })
        // wallsLayer.setCollisionByProperty({ colides: true })

        this.physics.add.overlap(this.playerCollider, this.wallGroup,function (player,walls) {
            if(walls.y < player.y){
                that.player.setDepth(21);
            } else {
                that.player.setDepth(19);
            }

        });
        
        wallsLayer.setDepth(20)
        let rt = this.add.renderTexture(0, 0, 5000, 5000);
        rt.depth = 5
        window.rt = rt
        rt.fill(0x000000);

        console.log(this.map.objects[1].objects[2].x);
        console.log(this.map.objects[0]);
        var end = this.physics.add.staticGroup();
        // var endSpawn = this.map.objects[0].objects.filter(this.endFilter);
        var endTile = end.create(this.map.objects[1].objects[1].x+18,this.map.objects[1].objects[1].y+20)
        if (this.type=='helper') {
            endTile.body.setSize(70,80)
        } else {
            endTile.body.setSize(70,60)
        }
        endTile.visible = false


        this.physics.add.overlap(endTile, this.playerCollider, () => {
            // that.events.emit("end");
            console.log("fin de partida")
            if (this.type=='challenge') {
                socket.emit('passwordPuzzleComplete');
            }
            this.player.stop()
            this.player.body.stop();
            this.player.body.setVelocity(0, 0);
            this.win = true
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
        window.spotlight = this.spotlight
        window.mask = mask

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
                    this.door.setDepth(25)
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
        if (tile?.index == 886 && !this.touch) {
            this.touch = true
            this.player.stop()
            this.player.scale = 1
            console.log("toco el voidddd");
             this.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    this.time.removeEvent(this.fallingAnimation)
                    // this.fallingAnimation.remove()
                    // this.player.update()
                    this.player.x = this.map.objects[1].objects[2].x
                    this.player.y = this.map.objects[1].objects[2].y
                    this.player.rotation = 0
                    this.player.scale = 1
                    this.touch = false
                    console.log("vuelve el personaje");
                },
                loop: false
            })

            this.fallingAnimation = this.time.addEvent({
                delay: 50,
                callback: ()=>{
                    if (this.player.scale > 0 && (this.player.scale-0.1) > 0) {
                        this.player.scale -= 0.05
                    }

                    this.player.rotation+=0.3
                },
                loop: true
            })
        } else if(this.type=='helper'){
            this.spotlight.x = this.player.x;
            this.spotlight.y = this.player.y;
        } else if(!this.win && !this.touch){
            this.player.update()
        }
    }

    rotateCam(){
        var randNum = Math.floor(Math.random() * (4 - 1 + 1) + 1);
        console.log(randNum);
        if (randNum == 3) {
            this.cam._rotation -= 11;
        }
    }
}   