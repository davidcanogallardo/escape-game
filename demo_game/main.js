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
  },
  zoom: 2.5,
  //scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, SeePass, Time, Ui, Prueba, PasswordMGScene]
  scene: [Titlescreen, Game, GameOver, PasswordScene, Pause_scene, EnterPasswordScene, Time, Ui]

};

class PhaserGame extends Phaser.Game {
  constructor(config) {
      super(config)
      this.spawns = null;

      console.log("constructor game")
      socket.on("getSpawns", (spawns) => {
        console.log("main: ")
        console.log(spawns)
        this.spawns = spawns;
        console.log(this.scene.getScene("game").activeScene)
        if (this.scene.getScene("game").activeScene) {
          this.scene.getScene("game").placeItems(spawns)
        }
      })
  }
}

var game = new PhaserGame(config);