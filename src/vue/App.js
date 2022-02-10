import { i18n } from "../languages/language.js";
import { getSessionUser } from "../js/utils.js"
import { connect, disconnect } from "../js/chat-client.js";
import Peer from '../../node_modules/simple-peer-light/simplepeer.min.js'

var peer = undefined;
var peerClient = undefined;
var guestPeer = undefined;
var guestPeerClient = undefined;
socket.on("matchFound", data => {
    startPeerStream(startClientPeer, data)
});

function startClientPeer(data) {
    data.forEach((player) => {
        if (socket.id == player.id && player.initiator) {
            peer = new Peer({
                initiator: true,
                trickle: false,
                stream: window.stream
            });
            peerClient = new PeerClient(peer, true, socket)
            peerClient.connection();
        } else {
            guestPeer = new Peer({
                initiator: false,
                trickle: false,
                stream: window.stream
            })
            guestPeerClient = new PeerClient(guestPeer, false, socket)
            guestPeerClient.connection();
        }
    });

    socket.on("getGuestID", (guestID) => {
        peerClient.peer.signal(guestID);
    })

    socket.on("sendHostID", (hostID) => {
        guestPeerClient.peer.signal(hostID);
    })

    

    var titleScreen = game.scene.getScene("titlescreen");
    titleScreen.setPlayers(data);
}

console.log("Prueba");
socket.on("windowGame", (data) => {
    console.log("cambiar al juego");
    console.log(app.currentPage);
    app.currentPage = "game";
});

let excludedPages = [
    "home",
    "game",
    "login",
    "password-recover",
    "settings",
    "sound-settings",
    "connect-controller",
    "test-controller",
    "change-language",
    "waiting-room"
]

let _url = "./src/backend/petitions.php";

