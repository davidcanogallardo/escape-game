class User {
    constructor(username, friendsList, notifications, completedLevels, favMap, numTrophies) {
        this.username = username
        this.friendsList = friendsList
        this.notifications = notifications
        this.completedLevels = completedLevels
        this.favMap = favMap
        this.numTrophies = numTrophies
    }

    createFriendList() {
        $(".slide-list-container .slide-list > *").remove()

        this.friendsList.forEach(name => {
            this.addFriend(name)
        });
    } 

    createProfile() {
        $("#profile-name").text(this.username)
        $("#invite-name").text(this.username)
        $("#fav-map").text(this.favMap)
        $("#total-trophys").text(this.numTrophies)
        
        $(".niveles > *").remove()
        Object.entries(this.completedLevels).forEach((level) => {
            if (level[1].trophies.bronze) {
                var bronzeClass = "bronze"
            } else {
                bronzeClass = "white"
            }
            if (level[1].trophies.silver) {
                var silverClass = "silver"
            } else {
                silverClass = "white"
            }
            if (level[1].trophies.gold) {
                var goldClass = "gold"
            } else {
                goldClass = "white"
            }
            
            var newLevel = ` 
                <div class="nivel">
                    <img src="https://www.gametopia.es/learning/2017/img/blog/18-06/og-como-disenar-nivel-videojuego.png" alt="miniatura del nivel">
                    <p class="texto">`+level[0]+`</p>
                    <p class="texto">`+level[1].time+`</p>
                    <div class="trophys-container">
                        <i class="fas fa-trophy `+ bronzeClass +`"></i>
                        <i class="fas fa-trophy `+ silverClass +`"></i>
                        <i class="fas fa-trophy `+ goldClass +`"></i>
                    </div>
                </div>
            `
            $(".niveles").append(newLevel)
                    
        })
    }

    createNotifications() {
        $(".notification-container .slide-list > *").remove()

        this.notifications.forEach(name => {
            this.addNotification(name)
        });
    }

    addFriend(name) {
        // if (!(this.friendsList.includes(name))) {
            this.friendsList.push(name)
            let newFriend = 
            `
            <div title="Ver perfil" class="list-item friend-profile-link" page="friend-profile-page" name="`+name+`" >
                <div class="icon-container pr-btn" name="`+name+`">
                    <i class="fas fa-user" aria-hidden="true" name="`+name+`"></i>
                </div>
                <span name="`+name+`">`+name+`</span>
                <div title="Enviar invitación a una partida" class="icon-container add-btn send-invitation" onclick="return false">
                    <i class="fas fa-user-plus" aria-hidden="true"></i>
                </div>
            </div>
            `
            $(".slide-list-container .slide-list").append(newFriend)
            
        // }
    }

    addNotification(name) {
        let newRequest = `                
        <div class="list-item">
            <div class="icon-container pr-btn" >
                <i class="fas fa-user" aria-hidden="true"></i>
            </div>
            <span >`+name+`</span>
            <div class="btn accept">
                <i class="fas fa-check" aria-hidden="true"></i>
            </div>
            <div class="btn cancel">
                <i class="fas fa-times" aria-hidden="true"></i>
            </div>
        </div> 
        `
        $(".notification-container .slide-list").append(newRequest)
    }

    removeFriend(name) {
        if (this.friendsList.includes(name)) {
            this.friendsList.pop(name)
        }
    }
}

