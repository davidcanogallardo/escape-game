const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 800, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "game-container", // ID of the DOM element to add the canvas to
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image("tiles", "assets/tilesets/TSMapa/PNG/tileset.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/mapa.json");
  }
  
  function create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    const ground = map.createLayer("ground", tileset, 0, 0);
    const walls = map.createLayer("walls", tileset, 0, 0);
    const camera = this.cameras.main;
  }

  function update(time, delta) {
    controls.update(delta);
  }