class Titlescreen extends Phaser.Scene {
    constructor() {
        super("titlescreen")
    }

    preload() {
        var path = "./demo_game/"
        this.load.atlas('player', path+'assets/character/player.png', path+'assets/character/player.json');
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        const title = this.add.text(width / 2, height / 2, 'La grieta del summoner', {
            fontSize: 27,
            fontFamily: 'sans'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona espacio para empezar', {
            fontFamily: 'sans'
        })
        .setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            // this.scene.start("prueba")
            
        })
    }

    //Comprobaciones para mas adelante
    /*update(){
        //Comprobar si se han añadido los objectos que tocan.
        console.log(this.playersGroup.getLength());
        if(this.playersGroup.getLength() == 2){
            console.log("Ou yea!!");
            console.log(this.playersGroup);
            this.scene.start("game", this.playersGroup)
            
            //this.player = false;
        }

    }*/

    setPlayers(data){
        //console.log(data);
        let players = data[0];
        let diff = data[0][0].diff;
        let map = data[1];

        this.scene.start("game",{ players: players, diff: diff, map: map});
    }
}
