class EndGameScene extends Phaser.Scene{
    constructor() {
        super("EndGameScene")
        this.gameTime;
    }

    init (data) {
        console.log('init', data);
        this.nChallanges = data.nChallenges;
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        this.gameTime = this.game.scene.getScene('time').getTime();

        console.log(this.gameTime);
        console.log(this.nChallanges);
        let score = this.getServerScore(this.gameTime, this.nChallanges);
        let timeText = this.add.text(width / 2, height / 3, `Time: ${this.gameTime}`,{ fontSize: 24 });
        let scoreText = this.add.text(width / 2, height / 2, `Score: ${this.score}`,{ fontSize: 24 });
    
        timeText.setOrigin(0.5, 0.5);
        scoreText.setOrigin(0.5, 0.5);
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