var config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 320, // Canvas width in pixels
  height: 320, // Canvas height in pixels
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

game = new Phaser.Game(config);

function preload() {
  cursors = this.input.keyboard.createCursorKeys();
  this.load.image("tiles", "assets/tilesets/TSMapa/PNG/tileset.png");
  this.load.tilemapTiledJSON("map", "assets/tilemaps/mapa.json");
  this.load.atlas('player', 'assets/character/player.png', 'assets/character/player.json');
  this.load.atlas('chest', 'assets/objects/chest.png', 'assets/objects/chest.json');
}
//map.getLayer("walls").data[5][5].properties?.horitzontalWall
function create() {
  map = this.make.tilemap({
    key: "map"
  });
  tileset = map.addTilesetImage('dungeon', 'tiles');
  groundLayer = map.createStaticLayer('ground', tileset);
  itemLayer = map.createStaticLayer('items', tileset);
  wallsLayer = map.createStaticLayer('walls', tileset);
  wallsLayer.setCollisionByProperty({ colides: true })

  player = this.physics.add.sprite(100, 250, 'player','walk-down-3.png' );
  player.body.setSize(player.width*0.5, player.height * 0.3).setOffset(8,20)

  this.physics.add.collider(player, wallsLayer)
  
  wallsLayer.debug = true;
  //chest
  chest = this.add.sprite(56,252,'chest','chest_empty_open_anim_f0.png');
  this.physics.add.existing(chest)
  
  this.physics.add.overlap(player, chest, () => {endGame(1)})
  
 //animaciones del personaje
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

function update() {

  speed = 200

  leftDown = cursors.left?.isDown
  rightDown = cursors.right?.isDown
  upDown = cursors.up?.isDown
  downDown = cursors.down?.isDown
  
  // Aqui indicamos las animaciones del personaje al pulsar cada boton
  if (leftDown) {

    this.anims.play('walk-side-3', true)
    player.setVelocity(-speed, 0)

  } else if (rightDown) {

    this.anims.play('walk-side-3', true)
    player.setVelocity(speed, 0)

  } else if (upDown) {

    this.anims.play('walk-side-3', true)
    player.setVelocity(0, -speed)

  } else if (downDown) {

    this.anims.play('walk-side-3', true)
    player.setVelocity(0, speed)

  } else
  {
    this.anims.play('walk-side-3', true)
    player.setVelocity(0, 0)
  }


}

function endGame(time) {
  console.log("object");
  
  // while (i < wallsLayer.length) {
  //   let j = i
  //   while (j>0 && wallsLayer[j-1].position.y > children[j].position.y) {
  //     a = wallsLayer[j]
  //     b = wallsLayer[j - 1]

  //     wallsLayer[j] = b
  //     wallsLayer[j-1] = a  

  //     j = j-1
  //   }
  //   i += 1
  // }
}