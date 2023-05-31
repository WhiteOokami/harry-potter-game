
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
        cc.find("Canvas/LOSES").getComponent(cc.Label).string = myData.data.loses + " losses";
        cc.find("Canvas/USERNAME").getComponent(cc.Label).string = _this.playerName;
        cc.find("MANAGER").getComponent("colorTheme").changeColor("hi", _this.houseIndex);
        cc.sys.localStorage.setItem("username", JSON.stringify(_this.playerName));
        cc.sys.localStorage.setItem("password", JSON.stringify(_this.password));
        _this.signInNode.active = false;
      }

      console.log("id = " + _this.playerId);

      _this.ws.close();

      _this.refreshLeader();
    });
  },
  changeHouse: function changeHouse(num) {
    var _this2 = this;

    this.houseIndex = num;
    this.ws = new WebSocket("ws://" + this.serverIp + ":3002");
    this.ws.addEventListener("open", function () {
      _this2.ws.send(JSON.stringify(new payLoad("house", [_this2.playerId, num])));
    });
    var that = this;
    this.ws.addEventListener('message', function (_ref2) {
      var data = _ref2.data;
      data = JSON.parse(data);
      if (data.type == "success") that.refreshLeader();
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
    var _this3 = this;

    this.connecting = true;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      console.log("yes");
      this.ws = wx.connectSocket({
        url: "ws://" + this.serverIp + ":9091"
      });
      this.ws.onOpen(function () {
        _this3.joinLobbySuccessfully();
      });
      this.ws.onMessage(function (_ref3) {
        var data = _ref3.data;

        _this3.receiveMessage(data);
      });
      this.ws.onError(function () {
        console.log("couldn't connect");
        _this3.errorNode.active = true;
        _this3.connecting = false;
      });
      this.ws.onClose(function () {
        _this3.closeLobby();
      });
    } else {
      console.log("no");
      this.ws = new WebSocket("ws://" + this.serverIp + ":9091");
      this.ws.addEventListener("open", function () {
        _this3.joinLobbySuccessfully();
      });
      this.ws.addEventListener('message', function (_ref4) {
        var data = _ref4.data;

        _this3.receiveMessage(data);
      });
      this.ws.addEventListener("error", function () {
        console.log("couldn't connect");
        _this3.errorNode.active = true;
        _this3.connecting = false;
      });
      this.ws.addEventListener("close", function () {
        _this3.closeLobby();
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
    var that = this;

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
            if (response[i].playerId == this.playerId) player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[this.houseIndex] + "] " + response[i].name;else player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[response[i].houseIndex] + "] " + response[i].name;
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
          if (response[i].playerId == that.playerId) player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[that.houseIndex] + "] " + response[i].name;else player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[response[i].houseIndex] + "] " + response[i].name;
          player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
        }
      };

      xhr.open("GET", "http://" + this.serverIp + ":3000/");
      xhr.send();
    }

    this.refreshRecords();
  },
  refreshRecords: function refreshRecords() {
    var houses = ["Gry", "Huf", "Rav", "Sly"];

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
            player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[response[i].houseIndex] + "] " + response[i].name;
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
          player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[response[i].houseIndex] + "] " + response[i].name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbG9iYnkuanMiXSwibmFtZXMiOlsicGF5TG9hZCIsInR5cGUiLCJkYXRhIiwiUGxheWVyRGF0YSIsImlkIiwieCIsInBvc1giLCJwb3NZIiwibmFtZSIsInN0YXR1cyIsImtleSIsIlBsYXllckluZm8iLCJjcm93bnMiLCJ3aW5zIiwibG9zZXMiLCJob3VzZUluZGV4IiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ3cyIsInBsYXllck5hbWVOb2RlIiwiTm9kZSIsInBsYXllck5hbWUiLCJqb2luaW5nIiwiYnV0dG9uVGV4dCIsImxvYmJ5SW5mb1RleHQiLCJsb2JieVN0YXR1c1RleHQiLCJwbGF5ZXJJZCIsImNvbm5lY3RlZCIsImVycm9yTm9kZSIsImNvbm5lY3RpbmciLCJ0dXRvcmlhbHMiLCJ0dXRvcmlhbEluZGV4IiwidHV0b3JpYWxQYWdlIiwidXNlcm5hbWVOb2RlIiwic2VydmVySXAiLCJoYXZlVXNlckRhdGEiLCJzaG93aW5nTGVhZGVyYm9hcmQiLCJsZWFkZXJib2FyZE5vZGUiLCJsZWFkZXJib2FyZFRpdGxlIiwicGxheWVyU3RhdFByZWZhYiIsIlByZWZhYiIsInBsYXllclJlY29yZFByZWZhYiIsInJlY29yZHNOb2RlIiwicmVjb3Jkc1RpdGxlIiwic2lnbkluTm9kZSIsImlucHV0VXNlcm5hbWVOb2RlIiwicGFzc3dvcmROb2RlIiwicGFzc3dvcmQiLCJsb2dpbkVycm9yTm9kZSIsInNob3dOZXh0IiwiYWN0aXZlIiwiZ2l2ZVNpZ25JbkVycm9yIiwiZXJyb3IiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsInByZXNzU2lnbkluIiwic2lnbkluVXAiLCJFZGl0Qm94IiwidGhlTmFtZSIsInRoZVBhc3N3b3JkIiwic2VudCIsInRvVXBwZXJDYXNlIiwibGVuZ3RoIiwiaSIsImNoYXJDb2RlQXQiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJteURhdGEiLCJwYXJzZSIsImZpbmQiLCJjaGFuZ2VDb2xvciIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJyZWZyZXNoTGVhZGVyIiwiY2hhbmdlSG91c2UiLCJudW0iLCJ0aGF0Iiwiam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5IiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInJlY2VpdmVNZXNzYWdlIiwidXBkYXRlVXNlcnMiLCJhYnAiLCJyb29tIiwibGVhdmVMb2JieSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidXBkYXRlU3RhdHVzIiwic2hvd0xlYWRlcmJvYXJkIiwiY2xvc2VMZWFkZXJib2FyZCIsImNsb3NlTG9iYnkiLCJjbG9zZUVycm9yIiwiam9pbkxvYmJ5Iiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJvcyIsImNsb3NlU29ja2V0IiwicHJlc3NKb2luIiwid2F0Y2giLCJjcmVhdGVXZUNoYXRCdXR0b24iLCJob3VzZXMiLCJyZXF1ZXN0Iiwic3VjY2VzcyIsInJlcyIsInJlbW92ZUFsbENoaWxkcmVuIiwicmVzcG9uc2UiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImdldENoaWxkQnlOYW1lIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZXNwb25zZVRleHQiLCJvcGVuIiwicmVmcmVzaFJlY29yZHMiLCJzcGVlZCIsIm9wZW5UdXRvcmlhbCIsIm5leHRUdXRvcmlhbCIsImdvVG9TdG9yeSIsInN5c0luZm8iLCJ3aW5kb3ciLCJnZXRTeXN0ZW1JbmZvU3luYyIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJnZXRVc2VySW5mbyIsInVzZXJJbmZvIiwibmlja05hbWUiLCJsb2dpbiIsImQiLCJhcHBpZCIsInNlY3JlY3QiLCJsIiwiY29kZSIsIm1ldGhvZCIsIm9wZW5pZCIsImJ1dHRvbiIsImNyZWF0ZVVzZXJJbmZvQnV0dG9uIiwidGV4dCIsInN0eWxlIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJsaW5lSGVpZ2h0Iiwib25UYXAiLCJkZXN0cm95Iiwib25Mb2FkIiwiZ2V0U3RvcmFnZSIsImZhaWwiLCJzZXRTdG9yYWdlIiwiZ2V0SXRlbSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxVQUNGLGlCQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QjtBQUNwQixPQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFDSjs7SUFFS0MsYUFDRixvQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFBQSxPQU1uQkMsSUFObUIsR0FNWixDQU5ZO0FBQUEsT0FPbkJDLElBUG1CLEdBT1osQ0FQWTtBQUFBLE9BUW5CQyxJQVJtQixHQVFaLElBUlk7QUFDZixPQUFLSixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0g7O0FBSUo7O0lBR0tDLGFBQ0Ysb0JBQVlQLEVBQVosRUFBZ0JJLElBQWhCLEVBQXNCSSxNQUF0QixFQUE4QkMsSUFBOUIsRUFBb0NDLEtBQXBDLEVBQTJDQyxVQUEzQyxFQUF1RDtBQUNuRCxPQUFLWCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLSSxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLSSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztB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WUFBekIsQ0FBc0MsT0FBdEMsRUFBK0M2RSxZQUEvQztBQUNBN0IsVUFBQUEsRUFBRSxDQUFDb0UsVUFBSCxDQUFjO0FBQ1ZqSyxZQUFBQSxHQUFHLEVBQUUsUUFESztBQUVWUixZQUFBQSxJQUFJLEVBQUU7QUFGSSxXQUFkO0FBSUg7QUFaUyxPQUFkO0FBY0EsV0FBS2dILGtCQUFMO0FBQ0gsS0FqQkQsTUFpQk07QUFDRjtBQUNBLFVBQUlsRyxFQUFFLENBQUM2RCxHQUFILENBQU9DLFlBQVAsQ0FBb0I4RixPQUFwQixDQUE0QixVQUE1QixLQUEyQyxJQUEzQyxJQUFtRDVKLEVBQUUsQ0FBQzZELEdBQUgsQ0FBT0MsWUFBUCxDQUFvQjhGLE9BQXBCLENBQTRCLFVBQTVCLEtBQTJDLElBQWxHLEVBQXdHO0FBQ3BHLGFBQUtqSCxRQUFMLENBQWNZLElBQUksQ0FBQ0csS0FBTCxDQUFXMUQsRUFBRSxDQUFDNkQsR0FBSCxDQUFPQyxZQUFQLENBQW9COEYsT0FBcEIsQ0FBNEIsVUFBNUIsQ0FBWCxDQUFkLEVBQW1FckcsSUFBSSxDQUFDRyxLQUFMLENBQVcxRCxFQUFFLENBQUM2RCxHQUFILENBQU9DLFlBQVAsQ0FBb0I4RixPQUFwQixDQUE0QixVQUE1QixDQUFYLENBQW5FO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsYUFBS3hDLFlBQUw7QUFDQSxhQUFLdEYsVUFBTCxDQUFnQk0sTUFBaEIsR0FBeUIsSUFBekI7QUFDSDtBQUVKOztBQUVELFNBQUsrQixhQUFMO0FBRUgsR0F0aEJJO0FBd2hCTDBGLEVBQUFBLEtBeGhCSyxtQkF3aEJJLENBRVIsQ0ExaEJJLENBNGhCTDs7QUE1aEJLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHBheUxvYWQge1xyXG4gICAgY29uc3RydWN0b3IodHlwZSwgZGF0YSkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbmNsYXNzIFBsYXllckRhdGEge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIHgpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XHJcbiAgICAgICAgdGhpcy5rZXkgPSAnJztcclxuICAgIH1cclxuICAgIHBvc1ggPSAwO1xyXG4gICAgcG9zWSA9IDA7XHJcbiAgICBuYW1lID0gbnVsbDtcclxufTtcclxuXHJcblxyXG5jbGFzcyBQbGF5ZXJJbmZvIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBuYW1lLCBjcm93bnMsIHdpbnMsIGxvc2VzLCBob3VzZUluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jcm93bnMgPSBjcm93bnM7XHJcbiAgICAgICAgdGhpcy53aW5zID0gd2lucztcclxuICAgICAgICB0aGlzLmxvc2VzID0gbG9zZXM7XHJcbiAgICAgICAgdGhpcy5ob3VzZUluZGV4ID0gaG91c2VJbmRleDtcclxuICAgIH1cclxufTtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgd3M6IG51bGwsXHJcbiAgICAgICAgcGxheWVyTmFtZU5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyTmFtZTogbnVsbCxcclxuICAgICAgICBqb2luaW5nOiBmYWxzZSxcclxuICAgICAgICBidXR0b25UZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGxvYmJ5SW5mb1RleHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgbG9iYnlTdGF0dXNUZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllcklkOiBudWxsLFxyXG4gICAgICAgIGNvbm5lY3RlZDogZmFsc2UsXHJcbiAgICAgICAgc3RhdHVzOiBcIih3YWl0aW5nIGZvciBwbGF5ZXJzLi4uKVwiLFxyXG5cclxuICAgICAgICBlcnJvck5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgY29ubmVjdGluZzogZmFsc2UsXHJcblxyXG4gICAgICAgIHR1dG9yaWFsczogW2NjLk5vZGVdLFxyXG4gICAgICAgIHR1dG9yaWFsSW5kZXg6IDAsXHJcbiAgICAgICAgdHV0b3JpYWxQYWdlOiBjYy5Ob2RlLFxyXG5cclxuICAgICAgICB1c2VybmFtZU5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgc2VydmVySXA6IFwiXCIsXHJcbiAgICAgICAgaGF2ZVVzZXJEYXRhOiBmYWxzZSxcclxuXHJcbiAgICAgICAgc2hvd2luZ0xlYWRlcmJvYXJkOiB0cnVlLFxyXG4gICAgICAgIGxlYWRlcmJvYXJkTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBsZWFkZXJib2FyZFRpdGxlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllclN0YXRQcmVmYWI6IGNjLlByZWZhYixcclxuXHJcbiAgICAgICAgcGxheWVyUmVjb3JkUHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgcmVjb3Jkc05vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcmVjb3Jkc1RpdGxlOiBjYy5Ob2RlLFxyXG5cclxuXHJcbiAgICAgICAgc2lnbkluTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBpbnB1dFVzZXJuYW1lTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBwYXNzd29yZE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IG51bGwsXHJcbiAgICAgICAgY3Jvd25zOiAwLFxyXG4gICAgICAgIGhvdXNlSW5kZXg6IDAsXHJcbiAgICAgICAgbG9naW5FcnJvck5vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dOZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dpbmdMZWFkZXJib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZFRpdGxlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNUaXRsZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkVGl0bGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzVGl0bGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkc05vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2l2ZVNpZ25JbkVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGVycm9yO1xyXG4gICAgfSxcclxuICAgIHByZXNzU2lnbkluKCkge1xyXG4gICAgICAgIHRoaXMuc2lnbkluVXAodGhpcy5pbnB1dFVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nLCB0aGlzLnBhc3N3b3JkTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nKVxyXG4gICAgfSxcclxuICAgIHNpZ25JblVwKHRoZU5hbWUsdGhlUGFzc3dvcmQpIHtcclxuICAgICAgICBsZXQgc2VudCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGxheWVyTmFtZSA9IHRoZU5hbWUudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gdGhlUGFzc3dvcmQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZS5sZW5ndGggPCAxIHx8IHRoaXMucGFzc3dvcmQubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lL3Bhc3N3b3JkIHRvbyBzaG9ydFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOYW1lLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPCAnQScuY2hhckNvZGVBdCgpIHx8IHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPiAnWicuY2hhckNvZGVBdCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc3dvcmRbaV0uY2hhckNvZGVBdCgpIDwgJzAnLmNoYXJDb2RlQXQoKSB8fCB0aGlzLnBhc3N3b3JkW2ldLmNoYXJDb2RlQXQoKSA+ICd6Jy5jaGFyQ29kZUF0KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwicGFzc3dvcmQgaGFzIGludmFsaWQgY2hhcmFjdGVyc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghc2VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwic2lnbkluXCIsIFt0aGlzLnBsYXllck5hbWUsIHRoaXMucGFzc3dvcmRdKSkpOyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbXlEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgICAgaWYgKG15RGF0YS50eXBlID09IFwiZmFpbGVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwiY291bGRuJ3Qgc2lnbiBpbiAoY2hlY2sgaW5mbyBvciB1c2VybmFtZSBpcyB0YWtlbilcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChteURhdGEudHlwZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IG15RGF0YS5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcm93bnMgPSBteURhdGEuZGF0YS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXNlSW5kZXggPSBteURhdGEuZGF0YS5ob3VzZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9DUk9XTlMvbnVtXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbXlEYXRhLmRhdGEuY3Jvd25zO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9XSU5TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbXlEYXRhLmRhdGEud2lucyArIFwiIHdpbnNcIjtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvTE9TRVNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBteURhdGEuZGF0YS5sb3NlcyArIFwiIGxvc3Nlc1wiO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VU0VSTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMucGxheWVyTmFtZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJNQU5BR0VSXCIpLmdldENvbXBvbmVudChcImNvbG9yVGhlbWVcIikuY2hhbmdlQ29sb3IoXCJoaVwiLHRoaXMuaG91c2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLnBsYXllck5hbWUpKTtcclxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBhc3N3b3JkXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucGFzc3dvcmQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQgPSBcIiArIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaExlYWRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIGNoYW5nZUhvdXNlKG51bSl7XHJcbiAgICAgICAgdGhpcy5ob3VzZUluZGV4ID0gbnVtO1xyXG4gICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjozMDAyXCIpO1xyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQoXCJob3VzZVwiLCBbdGhpcy5wbGF5ZXJJZCwgbnVtXSkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS50eXBlID09IFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICAgICAgICAgdGhhdC5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuICAgIGpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJqb2luZWQgbG9iYnlcIik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vaWYgKGNjLnN5cy5wbGF0Zm9ybSAhPSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgLy8gICAgdGhpcy5wbGF5ZXJJZCA9IHRoaXMucGxheWVyTmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZztcclxuXHJcbiAgICAgICAgdGhpcy5qb2luaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJ1dHRvblRleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIkNBTkNFTFwiO1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSk7XHJcbiAgICB9LFxyXG4gICAgcmVjZWl2ZU1lc3NhZ2UoZGF0YSkge1xyXG4gICAgICAgIGxldCBteURhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImxvYmJ5SW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVc2VycyhteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBsYXllckluZm9cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVySWQgPSBteURhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGF0dXNcIjpcclxuICAgICAgICAgICAgICAgIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0aW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWUgaXMgc3RhcnRpbmcgaW4gXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIihzdGFydGluZyBpbiBcIiArIG15RGF0YS5kYXRhWzFdICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3N0YXJ0IGdhbWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgdGhlUGxheWVySW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZDogdGhpcy5wbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBwb3J0OiBteURhdGEuZGF0YVsxXSxmXHJcbiAgICAgICAgICAgICAgICAgICAgLy99O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbW9kdWxlLmV4cG9ydHMgPSB0aGVQbGF5ZXJJbmZvO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWJwID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLnBsYXllcklkID0gdGhpcy5wbGF5ZXJJZDtcclxuICAgICAgICAgICAgICAgICAgICBhYnAucm9vbSA9IG15RGF0YS5kYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGFicC5zZXJ2ZXJJcCA9IHRoaXMuc2VydmVySXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLmNyb3ducyA9IHRoaXMuY3Jvd25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGFicC5ob3VzZUluZGV4ID0gdGhpcy5ob3VzZUluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlYXZlTG9iYnkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChteURhdGEuZGF0YVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1hcDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOiBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYXAyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzogY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFwM1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG15RGF0YS5kYXRhWzBdID09IFwic3RvcFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIih3YWl0aW5nIGZvciBwbGF5ZXJzLi4uKVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG93TGVhZGVyYm9hcmQoKSB7XHJcbiAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUxlYWRlcmJvYXJkKCkge1xyXG4gICAgICAgIHRoaXMubGVhZGVyYm9hcmROb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlTG9iYnkoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJkaXNjb25uZWN0ZWRcIik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmpvaW5pbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJ1dHRvblRleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIlBMQVlcIjtcclxuICAgICAgICB0aGlzLmxlYXZlTG9iYnkoKTtcclxuICAgICAgICAvL3RoaXMubG9iYnlJbmZvVGV4dC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvYmJ5U3RhdHVzVGV4dC5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvc2VFcnJvcigpIHtcclxuICAgICAgICB0aGlzLmVycm9yTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBqb2luTG9iYnkoKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInllc1wiKTtcclxuICAgICAgICAgICAgdGhpcy53cyA9IHd4LmNvbm5lY3RTb2NrZXQoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICtcIjo5MDkxXCJcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbk1lc3NhZ2UoKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25FcnJvcigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvdWxkbid0IGNvbm5lY3RcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbkNsb3NlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VMb2JieSgpOyAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm9cIik7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjo5MDkxXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvdWxkbid0IGNvbm5lY3RcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiY2xvc2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUxvYmJ5KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgbGVhdmVMb2JieSgpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLm9zID09IGNjLnN5cy5XRUNIQVRfR0FNRSlcclxuICAgICAgICAgICAgdGhpcy53cy5jbG9zZVNvY2tldCgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZVVzZXJzKG51bSkge1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbnVtICsgXCIvMTAgcGxheWVycyBcIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZVN0YXR1cygpIHtcclxuICAgICAgICB0aGlzLmxvYmJ5U3RhdHVzVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuc3RhdHVzO1xyXG4gICAgfSxcclxuICAgIHByZXNzSm9pbigpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hMZWFkZXIoKTtcclxuICAgICAgICAgICAgLy8gY2Fubm90IGpvaW4gbXVsdGlwbGUgdGltZXNcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGF2ZVVzZXJEYXRhIHx8IGNjLnN5cy5wbGF0Zm9ybSAhPSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5qb2luaW5nICYmICF0aGlzLmNvbm5lY3RpbmcpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb2luTG9iYnkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmpvaW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvblRleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIlBMQVlcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlYXZlTG9iYnkoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYmJ5SW5mb1RleHQuYWN0aXZlID0gZmFsc2U7IHRoaXMud2F0Y2hcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYmJ5U3RhdHVzVGV4dC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlV2VDaGF0QnV0dG9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZWZyZXNoTGVhZGVyKCkge1xyXG4gICAgICAgIGxldCBob3VzZXMgPSAgW1wiR3J5XCIsIFwiSHVmXCIsIFwiUmF2XCIsIFwiU2x5XCJdO1xyXG4gICAgICAgIGxldCB0aGF0PXRoaXM7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZVtpXS5wbGF5ZXJJZCA9PSB0aGlzLnBsYXllcklkKSBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYFske2hvdXNlc1t0aGlzLmhvdXNlSW5kZXhdfV0gYCArIHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGBbJHtob3VzZXNbcmVzcG9uc2VbaV0uaG91c2VJbmRleF19XSBgICsgcmVzcG9uc2VbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiQ1JPV05TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uY3Jvd25zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZnJlc2hpbmdcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZVtpXS5wbGF5ZXJJZCA9PSB0aGF0LnBsYXllcklkKSBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYFske2hvdXNlc1t0aGF0LmhvdXNlSW5kZXhdfV0gYCArIHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYFske2hvdXNlc1tyZXNwb25zZVtpXS5ob3VzZUluZGV4XX1dIGAgKyByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIkNST1dOU1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHJlc3BvbnNlW2ldLmNyb3ducztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMC9cIik7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaFJlY29yZHMoKTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHJlZnJlc2hSZWNvcmRzKCkge1xyXG4gICAgICAgIGxldCBob3VzZXMgPSBbXCJHcnlcIiwgXCJIdWZcIiwgXCJSYXZcIiwgXCJTbHlcIl07XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDEvXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnJlY29yZHNOb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gcmVzLmRhdGEuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWQgLSBuYW1lIC0gY3Jvd25zIC0gd2lucyAtIGxvc2VzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnJlY29yZHNOb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJQTEFDRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGkgKyAxICsgXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBgWyR7aG91c2VzW3Jlc3BvbnNlW2ldLmhvdXNlSW5kZXhdfV0gYCArIHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoaW5nXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWNvcmRzTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBgWyR7aG91c2VzW3Jlc3BvbnNlW2ldLmhvdXNlSW5kZXhdfV0gYCArIHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiU1BFRURcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5zcGVlZCArIFwiIHNcIiA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDEvXCIpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuICAgIG9wZW5UdXRvcmlhbCgpIHtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsUGFnZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxzWzBdLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgbmV4dFR1dG9yaWFsKCkge1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxzW3RoaXMudHV0b3JpYWxJbmRleF0uYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50dXRvcmlhbEluZGV4ICs9IDE7ICAgIFxyXG4gICAgICAgIGlmICh0aGlzLnR1dG9yaWFsSW5kZXggPCB0aGlzLnR1dG9yaWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy50dXRvcmlhbHNbdGhpcy50dXRvcmlhbEluZGV4XS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudHV0b3JpYWxQYWdlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnR1dG9yaWFsSW5kZXggPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZ29Ub1N0b3J5KCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcInN0b3J5XCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVXZUNoYXRCdXR0b24oKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJOYW1lTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy51c2VybmFtZU5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgc3lzSW5mbyA9IHdpbmRvdy53eC5nZXRTeXN0ZW1JbmZvU3luYygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHdpZHRoID0gc3lzSW5mby5zY3JlZW5XaWR0aDtcclxuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHN5c0luZm8uc2NyZWVuSGVpZ2h0O1xyXG4gICAgICAgICAgICB3eC5nZXRTZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmF1dGhTZXR0aW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nW1wic2NvcGUudXNlckluZm9cIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikudXNlcm5hbWVOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCIxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LmdldFVzZXJJbmZvKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJbmZvID0gcmVzLnVzZXJJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHVzZXJJbmZvLm5pY2tOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllck5hbWUgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5oYXZlVXNlckRhdGEgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc2Z1bFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLmFwcGlkID0gXCJ3eGE2NjAyZTUwMTYyNTQ3MWZcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQuc2VjcmVjdCA9IFwiYTBhZjRjODk2ZjIyY2U5YzAwZDYxYTI3NGUyYWZhZDFcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gJ2h0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vc25zL2pzY29kZTJzZXNzaW9uP2FwcGlkPScgKyBkLmFwcGlkICsgJyZzZWNyZXQ9JyArIGQuc2VjcmVjdCArICcmanNfY29kZT0nICsgcmVzLmNvZGUgKyAnJmdyYW50X3R5cGU9YXV0aG9yaXphdGlvbl9jb2RlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEub3BlbmlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVySWQgPSByZXMuZGF0YS5vcGVuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnJlZnJlc2hMZWFkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IHd4LmNyZWF0ZVVzZXJJbmZvQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdhbGxvdyBtaW5pcHJvZ3JhbSB0byB1c2UgaW5mbz8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRkFFQjNDJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLm9uVGFwKChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlckluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NvbWV0aGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS51c2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG5cclxuICAgICAgICAgICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICBrZXk6IFwicGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcGxheWVkIGJlZm9yZVxyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLm9wZW5UdXRvcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwicGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFwieWVzXCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVXZUNoYXRCdXR0b24oKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHBsYXllZCBiZWZvcmVcclxuICAgICAgICAgICAgaWYgKGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9IG51bGwgJiYgY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduSW5VcChKU09OLnBhcnNlKGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpKSwgSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwYXNzd29yZFwiKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuVHV0b3JpYWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlZnJlc2hMZWFkZXIoKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbn0pO1xyXG4iXX0=