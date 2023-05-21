"use strict";
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
    yOffset: 0,
    // paralaxLayers: [cc.Node],
    startPos: [],
    xOffsetPlayer: 0,
    yOffsetPlayer: 0,
    maxOffset: 20
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.startPos = [0, 0, 0, 0, 0, 0, 0];
  },
  start: function start() {},
  update: function update(dt) {
    if (!this.following) {
      if (cc.find("system").getComponent("client").myPlayer != null) {
        this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        this.following = true;
      }
    } else {
      var m = this.player.getComponent("movement");
      if (m.movingRight && this.xOffsetPlayer < this.maxOffset) this.xOffsetPlayer += 20 * dt;else if (m.movingLeft && this.xOffsetPlayer > -this.maxOffset) this.xOffsetPlayer -= 20 * dt;else this.xOffsetPlayer /= 10;
      this.node.x = this.player.x + this.xOffsetPlayer;
      this.node.y = this.player.y + this.yOffset + this.yOffsetPlayer;
    } // for (let i = 0; i < this.paralaxLayers.length; i++) {
    //     this.paralaxLayers[i].setPosition(this.node.x / (i + 1) * 2 + this.startPos[i], this.node.y / (i + 1) * 2);
    //     if (Math.abs(this.node.x - this.paralaxLayers[i].x) >= (this.paralaxLayers[i].width - this.node.width)) {
    //         //this.paralaxLayers[i].setPosition(this.node.x + (this.node.x - this.paralaxLayers[i].x), this.node.y);
    //         this.startPos[i] += this.node.x - this.paralaxLayers[i].x;
    //     }
    // }
    // this.background.setPosition(this.node.x, this.node.y);


    this.ui.x = this.node.x;
    this.ui.y = this.node.y;
  }
});

cc._RF.pop();