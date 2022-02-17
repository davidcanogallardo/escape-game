class GenericMiniGame extends Phaser.Scene{
    constructor(name){
        super(name);
        this.buttonActive;
        this.stickButtonActive;
        this.stickActive;
        this.stickSpeeds;
        this.stickDirection;
    }

    activeButton(){
        this.buttonActive = true;
    }

    activeJoystickButton(){
        this.stickButtonActive = true;
    }

    moveStick(data = null, stickDirection){
        this.stickActive = true;
        this.stickSpeeds = data;
        this.stickDirection = stickDirection;
    }
}