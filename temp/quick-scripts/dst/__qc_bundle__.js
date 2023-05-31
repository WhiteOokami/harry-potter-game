
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/code/aboutPlayer');
require('./assets/code/cameraFollow');
require('./assets/code/client');
require('./assets/code/colorTheme');
require('./assets/code/enableGravity');
require('./assets/code/enemyScript');
require('./assets/code/gameManager');
require('./assets/code/groundChecker');
require('./assets/code/hitChecker');
require('./assets/code/item');
require('./assets/code/lobby');
require('./assets/code/movement');
require('./assets/code/movingPlatform');
require('./assets/code/start');
require('./assets/code/storyManager');

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/enableGravity.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'aa7d1iW6uVJopxU89YUUYHx', 'enableGravity');
// code/enableGravity.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {// foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.director.getPhysicsManager().enabled = true; //cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    //    cc.PhysicsManager.DrawBits.e_pairBit |
    //    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    //    cc.PhysicsManager.DrawBits.e_jointBit |
    //    cc.PhysicsManager.DrawBits.e_shapeBit
    //    ;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZW5hYmxlR3Jhdml0eS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIm9uTG9hZCIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljc01hbmFnZXIiLCJlbmFibGVkIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZRLEdBSFA7QUFxQkw7QUFFQUMsRUFBQUEsTUF2Qkssb0JBdUJJO0FBQ0xKLElBQUFBLEVBQUUsQ0FBQ0ssUUFBSCxDQUFZQyxpQkFBWixHQUFnQ0MsT0FBaEMsR0FBMEMsSUFBMUMsQ0FESyxDQUdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNILEdBaENJO0FBa0NMQyxFQUFBQSxLQWxDSyxtQkFrQ0ksQ0FFUixDQXBDSSxDQXNDTDs7QUF0Q0ssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICAgLy8gQVRUUklCVVRFUzpcclxuICAgICAgICAvLyAgICAgZGVmYXVsdDogbnVsbCwgICAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyBiYXI6IHtcclxuICAgICAgICAvLyAgICAgZ2V0ICgpIHtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiB0aGlzLl9iYXI7XHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHNldCAodmFsdWUpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuX2JhciA9IHZhbHVlO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5kZWJ1Z0RyYXdGbGFncyA9IGNjLlBoeXNpY3NNYW5hZ2VyLkRyYXdCaXRzLmVfYWFiYkJpdCB8XHJcbiAgICAgICAgLy8gICAgY2MuUGh5c2ljc01hbmFnZXIuRHJhd0JpdHMuZV9wYWlyQml0IHxcclxuICAgICAgICAvLyAgICBjYy5QaHlzaWNzTWFuYWdlci5EcmF3Qml0cy5lX2NlbnRlck9mTWFzc0JpdCB8XHJcbiAgICAgICAgLy8gICAgY2MuUGh5c2ljc01hbmFnZXIuRHJhd0JpdHMuZV9qb2ludEJpdCB8XHJcbiAgICAgICAgLy8gICAgY2MuUGh5c2ljc01hbmFnZXIuRHJhd0JpdHMuZV9zaGFwZUJpdFxyXG4gICAgICAgIC8vICAgIDtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/item.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '3d8d6+uMDhDV4YuecH/+Czd', 'item');
// code/item.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    id: "",
    type: "",
    spawned: false,
    potionPrefab: cc.Prefab,
    cakePrefab: cc.Prefab,
    cakeProb: 30,
    potoinProb: 30,
    opened: false
  },
  animateFloating: function animateFloating() {
    var jumpUp = cc.tween().by(1, {
      y: 20
    }, {
      easing: 'sineOut'
    });
    var jumpDown = cc.tween().by(1, {
      y: -20
    }, {
      easing: 'sineIn'
    });
    var tween = cc.tween().sequence(jumpUp, jumpDown);
    return cc.tween().repeatForever(tween);
  },
  // LIFE-CYCLE CALLBACKS:
  openChest: function openChest(isPlayer) {
    if (!this.opened) {
      this.opened = true;

      if (isPlayer) {
        this.node.getComponent(cc.AudioSource).play(); // play sound

        var randNum = Math.floor(Math.random() * 100);
        var spawnType = "";

        if (randNum <= this.cakeProb) {
          spawnType = "cake";
        } else if (randNum <= this.cakeProb + this.potoinProb) {
          spawnType = "potion";
        } else {//console.log("spawn bomb");
          //spawnType = "potion";
        }

        this.spawned = true;
        if (spawnType != "") cc.find("system").getComponent("client").sendItemState(this.id, "spawn", spawnType, [this.node.x + 50, this.node.y + 50]);
        cc.find("system").getComponent("client").sendItemState(this.id, "spawn", "chest", [this.node.x, this.node.y]);
        cc.find("system").getComponent("client").sendItemState(this.id, "used", "chest", null);
      }
    }
  },
  makeid: function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },
  onLoad: function onLoad() {
    if (this.id == null) this.id = this.makeid();
    this.node.name = this.type + this.id;

    if (this.type != "chest") {
      //start floating animation
      cc.tween(this.node).then(this.animateFloating()).start();
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcaXRlbS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImlkIiwidHlwZSIsInNwYXduZWQiLCJwb3Rpb25QcmVmYWIiLCJQcmVmYWIiLCJjYWtlUHJlZmFiIiwiY2FrZVByb2IiLCJwb3RvaW5Qcm9iIiwib3BlbmVkIiwiYW5pbWF0ZUZsb2F0aW5nIiwianVtcFVwIiwidHdlZW4iLCJieSIsInkiLCJlYXNpbmciLCJqdW1wRG93biIsInNlcXVlbmNlIiwicmVwZWF0Rm9yZXZlciIsIm9wZW5DaGVzdCIsImlzUGxheWVyIiwibm9kZSIsImdldENvbXBvbmVudCIsIkF1ZGlvU291cmNlIiwicGxheSIsInJhbmROdW0iLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJzcGF3blR5cGUiLCJmaW5kIiwic2VuZEl0ZW1TdGF0ZSIsIngiLCJtYWtlaWQiLCJ0ZXh0IiwicG9zc2libGUiLCJpIiwiY2hhckF0IiwibGVuZ3RoIiwib25Mb2FkIiwibmFtZSIsInRoZW4iLCJzdGFydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLEVBQUUsRUFBRSxFQURJO0FBRVJDLElBQUFBLElBQUksRUFBRSxFQUZFO0FBR1JDLElBQUFBLE9BQU8sRUFBRSxLQUhEO0FBSVJDLElBQUFBLFlBQVksRUFBRVAsRUFBRSxDQUFDUSxNQUpUO0FBS1JDLElBQUFBLFVBQVUsRUFBRVQsRUFBRSxDQUFDUSxNQUxQO0FBTVJFLElBQUFBLFFBQVEsRUFBRSxFQU5GO0FBT1JDLElBQUFBLFVBQVUsRUFBRSxFQVBKO0FBUVJDLElBQUFBLE1BQU0sRUFBRTtBQVJBLEdBSFA7QUFjTEMsRUFBQUEsZUFkSyw2QkFj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RyxNQUFwQyxDQUFoQixDQUFSO0FBREo7O0FBR0EsV0FBT0osSUFBUDtBQUNILEdBMURJO0FBMkRMSyxFQUFBQSxNQTNESyxvQkEyREk7QUFDTCxRQUFJLEtBQUt0QyxFQUFMLElBQVcsSUFBZixFQUNJLEtBQUtBLEVBQUwsR0FBVSxLQUFLZ0MsTUFBTCxFQUFWO0FBQ0osU0FBS1osSUFBTCxDQUFVbUIsSUFBVixHQUFpQixLQUFLdEMsSUFBTCxHQUFZLEtBQUtELEVBQWxDOztBQUNBLFFBQUksS0FBS0MsSUFBTCxJQUFhLE9BQWpCLEVBQTBCO0FBQ3RCO0FBQ0FMLE1BQUFBLEVBQUUsQ0FBQ2UsS0FBSCxDQUFTLEtBQUtTLElBQWQsRUFBb0JvQixJQUFwQixDQUF5QixLQUFLL0IsZUFBTCxFQUF6QixFQUFpRGdDLEtBQWpEO0FBQ0g7QUFFSixHQXBFSTtBQXNFTEEsRUFBQUEsS0F0RUssbUJBc0VJLENBRVIsQ0F4RUksQ0EwRUw7O0FBMUVLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBpZDogXCJcIixcclxuICAgICAgICB0eXBlOiBcIlwiLFxyXG4gICAgICAgIHNwYXduZWQ6IGZhbHNlLFxyXG4gICAgICAgIHBvdGlvblByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIGNha2VQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICBjYWtlUHJvYjogMzAsXHJcbiAgICAgICAgcG90b2luUHJvYjogMzAsXHJcbiAgICAgICAgb3BlbmVkOiBmYWxzZSxcclxuICAgIH0sXHJcblxyXG4gICAgYW5pbWF0ZUZsb2F0aW5nKCkge1xyXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogIDIwIH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSk7XHJcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MudHdlZW4oKS5ieSgxLCB7IHk6IC0yMCB9LCB7IGVhc2luZzogJ3NpbmVJbicgfSk7XHJcbiAgICAgICAgdmFyIHR3ZWVuID0gY2MudHdlZW4oKS5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duKTtcclxuICAgICAgICByZXR1cm4gY2MudHdlZW4oKS5yZXBlYXRGb3JldmVyKHR3ZWVuKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgICBvcGVuQ2hlc3QoaXNQbGF5ZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMub3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KCk7IC8vIHBsYXkgc291bmRcclxuICAgICAgICAgICAgICAgIGxldCByYW5kTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcclxuICAgICAgICAgICAgICAgIGxldCBzcGF3blR5cGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmROdW0gPD0gdGhpcy5jYWtlUHJvYikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzcGF3blR5cGUgPSBcImNha2VcIjtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyYW5kTnVtIDw9ICh0aGlzLmNha2VQcm9iICsgdGhpcy5wb3RvaW5Qcm9iKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzcGF3blR5cGUgPSBcInBvdGlvblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNwYXduIGJvbWJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zcGF3blR5cGUgPSBcInBvdGlvblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGF3bmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzcGF3blR5cGUgIT0gXCJcIilcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kSXRlbVN0YXRlKHRoaXMuaWQsIFwic3Bhd25cIiwgc3Bhd25UeXBlLCBbdGhpcy5ub2RlLnggKyA1MCwgdGhpcy5ub2RlLnkgKyA1MF0pO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZSh0aGlzLmlkLCBcInNwYXduXCIsIFwiY2hlc3RcIiwgW3RoaXMubm9kZS54LCB0aGlzLm5vZGUueV0pO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZSh0aGlzLmlkLCBcInVzZWRcIiwgXCJjaGVzdFwiLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICB9LFxyXG4gICAgbWFrZWlkKCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgcG9zc2libGUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGk8IDU7IGkrKylcclxuICAgICAgICAgICAgdGV4dCArPSBwb3NzaWJsZS5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGUubGVuZ3RoKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfSxcclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pZCA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5tYWtlaWQoKTtcclxuICAgICAgICB0aGlzLm5vZGUubmFtZSA9IHRoaXMudHlwZSArIHRoaXMuaWQ7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPSBcImNoZXN0XCIpIHtcclxuICAgICAgICAgICAgLy9zdGFydCBmbG9hdGluZyBhbmltYXRpb25cclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5ub2RlKS50aGVuKHRoaXMuYW5pbWF0ZUZsb2F0aW5nKCkpLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydCAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/colorTheme.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '82c292mRjxCPLJmzVfftEBh', 'colorTheme');
// code/colorTheme.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    gTheme0: "#740001",
    gTheme1: "#D3A625",
    hTheme0: "#FFD800",
    hTheme1: "#000000",
    rTheme0: "#0E1A40",
    rTheme1: "#946B2D",
    sTheme0: "#1A472A",
    sTheme1: "#5D5D5D",
    elements0: [cc.Node],
    elements1: [cc.Node],
    frames: [cc.Node]
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  // update (dt) {},
  changeColor: function changeColor(event, customEventData) {
    var i = parseInt(customEventData);
    if (i > 3) i = 0;
    this.node.getComponent("aboutPlayer").houseIndex = i;

    for (var index = 0; index < this.frames.length; index++) {
      this.frames[index].getComponent(cc.Sprite).enabled = false;
    }

    this.frames[i].getComponent(cc.Sprite).enabled = true;

    switch (i) {
      case 0:
        for (var _index = 0; _index < this.elements0.length; _index++) {
          this.elements0[_index].color = new cc.Color().fromHEX(this.gTheme0);
        }

        ;

        for (var _index2 = 0; _index2 < this.elements1.length; _index2++) {
          this.elements1[_index2].color = new cc.Color().fromHEX(this.gTheme1);
        }

        ;
        break;

      case 1:
        for (var _index3 = 0; _index3 < this.elements0.length; _index3++) {
          this.elements0[_index3].color = new cc.Color().fromHEX(this.hTheme0);
        }

        ;

        for (var _index4 = 0; _index4 < this.elements1.length; _index4++) {
          this.elements1[_index4].color = new cc.Color().fromHEX(this.hTheme1);
        }

        ;
        break;

      case 2:
        for (var _index5 = 0; _index5 < this.elements0.length; _index5++) {
          this.elements0[_index5].color = new cc.Color().fromHEX(this.rTheme0);
        }

        ;

        for (var _index6 = 0; _index6 < this.elements1.length; _index6++) {
          this.elements1[_index6].color = new cc.Color().fromHEX(this.rTheme1);
        }

        ;
        break;

      case 3:
        for (var _index7 = 0; _index7 < this.elements0.length; _index7++) {
          this.elements0[_index7].color = new cc.Color().fromHEX(this.sTheme0);
        }

        ;

        for (var _index8 = 0; _index8 < this.elements1.length; _index8++) {
          this.elements1[_index8].color = new cc.Color().fromHEX(this.sTheme1);
        }

        ;
        break;
    }

    cc.find("Lobby Manager").getComponent("lobby").changeHouse(i);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY29sb3JUaGVtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdUaGVtZTAiLCJnVGhlbWUxIiwiaFRoZW1lMCIsImhUaGVtZTEiLCJyVGhlbWUwIiwiclRoZW1lMSIsInNUaGVtZTAiLCJzVGhlbWUxIiwiZWxlbWVudHMwIiwiTm9kZSIsImVsZW1lbnRzMSIsImZyYW1lcyIsInN0YXJ0IiwiY2hhbmdlQ29sb3IiLCJldmVudCIsImN1c3RvbUV2ZW50RGF0YSIsImkiLCJwYXJzZUludCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJob3VzZUluZGV4IiwiaW5kZXgiLCJsZW5ndGgiLCJTcHJpdGUiLCJlbmFibGVkIiwiY29sb3IiLCJDb2xvciIsImZyb21IRVgiLCJmaW5kIiwiY2hhbmdlSG91c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxPQUFPLEVBQUMsU0FEQTtBQUVSQyxJQUFBQSxPQUFPLEVBQUMsU0FGQTtBQUdSQyxJQUFBQSxPQUFPLEVBQUMsU0FIQTtBQUlSQyxJQUFBQSxPQUFPLEVBQUMsU0FKQTtBQUtSQyxJQUFBQSxPQUFPLEVBQUMsU0FMQTtBQU1SQyxJQUFBQSxPQUFPLEVBQUMsU0FOQTtBQU9SQyxJQUFBQSxPQUFPLEVBQUMsU0FQQTtBQVFSQyxJQUFBQSxPQUFPLEVBQUMsU0FSQTtBQVNSQyxJQUFBQSxTQUFTLEVBQUMsQ0FBQ1osRUFBRSxDQUFDYSxJQUFKLENBVEY7QUFVUkMsSUFBQUEsU0FBUyxFQUFDLENBQUNkLEVBQUUsQ0FBQ2EsSUFBSixDQVZGO0FBV1JFLElBQUFBLE1BQU0sRUFBQyxDQUFDZixFQUFFLENBQUNhLElBQUo7QUFY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QUE0RDtBQUFDLGVBQUtYLFNBQUwsQ0FBZVcsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLdEIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7QUFDaEk7O0FBQ0osV0FBSyxDQUFMO0FBQ0ksYUFBSyxJQUFJZ0IsT0FBSyxHQUFHLENBQWpCLEVBQW9CQSxPQUFLLEdBQUcsS0FBS2IsU0FBTCxDQUFlYyxNQUEzQyxFQUFtREQsT0FBSyxFQUF4RCxFQUE0RDtBQUFDLGVBQUtiLFNBQUwsQ0FBZWEsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLckIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7O0FBQ2hJLGFBQUssSUFBSWUsT0FBSyxHQUFHLENBQWpCLEVBQW9CQSxPQUFLLEdBQUcsS0FBS1gsU0FBTCxDQUFlWSxNQUEzQyxFQUFtREQsT0FBSyxFQUF4RCxFQUE0RDtBQUFDLGVBQUtYLFNBQUwsQ0FBZVcsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLcEIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7QUFDaEk7QUFoQlI7O0FBbUJBWCxJQUFBQSxFQUFFLENBQUNnQyxJQUFILENBQVEsZUFBUixFQUF5QlQsWUFBekIsQ0FBc0MsT0FBdEMsRUFBK0NVLFdBQS9DLENBQTJEYixDQUEzRDtBQUNIO0FBdERJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBnVGhlbWUwOlwiIzc0MDAwMVwiLFxyXG4gICAgICAgIGdUaGVtZTE6XCIjRDNBNjI1XCIsXHJcbiAgICAgICAgaFRoZW1lMDpcIiNGRkQ4MDBcIixcclxuICAgICAgICBoVGhlbWUxOlwiIzAwMDAwMFwiLFxyXG4gICAgICAgIHJUaGVtZTA6XCIjMEUxQTQwXCIsXHJcbiAgICAgICAgclRoZW1lMTpcIiM5NDZCMkRcIixcclxuICAgICAgICBzVGhlbWUwOlwiIzFBNDcyQVwiLFxyXG4gICAgICAgIHNUaGVtZTE6XCIjNUQ1RDVEXCIsXHJcbiAgICAgICAgZWxlbWVudHMwOltjYy5Ob2RlXSxcclxuICAgICAgICBlbGVtZW50czE6W2NjLk5vZGVdLFxyXG4gICAgICAgIGZyYW1lczpbY2MuTm9kZV1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgLy8gb25Mb2FkICgpIHt9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuICAgIGNoYW5nZUNvbG9yKGV2ZW50LGN1c3RvbUV2ZW50RGF0YSlcclxuICAgIHtcclxuICAgICAgICBsZXQgaSA9IHBhcnNlSW50KGN1c3RvbUV2ZW50RGF0YSk7XHJcbiAgICAgICAgaWYoaT4zKSBpPTA7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImFib3V0UGxheWVyXCIpLmhvdXNlSW5kZXggPSBpO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZyYW1lcy5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmZyYW1lc1tpbmRleF0uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuZW5hYmxlZCA9IGZhbHNlO31cclxuICAgICAgICB0aGlzLmZyYW1lc1tpXS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzd2l0Y2ggKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5nVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmdUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmhUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuaFRoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMC5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMFtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuclRoZW1lMCl9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMxLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMxW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5yVGhlbWUxKX07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5zVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnNUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuY2hhbmdlSG91c2UoaSk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/groundChecker.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '18acbEoJ0lKjq90TLbihN4J', 'groundChecker');
// code/groundChecker.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    canJumpOn: [cc.String],
    canJump: false
  },
  // LIFE-CYCLE CALLBACKS:
  //onLoad() { },
  onCollisionEnter: function onCollisionEnter(other, self) {
    for (var i in this.canJumpOn) {
      if (other.node.group == this.canJumpOn[i]) {
        this.canJump = true;
      }
    }
  },
  onCollisionExit: function onCollisionExit(other, self) {
    this.canJump = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ3JvdW5kQ2hlY2tlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImNhbkp1bXBPbiIsIlN0cmluZyIsImNhbkp1bXAiLCJvbkNvbGxpc2lvbkVudGVyIiwib3RoZXIiLCJzZWxmIiwiaSIsIm5vZGUiLCJncm91cCIsIm9uQ29sbGlzaW9uRXhpdCIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsU0FBUyxFQUFFLENBQUNKLEVBQUUsQ0FBQ0ssTUFBSixDQURIO0FBRVJDLElBQUFBLE9BQU8sRUFBRTtBQUZELEdBSFA7QUFPTDtBQUVBO0FBQ0FDLEVBQUFBLGdCQUFnQixFQUFFLDBCQUFVQyxLQUFWLEVBQWlCQyxJQUFqQixFQUF1QjtBQUNyQyxTQUFLLElBQUlDLENBQVQsSUFBYyxLQUFLTixTQUFuQixFQUE4QjtBQUMxQixVQUFJSSxLQUFLLENBQUNHLElBQU4sQ0FBV0MsS0FBWCxJQUFvQixLQUFLUixTQUFMLENBQWVNLENBQWYsQ0FBeEIsRUFBMkM7QUFDdkMsYUFBS0osT0FBTCxHQUFlLElBQWY7QUFDSDtBQUNKO0FBRUosR0FqQkk7QUFrQkxPLEVBQUFBLGVBQWUsRUFBRSx5QkFBVUwsS0FBVixFQUFpQkMsSUFBakIsRUFBdUI7QUFDcEMsU0FBS0gsT0FBTCxHQUFlLEtBQWY7QUFDSCxHQXBCSTtBQXFCTFEsRUFBQUEsS0FyQkssbUJBcUJJLENBRVIsQ0F2QkksQ0F5Qkw7O0FBekJLLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgY2FuSnVtcE9uOiBbY2MuU3RyaW5nXSxcclxuICAgICAgICBjYW5KdW1wOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICAvL29uTG9hZCgpIHsgfSxcclxuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIChvdGhlciwgc2VsZikge1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5jYW5KdW1wT24pIHtcclxuICAgICAgICAgICAgaWYgKG90aGVyLm5vZGUuZ3JvdXAgPT0gdGhpcy5jYW5KdW1wT25baV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuSnVtcCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25Db2xsaXNpb25FeGl0OiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcclxuICAgICAgICB0aGlzLmNhbkp1bXAgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBzdGFydCAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/enemyScript.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '64fd02CYvtGPYd3Jt9F1sLL', 'enemyScript');
