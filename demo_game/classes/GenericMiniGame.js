class GenericMiniGame extends Phaser.Scene{
    constructor(name,type,difficulty){
        super(name);
        console.log("type: "+type);
        //el tipo del minijuego solamente puede ser reto(challenge) o ayuda (helper)
        if (type == 'challenge' || type == 'helper') {
            this.type = type;
        } else {
            console.log('El tipo del minijuego no es correcto');
        }

        //Dificultad del minijuego (easy=1, medium=2, hard=3)
        if (difficulty=="easy" || difficulty =="medium" || difficulty=="hard"){
            this.difficulty = difficulty;
        } else {
            console.log('La dificultad introducida no es correcta');
        }

        this.buttonActive;
        this.stickButtonActive;
        this.stickActive;
        this.stickSpeeds;
        this.stickDirection;
    }

    activeButton(){
        console.log("ActiveButton function");
        this.buttonActive = true;
    }

    activeJoystickButton(){
        console.log("activeJoysticButton function");
        this.stickButtonActive = true;
    }

    moveStick(speeds, stickDirection){
        console.log("moveStick function");
        this.stickActive = true;
        this.stickSpeeds = speeds;
        this.stickDirection = stickDirection;
    }

    getStickDirection(speeds){
        console.log("speeds kachow: "+speeds);
        let x = Math.abs(speeds.x);
        let y = Math.abs(speeds.y);

        if (x>y) {
            if (Math.sign(speeds.x)==1) {
                return 'right'
            } else {
                return 'left'
            }
        } else if(x<y){
            if (Math.sign(speeds.y)==1) {
                return 'down'
            } else {
                return 'up'
            }
        }else{
            if (speeds.x == 0 && speeds.y == 0) {
                return 'idle'
            }else{
                return 'diagonal'
            }
            
        }
    }
    getDiff(diff){
        switch (diff.toLowerCase()) {
            case 'easy':
                return 1
            case 'medium':
                return 2
            case 'hard':
                return 3
        }
    }
}