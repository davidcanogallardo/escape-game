var map;
var layer;

function preload() {
    game.load.tilemap('map', 'assets/tilemaps/mapa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilesets/TSMapa/PNG/tileset.png');  
}



function create() {
    map = game.add.tilemap('map1');  // 
    map.addTilesetImage('tileset', 'tiles');  // set tileset name
    layer = map.createLayer('ground');  // set layer name
    layer.resizeWorld();
  }

var config = {
    type: Phaser.AUTO,
    width: 750,
    height: 500,
    parent: 'game',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);