// code/enemyScript.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    chasingPlayer: cc.Node,
    speed: 100,
    player: cc.Node,
    walkSpeed: 50,
    jumpHeight: 100,
    checking: false,
    deltaTime: 0,
    grounded: false,
    alertNode: cc.Node,
    patrolling: false,
    animation: cc.Animation,
    canAttack: true,
    attackCooldown: 2,
    attackRange: 5,
    canMove: true,
    moving: false,
    playingIdle: true
  },
  chasePlayer: function chasePlayer(player) {
    this.chasingPlayer = player;

    if (player == this.player) {
      this.alertNode.active = true;
      cc.find("system").getComponent("client").sendEnemyState("chaseNew", [null, null], this.node.name);
    } else {
      this.alertNode.active = false;
    }
  },
  jump: function jump() {
    if (this.chasingPlayer == this.player) {
      cc.find("system").getComponent("client").sendEnemyState("jump", [null, null], this.node.name);
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.getComponent(cc.RigidBody).linearVelocity.x, this.jumpHeight);
    }
  },
  attack: function attack() {
    this.canAttack = false;
    this.animation.play("cardGuyAttack");
    this.scheduleOnce(function () {
      this.canAttack = true;
    }, this.attackCooldown);
  },
  moveRight: function moveRight() {
    //play animation only once
    if (!this.moving) {
      var animState = this.animation.play("cardGuyWalk");
      animState.wrapMode = cc.WrapMode.Loop;
      this.moving = true;
      this.playingIdle = false;
    }

    this.node.scaleX = -Math.abs(this.node.scaleX);

    if (this.chasingPlayer == this.player) {
      cc.find("system").getComponent("client").sendEnemyState("right", [null, null], this.node.name);
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.speed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);
    }
  },
  moveLeft: function moveLeft() {
    if (!this.moving) {
      var animState = this.animation.play("cardGuyWalk");
      animState.wrapMode = cc.WrapMode.Loop;
      this.moving = true;
      this.playingIdle = false;
    }

    this.node.scaleX = Math.abs(this.node.scaleX);

    if (this.chasingPlayer == this.player) {
      cc.find("system").getComponent("client").sendEnemyState("left", [null, null], this.node.name);
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.speed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);
    }
  },
  onCollisionEnter: function onCollisionEnter(other, self) {
    //console.log(other.node.name);
    if (other.node.group == "playerHitbox") {
      //if not chasing this player, chase him
      if (other.node.getParent().getParent() == this.player) {
        if (this.chasingPlayer != null) {
          this.checking = true;
        } else {
          this.chasePlayer(this.player);
        }
      }
    }
  },
  onCollisionExit: function onCollisionExit(other, self) {
    if (other.node.getParent().getParent() == this.chasingPlayer) {
      this.chasingPlayer = null;
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(0, 0);
      this.alertNode.active = false;
    }

    if (other.node.getParent().getParent() == this.player) {
      this.checking = false;
    }
  },
  onBeginContact: function onBeginContact(contact, self, other) {
    if (self.tag == 2) {
      this.grounded = true;
    }
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  update: function update(dt) {
    this.deltaTime = dt;

    if (this.canMove) {
      //play idle animation not moving
      if (this.getComponent(cc.RigidBody).linearVelocity.x == 0 && !this.playingIdle) {
        this.animation.stop("cardGuyWalk");
        this.animation.play("idle");
        this.moving = false;
        this.playingIdle = true;
      }

      if (this.player == null) {
        if (cc.find("system").getComponent("client").playerId == 0) {//do nothing
        } else {
          this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        }
      } else {
        if (this.chasingPlayer == this.player) {
          cc.find("system").getComponent("client").sendEnemyState("position", [this.node.x, this.node.y], this.node.name);
          var direction = (this.player.x - this.node.x) / Math.abs(this.player.x - this.node.x);
          if (direction > 0) this.moveRight();else this.moveLeft();

          if (Math.sqrt(Math.pow(this.player.x - this.node.x, 2) + Math.pow(this.player.y - this.node.y, 2)) < this.attackRange) {
            if (this.canAttack) {
              this.attack();
            }
          } //jump if if player is above
          //if (this.player.y > (this.node.y + 100)) {
          //    if (this.grounded)
          //        this.jump();
          //}

        } else if (this.checking && this.chasingPlayer != null) {
          var distance = Math.abs(this.node.x - this.player.x);
          var distance2 = Math.abs(this.node.x - this.chasingPlayer.x);
          if (this.player != this.chasingPlayer && distance < distance2) this.chasePlayer(this.player);
        }
      }
    } else {
      if (this.canAttack) {
        this.attack();
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZW5lbXlTY3JpcHQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjaGFzaW5nUGxheWVyIiwiTm9kZSIsInNwZWVkIiwicGxheWVyIiwid2Fsa1NwZWVkIiwianVtcEhlaWdodCIsImNoZWNraW5nIiwiZGVsdGFUaW1lIiwiZ3JvdW5kZWQiLCJhbGVydE5vZGUiLCJwYXRyb2xsaW5nIiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiY2FuQXR0YWNrIiwiYXR0YWNrQ29vbGRvd24iLCJhdHRhY2tSYW5nZSIsImNhbk1vdmUiLCJtb3ZpbmciLCJwbGF5aW5nSWRsZSIsImNoYXNlUGxheWVyIiwiYWN0aXZlIiwiZmluZCIsImdldENvbXBvbmVudCIsInNlbmRFbmVteVN0YXRlIiwibm9kZSIsIm5hbWUiLCJqdW1wIiwiUmlnaWRCb2R5IiwibGluZWFyVmVsb2NpdHkiLCJWZWMyIiwieCIsImF0dGFjayIsInBsYXkiLCJzY2hlZHVsZU9uY2UiLCJtb3ZlUmlnaHQiLCJhbmltU3RhdGUiLCJ3cmFwTW9kZSIsIldyYXBNb2RlIiwiTG9vcCIsInNjYWxlWCIsIk1hdGgiLCJhYnMiLCJ5IiwibW92ZUxlZnQiLCJvbkNvbGxpc2lvbkVudGVyIiwib3RoZXIiLCJzZWxmIiwiZ3JvdXAiLCJnZXRQYXJlbnQiLCJvbkNvbGxpc2lvbkV4aXQiLCJvbkJlZ2luQ29udGFjdCIsImNvbnRhY3QiLCJ0YWciLCJzdGFydCIsInVwZGF0ZSIsImR0Iiwic3RvcCIsInBsYXllcklkIiwiZGlyZWN0aW9uIiwic3FydCIsImRpc3RhbmNlIiwiZGlzdGFuY2UyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsYUFBYSxFQUFFSixFQUFFLENBQUNLLElB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UUFBTCxJQUFpQixLQUFLTixhQUFMLElBQXNCLElBQTNDLEVBQWlEO0FBQ2xELGNBQUk0RCxRQUFRLEdBQUdwQixJQUFJLENBQUNDLEdBQUwsQ0FBUyxLQUFLakIsSUFBTCxDQUFVTSxDQUFWLEdBQWMsS0FBSzNCLE1BQUwsQ0FBWTJCLENBQW5DLENBQWY7QUFDQSxjQUFJK0IsU0FBUyxHQUFHckIsSUFBSSxDQUFDQyxHQUFMLENBQVMsS0FBS2pCLElBQUwsQ0FBVU0sQ0FBVixHQUFjLEtBQUs5QixhQUFMLENBQW1COEIsQ0FBMUMsQ0FBaEI7QUFDQSxjQUFJLEtBQUszQixNQUFMLElBQWUsS0FBS0gsYUFBcEIsSUFBcUM0RCxRQUFRLEdBQUdDLFNBQXBELEVBQ0ksS0FBSzFDLFdBQUwsQ0FBaUIsS0FBS2hCLE1BQXRCO0FBQ1A7QUFFSjtBQUNKLEtBOUNELE1BK0NLO0FBQ0QsVUFBSSxLQUFLVSxTQUFULEVBQW9CO0FBQ2hCLGFBQUtrQixNQUFMO0FBQ0g7QUFDSjtBQUdKO0FBL0tJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGNoYXNpbmdQbGF5ZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgc3BlZWQ6IDEwMCxcclxuICAgICAgICBwbGF5ZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgd2Fsa1NwZWVkOiA1MCxcclxuICAgICAgICBqdW1wSGVpZ2h0OiAxMDAsXHJcbiAgICAgICAgY2hlY2tpbmc6IGZhbHNlLFxyXG4gICAgICAgIGRlbHRhVGltZTogMCxcclxuICAgICAgICBncm91bmRlZDogZmFsc2UsXHJcbiAgICAgICAgYWxlcnROb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhdHJvbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogY2MuQW5pbWF0aW9uLFxyXG4gICAgICAgIGNhbkF0dGFjazogdHJ1ZSxcclxuICAgICAgICBhdHRhY2tDb29sZG93bjogMixcclxuICAgICAgICBhdHRhY2tSYW5nZTogNSxcclxuICAgICAgICBjYW5Nb3ZlOiB0cnVlLFxyXG4gICAgICAgIG1vdmluZzogZmFsc2UsXHJcbiAgICAgICAgcGxheWluZ0lkbGU6IHRydWUsXHJcbiAgICB9LFxyXG5cclxuICAgIGNoYXNlUGxheWVyKHBsYXllcikge1xyXG4gICAgICAgIHRoaXMuY2hhc2luZ1BsYXllciA9IHBsYXllcjtcclxuICAgICAgICBpZiAocGxheWVyID09IHRoaXMucGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxlcnROb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kRW5lbXlTdGF0ZShcImNoYXNlTmV3XCIsIFtudWxsLG51bGxdLCB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hbGVydE5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGp1bXAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhc2luZ1BsYXllciA9PSB0aGlzLnBsYXllcikge1xyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kRW5lbXlTdGF0ZShcImp1bXBcIiwgW251bGwsIG51bGxdLCB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueCwgdGhpcy5qdW1wSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuICAgIGF0dGFjaygpIHtcclxuICAgICAgICB0aGlzLmNhbkF0dGFjayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJjYXJkR3V5QXR0YWNrXCIpO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHsgdGhpcy5jYW5BdHRhY2sgPSB0cnVlOyB9LCB0aGlzLmF0dGFja0Nvb2xkb3duKTtcclxuICAgIH0sXHJcbiAgICBtb3ZlUmlnaHQoKSB7XHJcbiAgICAgICAgLy9wbGF5IGFuaW1hdGlvbiBvbmx5IG9uY2VcclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwiY2FyZEd1eVdhbGtcIik7XHJcbiAgICAgICAgICAgIGFuaW1TdGF0ZS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nSWRsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUuc2NhbGVYID0gLU1hdGguYWJzKHRoaXMubm9kZS5zY2FsZVgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNoYXNpbmdQbGF5ZXIgPT0gdGhpcy5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEVuZW15U3RhdGUoXCJyaWdodFwiLCBbbnVsbCwgbnVsbF0sIHRoaXMubm9kZS5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlTGVmdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwiY2FyZEd1eVdhbGtcIik7XHJcbiAgICAgICAgICAgIGFuaW1TdGF0ZS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nSWRsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUuc2NhbGVYID0gTWF0aC5hYnModGhpcy5ub2RlLnNjYWxlWCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhc2luZ1BsYXllciA9PSB0aGlzLnBsYXllcikge1xyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kRW5lbXlTdGF0ZShcImxlZnRcIiwgW251bGwsIG51bGxdLCB0aGlzLm5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKG90aGVyLm5vZGUubmFtZSk7XHJcbiAgICAgICAgaWYgKG90aGVyLm5vZGUuZ3JvdXAgPT0gXCJwbGF5ZXJIaXRib3hcIikge1xyXG4gICAgICAgICAgICAvL2lmIG5vdCBjaGFzaW5nIHRoaXMgcGxheWVyLCBjaGFzZSBoaW1cclxuICAgICAgICAgICAgaWYgKG90aGVyLm5vZGUuZ2V0UGFyZW50KCkuZ2V0UGFyZW50KCkgPT0gdGhpcy5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXNpbmdQbGF5ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tpbmcgPSB0cnVlOyAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXNlUGxheWVyKHRoaXMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgb25Db2xsaXNpb25FeGl0OiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcclxuICAgICAgICBpZiAob3RoZXIubm9kZS5nZXRQYXJlbnQoKS5nZXRQYXJlbnQoKSA9PSB0aGlzLmNoYXNpbmdQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFzaW5nUGxheWVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmFsZXJ0Tm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG90aGVyLm5vZGUuZ2V0UGFyZW50KCkuZ2V0UGFyZW50KCkgPT0gdGhpcy5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uQmVnaW5Db250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgaWYgKHNlbGYudGFnID09IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIC8vIG9uTG9hZCAoKSB7fSxcclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5jYW5Nb3ZlKSB7XHJcbiAgICAgICAgICAgIC8vcGxheSBpZGxlIGFuaW1hdGlvbiBub3QgbW92aW5nXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnggPT0gMCAmJiAhdGhpcy5wbGF5aW5nSWRsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RvcChcImNhcmRHdXlXYWxrXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImlkbGVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5aW5nSWRsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikucGxheWVySWQgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYXNpbmdQbGF5ZXIgPT0gdGhpcy5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kRW5lbXlTdGF0ZShcInBvc2l0aW9uXCIsIFt0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnldLCB0aGlzLm5vZGUubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSAodGhpcy5wbGF5ZXIueCAtIHRoaXMubm9kZS54KSAvIE1hdGguYWJzKHRoaXMucGxheWVyLnggLSB0aGlzLm5vZGUueCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKHRoaXMucGxheWVyLnggLSB0aGlzLm5vZGUueCkgKiogMiArICh0aGlzLnBsYXllci55IC0gdGhpcy5ub2RlLnkpICoqIDIpIDwgdGhpcy5hdHRhY2tSYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5BdHRhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0YWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9qdW1wIGlmIGlmIHBsYXllciBpcyBhYm92ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMucGxheWVyLnkgPiAodGhpcy5ub2RlLnkgKyAxMDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMuanVtcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY2hlY2tpbmcgJiYgdGhpcy5jaGFzaW5nUGxheWVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLmFicyh0aGlzLm5vZGUueCAtIHRoaXMucGxheWVyLngpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0YW5jZTIgPSBNYXRoLmFicyh0aGlzLm5vZGUueCAtIHRoaXMuY2hhc2luZ1BsYXllci54KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIgIT0gdGhpcy5jaGFzaW5nUGxheWVyICYmIGRpc3RhbmNlIDwgZGlzdGFuY2UyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXNlUGxheWVyKHRoaXMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbkF0dGFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG59KTtcclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/gameManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f88aaqmmHtO/qKttC/WpRhf', 'gameManager');
// code/gameManager.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    distanceText: cc.Node,
    distance: 0,
    player: cc.Node,
    following: false,
    endPosition: cc.Node,
    gameEnded: false,
    winnerCanva: cc.Node,
    finishedPlayers: cc.Node,
    playerPrefab: cc.Prefab,
    timesUpUi: cc.Node,
    spawn: cc.Node,
    camera: cc.Node,
    players: cc.Node,
    spectateIndex: 0,
    spectateUI: cc.Node,
    emojiButton: cc.Node,
    emojiUI: cc.Node,
    mobileController: cc.Node,
    numFinished: cc.Node,
    crownsNode: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.director.getCollisionManager().enabled = true;
    cc.game.setFrameRate(60); //cc.director.getCollisionManager().enabledDebugDraw = true; 
    //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
  },
  addWinner: function addWinner(player, place) {
    this.numFinished.getComponent(cc.Label).string = place + "/" + this.players.children.length + " finished";
    var aPlayer = cc.instantiate(this.playerPrefab);
    aPlayer.parent = this.finishedPlayers;
    aPlayer.getChildByName("TEXT").getComponent(cc.Label).string = player.name + " finished in " + place + " place   " + cc.find("system").getComponent("client").myTime + "s";
  },
  timesUp: function timesUp() {
    this.player.getComponent("movement").disable();
    this.gameEnded = true;
    this.timesUpUi.active = true;
  },
  showCrowns: function showCrowns(crowns) {
    this.crownsNode.active = true;
    console.log(crowns);
    if (crowns > 0) this.crownsNode.getChildByName("CROWNS").getComponent(cc.Label).string = "+ " + crowns;else this.crownsNode.getChildByName("CROWNS").getComponent(cc.Label).string = crowns;
  },
  showWinners: function showWinners(crowns) {
    this.winnerCanva.active = true;
  },
  closeCrowns: function closeCrowns() {
    this.crownsNode.active = false;
  },
  closeSpectate: function closeSpectate() {
    this.winnerCanva.active = true;
    this.spectateUI.active = false;
  },
  goBackToLobby: function goBackToLobby() {
    // go back to lobby
    cc.find("system").getComponent("client").disconnect();
    cc.director.loadScene("home");
  },
  confirmTimesUp: function confirmTimesUp() {
    this.timesUpUi.active = false;
    this.showWinners();
  },
  openSpectateUi: function openSpectateUi() {
    this.winnerCanva.active = false;
    this.spectateUI.active = true;
  },
  showEmojis: function showEmojis() {
    this.emojiButton.active = !this.emojiButton.active;
    this.emojiUI.active = !this.emojiUI.active;
  },
  sepctatePrev: function sepctatePrev() {
    this.spectateIndex -= 1;
    if (this.spectateIndex < 0) this.spectateIndex = this.players.children.length - 1;
    var newPlayer = this.players.children[this.spectateIndex];
    this.camera.getComponent("cameraFollow").player = newPlayer; // change spectating player name

    this.spectateUI.getChildByName("NAME").getComponent(cc.Label).string = "Spectating " + newPlayer.getChildByName("nameTag").getComponent(cc.Label).string;
  },
  spectateNext: function spectateNext() {
    // spectate next player
    this.spectateIndex += 1;
    if (this.spectateIndex >= this.players.children.length) this.spectateIndex = 0;
    var newPlayer = this.players.children[this.spectateIndex];
    this.camera.getComponent("cameraFollow").player = newPlayer; // change spectating player name

    this.spectateUI.getChildByName("NAME").getComponent(cc.Label).string = "Spectating " + newPlayer.getChildByName("nameTag").getComponent(cc.Label).string;
  },
  update: function update(dt) {
    if (!this.following) {
      if (cc.find("system").getComponent("client").myPlayer != null) {
        this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        this.following = true;
        this.numFinished.getComponent(cc.Label).string = "0/" + this.players.children.length + " finished";
      }
    } else {
      //this.distance = Math.floor(Math.sqrt(Math.pow((this.endPosition.x - this.player.x), 2) + Math.pow((this.endPosition.y - this.player.y), 2)) / 10);
      //this.distanceText.getComponent(cc.Label).string = this.distance + " m";
      if (this.gameEnded) {
        this.player.getComponent("movement").active = false;
        this.mobileController.active = false;
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ2FtZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXN0YW5jZVRleHQiLCJOb2RlIiwiZGlzdGFuY2UiLCJwbGF5ZXIiLCJmb2xsb3dpbmciLCJlbmRQb3NpdGlvbiIsImdhbWVFbmRlZCIsIndpbm5lckNhbnZhIiwiZmluaXNoZWRQbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwidGltZXNVcFVpIiwic3Bhd24iLCJjYW1lcmEiLCJwbGF5ZXJzIiwic3BlY3RhdGVJbmRleCIsInNwZWN0YXRlVUkiLCJlbW9qaUJ1dHRvbiIsImVtb2ppVUkiLCJtb2JpbGVDb250cm9sbGVyIiwibnVtRmluaXNoZWQiLCJjcm93bnNOb2RlIiwib25Mb2FkIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZW5hYmxlZCIsImdhbWUiLCJzZXRGcmFtZVJhdGUiLCJhZGRXaW5uZXIiLCJwbGFjZSIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhUGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJnZXRDaGlsZEJ5TmFtZSIsIm5hbWUiLCJmaW5kIiwibXlUaW1lIiwidGltZXNVcCIsImRpc2FibGUiLCJhY3RpdmUiLCJzaG93Q3Jvd25zIiwiY3Jvd25zIiwiY29uc29sZSIsImxvZyIsInNob3dXaW5uZXJzIiwiY2xvc2VDcm93bnMiLCJjbG9zZVNwZWN0YXRlIiwiZ29CYWNrVG9Mb2JieSIsImRpc2Nvbm5lY3QiLCJsb2FkU2NlbmUiLCJjb25maXJtVGltZXNVcCIsIm9wZW5TcGVjdGF0ZVVpIiwic2hvd0Vtb2ppcyIsInNlcGN0YXRlUHJldiIsIm5ld1BsYXllciIsInNwZWN0YXRlTmV4dCIsInVwZGF0ZSIsImR0IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7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VCxFQUFvQjtBQUNoQixhQUFLSCxNQUFMLENBQVkyQixZQUFaLENBQXlCLFVBQXpCLEVBQXFDYyxNQUFyQyxHQUE4QyxLQUE5QztBQUNBLGFBQUt6QixnQkFBTCxDQUFzQnlCLE1BQXRCLEdBQStCLEtBQS9CO0FBQ0g7QUFDSjtBQUVKO0FBdkhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgZGlzdGFuY2VUZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGRpc3RhbmNlOiAwLFxyXG4gICAgICAgIHBsYXllcjogY2MuTm9kZSxcclxuICAgICAgICBmb2xsb3dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGVuZFBvc2l0aW9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGdhbWVFbmRlZDogZmFsc2UsXHJcbiAgICAgICAgd2lubmVyQ2FudmE6IGNjLk5vZGUsXHJcbiAgICAgICAgZmluaXNoZWRQbGF5ZXJzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHRpbWVzVXBVaTogY2MuTm9kZSxcclxuICAgICAgICBzcGF3bjogY2MuTm9kZSxcclxuICAgICAgICBjYW1lcmE6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyczogY2MuTm9kZSxcclxuICAgICAgICBzcGVjdGF0ZUluZGV4OiAwLFxyXG4gICAgICAgIHNwZWN0YXRlVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlVSTogY2MuTm9kZSxcclxuICAgICAgICBtb2JpbGVDb250cm9sbGVyOiBjYy5Ob2RlLFxyXG4gICAgICAgIG51bUZpbmlzaGVkOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNyb3duc05vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY2MuZ2FtZS5zZXRGcmFtZVJhdGUoNjApO1xyXG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWREZWJ1Z0RyYXcgPSB0cnVlOyBcclxuICAgICAgICAvL2NjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRHJhd0JvdW5kaW5nQm94ID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgYWRkV2lubmVyKHBsYXllciwgcGxhY2UpIHtcclxuICAgICAgICB0aGlzLm51bUZpbmlzaGVkLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxhY2UgKyBcIi9cIiArIHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGggKyBcIiBmaW5pc2hlZFwiO1xyXG4gICAgICAgIGxldCBhUGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpO1xyXG4gICAgICAgIGFQbGF5ZXIucGFyZW50ID0gdGhpcy5maW5pc2hlZFBsYXllcnM7XHJcbiAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlRFWFRcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZSArIFwiIGZpbmlzaGVkIGluIFwiICsgcGxhY2UgKyBcIiBwbGFjZSAgIFwiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikubXlUaW1lICsgXCJzXCI7XHJcbiAgICB9LFxyXG4gICAgdGltZXNVcCgpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGltZXNVcFVpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Nyb3ducyhjcm93bnMpIHtcclxuICAgICAgICB0aGlzLmNyb3duc05vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjcm93bnMpO1xyXG4gICAgICAgIGlmIChjcm93bnMgPiAwKVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIisgXCIgKyBjcm93bnM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjcm93bnM7XHJcbiAgICB9LFxyXG4gICAgc2hvd1dpbm5lcnMoY3Jvd25zKSB7XHJcbiAgICAgICAgdGhpcy53aW5uZXJDYW52YS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlQ3Jvd25zKCkge1xyXG4gICAgICAgIHRoaXMuY3Jvd25zTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZVNwZWN0YXRlKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgZ29CYWNrVG9Mb2JieSgpIHtcclxuICAgICAgICAvLyBnbyBiYWNrIHRvIGxvYmJ5XHJcbiAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgY29uZmlybVRpbWVzVXAoKSB7XHJcbiAgICAgICAgdGhpcy50aW1lc1VwVWkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaG93V2lubmVycygpO1xyXG4gICAgfSxcclxuICAgIG9wZW5TcGVjdGF0ZVVpKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcGVjdGF0ZVVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Vtb2ppcygpIHtcclxuICAgICAgICB0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZSA9ICF0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gIXRoaXMuZW1vamlVSS5hY3RpdmU7XHJcbiAgICB9LFxyXG4gICAgc2VwY3RhdGVQcmV2KCkge1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCAtPTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlY3RhdGVJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICBzcGVjdGF0ZU5leHQoKSB7XHJcbiAgICAgICAgLy8gc3BlY3RhdGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICB0aGlzLnNwZWN0YXRlSW5kZXggKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVjdGF0ZUluZGV4ID49IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRmluaXNoZWQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIjAvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXN0YW5jZSA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLmVuZFBvc2l0aW9uLnggLSB0aGlzLnBsYXllci54KSwgMikgKyBNYXRoLnBvdygodGhpcy5lbmRQb3NpdGlvbi55IC0gdGhpcy5wbGF5ZXIueSksIDIpKSAvIDEwKTtcclxuICAgICAgICAgICAgLy90aGlzLmRpc3RhbmNlVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuZGlzdGFuY2UgKyBcIiBtXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vYmlsZUNvbnRyb2xsZXIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/movingPlatform.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'd755evL6ydJUpa+onXmnJAb', 'movingPlatform');
// code/movingPlatform.js

"use strict";

var _properties;

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: (_properties = {
    movingPlayer: cc.Node,
    rb: cc.RigidBody,
    speed: 500000,
    startPos: 0,
    distance: 1000,
    direction: 1,
    players: cc.Node,
    spinning: false,
    sideToSide: false,
    dropping: false,
    spinSpeed: 1,
    playersOnMe: 0,
    maxPlayers: 1,
    falling: false,
    rising: false,
    upDown: false,
    moveUpTime: 3
  }, _properties["startPos"] = cc.v2(), _properties),
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.rb = this.node.getComponent(cc.RigidBody);
    this.startPos = this.node.x;
    this.startPos = cc.v2(this.node.x, this.node.y);
  },
  start: function start() {},
  shake: function shake() {
    this.falling = true;
    this.scheduleOnce(function () {
      this.falling = false;
    }, 0.1);
    this.scheduleOnce(function () {
      this.rising = true;
    }, 0.2);
    this.scheduleOnce(function () {
      this.rising = false;
    }, 0.3); //this.scheduleOnce(function () {
    //    this.falling = true;
    //}, 0.4);
    //this.scheduleOnce(function () {
    //    this.falling = false;
    //}, 0.5);
    //this.scheduleOnce(function () {
    //    this.rising = true;
    //}, 0.6)
    //this.scheduleOnce(function () {
    //    this.rising = false;
    //}, 0.7)
  },
  onBeginContact: function onBeginContact(contact, self, other) {
    if (other.node.group == "player") {
      if (this.dropping && !this.falling && !this.rising) this.shake();
      this.playersOnMe += 1;

      if (other.node.getComponent("movement").isPlayer) {
        this.movingPlayer = other.node; //this.movingPlayer.parent = this.node;
        //this.movingPlayer.setPosition(0, 0);
      }
    }

    if (other.node.group == "dangerous" && this.dropping) {
      this.node.x = this.startPos.x;
      this.node.y = this.startPos.y;
    }
  },
  onCollisionEnter: function onCollisionEnter(other, self) {
    if (other.node.group == "dangerous" && this.dropping) {
      this.node.x = this.startPos.x;
      this.node.y = this.startPos.y;
      this.falling = false;
      this.rising = false;
    }
  },
  onEndContact: function onEndContact(contact, self, other) {
    var location = other.node.x - this.node.x;
    if (other.node.group == "player") this.playersOnMe -= 1;

    if (other.node == this.movingPlayer) {
      this.movingPlayer = null; //this.movingPlayer.parent = this.players;
    }
  },
  moveUpDown: function moveUpDown() {
    if (this.falling) {
      this.falling = false;
      this.rising = true;
    } else if (this.rising) {
      this.falling = true;
      this.rising = false;
    } else {
      this.falling = true;
    }
  },
  update: function update(dt) {
    if (cc.find("system").getComponent("client").gameStarted) {
      if (this.sideToSide) {
        if (Math.abs(this.startPos - this.node.x) >= this.distance) this.direction *= -1; //move object

        this.rb.linearVelocity = cc.v2(this.speed * dt * this.direction, 0);
      } else if (this.spinning) {
        this.node.angle += dt * this.spinSpeed;
      } else if (this.dropping) {
        if (this.playersOnMe > this.maxPlayers) {
          this.falling = true;
        }
      }

      if (this.falling) {
        this.node.y -= this.speed * dt;
      }

      if (this.rising) {
        this.node.y += this.speed * dt;
      }

      if (this.upDown) {
        this.schedule(this.moveUpDown, this.moveUpTime);
        this.upDown = false;
      }
    } //stand on moving platform
    //if (this.movingPlayer != null) {
    //    let lv = this.movingPlayer.getComponent(cc.RigidBody).linearVelocity;
    //    this.movingPlayer.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(this.speed * dt * this.direction, 0));
    //    console.log(lv.x);
    //}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92aW5nUGxhdGZvcm0uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJtb3ZpbmdQbGF5ZXIiLCJOb2RlIiwicmIiLCJSaWdpZEJvZHkiLCJzcGVlZCIsInN0YXJ0UG9zIiwiZGlzdGFuY2UiLCJkaXJlY3Rpb24iLCJwbGF5ZXJzIiwic3Bpbm5pbmciLCJzaWRlVG9TaWRlIiwiZHJvcHBpbmciLCJzcGluU3BlZWQiLCJwbGF5ZXJzT25NZSIsIm1heFBsYXllcnMiLCJmYWxsaW5nIiwicmlzaW5nIiwidXBEb3duIiwibW92ZVVwVGltZSIsInYyIiwib25Mb2FkIiwibm9kZSIsImdldENvbXBvbmVudCIsIngiLCJ5Iiwic3RhcnQiLCJzaGFrZSIsInNjaGVkdWxlT25jZSIsIm9uQmVnaW5Db250YWN0IiwiY29udGFjdCIsInNlbGYiLCJvdGhlciIsImdyb3VwIiwiaXNQbGF5ZXIiLCJvbkNvbGxpc2lvbkVudGVyIiwib25FbmRDb250YWN0IiwibG9jYXRpb24iLCJtb3ZlVXBEb3duIiwidXBkYXRlIiwiZHQiLCJmaW5kIiwiZ2FtZVN0YXJ0ZWQiLCJNYXRoIiwiYWJzIiwibGluZWFyVmVsb2NpdHkiLCJhbmdsZSIsInNjaGVkdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVU7QUFDTkMsSUFBQUEsWUFBWSxFQUFFSixFQUFFLENBQUNLLElBRFg7QUFFTkMsSUFBQUEsRUFBRSxFQUFFTixFQUFFLENBQUNPLFNBRkQ7QUFHTkMsSUFBQUEsS0FBSyxFQUFFLE1BSEQ7QUFJTkMsSUFBQUEsUUFBUSxFQUFFLENBSko7QUFLTkMsSUFBQUEsUUFBUSxFQUFFLElBTEo7QUFNTkMsSUFBQUEsU0FBUyxF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dEMsUUFBTCxHQUFnQixLQUFLZ0IsSUFBTCxDQUFVRSxDQUFuQyxLQUF5QyxLQUFLakIsUUFBbEQsRUFDSSxLQUFLQyxTQUFMLElBQWtCLENBQUMsQ0FBbkIsQ0FGYSxDQUdqQjs7QUFFQSxhQUFLTCxFQUFMLENBQVEwQyxjQUFSLEdBQXlCaEQsRUFBRSxDQUFDdUIsRUFBSCxDQUFNLEtBQUtmLEtBQUwsR0FBYW1DLEVBQWIsR0FBa0IsS0FBS2hDLFNBQTdCLEVBQXdDLENBQXhDLENBQXpCO0FBQ0gsT0FORCxNQU9LLElBQUksS0FBS0UsUUFBVCxFQUFtQjtBQUNwQixhQUFLWSxJQUFMLENBQVV3QixLQUFWLElBQW1CTixFQUFFLEdBQUcsS0FBSzNCLFNBQTdCO0FBQ0gsT0FGSSxNQUdBLElBQUksS0FBS0QsUUFBVCxFQUFtQjtBQUNwQixZQUFJLEtBQUtFLFdBQUwsR0FBbUIsS0FBS0MsVUFBNUIsRUFBd0M7QUFDcEMsZUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDSDtBQUNKOztBQUVELFVBQUksS0FBS0EsT0FBVCxFQUFrQjtBQUNkLGFBQUtNLElBQUwsQ0FBVUcsQ0FBVixJQUFlLEtBQUtwQixLQUFMLEdBQWFtQyxFQUE1QjtBQUNIOztBQUVELFVBQUksS0FBS3ZCLE1BQVQsRUFBaUI7QUFDYixhQUFLSyxJQUFMLENBQVVHLENBQVYsSUFBZSxLQUFLcEIsS0FBTCxHQUFhbUMsRUFBNUI7QUFDSDs7QUFFRCxVQUFJLEtBQUt0QixNQUFULEVBQWlCO0FBQ2IsYUFBSzZCLFFBQUwsQ0FBYyxLQUFLVCxVQUFuQixFQUErQixLQUFLbkIsVUFBcEM7QUFDQSxhQUFLRCxNQUFMLEdBQWMsS0FBZDtBQUNIO0FBQ0osS0EvQk0sQ0FpQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVIO0FBeEpJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBtb3ZpbmdQbGF5ZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgcmI6IGNjLlJpZ2lkQm9keSxcclxuICAgICAgICBzcGVlZDogNTAwMDAwLFxyXG4gICAgICAgIHN0YXJ0UG9zOiAwLFxyXG4gICAgICAgIGRpc3RhbmNlOiAxMDAwLFxyXG4gICAgICAgIGRpcmVjdGlvbjogMSxcclxuICAgICAgICBwbGF5ZXJzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNwaW5uaW5nOiBmYWxzZSxcclxuICAgICAgICBzaWRlVG9TaWRlOiBmYWxzZSxcclxuICAgICAgICBkcm9wcGluZzogZmFsc2UsXHJcbiAgICAgICAgc3BpblNwZWVkOiAxLFxyXG4gICAgICAgIHBsYXllcnNPbk1lOiAwLFxyXG4gICAgICAgIG1heFBsYXllcnM6IDEsXHJcbiAgICAgICAgZmFsbGluZzogZmFsc2UsXHJcbiAgICAgICAgcmlzaW5nOiBmYWxzZSxcclxuICAgICAgICB1cERvd246IGZhbHNlLFxyXG4gICAgICAgIG1vdmVVcFRpbWU6IDMsXHJcbiAgICAgICAgc3RhcnRQb3M6IGNjLnYyKCksXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLnJiID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSB0aGlzLm5vZGUueDtcclxuICAgICAgICB0aGlzLnN0YXJ0UG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG5cclxuICAgIH0sXHJcbiAgICBzaGFrZSgpIHtcclxuICAgICAgICB0aGlzLmZhbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMC4xKTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmlzaW5nID0gdHJ1ZTtcclxuICAgICAgICB9LCAwLjIpXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJpc2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDAuMylcclxuICAgICAgICAvL3RoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgICB0aGlzLmZhbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vfSwgMC40KTtcclxuICAgICAgICAvL3RoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAgICB0aGlzLmZhbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAvL30sIDAuNSk7XHJcbiAgICAgICAgLy90aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgdGhpcy5yaXNpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vfSwgMC42KVxyXG4gICAgICAgIC8vdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICAgIHRoaXMucmlzaW5nID0gZmFsc2U7XHJcbiAgICAgICAgLy99LCAwLjcpXHJcblxyXG5cclxuICAgIH0sXHJcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmLCBvdGhlcikge1xyXG4gXHJcbiAgICAgICAgaWYgKG90aGVyLm5vZGUuZ3JvdXAgPT0gXCJwbGF5ZXJcIikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcm9wcGluZyAmJiAhdGhpcy5mYWxsaW5nICYmICF0aGlzLnJpc2luZylcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hha2UoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzT25NZSArPSAxO1xyXG4gICAgICAgICAgICBpZiAob3RoZXIubm9kZS5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdQbGF5ZXIgPSBvdGhlci5ub2RlO1xyXG4gICAgICAgICAgICAgICAgLy90aGlzLm1vdmluZ1BsYXllci5wYXJlbnQgPSB0aGlzLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMubW92aW5nUGxheWVyLnNldFBvc2l0aW9uKDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcImRhbmdlcm91c1wiICYmIHRoaXMuZHJvcHBpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnN0YXJ0UG9zLng7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5zdGFydFBvcy55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcclxuXHJcbiAgICAgICAgaWYgKG90aGVyLm5vZGUuZ3JvdXAgPT0gXCJkYW5nZXJvdXNcIiAmJiB0aGlzLmRyb3BwaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5zdGFydFBvcy54O1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuc3RhcnRQb3MueTtcclxuICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucmlzaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvbkVuZENvbnRhY3QoY29udGFjdCwgc2VsZiwgb3RoZXIpIHtcclxuICAgICAgICBsZXQgbG9jYXRpb24gPSBvdGhlci5ub2RlLnggLSB0aGlzLm5vZGUueDtcclxuICAgICAgICBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcInBsYXllclwiKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNPbk1lIC09IDE7XHJcblxyXG4gICAgICAgIGlmIChvdGhlci5ub2RlID09IHRoaXMubW92aW5nUGxheWVyKSB7XHJcbiAgIFxyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1BsYXllciA9IG51bGw7XHJcbiAgICAgICAgICAgIC8vdGhpcy5tb3ZpbmdQbGF5ZXIucGFyZW50ID0gdGhpcy5wbGF5ZXJzO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlVXBEb3duKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZhbGxpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucmlzaW5nID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmlzaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmFsbGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucmlzaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mYWxsaW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlKGR0KSB7XHJcblxyXG4gICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5nYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaWRlVG9TaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5zdGFydFBvcyAtIHRoaXMubm9kZS54KSA+PSB0aGlzLmRpc3RhbmNlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgICAgICAgICAgICAgLy9tb3ZlIG9iamVjdFxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmIubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLnNwZWVkICogZHQgKiB0aGlzLmRpcmVjdGlvbiwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zcGlubmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmFuZ2xlICs9IGR0ICogdGhpcy5zcGluU3BlZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kcm9wcGluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc09uTWUgPiB0aGlzLm1heFBsYXllcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5mYWxsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSAtPSB0aGlzLnNwZWVkICogZHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJpc2luZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgKz0gdGhpcy5zcGVlZCAqIGR0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy51cERvd24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5tb3ZlVXBEb3duLCB0aGlzLm1vdmVVcFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cERvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgIC8vc3RhbmQgb24gbW92aW5nIHBsYXRmb3JtXHJcbiAgICAgICAgLy9pZiAodGhpcy5tb3ZpbmdQbGF5ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIC8vICAgIGxldCBsdiA9IHRoaXMubW92aW5nUGxheWVyLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5O1xyXG4gICAgICAgIC8vICAgIHRoaXMubW92aW5nUGxheWVyLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmFwcGx5Rm9yY2VUb0NlbnRlcihjYy52Mih0aGlzLnNwZWVkICogZHQgKiB0aGlzLmRpcmVjdGlvbiwgMCkpO1xyXG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKGx2LngpO1xyXG4gICAgICAgIC8vfVxyXG4gICAgICAgICAgICBcclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/hitChecker.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '48ba3aDNJ5IHoFZBg7Sk2wk', 'hitChecker');
// code/hitChecker.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    player: cc.Node
  },
  die: function die() {
    if (this.player.getComponent("movement").isPlayer) {
      this.player.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(0, 0);
      this.player.x = cc.find("system").getComponent("gameManager").spawn.x;
      this.player.y = cc.find("system").getComponent("gameManager").spawn.y;
      this.player.getComponent("movement").growing = 1;
      if (cc.sys.platform == cc.sys.WECHAT_GAME) wx.vibrateShort("medium");
    }
  },
  win: function win() {
    if (this.player.getComponent("movement").isPlayer && !cc.find("system").getComponent("client").won) {
      cc.find("Canvas/UI/MOBILE").active = false;
      cc.find("system").getComponent("client").won = true;
      cc.find("system").getComponent("client").sendPlayerState("win");
      this.player.getComponent("movement").disable();
      this.enabled = false;
      cc.find("system").getChildByName("AUDIO").getChildByName("WIN").getComponent(cc.AudioSource).play();
    }
  },
  eatCake: function eatCake(cake) {
    if (this.player.getComponent("movement").isPlayer) {
      this.player.getComponent("movement").ateCake = true;
      cc.find("system").getComponent("client").sendItemState(cake.getComponent("item").id, "used", "cake", null);
      cc.find("Canvas/UI/MOBILE/CAKE").active = true;
    }
  },
  drinkPotion: function drinkPotion(potion) {
    if (this.player.getComponent("movement").isPlayer) {
      this.player.getComponent("movement").atePotion = true;
      cc.find("system").getComponent("client").sendItemState(potion.getComponent("item").id, "used", "potion", null);
      cc.find("Canvas/UI/MOBILE/POTION").active = true;
    }
  },
  openChest: function openChest(chest) {
    chest.getComponent("item").openChest(this.player.getComponent("movement").isPlayer);
  },
  setCheckPoint: function setCheckPoint(checkpoint) {
    // check if gotten already
    if (this.player.getComponent("movement").isPlayer && cc.find("system").getComponent("gameManager").spawn != checkpoint) {
      cc.find("system").getComponent("gameManager").spawn = checkpoint;
      checkpoint.getChildByName("body").getChildByName("FACE").active = false;
      checkpoint.getChildByName("body").getChildByName("FACE2").active = true;
      checkpoint.getComponent(cc.Animation).play("textPopup");
      checkpoint.getComponent(cc.AudioSource).play();
    }
  },
  onCollisionEnter: function onCollisionEnter(other, self) {
    if (other.node.group == "dangerous") this.die();else if (other.node.group == "end") this.win();else if (other.node.group == "checkpoint") this.setCheckPoint(other.node);else if (other.node.group == "item") {
      if (other.node.getComponent("item").type == "cake") this.eatCake(other.node);else if (other.node.getComponent("item").type == "potion") this.drinkPotion(other.node);else if (other.node.getComponent("item").type == "chest") this.openChest(other.node);
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    if (this.player == null) this.player = this.node.getParent();
  },
  update: function update(dt) {//if (!this.player.getComponent("movement").isPlayer)
    //    this.enabled = false; 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcaGl0Q2hlY2tlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllciIsIk5vZGUiLCJkaWUiLCJnZXRDb21wb25lbnQiLCJpc1BsYXllciIsIlJpZ2lkQm9keSIsImxpbmVhclZlbG9jaXR5IiwiVmVjMiIsIngiLCJmaW5kIiwic3Bhd24iLCJ5IiwiZ3Jvd2luZyIsInN5cyIsInBsYXRmb3JtIiwiV0VDSEFUX0dBTUUiLCJ3eCIsInZpYnJhdGVTaG9ydCIsIndpbiIsIndvbiIsImFjdGl2ZSIsInNlbmRQbGF5ZXJTdGF0ZSIsImRpc2FibGUiLCJlbmFibGVkIiwiZ2V0Q2hpbGRCeU5hbWUiLCJBdWRpb1NvdXJjZSIsInBsYXkiLCJlYXRDYWtlIiwiY2FrZSIsImF0ZUNha2UiLCJzZW5kSXRlbVN0YXRlIiwiaWQiLCJkcmlua1BvdGlvbiIsInBvdGlvbiIsImF0ZVBvdGlvbiIsIm9wZW5DaGVzdCIsImNoZXN0Iiwic2V0Q2hlY2tQb2ludCIsImNoZWNrcG9pbnQiLCJBbmltYXRpb24iLCJvbkNvbGxpc2lvbkVudGVyIiwib3RoZXIiLCJzZWxmIiwibm9kZSIsImdyb3VwIiwidHlwZSIsIm9uTG9hZCIsImdldFBhcmVudCIsInVwZGF0ZSIsImR0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLO0FBREgsR0FIUDtBQU9MQyxFQUFBQSxHQVBLLGlCQU9DO0FBQ0YsUUFBSSxLQUFLRixNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNDLFFBQXpDLEVBQW1EO0FBQy9DLFdBQUtKLE1BQUwsQ0FBWUcsWUFBWixDQUF5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QUFWLEVBQWQ7QUFDUCxHQXZGSTtBQXlGTEMsRUFBQUEsTUF6Rkssa0JBeUZFQyxFQXpGRixFQXlGTSxDQUNQO0FBQ0E7QUFDSDtBQTVGSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVyOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBkaWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueCA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueSA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICAgICAgd3gudmlicmF0ZVNob3J0KFwibWVkaXVtXCIpO1xyXG4gICAgICAgIH0gICBcclxuICAgIH0sXHJcblxyXG4gICAgd2luKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmICFjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS53b24pIHtcclxuICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLndvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcIndpblwiKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDaGlsZEJ5TmFtZShcIkFVRElPXCIpLmdldENoaWxkQnlOYW1lKFwiV0lOXCIpLmdldENvbXBvbmVudChjYy5BdWRpb1NvdXJjZSkucGxheSgpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGVhdENha2UoY2FrZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5hdGVDYWtlID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShjYWtlLmdldENvbXBvbmVudChcIml0ZW1cIikuaWQsIFwidXNlZFwiLCBcImNha2VcIiwgbnVsbCk7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIikuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkcmlua1BvdGlvbihwb3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYXRlUG90aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShwb3Rpb24uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCwgXCJ1c2VkXCIsIFwicG90aW9uXCIsIG51bGwpO1xyXG4gICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIikuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb3BlbkNoZXN0KGNoZXN0KSB7XHJcbiAgICAgICAgY2hlc3QuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5vcGVuQ2hlc3QodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpO1xyXG4gICAgfSxcclxuICAgIHNldENoZWNrUG9pbnQoY2hlY2twb2ludCkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIGdvdHRlbiBhbHJlYWR5XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24gIT0gY2hlY2twb2ludCkge1xyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNwYXduID0gY2hlY2twb2ludDtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJGQUNFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjaGVja3BvaW50LmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcIkZBQ0UyXCIpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNoZWNrcG9pbnQuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInRleHRQb3B1cFwiKTtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDb21wb25lbnQoY2MuQXVkaW9Tb3VyY2UpLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gKG90aGVyLCBzZWxmKSB7XHJcblxyXG4gICAgICAgIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiZGFuZ2Vyb3VzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVuZFwiKSBcclxuICAgICAgICAgICAgdGhpcy53aW4oKTtcclxuICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiY2hlY2twb2ludFwiKVxyXG4gICAgICAgICAgICB0aGlzLnNldENoZWNrUG9pbnQob3RoZXIubm9kZSk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcIml0ZW1cIikge1xyXG4gICAgICAgICAgICBpZiAob3RoZXIubm9kZS5nZXRDb21wb25lbnQoXCJpdGVtXCIpLnR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVhdENha2Uob3RoZXIubm9kZSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG90aGVyLm5vZGUuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS50eXBlID09IFwicG90aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyaW5rUG90aW9uKG90aGVyLm5vZGUpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdldENvbXBvbmVudChcIml0ZW1cIikudHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5DaGVzdChvdGhlci5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIC8vaWYgKCF0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcilcclxuICAgICAgICAvLyAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgXHJcbiAgICB9LFxyXG59KTtcclxuIl19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/movement.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'caab8OJVKlDFIqDNLNx5rMw', 'movement');
// code/movement.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    jumpHeight: 0,
    smallJumpHeight: 0,
    jumpDuration: 0,
    moveSpeed: 0,
    smallMoveSpeed: 0,
    isPlayer: false,
    clientScript: cc.Node,
    xSpeed: 0,
    ySpeed: 0,
    localCenter: 0,
    grounder: cc.Node,
    body: cc.Node,
    animation: cc.Animation,
    deltaTime: 0,
    fallMultiplier: 2.5,
    growing: 0,
    maxScale: 1,
    minScale: 0.5,
    ateCake: false,
    atePotion: false,
    grounded: false,
    movingRight: false,
    movingLeft: false,
    joystickMax: 69,
    joystickVector: cc.v2(),
    joystickBall: cc.Node,
    emojis: cc.Node,
    timeStep: 0,
    startTimer: false,
    playingAnimation: true,
    joystickMoving: false,
    playedFalling: false,
    soundController: cc.Node,
    sounds: null,
    busy: false,
    total: 0,
    sum: 0
  },
  disable: function disable() {
    console.log("disabled");

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");
      var jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");
      var potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");
      var cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");
      joystick.off(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
      joystick.off(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
      joystick.off(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
      joystick.off(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
      jumpButton.off(cc.Node.EventType.TOUCH_START, this.jump, this);
      potionButton.off(cc.Node.EventType.TOUCH_START, this.shrink, this);
      cakeButton.off(cc.Node.EventType.TOUCH_START, this.grow, this);
    } else {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    this.node.getComponent(cc.RigidBody).gravityScale = 0;
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(0, 0);
  },
  playEmoji: function playEmoji(type) {
    var emoji = this.emojis.getChildByName(type);
    console.log("emoting"); //no spam error

    if (!emoji.active) {
      emoji.active = true;
      cc.tween(emoji).to(0.5, {
        position: cc.v2(this.node.x + Math.ceil(Math.random() * 1000) * (Math.round(Math.random()) ? 1 : -1), this.node.y + 2000)
      }, {
        easing: 'sineOutIn'
      }).start();
      cc.tween(emoji).delay(1).to(0, {
        position: cc.v2(this.node.getChildByName("body").getChildByName("head").x, this.node.getChildByName("body").getChildByName("head").y)
      }).call(function () {
        emoji.active = false;
      }).start();
    } //this.schedule(function () { emoji.active = false }, 2);

  },
  onBeginContact: function onBeginContact(contact, self, other) {
    console.log("touched");

    if (self.tag == 2 && (other.node.group == "environment" || other.node.group == "movingPlatform")) {
      this.grounded = true; //stop falling animation
      //this.animation.stop("falling");
      //this.playedFalling = false;
      //play  animations

      if (this.moving) {
        this.animation.play("walk");
      } else {
        this.animation.play("land");
        if (this.isPlayer) this.sounds["landing"].play();
        this.scheduleOnce(function () {
          this.playingAnimation = false;
        }, 0.3);
      } //change speed if different size


      if (this.node.scaleY < this.maxScale) {
        if (this.movingRight) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.smallMoveSpeed * this.deltaTime, this.ySpeed);else if (this.movingLeft) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.smallMoveSpeed * this.deltaTime, this.ySpeed);
      } else {
        if (this.movingRight) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.moveSpeed * this.deltaTime, this.ySpeed);else if (this.movingLeft) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.moveSpeed * this.deltaTime, this.ySpeed);
      }
    }
  },
  onEndContact: function onEndContact(contact, self, other) {
    if (self.tag == 2) this.grounded = false;
  },
  jumpRunAction: function jumpRunAction() {
    var jumpUp = cc.tween().by(1, {
      y: 300
    }, {
      easing: 'sineOut'
    });
    var jumpDown = cc.tween().by(1, {
      y: -300
    }, {
      easing: 'sineIn'
    });
    cc.tween(this.node).sequence(jumpUp, jumpDown).start();
  },
  moveRight: function moveRight() {
    this.movingLeft = false;
    this.body.scaleX = -1;

    if (!this.moving && this.grounded) {
      var animState = this.animation.play("walk");
      animState.wrapMode = cc.WrapMode.Loop;
      this.moving = true;
    }

    this.movingRight = true;

    if (this.isPlayer) {
      this.busy = false;
      if (this.node.scaleY < this.maxScale) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.smallMoveSpeed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);else this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.moveSpeed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);
      this.clientScript.getComponent("client").sendPlayerState("right");
    }
  },
  moveLeft: function moveLeft() {
    this.movingRight = false;
    this.body.scaleX = 1;

    if (!this.moving && this.grounded) {
      var animState = this.animation.play("walk");
      animState.wrapMode = cc.WrapMode.Loop;
      this.moving = true;
    }

    this.movingLeft = true;

    if (this.isPlayer) {
      if (this.node.scaleY < this.maxScale) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.smallMoveSpeed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);else this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.moveSpeed * this.deltaTime, this.getComponent(cc.RigidBody).linearVelocity.y);
      this.busy = false;
      this.clientScript.getComponent("client").sendPlayerState("left");
    }
  },
  jump: function jump() {
    if (this.isPlayer) {
      if (this.grounded) {
        this.sounds["jump"].play();
        this.animation.play("jump");
        this.grounded = false;
        this.scheduleOnce(function () {
          //different jump heights depending on size
          if (this.node.scaleY >= this.maxScale) this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.getComponent(cc.RigidBody).linearVelocity.x, this.jumpHeight * this.deltaTime);else this.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.getComponent(cc.RigidBody).linearVelocity.x, this.smallJumpHeight * this.deltaTime);
          this.startTimer = true;
          this.clientScript.getComponent("client").sendPlayerState("jump");
        }, 0.1);
      }
    } else {
      this.animation.stop("walk");
      this.animation.play("jump");
      this.grounded = false;
    }
  },
  stopX: function stopX() {
    this.animation.stop("walk");
    this.busy = false;
    if (this.moving) this.playingAnimation = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.moving = false;

    if (this.isPlayer) {
      //cc.find("Canvas/mainCamera/").getComponent("cameraFollow").xOffsetPlayer = 0;
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(0, this.ySpeed);
      this.clientScript.getComponent("client").sendPlayerState("stopX");
    }
  },
  stopY: function stopY() {
    if (this.isPlayer) {
      this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.xSpeed, 0);
      this.clientScript.getComponent("client").sendPlayerState("stopY");
    }
  },
  shrink: function shrink() {
    if (this.isPlayer && this.atePotion) {
      this.sounds["drinking2"].play();
      this.growing = -1;
    }
  },
  grow: function grow() {
    if (this.isPlayer && this.ateCake) {
      this.sounds["eating"].play();
      this.growing = 1;
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onKeyDown: function onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.w:
        if (this.grounded) this.jump();else console.log("not grouned");
        break;

      case cc.macro.KEY.a:
        this.moveLeft();
        break;

      case cc.macro.KEY.d:
        this.moveRight();
        break;

      case cc.macro.KEY.e:
        this.grow();
        break;

      case cc.macro.KEY.q:
        this.shrink();
        break;

      case cc.macro.KEY.space:
        if (this.grounded) this.jump();
        break;
    }
  },
  onKeyUp: function onKeyUp(event) {
    if (event.keyCode == cc.macro.KEY.w) {//this.stopY();
      //this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.xSpeed, - 100);
    }

    if (event.keyCode == cc.macro.KEY.a) {
      //this.stopX();
      this.movingLeft = false;
    }

    if (event.keyCode == cc.macro.KEY.d) {
      //this.stopX();
      this.movingRight = false;
    }
  },
  onLoad: function onLoad() {
    this.body = this.node.getChildByName("body");
    this.clientScript = cc.find("system");
    this.sounds = new Map(); //map sounds to their audioSource

    for (var i = 0; i < this.soundController.getComponents(cc.AudioSource).length; i++) {
      this.sounds[this.soundController.getComponents(cc.AudioSource)[i].clip.name] = this.soundController.getComponents(cc.AudioSource)[i];
    }
  },
  onDestroy: function onDestroy() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {} else {
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
  },
  joystickStart: function joystickStart(event) {
    var touchPos = event.getLocation();
    var out = cc.v2(); //use camera to get touch pos

    cc.find("Canvas/mainCamera").getComponent(cc.Camera).getScreenToWorldPoint(touchPos, out);
    var localTouchPos = this.joystickBall.parent.convertToNodeSpaceAR(out); //limit ball so it can't leave circle

    this.limitJoystick(localTouchPos); //change pos of ball accordingly

    this.setJoystickBallPos(localTouchPos);
    this.joystickVector = localTouchPos;
    this.joystickMovePlayer();
  },
  joystickMove: function joystickMove(event) {
    var touch = event.getTouches()[0];
    var touchPos = event.getLocation();
    var out = cc.v2(); //use camera to get touch pos

    cc.find("Canvas/mainCamera").getComponent(cc.Camera).getScreenToWorldPoint(touchPos, out);
    var localTouchPos = this.joystickBall.parent.convertToNodeSpaceAR(out); //limit ball so it can't leave circle

    this.limitJoystick(localTouchPos); //change pos of ball accordingly

    this.setJoystickBallPos(localTouchPos);
    this.joystickVector = localTouchPos;
    this.joystickMovePlayer();
  },
  joystickMovePlayer: function joystickMovePlayer() {
    //move player horizontally
    if (this.joystickVector.x > 0) this.moveRight();else if (this.joystickVector.x < 0) this.moveLeft();
    this.joystickMoving = true; //move player vertically
    //if (this.joystickVector.y > 10)
    //    this.jump()
  },
  joystickEnd: function joystickEnd() {
    //stop player
    if (this.joystickMoving) {
      this.movingLeft = false;
      this.movingRight = false;
      this.joystickMoving = false;
    }

    this.joystickVector = cc.Vec2.ZERO;
    this.setJoystickBallPos(cc.Vec2.ZERO);
  },
  setJoystickBallPos: function setJoystickBallPos(pos) {
    this.joystickBall.setPosition(pos);
  },
  limitJoystick: function limitJoystick(joystickVec) {
    var inputMag = joystickVec.mag();

    if (inputMag > this.joystickMax) {
      joystickVec.mulSelf(this.joystickMax / inputMag);
    }
  },
  update: function update(dt) {
    this.xSpeed = this.getComponent(cc.RigidBody).linearVelocity.x;
    this.ySpeed = this.getComponent(cc.RigidBody).linearVelocity.y;
    this.localCenter = this.getComponent(cc.RigidBody).getLocalCenter();
    this.sum += dt;
    this.total += 1;

    if (!this.moving && this.grounded && !this.playingAnimation) {
      this.animation.play("stand");
      this.playingAnimation = true;
    } //if (dt < 0.02 && dt > 0.01)
    //this.deltaTime = dt;
    //console.log(dt);


    if (this.clientScript.getComponent("client").gameStarted) {
      if (this.clientScript.getComponent("client").playerId == 0) {//do nothing
      } else {
        if (this.deltaTime == 0) this.deltaTime = dt;else if (Math.abs(dt - this.sum / this.total) < 0.03) this.deltaTime = dt;

        if (this.clientScript.getComponent("client").playerId == this.node.name && !this.isPlayer) {
          this.isPlayer = true;
          var rb = this.getComponent(cc.RigidBody);

          if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //set mobile touch control listeners
            cc.find("Canvas/mainCamera/UI/MOBILE").active = true;
            this.joystickBall = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK/BALL");
            var joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");
            var jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");
            var potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");
            var cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");
            joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
            joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
            joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
            joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
            jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
            potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
            cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          } else {
            this.joystickBall = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK/BALL");

            var _joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");

            var _jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");

            var _potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");

            var _cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");

            _joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);

            _joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);

            _joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);

            _joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);

            _jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);

            _potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);

            _cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);

            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          }
        }
      }
    } // this.getComponent(cc.RigidBody).gravityScale = dt *     ;
    //if (this.ySpeed < 0) {
    //    //console.log(cc.Vec2(0, cc.director.getPhysicsManager().gravity.y * (this.fallMultiplier - 1) * this.deltaTime));
    //    //.log(cc.director.getPhysicsManager().gravity.y * (this.fallMultiplier - 1) * this.deltaTime);
    //    this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.xSpeed, this.ySpeed + cc.director.getPhysicsManager().gravity.y* this.deltaTime);
    //}
    //if (this.ySpeed > 0 && !jump) {
    //    this.getComponent(cc.RigidBody).linearVelocity += cc.Vec2(this.xSpeed, cc.director.getPhysicsManager().gravity.y * 1 * this.deltaTime);
    //}
    // grow = -1 means shrining


    if (this.isPlayer) {
      if (this.grounded && !cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer > 2 || cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer < 2) {
        if (cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer > 2) cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer -= dt * 200;else if (cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer < 2) cc.find("Canvas/mainCamera").getComponent("cameraFollow").yOffsetPlayer += dt * 200;
      }

      if (cc.find("Canvas/mainCamera").getComponent("cameraFollow").xOffsetPlayer < 50 && this.movingRight) cc.find("Canvas/mainCamera").getComponent("cameraFollow").xOffsetPlayer += dt * 200;
      if (cc.find("Canvas/mainCamera").getComponent("cameraFollow").xOffsetPlayer > -50 && this.movingLeft) cc.find("Canvas/mainCamera").getComponent("cameraFollow").xOffsetPlayer -= dt * 200; //custom gravity
      //if (!this.grounded)
      //    this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.xSpeed, - 100 * Math.abs(this.ySpeed) + -10);
      //console.log(dt * 1000);

      cc.director.getPhysicsManager().gravity = cc.v2(0, -this.deltaTime * 2000);
      this.node.getComponent(cc.RigidBody).gravityScale = this.deltaTime * 6000;
      if (!this.movingRight && !this.movingLeft) this.stopX();

      if (this.growing == 1) {
        if (this.maxScale > this.node.scaleY) {
          this.node.scaleX += 0.05 * dt;
          this.node.scaleY += 0.05 * dt;
        } else {
          this.growing = 0; // increase player velocity if on ground

          if (this.grounded) {
            if (this.movingRight) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.moveSpeed * this.deltaTime, this.ySpeed);else if (this.movingLeft) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.moveSpeed * this.deltaTime, this.ySpeed);
          }
        }
      } else if (this.growing == -1) {
        if (this.minScale < this.node.scaleY) {
          this.node.scaleX -= 0.05 * dt;
          this.node.scaleY -= 0.05 * dt;
        } else {
          this.growing = 0; // decrease player velocity if on ground

          if (this.grounded) {
            if (this.movingRight) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(this.smallMoveSpeed * this.deltaTime, this.ySpeed);else if (this.movingLeft) this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(-this.smallMoveSpeed * this.deltaTime, this.ySpeed);
          }
        }
      }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92ZW1lbnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJqdW1wSGVpZ2h0Iiwic21hbGxKdW1wSGVpZ2h0IiwianVtcER1cmF0aW9uIiwibW92ZVNwZWVkIiwic21hbGxNb3ZlU3BlZWQiLCJpc1BsYXllciIsImNsaWVudFNjcmlwdCIsIk5vZGUiLCJ4U3BlZWQiLCJ5U3BlZWQiLCJsb2NhbENlbnRlciIsImdyb3VuZGVyIiwiYm9keSIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsImRlbHRhVGltZSIsImZhbGxNdWx0aXBsaWVyIiwiZ3Jvd2luZyIsIm1heFNjYWxlIiwibWluU2NhbGUiLCJhdGVDYWtlIiwiYXRlUG90aW9uIiwiZ3JvdW5kZWQiLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJqb3lzdGlja01heCIsImpveXN0aWNrVmVjdG9yIiwidjIiLCJqb3lzdGlja0JhbGwiLCJlbW9qaXMiLCJ0aW1lU3RlcCIsInN0YXJ0VGltZXIiLCJwbGF5aW5nQW5pbWF0aW9uIiwiam95c3RpY2tNb3ZpbmciLCJwbGF5ZWRGYWxsaW5nIiwic291bmRDb250cm9sbGVyIiwic291bmRzIiwiYnVzeSIsInRvdGFsIiwic3VtIiwiZGlzYWJsZSIsImNvbnNvbGUiLCJsb2ciLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FIiwiam95c3RpY2siLCJmaW5kIiwianVtcEJ1dHRvbiIsInBvdGlvbkJ1dHRvbiIsImNha2VCdXR0b24iLCJvZmYiLCJFdmVudFR5cGUiLCJUT1VDSF9TVEFSVCIsImpveXN0aWNrU3RhcnQiLCJUT1VDSF9NT1ZFIiwiam95c3RpY2tNb3ZlIiwiVE9VQ0hfRU5EIiwiam95c3RpY2tFbmQiLCJUT1VDSF9DQU5DRUwiLCJqdW1wIiwic2hyaW5rIiwiZ3JvdyIsInN5c3RlbUV2ZW50IiwiU3lzdGVtRXZlbnQiLCJLRVlfRE9XTiIsIm9uS2V5RG93biIsIktFWV9VUCIsIm9uS2V5VXAiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiUmlnaWRCb2R5IiwiZ3Jhdml0eVNjYWxlIiwibGluZWFyVmVsb2NpdHkiLCJWZWMyIiwicGxheUVtb2ppIiwidHlwZSIsImVtb2ppIiwiZ2V0Q2hpbGRCeU5hbWUiLCJhY3RpdmUiLCJ0d2VlbiIsInRvIiwicG9zaXRpb24iLCJ4IiwiTWF0aCIsImNlaWwiLCJyYW5kb20iLCJyb3VuZCIsInkiLCJlYXNpbmciLCJzdGFydCIsImRlbGF5IiwiY2FsbCIsIm9uQmVnaW5Db250YWN0IiwiY29udGFjdCIsInNlbGYiLCJvdGhlciIsInRhZyIsImdyb3VwIiwibW92aW5nIiwicGxheSIsInNjaGVkdWxlT25jZSIsInNjYWxlWSIsIm9uRW5kQ29udGFjdCIsImp1bXBSdW5BY3Rpb24iLCJqdW1wVXAiLCJieSIsImp1bXBEb3duIiwic2VxdWVuY2UiLCJtb3ZlUmlnaHQiLCJzY2FsZVgiLCJhbmltU3RhdGUiLCJ3cmFwTW9kZSIsIldyYXBNb2RlIiwiTG9vcCIsInNlbmRQbGF5ZXJTdGF0ZSIsIm1vdmVMZWZ0Iiwic3RvcCIsInN0b3BYIiwic3RvcFkiLCJldmVudCIsImtleUNvZGUiLCJtYWNybyIsIktFWSIsInciLCJhIiwiZCIsImUiLCJxIiwic3BhY2UiLCJvbkxvYWQiLCJNYXAiLCJpIiwiZ2V0Q29tcG9uZW50cyIsIkF1ZGlvU291cmNlIiwibGVuZ3RoIiwiY2xpcCIsIm5hbWUiLCJvbkRlc3Ryb3kiLCJ0b3VjaFBvcyIsImdldExvY2F0aW9uIiwib3V0IiwiQ2FtZXJhIiwiZ2V0U2NyZWVuVG9Xb3JsZFBvaW50IiwibG9jYWxUb3VjaFBvcyIsInBhcmVudCIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwibGltaXRKb3lzdGljayIsInNldEpveXN0aWNrQmFsbFBvcyIsImpveXN0aWNrTW92ZVBsYXllciIsInRvdWNoIiwiZ2V0VG91Y2hlcyIsIlpFUk8iLCJwb3MiLCJzZXRQb3NpdGlvbiIsImpveXN0aWNrVmVjIiwiaW5wdXRNYWciLCJtYWciLCJtdWxTZWxmIiwidXBkYXRlIiwiZHQiLCJnZXRMb2NhbENlbnRlciIsImdhbWVTdGFydGVkIiwicGxheWVySWQiLCJhYnMiLCJyYiIsIm9uIiwieU9mZnNldFBsYXllciIsInhPZmZzZXRQbGF5ZXIiLCJkaXJlY3RvciIsImdldFBoeXNpY3NNYW5hZ2VyIiwiZ3Jhdml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFVBQVUsRUFBRSxDQURKO0FBRVJDLElBQUFBLGVBQWUsRUFBRSxDQUZUO0FBR1JDLElBQUFBLFlBQVksRUFBRSxDQUhOO0FBSVJDLElBQUFBLFNBQVMsRUFBRSxDQUpIO0FBS1JDLElBQUFBLGNBQWMsRUFBRSxDQUxSO0FBTVJDLElBQUFBLFFBQVEsRUFBRSxLQU5GO0FBT1JDLElBQUFBLFlBQVksRUFBRVYsRUFBRSxDQUFDVyxJQVBUO0FBUVJDLElBQUFBLE1BQU0sRUFBRSxDQVJBO0FBU1JDLElBQUFBLE1BQU0sRUFBRSxDQVRBO0FBVVJDLElBQUFBLFdBQVcsRUFBRSxDQVZMO0FBV1JDLElBQUFBLFFBQVEsRUFBRWYsRUFBRSxDQUFDVyxJQVhMO0FBWVJLLElBQUFBLElBQUksRUFBRWhCLEVBQUUsQ0FBQ1csSUFaRDtBQWFSTSxJQUFBQSxTQUFTLEVBQUVqQixFQUFFLENBQUNrQixTQWJOO0FBY1JDLElBQUFBLFNBQVMsRUFBRSxDQWRIO0FBZVJDLElBQUFBLGNBQWMsRUFBRSxHQWZSO0FBZ0JSQyxJQUFBQSxPQUFPLEVBQUUsQ0FoQkQ7QUFpQlJDLElBQUFBLFFBQVEsRUFBRSxDQWpCRjtBQWtCUkMsSUFBQUEsUUFBUSxFQUFFLEdBbEJGO0FBbUJSQyxJQUFBQSxPQUFPLEVBQUUsS0FuQkQ7QUFvQlJDLElBQUFBLFNBQVMsRUFBRSxLQXBCSDtBQXFCUkMsSUFBQUEsUUFBUSxFQUFFLEtBckJGO0FBc0JS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QUUsQ0FBQzJFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRDdFLEVBQUUsQ0FBQzhFLElBQUgsQ0FBUSxDQUFDLEtBQUt0RSxjQUFOLEdBQXVCLEtBQUtXLFNBQXBDLEVBQStDLEtBQUtOLE1BQXBELENBQWpEO0FBQ1A7QUFDSjtBQUNKO0FBQ0o7QUFHSjtBQTFoQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAganVtcEhlaWdodDogMCxcclxuICAgICAgICBzbWFsbEp1bXBIZWlnaHQ6IDAsXHJcbiAgICAgICAganVtcER1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1vdmVTcGVlZDogMCxcclxuICAgICAgICBzbWFsbE1vdmVTcGVlZDogMCxcclxuICAgICAgICBpc1BsYXllcjogZmFsc2UsXHJcbiAgICAgICAgY2xpZW50U2NyaXB0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHhTcGVlZDogMCxcclxuICAgICAgICB5U3BlZWQ6IDAsXHJcbiAgICAgICAgbG9jYWxDZW50ZXI6IDAsXHJcbiAgICAgICAgZ3JvdW5kZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgYm9keTogY2MuTm9kZSxcclxuICAgICAgICBhbmltYXRpb246IGNjLkFuaW1hdGlvbixcclxuICAgICAgICBkZWx0YVRpbWU6IDAsXHJcbiAgICAgICAgZmFsbE11bHRpcGxpZXI6IDIuNSxcclxuICAgICAgICBncm93aW5nOiAwLFxyXG4gICAgICAgIG1heFNjYWxlOiAxLFxyXG4gICAgICAgIG1pblNjYWxlOiAwLjUsXHJcbiAgICAgICAgYXRlQ2FrZTogZmFsc2UsXHJcbiAgICAgICAgYXRlUG90aW9uOiBmYWxzZSxcclxuICAgICAgICBncm91bmRlZDogZmFsc2UsXHJcbiAgICAgICAgbW92aW5nUmlnaHQ6IGZhbHNlLFxyXG4gICAgICAgIG1vdmluZ0xlZnQ6IGZhbHNlLFxyXG4gICAgICAgIGpveXN0aWNrTWF4OiA2OSxcclxuICAgICAgICBqb3lzdGlja1ZlY3RvcjogY2MudjIoKSxcclxuICAgICAgICBqb3lzdGlja0JhbGw6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVTdGVwOiAwLFxyXG4gICAgICAgIHN0YXJ0VGltZXI6IGZhbHNlLFxyXG4gICAgICAgIHBsYXlpbmdBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgam95c3RpY2tNb3Zpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBsYXllZEZhbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIHNvdW5kQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBzb3VuZHM6IG51bGwsXHJcbiAgICAgICAgYnVzeTogZmFsc2UsXHJcblxyXG4gICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgIHN1bTogMCxcclxuICAgIH0sXHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIGxldCBqb3lzdGljayA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSk9ZU1RJQ0tcIik7XHJcbiAgICAgICAgICAgIGxldCBqdW1wQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9QT1RJT05cIik7XHJcbiAgICAgICAgICAgIGxldCBjYWtlQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9DQUtFXCIpO1xyXG4gICAgICAgICAgICBqb3lzdGljay5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLmpveXN0aWNrTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICBqb3lzdGljay5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAganVtcEJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuanVtcCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHBvdGlvbkJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgY2FrZUJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdyYXZpdHlTY2FsZSA9IDA7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigwLCAwKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBwbGF5RW1vamkodHlwZSkge1xyXG4gICAgICAgIGxldCBlbW9qaSA9IHRoaXMuZW1vamlzLmdldENoaWxkQnlOYW1lKHR5cGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW1vdGluZ1wiKTtcclxuICAgICAgICAvL25vIHNwYW0gZXJyb3JcclxuICAgICAgICBpZiAoISBlbW9qaS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgZW1vamkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MudHdlZW4oZW1vamkpLnRvKDAuNSwgeyBwb3NpdGlvbjogY2MudjIodGhpcy5ub2RlLnggKyBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDApICogKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgPyAxIDogLTEpLCB0aGlzLm5vZGUueSArIDIwMDApIH0sIHsgZWFzaW5nOiAnc2luZU91dEluJyB9KS5zdGFydCgpO1xyXG4gICAgICAgICAgICBjYy50d2VlbihlbW9qaSkuZGVsYXkoMSkudG8oMCwgeyBwb3NpdGlvbjogY2MudjIodGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcImhlYWRcIikueCwgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcImhlYWRcIikueSkgfSkuY2FsbCgoKSA9PiB7IGVtb2ppLmFjdGl2ZSA9IGZhbHNlIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7IGVtb2ppLmFjdGl2ZSA9IGZhbHNlIH0sIDIpO1xyXG4gICAgfSxcclxuICAgIG9uQmVnaW5Db250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0b3VjaGVkXCIpO1xyXG4gICAgICAgIGlmIChzZWxmLnRhZyA9PSAyICYmIChvdGhlci5ub2RlLmdyb3VwID09IFwiZW52aXJvbm1lbnRcIiB8fCBvdGhlci5ub2RlLmdyb3VwID09IFwibW92aW5nUGxhdGZvcm1cIikpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vc3RvcCBmYWxsaW5nIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAvL3RoaXMuYW5pbWF0aW9uLnN0b3AoXCJmYWxsaW5nXCIpO1xyXG4gICAgICAgICAgICAvL3RoaXMucGxheWVkRmFsbGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy9wbGF5ICBhbmltYXRpb25zXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcIndhbGtcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwibGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUGxheWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzW1wibGFuZGluZ1wiXS5wbGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgMC4zKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NoYW5nZSBzcGVlZCBpZiBkaWZmZXJlbnQgc2l6ZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMuc21hbGxNb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkVuZENvbnRhY3QoY29udGFjdCwgc2VsZiwgb3RoZXIpIHtcclxuICAgICAgICBpZiAoc2VsZi50YWcgPT0gMilcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGp1bXBSdW5BY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGp1bXBVcCA9IGNjLnR3ZWVuKCkuYnkoMSwgeyB5OiAzMDAgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KTtcclxuICAgICAgICB2YXIganVtcERvd24gPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogLTMwMCB9LCB7IGVhc2luZzogJ3NpbmVJbicgfSk7XHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5ub2RlKS5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duKS5zdGFydCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlUmlnaHQoKSB7XHJcbiAgIFxyXG4gICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9keS5zY2FsZVggPSAtMTtcclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1TdGF0ZSA9IHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICBhbmltU3RhdGUud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwicmlnaHRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdmVMZWZ0KCkge1xyXG4gICBcclxuICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2R5LnNjYWxlWCA9IDE7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgYW5pbVN0YXRlLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuc2NhbGVZIDwgdGhpcy5tYXhTY2FsZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kUGxheWVyU3RhdGUoXCJsZWZ0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAganVtcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbXCJqdW1wXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kaWZmZXJlbnQganVtcCBoZWlnaHRzIGRlcGVuZGluZyBvbiBzaXplXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPj0gdGhpcy5tYXhTY2FsZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLnYyKHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueCwgdGhpcy5qdW1wSGVpZ2h0ICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLnYyKHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueCwgdGhpcy5zbWFsbEp1bXBIZWlnaHQgKiB0aGlzLmRlbHRhVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVyID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kUGxheWVyU3RhdGUoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgMC4xKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwianVtcFwiKTsgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuICAgIHN0b3BYKCkge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoXCJ3YWxrXCIpO1xyXG4gICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLm1vdmluZylcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nQW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgLy9jYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoMCwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2hyaW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlUG90aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW1wiZHJpbmtpbmcyXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBncm93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlQ2FrZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tcImVhdGluZ1wiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgZ3JvdW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5hOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3coKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5xOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaHJpbmsoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5zcGFjZTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uS2V5VXAoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gY2MubWFjcm8uS0VZLncpIHtcclxuICAgICAgICAgICAgLy90aGlzLnN0b3BZKCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5hKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5kKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50U2NyaXB0ID0gY2MuZmluZChcInN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgLy9tYXAgc291bmRzIHRvIHRoZWlyIGF1ZGlvU291cmNlXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1t0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKVtpXS5jbGlwLm5hbWVdID0gdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRvdWNoUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcclxuICAgICAgICAvL3VzZSBjYW1lcmEgdG8gZ2V0IHRvdWNoIHBvc1xyXG4gICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoY2MuQ2FtZXJhKS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodG91Y2hQb3MsIG91dCk7XHJcbiAgICAgICAgbGV0IGxvY2FsVG91Y2hQb3MgPSB0aGlzLmpveXN0aWNrQmFsbC5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIob3V0KTtcclxuXHJcbiAgICAgICAgLy9saW1pdCBiYWxsIHNvIGl0IGNhbid0IGxlYXZlIGNpcmNsZVxyXG4gICAgICAgIHRoaXMubGltaXRKb3lzdGljayhsb2NhbFRvdWNoUG9zKTtcclxuXHJcbiAgICAgICAgLy9jaGFuZ2UgcG9zIG9mIGJhbGwgYWNjb3JkaW5nbHlcclxuICAgICAgICB0aGlzLnNldEpveXN0aWNrQmFsbFBvcyhsb2NhbFRvdWNoUG9zKTsgXHJcbiAgICAgICAgdGhpcy5qb3lzdGlja1ZlY3RvciA9IGxvY2FsVG91Y2hQb3M7XHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZlUGxheWVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpveXN0aWNrTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCB0b3VjaCA9IGV2ZW50LmdldFRvdWNoZXMoKVswXTtcclxuICAgICAgICBsZXQgdG91Y2hQb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBvdXQgPSBjYy52MigpO1xyXG4gICAgICAgIC8vdXNlIGNhbWVyYSB0byBnZXQgdG91Y2ggcG9zXHJcbiAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChjYy5DYW1lcmEpLmdldFNjcmVlblRvV29ybGRQb2ludCh0b3VjaFBvcywgb3V0KTtcclxuICAgICAgICBsZXQgbG9jYWxUb3VjaFBvcyA9IHRoaXMuam95c3RpY2tCYWxsLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvdXQpO1xyXG5cclxuICAgICAgICAvL2xpbWl0IGJhbGwgc28gaXQgY2FuJ3QgbGVhdmUgY2lyY2xlXHJcbiAgICAgICAgdGhpcy5saW1pdEpveXN0aWNrKGxvY2FsVG91Y2hQb3MpO1xyXG5cclxuICAgICAgICAvL2NoYW5nZSBwb3Mgb2YgYmFsbCBhY2NvcmRpbmdseVxyXG4gICAgICAgIHRoaXMuc2V0Sm95c3RpY2tCYWxsUG9zKGxvY2FsVG91Y2hQb3MpO1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBsb2NhbFRvdWNoUG9zO1xyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92ZVBsYXllcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja01vdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgLy9tb3ZlIHBsYXllciBob3Jpem9udGFsbHlcclxuICAgICAgICBpZiAodGhpcy5qb3lzdGlja1ZlY3Rvci54ID4gMClcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLmpveXN0aWNrVmVjdG9yLnggPCAwKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vbW92ZSBwbGF5ZXIgdmVydGljYWxseVxyXG4gICAgICAgIC8vaWYgKHRoaXMuam95c3RpY2tWZWN0b3IueSA+IDEwKVxyXG4gICAgICAgIC8vICAgIHRoaXMuanVtcCgpXHJcbiAgICB9LFxyXG4gICAgam95c3RpY2tFbmQoKSB7XHJcbiAgICAgICAgLy9zdG9wIHBsYXllclxyXG4gICAgICAgIGlmICh0aGlzLmpveXN0aWNrTW92aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBjYy5WZWMyLlpFUk87XHJcbiAgICAgICAgdGhpcy5zZXRKb3lzdGlja0JhbGxQb3MoY2MuVmVjMi5aRVJPKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Sm95c3RpY2tCYWxsUG9zKHBvcykge1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYWxsLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxpbWl0Sm95c3RpY2soam95c3RpY2tWZWMpIHtcclxuICAgICAgICBsZXQgaW5wdXRNYWcgPSBqb3lzdGlja1ZlYy5tYWcoKTtcclxuICAgICAgICBpZiAoaW5wdXRNYWcgPiB0aGlzLmpveXN0aWNrTWF4KSB7XHJcbiAgICAgICAgICAgIGpveXN0aWNrVmVjLm11bFNlbGYodGhpcy5qb3lzdGlja01heCAvIGlucHV0TWFnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuIFxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMueVNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55O1xyXG4gICAgICAgIHRoaXMubG9jYWxDZW50ZXIgPSB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdldExvY2FsQ2VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdW0gKz0gZHQ7XHJcbiAgICAgICAgdGhpcy50b3RhbCArPSAxO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQgJiYgIXRoaXMucGxheWluZ0FuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwic3RhbmRcIik7ICAgXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYgKGR0IDwgMC4wMiAmJiBkdCA+IDAuMDEpXHJcbiAgICAgICAgLy90aGlzLmRlbHRhVGltZSA9IGR0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmdhbWVTdGFydGVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlbHRhVGltZSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gZHQ7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkdCAtICh0aGlzLnN1bSAvIHRoaXMudG90YWwpKSA8IDAuMDMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IHRoaXMubm9kZS5uYW1lICYmICF0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJiID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KT1lTVElDSy9CQUxMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KT1lTVElDSy9CQUxMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgIC8vIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gZHQgKiAgICAgO1xyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkIDwgMCkge1xyXG4gICAgICAgIC8vICAgIC8vY29uc29sZS5sb2coY2MuVmVjMigwLCBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSkpO1xyXG4gICAgICAgIC8vICAgIC8vLmxvZyhjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSk7XHJcblxyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCB0aGlzLnlTcGVlZCArIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eS55KiB0aGlzLmRlbHRhVGltZSk7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkID4gMCAmJiAhanVtcCkge1xyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgKz0gY2MuVmVjMih0aGlzLnhTcGVlZCwgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAxICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvLyBncm93ID0gLTEgbWVhbnMgc2hyaW5pbmdcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQgJiYgIWNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIgfHwgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMilcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgKz0gZHQgKiAyMDA7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIDwgNTAgJiYgdGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciArPSBkdCAqIDIwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnhPZmZzZXRQbGF5ZXIgPiAtNTAgJiYgdGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jdXN0b20gZ3Jhdml0eVxyXG4gICAgICAgICAgICAvL2lmICghdGhpcy5ncm91bmRlZClcclxuICAgICAgICAgICAgLy8gICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwICogTWF0aC5hYnModGhpcy55U3BlZWQpICsgLTEwKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkdCAqIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5ID0gY2MudjIoMCwgLXRoaXMuZGVsdGFUaW1lICogMjAwMCk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5ncmF2aXR5U2NhbGUgPSB0aGlzLmRlbHRhVGltZSAqIDYwMDA7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vdmluZ1JpZ2h0ICYmICF0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BYKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ncm93aW5nID09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhTY2FsZSA+IHRoaXMubm9kZS5zY2FsZVkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVYICs9IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVZICs9IDAuMDUgKiBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIHBsYXllciB2ZWxvY2l0eSBpZiBvbiBncm91bmRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3Jvd2luZyA9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblNjYWxlIDwgdGhpcy5ub2RlLnNjYWxlWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVggLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVkgLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVjcmVhc2UgcGxheWVyIHZlbG9jaXR5IGlmIG9uIGdyb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/storyManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '56304dpblJDHYvlEvlTj4bj', 'storyManager');
