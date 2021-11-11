function preload(){
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/mapa.json');
    const tileset = map.addTilesetImage('tiles', 'assets/tilesets/TSMapa/PNG');
}

function create(){
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
}