"use strict";
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