// code/storyManager.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    panel1: cc.Node,
    panel2: cc.Node,
    panel3: cc.Node,
    panel4: cc.Node,
    panel5: cc.Node,
    shake: cc.Node,
    rabbit: cc.Node,
    text: cc.Label,
    textArea: cc.Node,
    showTextSpeed: 0.1,
    speech1: "Alice, welcome back to Wonderland!",
    speech2: " However, I must tell you that this world is no longer the same as before. ",
    speech3: "Things have changed and now you aren't the only Alice. In fact, there are tons of Alices. ",
    speech4: "The Red Queen is forcing them to compete against each other in a race.If you reach the end, you will gain crowns.Lose and you might lose crowns.",
    speech5: "If you win enough crowns, you may be able to escape Wonderland.",
    speech6: "I wish you the best of luck.",
    theChar: 'a',
    textIndex: 0,
    theTextA: "",
    coolNode: cc.Node,
    thanks: cc.Node
  },
  showChar: function showChar() {
    this.text.string += this.theChar;
  },
  // LIFE-CYCLE CALLBACKS:
  revealText: function revealText(theText) {
    this.text.string = "";
    this.textIndex = 0;
    this.theTextA = theText;

    for (var i = 0; i < theText.length; i++) {
      this.scheduleOnce(function () {
        if (this.textIndex < this.theTextA.length) {
          this.text.string += this.theTextA[this.textIndex];
          this.textIndex += 1;
        }
      }, this.showTextSpeed * i);
    }
  },
  skip: function skip() {
    cc.director.loadScene("home");
  },
  onLoad: function onLoad() {
    console.log(this.speech1[0]);
    this.panel1.opacity = 0;
    this.panel2.opacity = 0;
    this.panel3.opacity = 0;
    this.panel4.opacity = 0;
    this.panel5.opacity = 0;
    this.rabbit.opacity = 0;
    this.textArea.opacity = 0;
    this.coolNode.opacity = 0;
    this.shake.opacity = 0;
    cc.tween(this.panel1).to(2, {
      opacity: 255
    }, {
      easing: 'sineOut'
    }).start();
    this.scheduleOnce(function () {
      cc.tween(this.panel2).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
    }, 3);
    this.scheduleOnce(function () {
      cc.tween(this.panel3).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
    }, 6);
    this.scheduleOnce(function () {
      this.panel1.active = false;
      this.panel2.active = false;
      this.panel3.active = false;
      cc.tween(this.panel4).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
    }, 14);
    this.scheduleOnce(function () {
      cc.tween(this.panel5).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
      cc.tween(this.shake).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
    }, 18);
    this.scheduleOnce(function () {
      this.panel4.active = false;
      this.panel5.active = false;
      this.shake.active = false;
      cc.tween(this.rabbit).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
      cc.tween(this.textArea).to(2, {
        opacity: 255
      }, {
        easing: 'sineOut'
      }).start();
    }, 26);
    this.scheduleOnce(function () {
      //speech1
      this.revealText(this.speech1);
      this.scheduleOnce(function () {
        //speech2
        this.revealText(this.speech2);
        this.scheduleOnce(function () {
          //speech3
          this.revealText(this.speech3);
          this.scheduleOnce(function () {
            //speech4
            this.revealText(this.speech4);
            this.scheduleOnce(function () {
              //speech5
              this.revealText(this.speech5);
              this.scheduleOnce(function () {
                //speech6
                this.revealText(this.speech6);
                this.scheduleOnce(function () {
                  cc.tween(this.coolNode).to(2, {
                    opacity: 255
                  }, {
                    easing: 'sineOut'
                  }).start(); // thankyou

                  this.scheduleOnce(function () {
                    cc.tween(this.thanks).to(2, {
                      scaleX: 0.9,
                      scaleY: 0.9
                    }, {
                      easing: 'sineOut'
                    }).start(); //switch scene

                    this.scheduleOnce(function () {
                      cc.director.loadScene("home");
                    }, 3);
                  }, 2);
                }, 7);
              }, 8);
            }, 14);
          }, 8);
        }, 8);
      }, 6);
    }, 27);
  } // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcc3RvcnlNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFuZWwxIiwiTm9kZSIsInBhbmVsMiIsInBhbmVsMyIsInBhbmVsNCIsInBhbmVsNSIsInNoYWtlIiwicmFiYml0IiwidGV4dCIsIkxhYmVsIiwidGV4dEFyZWEiLCJzaG93VGV4dFNwZWVkIiwic3BlZWNoMSIsInNwZWVjaDIiLCJzcGVlY2gzIiwic3BlZWNoNCIsInNwZWVjaDUiLCJzcGVlY2g2IiwidGhlQ2hhciIsInRleHRJbmRleCIsInRoZVRleHRBIiwiY29vbE5vZGUiLCJ0aGFua3MiLCJzaG93Q2hhciIsInN0cmluZyIsInJldmVhbFRleHQiLCJ0aGVUZXh0IiwiaSIsImxlbmd0aCIsInNjaGVkdWxlT25jZSIsInNraXAiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIm9uTG9hZCIsImNvbnNvbGUiLCJsb2ciLCJvcGFjaXR5IiwidHdlZW4iLCJ0byIsImVhc2luZyIsInN0YXJ0IiwiYWN0aXZlIiwic2NhbGVYIiwic2NhbGVZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLLElBREg7QUFFUkMsSUFBQUEsTUFBTSxFQUFFTixFQUFFLENBQUNLLElBRkg7QUFHUkUsSUFBQUEsTUFBTSxFQUFFUCxFQUFFLENBQUNLLElBSEg7QUFJUkcsSUFBQUEsTUFBTSxFQUFFUixFQUFFLENBQUNLLElBSkg7QUFLUkksSUFBQUEsTUFBTSxFQUFFVCxFQUFFLENBQUNLLElBTEg7QUFNUkssSUFBQUEsS0FBSyxFQUFFVixFQUFFLENBQUNLLElBTkY7QUFPUk0sSUFB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aUNHLENBakNIO0FBa0NILEtBckNELEVBcUNHLEVBckNIO0FBMkNILEdBM0lJLENBNklMOztBQTdJSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGFuZWwxOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsMjogY2MuTm9kZSxcclxuICAgICAgICBwYW5lbDM6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFuZWw0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsNTogY2MuTm9kZSxcclxuICAgICAgICBzaGFrZTogY2MuTm9kZSxcclxuICAgICAgICByYWJiaXQ6IGNjLk5vZGUsXHJcbiAgICAgICAgdGV4dDogY2MuTGFiZWwsXHJcbiAgICAgICAgdGV4dEFyZWE6IGNjLk5vZGUsXHJcbiAgICAgICAgc2hvd1RleHRTcGVlZDowLjEsXHJcblxyXG4gICAgICAgIHNwZWVjaDE6IFwiQWxpY2UsIHdlbGNvbWUgYmFjayB0byBXb25kZXJsYW5kIVwiLFxyXG4gICAgICAgIHNwZWVjaDI6IFwiIEhvd2V2ZXIsIEkgbXVzdCB0ZWxsIHlvdSB0aGF0IHRoaXMgd29ybGQgaXMgbm8gbG9uZ2VyIHRoZSBzYW1lIGFzIGJlZm9yZS4gXCIsXHJcbiAgICAgICAgc3BlZWNoMzogXCJUaGluZ3MgaGF2ZSBjaGFuZ2VkIGFuZCBub3cgeW91IGFyZW4ndCB0aGUgb25seSBBbGljZS4gSW4gZmFjdCwgdGhlcmUgYXJlIHRvbnMgb2YgQWxpY2VzLiBcIixcclxuICAgICAgICBzcGVlY2g0OiBcIlRoZSBSZWQgUXVlZW4gaXMgZm9yY2luZyB0aGVtIHRvIGNvbXBldGUgYWdhaW5zdCBlYWNoIG90aGVyIGluIGEgcmFjZS5JZiB5b3UgcmVhY2ggdGhlIGVuZCwgeW91IHdpbGwgZ2FpbiBjcm93bnMuTG9zZSBhbmQgeW91IG1pZ2h0IGxvc2UgY3Jvd25zLlwiLFxyXG4gICAgICAgIHNwZWVjaDU6IFwiSWYgeW91IHdpbiBlbm91Z2ggY3Jvd25zLCB5b3UgbWF5IGJlIGFibGUgdG8gZXNjYXBlIFdvbmRlcmxhbmQuXCIsXHJcbiAgICAgICAgc3BlZWNoNjogXCJJIHdpc2ggeW91IHRoZSBiZXN0IG9mIGx1Y2suXCIsXHJcbiAgICAgICAgdGhlQ2hhcjogJ2EnLFxyXG4gICAgICAgIHRleHRJbmRleDogMCxcclxuICAgICAgICB0aGVUZXh0QTogXCJcIixcclxuXHJcbiAgICAgICAgY29vbE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgdGhhbmtzOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93Q2hhcigpIHtcclxuICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlQ2hhcjtcclxuICAgIH0sXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuICAgIHJldmVhbFRleHQodGhlVGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGV4dEluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLnRoZVRleHRBID0gdGhlVGV4dDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoZVRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dEluZGV4IDwgdGhpcy50aGVUZXh0QS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlVGV4dEFbdGhpcy50ZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEluZGV4ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuc2hvd1RleHRTcGVlZCAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBza2lwKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3BlZWNoMVswXSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbDEub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDIub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDMub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5yYWJiaXQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0QXJlYS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB0aGlzLmNvb2xOb2RlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHRoaXMuc2hha2Uub3BhY2l0eSA9IDA7XHJcblxyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWwxKS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5wYW5lbDIpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYy50d2Vlbih0aGlzLnBhbmVsMykudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgIH0sIDYpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwxLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsMi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5wYW5lbDMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw0KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgfSwgMTQpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw1KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMuc2hha2UpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAxOCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFuZWw0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsNS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zaGFrZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5yYWJiaXQpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy50ZXh0QXJlYSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LCAyNik7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3NwZWVjaDFcclxuICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vc3BlZWNoMlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2gzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwZWVjaDRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BlZWNoNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2g2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy5jb29sTm9kZSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhbmt5b3VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy50aGFua3MpLnRvKDIsIHsgc2NhbGVYOiAwLjksIHNjYWxlWTogMC45IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3N3aXRjaCBzY2VuZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDgpO1xyXG4gICAgICAgICAgICAgICAgfSwgOCk7XHJcbiAgICAgICAgICAgIH0sIDYpO1xyXG4gICAgICAgIH0sIDI3KTtcclxuXHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/aboutPlayer.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '24e50iIUj1Pe5bYvGHChgiW', 'aboutPlayer');
