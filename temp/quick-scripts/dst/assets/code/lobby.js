
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/lobby.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f0b8dGoFs9D0Y2a3uyBs+rE', 'lobby');
// code/lobby.js

"use strict";

var payLoad = function payLoad(type, data) {
  this.type = type;
  this.data = data;
};

;

var PlayerData = function PlayerData(id, x) {
  this.posX = 0;
  this.posY = 0;
  this.name = null;
  this.id = id;
  this.x = x;
  this.status = 0;
  this.key = '';
};

;

var PlayerInfo = function PlayerInfo(id, name, crowns, wins, loses, houseIndex) {
  this.id = id;
  this.name = name;
  this.crowns = crowns;
  this.wins = wins;
  this.loses = loses;
  this.houseIndex = houseIndex;
};

;
cc.Class({
  "extends": cc.Component,
  properties: {
    ws: null,
    playerNameNode: cc.Node,
    playerName: null,
    joining: false,
    buttonText: cc.Node,
    lobbyInfoText: cc.Node,
    lobbyStatusText: cc.Node,
    playerId: null,
    connected: false,
    status: "(waiting for players...)",
    errorNode: cc.Node,
    connecting: false,
    tutorials: [cc.Node],
    tutorialIndex: 0,
    tutorialPage: cc.Node,
    usernameNode: cc.Node,
    serverIp: "",
    haveUserData: false,
    showingLeaderboard: true,
    leaderboardNode: cc.Node,
    leaderboardTitle: cc.Node,
    playerStatPrefab: cc.Prefab,
    playerRecordPrefab: cc.Prefab,
    recordsNode: cc.Node,
    recordsTitle: cc.Node,
    signInNode: cc.Node,
    inputUsernameNode: cc.Node,
    passwordNode: cc.Node,
    password: null,
    crowns: 0,
    houseIndex: 0,
    loginErrorNode: cc.Node
  },
  showNext: function showNext() {
    if (this.showingLeaderboard) {
      this.leaderboardNode.active = false;
      this.leaderboardTitle.active = false;
      this.recordsTitle.active = true;
      this.recordsNode.active = true;
      this.showingLeaderboard = false;
    } else {
      this.leaderboardNode.active = true;
      this.leaderboardTitle.active = true;
      this.recordsTitle.active = false;
      this.recordsNode.active = false;
      this.showingLeaderboard = true;
    }
  },
  giveSignInError: function giveSignInError(error) {
    this.loginErrorNode.getComponent(cc.Label).string = error;
  },
  pressSignIn: function pressSignIn() {
    this.signInUp(this.inputUsernameNode.getComponent(cc.EditBox).string, this.passwordNode.getComponent(cc.EditBox).string);
  },
  signInUp: function signInUp(theName, thePassword) {
    var _this = this;

    var sent = false;
    this.playerName = theName.toUpperCase();
    this.password = thePassword;

    if (this.playerName.length < 1 || this.password.length < 1) {
      this.giveSignInError("username/password too short");
      return 0;
    }

    for (var i = 0; i < this.playerName.length; i++) {
      if (this.playerName[i].charCodeAt() < 'A'.charCodeAt() || this.playerName[i].charCodeAt() > 'Z'.charCodeAt()) {
        this.giveSignInError("username has invalid characters");
        return 0;
      }
    }

    for (var i = 0; i < this.password.length; i++) {
      if (this.password[i].charCodeAt() < '0'.charCodeAt() || this.password[i].charCodeAt() > 'z'.charCodeAt()) {
        this.giveSignInError("password has invalid characters");
        return 0;
      }
    }

    this.ws = new WebSocket("ws://" + this.serverIp + ":3002");
    this.ws.addEventListener("open", function () {
      if (!sent) {
        _this.ws.send(JSON.stringify(new payLoad("signIn", [_this.playerName, _this.password])));

        sent = true;
      }
    });
    this.ws.addEventListener('message', function (_ref) {
      var data = _ref.data;
      var myData = JSON.parse(data);

      if (myData.type == "failed") {
        _this.giveSignInError("couldn't sign in (check info or username is taken)");

        return 0;
      } else if (myData.type == "success") {
        _this.playerId = myData.data.id;
        _this.crowns = myData.data.crowns;
        _this.houseIndex = myData.data.houseIndex;
        cc.find("Canvas/CROWNS/num").getComponent(cc.Label).string = myData.data.crowns;
        cc.find("Canvas/WINS").getComponent(cc.Label).string = myData.data.wins + " wins";
        cc.find("Canvas/LOSES").getComponent(cc.Label).string = myData.data.loses + " loses";
        cc.find("Canvas/USERNAME").getComponent(cc.Label).string = _this.playerName;
        cc.find("MANAGER").getComponent("colorTheme").changeColor(_this.houseIndex);
        cc.sys.localStorage.setItem("username", JSON.stringify(_this.playerName));
        cc.sys.localStorage.setItem("password", JSON.stringify(_this.password));
        _this.signInNode.active = false;
      }

      console.log("id = " + _this.playerId);

      _this.ws.close();

      _this.refreshLeader();
    });
  },
  joinLobbySuccessfully: function joinLobbySuccessfully() {
    console.log("joined lobby");
    this.connected = true; //if (cc.sys.platform != cc.sys.WECHAT_GAME)
    //    this.playerId = this.playerNameNode.getComponent(cc.EditBox).string;

    this.joining = true;
    this.buttonText.getComponent(cc.Label).string = "CANCEL"; //this.lobbyInfoText.active = true;

    this.lobbyStatusText.active = true;
    if (cc.sys.platform == cc.sys.WECHAT_GAME) this.ws.send({
      data: JSON.stringify(new payLoad("player_name", [this.playerName, "wechat", this.playerId]))
    });else this.ws.send(JSON.stringify(new payLoad("player_name", [this.playerName, "wechat", this.playerId])));
  },
  receiveMessage: function receiveMessage(data) {
    var myData = JSON.parse(data);

    switch (myData.type) {
      case "lobbyInfo":
        console.log(myData.data);
        this.updateUsers(myData.data);
        break;

      case "playerInfo":
        this.playerId = myData.data;
        console.log(this.playerId);
        break;

      case "status":
        if (myData.data[0] == "starting") {
          console.log("game is starting in " + myData.data[1]);
          this.status = "(starting in " + myData.data[1] + ")";
        } else if (myData.data[0] == "start") {
          //start game
          console.log("starting game"); //var thePlayerInfo = {
          //    id: this.playerId,
          //    port: myData.data[1],f
          //};
          //module.exports = thePlayerInfo;

          var abp = cc.find("MANAGER").getComponent("aboutPlayer");
          abp.playerId = this.playerId;
          abp.room = myData.data[1];
          abp.serverIp = this.serverIp;
          abp.crowns = this.crowns;
          abp.houseIndex = this.houseIndex;
          this.leaveLobby();

          switch (myData.data[2]) {
            case 1:
              cc.director.loadScene("map1");
              break;

            case 2:
              cc.director.loadScene("map2");
              break;

            case 3:
              cc.director.loadScene("map3");
              break;
          }
        } else if (myData.data[0] == "stop") {
          this.status = "(waiting for players...)";
        }

        this.updateStatus();
        break;
    }
  },
  showLeaderboard: function showLeaderboard() {
    this.leaderboardNode.active = true;
  },
  closeLeaderboard: function closeLeaderboard() {
    this.leaderboardNode.active = false;
  },
  closeLobby: function closeLobby() {
    console.log("disconnected");
    this.connected = false;
    this.connecting = false;
    this.joining = false;
    this.buttonText.getComponent(cc.Label).string = "PLAY";
    this.leaveLobby(); //this.lobbyInfoText.active = false;

    this.lobbyStatusText.active = false;
  },
  closeError: function closeError() {
    this.errorNode.active = false;
  },
  joinLobby: function joinLobby() {
    var _this2 = this;

    this.connecting = true;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      console.log("yes");
      this.ws = wx.connectSocket({
        url: "ws://" + this.serverIp + ":9091"
      });
      this.ws.onOpen(function () {
        _this2.joinLobbySuccessfully();
      });
      this.ws.onMessage(function (_ref2) {
        var data = _ref2.data;

        _this2.receiveMessage(data);
      });
      this.ws.onError(function () {
        console.log("couldn't connect");
        _this2.errorNode.active = true;
        _this2.connecting = false;
      });
      this.ws.onClose(function () {
        _this2.closeLobby();
      });
    } else {
      console.log("no");
      this.ws = new WebSocket("ws://" + this.serverIp + ":9091");
      this.ws.addEventListener("open", function () {
        _this2.joinLobbySuccessfully();
      });
      this.ws.addEventListener('message', function (_ref3) {
        var data = _ref3.data;

        _this2.receiveMessage(data);
      });
      this.ws.addEventListener("error", function () {
        console.log("couldn't connect");
        _this2.errorNode.active = true;
        _this2.connecting = false;
      });
      this.ws.addEventListener("close", function () {
        _this2.closeLobby();
      });
    }
  },
  leaveLobby: function leaveLobby() {
    if (cc.sys.os == cc.sys.WECHAT_GAME) this.ws.closeSocket();else this.ws.close();
  },
  updateUsers: function updateUsers(num) {
    //this.lobbyInfoText.getComponent(cc.Label).string = num + "/10 players ";
    this.updateStatus();
  },
  updateStatus: function updateStatus() {
    this.lobbyStatusText.getComponent(cc.Label).string = this.status;
  },
  pressJoin: function pressJoin() {
    if (this.playerId != null) {
      this.refreshLeader(); // cannot join multiple times

      if (this.haveUserData || cc.sys.platform != cc.sys.WECHAT_GAME) {
        if (!this.joining && !this.connecting) {
          this.joinLobby();
        } else {
          this.joining = false;
          this.buttonText.getComponent(cc.Label).string = "PLAY";
          this.leaveLobby();
          this.lobbyInfoText.active = false;
          this.watch;
          this.lobbyStatusText.active = false;
        }
      } else {
        this.createWeChatButton();
      }
    }
  },
  refreshLeader: function refreshLeader() {
    var houses = ["Gry", "Huf", "Rav", "Sly"];

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.request({
        url: "http://" + this.serverIp + ":3000/",
        success: function success(res) {
          cc.find("Lobby Manager").getComponent("lobby").leaderboardNode.removeAllChildren();
          var response = res.data.data; // id - name - crowns - wins - loses

          for (var i = 0; i < response.length; i++) {
            var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerStatPrefab);
            player.parent = cc.find("Lobby Manager").getComponent("lobby").leaderboardNode;
            player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
            player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[houseIndex] + "] " + response[i].name;
            player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
          }
        }
      });
      console.log("refreshing");
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        cc.find("Lobby Manager").getComponent("lobby").leaderboardNode.removeAllChildren();
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText).data;

        for (var i = 0; i < response.length; i++) {
          var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerStatPrefab);
          player.parent = cc.find("Lobby Manager").getComponent("lobby").leaderboardNode;
          player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
          player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[houseIndex] + "] " + response[i].name;
          player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
        }
      };

      xhr.open("GET", "http://" + this.serverIp + ":3000/");
      xhr.send();
    }

    this.refreshRecords();
  },
  refreshRecords: function refreshRecords() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.request({
        url: "http://" + this.serverIp + ":3001/",
        success: function success(res) {
          cc.find("Lobby Manager").getComponent("lobby").recordsNode.removeAllChildren();
          var response = res.data.data; // id - name - crowns - wins - loses

          for (var i = 0; i < response.length; i++) {
            var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerRecordPrefab);
            player.parent = cc.find("Lobby Manager").getComponent("lobby").recordsNode;
            player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
            player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
            player.getChildByName("SPEED").getComponent(cc.Label).string = response[i].speed + " s";
          }
        }
      });
      console.log("refreshing");
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        cc.find("Lobby Manager").getComponent("lobby").recordsNode.removeAllChildren();
        var response = JSON.parse(xhr.responseText).data;

        for (var i = 0; i < response.length; i++) {
          var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerRecordPrefab);
          player.parent = cc.find("Lobby Manager").getComponent("lobby").recordsNode;
          player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
          player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
          player.getChildByName("SPEED").getComponent(cc.Label).string = response[i].speed + " s";
        }
      };

      xhr.open("GET", "http://" + this.serverIp + ":3001/");
      xhr.send();
    }
  },
  // LIFE-CYCLE CALLBACKS:
  openTutorial: function openTutorial() {
    this.tutorialPage.active = true;
    this.tutorials[0].active = true;
  },
  nextTutorial: function nextTutorial() {
    this.tutorials[this.tutorialIndex].active = false;
    this.tutorialIndex += 1;

    if (this.tutorialIndex < this.tutorials.length) {
      this.tutorials[this.tutorialIndex].active = true;
    } else {
      this.tutorialPage.active = false;
      this.tutorialIndex = 0;
    }
  },
  goToStory: function goToStory() {
    cc.director.loadScene("story");
  },
  createWeChatButton: function createWeChatButton() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      this.playerNameNode.active = false;
      this.usernameNode.active = true;
      var sysInfo = window.wx.getSystemInfoSync();
      var width = sysInfo.screenWidth;
      var height = sysInfo.screenHeight;
      wx.getSetting({
        success: function success(res) {
          console.log(res.authSetting);

          if (res.authSetting["scope.userInfo"]) {
            //something
            cc.find("Lobby Manager").getComponent("lobby").usernameNode.getComponent(cc.Label).string = "1";
            wx.getUserInfo({
              success: function success(res) {
                var userInfo = res.userInfo;
                cc.find("Lobby Manager").getComponent("lobby").usernameNode.getComponent(cc.Label).string = userInfo.nickName;
                cc.find("Lobby Manager").getComponent("lobby").playerName = userInfo.nickName;
                cc.find("Lobby Manager").getComponent("lobby").haveUserData = true;
                wx.login({
                  success: function success(res) {
                    console.log("successful");
                    var d = {};
                    d.appid = "wxa6602e501625471f";
                    d.secrect = "a0af4c896f22ce9c00d61a274e2afad1";
                    var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secrect + '&js_code=' + res.code + '&grant_type=authorization_code';
                    wx.request({
                      url: l,
                      data: {},
                      method: 'GET',
                      success: function success(res) {
                        console.log(res.data.openid);
                        cc.find("Lobby Manager").getComponent("lobby").playerId = res.data.openid;
                        cc.find("Lobby Manager").getComponent("lobby").refreshLeader();
                      }
                    });
                  }
                });
              }
            });
          } else {
            console.log("no");
            var button = wx.createUserInfoButton({
              type: 'text',
              text: 'allow miniprogram to use info?',
              style: {
                left: 200,
                top: 100,
                width: 300,
                height: 200,
                backgroundColor: '#FAEB3C',
                color: '#000000',
                fontSize: 20,
                textAlign: "center",
                lineHeight: 200
              }
            });
            button.onTap(function (res) {
              if (res.userInfo) {
                //something
                var userInfo = res.userInfo;
                cc.find("Lobby Manager").getComponent("lobby").usernameNode.getComponent(cc.Label).string = userInfo.nickName;
                button.destroy();
              } else {//something
              }
            });
          }
        }
      });
    }
  },
  onLoad: function onLoad() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.getStorage({
        key: "played",
        success: function success(res) {//played before
        },
        fail: function fail() {
          cc.find("Lobby Manager").getComponent("lobby").openTutorial();
          wx.setStorage({
            key: "played",
            data: "yes"
          });
        }
      });
      this.createWeChatButton();
    } else {
      // check if played before
      if (cc.sys.localStorage.getItem("username") != null && cc.sys.localStorage.getItem("password") != null) {
        this.signInUp(JSON.parse(cc.sys.localStorage.getItem("username")), JSON.parse(cc.sys.localStorage.getItem("password")));
      } else {
        this.openTutorial();
        this.signInNode.active = true;
      }
    }

    this.refreshLeader();
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbG9iYnkuanMiXSwibmFtZXMiOlsicGF5TG9hZCIsInR5cGUiLCJkYXRhIiwiUGxheWVyRGF0YSIsImlkIiwieCIsInBvc1giLCJwb3NZIiwibmFtZSIsInN0YXR1cyIsImtleSIsIlBsYXllckluZm8iLCJjcm93bnMiLCJ3aW5zIiwibG9zZXMiLCJob3VzZUluZGV4IiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ3cyIsInBsYXllck5hbWVOb2RlIiwiTm9kZSIsInBsYXllck5hbWUiLCJqb2luaW5nIiwiYnV0dG9uVGV4dCIsImxvYmJ5SW5mb1RleHQiLCJsb2JieVN0YXR1c1RleHQiLCJwbGF5ZXJJZCIsImNvbm5lY3RlZCIsImVycm9yTm9kZSIsImNvbm5lY3RpbmciLCJ0dXRvcmlhbHMiLCJ0dXRvcmlhbEluZGV4IiwidHV0b3JpYWxQYWdlIiwidXNlcm5hbWVOb2RlIiwic2VydmVySXAiLCJoYXZlVXNlckRhdGEiLCJzaG93aW5nTGVhZGVyYm9hcmQiLCJsZWFkZXJib2FyZE5vZGUiLCJsZWFkZXJib2FyZFRpdGxlIiwicGxheWVyU3RhdFByZWZhYiIsIlByZWZhYiIsInBsYXllclJlY29yZFByZWZhYiIsInJlY29yZHNOb2RlIiwicmVjb3Jkc1RpdGxlIiwic2lnbkluTm9kZSIsImlucHV0VXNlcm5hbWVOb2RlIiwicGFzc3dvcmROb2RlIiwicGFzc3dvcmQiLCJsb2dpbkVycm9yTm9kZSIsInNob3dOZXh0IiwiYWN0aXZlIiwiZ2l2ZVNpZ25JbkVycm9yIiwiZXJyb3IiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsInByZXNzU2lnbkluIiwic2lnbkluVXAiLCJFZGl0Qm94IiwidGhlTmFtZSIsInRoZVBhc3N3b3JkIiwic2VudCIsInRvVXBwZXJDYXNlIiwibGVuZ3RoIiwiaSIsImNoYXJDb2RlQXQiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJteURhdGEiLCJwYXJzZSIsImZpbmQiLCJjaGFuZ2VDb2xvciIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJyZWZyZXNoTGVhZGVyIiwiam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5IiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInJlY2VpdmVNZXNzYWdlIiwidXBkYXRlVXNlcnMiLCJhYnAiLCJyb29tIiwibGVhdmVMb2JieSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidXBkYXRlU3RhdHVzIiwic2hvd0xlYWRlcmJvYXJkIiwiY2xvc2VMZWFkZXJib2FyZCIsImNsb3NlTG9iYnkiLCJjbG9zZUVycm9yIiwiam9pbkxvYmJ5Iiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJvcyIsImNsb3NlU29ja2V0IiwibnVtIiwicHJlc3NKb2luIiwid2F0Y2giLCJjcmVhdGVXZUNoYXRCdXR0b24iLCJob3VzZXMiLCJyZXF1ZXN0Iiwic3VjY2VzcyIsInJlcyIsInJlbW92ZUFsbENoaWxkcmVuIiwicmVzcG9uc2UiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImdldENoaWxkQnlOYW1lIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZXNwb25zZVRleHQiLCJvcGVuIiwicmVmcmVzaFJlY29yZHMiLCJzcGVlZCIsIm9wZW5UdXRvcmlhbCIsIm5leHRUdXRvcmlhbCIsImdvVG9TdG9yeSIsInN5c0luZm8iLCJ3aW5kb3ciLCJnZXRTeXN0ZW1JbmZvU3luYyIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJnZXRVc2VySW5mbyIsInVzZXJJbmZvIiwibmlja05hbWUiLCJsb2dpbiIsImQiLCJhcHBpZCIsInNlY3JlY3QiLCJsIiwiY29kZSIsIm1ldGhvZCIsIm9wZW5pZCIsImJ1dHRvbiIsImNyZWF0ZVVzZXJJbmZvQnV0dG9uIiwidGV4dCIsInN0eWxlIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJsaW5lSGVpZ2h0Iiwib25UYXAiLCJkZXN0cm95Iiwib25Mb2FkIiwiZ2V0U3RvcmFnZSIsImZhaWwiLCJzZXRTdG9yYWdlIiwiZ2V0SXRlbSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxVQUNGLGlCQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QjtBQUNwQixPQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFDSjs7SUFFS0MsYUFDRixvQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFBQSxPQU1uQkMsSUFObUIsR0FNWixDQU5ZO0FBQUEsT0FPbkJDLElBUG1CLEdBT1osQ0FQWTtBQUFBLE9BUW5CQyxJQVJtQixHQVFaLElBUlk7QUFDZixPQUFLSixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0g7O0FBSUo7O0lBR0tDLGFBQ0Ysb0JBQVlQLEVBQVosRUFBZ0JJLElBQWhCLEVBQXNCSSxNQUF0QixFQUE4QkMsSUFBOUIsRUFBb0NDLEtBQXBDLEVBQTJDQyxVQUEzQyxFQUF1RDtBQUNuRCxPQUFLWCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLSSxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLSSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztBQUNKO0FBRURDLEVBQUUsQ0FBQ0Ms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RW5HLElBQUksQ0FBQ0csS0FBTCxDQUFXMUQsRUFBRSxDQUFDNkQsR0FBSCxDQUFPQyxZQUFQLENBQW9CNEYsT0FBcEIsQ0FBNEIsVUFBNUIsQ0FBWCxDQUFuRTtBQUNILE9BRkQsTUFFTztBQUNILGFBQUt4QyxZQUFMO0FBQ0EsYUFBS3BGLFVBQUwsQ0FBZ0JNLE1BQWhCLEdBQXlCLElBQXpCO0FBQ0g7QUFFSjs7QUFFRCxTQUFLK0IsYUFBTDtBQUVILEdBcmdCSTtBQXVnQkx3RixFQUFBQSxLQXZnQkssbUJBdWdCSSxDQUVSLENBemdCSSxDQTJnQkw7O0FBM2dCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5cclxuY2xhc3MgUGxheWVySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgY3Jvd25zLCB3aW5zLCBsb3NlcywgaG91c2VJbmRleCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gY3Jvd25zO1xyXG4gICAgICAgIHRoaXMud2lucyA9IHdpbnM7XHJcbiAgICAgICAgdGhpcy5sb3NlcyA9IGxvc2VzO1xyXG4gICAgICAgIHRoaXMuaG91c2VJbmRleCA9IGhvdXNlSW5kZXg7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHdzOiBudWxsLFxyXG4gICAgICAgIHBsYXllck5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllck5hbWU6IG51bGwsXHJcbiAgICAgICAgam9pbmluZzogZmFsc2UsXHJcbiAgICAgICAgYnV0dG9uVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBsb2JieUluZm9UZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGxvYmJ5U3RhdHVzVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJJZDogbnVsbCxcclxuICAgICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHN0YXR1czogXCIod2FpdGluZyBmb3IgcGxheWVycy4uLilcIixcclxuXHJcbiAgICAgICAgZXJyb3JOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNvbm5lY3Rpbmc6IGZhbHNlLFxyXG5cclxuICAgICAgICB0dXRvcmlhbHM6IFtjYy5Ob2RlXSxcclxuICAgICAgICB0dXRvcmlhbEluZGV4OiAwLFxyXG4gICAgICAgIHR1dG9yaWFsUGFnZTogY2MuTm9kZSxcclxuXHJcbiAgICAgICAgdXNlcm5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIGhhdmVVc2VyRGF0YTogZmFsc2UsXHJcblxyXG4gICAgICAgIHNob3dpbmdMZWFkZXJib2FyZDogdHJ1ZSxcclxuICAgICAgICBsZWFkZXJib2FyZE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgbGVhZGVyYm9hcmRUaXRsZTogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJTdGF0UHJlZmFiOiBjYy5QcmVmYWIsXHJcblxyXG4gICAgICAgIHBsYXllclJlY29yZFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHJlY29yZHNOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHJlY29yZHNUaXRsZTogY2MuTm9kZSxcclxuXHJcblxyXG4gICAgICAgIHNpZ25Jbk5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgaW5wdXRVc2VybmFtZU5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFzc3dvcmROb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhc3N3b3JkOiBudWxsLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBob3VzZUluZGV4OiAwLFxyXG4gICAgICAgIGxvZ2luRXJyb3JOb2RlOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93TmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zaG93aW5nTGVhZGVyYm9hcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVhZGVyYm9hcmRUaXRsZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzVGl0bGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dpbmdMZWFkZXJib2FyZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZFRpdGxlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkc1RpdGxlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNOb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dpbmdMZWFkZXJib2FyZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdpdmVTaWduSW5FcnJvcihlcnJvcikge1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBlcnJvcjtcclxuICAgIH0sXHJcbiAgICBwcmVzc1NpZ25JbigpIHtcclxuICAgICAgICB0aGlzLnNpZ25JblVwKHRoaXMuaW5wdXRVc2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZywgdGhpcy5wYXNzd29yZE5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZylcclxuICAgIH0sXHJcbiAgICBzaWduSW5VcCh0aGVOYW1lLHRoZVBhc3N3b3JkKSB7XHJcbiAgICAgICAgbGV0IHNlbnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBsYXllck5hbWUgPSB0aGVOYW1lLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IHRoZVBhc3N3b3JkO1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllck5hbWUubGVuZ3RoIDwgMSB8fCB0aGlzLnBhc3N3b3JkLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5naXZlU2lnbkluRXJyb3IoXCJ1c2VybmFtZS9wYXNzd29yZCB0b28gc2hvcnRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTmFtZS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllck5hbWVbaV0uY2hhckNvZGVBdCgpIDwgJ0EnLmNoYXJDb2RlQXQoKSB8fCB0aGlzLnBsYXllck5hbWVbaV0uY2hhckNvZGVBdCgpID4gJ1onLmNoYXJDb2RlQXQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5naXZlU2lnbkluRXJyb3IoXCJ1c2VybmFtZSBoYXMgaW52YWxpZCBjaGFyYWN0ZXJzXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhc3N3b3JkW2ldLmNoYXJDb2RlQXQoKSA8ICcwJy5jaGFyQ29kZUF0KCkgfHwgdGhpcy5wYXNzd29yZFtpXS5jaGFyQ29kZUF0KCkgPiAneicuY2hhckNvZGVBdCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInBhc3N3b3JkIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDJcIik7XHJcblxyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZChcInNpZ25JblwiLCBbdGhpcy5wbGF5ZXJOYW1lLCB0aGlzLnBhc3N3b3JkXSkpKTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChteURhdGEudHlwZSA9PSBcImZhaWxlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcImNvdWxkbid0IHNpZ24gaW4gKGNoZWNrIGluZm8gb3IgdXNlcm5hbWUgaXMgdGFrZW4pXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVySWQgPSBteURhdGEuZGF0YS5pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3Jvd25zID0gbXlEYXRhLmRhdGEuY3Jvd25zO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3VzZUluZGV4ID0gbXlEYXRhLmRhdGEuaG91c2VJbmRleDtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvQ1JPV05TL251bVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLmNyb3ducztcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvV0lOU1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLndpbnMgKyBcIiB3aW5zXCI7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL0xPU0VTXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbXlEYXRhLmRhdGEubG9zZXMgKyBcIiBsb3Nlc1wiO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VU0VSTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMucGxheWVyTmFtZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJNQU5BR0VSXCIpLmdldENvbXBvbmVudChcImNvbG9yVGhlbWVcIikuY2hhbmdlQ29sb3IodGhpcy5ob3VzZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucGxheWVyTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGFzc3dvcmRcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5wYXNzd29yZCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduSW5Ob2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZCA9IFwiICsgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5KCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImpvaW5lZCBsb2JieVwiKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgLy9pZiAoY2Muc3lzLnBsYXRmb3JtICE9IGNjLnN5cy5XRUNIQVRfR0FNRSlcclxuICAgICAgICAvLyAgICB0aGlzLnBsYXllcklkID0gdGhpcy5wbGF5ZXJOYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nO1xyXG5cclxuICAgICAgICB0aGlzLmpvaW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiQ0FOQ0VMXCI7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxvYmJ5U3RhdHVzVGV4dC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSlcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKHsgZGF0YTogSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQoXCJwbGF5ZXJfbmFtZVwiLCBbdGhpcy5wbGF5ZXJOYW1lLCBcIndlY2hhdFwiLCB0aGlzLnBsYXllcklkXSkpIH0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQoXCJwbGF5ZXJfbmFtZVwiLCBbdGhpcy5wbGF5ZXJOYW1lLCBcIndlY2hhdFwiLCB0aGlzLnBsYXllcklkXSkpKTtcclxuICAgIH0sXHJcbiAgICByZWNlaXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgc3dpdGNoIChteURhdGEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibG9iYnlJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJzKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicGxheWVySW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IG15RGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0YXR1c1wiOlxyXG4gICAgICAgICAgICAgICAgaWYgKG15RGF0YS5kYXRhWzBdID09IFwic3RhcnRpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBpcyBzdGFydGluZyBpbiBcIiArIG15RGF0YS5kYXRhWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiKHN0YXJ0aW5nIGluIFwiICsgbXlEYXRhLmRhdGFbMV0gKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG15RGF0YS5kYXRhWzBdID09IFwic3RhcnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vc3RhcnQgZ2FtZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3ZhciB0aGVQbGF5ZXJJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlkOiB0aGlzLnBsYXllcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHBvcnQ6IG15RGF0YS5kYXRhWzFdLGZcclxuICAgICAgICAgICAgICAgICAgICAvL307XHJcbiAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUuZXhwb3J0cyA9IHRoZVBsYXllckluZm87XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhYnAgPSBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhYnAucGxheWVySWQgPSB0aGlzLnBsYXllcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIGFicC5yb29tID0gbXlEYXRhLmRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLnNlcnZlcklwID0gdGhpcy5zZXJ2ZXJJcDtcclxuICAgICAgICAgICAgICAgICAgICBhYnAuY3Jvd25zID0gdGhpcy5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLmhvdXNlSW5kZXggPSB0aGlzLmhvdXNlSW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG15RGF0YS5kYXRhWzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTogY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFwMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1hcDJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYXAzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobXlEYXRhLmRhdGFbMF0gPT0gXCJzdG9wXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiKHdhaXRpbmcgZm9yIHBsYXllcnMuLi4pXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNob3dMZWFkZXJib2FyZCgpIHtcclxuICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlTGVhZGVyYm9hcmQoKSB7XHJcbiAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VMb2JieSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3RlZFwiKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuam9pbmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiUExBWVwiO1xyXG4gICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9zZUVycm9yKCkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGpvaW5Mb2JieSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieWVzXCIpO1xyXG4gICAgICAgICAgICB0aGlzLndzID0gd3guY29ubmVjdFNvY2tldCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwid3M6Ly9cIiArIHRoaXMuc2VydmVySXAgK1wiOjkwOTFcIlxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbk9wZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qb2luTG9iYnlTdWNjZXNzZnVsbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uTWVzc2FnZSgoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbkVycm9yKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bGRuJ3QgY29ubmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uQ2xvc2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUxvYmJ5KCk7ICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuICAgICAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjkwOTFcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bGRuJ3QgY29ubmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlTG9iYnkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBsZWF2ZUxvYmJ5KCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVXNlcnMobnVtKSB7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBudW0gKyBcIi8xMCBwbGF5ZXJzIFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlU3RhdHVzKCkge1xyXG4gICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGhpcy5zdGF0dXM7XHJcbiAgICB9LFxyXG4gICAgcHJlc3NKb2luKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaExlYWRlcigpO1xyXG4gICAgICAgICAgICAvLyBjYW5ub3Qgam9pbiBtdWx0aXBsZSB0aW1lc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXZlVXNlckRhdGEgfHwgY2Muc3lzLnBsYXRmb3JtICE9IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmpvaW5pbmcgJiYgIXRoaXMuY29ubmVjdGluZykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmpvaW5Mb2JieSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam9pbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiUExBWVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9iYnlJbmZvVGV4dC5hY3RpdmUgPSBmYWxzZTsgdGhpcy53YXRjaFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVXZUNoYXRCdXR0b24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlZnJlc2hMZWFkZXIoKSB7XHJcbiAgICAgICAgbGV0IGhvdXNlcyA9ICBbXCJHcnlcIiwgXCJIdWZcIiwgXCJSYXZcIiwgXCJTbHlcIl07XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYFske2hvdXNlc1tob3VzZUluZGV4XX1dIGAgKyByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaGluZ1wiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyU3RhdFByZWZhYik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJQTEFDRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGkgKyAxICsgXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGBbJHtob3VzZXNbaG91c2VJbmRleF19XSBgICsgcmVzcG9uc2VbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZnJlc2hSZWNvcmRzKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWZyZXNoUmVjb3JkcygpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMS9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJSZWNvcmRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoaW5nXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWNvcmRzTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCIgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcImh0dHA6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjozMDAxL1wiKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgICBvcGVuVHV0b3JpYWwoKSB7XHJcbiAgICAgICAgdGhpcy50dXRvcmlhbFBhZ2UuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1swXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIG5leHRUdXRvcmlhbCgpIHtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1t0aGlzLnR1dG9yaWFsSW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxJbmRleCArPSAxOyAgICBcclxuICAgICAgICBpZiAodGhpcy50dXRvcmlhbEluZGV4IDwgdGhpcy50dXRvcmlhbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHV0b3JpYWxzW3RoaXMudHV0b3JpYWxJbmRleF0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR1dG9yaWFsUGFnZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50dXRvcmlhbEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGdvVG9TdG9yeSgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdG9yeVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlV2VDaGF0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZU5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWVOb2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHN5c0luZm8gPSB3aW5kb3cud3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHN5c0luZm8uc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBzeXNJbmZvLnNjcmVlbkhlaWdodDtcclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5hdXRoU2V0dGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJJbmZvXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiMVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS51c2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJOYW1lID0gdXNlckluZm8ubmlja05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuaGF2ZVVzZXJEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NmdWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5hcHBpZCA9IFwid3hhNjYwMmU1MDE2MjU0NzFmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnNlY3JlY3QgPSBcImEwYWY0Yzg5NmYyMmNlOWMwMGQ2MWEyNzRlMmFmYWQxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICdodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL3Nucy9qc2NvZGUyc2Vzc2lvbj9hcHBpZD0nICsgZC5hcHBpZCArICcmc2VjcmV0PScgKyBkLnNlY3JlY3QgKyAnJmpzX2NvZGU9JyArIHJlcy5jb2RlICsgJyZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLm9wZW5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllcklkID0gcmVzLmRhdGEub3BlbmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidXR0b24gPSB3eC5jcmVhdGVVc2VySW5mb0J1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnYWxsb3cgbWluaXByb2dyYW0gdG8gdXNlIGluZm8/JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZBRUIzQycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5vblRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlckluZm8gPSByZXMudXNlckluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikudXNlcm5hbWVOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdXNlckluZm8ubmlja05hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3BsYXllZCBiZWZvcmVcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5vcGVuVHV0b3JpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBcInllc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV2VDaGF0QnV0dG9uKCk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwbGF5ZWQgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPSBudWxsICYmIGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluVXAoSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSksIEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblR1dG9yaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25Jbk5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7ICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19