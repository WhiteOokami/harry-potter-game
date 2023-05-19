
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/client.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a81a2Ib2/pKLaqHfaR6js1d', 'client');
// code/client.js

"use strict";

var payLoad = function payLoad(type, data) {
  this.type = type;
  this.data = data;
};

;

var PlayerData = function PlayerData(id, x) {
  this.posX = 0;
  this.posY = 0;
  this.scaleY = 0;
  this.scaleX = 0;
  this.lives = 3;
  this.name = null;
  this.id = id;
  this.x = x;
  this.status = 0;
  this.key = '';
};

;

function roundNumber(rnum, rlength) {
  var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
  return newnumber;
}

cc.Class({
  "extends": cc.Component,
  properties: {
    playerId: 0,
    ws: null,
    players: null,
    playerPrefab: {
      "default": null,
      type: cc.Prefab
    },
    myPlayer: null,
    port: null,
    startPlace: cc.Node,
    timer: cc.Node,
    watch: cc.Node,
    myTime: 0,
    enemies: cc.Node,
    won: false,
    countDown: null,
    items: cc.Node,
    shortOnTime: false,
    watchAnim: cc.Animation,
    connectionErrorUI: cc.Node,
    socketClosed: false,
    potionPrefab: cc.Prefab,
    cakePrefab: cc.Prefab,
    gameStarted: false,
    startScreen: cc.Node,
    crowns: 0,
    chestPrefab: cc.Prefab,
    serverIp: "",
    pointsLost: 0
  },
  sendWebsocketMessage: function sendWebsocketMessage(type, message) {
    if (!this.connectionErrorUI.active) {
      if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        this.ws.send({
          data: JSON.stringify(new payLoad(type, message))
        });
      } else {
        this.ws.send(JSON.stringify(new payLoad(type, message)));
      }
    }
  },
  sendPlayerState: function sendPlayerState(state) {
    this.sendWebsocketMessage("updatePlayerState", [this.playerId, state]);
  },
  sendEnemyState: function sendEnemyState(state, position, enemy) {
    this.sendWebsocketMessage("updateEnemy", [this.playerId, position, state, enemy]);
  },
  sendItemState: function sendItemState(id, state, type, pos) {
    // delay chest spawn
    if (type == "chest" && state == "spawn") {
      this.scheduleOnce(function () {
        this.sendWebsocketMessage("updateItem", [id, state, type, pos]);
      }, 3);
    } else {
      this.sendWebsocketMessage("updateItem", [id, state, type, pos]);
    }
  },
  sendEmoji: function sendEmoji(event, customEventData) {
    // send emoji, customEventData will be the type
    this.sendWebsocketMessage("emoji", [this.playerId, customEventData]);
    this.node.getComponent("gameManager").hideEmojis();
  },
  createPlayer: function createPlayer(player) {
    //my character
    if (player.id == this.playerId) {
      this.myPlayer = cc.instantiate(this.playerPrefab);
      this.myPlayer.parent = cc.find("Canvas/Players");
      this.myPlayer.x = this.startPlace.x;
      this.myPlayer.y = this.startPlace.y;
      this.myPlayer.name = player.id;
      this.myPlayer.getChildByName("nameTag").getComponent(cc.Label).string = player.name;
      this.myPlayer.id = player.id;
      this.players[player.id] = this.myPlayer;
    } else {
      var aPlayer = cc.instantiate(this.playerPrefab);
      aPlayer.parent = cc.find("Canvas/Players");
      aPlayer.x = this.startPlace.x;
      aPlayer.y = this.startPlace.y;
      aPlayer.name = player.id;
      aPlayer.id = player.id;
      aPlayer.getChildByName("nameTag").getComponent(cc.Label).string = player.name;
      aPlayer.getChildByName("nameTag").color = cc.Color.WHITE;
      this.players[player.id] = aPlayer;
    }
  },
  updatePlayer: function updatePlayer(playerId, state) {
    var thePlayer = this.players[playerId];

    switch (state) {
      case "right":
        thePlayer.getComponent("movement").moveRight();
        break;

      case "left":
        thePlayer.getComponent("movement").moveLeft();
        break;

      case "jump":
        thePlayer.getComponent("movement").jump();
        break;

      case "stopX":
        thePlayer.getComponent("movement").stopX();
        break;

      case "stopY":
        thePlayer.getComponent("movement").stopY();
        break;
    }
  },
  updateEnemy: function updateEnemy(playerId, position, state, enemy) {
    var thePlayer = this.players[playerId];

    switch (state) {
      case "chaseNew":
        this.enemies.getChildByName(enemy).getComponent("enemyScript").chasePlayer(thePlayer);
        break;

      case "right":
        this.enemies.getChildByName(enemy).getComponent("enemyScript").moveRight();
        break;

      case "left":
        this.enemies.getChildByName(enemy).getComponent("enemyScript").moveLeft();
        break;

      case "jump":
        this.enemies.getChildByName(enemy).getComponent("enemyScript").jump();
        break;

      case "position":
        this.enemies.getChildByName(enemy).x = position[0];
        this.enemies.getChildByName(enemy).y = position[1];
        break;
      //    case "stopX":
      //        this.enemies.getComponent("movement").stopX();
      //        break;
      //    case "stopY":
      //        this.enemies.getComponent("movement").stopY();
      //        break;
    }
  },
  updatePlayerPosition: function updatePlayerPosition(player) {
    this.players[player.id].x = player.posX;
    this.players[player.id].y = player.posY;
    this.players[player.id].setScale(player.scaleX, player.scaleY); //console.log(player.id + " " + player.scaleY + " " + player.scaleX);
  },
  removePlayer: function removePlayer(player) {
    this.players[player.id].destroy();
    this.players["delete"](player.id);
  },
  updateTime: function updateTime(time) {
    //change time on watch according to countdown time
    if (this.countDown - time >= 0) {
      this.timer.getComponent(cc.Label).string = time;
      this.watch.angle = -(time * 360 / this.countDown - 90);
      this.myTime = time;

      if (!this.shortOnTime && this.countDown - time < 15) {
        this.watchAnim = this.watch.getParent().getComponent(cc.Animation).play("shortOnTime");
        this.watchAnim.wrapMode = cc.WrapMode.Loop;
        this.shortOnTime = true;
      }
    } else {
      if (this.shortOnTime) {
        this.watchAnim.stop("shortOnTime");
        this.watch.getParent().color = cc.Color.RED;
        cc.find("system").getComponent("gameManager").timesUp();
        this.shortOnTime = false; //play lose sound & lose crowns

        if (!this.won) {
          cc.find("system").getChildByName("AUDIO").getChildByName("LOSE").getComponent(cc.AudioSource).play();
          console.log(this.crowns);
          if (this.crowns > 30) this.node.getComponent("gameManager").showCrowns(this.pointsLost);else this.node.getComponent("gameManager").showCrowns(0);
        }
      }
    }
  },
  disconnect: function disconnect() {
    this.socketClosed = true;
    if (cc.sys.os == cc.sys.WECHAT_GAME) this.ws.closeSocket();else this.ws.close();
  },
  updateItem: function updateItem(id, state, type, pos) {
    if (state == "used") this.items.getChildByName(type + id).destroy();else if (state == "spawn") {
      var theItem = null;
      if (type == "potion") theItem = cc.instantiate(this.potionPrefab);else if (type == "cake") theItem = cc.instantiate(this.cakePrefab);else if (type == "chest") theItem = cc.instantiate(this.chestPrefab);
      theItem.x = pos[0];
      theItem.y = pos[1];
      theItem.parent = this.items;
      theItem.name = type + id;
      theItem.getComponent("item").id = id; //console.log(id);
    }
  },
  updateEmoji: function updateEmoji(id, type) {
    this.players[id].getComponent("movement").playEmoji(type);
  },
  startCountDown: function startCountDown(num) {
    this.startScreen.active = true;

    if (num == 0) {
      this.startScreen.active = false;
      this.gameStarted = true;
    } else {
      this.startScreen.getChildByName("NUM").getComponent(cc.Label).string = num;
    }
  },
  recieveMessage: function recieveMessage(data) {
    var myData = JSON.parse(data);

    switch (myData.type) {
      case "updatePlayerState":
        if (myData.data[0] != this.playerId) {
          this.updatePlayer(myData.data[0], myData.data[1]);
        }

        break;

      case "remove":
        this.removePlayer(myData.data);
        break;

      case "initRoom":
        //set coundown time
        this.countDown = myData.data[1];
        this.pointsLost = myData.data[2];
        console.log(this.countDown); //add players

        for (var i in myData.data[0]) {
          this.createPlayer(myData.data[0][i]);
        }

        break;

      case "positions":
        for (var i in myData.data) {
          if (this.playerId != myData.data[i].id) this.updatePlayerPosition(myData.data[i]);
        }

        break;

      case "finish":
        if (this.playerId == myData.data[0].id) {
          this.node.getComponent("gameManager").showWinners();
          this.node.getComponent("gameManager").showCrowns(myData.data[2]);
        }

        this.node.getComponent("gameManager").addWinner(myData.data[0], myData.data[1]);
        break;

      case "time":
        // update the time on watch
        this.updateTime(myData.data);
        break;

      case "updateEnemy":
        if (myData.data[0] != this.playerId) this.updateEnemy(myData.data[0], myData.data[1], myData.data[2], myData.data[3]);
        break;

      case "updateItem":
        this.updateItem(myData.data[0], myData.data[1], myData.data[2], myData.data[3]); //this.enemies.getComponent("enemyScript").chasePlayer(this.players[myData.data[0]]);

        break;

      case "emoji":
        this.updateEmoji(myData.data[0], myData.data[1]);
        break;

      case "start":
        this.startCountDown(myData.data);
        break;
    }
  },
  joinServer: function joinServer() {
    var _this = this;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      this.ws = wx.connectSocket({
        url: "ws://" + this.serverIp + ":" + this.port
      });
      this.ws.onOpen(function () {
        console.log("we are connected");

        _this.sendWebsocketMessage("playerInfo", _this.playerId);
      });
      this.ws.onMessage(function (_ref) {
        var data = _ref.data;

        _this.recieveMessage(data);
      });
      this.ws.onError(function () {
        console.log("error");
        _this.connectionErrorUI.active = true;
        cc.find("Canvas/UI/MOBILE").active = false;
      });
      this.ws.onClose(function () {
        // if didn't close on purpose, alert
        if (!_this.socketClosed) {
          _this.connectionErrorUI.active = true;
          cc.find("Canvas/UI/MOBILE").active = false;
        }
      });
    } else {
      this.ws = new WebSocket("ws://" + this.serverIp + ":" + this.port);
      this.ws.addEventListener("open", function () {
        console.log("we are connected");

        _this.sendWebsocketMessage("playerInfo", _this.playerId);
      });
      this.ws.addEventListener("error", function () {
        console.log("error");
        _this.connectionErrorUI.active = true;
        cc.find("Canvas/UI/MOBILE").active = false;
      });
      this.ws.addEventListener("close", function () {
        // if didn't close on purpose, alert
        if (!_this.socketClosed) {
          _this.connectionErrorUI.active = true;
          cc.find("Canvas/UI/MOBILE").active = false;
        }
      });
      this.ws.addEventListener('message', function (_ref2) {
        var data = _ref2.data;

        _this.recieveMessage(data); //if (myData.type == "updatePlayerState") {
        //    //console.log(myData);
        //    //console.log(myData.data[0] + " " + myData.data[1]);
        //    if (myData.data[0] != this.playerId) {
        //        this.updatePlayer(myData.data[0], myData.data[1]);
        //    }
        //}
        //else if (myData.type == "remove") {
        //    this.removePlayer(myData.data);
        //}
        //else if (myData.type == "addPlayers") {
        //    for (var i in myData.data) {
        //        this.createPlayer(myData.data[i]);
        //    }
        //}
        //else if (myData.type == "positions") {
        //    for (var i in myData.data) {
        //        if (this.playerId != myData.data[i].id)
        //            this.updatePlayerPosition(myData.data[i]);
        //    }
        //}
        //else if (myData.type == "finish") {
        //    if (this.playerId == myData.data[0].id) {
        //        this.node.getComponent("gameManager").showWinners();
        //    }
        //    this.node.getComponent("gameManager").addWinner(myData.data[0], myData.data[1]);
        //}
        //else if (myData.type == "time") {
        //    // update the time on watch
        //    this.updateTime(myData.data);
        //}

      });
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    //var info = require("lobby.js");
    //this.playerId = info.id;
    //this.port = info.port;
    this.pointsLost = 5;
    this.playerId = cc.find("MANAGER").getComponent("aboutPlayer").playerId;
    this.port = cc.find("MANAGER").getComponent("aboutPlayer").room;
    this.serverIp = cc.find("MANAGER").getComponent("aboutPlayer").serverIp;
    this.crowns = cc.find("MANAGER").getComponent("aboutPlayer").crowns;
    this.players = new Map();
    this.joinServer();
  },
  start: function start() {},
  update: function update(dt) {
    if (this.myPlayer != null) this.sendWebsocketMessage("position", [this.myPlayer.x, this.myPlayer.y, roundNumber(this.myPlayer.scaleY, 5), roundNumber(this.myPlayer.scaleX, 5)]);
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2xpZW50LmpzIl0sIm5hbWVzIjpbInBheUxvYWQiLCJ0eXBlIiwiZGF0YSIsIlBsYXllckRhdGEiLCJpZCIsIngiLCJwb3NYIiwicG9zWSIsInNjYWxlWSIsInNjYWxlWCIsImxpdmVzIiwibmFtZSIsInN0YXR1cyIsImtleSIsInJvdW5kTnVtYmVyIiwicm51bSIsInJsZW5ndGgiLCJuZXdudW1iZXIiLCJNYXRoIiwicm91bmQiLCJwb3ciLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllcklkIiwid3MiLCJwbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwibXlQbGF5ZXIiLCJwb3J0Iiwic3RhcnRQbGFjZSIsIk5vZGUiLCJ0aW1lciIsIndhdGNoIiwibXlUaW1lIiwiZW5lbWllcyIsIndvbiIsImNvdW50RG93biIsIml0ZW1zIiwic2hvcnRPblRpbWUiLCJ3YXRjaEFuaW0iLCJBbmltYXRpb24iLCJjb25uZWN0aW9uRXJyb3JVSSIsInNvY2tldENsb3NlZCIsInBvdGlvblByZWZhYiIsImNha2VQcmVmYWIiLCJnYW1lU3RhcnRlZCIsInN0YXJ0U2NyZWVuIiwiY3Jvd25zIiwiY2hlc3RQcmVmYWIiLCJzZXJ2ZXJJcCIsInBvaW50c0xvc3QiLCJzZW5kV2Vic29ja2V0TWVzc2FnZSIsIm1lc3NhZ2UiLCJhY3RpdmUiLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZW5kUGxheWVyU3RhdGUiLCJzdGF0ZSIsInNlbmRFbmVteVN0YXRlIiwicG9zaXRpb24iLCJlbmVteSIsInNlbmRJdGVtU3RhdGUiLCJwb3MiLCJzY2hlZHVsZU9uY2UiLCJzZW5kRW1vamkiLCJldmVudCIsImN1c3RvbUV2ZW50RGF0YSIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJoaWRlRW1vamlzIiwiY3JlYXRlUGxheWVyIiwicGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJmaW5kIiwieSIsImdldENoaWxkQnlOYW1lIiwiTGFiZWwiLCJzdHJpbmciLCJhUGxheWVyIiwiY29sb3IiLCJDb2xvciIsIldISVRFIiwidXBkYXRlUGxheWVyIiwidGhlUGxheWVyIiwibW92ZVJpZ2h0IiwibW92ZUxlZnQiLCJqdW1wIiwic3RvcFgiLCJzdG9wWSIsInVwZGF0ZUVuZW15IiwiY2hhc2VQbGF5ZXIiLCJ1cGRhdGVQbGF5ZXJQb3NpdGlvbiIsInNldFNjYWxlIiwicmVtb3ZlUGxheWVyIiwiZGVzdHJveSIsInVwZGF0ZVRpbWUiLCJ0aW1lIiwiYW5nbGUiLCJnZXRQYXJlbnQiLCJwbGF5Iiwid3JhcE1vZGUiLCJXcmFwTW9kZSIsIkxvb3AiLCJzdG9wIiwiUkVEIiwidGltZXNVcCIsIkF1ZGlvU291cmNlIiwiY29uc29sZSIsImxvZyIsInNob3dDcm93bnMiLCJkaXNjb25uZWN0Iiwib3MiLCJjbG9zZVNvY2tldCIsImNsb3NlIiwidXBkYXRlSXRlbSIsInRoZUl0ZW0iLCJ1cGRhdGVFbW9qaSIsInBsYXlFbW9qaSIsInN0YXJ0Q291bnREb3duIiwibnVtIiwicmVjaWV2ZU1lc3NhZ2UiLCJteURhdGEiLCJwYXJzZSIsImkiLCJzaG93V2lubmVycyIsImFkZFdpbm5lciIsImpvaW5TZXJ2ZXIiLCJ3eCIsImNvbm5lY3RTb2NrZXQiLCJ1cmwiLCJvbk9wZW4iLCJvbk1lc3NhZ2UiLCJvbkVycm9yIiwib25DbG9zZSIsIldlYlNvY2tldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbkxvYWQiLCJyb29tIiwiTWFwIiwic3RhcnQiLCJ1cGRhdGUiLCJkdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsVUFDRixpQkFBWUMsSUFBWixFQUFrQkMsSUFBbEIsRUFBd0I7QUFDcEIsT0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0g7O0FBQ0o7O0lBRUtDLGFBQ0Ysb0JBQVlDLEVBQVosRUFBZ0JDLENBQWhC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QUFDUCxRQUFJLEtBQUt2SCxRQUFMLElBQWlCLElBQXJCLEVBQ0ksS0FBS3dCLG9CQUFMLENBQTBCLFVBQTFCLEVBQXNDLENBQUMsS0FBS3hCLFFBQUwsQ0FBY3pCLENBQWYsRUFBa0IsS0FBS3lCLFFBQUwsQ0FBY29ELENBQWhDLEVBQW1DcEUsV0FBVyxDQUFDLEtBQUtnQixRQUFMLENBQWN0QixNQUFmLEVBQXNCLENBQXRCLENBQTlDLEVBQXdFTSxXQUFXLENBQUMsS0FBS2dCLFFBQUwsQ0FBY3JCLE1BQWYsRUFBc0IsQ0FBdEIsQ0FBbkYsQ0FBdEM7QUFFUDtBQS9ZSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgc2NhbGVZID0gMDtcclxuICAgIHNjYWxlWCA9IDA7XHJcbiAgICBsaXZlcyA9IDM7XHJcbiAgICBuYW1lID0gbnVsbDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJvdW5kTnVtYmVyKHJudW0sIHJsZW5ndGgpIHtcclxuICAgIHZhciBuZXdudW1iZXIgPSBNYXRoLnJvdW5kKHJudW0gKiBNYXRoLnBvdygxMCwgcmxlbmd0aCkpIC8gTWF0aC5wb3coMTAsIHJsZW5ndGgpO1xyXG4gICAgcmV0dXJuIG5ld251bWJlcjtcclxufVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcklkOiAwLFxyXG4gICAgICAgIHdzOiBudWxsLFxyXG4gICAgICAgIHBsYXllcnM6IG51bGwsXHJcbiAgICAgICAgcGxheWVyUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG4gICAgICAgIG15UGxheWVyOiBudWxsLFxyXG4gICAgICAgIHBvcnQ6IG51bGwsXHJcbiAgICAgICAgc3RhcnRQbGFjZTogY2MuTm9kZSxcclxuICAgICAgICB0aW1lcjogY2MuTm9kZSxcclxuICAgICAgICB3YXRjaDogY2MuTm9kZSxcclxuICAgICAgICBteVRpbWU6IDAsXHJcbiAgICAgICAgZW5lbWllczogY2MuTm9kZSxcclxuICAgICAgICB3b246IGZhbHNlLFxyXG4gICAgICAgIGNvdW50RG93bjogbnVsbCxcclxuICAgICAgICBpdGVtczogY2MuTm9kZSxcclxuICAgICAgICBzaG9ydE9uVGltZTogZmFsc2UsXHJcbiAgICAgICAgd2F0Y2hBbmltOiBjYy5BbmltYXRpb24sXHJcbiAgICAgICAgY29ubmVjdGlvbkVycm9yVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgc29ja2V0Q2xvc2VkOiBmYWxzZSxcclxuICAgICAgICBwb3Rpb25QcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICBjYWtlUHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgZ2FtZVN0YXJ0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHN0YXJ0U2NyZWVuOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBjaGVzdFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIHBvaW50c0xvc3Q6IDAsXHJcbiAgICB9LFxyXG4gICAgc2VuZFdlYnNvY2tldE1lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uRXJyb3JVSS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKHR5cGUsIG1lc3NhZ2UpKSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZCh0eXBlLCBtZXNzYWdlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRQbGF5ZXJTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVQbGF5ZXJTdGF0ZVwiLCBbdGhpcy5wbGF5ZXJJZCwgc3RhdGVdKTtcclxuICAgIH0sXHJcbiAgICBzZW5kRW5lbXlTdGF0ZShzdGF0ZSwgcG9zaXRpb24sIGVuZW15KSB7XHJcbiAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUVuZW15XCIsIFt0aGlzLnBsYXllcklkLCBwb3NpdGlvbiwgc3RhdGUsIGVuZW15XSk7XHJcbiAgICB9LFxyXG4gICAgc2VuZEl0ZW1TdGF0ZShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIC8vIGRlbGF5IGNoZXN0IHNwYXduXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJjaGVzdFwiICYmIHN0YXRlID09IFwic3Bhd25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7IHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVJdGVtXCIsIFtpZCwgc3RhdGUsIHR5cGUsIHBvc10pO30sMyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUl0ZW1cIiwgW2lkLCBzdGF0ZSwgdHlwZSwgcG9zXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRFbW9qaTogZnVuY3Rpb24gKGV2ZW50LCBjdXN0b21FdmVudERhdGEpIHtcclxuICAgICAgICAvLyBzZW5kIGVtb2ppLCBjdXN0b21FdmVudERhdGEgd2lsbCBiZSB0aGUgdHlwZVxyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJlbW9qaVwiLCBbdGhpcy5wbGF5ZXJJZCwgY3VzdG9tRXZlbnREYXRhXSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmhpZGVFbW9qaXMoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVQbGF5ZXIocGxheWVyKSB7XHJcbiAgICAgICAgLy9teSBjaGFyYWN0ZXJcclxuICAgICAgICBpZiAocGxheWVyLmlkID09IHRoaXMucGxheWVySWQpIHtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnNcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIueCA9IHRoaXMuc3RhcnRQbGFjZS54O1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLnkgPSB0aGlzLnN0YXJ0UGxhY2UueTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5uYW1lID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmlkID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXSA9IHRoaXMubXlQbGF5ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFQbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllclByZWZhYik7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzXCIpO1xyXG4gICAgICAgICAgICBhUGxheWVyLnggPSB0aGlzLnN0YXJ0UGxhY2UueDtcclxuICAgICAgICAgICAgYVBsYXllci55ID0gdGhpcy5zdGFydFBsYWNlLnk7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIubmFtZSA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5pZCA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0gPSBhUGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGVQbGF5ZXIocGxheWVySWQsIHN0YXRlKSB7XHJcbiAgICAgICAgbGV0IHRoZVBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bXBcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0b3BYXCI6XHJcbiAgICAgICAgICAgICAgICB0aGVQbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFgoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFlcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVuZW15KHBsYXllcklkLCBwb3NpdGlvbixzdGF0ZSwgZW5lbXkpIHtcclxuICAgICAgICBsZXQgdGhlUGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaGFzZU5ld1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5jaGFzZVBsYXllcih0aGVQbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJqdW1wXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRDaGlsZEJ5TmFtZShlbmVteSkueCA9IHBvc2l0aW9uWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS55ID0gcG9zaXRpb25bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyAgICBjYXNlIFwic3RvcFhcIjpcclxuICAgICAgICAvLyAgICAgICAgdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLnN0b3BYKCk7XHJcbiAgICAgICAgLy8gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vICAgIGNhc2UgXCJzdG9wWVwiOlxyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFkoKTtcclxuICAgICAgICAvLyAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlUGxheWVyUG9zaXRpb24ocGxheWVyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0ueCA9IHBsYXllci5wb3NYO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLnkgPSBwbGF5ZXIucG9zWTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXS5zZXRTY2FsZShwbGF5ZXIuc2NhbGVYLCBwbGF5ZXIuc2NhbGVZKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBsYXllci5pZCArIFwiIFwiICsgcGxheWVyLnNjYWxlWSArIFwiIFwiICsgcGxheWVyLnNjYWxlWCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUGxheWVyKHBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMuZGVsZXRlKHBsYXllci5pZCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVGltZSh0aW1lKSB7XHJcbiAgICAgICAgLy9jaGFuZ2UgdGltZSBvbiB3YXRjaCBhY2NvcmRpbmcgdG8gY291bnRkb3duIHRpbWVcclxuICAgICAgICBpZiAoKHRoaXMuY291bnREb3duIC0gdGltZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGltZTtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hbmdsZSA9IC0gKCh0aW1lICogMzYwKSAvIHRoaXMuY291bnREb3duIC0gOTApO1xyXG4gICAgICAgICAgICB0aGlzLm15VGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG9ydE9uVGltZSAmJiAodGhpcy5jb3VudERvd24gLSB0aW1lKSA8IDE1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbSA9IHRoaXMud2F0Y2guZ2V0UGFyZW50KCkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInNob3J0T25UaW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaEFuaW0ud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG9ydE9uVGltZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3J0T25UaW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbS5zdG9wKFwic2hvcnRPblRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoLmdldFBhcmVudCgpLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS50aW1lc1VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3J0T25UaW1lID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wbGF5IGxvc2Ugc291bmQgJiBsb3NlIGNyb3duc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLndvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q2hpbGRCeU5hbWUoXCJBVURJT1wiKS5nZXRDaGlsZEJ5TmFtZShcIkxPU0VcIikuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jcm93bnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyb3ducyA+IDMwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Nyb3ducyh0aGlzLnBvaW50c0xvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMoMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zb2NrZXRDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlSXRlbShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBcInVzZWRcIilcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5nZXRDaGlsZEJ5TmFtZSh0eXBlICsgaWQpLmRlc3Ryb3koKTtcclxuICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PSBcInNwYXduXCIpIHtcclxuICAgICAgICAgICAgbGV0IHRoZUl0ZW0gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJwb3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBvdGlvblByZWZhYik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYWtlUHJlZmFiKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzdFByZWZhYik7XHJcblxyXG4gICAgICAgICAgICB0aGVJdGVtLnggPSBwb3NbMF07XHJcbiAgICAgICAgICAgIHRoZUl0ZW0ueSA9IHBvc1sxXTtcclxuICAgICAgICAgICAgdGhlSXRlbS5wYXJlbnQgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgICAgICB0aGVJdGVtLm5hbWUgPSB0eXBlICsgaWQ7XHJcbiAgICAgICAgICAgIHRoZUl0ZW0uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCA9IGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVtb2ppKGlkLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW2lkXS5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5wbGF5RW1vamkodHlwZSk7XHJcbiAgICB9LFxyXG4gICAgc3RhcnRDb3VudERvd24obnVtKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGlmIChudW0gPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmdldENoaWxkQnlOYW1lKFwiTlVNXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbnVtO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWNpZXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVBsYXllclN0YXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0Um9vbVwiOlxyXG4gICAgICAgICAgICAgICAgLy9zZXQgY291bmRvd24gdGltZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudERvd24gPSBteURhdGEuZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzTG9zdCA9IG15RGF0YS5kYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3VudERvd24pO1xyXG4gICAgICAgICAgICAgICAgLy9hZGQgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBteURhdGEuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMobXlEYXRhLmRhdGFbMl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmFkZFdpbm5lcihteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRpbWUgb24gd2F0Y2hcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZShteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZUVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVuZW15KG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoaXMucGxheWVyc1tteURhdGEuZGF0YVswXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbW9qaVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbW9qaShteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBqb2luU2VydmVyKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6XCIgKyB0aGlzLnBvcnRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2UgYXJlIGNvbm5lY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwbGF5ZXJJbmZvXCIsIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBkaWRuJ3QgY2xvc2Ugb24gcHVycG9zZSwgYWxlcnRcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb2NrZXRDbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvclVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICArIFwiOlwiICsgdGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBhcmUgY29ubmVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBsYXllckluZm9cIiwgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpZG4ndCBjbG9zZSBvbiBwdXJwb3NlLCBhbGVydFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvY2tldENsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTsgICBcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChteURhdGEudHlwZSA9PSBcInVwZGF0ZVBsYXllclN0YXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2cobXlEYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKG15RGF0YS5kYXRhWzBdICsgXCIgXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJyZW1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiYWRkUGxheWVyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIobXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInBvc2l0aW9uc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiZmluaXNoXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuYWRkV2lubmVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vIHVwZGF0ZSB0aGUgdGltZSBvbiB3YXRjaFxyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy51cGRhdGVUaW1lKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vdmFyIGluZm8gPSByZXF1aXJlKFwibG9iYnkuanNcIik7XHJcbiAgICAgICAgLy90aGlzLnBsYXllcklkID0gaW5mby5pZDtcclxuICAgICAgICAvL3RoaXMucG9ydCA9IGluZm8ucG9ydDtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludHNMb3N0ID0gNTtcclxuICAgICAgICB0aGlzLnBsYXllcklkID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucGxheWVySWQ7XHJcbiAgICAgICAgdGhpcy5wb3J0ID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucm9vbTtcclxuICAgICAgICB0aGlzLnNlcnZlcklwID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikuc2VydmVySXA7XHJcbiAgICAgICAgdGhpcy5jcm93bnMgPSBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5jcm93bnM7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgdGhpcy5qb2luU2VydmVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBpZiAodGhpcy5teVBsYXllciAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmRXZWJzb2NrZXRNZXNzYWdlKFwicG9zaXRpb25cIiwgW3RoaXMubXlQbGF5ZXIueCwgdGhpcy5teVBsYXllci55LCByb3VuZE51bWJlcih0aGlzLm15UGxheWVyLnNjYWxlWSw1KSwgcm91bmROdW1iZXIodGhpcy5teVBsYXllci5zY2FsZVgsNSldKTtcclxuXHJcbiAgICB9LFxyXG59KTtcclxuIl19