// code/aboutPlayer.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    playerId: null,
    room: null,
    crowns: 0,
    openid: null,
    serverIp: null,
    houseIndex: 0
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.game.addPersistRootNode(this.node);
  } // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcYWJvdXRQbGF5ZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJwbGF5ZXJJZCIsInJvb20iLCJjcm93bnMiLCJvcGVuaWQiLCJzZXJ2ZXJJcCIsImhvdXNlSW5kZXgiLCJvbkxvYWQiLCJnYW1lIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwibm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFFBQVEsRUFBRSxJQURGO0FBRVJDLElBQUFBLElBQUksRUFBRSxJQUZFO0FBR1JDLElBQUFBLE1BQU0sRUFBRSxDQUhBO0FBSVJDLElBQUFBLE1BQU0sRUFBRSxJQUpBO0FBS1JDLElBQUFBLFFBQVEsRUFBRSxJQUxGO0FBTVJDLElBQUFBLFVBQVUsRUFBRTtBQU5KLEdBSFA7QUFZTDtBQUVBQyxFQUFBQSxNQWRLLG9CQWNJO0FBQ0xWLElBQUFBLEVBQUUsQ0FBQ1csSUFBSCxDQUFRQyxrQkFBUixDQUEyQixLQUFLQyxJQUFoQztBQUNILEdBaEJJLENBa0JMOztBQWxCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcklkOiBudWxsLFxyXG4gICAgICAgIHJvb206IG51bGwsXHJcbiAgICAgICAgY3Jvd25zOiAwLFxyXG4gICAgICAgIG9wZW5pZDogbnVsbCxcclxuICAgICAgICBzZXJ2ZXJJcDogbnVsbCxcclxuICAgICAgICBob3VzZUluZGV4OiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUodGhpcy5ub2RlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbn0pO1xyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/start.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9c385fHokpDq6x4arEvSZ2D', 'start');
