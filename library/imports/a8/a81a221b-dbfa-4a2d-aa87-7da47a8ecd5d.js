"use strict";
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