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
}