var app = new Vue({
    i18n,
    el: '#app',
    data: {
        currentPage: "home",
        menuOpen: "none",
        user: getSessionUser(),
        profileInfo: null,
        modalOpen: "none",
        rankingData: null,
        friendChat: null,
        lastMessage: null,
        mainMicId: null,
        messages: {},
        messagesunread: false,
        peopleUnread: [],
        notificationunsread: false
    },
    watch: {
        currentPage: function (newPage, oldPage) {
            if (!sessionStorage.getItem("session") && !excludedPages.includes(newPage)) {
                console.log("no hay sesión");
                this.currentPage = "login-warning"
            } else {
                console.log("hay sesión " + newPage);
                if (newPage == "waiting-room") {
                    if (!this.mainMicId) {
                        this.mainMicId = window.mic[0].id
                    }
                }
            }
            this.menuOpen = "none"
        },
        menuOpen: function () {
            if (!sessionStorage.getItem("session")) {
                console.log("no hay sesión");
                this.currentPage = "login-warning"
            } else {
                this.modalOpen = "none";
                console.log("hay sesión");
            }
        },
        mainMicId: function (n, o) {
            mic = n;
        }
    },
    mounted() {
        this._i18n.locale = this.user.language;
        this.$nextTick(() => {
            if (this.user) {
                connect()
            }
          });
    },
    methods: {
        loginPetition(form_data) {
            $.ajax({
                data: {
                    "petition": "login",
                    "params": {
                        "user": form_data.username,
                        "password": form_data.password
                    }
                },
                type: "POST",
                dataType: "json",
                url: _url,
            })
                .done((data, textStatus, jqXHR) => {
                    if (console && console.log) {
                        console.log("La solicitud se ha completado correctamente.");
                        console.log(data);
                        // login(data)
                        if (data.success) {
                            let user = new User(
                                data.userData.username,
                                data.userData.friendsList,
                                data.userData.notifications,
                                data.userData.completedLevels,
                                data.userData.favMap,
                                data.userData.numTrophies,
                                data.userData.profileImg
                            )
                            sessionStorage.setItem("session", JSON.stringify(user))
                            this.$root.currentPage = "home"
                            this.$root.user = user
                            connect()
                        } else {
                            console.log(data.message);
                        }
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                    }
                });
        },
        signupPetition(form_data) {
            console.log(form_data);
            $.ajax({
                data: {
                    "petition": "register",
                    "params": {
                        "email": form_data.email,
                        "user": form_data.username,
                        "password": form_data.password
                    }
                },
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                url: _url,
            })
                .done((data) => {
                    console.log(data);
                    if (data.success) {
                        let user = new User(
                            data.userData.username,
                            data.userData.friendsList,
                            data.userData.notifications,
                            data.userData.completedLevels,
                            data.userData.favMap,
                            data.userData.numTrophies,
                            data.userData.profileImg
                        )
                        sessionStorage.setItem("session", JSON.stringify(user))
                        this.$root.currentPage = "home"
                        this.$root.user = user
                    } else {
                        console.log(data.message);
                    }
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                        console.log(XMLHttpRequest);
                        console.log(errorThrown);
                    }
                });
        },
        recoverPassword(mail) {
            $.ajax({
                data: {
                    "petition": "recover",
                    "params": {
                        "mail": mail
                    }
                },
                type: "POST",
                dataType: "json",
                url: _url,
            })
                .done(function (data) {
                    console.log(data);
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                    }
                });
        },
        sendFriendRequest(friend) {
            $.ajax({
                data: {
                    "petition": "send_request",
                    "params": {
                        "user": app.user.username,
                        "friend": friend
                    }
                },
                type: "PUT",
                dataType: "json",
                url: _url,
            })
                .done(data => {
                    console.log(data);
                    if (data.success) {
                        console.log(data.params);
                        // showNotification("Petición de amistad enviada a "+friend, "#49EE63")
                        this.$root.user.notifications.push(friend)
                        this.notificationunsread = true
                        sessionStorage.setItem("session", JSON.stringify(this.$root.user))
                    }
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                        console.log(textStatus);
                    }
                });
        },
        getFriendData(friendName) {
            $.ajax({
                data: {
                    "petition": "friendData",
                    "params": {
                        "friendUser": friendName
                    }
                },
                type: "POST",
                dataType: "json",
                url: _url,
            })
                .done(data => {
                    console.log(data);
                    if (data.success) {
                        console.log("el usuario existe");
                    } else {
                        console.log("el usuario no existe");
                    }
                    var newProfile = {
                        username: data.userData.usuario,
                        favMap: data.userData.favMap,
                        numTrophies: data.userData.numCopas,
                        profileImg: data.userData.profileImg
                    }
                    this.$root.profileInfo = newProfile
                    this.$root.currentPage = "friend"
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                    }
                });
        },
        closeSession(username) {
            $.ajax({
                data: {
                    "petition": "close-sesion",
                    "params": {
                        "user": username,
                    }
                },
                type: "POST",
                dataType: "json",
                url: _url,
            })
                .done(data => {
                    console.log("sesion cerrada");
                    console.log(data);
                    if (data.success) {
                        this.$root.user = null
                        sessionStorage.clear()
                        this.$root.currentPage = "home"
                        disconnect()
                    }
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                        console.log(textStatus);
                    }
                });
        },
        friendRequest(username, friend, accept) {
            $.ajax({
                data: {
                    "petition": "friend-request",
                    "params": {
                        "user": username,
                        "friend": friend,
                        "accept": accept
                    }
                },
                type: "PUT",
                dataType: "json",
                url: _url,
            })
                .done((data) => {
                    console.log(data);
                    if (data.success) {
                        if (accept) {
                            this.$root.user.friendsList.push(friend)

                        }
                        var index = this.$root.user.notifications.indexOf(friend);
                        if (index !== -1) {
                            this.$root.user.notifications.splice(index, 1);
                        }
                        sessionStorage.setItem("session", JSON.stringify(this.$root.user))
                    }
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                        console.log(textStatus);
                    }
                });
        },
        getRankingData() {
            $.ajax({
                data: { "petition": "ranking" },
                type: "POST",
                dataType: "json",
                url: _url,
            })
                .done(data => {
                    console.log(data);
                    this.$root.rankingData = data;
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                    }
                });
        },
        updateRanking(data) {
            $.ajax({
                data: {
                    "petition": "ranking",
                    "params": {
                        // "players" : [ "david", "adnan" ],
                        "players": data.players,
                        // "time" : "00:12:13",
                        "time": data.time,
                        // "level" : "summonerRift"
                        "level": data.level
                    }
                },
                type: "PUT",
                dataType: "json",
                url: _url,
            })
                .done(function (data) {
                    console.log(data);
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("La solicitud ha fallado: " + textStatus);
                        console.log(textStatus);
                    }
                });
        },
        updateUser(user) {
            $.ajax({
                data: {
                    "petition": "updateUser",
                    "params": {
                        "user": user,
                    }
                },
                type: "PUT",
                dataType: "json",
                url: _url,
            })
                .done(data => {
                    if (data.success) {
                        console.log("Cambios en usuario aplicados");
                        console.log(data);
                        this.user = user
                        sessionStorage.setItem("session", JSON.stringify(this.$root.user))
                    }
                })
                .fail(function (textStatus) {
                    if (console && console.log) {
                        console.log("No se han actualizado los cambios");
                        console.log(textStatus);
                    }
                });
        }
    },

})
var that = this
export { app } 