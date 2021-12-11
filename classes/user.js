class User {
    constructor(username, friendsList, notifications, completedLevels, favMap, numTrophies) {
        this.username = username
        this.friendsList = friendsList
        this.notifications = notifications
        this.completedLevels = completedLevels
        this.favMap = favMap
        this.numTrophies = numTrophies
    }

    getUser() {
        return this.username
    }
}

