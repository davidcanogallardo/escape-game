import { i18n } from "../languages/language.js";
import { getSessionUser } from "../js/utils.js";
import { connect, disconnect } from "../js/chat-client.js";
import Peer from "../../node_modules/simple-peer-light/simplepeer.min.js";

var peer = undefined;
var peerClient = undefined;
var guestPeer = undefined;
var guestPeerClient = undefined;
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
    } else {
      guestPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: window.stream,
      });
      guestPeerClient = new PeerClient(guestPeer, false, socket);
      guestPeerClient.connection();
    }
  });

  socket.on("getGuestID", (guestID) => {
    peerClient.peer.signal(guestID);
  });

  socket.on("sendHostID", (hostID) => {
    guestPeerClient.peer.signal(hostID);
  });

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
  "waiting-room",
  "select-solo-duo"
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
        !sessionStorage.getItem("session") &&
        !excludedPages.includes(newPage)
      ) {
        console.log("no hay sesión");
        this.currentPage = "login-warning";
      } else {
        console.log("hay sesión " + newPage);
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
    this._i18n.locale = this.user.language;
    this.$nextTick(() => {
      if (this.user) {
        console.log("set token")
        this.token = sessionStorage.getItem("token")
        window.token = sessionStorage.getItem("token")
        connect();
        window.setInterval(this.updateFriendRequest, 15000);
        window.setInterval(this.updateFriendList, 50000);
      }
    });

  },
  methods: {
    //laravel
    owo() {
      console.log("owo")
    },
    //laravel
    updateFriendList() {
      console.log("trato de actualizar lista amigos")
      if (this.user) {
        $.ajax({
          xhrFields: {
              withCredentials: true
          },
          type: "POST",
          // dataType: "json",
          headers: {
              // 'X-CSRF-TOKEN': "",
              'Authorization': "Bearer "+ this.token
          },
          url: _url+"/api/friendlist",
        }).done((data) => {
            console.log(data);
            this.user.friendsList = data.data.query
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("La solicitud ha fallado: " + textStatus);
                console.log(XMLHttpRequest);
                console.log(errorThrown);
            }
        });
        
      }
      
    },    
    //laravel
    updateFriendRequest() {
      console.log("trato de actualizar peticiones")
      if (this.user) {
        $.ajax({
          xhrFields: {
              withCredentials: true
          },
          type: "GET",
          // dataType: "json",
          headers: {
              // 'X-CSRF-TOKEN': "",
              'Authorization': "Bearer "+ this.token
          },
          url: _url+"/api/user/listrequests",
        }).done((data) => {
                console.log(data.data.requests);
                console.log(this.user.notifications);
                if (data.data.requests>this.user.notifications) {
                  this.notificationunsread = true
                }
                this.user.notifications = data.data.requests
                sessionStorage.setItem("session", JSON.stringify(this.user));
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("La solicitud ha fallado: " + textStatus);
                console.log(XMLHttpRequest);
                console.log(errorThrown);
            }
        });
        
      }
      
    },
    //laravel
    loginPetition(form_data) {
      $.ajax({
        data: {
          email: form_data.username,
          password: form_data.password,
        },
        type: "POST",
        // dataType: "json",
        url: _url+"/api/login",
      })
        .done((data, textStatus, jqXHR) => {
          if (console && console.log) {
            console.log("La solicitud se ha completado correctamente.");
            console.log(data);
            window.data = data;
            window.token = data.data.token;
            var userInfo = data.data;
            // login(data)
            if (data.success) {
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
              sessionStorage.setItem("session", JSON.stringify(user));
              sessionStorage.setItem("token", window.token);
              window.setTimeout(this.updateFriendRequest, 15000);
              window.setInterval(this.updateFriendList, 50000);
              this.$root.currentPage = "home"
              this.$root.user = user;
              this.$root.token = data.data.token;
              connect();
            } else {
              console.log(data.message);
            }
          }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          if (console && console.log) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            // console.log("La solicitud ha fallado: " + textStatus);
          }
        });
    },
    //laravel
    signupPetition(form_data) {
      console.log("hola");
      console.log(form_data.username);
      console.log(form_data.mail);
      console.log(form_data.password);
      console.log(form_data.password_confirm);
      $.ajax({
        data: {
          name: form_data.username,
          email: form_data.mail,
          password: form_data.password,
          confirm_password: form_data.password_confirm,
        },
        type: "POST",
        // headers: {'X-CSRF-TOKEN': window.token},
        // dataType: "json",
        // contentType: "application/json",
        url: _url+"/api/register",
      })
        .done((data) => {
          console.log(data);
          if (data.success) {
            let user = new User();
            // data.userData.username,
            // data.userData.friendsList,
            // data.userData.notifications,
            // data.userData.completedLevels,
            // data.userData.favMap,
            // data.userData.numTrophies,
            // data.userData.profileImg
            sessionStorage.setItem("session", JSON.stringify(user));
            // this.$root.currentPage = "home"
            this.$root.user = user;
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
    //laravel
    sendFriendRequest(friend) {
      $.ajax({
        data: {
            "addressee_name":  friend
        },
        xhrFields: {
          withCredentials: true
        },
        type: "PUT",
        // dataType: "json",
        headers: {
            // 'X-CSRF-TOKEN': "",
            'Authorization': "Bearer "+ window.token
        },
        url: _url+"/api/user/sendrequest",
      }).done((data) => {
          console.log(data);
          if (data.success) {
            console.log("peticion de amistad enviada");
            console.log(data);
            // showNotification("Petición de amistad enviada a "+friend, "#49EE63")
          } else {
            console.warn("peticion de amistad no enviada")
          }
        }).fail(function (textStatus) {
            if (console && console.log) {
            console.log("La solicitud ha fallado: " + textStatus);
            console.log(textStatus);
            }
        });
    },
    getFriendData(friendName) {
      $.ajax({
        data: {
          petition: "friendData",
          params: {
            friendUser: friendName,
          },
        },
        type: "POST",
        dataType: "json",
        url: _url,
      })
        .done((data) => {
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
            profileImg: data.userData.profileImg,
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
      $.ajax({
        data: {
          petition: "close-sesion",
          params: {
            user: username,
          },
        },
        type: "POST",
        dataType: "json",
        url: _url,
      })
        .done((data) => {
          console.log("sesion cerrada");
          console.log(data);
          if (data.success) {
            this.$root.user = null;
            sessionStorage.clear();
            this.$root.currentPage = "home";
            disconnect();
          }
        })
        .fail(function (textStatus) {
          if (console && console.log) {
            console.log("La solicitud ha fallado: " + textStatus);
            console.log(textStatus);
          }
        });
    },
    //laravel
    friendRequest(username, friend, accept) {
      $.ajax({
        type: "PUT",
        url: _url+"/api/user/handlerequest/"+friend.name+"/"+accept,
        headers: {
          // 'X-CSRF-TOKEN': "",
          'Authorization': "Bearer "+ this.token
      },
      }).done((data) => {
          console.log(data);
          //aun el backend no devuelve nada asi que hago el OR true
          if (data.success || true) {
            if (accept) {
              this.$root.user.friendsList.push(friend);
            }
            var index = this.$root.user.notifications.indexOf(friend);
            if (index !== -1) {
              this.$root.user.notifications.splice(index, 1);
            }
            sessionStorage.setItem("session", JSON.stringify(this.$root.user));
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
        data: { petition: "ranking" },
        type: "POST",
        dataType: "json",
        url: _url+"/api/ranking",
      })
        .done((data) => {
          console.log("RankingData");
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
          petition: "ranking",
          params: {
            // "players" : [ "david", "adnan" ],
            players: data.players,
            // "time" : "00:12:13",
            time: data.time,
            // "level" : "summonerRift"
            level: data.level,
          },
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
            sessionStorage.setItem("session", JSON.stringify(this.$root.user));
          }
        })
        .fail(function (textStatus) {
          if (console && console.log) {
            console.log("No se han actualizado los cambios");
            console.log(textStatus);
          }
        });
    },
    //laravel
    updatePhoto(photo) {
      $.ajax({
        data: {
          "photo": photo
        },
        type: "PUT",
        url: _url+"/api/user/update/photo",
        headers: {
          // 'X-CSRF-TOKEN': "",
          'Authorization': "Bearer "+ this.token
        },
      }).done((data) => {
          console.log(data);

        })
        .fail(function (textStatus) {
          if (console && console.log) {
            console.log("La solicitud ha fallado: " + textStatus);
            console.log(textStatus);
          }
        });
    }
  },
});
var that = this;
window.app = app;
export { app };
