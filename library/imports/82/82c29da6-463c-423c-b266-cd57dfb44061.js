"use strict";
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
  changeColor: function changeColor(i) {
    if (i > 3) i = 0;
    this.node.getComponent("aboutPlayer").houseIndex = i;

    for (var index = 0; index < this.frames.length; index++) {
      this.frames[index].active = false;
    }

    this.frames[i].active = true;

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
  }
});

cc._RF.pop();