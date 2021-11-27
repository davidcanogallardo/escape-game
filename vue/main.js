Vue.component('mainn', {
    template: //html
    `             
    <div>   
        <div class="icon-container settings-btn-container main-icon settings-link link" page="settings-page">
            <i class="fas fa-cog"></i>
        </div>

        <div id="title">
            <span class="red-title">Escape</span>
            <span class="blue-title">Game</span>
        </div>

        <div id="game" onload=""></div>


        <div class="btn play">Jugar</div>

        <div class="right-menu">
            <div class="icon-container main-icon own-profile-link link" page="profile-page">
                <i class="fas fa-user"></i>
            </div>
            <div class="icon-container main-icon friends-list slide-link" page=".slide-list-container" v-on:click="$emit('change-page','friend')">
                <i class="fas fa-user-friends"></i>
            </div>
            <div class="icon-container main-icon notificacion-list slide-link" page=".notification-container" v-on:click="$emit('change-page','noti')">
                <i class="fas fa-bell"></i>
            </div>
            <div class="icon-container main-icon ranking-link link" page="ranking-page">
                <i class="fas fa-list-ol"></i>
            </div>
        </div>

        <div class="slide-menu"></div>
        
    <script type="application/javascript" defer>
    var config = {
        type: Phaser.AUTO,
        width: 700,
        height: 400,
        parent: 'game',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }

    function create ()
    {
        this.add.image(400, 300, 'sky');

        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
    </script>
    </div>
    `, 
 
})

