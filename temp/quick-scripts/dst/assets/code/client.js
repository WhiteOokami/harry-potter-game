
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2xpZW50LmpzIl0sIm5hbWVzIjpbInBheUxvYWQiLCJ0eXBlIiwiZGF0YSIsIlBsYXllckRhdGEiLCJpZCIsIngiLCJwb3NYIiwicG9zWSIsInNjYWxlWSIsInNjYWxlWCIsImxpdmVzIiwibmFtZSIsInN0YXR1cyIsImtleSIsInJvdW5kTnVtYmVyIiwicm51bSIsInJsZW5ndGgiLCJuZXdudW1iZXIiLCJNYXRoIiwicm91bmQiLCJwb3ciLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllcklkIiwid3MiLCJwbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwibXlQbGF5ZXIiLCJwb3J0Iiwic3RhcnRQbGFjZSIsIk5vZGUiLCJ0aW1lciIsIndhdGNoIiwibXlUaW1lIiwiZW5lbWllcyIsIndvbiIsImNvdW50RG93biIsIml0ZW1zIiwic2hvcnRPblRpbWUiLCJ3YXRjaEFuaW0iLCJBbmltYXRpb24iLCJjb25uZWN0aW9uRXJyb3JVSSIsInNvY2tldENsb3NlZCIsInBvdGlvblByZWZhYiIsImNha2VQcmVmYWIiLCJnYW1lU3RhcnRlZCIsInN0YXJ0U2NyZWVuIiwiY3Jvd25zIiwiaG91c2VJbmRleCIsImNoZXN0UHJlZmFiIiwic2VydmVySXAiLCJwb2ludHNMb3N0Iiwic2VuZFdlYnNvY2tldE1lc3NhZ2UiLCJtZXNzYWdlIiwiYWN0aXZlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VuZFBsYXllclN0YXRlIiwic3RhdGUiLCJzZW5kRW5lbXlTdGF0ZSIsInBvc2l0aW9uIiwiZW5lbXkiLCJzZW5kSXRlbVN0YXRlIiwicG9zIiwic2NoZWR1bGVPbmNlIiwic2VuZEVtb2ppIiwiZXZlbnQiLCJjdXN0b21FdmVudERhdGEiLCJub2RlIiwiZ2V0Q29tcG9uZW50Iiwic2hvd0Vtb2ppcyIsImNyZWF0ZVBsYXllciIsInBsYXllciIsImluc3RhbnRpYXRlIiwicGFyZW50IiwiZmluZCIsInkiLCJnZXRDaGlsZEJ5TmFtZSIsIkxhYmVsIiwic3RyaW5nIiwiYVBsYXllciIsImNvbG9yIiwiQ29sb3IiLCJXSElURSIsInVwZGF0ZVBsYXllciIsInRoZVBsYXllciIsIm1vdmVSaWdodCIsIm1vdmVMZWZ0IiwianVtcCIsInN0b3BYIiwic3RvcFkiLCJ1cGRhdGVFbmVteSIsImNoYXNlUGxheWVyIiwidXBkYXRlUGxheWVyUG9zaXRpb24iLCJzZXRTY2FsZSIsInJlbW92ZVBsYXllciIsImRlc3Ryb3kiLCJ1cGRhdGVUaW1lIiwidGltZSIsImFuZ2xlIiwiZ2V0UGFyZW50IiwicGxheSIsIndyYXBNb2RlIiwiV3JhcE1vZGUiLCJMb29wIiwic3RvcCIsIlJFRCIsInRpbWVzVXAiLCJBdWRpb1NvdXJjZSIsImNvbnNvbGUiLCJsb2ciLCJzaG93Q3Jvd25zIiwiZGlzY29ubmVjdCIsIm9zIiwiY2xvc2VTb2NrZXQiLCJjbG9zZSIsInVwZGF0ZUl0ZW0iLCJ0aGVJdGVtIiwidXBkYXRlRW1vamkiLCJwbGF5RW1vamkiLCJzdGFydENvdW50RG93biIsIm51bSIsInJlY2lldmVNZXNzYWdlIiwibXlEYXRhIiwicGFyc2UiLCJpIiwic2hvd1dpbm5lcnMiLCJhZGRXaW5uZXIiLCJqb2luU2VydmVyIiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Mb2FkIiwiYWJwIiwicm9vbSIsIk1hcCIsInN0YXJ0IiwidXBkYXRlIiwiZHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLFVBQ0YsaUJBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCO0FBQ3BCLE9BQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNIOztBQUNKOztJQUVLQyxhQUNGLG9CQUFZQyxFQUFaLEVBQWdCQyxDQUFoQixFQUFtQjtBQUFBLE9BTW5CQyxJQU5tQixHQU1aLENBTlk7QUFBQSxPQU9uQkMsSUFQbUIsR0FPWixDQVBZO0FBQUEsT0FRbkJDLE1BUm1CLEdBUVYsQ0FSVTtBQUFBLE9BU25CQyxNQVRtQixHQVNWLENBVFU7QUFBQSxPQVVuQkMsS0FWbUIsR0FVWCxDQVZXO0FBQUEsT0FXbkJDLElBWG1CLEdBV1osSUFYWTtBQUNmLE9BQUtQLEVBQUwsR0FBVUEsRUFBVjtBQUNBLE9BQUtDLENBQUwsR0FBU0EsQ0FBVDtBQUNBLE9BQUtPLE1BQUwsR0FBYyxDQUFkO0FBQ0EsT0FBS0MsR0FBTCxHQUFXLEVBQVg7QUFDSDs7QUFPSjs7QUFFRCxTQUFTQyxXQUFULENBQXFCQyxJQUFyQixFQUEyQkMsT0FBM0IsRUFBb0M7QUFDaEMsTUFBSUMsU0FBUyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0osSUFBSSxHQUFHRyxJQUFJLENBQUNFLEdBQUwsQ0FBUyxFQUFULEVBQWFKLE9BQWIsQ0FBbEIsSUFBMkNFLElBQUksQ0FBQ0UsR0FBTCxDQUFTLEVBQVQsRUFBYUosT0FBYixDQUEzRDtBQUNBLFNBQU9DLFNBQVA7QUFDSDs7QUFFREksRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFFTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFFBQVEsRUFBRSxDQURGO0FBRVJDLElBQUFBLEVBQUUsRUFBRSxJQUZJO0FBR1JDLElBQUFBLE9BQU8sRUFBRSxJQUhEO0FBSVJDLElBQUFBLFlBQVksRUFBRTtBQUNWLGlCQUFTLElBREM7QUFFVjNCLE1BQUFBLElBQUksRUFBRW9CLEVBQUUsQ0FBQ1E7QUFGQyxLQUpOO0FBUVJDLElBQUFBLFFBQVEsRUFBRSxJQVJGO0FBU1JDLElBQUFBLElBQUksRUFBRSxJQVRFO0FBVVJDLElBQUFBLFVBQVUsRUFBRVgsRUFBRSxDQUFDWSxJQVZQO0FBV1JDLElBQUFBLEtBQUssRUFBRWIsRUFBRSxDQUFDWSxJQVhGO0FBWVJFLElBQUFBLEtBQUssRUFBRWQsRUFBRSxDQUFDWSxJQVpGO0FBYVJHLElBQUFBLE1BQU0sRUFBRSxDQWJBO0FBY1JDLElBQUFBLE9BQU8sRUFBRWhCLEVBQUUsQ0FBQ1ksSUFkSjtBQWVSSyxJQUFBQSxHQUFHLEVBQUUsS0FmRztBQWdCUkMsSUFBQUEsU0FBUyxFQUFFLElBaEJIO0FBaUJSQyxJQUFBQSxLQUFLLEVBQUVuQixFQUFFLENBQUNZLElBakJGO0FBa0JSUSxJQUFBQSxXQUFXLEVBQUUsS0FsQkw7QUFtQlJDLElBQUFBLFNBQVMsRUFBRXJCLEVBQUUsQ0FBQ3NCLFNBbkJOO0FBb0JSQyxJQUFBQSxpQkFBaUIsRUFBRXZCLEVBQUUsQ0FBQ1ksSUFwQmQ7QUFxQlJZLElBQUFBLFlBQVksRUFBRSxLQXJCTjtBQXNCUkMsSUFBQUEsWUFBWSxFQUFFekIsRUFBRSxDQUFDUSxNQXRCVDtBQXVCUmtCLElBQUFBLFVBQVUsRUFBRTFCLEVBQUUsQ0FBQ1EsTUF2QlA7QUF3QlJtQixJQUFBQSxXQUFXLEVBQUUsS0F4Qkw7QUF5QlJDLElBQUFBLFdBQVcsRUFBRTVCLEVBQUUsQ0FBQ1ksSUF6QlI7QUEwQlJpQixJQUFBQSxNQUFNLEVBQUUsQ0ExQkE7QUEyQlJDLElBQUFBLFVBQVUsRUFBRSxDQTNCSjtBQTRCUkMsSUFBQUEsV0FBVyxFQUFFL0IsRUFBRSxDQUFDUSxNQTVCUjtBQTZCUndCLElBQUFBLFFBQVEsRUFBRSxFQTdCRjtBQThCUkMsSUFBQUEsVUFBVSxFQUFFO0FBOUJKLEdBRlA7QUFrQ0xDLEVBQUFBLG9CQWxDSyxnQ0FrQ2dCdEQsSUFsQ2hCLEVBa0NzQnVELE9BbEN0QixFQWtDK0I7QUFDaEMsUUFBSSxDQUFDLEtBQUtaLGlCQUFMLENBQXVCYSxNQUE1QixFQUFvQztBQUNoQyxVQUFJcEMsRUFBRSxDQUFDcUMsR0FBSCxDQUFPQyxRQUFQLElBQW1CdEMsRUFBRSxDQUFDcUMsR0FBSCxDQUFPRSxXQUE5QixFQUEyQztBQUN2QyxhQUFLbEMsRUFBTCxDQUFRbUMsSUFBUixDQUFhO0FBQUUzRCxVQUFBQSxJQUFJLEVBQUU0RCxJQUFJLENBQUNDLFNBQUwsQ0FBZSxJQUFJL0QsT0FBSixDQUFZQyxJQUFaLEVBQWtCdUQsT0FBbEIsQ0FBZjtBQUFSLFNBQWI7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLOUIsRUFBTCxDQUFRbUMsSUFBUixDQUFhQyxJQUFJLENBQUNDLFNBQUwsQ0FBZSxJQUFJL0QsT0FBSixDQUFZQyxJQUFaLEVBQWtCdUQsT0FBbEIsQ0FBZixDQUFiO0FBQ0g7QUFDSjtBQUVKLEdBM0NJO0FBNENMUSxFQUFBQSxlQTVDSywyQkE0Q1dDLEtBNUNYLEVBNENrQjtBQUNuQixTQUFLVixvQkFBTCxDQUEwQixtQkFBMUIsRUFBK0MsQ0FBQyxLQUFLOUIsUUFBTixFQUFnQndDLEtBQWhCLENBQS9DO0FBQ0gsR0E5Q0k7QUErQ0xDLEVBQUFBLGNBL0NLLDBCQStDVUQsS0EvQ1YsRUErQ2lCRSxRQS9DakIsRUErQzJCQyxLQS9DM0IsRUErQ2tDO0FBQ25DLFNBQUtiLG9CQUFMLENBQTBCLGFBQTFCLEVBQXlDLENBQUMsS0FBSzlCLFFBQU4sRUFBZ0IwQyxRQUFoQixFQUEwQkYsS0FBMUIsRUFBaUNHLEtBQWpDLENBQXpDO0FBQ0gsR0FqREk7QUFrRExDLEVBQUFBLGFBbERLLHlCQWtEU2pFLEVBbERULEVBa0RhNkQsS0FsRGIsRUFrRG9CaEUsSUFsRHBCLEVBa0QwQnFFLEdBbEQxQixFQWtEK0I7QUFDaEM7QUFDQSxRQUFJckUsSUFBSSxJQUFJLE9BQVIsSUFBbUJnRSxLQUFLLElBQUksT0FBaEMsRUFBeUM7QUFDckMsV0FBS00sWUFBTCxDQUFrQixZQUFZO0FBQUUsYUFBS2hCLG9CQUFMLENBQTBCLFlBQTFCLEVBQXdDLENBQUNuRCxFQUFELEVBQUs2RCxLQUFMLEVBQVloRSxJQUFaLEVBQWtCcUUsR0FBbEIsQ0FBeEM7QUFBaUUsT0FBakcsRUFBa0csQ0FBbEc7QUFDSCxLQUZELE1BRU87QUFDSCxXQUFLZixvQkFBTCxDQUEwQixZQUExQixFQUF3QyxDQUFDbkQsRUFBRCxFQUFLNkQsS0FBTCxFQUFZaEUsSUFBWixFQUFrQnFFLEdBQWxCLENBQXhDO0FBQ0g7QUFFSixHQTFESTtBQTJETEUsRUFBQUEsU0FBUyxFQUFFLG1CQUFVQyxLQUFWLEVBQWlCQyxlQUFqQixFQUFrQztBQUN6QztBQUNBLFNBQUtuQixvQkFBTCxDQUEwQixPQUExQixFQUFtQyxDQUFDLEtBQUs5QixRQUFOLEVBQWdCaUQsZUFBaEIsQ0FBbkM7QUFDQSxTQUFLQyxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0NDLFVBQXRDO0FBQ0gsR0EvREk7QUFnRUxDLEVBQUFBLFlBaEVLLHdCQWdFUUMsTUFoRVIsRUFnRWdCO0FBQ2pCO0FBQ0EsUUFBSUEsTUFBTSxDQUFDM0UsRUFBUCxJQUFhLEtBQUtxQixRQUF0QixFQUFnQztBQUM1QixXQUFLSyxRQUFMLEdBQWdCVCxFQUFFLENBQUMyRCxXQUFILENBQWUsS0FBS3BELFlBQXBCLENBQWhCO0FBQ0EsV0FBS0UsUUFBTCxDQUFjbUQsTUFBZCxHQUF1QjVELEVBQUUsQ0FBQzZELElBQUgsQ0FBUSxnQkFBUixDQUF2QjtBQUNBLFdBQUtwRCxRQUFMLENBQWN6QixDQUFkLEdBQWtCLEtBQUsyQixVQUFMLENBQWdCM0IsQ0FBbEM7QUFDQSxXQUFLeUIsUUFBTCxDQUFjcUQsQ0FBZCxHQUFrQixLQUFLbkQsVUFBTCxDQUFnQm1ELENBQWxDO0FBQ0EsV0FBS3JELFFBQUwsQ0FBY25CLElBQWQsR0FBcUJvRSxNQUFNLENBQUMzRSxFQUE1QjtBQUNBLFdBQUswQixRQUFMLENBQWNzRCxjQUFkLENBQTZCLFNBQTdCLEVBQXdDUixZQUF4QyxDQUFxRHZELEVBQUUsQ0FBQ2dFLEtBQXhELEVBQStEQyxNQUEvRCxHQUF3RVAsTUFBTSxDQUFDcEUsSUFBL0U7QUFDQSxXQUFLbUIsUUFBTCxDQUFjMUIsRUFBZCxHQUFtQjJFLE1BQU0sQ0FBQzNFLEVBQTFCO0FBQ0EsV0FBS3VCLE9BQUwsQ0FBYW9ELE1BQU0sQ0FBQzNFLEVBQXBCLElBQTBCLEtBQUswQixRQUEvQjtBQUNILEtBVEQsTUFTTztBQUNILFVBQUl5RCxPQUFPLEdBQUdsRSxFQUFFLENBQUMyRCxXQUFILENBQWUsS0FBS3BELFlBQXBCLENBQWQ7QUFDQTJELE1BQUFBLE9BQU8sQ0FBQ04sTUFBUixHQUFpQjVELEVBQUUsQ0FBQzZELElBQUgsQ0FBUSxnQkFBUixDQUFqQjtBQUNBSyxNQUFBQSxPQUFPLENBQUNsRixDQUFSLEdBQVksS0FBSzJCLFVBQUwsQ0FBZ0IzQixDQUE1QjtBQUNBa0YsTUFBQUEsT0FBTyxDQUFDSixDQUFSLEdBQVksS0FBS25ELFVBQUwsQ0FBZ0JtRCxDQUE1QjtBQUNBSSxNQUFBQSxPQUFPLENBQUM1RSxJQUFSLEdBQWVvRSxNQUFNLENBQUMzRSxFQUF0QjtBQUNBbUYsTUFBQUEsT0FBTyxDQUFDbkYsRUFBUixHQUFhMkUsTUFBTSxDQUFDM0UsRUFBcEI7QUFDQW1GLE1BQUFBLE9BQU8sQ0FBQ0gsY0FBUixDQUF1QixTQUF2QixFQUFrQ1IsWUFBbEMsQ0FBK0N2RCxFQUFFLENBQUNnRSxLQUFsRCxFQUF5REMsTUFBekQsR0FBa0VQLE1BQU0sQ0FBQ3BFLElBQXpFO0FBQ0E0RSxNQUFBQSxPQUFPLENBQUNILGNBQVIsQ0FBdUIsU0FBdkIsRUFBa0NJLEtBQWxDLEdBQTBDbkUsRUFBRSxDQUFDb0UsS0FBSCxDQUFTQyxLQUFuRDtBQUNBLFdBQUsvRCxPQUFMLENBQWFvRCxNQUFNLENBQUMzRSxFQUFwQixJQUEwQm1GLE9BQTFCO0FBQ0g7QUFDSixHQXRGSTtBQXVGTEksRUFBQUEsWUF2Rkssd0JBdUZRbEUsUUF2RlIsRUF1RmtCd0MsS0F2RmxCLEVBdUZ5QjtBQUMxQixRQUFJMkIsU0FBUyxHQUFHLEtBQUtqRSxPQUFMLENBQWFGLFFBQWIsQ0FBaEI7O0FBQ0EsWUFBUXdDLEtBQVI7QUFDSSxXQUFLLE9BQUw7QUFDSTJCLFFBQUFBLFNBQVMsQ0FBQ2hCLFlBQVYsQ0FBdUIsVUFBdkIsRUFBbUNpQixTQUFuQztBQUNBOztBQUNKLFdBQUssTUFBTDtBQUNJRCxRQUFBQSxTQUFTLENBQUNoQixZQUFWLENBQXVCLFVBQXZCLEVBQW1Da0IsUUFBbkM7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSUYsUUFBQUEsU0FBUyxDQUFDaEIsWUFBVixDQUF1QixVQUF2QixFQUFtQ21CLElBQW5DO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0lILFFBQUFBLFNBQVMsQ0FBQ2hCLFlBQVYsQ0FBdUIsVUFBdkIsRUFBbUNvQixLQUFuQztBQUNBOztBQUNKLFdBQUssT0FBTDtBQUNJSixRQUFBQSxTQUFTLENBQUNoQixZQUFWLENBQXVCLFVBQXZCLEVBQW1DcUIsS0FBbkM7QUFDQTtBQWZSO0FBaUJILEdBMUdJO0FBMkdMQyxFQUFBQSxXQTNHSyx1QkEyR096RSxRQTNHUCxFQTJHaUIwQyxRQTNHakIsRUEyRzBCRixLQTNHMUIsRUEyR2lDRyxLQTNHakMsRUEyR3dDO0FBQ3pDLFFBQUl3QixTQUFTLEdBQUcsS0FBS2pFLE9BQUwsQ0FBYUYsUUFBYixDQUFoQjs7QUFDQSxZQUFRd0MsS0FBUjtBQUNJLFdBQUssVUFBTDtBQUNJLGFBQUs1QixPQUFMLENBQWErQyxjQUFiLENBQTRCaEIsS0FBNUIsRUFBbUNRLFlBQW5DLENBQWdELGFBQWhELEVBQStEdUIsV0FBL0QsQ0FBMkVQLFNBQTNFO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0ksYUFBS3ZELE9BQUwsQ0FBYStDLGNBQWIsQ0FBNEJoQixLQUE1QixFQUFtQ1EsWUFBbkMsQ0FBZ0QsYUFBaEQsRUFBK0RpQixTQUEvRDtBQUNBOztBQUNKLFdBQUssTUFBTDtBQUNJLGFBQUt4RCxPQUFMLENBQWErQyxjQUFiLENBQTRCaEIsS0FBNUIsRUFBbUNRLFlBQW5DLENBQWdELGFBQWhELEVBQStEa0IsUUFBL0Q7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSSxhQUFLekQsT0FBTCxDQUFhK0MsY0FBYixDQUE0QmhCLEtBQTVCLEVBQW1DUSxZQUFuQyxDQUFnRCxhQUFoRCxFQUErRG1CLElBQS9EO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0ksYUFBSzFELE9BQUwsQ0FBYStDLGNBQWIsQ0FBNEJoQixLQUE1QixFQUFtQy9ELENBQW5DLEdBQXVDOEQsUUFBUSxDQUFDLENBQUQsQ0FBL0M7QUFDQSxhQUFLOUIsT0FBTCxDQUFhK0MsY0FBYixDQUE0QmhCLEtBQTVCLEVBQW1DZSxDQUFuQyxHQUF1Q2hCLFFBQVEsQ0FBQyxDQUFELENBQS9DO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0QkE7QUF3QkgsR0FySUk7QUF1SUxpQyxFQUFBQSxvQkF2SUssZ0NBdUlnQnJCLE1BdkloQixFQXVJd0I7QUFFekIsU0FBS3BELE9BQUwsQ0FBYW9ELE1BQU0sQ0FBQzNFLEVBQXBCLEVBQXdCQyxDQUF4QixHQUE0QjBFLE1BQU0sQ0FBQ3pFLElBQW5DO0FBQ0EsU0FBS3FCLE9BQUwsQ0FBYW9ELE1BQU0sQ0FBQzNFLEVBQXBCLEVBQXdCK0UsQ0FBeEIsR0FBNEJKLE1BQU0sQ0FBQ3hFLElBQW5DO0FBQ0EsU0FBS29CLE9BQUwsQ0FBYW9ELE1BQU0sQ0FBQzNFLEVBQXBCLEVBQXdCaUcsUUFBeEIsQ0FBaUN0QixNQUFNLENBQUN0RSxNQUF4QyxFQUFnRHNFLE1BQU0sQ0FBQ3ZFLE1BQXZELEVBSnlCLENBS3pCO0FBQ0gsR0E3SUk7QUE4SUw4RixFQUFBQSxZQTlJSyx3QkE4SVF2QixNQTlJUixFQThJZ0I7QUFDakIsU0FBS3BELE9BQUwsQ0FBYW9ELE1BQU0sQ0FBQzNFLEVBQXBCLEVBQXdCbUcsT0FBeEI7QUFDQSxTQUFLNUUsT0FBTCxXQUFvQm9ELE1BQU0sQ0FBQzNFLEVBQTNCO0FBQ0gsR0FqSkk7QUFrSkxvRyxFQUFBQSxVQWxKSyxzQkFrSk1DLElBbEpOLEVBa0pZO0FBQ2I7QUFDQSxRQUFLLEtBQUtsRSxTQUFMLEdBQWlCa0UsSUFBbEIsSUFBMkIsQ0FBL0IsRUFBa0M7QUFDOUIsV0FBS3ZFLEtBQUwsQ0FBVzBDLFlBQVgsQ0FBd0J2RCxFQUFFLENBQUNnRSxLQUEzQixFQUFrQ0MsTUFBbEMsR0FBMkNtQixJQUEzQztBQUNBLFdBQUt0RSxLQUFMLENBQVd1RSxLQUFYLEdBQW1CLEVBQUlELElBQUksR0FBRyxHQUFSLEdBQWUsS0FBS2xFLFNBQXBCLEdBQWdDLEVBQW5DLENBQW5CO0FBQ0EsV0FBS0gsTUFBTCxHQUFjcUUsSUFBZDs7QUFDQSxVQUFJLENBQUMsS0FBS2hFLFdBQU4sSUFBc0IsS0FBS0YsU0FBTCxHQUFpQmtFLElBQWxCLEdBQTBCLEVBQW5ELEVBQXVEO0FBQ25ELGFBQUsvRCxTQUFMLEdBQWlCLEtBQUtQLEtBQUwsQ0FBV3dFLFNBQVgsR0FBdUIvQixZQUF2QixDQUFvQ3ZELEVBQUUsQ0FBQ3NCLFNBQXZDLEVBQWtEaUUsSUFBbEQsQ0FBdUQsYUFBdkQsQ0FBakI7QUFDQSxhQUFLbEUsU0FBTCxDQUFlbUUsUUFBZixHQUEwQnhGLEVBQUUsQ0FBQ3lGLFFBQUgsQ0FBWUMsSUFBdEM7QUFDQSxhQUFLdEUsV0FBTCxHQUFtQixJQUFuQjtBQUNIO0FBQ0osS0FURCxNQVVLO0FBQ0QsVUFBSSxLQUFLQSxXQUFULEVBQXNCO0FBQ2xCLGFBQUtDLFNBQUwsQ0FBZXNFLElBQWYsQ0FBb0IsYUFBcEI7QUFDQSxhQUFLN0UsS0FBTCxDQUFXd0UsU0FBWCxHQUF1Qm5CLEtBQXZCLEdBQStCbkUsRUFBRSxDQUFDb0UsS0FBSCxDQUFTd0IsR0FBeEM7QUFDQTVGLFFBQUFBLEVBQUUsQ0FBQzZELElBQUgsQ0FBUSxRQUFSLEVBQWtCTixZQUFsQixDQUErQixhQUEvQixFQUE4Q3NDLE9BQTlDO0FBQ0EsYUFBS3pFLFdBQUwsR0FBbUIsS0FBbkIsQ0FKa0IsQ0FNbEI7O0FBQ0EsWUFBSSxDQUFDLEtBQUtILEdBQVYsRUFBZTtBQUNYakIsVUFBQUEsRUFBRSxDQUFDNkQsSUFBSCxDQUFRLFFBQVIsRUFBa0JFLGNBQWxCLENBQWlDLE9BQWpDLEVBQTBDQSxjQUExQyxDQUF5RCxNQUF6RCxFQUFpRVIsWUFBakUsQ0FBOEV2RCxFQUFFLENBQUM4RixXQUFqRixFQUE4RlAsSUFBOUY7QUFDQVEsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksS0FBS25FLE1BQWpCO0FBQ0EsY0FBSSxLQUFLQSxNQUFMLEdBQWMsRUFBbEIsRUFDSSxLQUFLeUIsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEMsVUFBdEMsQ0FBaUQsS0FBS2hFLFVBQXRELEVBREosS0FHSSxLQUFLcUIsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEMsVUFBdEMsQ0FBaUQsQ0FBakQ7QUFDUDtBQUVKO0FBRUo7QUFDSixHQWxMSTtBQW1MTEMsRUFBQUEsVUFuTEssd0JBbUxRO0FBQ1QsU0FBSzFFLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFJeEIsRUFBRSxDQUFDcUMsR0FBSCxDQUFPOEQsRUFBUCxJQUFhbkcsRUFBRSxDQUFDcUMsR0FBSCxDQUFPRSxXQUF4QixFQUNJLEtBQUtsQyxFQUFMLENBQVErRixXQUFSLEdBREosS0FHSSxLQUFLL0YsRUFBTCxDQUFRZ0csS0FBUjtBQUNQLEdBekxJO0FBMExMQyxFQUFBQSxVQTFMSyxzQkEwTE12SCxFQTFMTixFQTBMVTZELEtBMUxWLEVBMExpQmhFLElBMUxqQixFQTBMdUJxRSxHQTFMdkIsRUEwTDRCO0FBQzdCLFFBQUlMLEtBQUssSUFBSSxNQUFiLEVBQ0ksS0FBS3pCLEtBQUwsQ0FBVzRDLGNBQVgsQ0FBMEJuRixJQUFJLEdBQUdHLEVBQWpDLEVBQXFDbUcsT0FBckMsR0FESixLQUVLLElBQUl0QyxLQUFLLElBQUksT0FBYixFQUFzQjtBQUN2QixVQUFJMkQsT0FBTyxHQUFHLElBQWQ7QUFFQSxVQUFJM0gsSUFBSSxJQUFJLFFBQVosRUFDSTJILE9BQU8sR0FBR3ZHLEVBQUUsQ0FBQzJELFdBQUgsQ0FBZSxLQUFLbEMsWUFBcEIsQ0FBVixDQURKLEtBRUssSUFBSTdDLElBQUksSUFBSSxNQUFaLEVBQ0QySCxPQUFPLEdBQUd2RyxFQUFFLENBQUMyRCxXQUFILENBQWUsS0FBS2pDLFVBQXBCLENBQVYsQ0FEQyxLQUVBLElBQUk5QyxJQUFJLElBQUksT0FBWixFQUNEMkgsT0FBTyxHQUFHdkcsRUFBRSxDQUFDMkQsV0FBSCxDQUFlLEtBQUs1QixXQUFwQixDQUFWO0FBRUp3RSxNQUFBQSxPQUFPLENBQUN2SCxDQUFSLEdBQVlpRSxHQUFHLENBQUMsQ0FBRCxDQUFmO0FBQ0FzRCxNQUFBQSxPQUFPLENBQUN6QyxDQUFSLEdBQVliLEdBQUcsQ0FBQyxDQUFELENBQWY7QUFDQXNELE1BQUFBLE9BQU8sQ0FBQzNDLE1BQVIsR0FBaUIsS0FBS3pDLEtBQXRCO0FBQ0FvRixNQUFBQSxPQUFPLENBQUNqSCxJQUFSLEdBQWVWLElBQUksR0FBR0csRUFBdEI7QUFDQXdILE1BQUFBLE9BQU8sQ0FBQ2hELFlBQVIsQ0FBcUIsTUFBckIsRUFBNkJ4RSxFQUE3QixHQUFrQ0EsRUFBbEMsQ0FkdUIsQ0FldkI7QUFDSDtBQUVKLEdBL01JO0FBZ05MeUgsRUFBQUEsV0FoTkssdUJBZ05PekgsRUFoTlAsRUFnTldILElBaE5YLEVBZ05pQjtBQUNsQixTQUFLMEIsT0FBTCxDQUFhdkIsRUFBYixFQUFpQndFLFlBQWpCLENBQThCLFVBQTlCLEVBQTBDa0QsU0FBMUMsQ0FBb0Q3SCxJQUFwRDtBQUNILEdBbE5JO0FBbU5MOEgsRUFBQUEsY0FuTkssMEJBbU5VQyxHQW5OVixFQW1OZTtBQUNoQixTQUFLL0UsV0FBTCxDQUFpQlEsTUFBakIsR0FBMEIsSUFBMUI7O0FBQ0EsUUFBSXVFLEdBQUcsSUFBSSxDQUFYLEVBQWM7QUFDVixXQUFLL0UsV0FBTCxDQUFpQlEsTUFBakIsR0FBMEIsS0FBMUI7QUFDQSxXQUFLVCxXQUFMLEdBQW1CLElBQW5CO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsV0FBS0MsV0FBTCxDQUFpQm1DLGNBQWpCLENBQWdDLEtBQWhDLEVBQXVDUixZQUF2QyxDQUFvRHZELEVBQUUsQ0FBQ2dFLEtBQXZELEVBQThEQyxNQUE5RCxHQUF1RTBDLEdBQXZFO0FBQ0g7QUFDSixHQTNOSTtBQTROTEMsRUFBQUEsY0E1TkssMEJBNE5VL0gsSUE1TlYsRUE0TmdCO0FBQ2pCLFFBQUlnSSxNQUFNLEdBQUdwRSxJQUFJLENBQUNxRSxLQUFMLENBQVdqSSxJQUFYLENBQWI7O0FBRUEsWUFBUWdJLE1BQU0sQ0FBQ2pJLElBQWY7QUFDSSxXQUFLLG1CQUFMO0FBQ0ksWUFBSWlJLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLEtBQWtCLEtBQUt1QixRQUEzQixFQUFxQztBQUNqQyxlQUFLa0UsWUFBTCxDQUFrQnVDLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWxCLEVBQWtDZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBbEM7QUFDSDs7QUFDRDs7QUFDSixXQUFLLFFBQUw7QUFDSSxhQUFLb0csWUFBTCxDQUFrQjRCLE1BQU0sQ0FBQ2hJLElBQXpCO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0k7QUFDQSxhQUFLcUMsU0FBTCxHQUFpQjJGLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWpCO0FBQ0EsYUFBS29ELFVBQUwsR0FBa0I0RSxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixDQUFsQjtBQUNBa0gsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksS0FBSzlFLFNBQWpCLEVBSkosQ0FLSTs7QUFDQSxhQUFLLElBQUk2RixDQUFULElBQWNGLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWQsRUFBOEI7QUFDMUIsZUFBSzRFLFlBQUwsQ0FBa0JvRCxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixFQUFla0ksQ0FBZixDQUFsQjtBQUNIOztBQUNEOztBQUNKLFdBQUssV0FBTDtBQUNJLGFBQUssSUFBSUEsQ0FBVCxJQUFjRixNQUFNLENBQUNoSSxJQUFyQixFQUEyQjtBQUN2QixjQUFJLEtBQUt1QixRQUFMLElBQWlCeUcsTUFBTSxDQUFDaEksSUFBUCxDQUFZa0ksQ0FBWixFQUFlaEksRUFBcEMsRUFDSSxLQUFLZ0csb0JBQUwsQ0FBMEI4QixNQUFNLENBQUNoSSxJQUFQLENBQVlrSSxDQUFaLENBQTFCO0FBQ1A7O0FBQ0Q7O0FBQ0osV0FBSyxRQUFMO0FBQ0ksWUFBSSxLQUFLM0csUUFBTCxJQUFpQnlHLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLEVBQWVFLEVBQXBDLEVBQXdDO0FBQ3BDLGVBQUt1RSxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0N5RCxXQUF0QztBQUNBLGVBQUsxRCxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0MwQyxVQUF0QyxDQUFpRFksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBakQ7QUFDSDs7QUFDRCxhQUFLeUUsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEQsU0FBdEMsQ0FBZ0RKLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWhELEVBQWdFZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBaEU7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSTtBQUNBLGFBQUtzRyxVQUFMLENBQWdCMEIsTUFBTSxDQUFDaEksSUFBdkI7QUFDQTs7QUFDSixXQUFLLGFBQUw7QUFDSSxZQUFJZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosS0FBa0IsS0FBS3VCLFFBQTNCLEVBQ0ksS0FBS3lFLFdBQUwsQ0FBaUJnQyxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixDQUFqQixFQUFpQ2dJLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWpDLEVBQWlEZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBakQsRUFBaUVnSSxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixDQUFqRTtBQUNKOztBQUNKLFdBQUssWUFBTDtBQUNJLGFBQUt5SCxVQUFMLENBQWdCTyxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixDQUFoQixFQUFnQ2dJLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWhDLEVBQWdEZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBaEQsRUFBZ0VnSSxNQUFNLENBQUNoSSxJQUFQLENBQVksQ0FBWixDQUFoRSxFQURKLENBRUk7O0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0ksYUFBSzJILFdBQUwsQ0FBaUJLLE1BQU0sQ0FBQ2hJLElBQVAsQ0FBWSxDQUFaLENBQWpCLEVBQWlDZ0ksTUFBTSxDQUFDaEksSUFBUCxDQUFZLENBQVosQ0FBakM7QUFDQTs7QUFDSixXQUFLLE9BQUw7QUFDSSxhQUFLNkgsY0FBTCxDQUFvQkcsTUFBTSxDQUFDaEksSUFBM0I7QUFFQTtBQWxEUjtBQW9ESCxHQW5SSTtBQW9STHFJLEVBQUFBLFVBcFJLLHdCQW9SUTtBQUFBOztBQUNULFFBQUlsSCxFQUFFLENBQUNxQyxHQUFILENBQU9DLFFBQVAsSUFBbUJ0QyxFQUFFLENBQUNxQyxHQUFILENBQU9FLFdBQTlCLEVBQTJDO0FBQ3ZDLFdBQUtsQyxFQUFMLEdBQVU4RyxFQUFFLENBQUNDLGFBQUgsQ0FBaUI7QUFDdkJDLFFBQUFBLEdBQUcsRUFBRSxVQUFVLEtBQUtyRixRQUFmLEdBQXlCLEdBQXpCLEdBQStCLEtBQUt0QjtBQURsQixPQUFqQixDQUFWO0FBSUEsV0FBS0wsRUFBTCxDQUFRaUgsTUFBUixDQUFlLFlBQU07QUFDakJ2QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxrQkFBWjs7QUFDQSxRQUFBLEtBQUksQ0FBQzlELG9CQUFMLENBQTBCLFlBQTFCLEVBQXdDLEtBQUksQ0FBQzlCLFFBQTdDO0FBQ0gsT0FIRDtBQUtBLFdBQUtDLEVBQUwsQ0FBUWtILFNBQVIsQ0FBa0IsZ0JBQWM7QUFBQSxZQUFYMUksSUFBVyxRQUFYQSxJQUFXOztBQUM1QixRQUFBLEtBQUksQ0FBQytILGNBQUwsQ0FBb0IvSCxJQUFwQjtBQUNILE9BRkQ7QUFJQSxXQUFLd0IsRUFBTCxDQUFRbUgsT0FBUixDQUFnQixZQUFNO0FBQ2xCekIsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUEsS0FBSSxDQUFDekUsaUJBQUwsQ0FBdUJhLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0FwQyxRQUFBQSxFQUFFLENBQUM2RCxJQUFILENBQVEsa0JBQVIsRUFBNEJ6QixNQUE1QixHQUFxQyxLQUFyQztBQUNILE9BSkQ7QUFNQSxXQUFLL0IsRUFBTCxDQUFRb0gsT0FBUixDQUFnQixZQUFNO0FBQ2xCO0FBQ0EsWUFBSSxDQUFDLEtBQUksQ0FBQ2pHLFlBQVYsRUFBd0I7QUFDcEIsVUFBQSxLQUFJLENBQUNELGlCQUFMLENBQXVCYSxNQUF2QixHQUFnQyxJQUFoQztBQUNBcEMsVUFBQUEsRUFBRSxDQUFDNkQsSUFBSCxDQUFRLGtCQUFSLEVBQTRCekIsTUFBNUIsR0FBcUMsS0FBckM7QUFDSDtBQUNKLE9BTkQ7QUFPSCxLQTNCRCxNQTRCSztBQUNELFdBQUsvQixFQUFMLEdBQVUsSUFBSXFILFNBQUosQ0FBYyxVQUFVLEtBQUsxRixRQUFmLEdBQTJCLEdBQTNCLEdBQWlDLEtBQUt0QixJQUFwRCxDQUFWO0FBRUEsV0FBS0wsRUFBTCxDQUFRc0gsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsWUFBTTtBQUNuQzVCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaOztBQUNBLFFBQUEsS0FBSSxDQUFDOUQsb0JBQUwsQ0FBMEIsWUFBMUIsRUFBd0MsS0FBSSxDQUFDOUIsUUFBN0M7QUFDSCxPQUhEO0FBS0EsV0FBS0MsRUFBTCxDQUFRc0gsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUNwQzVCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVo7QUFDQSxRQUFBLEtBQUksQ0FBQ3pFLGlCQUFMLENBQXVCYSxNQUF2QixHQUFnQyxJQUFoQztBQUNBcEMsUUFBQUEsRUFBRSxDQUFDNkQsSUFBSCxDQUFRLGtCQUFSLEVBQTRCekIsTUFBNUIsR0FBcUMsS0FBckM7QUFDSCxPQUpEO0FBTUEsV0FBSy9CLEVBQUwsQ0FBUXNILGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFlBQU07QUFDcEM7QUFDQSxZQUFJLENBQUMsS0FBSSxDQUFDbkcsWUFBVixFQUF3QjtBQUNwQixVQUFBLEtBQUksQ0FBQ0QsaUJBQUwsQ0FBdUJhLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0FwQyxVQUFBQSxFQUFFLENBQUM2RCxJQUFILENBQVEsa0JBQVIsRUFBNEJ6QixNQUE1QixHQUFxQyxLQUFyQztBQUNIO0FBRUosT0FQRDtBQVNBLFdBQUsvQixFQUFMLENBQVFzSCxnQkFBUixDQUF5QixTQUF6QixFQUFvQyxpQkFBYztBQUFBLFlBQVg5SSxJQUFXLFNBQVhBLElBQVc7O0FBQzlDLFFBQUEsS0FBSSxDQUFDK0gsY0FBTCxDQUFvQi9ILElBQXBCLEVBRDhDLENBSzlDO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVILE9BdkNEO0FBd0NIO0FBSUosR0FwWEk7QUFzWEw7QUFFQStJLEVBQUFBLE1BeFhLLG9CQXdYSTtBQUNMO0FBQ0E7QUFDQTtBQUVBLFNBQUszRixVQUFMLEdBQWtCLENBQWxCO0FBQ0EsUUFBSTRGLEdBQUcsR0FBRzdILEVBQUUsQ0FBQzZELElBQUgsQ0FBUSxTQUFSLEVBQW1CTixZQUFuQixDQUFnQyxhQUFoQyxDQUFWO0FBQ0EsU0FBS25ELFFBQUwsR0FBZ0J5SCxHQUFHLENBQUN6SCxRQUFwQjtBQUNBLFNBQUtNLElBQUwsR0FBWW1ILEdBQUcsQ0FBQ0MsSUFBaEI7QUFDQSxTQUFLOUYsUUFBTCxHQUFnQjZGLEdBQUcsQ0FBQzdGLFFBQXBCO0FBQ0EsU0FBS0gsTUFBTCxHQUFjZ0csR0FBRyxDQUFDaEcsTUFBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCK0YsR0FBRyxDQUFDL0YsVUFBdEI7QUFFQSxTQUFLeEIsT0FBTCxHQUFlLElBQUl5SCxHQUFKLEVBQWY7QUFFQSxTQUFLYixVQUFMO0FBQ0gsR0F4WUk7QUEwWUxjLEVBQUFBLEtBMVlLLG1CQTBZRyxDQUVQLENBNVlJO0FBOFlMQyxFQUFBQSxNQTlZSyxrQkE4WUVDLEVBOVlGLEVBOFlNO0FBQ1AsUUFBSSxLQUFLekgsUUFBTCxJQUFpQixJQUFyQixFQUNJLEtBQUt5QixvQkFBTCxDQUEwQixVQUExQixFQUFzQyxDQUFDLEtBQUt6QixRQUFMLENBQWN6QixDQUFmLEVBQWtCLEtBQUt5QixRQUFMLENBQWNxRCxDQUFoQyxFQUFtQ3JFLFdBQVcsQ0FBQyxLQUFLZ0IsUUFBTCxDQUFjdEIsTUFBZixFQUFzQixDQUF0QixDQUE5QyxFQUF3RU0sV0FBVyxDQUFDLEtBQUtnQixRQUFMLENBQWNyQixNQUFmLEVBQXNCLENBQXRCLENBQW5GLENBQXRDO0FBRVA7QUFsWkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgcGF5TG9hZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBkYXRhKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2xhc3MgUGxheWVyRGF0YSB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgeCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcclxuICAgICAgICB0aGlzLmtleSA9ICcnO1xyXG4gICAgfVxyXG4gICAgcG9zWCA9IDA7XHJcbiAgICBwb3NZID0gMDtcclxuICAgIHNjYWxlWSA9IDA7XHJcbiAgICBzY2FsZVggPSAwO1xyXG4gICAgbGl2ZXMgPSAzO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5mdW5jdGlvbiByb3VuZE51bWJlcihybnVtLCBybGVuZ3RoKSB7XHJcbiAgICB2YXIgbmV3bnVtYmVyID0gTWF0aC5yb3VuZChybnVtICogTWF0aC5wb3coMTAsIHJsZW5ndGgpKSAvIE1hdGgucG93KDEwLCBybGVuZ3RoKTtcclxuICAgIHJldHVybiBuZXdudW1iZXI7XHJcbn1cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBwbGF5ZXJJZDogMCxcclxuICAgICAgICB3czogbnVsbCxcclxuICAgICAgICBwbGF5ZXJzOiBudWxsLFxyXG4gICAgICAgIHBsYXllclByZWZhYjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBteVBsYXllcjogbnVsbCxcclxuICAgICAgICBwb3J0OiBudWxsLFxyXG4gICAgICAgIHN0YXJ0UGxhY2U6IGNjLk5vZGUsXHJcbiAgICAgICAgdGltZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgd2F0Y2g6IGNjLk5vZGUsXHJcbiAgICAgICAgbXlUaW1lOiAwLFxyXG4gICAgICAgIGVuZW1pZXM6IGNjLk5vZGUsXHJcbiAgICAgICAgd29uOiBmYWxzZSxcclxuICAgICAgICBjb3VudERvd246IG51bGwsXHJcbiAgICAgICAgaXRlbXM6IGNjLk5vZGUsXHJcbiAgICAgICAgc2hvcnRPblRpbWU6IGZhbHNlLFxyXG4gICAgICAgIHdhdGNoQW5pbTogY2MuQW5pbWF0aW9uLFxyXG4gICAgICAgIGNvbm5lY3Rpb25FcnJvclVJOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNvY2tldENsb3NlZDogZmFsc2UsXHJcbiAgICAgICAgcG90aW9uUHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgY2FrZVByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIGdhbWVTdGFydGVkOiBmYWxzZSxcclxuICAgICAgICBzdGFydFNjcmVlbjogY2MuTm9kZSxcclxuICAgICAgICBjcm93bnM6IDAsXHJcbiAgICAgICAgaG91c2VJbmRleDogMCxcclxuICAgICAgICBjaGVzdFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIHBvaW50c0xvc3Q6IDAsXHJcbiAgICB9LFxyXG4gICAgc2VuZFdlYnNvY2tldE1lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uRXJyb3JVSS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKHR5cGUsIG1lc3NhZ2UpKSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZCh0eXBlLCBtZXNzYWdlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRQbGF5ZXJTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVQbGF5ZXJTdGF0ZVwiLCBbdGhpcy5wbGF5ZXJJZCwgc3RhdGVdKTtcclxuICAgIH0sXHJcbiAgICBzZW5kRW5lbXlTdGF0ZShzdGF0ZSwgcG9zaXRpb24sIGVuZW15KSB7XHJcbiAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUVuZW15XCIsIFt0aGlzLnBsYXllcklkLCBwb3NpdGlvbiwgc3RhdGUsIGVuZW15XSk7XHJcbiAgICB9LFxyXG4gICAgc2VuZEl0ZW1TdGF0ZShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIC8vIGRlbGF5IGNoZXN0IHNwYXduXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJjaGVzdFwiICYmIHN0YXRlID09IFwic3Bhd25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7IHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVJdGVtXCIsIFtpZCwgc3RhdGUsIHR5cGUsIHBvc10pO30sMyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUl0ZW1cIiwgW2lkLCBzdGF0ZSwgdHlwZSwgcG9zXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRFbW9qaTogZnVuY3Rpb24gKGV2ZW50LCBjdXN0b21FdmVudERhdGEpIHtcclxuICAgICAgICAvLyBzZW5kIGVtb2ppLCBjdXN0b21FdmVudERhdGEgd2lsbCBiZSB0aGUgdHlwZVxyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJlbW9qaVwiLCBbdGhpcy5wbGF5ZXJJZCwgY3VzdG9tRXZlbnREYXRhXSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dFbW9qaXMoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVQbGF5ZXIocGxheWVyKSB7XHJcbiAgICAgICAgLy9teSBjaGFyYWN0ZXJcclxuICAgICAgICBpZiAocGxheWVyLmlkID09IHRoaXMucGxheWVySWQpIHtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnNcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIueCA9IHRoaXMuc3RhcnRQbGFjZS54O1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLnkgPSB0aGlzLnN0YXJ0UGxhY2UueTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5uYW1lID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmlkID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXSA9IHRoaXMubXlQbGF5ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFQbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllclByZWZhYik7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzXCIpO1xyXG4gICAgICAgICAgICBhUGxheWVyLnggPSB0aGlzLnN0YXJ0UGxhY2UueDtcclxuICAgICAgICAgICAgYVBsYXllci55ID0gdGhpcy5zdGFydFBsYWNlLnk7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIubmFtZSA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5pZCA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0gPSBhUGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGVQbGF5ZXIocGxheWVySWQsIHN0YXRlKSB7XHJcbiAgICAgICAgbGV0IHRoZVBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bXBcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0b3BYXCI6XHJcbiAgICAgICAgICAgICAgICB0aGVQbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFgoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFlcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVuZW15KHBsYXllcklkLCBwb3NpdGlvbixzdGF0ZSwgZW5lbXkpIHtcclxuICAgICAgICBsZXQgdGhlUGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaGFzZU5ld1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5jaGFzZVBsYXllcih0aGVQbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJqdW1wXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRDaGlsZEJ5TmFtZShlbmVteSkueCA9IHBvc2l0aW9uWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS55ID0gcG9zaXRpb25bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyAgICBjYXNlIFwic3RvcFhcIjpcclxuICAgICAgICAvLyAgICAgICAgdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLnN0b3BYKCk7XHJcbiAgICAgICAgLy8gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vICAgIGNhc2UgXCJzdG9wWVwiOlxyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFkoKTtcclxuICAgICAgICAvLyAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlUGxheWVyUG9zaXRpb24ocGxheWVyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0ueCA9IHBsYXllci5wb3NYO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLnkgPSBwbGF5ZXIucG9zWTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXS5zZXRTY2FsZShwbGF5ZXIuc2NhbGVYLCBwbGF5ZXIuc2NhbGVZKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBsYXllci5pZCArIFwiIFwiICsgcGxheWVyLnNjYWxlWSArIFwiIFwiICsgcGxheWVyLnNjYWxlWCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUGxheWVyKHBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMuZGVsZXRlKHBsYXllci5pZCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVGltZSh0aW1lKSB7XHJcbiAgICAgICAgLy9jaGFuZ2UgdGltZSBvbiB3YXRjaCBhY2NvcmRpbmcgdG8gY291bnRkb3duIHRpbWVcclxuICAgICAgICBpZiAoKHRoaXMuY291bnREb3duIC0gdGltZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGltZTtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hbmdsZSA9IC0gKCh0aW1lICogMzYwKSAvIHRoaXMuY291bnREb3duIC0gOTApO1xyXG4gICAgICAgICAgICB0aGlzLm15VGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG9ydE9uVGltZSAmJiAodGhpcy5jb3VudERvd24gLSB0aW1lKSA8IDE1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbSA9IHRoaXMud2F0Y2guZ2V0UGFyZW50KCkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInNob3J0T25UaW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaEFuaW0ud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG9ydE9uVGltZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3J0T25UaW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbS5zdG9wKFwic2hvcnRPblRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoLmdldFBhcmVudCgpLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS50aW1lc1VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3J0T25UaW1lID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wbGF5IGxvc2Ugc291bmQgJiBsb3NlIGNyb3duc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLndvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q2hpbGRCeU5hbWUoXCJBVURJT1wiKS5nZXRDaGlsZEJ5TmFtZShcIkxPU0VcIikuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jcm93bnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyb3ducyA+IDMwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Nyb3ducyh0aGlzLnBvaW50c0xvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMoMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zb2NrZXRDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlSXRlbShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBcInVzZWRcIilcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5nZXRDaGlsZEJ5TmFtZSh0eXBlICsgaWQpLmRlc3Ryb3koKTtcclxuICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PSBcInNwYXduXCIpIHtcclxuICAgICAgICAgICAgbGV0IHRoZUl0ZW0gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJwb3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBvdGlvblByZWZhYik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYWtlUHJlZmFiKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzdFByZWZhYik7XHJcblxyXG4gICAgICAgICAgICB0aGVJdGVtLnggPSBwb3NbMF07XHJcbiAgICAgICAgICAgIHRoZUl0ZW0ueSA9IHBvc1sxXTtcclxuICAgICAgICAgICAgdGhlSXRlbS5wYXJlbnQgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgICAgICB0aGVJdGVtLm5hbWUgPSB0eXBlICsgaWQ7XHJcbiAgICAgICAgICAgIHRoZUl0ZW0uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCA9IGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVtb2ppKGlkLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW2lkXS5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5wbGF5RW1vamkodHlwZSk7XHJcbiAgICB9LFxyXG4gICAgc3RhcnRDb3VudERvd24obnVtKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGlmIChudW0gPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmdldENoaWxkQnlOYW1lKFwiTlVNXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbnVtO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWNpZXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVBsYXllclN0YXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0Um9vbVwiOlxyXG4gICAgICAgICAgICAgICAgLy9zZXQgY291bmRvd24gdGltZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudERvd24gPSBteURhdGEuZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzTG9zdCA9IG15RGF0YS5kYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3VudERvd24pO1xyXG4gICAgICAgICAgICAgICAgLy9hZGQgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBteURhdGEuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMobXlEYXRhLmRhdGFbMl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmFkZFdpbm5lcihteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRpbWUgb24gd2F0Y2hcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZShteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZUVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVuZW15KG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoaXMucGxheWVyc1tteURhdGEuZGF0YVswXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbW9qaVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbW9qaShteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBqb2luU2VydmVyKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6XCIgKyB0aGlzLnBvcnRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2UgYXJlIGNvbm5lY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwbGF5ZXJJbmZvXCIsIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBkaWRuJ3QgY2xvc2Ugb24gcHVycG9zZSwgYWxlcnRcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb2NrZXRDbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvclVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICArIFwiOlwiICsgdGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBhcmUgY29ubmVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBsYXllckluZm9cIiwgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpZG4ndCBjbG9zZSBvbiBwdXJwb3NlLCBhbGVydFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvY2tldENsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTsgICBcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChteURhdGEudHlwZSA9PSBcInVwZGF0ZVBsYXllclN0YXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2cobXlEYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKG15RGF0YS5kYXRhWzBdICsgXCIgXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJyZW1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiYWRkUGxheWVyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIobXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInBvc2l0aW9uc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiZmluaXNoXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuYWRkV2lubmVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vIHVwZGF0ZSB0aGUgdGltZSBvbiB3YXRjaFxyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy51cGRhdGVUaW1lKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vdmFyIGluZm8gPSByZXF1aXJlKFwibG9iYnkuanNcIik7XHJcbiAgICAgICAgLy90aGlzLnBsYXllcklkID0gaW5mby5pZDtcclxuICAgICAgICAvL3RoaXMucG9ydCA9IGluZm8ucG9ydDtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludHNMb3N0ID0gNTtcclxuICAgICAgICBsZXQgYWJwID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIik7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IGFicC5wbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLnBvcnQgPSBhYnAucm9vbTtcclxuICAgICAgICB0aGlzLnNlcnZlcklwID0gYWJwLnNlcnZlcklwO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gYWJwLmNyb3ducztcclxuICAgICAgICB0aGlzLmhvdXNlSW5kZXggPSBhYnAuaG91c2VJbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmpvaW5TZXJ2ZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGlmICh0aGlzLm15UGxheWVyICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwb3NpdGlvblwiLCBbdGhpcy5teVBsYXllci54LCB0aGlzLm15UGxheWVyLnksIHJvdW5kTnVtYmVyKHRoaXMubXlQbGF5ZXIuc2NhbGVZLDUpLCByb3VuZE51bWJlcih0aGlzLm15UGxheWVyLnNjYWxlWCw1KV0pO1xyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=