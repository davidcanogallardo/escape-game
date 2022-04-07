import { i18n } from "../languages/language.js";
import { getSessionUser, showNotification } from "../js/utils.js";
import { connect, disconnect } from "../js/chat-client.js";
import Peer from "../../node_modules/simple-peer-light/simplepeer.min.js";

var peer = undefined;
var peerClient = undefined;
var guestPeer = undefined;
var guestPeerClient = undefined;
let audioTag;

socket.on("matchFound", (data) => {
  if (window.mic[0] == undefined) {
    window.stream = null  
    startClientPeer(data)  
  } else {
    startPeerStream(startClientPeer, data);
  }
});

function startClientPeer(data) {
  let players = data[0];
  players.forEach((player) => {
    if (socket.id == player.id && player.initiator) {
      peer = new Peer({
        initiator: true,
        trickle: false,
        stream: window.stream,
      });
      peerClient = new PeerClient(peer, true, socket);
      peerClient.connection();
      window.peer = peerClient;
    } else {
      guestPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: window.stream,
      });
      guestPeerClient = new PeerClient(guestPeer, false, socket);
      guestPeerClient.connection();
      window.guest = guestPeerClient;
    }
  });

  socket.once("getGuestID", (guestID) => {
    peerClient.peer.signal(guestID);
  });

  socket.once("sendHostID", (hostID) => {
    guestPeerClient.peer.signal(hostID);
  });

  audioTag = document.createElement("audio");
  audioTag.setAttribute("src", "");
  audioTag.setAttribute("id", "mic");
  document.body.appendChild(audioTag);

  socket.once("serverInitGame", () => {
    console.log("Termina El Peer");
    console.log(data);

    var titleScreen = game.scene.getScene("titlescreen");
    titleScreen.setPlayers(data);
    app.currentPage = "game";
  });
  
}

// socket.on("windowGame", (data) => {
//   app.currentPage = "game";
// });

