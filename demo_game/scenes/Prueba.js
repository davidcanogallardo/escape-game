class Prueba extends Phaser.Scene {
    constructor() {
        super("prueba")
    }
    //map.getLayer("walls").data[5][5].properties?.horitzontalWall
    preload() {
        var path = "./demo_game/"
        this.cursors = this.input.keyboard.createCursorKeys();
        this.load.image("tiles", path+"assets/tilesets/TSMapa/PNG/tileset.png");
        this.load.tilemapTiledJSON("map", path+"assets/tilemaps/mapa.json");
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
    }

    create() {
        this.map = this.make.tilemap({
            key: "map"
        });
        window.test = this.map
        
        var tileset = this.map.addTilesetImage('dungeon', 'tiles');
        var groundLayer = this.map.createStaticLayer('ground', tileset);
        var wallsLayer = this.map.createLayer('walls', tileset);
        let objectLayer = this.map.getObjectLayer('objects');
        wallsLayer.setDepth(2)
        this.player = new Player(this, this.cursors)
    }

    update() {
        this.player.update()
    }

}