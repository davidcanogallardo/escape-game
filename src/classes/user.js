class User {
    constructor(username, friendsList, notifications, completedLevels, favMap, numTrophies, profileImg, language) {
        this.username = username
        this.friendsList = friendsList
        this.notifications = notifications
        this.completedLevels = completedLevels
        this.favMap = favMap
        this.numTrophies = numTrophies
        this.profileImg = profileImg
        this.language = language
    }

    getUser() {
        return this.username
    }
}

