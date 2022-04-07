// import { app } from '../../src/vue/App.js'
// import env from "../../env.js"

class EndGameScene extends Phaser.Scene{
    constructor() {
        super("EndGameScene")
        this.gameTime;
    }

    init (data) {
        this.data = data
        this.nChallanges = data.nChallenges;
    }
    
    create(){
        console.log('ewe', this.data);
        console.log('owo', app);
        let { width, height } = this.sys.game.canvas;
        this.gameTime = this.game.scene.getScene('time').getTime();
        // console.warn(this.game.scene.getScene('game'));
        // console.log(this.gameTime);
        // console.log(this.nChallanges);
        this.getServerScore(this.gameTime, this.nChallanges);
        this.end(this.data)
        let timeText = this.add.text(width / 2, height / 3, `Time: ${this.gameTime}`,{ fontSize: 24 });
        let scoreText = this.add.text(width / 2, height / 2, `Score: ${this.score}`,{ fontSize: 24 });
        let exitText = this.add.text(width / 2, height / 1.5, 'Press space to exit.', {fontSize: 24});

        exitText.setOrigin(0.5,0.5);
        timeText.setOrigin(0.5, 0.5);
        scoreText.setOrigin(0.5, 0.5);
        game.scene.getScene("time").scene.stop();
        this.input.keyboard.on('keydown-SPACE',()=>{
            //console.log("Space pressed");
            app.currentPage="home";
            game.scene.getScene('EndGameScene').scene.stop();
        });
    }

    // TODO
    getServerScore(time, nChallanges){
        $.ajax({
            async: false,
            type: "GET",
            url: `${apiUrl}/api/getScore/${time}/${nChallanges}`
        }).done((data) => {
            console.log(data);
            this.score = data; 
        }).fail((err) => {
            console.log(err);
        })
    }

    end(data) {
        if (data.player.username != "guest") {
            app.addGame(data.map.id, this.gameTime)
        } 

        // obtener el nombre de usuario del compañero
        if (data.players[0].username == data.player.username) {
            this.partner = data.players[1]
        } else {
            this.partner = data.players[0]

        }

        if (data.players[0].username != "guest" && data.players[1].username != "guest" && data.player.initiator) {
            console.log("soy initiator", "sí, lo soy");

            console.log("yo",data.player.username);
            console.log("compa", this.partner.username);
            console.log("mapa",data.map);
            app.updateHistory(this.partner.username, data.map.id, this.score)
        }
    }
}