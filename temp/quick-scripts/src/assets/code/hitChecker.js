"use strict";
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