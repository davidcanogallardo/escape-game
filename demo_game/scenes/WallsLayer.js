class WallsLayer extends Phaser.Tilemaps.TilemapLayer {
    constructor(scene) {
        // var that = scene;
        super(scene, scene.map, 1, scene.tileset)
        scene.add.existing(this)
        this.scene = scene;
        this.setDepth(5)

        let players = scene.playersGroup.getChildren();
        console.log(players);


        //this.wallGroup = scene.physics.add.staticGroup();
        scene.wallGroup = scene.physics.add.staticGroup();

        this.forEachTile(tile => {
            if (tile.properties.wall) {
                //Quito la propiedad de colisión del tile
                tile.properties.colides = false
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                //Creo el nuevo tile
                const new_tile = scene.wallGroup.create(x,y);
                scene.physics.world.enableBody(new_tile);
                //Le pongo tamaño y lo posiciono (setOffset)
                new_tile.body.setSize(tile.width, tile.height*0.1).setOffset(tile.width-7,tile.height+5)
                //Añado la colisión al nuevo tile
                
                //scene.physics.add.collider(scene.playersGroup, new_tile, this.playerDepth.bind(this))
                scene.physics.add.collider(scene.playersGroup, new_tile)

                //Lo hago invisible así solo se ve el muro, pero la colision es con el new_tile
                new_tile.visible = false
            }
        })
        scene.physics.add.existing(scene.wallGroup )

        scene.physics.add.collider(scene.playersGroup, this)
        this.setCollisionByProperty({ colides: true })

        // players.forEach(player => {
        //     console.log(player);
        //     console.log(scene);
        //     console.log(scene.wallGroup);
        //     scene.wallCollider = scene.physics.add.overlap(player, scene.wallGroup, this.playerDepth)
        // });

        scene.physics.add.overlap(scene.playersGroup, scene.wallGroup, (player, wall) => {
            console.log(player);
            console.log(wall);
        });

        // scene.physics.add.overlap(scene.player.playerCollider, this.wallGroup, function (player,walls) {
        //     if(walls.y < player.y){
        //         scene.player.setDepth(10);
        //     } else {
        //         scene.player.setDepth(0);
        //     }

        // });
    }

    update() {

    }
    playerDepth(player,walls) {
        console.log("Player touching wall");
        console.log(player);
        if(walls.y < player.y){
            console.log("primer if");
            this.scene.player.setDepth(10);
            console.log(this.scene.player);
        } else {
            console.log("Segundo if");
            this.scene.player.setDepth(0);
        }

    }
}