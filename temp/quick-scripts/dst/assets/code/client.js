
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
    houseIndex: 0,
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
    console.log("send emoji");
    this.sendWebsocketMessage("emoji", [this.playerId, customEventData]);
    this.node.getComponent("gameManager").showEmojis();
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
    console.log("playing ");
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
          cc.find("Canvas/mainCamera/UI/MOBILE").active = false;
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
    var abp = cc.find("MANAGER").getComponent("aboutPlayer");
    this.playerId = abp.playerId;
    this.port = abp.room;
    this.serverIp = abp.serverIp;
    this.crowns = abp.crowns;
    this.houseIndex = abp.houseIndex;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2xpZW50LmpzIl0sIm5hbWVzIjpbInBheUxvYWQiLCJ0eXBlIiwiZGF0YSIsIlBsYXllckRhdGEiLCJpZCIsIngiLCJwb3NYIiwicG9zWSIsInNjYWxlWSIsInNjYWxlWCIsImxpdmVzIiwibmFtZSIsInN0YXR1cyIsImtleSIsInJvdW5kTnVtYmVyIiwicm51bSIsInJsZW5ndGgiLCJuZXdudW1iZXIiLCJNYXRoIiwicm91bmQiLCJwb3ciLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllcklkIiwid3MiLCJwbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwibXlQbGF5ZXIiLCJwb3J0Iiwic3RhcnRQbGFjZSIsIk5vZGUiLCJ0aW1lciIsIndhdGNoIiwibXlUaW1lIiwiZW5lbWllcyIsIndvbiIsImNvdW50RG93biIsIml0ZW1zIiwic2hvcnRPblRpbWUiLCJ3YXRjaEFuaW0iLCJBbmltYXRpb24iLCJjb25uZWN0aW9uRXJyb3JVSSIsInNvY2tldENsb3NlZCIsInBvdGlvblByZWZhYiIsImNha2VQcmVmYWIiLCJnYW1lU3RhcnRlZCIsInN0YXJ0U2NyZWVuIiwiY3Jvd25zIiwiaG91c2VJbmRleCIsImNoZXN0UHJlZmFiIiwic2VydmVySXAiLCJwb2ludHNMb3N0Iiwic2VuZFdlYnNvY2tldE1lc3NhZ2UiLCJtZXNzYWdlIiwiYWN0aXZlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VuZFBsYXllclN0YXRlIiwic3RhdGUiLCJzZW5kRW5lbXlTdGF0ZSIsInBvc2l0aW9uIiwiZW5lbXkiLCJzZW5kSXRlbVN0YXRlIiwicG9zIiwic2NoZWR1bGVPbmNlIiwic2VuZEVtb2ppIiwiZXZlbnQiLCJjdXN0b21FdmVudERhdGEiLCJjb25zb2xlIiwibG9nIiwibm9kZSIsImdldENvbXBvbmVudCIsInNob3dFbW9qaXMiLCJjcmVhdGVQbGF5ZXIiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImZpbmQiLCJ5IiwiZ2V0Q2hpbGRCeU5hbWUiLCJMYWJlbCIsInN0cmluZyIsImFQbGF5ZXIiLCJjb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJ1cGRhdGVQbGF5ZXIiLCJ0aGVQbGF5ZXIiLCJtb3ZlUmlnaHQiLCJtb3ZlTGVmdCIsImp1bXAiLCJzdG9wWCIsInN0b3BZIiwidXBkYXRlRW5lbXkiLCJjaGFzZVBsYXllciIsInVwZGF0ZVBsYXllclBvc2l0aW9uIiwic2V0U2NhbGUiLCJyZW1vdmVQbGF5ZXIiLCJkZXN0cm95IiwidXBkYXRlVGltZSIsInRpbWUiLCJhbmdsZSIsImdldFBhcmVudCIsInBsYXkiLCJ3cmFwTW9kZSIsIldyYXBNb2RlIiwiTG9vcCIsInN0b3AiLCJSRUQiLCJ0aW1lc1VwIiwiQXVkaW9Tb3VyY2UiLCJzaG93Q3Jvd25zIiwiZGlzY29ubmVjdCIsIm9zIiwiY2xvc2VTb2NrZXQiLCJjbG9zZSIsInVwZGF0ZUl0ZW0iLCJ0aGVJdGVtIiwidXBkYXRlRW1vamkiLCJwbGF5RW1vamkiLCJzdGFydENvdW50RG93biIsIm51bSIsInJlY2lldmVNZXNzYWdlIiwibXlEYXRhIiwicGFyc2UiLCJpIiwic2hvd1dpbm5lcnMiLCJhZGRXaW5uZXIiLCJqb2luU2VydmVyIiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Mb2FkIiwiYWJwIiwicm9vbSIsIk1hcCIsInN0YXJ0IiwidXBkYXRlIiwiZHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLFVBQ0YsaUJBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCO0FBQ3BCLE9BQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNIOztBQUNKOztJQUVLQyxhQUNGLG9CQUFZ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SyxtQkEyWUcsQ0FFUCxDQTdZSTtBQStZTEMsRUFBQUEsTUEvWUssa0JBK1lFQyxFQS9ZRixFQStZTTtBQUNQLFFBQUksS0FBS3pILFFBQUwsSUFBaUIsSUFBckIsRUFDSSxLQUFLeUIsb0JBQUwsQ0FBMEIsVUFBMUIsRUFBc0MsQ0FBQyxLQUFLekIsUUFBTCxDQUFjekIsQ0FBZixFQUFrQixLQUFLeUIsUUFBTCxDQUFjdUQsQ0FBaEMsRUFBbUN2RSxXQUFXLENBQUMsS0FBS2dCLFFBQUwsQ0FBY3RCLE1BQWYsRUFBc0IsQ0FBdEIsQ0FBOUMsRUFBd0VNLFdBQVcsQ0FBQyxLQUFLZ0IsUUFBTCxDQUFjckIsTUFBZixFQUFzQixDQUF0QixDQUFuRixDQUF0QztBQUVQO0FBblpJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHBheUxvYWQge1xyXG4gICAgY29uc3RydWN0b3IodHlwZSwgZGF0YSkge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIH1cclxufTtcclxuXHJcbmNsYXNzIFBsYXllckRhdGEge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIHgpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XHJcbiAgICAgICAgdGhpcy5rZXkgPSAnJztcclxuICAgIH1cclxuICAgIHBvc1ggPSAwO1xyXG4gICAgcG9zWSA9IDA7XHJcbiAgICBzY2FsZVkgPSAwO1xyXG4gICAgc2NhbGVYID0gMDtcclxuICAgIGxpdmVzID0gMztcclxuICAgIG5hbWUgPSBudWxsO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gcm91bmROdW1iZXIocm51bSwgcmxlbmd0aCkge1xyXG4gICAgdmFyIG5ld251bWJlciA9IE1hdGgucm91bmQocm51bSAqIE1hdGgucG93KDEwLCBybGVuZ3RoKSkgLyBNYXRoLnBvdygxMCwgcmxlbmd0aCk7XHJcbiAgICByZXR1cm4gbmV3bnVtYmVyO1xyXG59XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVySWQ6IDAsXHJcbiAgICAgICAgd3M6IG51bGwsXHJcbiAgICAgICAgcGxheWVyczogbnVsbCxcclxuICAgICAgICBwbGF5ZXJQcmVmYWI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbXlQbGF5ZXI6IG51bGwsXHJcbiAgICAgICAgcG9ydDogbnVsbCxcclxuICAgICAgICBzdGFydFBsYWNlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVyOiBjYy5Ob2RlLFxyXG4gICAgICAgIHdhdGNoOiBjYy5Ob2RlLFxyXG4gICAgICAgIG15VGltZTogMCxcclxuICAgICAgICBlbmVtaWVzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHdvbjogZmFsc2UsXHJcbiAgICAgICAgY291bnREb3duOiBudWxsLFxyXG4gICAgICAgIGl0ZW1zOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNob3J0T25UaW1lOiBmYWxzZSxcclxuICAgICAgICB3YXRjaEFuaW06IGNjLkFuaW1hdGlvbixcclxuICAgICAgICBjb25uZWN0aW9uRXJyb3JVSTogY2MuTm9kZSxcclxuICAgICAgICBzb2NrZXRDbG9zZWQ6IGZhbHNlLFxyXG4gICAgICAgIHBvdGlvblByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIGNha2VQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICBnYW1lU3RhcnRlZDogZmFsc2UsXHJcbiAgICAgICAgc3RhcnRTY3JlZW46IGNjLk5vZGUsXHJcbiAgICAgICAgY3Jvd25zOiAwLFxyXG4gICAgICAgIGhvdXNlSW5kZXg6IDAsXHJcbiAgICAgICAgY2hlc3RQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICBzZXJ2ZXJJcDogXCJcIixcclxuICAgICAgICBwb2ludHNMb3N0OiAwLFxyXG4gICAgfSxcclxuICAgIHNlbmRXZWJzb2NrZXRNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndzLnNlbmQoeyBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZCh0eXBlLCBtZXNzYWdlKSkgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQodHlwZSwgbWVzc2FnZSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBzZW5kUGxheWVyU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICB0aGlzLnNlbmRXZWJzb2NrZXRNZXNzYWdlKFwidXBkYXRlUGxheWVyU3RhdGVcIiwgW3RoaXMucGxheWVySWQsIHN0YXRlXSk7XHJcbiAgICB9LFxyXG4gICAgc2VuZEVuZW15U3RhdGUoc3RhdGUsIHBvc2l0aW9uLCBlbmVteSkge1xyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVFbmVteVwiLCBbdGhpcy5wbGF5ZXJJZCwgcG9zaXRpb24sIHN0YXRlLCBlbmVteV0pO1xyXG4gICAgfSxcclxuICAgIHNlbmRJdGVtU3RhdGUoaWQsIHN0YXRlLCB0eXBlLCBwb3MpIHtcclxuICAgICAgICAvLyBkZWxheSBjaGVzdCBzcGF3blxyXG4gICAgICAgIGlmICh0eXBlID09IFwiY2hlc3RcIiAmJiBzdGF0ZSA9PSBcInNwYXduXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkgeyB0aGlzLnNlbmRXZWJzb2NrZXRNZXNzYWdlKFwidXBkYXRlSXRlbVwiLCBbaWQsIHN0YXRlLCB0eXBlLCBwb3NdKTt9LDMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVJdGVtXCIsIFtpZCwgc3RhdGUsIHR5cGUsIHBvc10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBzZW5kRW1vamk6IGZ1bmN0aW9uIChldmVudCwgY3VzdG9tRXZlbnREYXRhKSB7XHJcbiAgICAgICAgLy8gc2VuZCBlbW9qaSwgY3VzdG9tRXZlbnREYXRhIHdpbGwgYmUgdGhlIHR5cGVcclxuICAgICAgICBjb25zb2xlLmxvZyhcInNlbmQgZW1vamlcIik7XHJcbiAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcImVtb2ppXCIsIFt0aGlzLnBsYXllcklkLCBjdXN0b21FdmVudERhdGFdKTtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Vtb2ppcygpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVBsYXllcihwbGF5ZXIpIHtcclxuICAgICAgICAvL215IGNoYXJhY3RlclxyXG4gICAgICAgIGlmIChwbGF5ZXIuaWQgPT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVyc1wiKTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci54ID0gdGhpcy5zdGFydFBsYWNlLng7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIueSA9IHRoaXMuc3RhcnRQbGFjZS55O1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLm5hbWUgPSBwbGF5ZXIuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJuYW1lVGFnXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxheWVyLm5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIuaWQgPSBwbGF5ZXIuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdID0gdGhpcy5teVBsYXllcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICAgICAgYVBsYXllci5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnNcIik7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIueCA9IHRoaXMuc3RhcnRQbGFjZS54O1xyXG4gICAgICAgICAgICBhUGxheWVyLnkgPSB0aGlzLnN0YXJ0UGxhY2UueTtcclxuICAgICAgICAgICAgYVBsYXllci5uYW1lID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICBhUGxheWVyLmlkID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICBhUGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICBhUGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXSA9IGFQbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVBsYXllcihwbGF5ZXJJZCwgc3RhdGUpIHtcclxuICAgICAgICBsZXQgdGhlUGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGVQbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikubW92ZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwianVtcFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFhcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdG9wWVwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLnN0b3BZKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRW5lbXkocGxheWVySWQsIHBvc2l0aW9uLHN0YXRlLCBlbmVteSkge1xyXG4gICAgICAgIGxldCB0aGVQbGF5ZXIgPSB0aGlzLnBsYXllcnNbcGxheWVySWRdO1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImNoYXNlTmV3XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoZVBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bXBcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRDaGlsZEJ5TmFtZShlbmVteSkuZ2V0Q29tcG9uZW50KFwiZW5lbXlTY3JpcHRcIikuanVtcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwb3NpdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS54ID0gcG9zaXRpb25bMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLnkgPSBwb3NpdGlvblsxXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vICAgIGNhc2UgXCJzdG9wWFwiOlxyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFgoKTtcclxuICAgICAgICAvLyAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gICAgY2FzZSBcInN0b3BZXCI6XHJcbiAgICAgICAgLy8gICAgICAgIHRoaXMuZW5lbWllcy5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWSgpO1xyXG4gICAgICAgIC8vICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB1cGRhdGVQbGF5ZXJQb3NpdGlvbihwbGF5ZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXS54ID0gcGxheWVyLnBvc1g7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0ueSA9IHBsYXllci5wb3NZO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLnNldFNjYWxlKHBsYXllci5zY2FsZVgsIHBsYXllci5zY2FsZVkpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocGxheWVyLmlkICsgXCIgXCIgKyBwbGF5ZXIuc2NhbGVZICsgXCIgXCIgKyBwbGF5ZXIuc2NhbGVYKTtcclxuICAgIH0sXHJcbiAgICByZW1vdmVQbGF5ZXIocGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0uZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMucGxheWVycy5kZWxldGUocGxheWVyLmlkKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVUaW1lKHRpbWUpIHtcclxuICAgICAgICAvL2NoYW5nZSB0aW1lIG9uIHdhdGNoIGFjY29yZGluZyB0byBjb3VudGRvd24gdGltZVxyXG4gICAgICAgIGlmICgodGhpcy5jb3VudERvd24gLSB0aW1lKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZXIuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aW1lO1xyXG4gICAgICAgICAgICB0aGlzLndhdGNoLmFuZ2xlID0gLSAoKHRpbWUgKiAzNjApIC8gdGhpcy5jb3VudERvd24gLSA5MCk7XHJcbiAgICAgICAgICAgIHRoaXMubXlUaW1lID0gdGltZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3J0T25UaW1lICYmICh0aGlzLmNvdW50RG93biAtIHRpbWUpIDwgMTUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2F0Y2hBbmltID0gdGhpcy53YXRjaC5nZXRQYXJlbnQoKS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKS5wbGF5KFwic2hvcnRPblRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3J0T25UaW1lID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvcnRPblRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2F0Y2hBbmltLnN0b3AoXCJzaG9ydE9uVGltZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2F0Y2guZ2V0UGFyZW50KCkuY29sb3IgPSBjYy5Db2xvci5SRUQ7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnRpbWVzVXAoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvcnRPblRpbWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3BsYXkgbG9zZSBzb3VuZCAmIGxvc2UgY3Jvd25zXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMud29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDaGlsZEJ5TmFtZShcIkFVRElPXCIpLmdldENoaWxkQnlOYW1lKFwiTE9TRVwiKS5nZXRDb21wb25lbnQoY2MuQXVkaW9Tb3VyY2UpLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNyb3ducyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3Jvd25zID4gMzApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS5zaG93Q3Jvd25zKHRoaXMucG9pbnRzTG9zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Nyb3ducygwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLnNvY2tldENsb3NlZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5vcyA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2VTb2NrZXQoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVJdGVtKGlkLCBzdGF0ZSwgdHlwZSwgcG9zKSB7XHJcbiAgICAgICAgaWYgKHN0YXRlID09IFwidXNlZFwiKVxyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLmdldENoaWxkQnlOYW1lKHR5cGUgKyBpZCkuZGVzdHJveSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKHN0YXRlID09IFwic3Bhd25cIikge1xyXG4gICAgICAgICAgICBsZXQgdGhlSXRlbSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInBvdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgdGhlSXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucG90aW9uUHJlZmFiKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNha2VcIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNha2VQcmVmYWIpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwiY2hlc3RcIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXN0UHJlZmFiKTtcclxuXHJcbiAgICAgICAgICAgIHRoZUl0ZW0ueCA9IHBvc1swXTtcclxuICAgICAgICAgICAgdGhlSXRlbS55ID0gcG9zWzFdO1xyXG4gICAgICAgICAgICB0aGVJdGVtLnBhcmVudCA9IHRoaXMuaXRlbXM7XHJcbiAgICAgICAgICAgIHRoZUl0ZW0ubmFtZSA9IHR5cGUgKyBpZDtcclxuICAgICAgICAgICAgdGhlSXRlbS5nZXRDb21wb25lbnQoXCJpdGVtXCIpLmlkID0gaWQ7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlRW1vamkoaWQsIHR5cGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInBsYXlpbmcgXCIpO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1tpZF0uZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikucGxheUVtb2ppKHR5cGUpO1xyXG4gICAgfSxcclxuICAgIHN0YXJ0Q291bnREb3duKG51bSkge1xyXG4gICAgICAgIHRoaXMuc3RhcnRTY3JlZW4uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBpZiAobnVtID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5nZXRDaGlsZEJ5TmFtZShcIk5VTVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG51bTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVjaWV2ZU1lc3NhZ2UoZGF0YSkge1xyXG4gICAgICAgIGxldCBteURhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVBsYXllclN0YXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0Um9vbVwiOlxyXG4gICAgICAgICAgICAgICAgLy9zZXQgY291bmRvd24gdGltZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudERvd24gPSBteURhdGEuZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzTG9zdCA9IG15RGF0YS5kYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3VudERvd24pO1xyXG4gICAgICAgICAgICAgICAgLy9hZGQgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBteURhdGEuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMobXlEYXRhLmRhdGFbMl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmFkZFdpbm5lcihteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRpbWUgb24gd2F0Y2hcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZShteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZUVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVuZW15KG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoaXMucGxheWVyc1tteURhdGEuZGF0YVswXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbW9qaVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbW9qaShteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBqb2luU2VydmVyKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6XCIgKyB0aGlzLnBvcnRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2UgYXJlIGNvbm5lY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwbGF5ZXJJbmZvXCIsIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBkaWRuJ3QgY2xvc2Ugb24gcHVycG9zZSwgYWxlcnRcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb2NrZXRDbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvclVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICArIFwiOlwiICsgdGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBhcmUgY29ubmVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBsYXllckluZm9cIiwgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpZG4ndCBjbG9zZSBvbiBwdXJwb3NlLCBhbGVydFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvY2tldENsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2lldmVNZXNzYWdlKGRhdGEpOyAgIFxyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKG15RGF0YS50eXBlID09IFwidXBkYXRlUGxheWVyU3RhdGVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgLy9jb25zb2xlLmxvZyhteURhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2cobXlEYXRhLmRhdGFbMF0gKyBcIiBcIiArIG15RGF0YS5kYXRhWzFdKTtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmIChteURhdGEuZGF0YVswXSAhPSB0aGlzLnBsYXllcklkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXIobXlEYXRhLmRhdGFbMF0sIG15RGF0YS5kYXRhWzFdKTtcclxuICAgICAgICAgICAgICAgIC8vICAgIH1cclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInJlbW92ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnJlbW92ZVBsYXllcihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJhZGRQbGF5ZXJzXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGZvciAodmFyIGkgaW4gbXlEYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICB0aGlzLmNyZWF0ZVBsYXllcihteURhdGEuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwicG9zaXRpb25zXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGZvciAodmFyIGkgaW4gbXlEYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICBpZiAodGhpcy5wbGF5ZXJJZCAhPSBteURhdGEuZGF0YVtpXS5pZClcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJQb3NpdGlvbihteURhdGEuZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJmaW5pc2hcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgaWYgKHRoaXMucGxheWVySWQgPT0gbXlEYXRhLmRhdGFbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd1dpbm5lcnMoKTtcclxuICAgICAgICAgICAgICAgIC8vICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS5hZGRXaW5uZXIobXlEYXRhLmRhdGFbMF0sIG15RGF0YS5kYXRhWzFdKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInRpbWVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgLy8gdXBkYXRlIHRoZSB0aW1lIG9uIHdhdGNoXHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnVwZGF0ZVRpbWUobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgLy92YXIgaW5mbyA9IHJlcXVpcmUoXCJsb2JieS5qc1wiKTtcclxuICAgICAgICAvL3RoaXMucGxheWVySWQgPSBpbmZvLmlkO1xyXG4gICAgICAgIC8vdGhpcy5wb3J0ID0gaW5mby5wb3J0O1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50c0xvc3QgPSA1O1xyXG4gICAgICAgIGxldCBhYnAgPSBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKTtcclxuICAgICAgICB0aGlzLnBsYXllcklkID0gYWJwLnBsYXllcklkO1xyXG4gICAgICAgIHRoaXMucG9ydCA9IGFicC5yb29tO1xyXG4gICAgICAgIHRoaXMuc2VydmVySXAgPSBhYnAuc2VydmVySXA7XHJcbiAgICAgICAgdGhpcy5jcm93bnMgPSBhYnAuY3Jvd25zO1xyXG4gICAgICAgIHRoaXMuaG91c2VJbmRleCA9IGFicC5ob3VzZUluZGV4O1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICAgIHRoaXMuam9pblNlcnZlcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubXlQbGF5ZXIgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBvc2l0aW9uXCIsIFt0aGlzLm15UGxheWVyLngsIHRoaXMubXlQbGF5ZXIueSwgcm91bmROdW1iZXIodGhpcy5teVBsYXllci5zY2FsZVksNSksIHJvdW5kTnVtYmVyKHRoaXMubXlQbGF5ZXIuc2NhbGVYLDUpXSk7XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==