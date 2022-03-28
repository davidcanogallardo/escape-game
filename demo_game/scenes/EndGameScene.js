class EndGameScene extends Phaser.Scene{
    constructor() {
        super("EndGameScene")
        this.gameTime;
    }

    init (data) {
        //console.log('init', data);
        this.nChallanges = data.nChallenges;
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        this.gameTime = this.game.scene.getScene('time').getTime();
        // console.warn(this.game.scene.getScene('game'));
        // console.log(this.gameTime);
        // console.log(this.nChallanges);
        this.getServerScore(this.gameTime, this.nChallanges);
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

    getServerScore(time, nChallanges){
        $.ajax({
            async: false,
            type: "GET",
            url: `http://localhost:1111/api/getScore/${time}/${nChallanges}`
        }).done((data) => {
            console.log(data);
            this.score = data; 
        }).fail((err) => {
            console.log(err);
        })
    }
}