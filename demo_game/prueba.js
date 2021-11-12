var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    //this.load.image("tiles", "./assets/tilesets/TSMapa/PNG/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/mapa.json");
  }
function create() {
    const map = this.make.tilemap({ key: "map" });
    // const tileset = map.addTilesetImage("tileset", "tiles");
    // const ground = map.createLayer("ground", tileset, 0, 0);
    // const walls = map.createLayer("walls", tileset, 0, 0);
    // const camera = this.cameras.main;
  }

function update ()
{
}