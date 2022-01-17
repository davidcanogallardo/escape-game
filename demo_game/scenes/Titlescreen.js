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
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
        title.setOrigin(0.5, 0.5)
    
        this.add.text(width / 2, height / 2+50, 'Presiona espacio para empezar', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
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

    setPlayers(players){
        let playersArray = [];
        players.forEach(element => {
            this.player = new Player(this, element.id, element.x, element.y, "player");
            playersArray.push(this.player);
        });
        this.scene.start("game", playersArray)
        //setTimeout(, 3000);
    }
}
