var config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 320, // Canvas width in pixels
  height: 320, // Canvas height in pixels
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: true
    },
  },zoom: 2.5,
  scene: [Titlescreen, Game, GameOver, Password_scene, Pause_scene]

};

var game = new Phaser.Game(config);