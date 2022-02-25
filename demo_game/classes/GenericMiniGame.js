class GenericMiniGame extends Phaser.Scene{
    constructor(name,type,difficulty){
        super(name);

        //el tipo del minijuego solamente puede ser reto(challenge) o ayuda (helper)
        if (type == 'challenge' ||type == 'helper') {
            this.type = type;
        } else {
            console.log('El tipo del minijuego no es correcto');
        }
        
        //Dificultad del minijuego
        if (difficulty == 'easy' || difficulty == 'medium' || difficulty=='hard') {
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
}