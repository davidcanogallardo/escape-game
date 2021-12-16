class Prueba extends Phaser.Scene {
    constructor() {
        super("prueba")
    }
    preload() {
        var path = "./demo_game/"
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/mapa.json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
    }

    create() {
        var that = this
        this.map = this.make.tilemap({
            key: "map"
        });
        
        this.tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', this.tileset);
        // groundLayer.setDepth(12)
        let objectLayer = this.map.getObjectLayer('objects');
        
        this.player = new Player(this)
        this.playerCollider = this.player.playerCollider
        
        this.wallsLayer = new WallsLayer(this)

        // this.physics.add.overlap(this.playerCollider, this.wallsLayer, function (player,walls) {
        //     if(walls.y < player.y){
        //         that.player.setDepth(10);
        //     } else {
        //         that.player.setDepth(0);
        //     }

        // });
        // window.pp = this.player
    }

    update() {
        this.player.update()
        this.wallsLayer.update()
    }

}