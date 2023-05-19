"use strict";
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