// code/start.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    background: cc.Node,
    playedBefore: false
  },
  onLoad: function onLoad() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      wx.getStorage({
        key: "played",
        success: function success(res) {
          //played before
          cc.find("Canvas/title").getComponent("start").playedBefore = true;
        },
        fail: function fail() {
          console.log("not played before");
        }
      });
    } else {
      if (cc.sys.localStorage.getItem("username") != null) this.playedBefore = true;else console.log("first time playing");
    } //cc.tween(emoji).to(0.5, { position: cc.v2(this.node.x + Math.ceil(Math.random() * 1000) * (Math.round(Math.random()) ? 1 : -1), this.node.y + 2000) }, { easing: 'sineOutIn' }).start();


    cc.tween(this.node).to(2, {
      scaleX: 1,
      scaleY: 1
    }, {
      easing: 'sineOut'
    }).start();
    this.scheduleOnce(function () {
      this.node.color = cc.Color.BLACK;
      this.background.color = cc.Color.YELLOW;
    }, 3);
    this.scheduleOnce(function () {
      if (!this.playedBefore) {
        //first time playing
        cc.director.loadScene("story");
      } else {
        cc.director.loadScene("home");
      }
    }, 5);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcc3RhcnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiYWNrZ3JvdW5kIiwiTm9kZSIsInBsYXllZEJlZm9yZSIsIm9uTG9hZCIsInN5cyIsInBsYXRmb3JtIiwiV0VDSEFUX0dBTUUiLCJ3eCIsImdldFN0b3JhZ2UiLCJrZXkiLCJzdWNjZXNzIiwicmVzIiwiZmluZCIsImdldENvbXBvbmVudCIsImZhaWwiLCJjb25zb2xlIiwibG9nIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInR3ZWVuIiwibm9kZSIsInRvIiwic2NhbGVYIiwic2NhbGVZIiwiZWFzaW5nIiwic3RhcnQiLCJzY2hlZHVsZU9uY2UiLCJjb2xvciIsIkNvbG9yIiwiQkxBQ0siLCJZRUxMT1ciLCJkaXJlY3RvciIsImxvYWRTY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFVBQVUsRUFBRUosRUFBRSxDQUFDSyxJQURQO0FBRVJDLElBQUFBLFlBQVksRUFBRTtBQUZOLEdBSFA7QUFRTEMsRUFBQUEsTUFSSyxvQkFRSTtBQUNMLFFBQUlQLEVBQUUsQ0FBQ1EsR0FBSCxDQUFPQyxRQUFQLElBQW1CVCxFQUFFLENBQUNRLEdBQUgsQ0FBT0UsV0FBOUIsRUFBMkM7QUFDdkNDLE1BQUFBLEVBQUUsQ0FBQ0MsVUFBSCxDQUFjO0FBQ1ZDLFFBQUFBLEdBQUcsRUFBRSxRQURLO0FBRVZDLFFBQUFBLE9BRlUsbUJBRUZDLEdBRkUsRUFFRztBQUNUO0FBQ0FmLFVBQUFBLEVBQUUsQ0FBQ2dCLElBQUgsQ0FBUSxjQUFSLEVBQXdCQyxZQUF4QixDQUFxQyxPQUFyQyxFQUE4Q1gsWUFBOUMsR0FBNkQsSUFBN0Q7QUFDSCxTQUxTO0FBTVZZLFFBQUFBLElBTlUsa0JBTUg7QUFDSEMsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksbUJBQVo7QUFFSDtBQVRTLE9BQWQ7QUFZSCxLQWJELE1BYU87QUFDSCxVQUFJcEIsRUFBRSxDQUFDUSxHQUFILENBQU9hLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLEtBQTJDLElBQS9DLEVBQ0ksS0FBS2hCLFlBQUwsR0FBb0IsSUFBcEIsQ0FESixLQUdJYSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQkFBWjtBQUNQLEtBbkJJLENBc0JMOzs7QUFDQXBCLElBQUFBLEVBQUUsQ0FBQ3VCLEtBQUgsQ0FBUyxLQUFLQyxJQUFkLEVBQW9CQyxFQUFwQixDQUF1QixDQUF2QixFQUEwQjtBQUFFQyxNQUFBQSxNQUFNLEVBQUUsQ0FBVjtBQUFhQyxNQUFBQSxNQUFNLEVBQUU7QUFBckIsS0FBMUIsRUFBb0Q7QUFBRUMsTUFBQUEsTUFBTSxFQUFFO0FBQVYsS0FBcEQsRUFBMkVDLEtBQTNFO0FBQ0EsU0FBS0MsWUFBTCxDQUFrQixZQUFZO0FBQzFCLFdBQUtOLElBQUwsQ0FBVU8sS0FBVixHQUFrQi9CLEVBQUUsQ0FBQ2dDLEtBQUgsQ0FBU0MsS0FBM0I7QUFDQSxXQUFLN0IsVUFBTCxDQUFnQjJCLEtBQWhCLEdBQXdCL0IsRUFBRSxDQUFDZ0MsS0FBSCxDQUFTRSxNQUFqQztBQUNILEtBSEQsRUFHRyxDQUhIO0FBSUEsU0FBS0osWUFBTCxDQUFrQixZQUFZO0FBQzFCLFVBQUksQ0FBQyxLQUFLeEIsWUFBVixFQUF3QjtBQUNwQjtBQUNBTixRQUFBQSxFQUFFLENBQUNtQyxRQUFILENBQVlDLFNBQVosQ0FBc0IsT0FBdEI7QUFDSCxPQUhELE1BSUs7QUFDRHBDLFFBQUFBLEVBQUUsQ0FBQ21DLFFBQUgsQ0FBWUMsU0FBWixDQUFzQixNQUF0QjtBQUNIO0FBQ0osS0FSRCxFQVFHLENBUkg7QUFXSDtBQS9DSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZWRCZWZvcmU6IGZhbHNlLFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICBrZXk6IFwicGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcGxheWVkIGJlZm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvdGl0bGVcIikuZ2V0Q29tcG9uZW50KFwic3RhcnRcIikucGxheWVkQmVmb3JlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IHBsYXllZCBiZWZvcmVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIikgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVkQmVmb3JlID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaXJzdCB0aW1lIHBsYXlpbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL2NjLnR3ZWVuKGVtb2ppKS50bygwLjUsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS54ICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwKSAqIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID8gMSA6IC0xKSwgdGhpcy5ub2RlLnkgKyAyMDAwKSB9LCB7IGVhc2luZzogJ3NpbmVPdXRJbicgfSkuc3RhcnQoKTtcclxuICAgICAgICBjYy50d2Vlbih0aGlzLm5vZGUpLnRvKDIsIHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XHJcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5jb2xvciA9IGNjLkNvbG9yLllFTExPVztcclxuICAgICAgICB9LCAzKTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wbGF5ZWRCZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIC8vZmlyc3QgdGltZSBwbGF5aW5nXHJcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdG9yeVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA1KTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/cameraFollow.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7455eGZiFJOY4D93jmfSLWz', 'cameraFollow');
