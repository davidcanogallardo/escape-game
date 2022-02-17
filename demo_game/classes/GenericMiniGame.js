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