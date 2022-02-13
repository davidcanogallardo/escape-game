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

  /*
  moveStick(velocidades){
    let data = "x:10,22;y:120,1";
    let x = data.split(';')[0];
    let y = data.split(';')[1];
    x = x.split(':')[1];
    y = y.split(':')[1];

    let speeds = {x: x,y: y};
    if(this.isGameActive()){
      let activeScene = this.scene.getScene('game');
      bluetoothConnection.setCallbackButtonA(this.moveStick(data));
      activeScene.moveStick(speeds);
    }
  } 

  pressStick(){
    if(this.isGameActive()){
      let activeScene = this.scene.getScene('game');
      bluetoothConnection.setCallbackButtonJoystick(this.pressStick());
      activeScene.pressStick();
    }
  }

  pressBtn(){
    if(this.isGameActive()){
      let activeScene = this.scene.getScene('game');
      bluetoothConnection.setCallbackJoystick(this.pressBtn());
      activeScene.pressBtn();
    }
  }

  isGameActive(){
    let activeScenes = this.scene.getScenes();
    console.log(activeScenes.includes("game"));
    return activeScenes.includes("game");
  }*/
}

var game = new PhaserGame(config);