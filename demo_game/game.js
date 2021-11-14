const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 320, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "game-container", // ID of the DOM element to add the canvas to
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
game = new Phaser.Game(config);
  
function preload() {
  this.load.image("tiles", "assets/tilesets/TSMapa/PNG/tileset.png");
  this.load.tilemapTiledJSON("map", "assets/tilemaps/mapa.json");
  this.load.atlas("player", "assets/character/player.png" , "assets/character/player.json");
}
  
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  map = this.make.tilemap({ key: "map" });
  tileset = map.addTilesetImage('dungeon', 'tiles');
  map.createStaticLayer('ground', tileset);
  map.createStaticLayer('walls', tileset);
  player = this.add.sprite(100,230, "player", "walk-down-3.png");

  this.anims.create({
    key: 'player-idle-down',
    frames: [{ key: 'player', frame: 'walk-down-3.png' }]
  })

  this.anims.create({
    key: 'player-idle-up',
    frames: [{ key: 'player', frame: 'walk-up-3.png' }]
  })

  this.anims.create({
    key: 'player-idle-side',
    frames: [{ key: 'player', frame: 'walk-side-3.png' }]
  })

  this.anims.create({
    key: 'player-run-down',
    frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  this.anims.create({
    key: 'player-run-up',
    frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })

  this.anims.create({
    key: 'player-run-side',
    frames: this.anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
    repeat: -1,
    frameRate: 15
  })
}

function update(){
  speed = 100

  if (cursors.left?.isDown){
    this.anims.play('player-run-side', true)
    this.setVelocity(-speed, 0)

  }
  else if (cursors.right?.isDown){
    this.anims.play('player-run-side', true)
    this.setVelocity(speed, 0)

  }
  else if (cursors.up?.isDown){
    this.anims.play('player-run-up', true)
    this.setVelocity(0, -speed)
  }
  else if (cursors.down?.isDown){
    this.anims.play('player-run-down', true)
    this.setVelocity(0, speed)
  }
}