// code/cameraFollow.js

"use strict";

var player = null;
cc.Class({
  "extends": cc.Component,
  properties: {
    player: null,
    following: false,
    // background: cc.Node,
    ui: cc.Node,
    // paralaxLayers: [cc.Node],
    startPos: [],
    xOffsetPlayer: 0,
    maxOffset: 50,
    startY: 0
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.startPos = [0, 0, 0, 0, 0, 0, 0];
  },
  update: function update(dt) {
    if (!this.following) {
      if (cc.find("system").getComponent("client").myPlayer != null) {
        this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        this.following = true;
      }
    } else {
      var m = this.player.getComponent("movement");
      if (m.movingRight && this.xOffsetPlayer < this.maxOffset) this.xOffsetPlayer += 40 * dt;else if (m.movingLeft && this.xOffsetPlayer > -this.maxOffset) this.xOffsetPlayer -= 40 * dt;else this.xOffsetPlayer /= 2;
      this.node.x = this.player.x + this.xOffsetPlayer;
      this.node.y = this.startY + (this.player.y = this.startY) / 2;
    } // for (let i = 0; i < this.paralaxLayers.length; i++) {
    //     this.paralaxLayers[i].setPosition(this.node.x / (i + 1) * 2 + this.startPos[i], this.node.y / (i + 1) * 2);
    //     if (Math.abs(this.node.x - this.paralaxLayers[i].x) >= (this.paralaxLayers[i].width - this.node.width)) {
    //         //this.paralaxLayers[i].setPosition(this.node.x + (this.node.x - this.paralaxLayers[i].x), this.node.y);
    //         this.startPos[i] += this.node.x - this.paralaxLayers[i].x;
    //     }
    // }
    // this.background.setPosition(this.node.x, this.node.y);
    // this.ui.x = this.node.x;
    // this.ui.y = this.node.y;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2FtZXJhRm9sbG93LmpzIl0sIm5hbWVzIjpbInBsYXllciIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZm9sbG93aW5nIiwidWkiLCJOb2RlIiwic3RhcnRQb3MiLCJ4T2Zmc2V0UGxheWVyIiwibWF4T2Zmc2V0Iiwic3RhcnRZIiwib25Mb2FkIiwidXBkYXRlIiwiZHQiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCIsIm0iLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJub2RlIiwieCIsInkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBTSxHQUFHLElBQWI7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JKLElBQUFBLE1BQU0sRUFBRSxJQURBO0FBRVJLLElBQUFBLFNBQVMsRUFBRSxLQUZIO0FBR1I7QUFDQUMsSUFBQUEsRUFBRSxFQUFFTCxFQUFFLENBQUNNLElBSkM7QUFLUjtBQUNBQyxJQUFBQSxRQUFRLEVBQUUsRUFORjtBQU9SQyxJQUFBQSxhQUFhLEVBQUUsQ0FQUDtBQVFSQyxJQUFBQSxTQUFTLEVBQUUsRUFSSDtBQVNSQyxJQUFBQSxNQUFNLEVBQUU7QUFUQSxHQUhQO0FBZUw7QUFFQUMsRUFBQUEsTUFqQkssb0JBaUJJO0FBQ0wsU0FBS0osUUFBTCxHQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQWhCO0FBQ0gsR0FuQkk7QUFzQkxLLEVBQUFBLE1BdEJLLGtCQXNCRUMsRUF0QkYsRUFzQk07QUFDUCxRQUFJLENBQUMsS0FBS1QsU0FBVixFQUFxQjtBQUNqQixVQUFJSixFQUFFLENBQUNjLElBQUgsQ0FBUSxRQUFSLEVBQWtCQyxZQUFsQixDQUErQixRQUEvQixFQUF5Q0MsUUFBekMsSUFBcUQsSUFBekQsRUFBK0Q7QUFDM0QsYUFBS2pCLE1BQUwsR0FBY0MsRUFBRSxDQUFDYyxJQUFILENBQVEsb0JBQW9CZCxFQUFFLENBQUNjLElBQUgsQ0FBUSxRQUFSLEVBQWtCQyxZQUFsQixDQUErQixRQUEvQixFQUF5Q0UsUUFBckUsQ0FBZDtBQUNBLGFBQUtiLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKLEtBTEQsTUFLTztBQUNILFVBQUljLENBQUMsR0FBRyxLQUFLbkIsTUFBTCxDQUFZZ0IsWUFBWixDQUF5QixVQUF6QixDQUFSO0FBQ0EsVUFBR0csQ0FBQyxDQUFDQyxXQUFGLElBQWlCLEtBQUtYLGFBQUwsR0FBcUIsS0FBS0MsU0FBOUMsRUFDSSxLQUFLRCxhQUFMLElBQXNCLEtBQUdLLEVBQXpCLENBREosS0FFSyxJQUFHSyxDQUFDLENBQUNFLFVBQUYsSUFBZ0IsS0FBS1osYUFBTCxHQUFxQixDQUFDLEtBQUtDLFNBQTlDLEVBQ0QsS0FBS0QsYUFBTCxJQUFzQixLQUFHSyxFQUF6QixDQURDLEtBR0QsS0FBS0wsYUFBTCxJQUFvQixDQUFwQjtBQUNKLFdBQUthLElBQUwsQ0FBVUMsQ0FBVixHQUFjLEtBQUt2QixNQUFMLENBQVl1QixDQUFaLEdBQWdCLEtBQUtkLGFBQW5DO0FBQ0EsV0FBS2EsSUFBTCxDQUFVRSxDQUFWLEdBQWMsS0FBS2IsTUFBTCxHQUFjLENBQUMsS0FBS1gsTUFBTCxDQUFZd0IsQ0FBWixHQUFjLEtBQUtiLE1BQXBCLElBQTRCLENBQXhEO0FBQ0gsS0FoQk0sQ0FpQlA7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0g7QUFsREksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHBsYXllciA9IG51bGw7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcjogbnVsbCxcclxuICAgICAgICBmb2xsb3dpbmc6IGZhbHNlLFxyXG4gICAgICAgIC8vIGJhY2tncm91bmQ6IGNjLk5vZGUsXHJcbiAgICAgICAgdWk6IGNjLk5vZGUsXHJcbiAgICAgICAgLy8gcGFyYWxheExheWVyczogW2NjLk5vZGVdLFxyXG4gICAgICAgIHN0YXJ0UG9zOiBbXSxcclxuICAgICAgICB4T2Zmc2V0UGxheWVyOiAwLFxyXG4gICAgICAgIG1heE9mZnNldDogNTAsXHJcbiAgICAgICAgc3RhcnRZOiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5mb2xsb3dpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLm15UGxheWVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzL1wiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2xsb3dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG0gPSB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKVxyXG4gICAgICAgICAgICBpZihtLm1vdmluZ1JpZ2h0ICYmIHRoaXMueE9mZnNldFBsYXllciA8IHRoaXMubWF4T2Zmc2V0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy54T2Zmc2V0UGxheWVyICs9IDQwKmR0XHJcbiAgICAgICAgICAgIGVsc2UgaWYobS5tb3ZpbmdMZWZ0ICYmIHRoaXMueE9mZnNldFBsYXllciA+IC10aGlzLm1heE9mZnNldClcclxuICAgICAgICAgICAgICAgIHRoaXMueE9mZnNldFBsYXllciAtPSA0MCpkdFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhPZmZzZXRQbGF5ZXIvPTJcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnBsYXllci54ICsgdGhpcy54T2Zmc2V0UGxheWVyO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuc3RhcnRZICsgKHRoaXMucGxheWVyLnk9dGhpcy5zdGFydFkpLzI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXJhbGF4TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMucGFyYWxheExheWVyc1tpXS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCAvIChpICsgMSkgKiAyICsgdGhpcy5zdGFydFBvc1tpXSwgdGhpcy5ub2RlLnkgLyAoaSArIDEpICogMik7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoTWF0aC5hYnModGhpcy5ub2RlLnggLSB0aGlzLnBhcmFsYXhMYXllcnNbaV0ueCkgPj0gKHRoaXMucGFyYWxheExheWVyc1tpXS53aWR0aCAtIHRoaXMubm9kZS53aWR0aCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLnNldFBvc2l0aW9uKHRoaXMubm9kZS54ICsgKHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLngpLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0UG9zW2ldICs9IHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLng7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5iYWNrZ3JvdW5kLnNldFBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gdGhpcy51aS54ID0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgLy8gdGhpcy51aS55ID0gdGhpcy5ub2RlLnk7XHJcbiAgICB9LFxyXG59KTtcclxuIl19
//------QC-SOURCE-SPLIT------
