var config = {
  type: Phaser.AUTO, // Which renderer to use
  width: window.innerWidth, // Canvas width in pixels
  height: window.innerHeight, // Canvas height in pixels
  parent: "game2",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    },
  },
  //scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, SeePass, Time, Ui, Prueba, PasswordMGScene]
  scene: [Titlescreen, Game, Pause_scene, Time, Ui, EndGameScene, HelpDialog]

};

class PhaserGame extends Phaser.Game {
  constructor(config) {
      super(config)
      socket.on("getSpawns", (spawns) => {
        //Comprobar que los cofres de la escena se han creado
        if (this.scene.getScene("game").chest=="") {
          this.scene.getScene("game").objectsForGuest = spawns
        } else if(this.scene.getScene("game").chest!=""){
          this.scene.getScene("game").placeItems(spawns)
        }
      })
  }
}

var game = new PhaserGame(config);