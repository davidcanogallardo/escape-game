var config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 320, // Canvas width in pixels
  height: 320, // Canvas height in pixels
  parent: "game2",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: true
    },
  },zoom: 2.5,
  //scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, SeePass, Time, Ui, Prueba, PasswordMGScene]
  scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, Time, Ui, Prueba]

};

class PhaserGame extends Phaser.Game {
  constructor(config) {
      super(config)
  }
}

var game = new PhaserGame(config);