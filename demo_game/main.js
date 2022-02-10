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
  scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, SeePass, Time, Ui, Prueba]

};

class PhaserGame extends Phaser.Game {
  constructor(config) {
      super(config)
  }

  moveStick(){
    let data = "x:10,22;y:120,1";
    let x = data.split(';')[0];
    let y = data.split(';')[1];
    x = x.split(':')[1];
    y = y.split(':')[1];


    let speeds = {x: x,y: y};
    let activeScene = this.scene.getScene('game');
    activeScene.moveStick(speeds);
  } 

  pressStick(){
    let activeScene = this.scene.getScene('game');
    activeScene.pressStick();
  }

  pressBtn(){
    let activeScene = this.scene.getScene('game');
    activeScene.pressBtn();
  }
}
var game = new PhaserGame(config);
let bluetoothConnection = new BluetoothGamePadReciver(game.moveStick(), game.pressStick(), game.pressBtn());
