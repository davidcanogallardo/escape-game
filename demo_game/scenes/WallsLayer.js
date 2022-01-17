class WallsLayer extends Phaser.Tilemaps.TilemapLayer {
    constructor(scene) {
        // var that = scene;
        super(scene, scene.map, 1, scene.tileset)
        scene.add.existing(this)
        this.setDepth(5)

        let players = scene.playersGroup.getChildren();


        this.wallGroup = scene.physics.add.staticGroup();

        this.forEachTile(tile => {
            if (tile.properties.wall) {
                //Quito la propiedad de colisión del tile
                tile.properties.colides = false
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                //Creo el nuevo tile
                const new_tile = this.wallGroup.create(x,y);
                scene.physics.world.enableBody(new_tile);
                //Le pongo tamaño y lo posiciono (setOffset)
                new_tile.body.setSize(tile.width, tile.height*0.1).setOffset(tile.width-7,tile.height+5)
                //Añado la colisión al nuevo tile
                scene.physics.add.collider(scene.playersGroup, new_tile)

                //Lo hago invisible así solo se ve el muro, pero la colision es con el new_tile
                new_tile.visible = false
            }
        })

        scene.physics.add.collider(scene.playersGroup, this)
        this.setCollisionByProperty({ colides: true })

        players.forEach(player => {
            scene.physics.add.overlap(player, this.wallGroup, function (player,walls) {
                if(walls.y < player.y){
                    scene.player.setDepth(10);
                } else {
                    scene.player.setDepth(0);
                }
    
            });
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
}