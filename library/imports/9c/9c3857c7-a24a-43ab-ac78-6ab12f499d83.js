"use strict";
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