class EndGameScene extends Phaser.Scene{
    constructor() {
        super("EndGameScene")
    }

    init (data) {
        this.data = data
        this.nChallanges = data.nChallenges;
        this.player = data.players.player
        this.partner = data.players.partner   
        this.gameTime = data.time
        this.mapId = data.map.id
    }
    
    create() {
        let { width, height } = this.sys.game.canvas;
        
        this.getServerScore(this.gameTime, this.nChallanges);

        this.updatePlayersHistory()
        console.log(window);
        console.log(window.i18n);
        console.log(window.i18n.t("play"));
        // ****************************************************************************************
        let timeText = this.add.text(width / 2, height / 3, window.i18n.t("game.time")+`: ${this.gameTime}`,{ fontSize: 24, fontFamily: 'sans' });
        let scoreText = this.add.text(width / 2, height / 2, window.i18n.t("game.score")+`: ${this.score}`,{ fontSize: 24, fontFamily: 'sans' });
        let exitText = this.add.text(width / 2, height / 1.5, window.i18n.t("game.quit"), {fontSize: 24, fontFamily: 'sans'});
        
        exitText.setOrigin(0.5,0.5);
        timeText.setOrigin(0.5, 0.5);
        scoreText.setOrigin(0.5, 0.5);
        game.scene.getScene("time").scene.stop();
        this.input.keyboard.on('keydown-X',()=>{
            //console.log("Space pressed");
            app.currentPage="home";
            game.scene.getScene('EndGameScene').scene.stop();
            location.reload()
        });
        // ****************************************************************************************
    }

    // TODO hacer la peticion en App.js
    // si se hace en App.js tiene que devolver la score de alguna manera
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

    // TODO aqui se actualiza la partidas jugadas si el jugador no es guest (con addGame, para el ranking)
    // y con updateHistory se actualiza el historial para ambos jugadores si ninguno es guest, el problema 
    // es que no sé qué nombre ponerle a la función
    updatePlayersHistory() {
        if (this.player.username != "guest") {
            app.addGame(this.mapId, this.gameTime)
        } 
        console.log(this);
        
        if (this.player.username != "guest" && this.partner.username != "guest"  && this.player.initiator) {
            app.updateHistory(this.partner.username, this.mapId, this.score)
            
        }
    }
}