socket.on("endGame", () => {
  document.getElementById("mic").remove();

  if(socket.id == guestPeerClient.name){
    guestPeerClient.peer.destroy();
    guestPeerClient = undefined;
  } else if (socket.id == peerClient.name){
    peerClient.peer.destroy();
    guestPeerClient.peer.destroy();
    peerClient = undefined;
    guestPeerClient = undefined;
  }
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
  "waiting-room",
  "select-solo-duo",
];

let _url = "http://127.0.0.1:1111";

var app = new Vue({
  i18n,
  el: "#app",
  data: {
    currentPage: "home",
    menuOpen: "none",
    chat: {
      currentOpenChat: null,
      chats: {},
      lastMessage: null,
      messagesunread: false,
      friendsUnread: []
    },
    user: getSessionUser(),
    profileInfo: null,
    modalOpen: "none",
    rankingData: null,
    mainMicId: "default",
    notificationunsread: false,
    token: null,
    bluetoothConnection: null,
    history: null,
  },
  watch: {
    currentPage: function (newPage, oldPage) {
      if (
        this.user == null &&
        !excludedPages.includes(newPage)
      ) {
        console.log("no hay sesión");
        this.currentPage = "login-warning";
      } else {
        if (newPage == "waiting-room") {
          if (!this.mainMicId) {
            this.mainMicId = window.mic[0].id;
          }
        }
      }
      this.menuOpen = "none";
    },
    menuOpen: function () {
      if (!sessionStorage.getItem("session")) {
        console.log("no hay sesión");
        this.currentPage = "login-warning";
      } else {
        this.modalOpen = "none";
        console.log("hay sesión");
      }
    },
    mainMicId: function (n, o) {
      mic = n;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.user) {
        console.log("set token");
        this.token = sessionStorage.getItem("token");
        window.token = sessionStorage.getItem("token");
        connect();
        window.setInterval(this.getNotificationList, 10000);
        window.setInterval(this.getFriendList, 10000);
      }
    });
  },
  methods: {
    saveUserInSession() {
      sessionStorage.setItem("session", JSON.stringify(this.user));
    },
    // ******************************* GET /api/user/friend-list *********************************************
    getFriendList() {
      // console.log("trato de actualizar lista amigos");
      if (this.user) {
        $.ajax({
          xhrFields: {
            withCredentials: true,
          },
          type: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          url: _url + "/api/user/friend-list",
        })
          .done((data) => {
            if (data.success) {
              // console.log(data);
              // data.data.query.forEach(friend => {
              //   friend.profile_photo = JSON.parse(friend.profile_photo)
              // })
              this.user.friendsList = data.data.query;
              this.saveUserInSession()
            
            } else {
              console.log(data);
              // TODO internacionalizacion
              showNotification(data.message, "red");
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            showNotification("Fallo servidor", "red");
        });
      }
    },
    // ******************************* GET /api/user/notification-list *********************************************
    getNotificationList() {
      // console.log("trato de actualizar peticiones");
      if (this.user) {
        $.ajax({
          xhrFields: {
            withCredentials: true,
          },
          type: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          url: _url + "/api/user/notification-list",
        })
          .done((data) => {
            if (data.success) {
              // console.log(data);
              // console.log(this.user.notifications);
              if (data.data.requests > this.user.notifications) {
                this.notificationunsread = true;
              }
              this.user.notifications = data.data.requests;
              this.saveUserInSession()
            
            } else {
              console.log(data);
              // TODO internacionalizacion
              showNotification(data.message, "red");
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            showNotification("Fallo servidor", "red");
        });
      }
    },
    // ******************************* POST /api/login *********************************************
    login(data) {
      $.ajax({
        data: {
          email: data.username,
          password: data.password,
        },
        type: "POST",
        url: _url + "/api/login",
      })
        .done((data, textStatus, jqXHR) => {
            if (data.success) {
              console.log('user', data.data);
              window.token = data.data.token;
              var userInfo = data.data;
              let user = new User(
                userInfo.name,
                userInfo.friendlist,
                userInfo.requests,
                [
                  {
                    name: "pisos Picodos",
                    time: "1:00:20",
                    trophies: { bronze: true, silver: true, gold: true },
                  },
                ],
                "summoners rift",
                12,
                // JSON.parse(userInfo.photo)
                userInfo.photo
              );
              this.saveUserInSession()
              sessionStorage.setItem("token", window.token);
              window.setTimeout(this.getNotificationList, 10000);
              window.setInterval(this.getFriendList, 10000);
              this.$root.currentPage = "home";
              this.$root.user = user;
              this.$root.token = data.data.token;
              connect();
            } else {
              console.log(data);
              // TODO internacionalizacion
              // showNotification("No has podido iniciar sesion", "red");
              showNotification(i18n.t(data.message), "red");
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            showNotification("Fallo servidor", "red");
        });
    },
    // ******************************* POST /api/register *********************************************
    signup(data) {
      $.ajax({
        data: {
          name: data.username,
          email: data.mail,
          password: data.password,
          confirm_password: data.password_confirm,
        },
        type: "POST",
        url: _url + "/api/register",
      })
        .done((data) => {
          if (data.success) {
            console.log("registrado");
            // TODO internacionalizacion
            showNotification(i18n.t(data.message), "green");
          } else {
            console.log(data);
            // TODO internacionalizacion
            // showNotification("No has podido iniciar sesion", "red");
            showNotification(i18n.t(data.message), "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* PUT /api/user/friend-request *********************************************
    sendFriendRequest(friend) {
      $.ajax({
        data: {
          addressee_name: friend,
        },
        xhrFields: {
          withCredentials: true,
        },
        type: "PUT",
        headers: {
          Authorization: "Bearer " + window.token,
        },
        url: _url + "/api/user/friend-request",
      })
        .done((data) => {
          console.log(data);
          if (data.success) {
            console.log("peticion de amistad enviada");
            console.log(data);
            // TODO internacionalizacion
            showNotification(i18n.t("solicitudesended") + friend,"green");
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* GET /api/user/userinfo/{id} *********************************************
    getUserInfo(friendName) {
      $.ajax({
        type: "GET",
        url: _url + '/api/user/userinfo/'+friendName,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .done((data) => {
          console.log(data.data.requests[0]);
          if (data.success) {
            console.log("el usuario existe");
          } else {
            console.log("el usuario no existe");
          }
          var newProfile = {
            username: data.data.requests[0].name,
            profileImg: JSON.parse(data.data.requests[0].profile_photo),
          };
          this.$root.profileInfo = newProfile;
          this.$root.currentPage = "friend";
        })
        .fail(function (textStatus) {
          if (console && console.log) {
            console.log("La solicitud ha fallado: " + textStatus);
          }
        });
    },
    closeSession(username) {
      this.$root.user = null;
      sessionStorage.clear();
      this.$root.currentPage = "home";
      disconnect();
    },
    //********************************************* PUT /api/user/handle-request/{friend}/{response} *********************************************
    handleFriendRequest(friend, response) {
      $.ajax({
        type: "PUT",
        url: _url + "/api/user/handle-request/" + friend.name + "/" + response,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .done((data) => {
          if (data.success) {
            if (response) {
              this.$root.user.friendsList.push(friend);
            }
            var index = this.$root.user.notifications.indexOf(friend);
            if (index !== -1) {
              this.$root.user.notifications.splice(index, 1);
            }
            this.saveUserInSession()
          } else {
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* GET /api/game/ranking *********************************************
    getRankingData() {
      $.ajax({
        type: "GET",
        url: _url + "/api/game/ranking",
      })
        .done((data) => {
          if (data.success) {
            this.$root.rankingData = data.data.ranking;
            console.log("RankingData");
            console.log(data);
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* PUT /user/game/{level}/{time} *********************************************
    addGame(levelId, time) {
      $.ajax({
        type: "PUT",
        dataType: "json",
        url: _url+ "/api/user/game/"+levelId+"/"+time,
        headers: {
          // 'X-CSRF-TOKEN': "",
          Authorization: "Bearer " + this.token,
        },
      })
        .done(function (data) {
          if (data.success) {
            console.log(data.message, data);
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* PUT /user/history/{partner}/{level}/{score} *********************************************
    updateHistory(partner, levelId, score) {
      $.ajax({
        type: "PUT",
        dataType: "json",
        url: _url+ "/api/user/history/"+partner+"/"+levelId+"/"+score,
        headers: {
          // 'X-CSRF-TOKEN': "",
          Authorization: "Bearer " + this.token,
        },
      })
        .done(function (data) {
          if (data.success) {
            console.log(data.message, data);
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* PUT /user/update/photo ********************************************
    updatePhoto(photo) {
      $.ajax({
        data: {
          photo: photo,
        },
        type: "PUT",
        url: _url + "/api/user/update/photo",
        headers: {
          // 'X-CSRF-TOKEN': "",
          Authorization: "Bearer " + this.token,
        },
      })
        .done((data) => {
          if (data.success) {
            // TODO internacionalizacion
            showNotification(i18n.t("imgupdated"), "green");
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    //********************************************* GET /api/user/history/ ********************************************
    getUserHistory() {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: _url+ "/api/user/history",
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .done((data) => {
          if (data.success) {
            this.history = data.data.history
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification(i18n.t("serverError"), "red");
      });
    },
    // TODO no se usa
    updateUser(user) {
      $.ajax({
        data: {
          petition: "updateUser",
          params: {
            user: user,
          },
        },
        type: "PUT",
        dataType: "json",
        url: _url,
      })
        .done((data) => {
          if (data.success) {
            console.log("Cambios en usuario aplicados");
            console.log(data);
            this.user = user;
            this.saveUserInSession()
          }
        })
        .fail(function (textStatus) {
          if (console && console.log) {
            console.log("No se han actualizado los cambios");
            console.log(textStatus);
          }
        });
    },
    recoverPassword(mail) {
      $.ajax({
        data: {
          petition: "recover",
          params: {
            mail: mail,
          },
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
  },
});

var that = this;
window.app = app;
window.get = getSessionUser
export { app };