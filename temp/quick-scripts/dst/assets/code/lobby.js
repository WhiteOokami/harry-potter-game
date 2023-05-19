
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

var PlayerInfo = function PlayerInfo(id, name, crowns, wins, loses) {
  this.id = id;
  this.name = name;
  this.crowns = crowns;
  this.wins = wins;
  this.loses = loses;
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
        cc.find("Canvas/CROWNS/num").getComponent(cc.Label).string = myData.data.crowns;
        cc.find("Canvas/WINS").getComponent(cc.Label).string = myData.data.wins + " wins";
        cc.find("Canvas/LOSES").getComponent(cc.Label).string = myData.data.loses + " loses";
        cc.find("Canvas/USERNAME").getComponent(cc.Label).string = _this.playerName;
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

          cc.find("MANAGER").getComponent("aboutPlayer").playerId = this.playerId;
          cc.find("MANAGER").getComponent("aboutPlayer").room = myData.data[1];
          cc.find("MANAGER").getComponent("aboutPlayer").serverIp = this.serverIp;
          cc.find("MANAGER").getComponent("aboutPlayer").crowns = this.crowns;
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
            player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
            player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
          }
        }
      });
      console.log("refreshing");
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        cc.find("Lobby Manager").getComponent("lobby").leaderboardNode.removeAllChildren();
        var response = JSON.parse(xhr.responseText).data;

        for (var i = 0; i < response.length; i++) {
          var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerStatPrefab);
          player.parent = cc.find("Lobby Manager").getComponent("lobby").leaderboardNode;
          player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
          player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbG9iYnkuanMiXSwibmFtZXMiOlsicGF5TG9hZCIsInR5cGUiLCJkYXRhIiwiUGxheWVyRGF0YSIsImlkIiwieCIsInBvc1giLCJwb3NZIiwibmFtZSIsInN0YXR1cyIsImtleSIsIlBsYXllckluZm8iLCJjcm93bnMiLCJ3aW5zIiwibG9zZXMiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndzIiwicGxheWVyTmFtZU5vZGUiLCJOb2RlIiwicGxheWVyTmFtZSIsImpvaW5pbmciLCJidXR0b25UZXh0IiwibG9iYnlJbmZvVGV4dCIsImxvYmJ5U3RhdHVzVGV4dCIsInBsYXllcklkIiwiY29ubmVjdGVkIiwiZXJyb3JOb2RlIiwiY29ubmVjdGluZyIsInR1dG9yaWFscyIsInR1dG9yaWFsSW5kZXgiLCJ0dXRvcmlhbFBhZ2UiLCJ1c2VybmFtZU5vZGUiLCJzZXJ2ZXJJcCIsImhhdmVVc2VyRGF0YSIsInNob3dpbmdMZWFkZXJib2FyZCIsImxlYWRlcmJvYXJkTm9kZSIsImxlYWRlcmJvYXJkVGl0bGUiLCJwbGF5ZXJTdGF0UHJlZmFiIiwiUHJlZmFiIiwicGxheWVyUmVjb3JkUHJlZmFiIiwicmVjb3Jkc05vZGUiLCJyZWNvcmRzVGl0bGUiLCJzaWduSW5Ob2RlIiwiaW5wdXRVc2VybmFtZU5vZGUiLCJwYXNzd29yZE5vZGUiLCJwYXNzd29yZCIsImxvZ2luRXJyb3JOb2RlIiwic2hvd05leHQiLCJhY3RpdmUiLCJnaXZlU2lnbkluRXJyb3IiLCJlcnJvciIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwicHJlc3NTaWduSW4iLCJzaWduSW5VcCIsIkVkaXRCb3giLCJ0aGVOYW1lIiwidGhlUGFzc3dvcmQiLCJzZW50IiwidG9VcHBlckNhc2UiLCJsZW5ndGgiLCJpIiwiY2hhckNvZGVBdCIsIldlYlNvY2tldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm15RGF0YSIsInBhcnNlIiwiZmluZCIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJyZWZyZXNoTGVhZGVyIiwiam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5IiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInJlY2VpdmVNZXNzYWdlIiwidXBkYXRlVXNlcnMiLCJyb29tIiwibGVhdmVMb2JieSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidXBkYXRlU3RhdHVzIiwic2hvd0xlYWRlcmJvYXJkIiwiY2xvc2VMZWFkZXJib2FyZCIsImNsb3NlTG9iYnkiLCJjbG9zZUVycm9yIiwiam9pbkxvYmJ5Iiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJvcyIsImNsb3NlU29ja2V0IiwibnVtIiwicHJlc3NKb2luIiwid2F0Y2giLCJjcmVhdGVXZUNoYXRCdXR0b24iLCJyZXF1ZXN0Iiwic3VjY2VzcyIsInJlcyIsInJlbW92ZUFsbENoaWxkcmVuIiwicmVzcG9uc2UiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImdldENoaWxkQnlOYW1lIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZXNwb25zZVRleHQiLCJvcGVuIiwicmVmcmVzaFJlY29yZHMiLCJzcGVlZCIsIm9wZW5UdXRvcmlhbCIsIm5leHRUdXRvcmlhbCIsImdvVG9TdG9yeSIsInN5c0luZm8iLCJ3aW5kb3ciLCJnZXRTeXN0ZW1JbmZvU3luYyIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJnZXRVc2VySW5mbyIsInVzZXJJbmZvIiwibmlja05hbWUiLCJsb2dpbiIsImQiLCJhcHBpZCIsInNlY3JlY3QiLCJsIiwiY29kZSIsIm1ldGhvZCIsIm9wZW5pZCIsImJ1dHRvbiIsImNyZWF0ZVVzZXJJbmZvQnV0dG9uIiwidGV4dCIsInN0eWxlIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJsaW5lSGVpZ2h0Iiwib25UYXAiLCJkZXN0cm95Iiwib25Mb2FkIiwiZ2V0U3RvcmFnZSIsImZhaWwiLCJzZXRTdG9yYWdlIiwiZ2V0SXRlbSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxVQUNGLGlCQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QjtBQUNwQixPQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFDSjs7SUFFS0MsYUFDRixvQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFBQSxPQU1uQkMsSUFObUIsR0FNWixDQU5ZO0FBQUEsT0FPbkJDLElBUG1CLEdBT1osQ0FQWTtBQUFBLE9BUW5CQyxJQVJtQixHQVFaLElBUlk7QUFDZixPQUFLSixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0g7O0FBSUo7O0lBR0tDLGFBQ0Ysb0JBQVlQLEVBQVosRUFBZ0JJLElBQWhCLEVBQXNCSSxNQUF0QixFQUE4QkMsSUFBOUIsRUFBb0NDLEtBQXBDLEVBQTJDO0FBQ3ZDLE9BQUtWLEVBQUwsR0FBVUEsRUFBVjtBQUNBLE9BQUtJLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtJLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNIOztBQUNKO0FBRURDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxFQUFFLEVBQUUsSUFE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QUNIckosVUFBQUEsRUFBRSxDQUFDMkQsSUFBSCxDQUFRLGVBQVIsRUFBeUJwQixZQUF6QixDQUFzQyxPQUF0QyxFQUErQ3dFLFlBQS9DO0FBQ0E3QixVQUFBQSxFQUFFLENBQUNvRSxVQUFILENBQWM7QUFDVjNKLFlBQUFBLEdBQUcsRUFBRSxRQURLO0FBRVZSLFlBQUFBLElBQUksRUFBRTtBQUZJLFdBQWQ7QUFJSDtBQVpTLE9BQWQ7QUFjQSxXQUFLMkcsa0JBQUw7QUFDSCxLQWpCRCxNQWlCTTtBQUNGO0FBQ0EsVUFBSTlGLEVBQUUsQ0FBQzRELEdBQUgsQ0FBT0MsWUFBUCxDQUFvQjBGLE9BQXBCLENBQTRCLFVBQTVCLEtBQTJDLElBQTNDLElBQW1EdkosRUFBRSxDQUFDNEQsR0FBSCxDQUFPQyxZQUFQLENBQW9CMEYsT0FBcEIsQ0FBNEIsVUFBNUIsS0FBMkMsSUFBbEcsRUFBd0c7QUFDcEcsYUFBSzVHLFFBQUwsQ0FBY1ksSUFBSSxDQUFDRyxLQUFMLENBQVcxRCxFQUFFLENBQUM0RCxHQUFILENBQU9DLFlBQVAsQ0FBb0IwRixPQUFwQixDQUE0QixVQUE1QixDQUFYLENBQWQsRUFBbUVoRyxJQUFJLENBQUNHLEtBQUwsQ0FBVzFELEVBQUUsQ0FBQzRELEdBQUgsQ0FBT0MsWUFBUCxDQUFvQjBGLE9BQXBCLENBQTRCLFVBQTVCLENBQVgsQ0FBbkU7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLeEMsWUFBTDtBQUNBLGFBQUtqRixVQUFMLENBQWdCTSxNQUFoQixHQUF5QixJQUF6QjtBQUNIO0FBRUo7O0FBRUQsU0FBSzhCLGFBQUw7QUFFSCxHQS9mSTtBQWlnQkxzRixFQUFBQSxLQWpnQkssbUJBaWdCSSxDQUVSLENBbmdCSSxDQXFnQkw7O0FBcmdCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5cclxuY2xhc3MgUGxheWVySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgY3Jvd25zLCB3aW5zLCBsb3Nlcykge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gY3Jvd25zO1xyXG4gICAgICAgIHRoaXMud2lucyA9IHdpbnM7XHJcbiAgICAgICAgdGhpcy5sb3NlcyA9IGxvc2VzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICB3czogbnVsbCxcclxuICAgICAgICBwbGF5ZXJOYW1lTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJOYW1lOiBudWxsLFxyXG4gICAgICAgIGpvaW5pbmc6IGZhbHNlLFxyXG4gICAgICAgIGJ1dHRvblRleHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgbG9iYnlJbmZvVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBsb2JieVN0YXR1c1RleHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVySWQ6IG51bGwsXHJcbiAgICAgICAgY29ubmVjdGVkOiBmYWxzZSxcclxuICAgICAgICBzdGF0dXM6IFwiKHdhaXRpbmcgZm9yIHBsYXllcnMuLi4pXCIsXHJcblxyXG4gICAgICAgIGVycm9yTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBjb25uZWN0aW5nOiBmYWxzZSxcclxuXHJcbiAgICAgICAgdHV0b3JpYWxzOiBbY2MuTm9kZV0sXHJcbiAgICAgICAgdHV0b3JpYWxJbmRleDogMCxcclxuICAgICAgICB0dXRvcmlhbFBhZ2U6IGNjLk5vZGUsXHJcblxyXG4gICAgICAgIHVzZXJuYW1lTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBzZXJ2ZXJJcDogXCJcIixcclxuICAgICAgICBoYXZlVXNlckRhdGE6IGZhbHNlLFxyXG5cclxuICAgICAgICBzaG93aW5nTGVhZGVyYm9hcmQ6IHRydWUsXHJcbiAgICAgICAgbGVhZGVyYm9hcmROb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGxlYWRlcmJvYXJkVGl0bGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyU3RhdFByZWZhYjogY2MuUHJlZmFiLFxyXG5cclxuICAgICAgICBwbGF5ZXJSZWNvcmRQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICByZWNvcmRzTm9kZTogY2MuTm9kZSxcclxuICAgICAgICByZWNvcmRzVGl0bGU6IGNjLk5vZGUsXHJcblxyXG5cclxuICAgICAgICBzaWduSW5Ob2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGlucHV0VXNlcm5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhc3N3b3JkTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBwYXNzd29yZDogbnVsbCxcclxuICAgICAgICBjcm93bnM6IDAsXHJcbiAgICAgICAgbG9naW5FcnJvck5vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dOZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dpbmdMZWFkZXJib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZFRpdGxlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNUaXRsZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkVGl0bGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzVGl0bGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkc05vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2l2ZVNpZ25JbkVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGVycm9yO1xyXG4gICAgfSxcclxuICAgIHByZXNzU2lnbkluKCkge1xyXG4gICAgICAgIHRoaXMuc2lnbkluVXAodGhpcy5pbnB1dFVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nLCB0aGlzLnBhc3N3b3JkTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nKVxyXG4gICAgfSxcclxuICAgIHNpZ25JblVwKHRoZU5hbWUsdGhlUGFzc3dvcmQpIHtcclxuICAgICAgICBsZXQgc2VudCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGxheWVyTmFtZSA9IHRoZU5hbWUudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gdGhlUGFzc3dvcmQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZS5sZW5ndGggPCAxIHx8IHRoaXMucGFzc3dvcmQubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lL3Bhc3N3b3JkIHRvbyBzaG9ydFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOYW1lLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPCAnQScuY2hhckNvZGVBdCgpIHx8IHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPiAnWicuY2hhckNvZGVBdCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc3dvcmRbaV0uY2hhckNvZGVBdCgpIDwgJzAnLmNoYXJDb2RlQXQoKSB8fCB0aGlzLnBhc3N3b3JkW2ldLmNoYXJDb2RlQXQoKSA+ICd6Jy5jaGFyQ29kZUF0KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwicGFzc3dvcmQgaGFzIGludmFsaWQgY2hhcmFjdGVyc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghc2VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwic2lnbkluXCIsIFt0aGlzLnBsYXllck5hbWUsIHRoaXMucGFzc3dvcmRdKSkpOyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbXlEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgICAgaWYgKG15RGF0YS50eXBlID09IFwiZmFpbGVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwiY291bGRuJ3Qgc2lnbiBpbiAoY2hlY2sgaW5mbyBvciB1c2VybmFtZSBpcyB0YWtlbilcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChteURhdGEudHlwZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IG15RGF0YS5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcm93bnMgPSBteURhdGEuZGF0YS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL0NST1dOUy9udW1cIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBteURhdGEuZGF0YS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1dJTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBteURhdGEuZGF0YS53aW5zICsgXCIgd2luc1wiO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9MT1NFU1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLmxvc2VzICsgXCIgbG9zZXNcIjtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVVNFUk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLnBsYXllck5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLnBsYXllck5hbWUpKTtcclxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBhc3N3b3JkXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucGFzc3dvcmQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQgPSBcIiArIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaExlYWRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIGpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJqb2luZWQgbG9iYnlcIik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vaWYgKGNjLnN5cy5wbGF0Zm9ybSAhPSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgLy8gICAgdGhpcy5wbGF5ZXJJZCA9IHRoaXMucGxheWVyTmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZztcclxuXHJcbiAgICAgICAgdGhpcy5qb2luaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJ1dHRvblRleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIkNBTkNFTFwiO1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSk7XHJcbiAgICB9LFxyXG4gICAgcmVjZWl2ZU1lc3NhZ2UoZGF0YSkge1xyXG4gICAgICAgIGxldCBteURhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImxvYmJ5SW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVc2VycyhteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBsYXllckluZm9cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVySWQgPSBteURhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGF0dXNcIjpcclxuICAgICAgICAgICAgICAgIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0aW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWUgaXMgc3RhcnRpbmcgaW4gXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIihzdGFydGluZyBpbiBcIiArIG15RGF0YS5kYXRhWzFdICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3N0YXJ0IGdhbWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgdGhlUGxheWVySW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZDogdGhpcy5wbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBwb3J0OiBteURhdGEuZGF0YVsxXSxmXHJcbiAgICAgICAgICAgICAgICAgICAgLy99O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbW9kdWxlLmV4cG9ydHMgPSB0aGVQbGF5ZXJJbmZvO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5wbGF5ZXJJZCA9IHRoaXMucGxheWVySWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucm9vbSA9IG15RGF0YS5kYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJNQU5BR0VSXCIpLmdldENvbXBvbmVudChcImFib3V0UGxheWVyXCIpLnNlcnZlcklwID0gdGhpcy5zZXJ2ZXJJcDtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5jcm93bnMgPSB0aGlzLmNyb3ducztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobXlEYXRhLmRhdGFbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYXAxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjogY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFwMlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1hcDNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0b3BcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gXCIod2FpdGluZyBmb3IgcGxheWVycy4uLilcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2hvd0xlYWRlcmJvYXJkKCkge1xyXG4gICAgICAgIHRoaXMubGVhZGVyYm9hcmROb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VMZWFkZXJib2FyZCgpIHtcclxuICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUxvYmJ5KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGlzY29ubmVjdGVkXCIpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5qb2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5idXR0b25UZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJQTEFZXCI7XHJcbiAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb3NlRXJyb3IoKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgam9pbkxvYmJ5KCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5ZXNcIik7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6OTA5MVwiXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uT3BlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VsZG4ndCBjb25uZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlTG9iYnkoKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vXCIpO1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6OTA5MVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qb2luTG9iYnlTdWNjZXNzZnVsbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VsZG4ndCBjb25uZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VMb2JieSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGxlYXZlTG9iYnkoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5vcyA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2VTb2NrZXQoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVVc2VycyhudW0pIHtcclxuICAgICAgICAvL3RoaXMubG9iYnlJbmZvVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG51bSArIFwiLzEwIHBsYXllcnMgXCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVTdGF0dXMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLnN0YXR1cztcclxuICAgIH0sXHJcbiAgICBwcmVzc0pvaW4oKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcklkICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgIC8vIGNhbm5vdCBqb2luIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhdmVVc2VyRGF0YSB8fCBjYy5zeXMucGxhdGZvcm0gIT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuam9pbmluZyAmJiAhdGhpcy5jb25uZWN0aW5nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam9pbkxvYmJ5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25UZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJQTEFZXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IGZhbHNlOyB0aGlzLndhdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVdlQ2hhdEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmVmcmVzaExlYWRlcigpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMC9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHJlcy5kYXRhLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlkIC0gbmFtZSAtIGNyb3ducyAtIHdpbnMgLSBsb3Nlc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IGNjLmluc3RhbnRpYXRlKGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllclN0YXRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJQTEFDRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGkgKyAxICsgXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaGluZ1wiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZnJlc2hSZWNvcmRzKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWZyZXNoUmVjb3JkcygpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMS9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJSZWNvcmRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoaW5nXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWNvcmRzTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCIgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcImh0dHA6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjozMDAxL1wiKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgICBvcGVuVHV0b3JpYWwoKSB7XHJcbiAgICAgICAgdGhpcy50dXRvcmlhbFBhZ2UuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1swXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIG5leHRUdXRvcmlhbCgpIHtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1t0aGlzLnR1dG9yaWFsSW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxJbmRleCArPSAxOyAgICBcclxuICAgICAgICBpZiAodGhpcy50dXRvcmlhbEluZGV4IDwgdGhpcy50dXRvcmlhbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHV0b3JpYWxzW3RoaXMudHV0b3JpYWxJbmRleF0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR1dG9yaWFsUGFnZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50dXRvcmlhbEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGdvVG9TdG9yeSgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdG9yeVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlV2VDaGF0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZU5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWVOb2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHN5c0luZm8gPSB3aW5kb3cud3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHN5c0luZm8uc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBzeXNJbmZvLnNjcmVlbkhlaWdodDtcclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5hdXRoU2V0dGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJJbmZvXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiMVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS51c2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJOYW1lID0gdXNlckluZm8ubmlja05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuaGF2ZVVzZXJEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NmdWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5hcHBpZCA9IFwid3hhNjYwMmU1MDE2MjU0NzFmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnNlY3JlY3QgPSBcImEwYWY0Yzg5NmYyMmNlOWMwMGQ2MWEyNzRlMmFmYWQxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICdodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL3Nucy9qc2NvZGUyc2Vzc2lvbj9hcHBpZD0nICsgZC5hcHBpZCArICcmc2VjcmV0PScgKyBkLnNlY3JlY3QgKyAnJmpzX2NvZGU9JyArIHJlcy5jb2RlICsgJyZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLm9wZW5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllcklkID0gcmVzLmRhdGEub3BlbmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidXR0b24gPSB3eC5jcmVhdGVVc2VySW5mb0J1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnYWxsb3cgbWluaXByb2dyYW0gdG8gdXNlIGluZm8/JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZBRUIzQycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5vblRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlckluZm8gPSByZXMudXNlckluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikudXNlcm5hbWVOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdXNlckluZm8ubmlja05hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3BsYXllZCBiZWZvcmVcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5vcGVuVHV0b3JpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBcInllc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV2VDaGF0QnV0dG9uKCk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwbGF5ZWQgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPSBudWxsICYmIGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluVXAoSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSksIEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblR1dG9yaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25Jbk5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7ICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19