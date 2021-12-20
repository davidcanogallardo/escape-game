class User {
    constructor(username, friendsList, notifications, completedLevels, favMap, numTrophies, profileImg) {
        this.username = username
        this.friendsList = friendsList
        this.notifications = notifications
        this.completedLevels = completedLevels
        this.favMap = favMap
        this.numTrophies = numTrophies
        this.profileImg = profileImg
    }

    getUser() {
        return this.username
    }
}

