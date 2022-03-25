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
  startPeerStream(startClientPeer, data);
});

function startClientPeer(data) {
  data.forEach((player) => {
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

  var titleScreen = game.scene.getScene("titlescreen");
  titleScreen.setPlayers(data);

  // var game = game.scene.getScene("game");
  // game.start(data);
}

socket.on("windowGame", (data) => {
  app.currentPage = "game";
});

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
    user: getSessionUser(),
    profileInfo: null,
    modalOpen: "none",
    rankingData: null,
    friendChat: null,
    lastMessage: null,
    mainMicId: "default",
    messages: {},
    messagesunread: false,
    peopleUnread: [],
    notificationunsread: false,
    token: null,
    bluetoothConnection: null,
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
        window.setInterval(this.updateFriendRequest, 15000);
        window.setInterval(this.updateFriendList, 50000);
      }
    });
  },
  methods: {
    saveUserInSession() {
      sessionStorage.setItem("session", JSON.stringify(this.user));
    },
    // *******************************/api/friendlist*********************************************
    updateFriendList() {
      console.log("trato de actualizar lista amigos");
      if (this.user) {
        $.ajax({
          xhrFields: {
            withCredentials: true,
          },
          type: "POST",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          url: _url + "/api/friendlist",
        })
          .done((data) => {
            if (data.success) {
              console.log(data);
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
    // *******************************/api/user/listrequests*********************************************
    updateFriendRequest() {
      console.log("trato de actualizar peticiones");
      if (this.user) {
        $.ajax({
          xhrFields: {
            withCredentials: true,
          },
          type: "GET",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          url: _url + "/api/user/listrequests",
        })
          .done((data) => {
            if (data.success) {
              console.log(data);
              console.log(this.user.notifications);
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
    // *******************************/api/login*********************************************
    loginPetition(form_data) {
      $.ajax({
        data: {
          email: form_data.username,
          password: form_data.password,
        },
        type: "POST",
        url: _url + "/api/login",
      })
        .done((data, textStatus, jqXHR) => {
            if (data.success) {
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
                JSON.parse(userInfo.photo)
              );
              this.saveUserInSession()
              sessionStorage.setItem("token", window.token);
              window.setTimeout(this.updateFriendRequest, 15000);
              window.setInterval(this.updateFriendList, 50000);
              this.$root.currentPage = "home";
              this.$root.user = user;
              this.$root.token = data.data.token;
              connect();
            } else {
              console.log(data);
              // TODO internacionalizacion
              // showNotification("No has podido iniciar sesion", "red");
              showNotification(data.message, "red");
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            showNotification("Fallo servidor", "red");
        });
    },
    // *******************************/api/register*********************************************
    signupPetition(form_data) {
      $.ajax({
        data: {
          name: form_data.username,
          email: form_data.mail,
          password: form_data.password,
          confirm_password: form_data.password_confirm,
        },
        type: "POST",
        url: _url + "/api/register",
      })
        .done((data) => {
          if (data.success) {
            console.log("registrado");
            // TODO internacionalizacion
            showNotification("Registrado", "green");
          } else {
            console.log(data);
            // TODO internacionalizacion
            // showNotification("No has podido iniciar sesion", "red");
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification("Fallo servidor", "red");
      });
    },
    //*********************************************/api/user/sendrequest*********************************************
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
        url: _url + "/api/user/sendrequest",
      })
        .done((data) => {
          console.log(data);
          if (data.success) {
            console.log("peticion de amistad enviada");
            console.log(data);
            // TODO internacionalizacion
            showNotification("Petición de amistad enviada a " + friend,"green");
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification("Fallo servidor", "red");
      });
    },
    // TODO
    getFriendData(friendName) {
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
    //*********************************************/api/user/handlerequest/*********************************************
    friendRequest(friend, accept) {
      $.ajax({
        type: "PUT",
        url: _url + "/api/user/handlerequest/" + friend.name + "/" + accept,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
        .done((data) => {
          if (data.success) {
            if (accept) {
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
          showNotification("Fallo servidor", "red");
      });
    },
    //*********************************************/api/ranking*********************************************
    getRankingData() {
      $.ajax({
        data: { petition: "ranking" },
        type: "POST",
        dataType: "json",
        url: _url + "/api/ranking",
      })
        .done((data) => {
          if (data.success) {
            this.$root.rankingData = data;
            console.log("RankingData");
            console.log(data);
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification("Fallo servidor", "red");
      });
    },
    //*********************************************/user/addgame/{level}/{time}*********************************************
    updateRanking(data) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: _url+ "/api/user/addgame/"+data.level+"/"+data.time,
      })
        .done(function (data) {
          if (data.success) {
            
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification("Fallo servidor", "red");
      });
    },
    //*********************************************/api/user/update/photo*********************************************
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
            // TODO 
          } else {
            console.log(data);
            // TODO internacionalizacion
            showNotification(data.message, "red");
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          showNotification("Fallo servidor", "red");
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
