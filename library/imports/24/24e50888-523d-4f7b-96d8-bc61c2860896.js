"use strict";
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
    serverIp: null
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.game.addPersistRootNode(this.node);
  } // update (dt) {},

});

cc._RF.pop();