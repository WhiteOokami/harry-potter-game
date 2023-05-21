
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2FtZXJhRm9sbG93LmpzIl0sIm5hbWVzIjpbInBsYXllciIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZm9sbG93aW5nIiwidWkiLCJOb2RlIiwieU9mZnNldCIsInN0YXJ0UG9zIiwieE9mZnNldFBsYXllciIsInlPZmZzZXRQbGF5ZXIiLCJtYXhPZmZzZXQiLCJvbkxvYWQiLCJzdGFydCIsInVwZGF0ZSIsImR0IiwiZmluZCIsImdldENvbXBvbmVudCIsIm15UGxheWVyIiwicGxheWVySWQiLCJtIiwibW92aW5nUmlnaHQiLCJtb3ZpbmdMZWZ0Iiwibm9kZSIsIngiLCJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLE1BQU0sR0FBRyxJQUFiO0FBRUFDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSSixJQUFBQSxNQUFNLEVBQUUsSUFEQTtBQUVSSyxJQUFBQSxTQUFTLEVBQUUsS0FGSDtBQUdSO0FBQ0FDLElBQUFBLEVBQUUsRUFBRUwsRUFBRSxDQUFDTSxJQUpDO0FBS1JDLElBQUFBLE9BQU8sRUFBRSxDQUxEO0FBTVI7QUFDQUMsSUFBQUEsUUFBUSxFQUFFLEVBUEY7QUFRUkMsSUFBQUEsYUFBYSxFQUFFLENBUlA7QUFTUkMsSUFBQUEsYUFBYSxFQUFFLENBVFA7QUFVUkMsSUFBQUEsU0FBUyxFQUFFO0FBVkgsR0FIUDtBQWdCTDtBQUVBQyxFQUFBQSxNQWxCSyxvQkFrQkk7QUFDTCxTQUFLSixRQUFMLEdBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDSCxHQXBCSTtBQXVCTEssRUFBQUEsS0F2QkssbUJBdUJHLENBQ1AsQ0F4Qkk7QUEwQkxDLEVBQUFBLE1BMUJLLGtCQTBCRUMsRUExQkYsRUEwQk07QUFDUCxRQUFJLENBQUMsS0FBS1gsU0FBVixFQUFxQjtBQUNqQixVQUFJSixFQUFFLENBQUNnQixJQUFILENBQVEsUUFBUixFQUFrQkMsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNDLFFBQXpDLElBQXFELElBQXpELEVBQStEO0FBQzNELGFBQUtuQixNQUFMLEdBQWNDLEVBQUUsQ0FBQ2dCLElBQUgsQ0FBUSxvQkFBb0JoQixFQUFFLENBQUNnQixJQUFILENBQVEsUUFBUixFQUFrQkMsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNFLFFBQXJFLENBQWQ7QUFDQSxhQUFLZixTQUFMLEdBQWlCLElBQWpCO0FBQ0g7QUFDSixLQUxELE1BS087QUFDSCxVQUFJZ0IsQ0FBQyxHQUFHLEtBQUtyQixNQUFMLENBQVlrQixZQUFaLENBQXlCLFVBQXpCLENBQVI7QUFDQSxVQUFHRyxDQUFDLENBQUNDLFdBQUYsSUFBaUIsS0FBS1osYUFBTCxHQUFxQixLQUFLRSxTQUE5QyxFQUNJLEtBQUtGLGFBQUwsSUFBc0IsS0FBR00sRUFBekIsQ0FESixLQUVLLElBQUdLLENBQUMsQ0FBQ0UsVUFBRixJQUFnQixLQUFLYixhQUFMLEdBQXFCLENBQUMsS0FBS0UsU0FBOUMsRUFDRCxLQUFLRixhQUFMLElBQXNCLEtBQUdNLEVBQXpCLENBREMsS0FHRCxLQUFLTixhQUFMLElBQW9CLEVBQXBCO0FBQ0osV0FBS2MsSUFBTCxDQUFVQyxDQUFWLEdBQWMsS0FBS3pCLE1BQUwsQ0FBWXlCLENBQVosR0FBZ0IsS0FBS2YsYUFBbkM7QUFDQSxXQUFLYyxJQUFMLENBQVVFLENBQVYsR0FBYyxLQUFLMUIsTUFBTCxDQUFZMEIsQ0FBWixHQUFnQixLQUFLbEIsT0FBckIsR0FBK0IsS0FBS0csYUFBbEQ7QUFDSCxLQWhCTSxDQWlCUDtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFLTCxFQUFMLENBQVFtQixDQUFSLEdBQVksS0FBS0QsSUFBTCxDQUFVQyxDQUF0QjtBQUNBLFNBQUtuQixFQUFMLENBQVFvQixDQUFSLEdBQVksS0FBS0YsSUFBTCxDQUFVRSxDQUF0QjtBQUNIO0FBdERJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImxldCBwbGF5ZXIgPSBudWxsO1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBwbGF5ZXI6IG51bGwsXHJcbiAgICAgICAgZm9sbG93aW5nOiBmYWxzZSxcclxuICAgICAgICAvLyBiYWNrZ3JvdW5kOiBjYy5Ob2RlLFxyXG4gICAgICAgIHVpOiBjYy5Ob2RlLFxyXG4gICAgICAgIHlPZmZzZXQ6IDAsXHJcbiAgICAgICAgLy8gcGFyYWxheExheWVyczogW2NjLk5vZGVdLFxyXG4gICAgICAgIHN0YXJ0UG9zOiBbXSxcclxuICAgICAgICB4T2Zmc2V0UGxheWVyOiAwLFxyXG4gICAgICAgIHlPZmZzZXRQbGF5ZXI6IDAsXHJcbiAgICAgICAgbWF4T2Zmc2V0OiAyMCxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgIH0sXHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmZvbGxvd2luZykge1xyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikubXlQbGF5ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnMvXCIgKyBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvbGxvd2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbSA9IHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpXHJcbiAgICAgICAgICAgIGlmKG0ubW92aW5nUmlnaHQgJiYgdGhpcy54T2Zmc2V0UGxheWVyIDwgdGhpcy5tYXhPZmZzZXQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhPZmZzZXRQbGF5ZXIgKz0gMjAqZHRcclxuICAgICAgICAgICAgZWxzZSBpZihtLm1vdmluZ0xlZnQgJiYgdGhpcy54T2Zmc2V0UGxheWVyID4gLXRoaXMubWF4T2Zmc2V0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy54T2Zmc2V0UGxheWVyIC09IDIwKmR0XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMueE9mZnNldFBsYXllci89MTBcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnBsYXllci54ICsgdGhpcy54T2Zmc2V0UGxheWVyO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMucGxheWVyLnkgKyB0aGlzLnlPZmZzZXQgKyB0aGlzLnlPZmZzZXRQbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXJhbGF4TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMucGFyYWxheExheWVyc1tpXS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCAvIChpICsgMSkgKiAyICsgdGhpcy5zdGFydFBvc1tpXSwgdGhpcy5ub2RlLnkgLyAoaSArIDEpICogMik7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoTWF0aC5hYnModGhpcy5ub2RlLnggLSB0aGlzLnBhcmFsYXhMYXllcnNbaV0ueCkgPj0gKHRoaXMucGFyYWxheExheWVyc1tpXS53aWR0aCAtIHRoaXMubm9kZS53aWR0aCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLnNldFBvc2l0aW9uKHRoaXMubm9kZS54ICsgKHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLngpLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0UG9zW2ldICs9IHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLng7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5iYWNrZ3JvdW5kLnNldFBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy51aS54ID0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgdGhpcy51aS55ID0gdGhpcy5ub2RlLnk7XHJcbiAgICB9LFxyXG59KTtcclxuIl19
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

var PlayerInfo = function PlayerInfo(id, name, crowns, wins, loses) {
  this.id = id;
  this.name = name;
  this.crowns = crowns;
  this.wins = wins;
  this.loses = loses;
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
        cc.find("Canvas/CROWNS/num").getComponent(cc.Label).string = myData.data.crowns;
        cc.find("Canvas/WINS").getComponent(cc.Label).string = myData.data.wins + " wins";
        cc.find("Canvas/LOSES").getComponent(cc.Label).string = myData.data.loses + " loses";
        cc.find("Canvas/USERNAME").getComponent(cc.Label).string = _this.playerName;
        cc.sys.localStorage.setItem("username", JSON.stringify(_this.playerName));
        cc.sys.localStorage.setItem("password", JSON.stringify(_this.password));
        _this.signInNode.active = false;
      }

      console.log("id = " + _this.playerId);

      _this.ws.close();

      _this.refreshLeader();
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

          cc.find("MANAGER").getComponent("aboutPlayer").playerId = this.playerId;
          cc.find("MANAGER").getComponent("aboutPlayer").room = myData.data[1];
          cc.find("MANAGER").getComponent("aboutPlayer").serverIp = this.serverIp;
          cc.find("MANAGER").getComponent("aboutPlayer").crowns = this.crowns;
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
    var _this2 = this;

    this.connecting = true;

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      console.log("yes");
      this.ws = wx.connectSocket({
        url: "ws://" + this.serverIp + ":9091"
      });
      this.ws.onOpen(function () {
        _this2.joinLobbySuccessfully();
      });
      this.ws.onMessage(function (_ref2) {
        var data = _ref2.data;

        _this2.receiveMessage(data);
      });
      this.ws.onError(function () {
        console.log("couldn't connect");
        _this2.errorNode.active = true;
        _this2.connecting = false;
      });
      this.ws.onClose(function () {
        _this2.closeLobby();
      });
    } else {
      console.log("no");
      this.ws = new WebSocket("ws://" + this.serverIp + ":9091");
      this.ws.addEventListener("open", function () {
        _this2.joinLobbySuccessfully();
      });
      this.ws.addEventListener('message', function (_ref3) {
        var data = _ref3.data;

        _this2.receiveMessage(data);
      });
      this.ws.addEventListener("error", function () {
        console.log("couldn't connect");
        _this2.errorNode.active = true;
        _this2.connecting = false;
      });
      this.ws.addEventListener("close", function () {
        _this2.closeLobby();
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
            player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
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
          player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
          player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
        }
      };

      xhr.open("GET", "http://" + this.serverIp + ":3000/");
      xhr.send();
    }

    this.refreshRecords();
  },
  refreshRecords: function refreshRecords() {
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
            player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
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
          player.getChildByName("NAME").getComponent(cc.Label).string = response[i].name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbG9iYnkuanMiXSwibmFtZXMiOlsicGF5TG9hZCIsInR5cGUiLCJkYXRhIiwiUGxheWVyRGF0YSIsImlkIiwieCIsInBvc1giLCJwb3NZIiwibmFtZSIsInN0YXR1cyIsImtleSIsIlBsYXllckluZm8iLCJjcm93bnMiLCJ3aW5zIiwibG9zZXMiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndzIiwicGxheWVyTmFtZU5vZGUiLCJOb2RlIiwicGxheWVyTmFtZSIsImpvaW5pbmciLCJidXR0b25UZXh0IiwibG9iYnlJbmZvVGV4dCIsImxvYmJ5U3RhdHVzVGV4dCIsInBsYXllcklkIiwiY29ubmVjdGVkIiwiZXJyb3JOb2RlIiwiY29ubmVjdGluZyIsInR1dG9yaWFscyIsInR1dG9yaWFsSW5kZXgiLCJ0dXRvcmlhbFBhZ2UiLCJ1c2VybmFtZU5vZGUiLCJzZXJ2ZXJJcCIsImhhdmVVc2VyRGF0YSIsInNob3dpbmdMZWFkZXJib2FyZCIsImxlYWRlcmJvYXJkTm9kZSIsImxlYWRlcmJvYXJkVGl0bGUiLCJwbGF5ZXJTdGF0UHJlZmFiIiwiUHJlZmFiIiwicGxheWVyUmVjb3JkUHJlZmFiIiwicmVjb3Jkc05vZGUiLCJyZWNvcmRzVGl0bGUiLCJzaWduSW5Ob2RlIiwiaW5wdXRVc2VybmFtZU5vZGUiLCJwYXNzd29yZE5vZGUiLCJwYXNzd29yZCIsImxvZ2luRXJyb3JOb2RlIiwic2hvd05leHQiLCJhY3RpdmUiLCJnaXZlU2lnbkluRXJyb3IiLCJlcnJvciIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwicHJlc3NTaWduSW4iLCJzaWduSW5VcCIsIkVkaXRCb3giLCJ0aGVOYW1lIiwidGhlUGFzc3dvcmQiLCJzZW50IiwidG9VcHBlckNhc2UiLCJsZW5ndGgiLCJpIiwiY2hhckNvZGVBdCIsIldlYlNvY2tldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm15RGF0YSIsInBhcnNlIiwiZmluZCIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJyZWZyZXNoTGVhZGVyIiwiam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5IiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInJlY2VpdmVNZXNzYWdlIiwidXBkYXRlVXNlcnMiLCJyb29tIiwibGVhdmVMb2JieSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidXBkYXRlU3RhdHVzIiwic2hvd0xlYWRlcmJvYXJkIiwiY2xvc2VMZWFkZXJib2FyZCIsImNsb3NlTG9iYnkiLCJjbG9zZUVycm9yIiwiam9pbkxvYmJ5Iiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJvcyIsImNsb3NlU29ja2V0IiwibnVtIiwicHJlc3NKb2luIiwid2F0Y2giLCJjcmVhdGVXZUNoYXRCdXR0b24iLCJyZXF1ZXN0Iiwic3VjY2VzcyIsInJlcyIsInJlbW92ZUFsbENoaWxkcmVuIiwicmVzcG9uc2UiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImdldENoaWxkQnlOYW1lIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZXNwb25zZVRleHQiLCJvcGVuIiwicmVmcmVzaFJlY29yZHMiLCJzcGVlZCIsIm9wZW5UdXRvcmlhbCIsIm5leHRUdXRvcmlhbCIsImdvVG9TdG9yeSIsInN5c0luZm8iLCJ3aW5kb3ciLCJnZXRTeXN0ZW1JbmZvU3luYyIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJnZXRVc2VySW5mbyIsInVzZXJJbmZvIiwibmlja05hbWUiLCJsb2dpbiIsImQiLCJhcHBpZCIsInNlY3JlY3QiLCJsIiwiY29kZSIsIm1ldGhvZCIsIm9wZW5pZCIsImJ1dHRvbiIsImNyZWF0ZVVzZXJJbmZvQnV0dG9uIiwidGV4dCIsInN0eWxlIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJsaW5lSGVpZ2h0Iiwib25UYXAiLCJkZXN0cm95Iiwib25Mb2FkIiwiZ2V0U3RvcmFnZSIsImZhaWwiLCJzZXRTdG9yYWdlIiwiZ2V0SXRlbSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxVQUNGLGlCQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QjtBQUNwQixPQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFDSjs7SUFFS0MsYUFDRixvQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFBQSxPQU1uQkMsSUFObUIsR0FNWixDQU5ZO0FBQUEsT0FPbkJDLElBUG1CLEdBT1osQ0FQWTtBQUFBLE9BUW5CQyxJQVJtQixHQVFaLElBUlk7QUFDZixPQUFLSixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0g7O0FBSUo7O0lBR0tDLGFBQ0Ysb0JBQVlQLEVBQVosRUFBZ0JJLElBQWhCLEVBQXNCSSxNQUF0QixFQUE4QkMsSUFBOUIsRUFBb0NDLEtBQXBDLEVBQTJDO0FBQ3ZDLE9BQUtWLEVBQUwsR0FBVUEsRUFBVjtBQUNBLE9BQUtJLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtJLE1BQUwsR0FBY0EsTUFBZDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNIOztBQUNKO0FBRURDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxFQUFFLEVBQUUsSUFE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QUNIckosVUFBQUEsRUFBRSxDQUFDMkQsSUFBSCxDQUFRLGVBQVIsRUFBeUJwQixZQUF6QixDQUFzQyxPQUF0QyxFQUErQ3dFLFlBQS9DO0FBQ0E3QixVQUFBQSxFQUFFLENBQUNvRSxVQUFILENBQWM7QUFDVjNKLFlBQUFBLEdBQUcsRUFBRSxRQURLO0FBRVZSLFlBQUFBLElBQUksRUFBRTtBQUZJLFdBQWQ7QUFJSDtBQVpTLE9BQWQ7QUFjQSxXQUFLMkcsa0JBQUw7QUFDSCxLQWpCRCxNQWlCTTtBQUNGO0FBQ0EsVUFBSTlGLEVBQUUsQ0FBQzRELEdBQUgsQ0FBT0MsWUFBUCxDQUFvQjBGLE9BQXBCLENBQTRCLFVBQTVCLEtBQTJDLElBQTNDLElBQW1EdkosRUFBRSxDQUFDNEQsR0FBSCxDQUFPQyxZQUFQLENBQW9CMEYsT0FBcEIsQ0FBNEIsVUFBNUIsS0FBMkMsSUFBbEcsRUFBd0c7QUFDcEcsYUFBSzVHLFFBQUwsQ0FBY1ksSUFBSSxDQUFDRyxLQUFMLENBQVcxRCxFQUFFLENBQUM0RCxHQUFILENBQU9DLFlBQVAsQ0FBb0IwRixPQUFwQixDQUE0QixVQUE1QixDQUFYLENBQWQsRUFBbUVoRyxJQUFJLENBQUNHLEtBQUwsQ0FBVzFELEVBQUUsQ0FBQzRELEdBQUgsQ0FBT0MsWUFBUCxDQUFvQjBGLE9BQXBCLENBQTRCLFVBQTVCLENBQVgsQ0FBbkU7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLeEMsWUFBTDtBQUNBLGFBQUtqRixVQUFMLENBQWdCTSxNQUFoQixHQUF5QixJQUF6QjtBQUNIO0FBRUo7O0FBRUQsU0FBSzhCLGFBQUw7QUFFSCxHQS9mSTtBQWlnQkxzRixFQUFBQSxLQWpnQkssbUJBaWdCSSxDQUVSLENBbmdCSSxDQXFnQkw7O0FBcmdCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5cclxuY2xhc3MgUGxheWVySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgY3Jvd25zLCB3aW5zLCBsb3Nlcykge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gY3Jvd25zO1xyXG4gICAgICAgIHRoaXMud2lucyA9IHdpbnM7XHJcbiAgICAgICAgdGhpcy5sb3NlcyA9IGxvc2VzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICB3czogbnVsbCxcclxuICAgICAgICBwbGF5ZXJOYW1lTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJOYW1lOiBudWxsLFxyXG4gICAgICAgIGpvaW5pbmc6IGZhbHNlLFxyXG4gICAgICAgIGJ1dHRvblRleHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgbG9iYnlJbmZvVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBsb2JieVN0YXR1c1RleHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVySWQ6IG51bGwsXHJcbiAgICAgICAgY29ubmVjdGVkOiBmYWxzZSxcclxuICAgICAgICBzdGF0dXM6IFwiKHdhaXRpbmcgZm9yIHBsYXllcnMuLi4pXCIsXHJcblxyXG4gICAgICAgIGVycm9yTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBjb25uZWN0aW5nOiBmYWxzZSxcclxuXHJcbiAgICAgICAgdHV0b3JpYWxzOiBbY2MuTm9kZV0sXHJcbiAgICAgICAgdHV0b3JpYWxJbmRleDogMCxcclxuICAgICAgICB0dXRvcmlhbFBhZ2U6IGNjLk5vZGUsXHJcblxyXG4gICAgICAgIHVzZXJuYW1lTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBzZXJ2ZXJJcDogXCJcIixcclxuICAgICAgICBoYXZlVXNlckRhdGE6IGZhbHNlLFxyXG5cclxuICAgICAgICBzaG93aW5nTGVhZGVyYm9hcmQ6IHRydWUsXHJcbiAgICAgICAgbGVhZGVyYm9hcmROb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGxlYWRlcmJvYXJkVGl0bGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyU3RhdFByZWZhYjogY2MuUHJlZmFiLFxyXG5cclxuICAgICAgICBwbGF5ZXJSZWNvcmRQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICByZWNvcmRzTm9kZTogY2MuTm9kZSxcclxuICAgICAgICByZWNvcmRzVGl0bGU6IGNjLk5vZGUsXHJcblxyXG5cclxuICAgICAgICBzaWduSW5Ob2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGlucHV0VXNlcm5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhc3N3b3JkTm9kZTogY2MuTm9kZSxcclxuICAgICAgICBwYXNzd29yZDogbnVsbCxcclxuICAgICAgICBjcm93bnM6IDAsXHJcbiAgICAgICAgbG9naW5FcnJvck5vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dOZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dpbmdMZWFkZXJib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZFRpdGxlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNUaXRsZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmxlYWRlcmJvYXJkVGl0bGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzVGl0bGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkc05vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd2luZ0xlYWRlcmJvYXJkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2l2ZVNpZ25JbkVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGVycm9yO1xyXG4gICAgfSxcclxuICAgIHByZXNzU2lnbkluKCkge1xyXG4gICAgICAgIHRoaXMuc2lnbkluVXAodGhpcy5pbnB1dFVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nLCB0aGlzLnBhc3N3b3JkTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nKVxyXG4gICAgfSxcclxuICAgIHNpZ25JblVwKHRoZU5hbWUsdGhlUGFzc3dvcmQpIHtcclxuICAgICAgICBsZXQgc2VudCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGxheWVyTmFtZSA9IHRoZU5hbWUudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB0aGlzLnBhc3N3b3JkID0gdGhlUGFzc3dvcmQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZS5sZW5ndGggPCAxIHx8IHRoaXMucGFzc3dvcmQubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lL3Bhc3N3b3JkIHRvbyBzaG9ydFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOYW1lLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPCAnQScuY2hhckNvZGVBdCgpIHx8IHRoaXMucGxheWVyTmFtZVtpXS5jaGFyQ29kZUF0KCkgPiAnWicuY2hhckNvZGVBdCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInVzZXJuYW1lIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFzc3dvcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFzc3dvcmRbaV0uY2hhckNvZGVBdCgpIDwgJzAnLmNoYXJDb2RlQXQoKSB8fCB0aGlzLnBhc3N3b3JkW2ldLmNoYXJDb2RlQXQoKSA+ICd6Jy5jaGFyQ29kZUF0KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwicGFzc3dvcmQgaGFzIGludmFsaWQgY2hhcmFjdGVyc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghc2VudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwic2lnbkluXCIsIFt0aGlzLnBsYXllck5hbWUsIHRoaXMucGFzc3dvcmRdKSkpOyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbXlEYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgICAgaWYgKG15RGF0YS50eXBlID09IFwiZmFpbGVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZVNpZ25JbkVycm9yKFwiY291bGRuJ3Qgc2lnbiBpbiAoY2hlY2sgaW5mbyBvciB1c2VybmFtZSBpcyB0YWtlbilcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChteURhdGEudHlwZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IG15RGF0YS5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcm93bnMgPSBteURhdGEuZGF0YS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL0NST1dOUy9udW1cIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBteURhdGEuZGF0YS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1dJTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBteURhdGEuZGF0YS53aW5zICsgXCIgd2luc1wiO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9MT1NFU1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLmxvc2VzICsgXCIgbG9zZXNcIjtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVVNFUk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLnBsYXllck5hbWU7XHJcbiAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCBKU09OLnN0cmluZ2lmeSh0aGlzLnBsYXllck5hbWUpKTtcclxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBhc3N3b3JkXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucGFzc3dvcmQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQgPSBcIiArIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaExlYWRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIGpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJqb2luZWQgbG9iYnlcIik7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vaWYgKGNjLnN5cy5wbGF0Zm9ybSAhPSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgLy8gICAgdGhpcy5wbGF5ZXJJZCA9IHRoaXMucGxheWVyTmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZztcclxuXHJcbiAgICAgICAgdGhpcy5qb2luaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJ1dHRvblRleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIkNBTkNFTFwiO1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKFwicGxheWVyX25hbWVcIiwgW3RoaXMucGxheWVyTmFtZSwgXCJ3ZWNoYXRcIiwgdGhpcy5wbGF5ZXJJZF0pKSk7XHJcbiAgICB9LFxyXG4gICAgcmVjZWl2ZU1lc3NhZ2UoZGF0YSkge1xyXG4gICAgICAgIGxldCBteURhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImxvYmJ5SW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVVc2VycyhteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInBsYXllckluZm9cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVySWQgPSBteURhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGF0dXNcIjpcclxuICAgICAgICAgICAgICAgIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0aW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWUgaXMgc3RhcnRpbmcgaW4gXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBcIihzdGFydGluZyBpbiBcIiArIG15RGF0YS5kYXRhWzFdICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0YXJ0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3N0YXJ0IGdhbWVcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGdhbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgdGhlUGxheWVySW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBpZDogdGhpcy5wbGF5ZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICBwb3J0OiBteURhdGEuZGF0YVsxXSxmXHJcbiAgICAgICAgICAgICAgICAgICAgLy99O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbW9kdWxlLmV4cG9ydHMgPSB0aGVQbGF5ZXJJbmZvO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5wbGF5ZXJJZCA9IHRoaXMucGxheWVySWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucm9vbSA9IG15RGF0YS5kYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJNQU5BR0VSXCIpLmdldENvbXBvbmVudChcImFib3V0UGxheWVyXCIpLnNlcnZlcklwID0gdGhpcy5zZXJ2ZXJJcDtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5jcm93bnMgPSB0aGlzLmNyb3ducztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobXlEYXRhLmRhdGFbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYXAxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjogY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFwMlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1hcDNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChteURhdGEuZGF0YVswXSA9PSBcInN0b3BcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gXCIod2FpdGluZyBmb3IgcGxheWVycy4uLilcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2hvd0xlYWRlcmJvYXJkKCkge1xyXG4gICAgICAgIHRoaXMubGVhZGVyYm9hcmROb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VMZWFkZXJib2FyZCgpIHtcclxuICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUxvYmJ5KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGlzY29ubmVjdGVkXCIpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5qb2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5idXR0b25UZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJQTEFZXCI7XHJcbiAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsb3NlRXJyb3IoKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgam9pbkxvYmJ5KCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5ZXNcIik7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6OTA5MVwiXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uT3BlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5Mb2JieVN1Y2Nlc3NmdWxseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VsZG4ndCBjb25uZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlTG9iYnkoKTsgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vXCIpO1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6OTA5MVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qb2luTG9iYnlTdWNjZXNzZnVsbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb3VsZG4ndCBjb25uZWN0XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvck5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VMb2JieSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGxlYXZlTG9iYnkoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5vcyA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2VTb2NrZXQoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVVc2VycyhudW0pIHtcclxuICAgICAgICAvL3RoaXMubG9iYnlJbmZvVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG51bSArIFwiLzEwIHBsYXllcnMgXCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVTdGF0dXMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB0aGlzLnN0YXR1cztcclxuICAgIH0sXHJcbiAgICBwcmVzc0pvaW4oKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcklkICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgIC8vIGNhbm5vdCBqb2luIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhdmVVc2VyRGF0YSB8fCBjYy5zeXMucGxhdGZvcm0gIT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuam9pbmluZyAmJiAhdGhpcy5jb25uZWN0aW5nKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam9pbkxvYmJ5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25UZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJQTEFZXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxvYmJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IGZhbHNlOyB0aGlzLndhdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2JieVN0YXR1c1RleHQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVdlQ2hhdEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcmVmcmVzaExlYWRlcigpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMC9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHJlcy5kYXRhLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlkIC0gbmFtZSAtIGNyb3ducyAtIHdpbnMgLSBsb3Nlc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IGNjLmluc3RhbnRpYXRlKGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllclN0YXRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJQTEFDRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGkgKyAxICsgXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaGluZ1wiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZnJlc2hSZWNvcmRzKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWZyZXNoUmVjb3JkcygpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMS9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJSZWNvcmRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoaW5nXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWNvcmRzTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCIgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcImh0dHA6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjozMDAxL1wiKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgICBvcGVuVHV0b3JpYWwoKSB7XHJcbiAgICAgICAgdGhpcy50dXRvcmlhbFBhZ2UuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1swXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIG5leHRUdXRvcmlhbCgpIHtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1t0aGlzLnR1dG9yaWFsSW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxJbmRleCArPSAxOyAgICBcclxuICAgICAgICBpZiAodGhpcy50dXRvcmlhbEluZGV4IDwgdGhpcy50dXRvcmlhbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHV0b3JpYWxzW3RoaXMudHV0b3JpYWxJbmRleF0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR1dG9yaWFsUGFnZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50dXRvcmlhbEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGdvVG9TdG9yeSgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdG9yeVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlV2VDaGF0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZU5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWVOb2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHN5c0luZm8gPSB3aW5kb3cud3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHN5c0luZm8uc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBzeXNJbmZvLnNjcmVlbkhlaWdodDtcclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5hdXRoU2V0dGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJJbmZvXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiMVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS51c2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJOYW1lID0gdXNlckluZm8ubmlja05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuaGF2ZVVzZXJEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NmdWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5hcHBpZCA9IFwid3hhNjYwMmU1MDE2MjU0NzFmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnNlY3JlY3QgPSBcImEwYWY0Yzg5NmYyMmNlOWMwMGQ2MWEyNzRlMmFmYWQxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICdodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL3Nucy9qc2NvZGUyc2Vzc2lvbj9hcHBpZD0nICsgZC5hcHBpZCArICcmc2VjcmV0PScgKyBkLnNlY3JlY3QgKyAnJmpzX2NvZGU9JyArIHJlcy5jb2RlICsgJyZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLm9wZW5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllcklkID0gcmVzLmRhdGEub3BlbmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidXR0b24gPSB3eC5jcmVhdGVVc2VySW5mb0J1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnYWxsb3cgbWluaXByb2dyYW0gdG8gdXNlIGluZm8/JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZBRUIzQycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5vblRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlckluZm8gPSByZXMudXNlckluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikudXNlcm5hbWVOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdXNlckluZm8ubmlja05hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3BsYXllZCBiZWZvcmVcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5vcGVuVHV0b3JpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBcInllc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV2VDaGF0QnV0dG9uKCk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwbGF5ZWQgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPSBudWxsICYmIGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluVXAoSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSksIEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblR1dG9yaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25Jbk5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7ICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19
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
    this.emojiButton.active = false;
    this.emojiUI.active = true;
  },
  hideEmojis: function hideEmojis() {
    this.emojiButton.active = true;
    this.emojiUI.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ2FtZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXN0YW5jZVRleHQiLCJOb2RlIiwiZGlzdGFuY2UiLCJwbGF5ZXIiLCJmb2xsb3dpbmciLCJlbmRQb3NpdGlvbiIsImdhbWVFbmRlZCIsIndpbm5lckNhbnZhIiwiZmluaXNoZWRQbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwidGltZXNVcFVpIiwic3Bhd24iLCJjYW1lcmEiLCJwbGF5ZXJzIiwic3BlY3RhdGVJbmRleCIsInNwZWN0YXRlVUkiLCJlbW9qaUJ1dHRvbiIsImVtb2ppVUkiLCJtb2JpbGVDb250cm9sbGVyIiwibnVtRmluaXNoZWQiLCJjcm93bnNOb2RlIiwib25Mb2FkIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZW5hYmxlZCIsImdhbWUiLCJzZXRGcmFtZVJhdGUiLCJhZGRXaW5uZXIiLCJwbGFjZSIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhUGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJnZXRDaGlsZEJ5TmFtZSIsIm5hbWUiLCJmaW5kIiwibXlUaW1lIiwidGltZXNVcCIsImRpc2FibGUiLCJhY3RpdmUiLCJzaG93Q3Jvd25zIiwiY3Jvd25zIiwiY29uc29sZSIsImxvZyIsInNob3dXaW5uZXJzIiwiY2xvc2VDcm93bnMiLCJjbG9zZVNwZWN0YXRlIiwiZ29CYWNrVG9Mb2JieSIsImRpc2Nvbm5lY3QiLCJsb2FkU2NlbmUiLCJjb25maXJtVGltZXNVcCIsIm9wZW5TcGVjdGF0ZVVpIiwic2hvd0Vtb2ppcyIsImhpZGVFbW9qaXMiLCJzZXBjdGF0ZVByZXYiLCJuZXdQbGF5ZXIiLCJzcGVjdGF0ZU5leHQiLCJ1cGRhdGUiLCJkdCIsIm15UGxheWVyIiwicGxheWVySWQiXSwibWFwcGluZ3MiOiI7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QWFtQixRQUFiLENBQXNCQyxNQUE3QixHQUFzQyxXQUF2RjtBQUNIO0FBQ0osS0FORCxNQU1PO0FBQ0g7QUFDQTtBQUNBLFVBQUksS0FBSzVCLFNBQVQsRUFBb0I7QUFDaEIsYUFBS0gsTUFBTCxDQUFZMkIsWUFBWixDQUF5QixVQUF6QixFQUFxQ2MsTUFBckMsR0FBOEMsS0FBOUM7QUFDQSxhQUFLekIsZ0JBQUwsQ0FBc0J5QixNQUF0QixHQUErQixLQUEvQjtBQUNIO0FBQ0o7QUFFSjtBQTNISSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGRpc3RhbmNlVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBkaXN0YW5jZTogMCxcclxuICAgICAgICBwbGF5ZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgZm9sbG93aW5nOiBmYWxzZSxcclxuICAgICAgICBlbmRQb3NpdGlvbjogY2MuTm9kZSxcclxuICAgICAgICBnYW1lRW5kZWQ6IGZhbHNlLFxyXG4gICAgICAgIHdpbm5lckNhbnZhOiBjYy5Ob2RlLFxyXG4gICAgICAgIGZpbmlzaGVkUGxheWVyczogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICB0aW1lc1VwVWk6IGNjLk5vZGUsXHJcbiAgICAgICAgc3Bhd246IGNjLk5vZGUsXHJcbiAgICAgICAgY2FtZXJhOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllcnM6IGNjLk5vZGUsXHJcbiAgICAgICAgc3BlY3RhdGVJbmRleDogMCxcclxuICAgICAgICBzcGVjdGF0ZVVJOiBjYy5Ob2RlLFxyXG4gICAgICAgIGVtb2ppQnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGVtb2ppVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgbW9iaWxlQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBudW1GaW5pc2hlZDogY2MuTm9kZSxcclxuICAgICAgICBjcm93bnNOb2RlOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGNjLmdhbWUuc2V0RnJhbWVSYXRlKDYwKTtcclxuICAgICAgICAvL2NjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRGVidWdEcmF3ID0gdHJ1ZTsgXHJcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZERyYXdCb3VuZGluZ0JveCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFdpbm5lcihwbGF5ZXIsIHBsYWNlKSB7XHJcbiAgICAgICAgdGhpcy5udW1GaW5pc2hlZC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYWNlICsgXCIvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICBsZXQgYVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICBhUGxheWVyLnBhcmVudCA9IHRoaXMuZmluaXNoZWRQbGF5ZXJzO1xyXG4gICAgICAgIGFQbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJURVhUXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxheWVyLm5hbWUgKyBcIiBmaW5pc2hlZCBpbiBcIiArIHBsYWNlICsgXCIgcGxhY2UgICBcIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLm15VGltZSArIFwic1wiO1xyXG4gICAgfSxcclxuICAgIHRpbWVzVXAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRpbWVzVXBVaS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHNob3dDcm93bnMoY3Jvd25zKSB7XHJcbiAgICAgICAgdGhpcy5jcm93bnNOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Jvd25zKTtcclxuICAgICAgICBpZiAoY3Jvd25zID4gMClcclxuICAgICAgICAgICAgdGhpcy5jcm93bnNOb2RlLmdldENoaWxkQnlOYW1lKFwiQ1JPV05TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCIrIFwiICsgY3Jvd25zO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jcm93bnNOb2RlLmdldENoaWxkQnlOYW1lKFwiQ1JPV05TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gY3Jvd25zO1xyXG4gICAgfSxcclxuICAgIHNob3dXaW5uZXJzKGNyb3ducykge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUNyb3ducygpIHtcclxuICAgICAgICB0aGlzLmNyb3duc05vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VTcGVjdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLndpbm5lckNhbnZhLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zcGVjdGF0ZVVJLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGdvQmFja1RvTG9iYnkoKSB7XHJcbiAgICAgICAgLy8gZ28gYmFjayB0byBsb2JieVxyXG4gICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJob21lXCIpO1xyXG4gICAgfSxcclxuICAgIGNvbmZpcm1UaW1lc1VwKCkge1xyXG4gICAgICAgIHRoaXMudGltZXNVcFVpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2hvd1dpbm5lcnMoKTtcclxuICAgIH0sXHJcbiAgICBvcGVuU3BlY3RhdGVVaSgpIHtcclxuICAgICAgICB0aGlzLndpbm5lckNhbnZhLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVVSS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHNob3dFbW9qaXMoKSB7XHJcbiAgICAgICAgdGhpcy5lbW9qaUJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBoaWRlRW1vamlzKCkge1xyXG4gICAgICAgIHRoaXMuZW1vamlCdXR0b24uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgc2VwY3RhdGVQcmV2KCkge1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCAtPTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlY3RhdGVJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICBzcGVjdGF0ZU5leHQoKSB7XHJcbiAgICAgICAgLy8gc3BlY3RhdGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICB0aGlzLnNwZWN0YXRlSW5kZXggKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVjdGF0ZUluZGV4ID49IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRmluaXNoZWQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIjAvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXN0YW5jZSA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLmVuZFBvc2l0aW9uLnggLSB0aGlzLnBsYXllci54KSwgMikgKyBNYXRoLnBvdygodGhpcy5lbmRQb3NpdGlvbi55IC0gdGhpcy5wbGF5ZXIueSksIDIpKSAvIDEwKTtcclxuICAgICAgICAgICAgLy90aGlzLmRpc3RhbmNlVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuZGlzdGFuY2UgKyBcIiBtXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vYmlsZUNvbnRyb2xsZXIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcc3RvcnlNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFuZWwxIiwiTm9kZSIsInBhbmVsMiIsInBhbmVsMyIsInBhbmVsNCIsInBhbmVsNSIsInNoYWtlIiwicmFiYml0IiwidGV4dCIsIkxhYmVsIiwidGV4dEFyZWEiLCJzaG93VGV4dFNwZWVkIiwic3BlZWNoMSIsInNwZWVjaDIiLCJzcGVlY2gzIiwic3BlZWNoNCIsInNwZWVjaDUiLCJzcGVlY2g2IiwidGhlQ2hhciIsInRleHRJbmRleCIsInRoZVRleHRBIiwiY29vbE5vZGUiLCJ0aGFua3MiLCJzaG93Q2hhciIsInN0cmluZyIsInJldmVhbFRleHQiLCJ0aGVUZXh0IiwiaSIsImxlbmd0aCIsInNjaGVkdWxlT25jZSIsInNraXAiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIm9uTG9hZCIsImNvbnNvbGUiLCJsb2ciLCJvcGFjaXR5IiwidHdlZW4iLCJ0byIsImVhc2luZyIsInN0YXJ0IiwiYWN0aXZlIiwic2NhbGVYIiwic2NhbGVZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLLElBREg7QUFFUkMsSUFBQUEsTUFBTSxFQUFFTixFQUFFLENBQUNLLElBRkg7QUFHUkUsSUFBQUEsTUFBTSxFQUFFUCxFQUFFLENBQUNLLElBSEg7QUFJUkcsSUFBQUEsTUFBTSxFQUFFUixFQUFFLENBQUNLLElBSkg7QUFLUkksSUFBQUEsTUFBTSxFQUFFVCxFQUFFLENBQUNLLElBTEg7QUFNUkssSUFBQUEsS0FBSyxFQUFFVixFQUFFLENBQUNLLElBTkY7QUFPUk0sSUFBQUEsTUFBTSxFQUFFWCxFQUFFLENBQUNLLElBUEg7QUFRUk8sSUFBQUEsSUFBSSxFQUFFWixFQUFFLENBQUNhLEtBUkQ7QUFTUkMsSUFBQUEsUUFBUSxFQUFFZCxFQUFFLENBQUNLLElBVEw7QUFVUlUsSUFBQUEsYUFBYSxFQUFDLEdBVk47QUFZUkMsSUFBQUEsT0FBTyxFQUFFLG9DQVpEO0FBYVJDLElBQUFBLE9BQU8sRUFBRSw2RUFiRDtBQWNSQyxJQUFBQSxPQUFPLEVBQUUsNEZBZEQ7QUFlUkMsSUFBQUEsT0FBTyxFQUFFLGtKQWZEO0FBZ0JSQyxJQUFBQSxPQUFPLEVBQUUsaUVBaEJEO0FBaUJSQyxJQUFBQSxPQUFPLEVBQUUsOEJBakJEO0FBa0JSQyxJQUFBQSxPQUFPLEVBQUUsR0FsQkQ7QUFtQlJDLElBQUFBLFNBQVMsRUFBRSxDQW5CSDtBQW9CUkMsSUFBQUEsUUFBUSxFQUFFLEVBcEJGO0FBc0JSQyxJQUFBQSxRQUFRLEVBQUV6QixFQUFFLENBQUNLLElBdEJMO0FBdUJScUIsSUFBQUEsTUFBTSxFQUFFMUIsRUFBRSxDQUFDSztBQXZCSCxHQUhQO0FBNkJMc0IsRUFBQUEsUUE3Qkssc0JBNkJNO0FBQ1AsU0FBS2YsSUFBTCxDQUFVZ0IsTUFBVixJQUFvQixLQUFLTixPQUF6QjtBQUNILEdBL0JJO0FBZ0NMO0FBQ0FPLEVBQUFBLFVBakNLLHNCQWlDTUMsT0FqQ04sRUFpQ2U7QUFDaEIsU0FBS2xCLElBQUwsQ0FBVWdCLE1BQVYsR0FBbUIsRUFBbkI7QUFDQSxTQUFLTCxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQk0sT0FBaEI7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxPQUFPLENBQUNFLE1BQTVCLEVBQW9DRCxDQUFDLEVBQXJDLEVBQXlDO0FBQ3JDLFdBQUtFLFlBQUwsQ0FBa0IsWUFBWTtBQUMxQixZQUFJLEtBQUtWLFNBQUwsR0FBaUIsS0FBS0MsUUFBTCxDQUFjUSxNQUFuQyxFQUEyQztBQUN2QyxlQUFLcEIsSUFBTCxDQUFVZ0IsTUFBVixJQUFvQixLQUFLSixRQUFMLENBQWMsS0FBS0QsU0FBbkIsQ0FBcEI7QUFDQSxlQUFLQSxTQUFMLElBQWtCLENBQWxCO0FBQ0g7QUFDSixPQUxELEVBS0csS0FBS1IsYUFBTCxHQUFxQmdCLENBTHhCO0FBTUg7QUFFSixHQTlDSTtBQStDTEcsRUFBQUEsSUEvQ0ssa0JBK0NFO0FBQ0hsQyxJQUFBQSxFQUFFLENBQUNtQyxRQUFILENBQVlDLFNBQVosQ0FBc0IsTUFBdEI7QUFDSCxHQWpESTtBQWtETEMsRUFBQUEsTUFsREssb0JBa0RJO0FBQ0xDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQUt2QixPQUFMLENBQWEsQ0FBYixDQUFaO0FBQ0EsU0FBS1osTUFBTCxDQUFZb0MsT0FBWixHQUFzQixDQUF0QjtBQUNBLFNBQUtsQyxNQUFMLENBQVlrQyxPQUFaLEdBQXNCLENBQXRCO0FBQ0EsU0FBS2pDLE1BQUwsQ0FBWWlDLE9BQVosR0FBc0IsQ0FBdEI7QUFDQSxTQUFLaEMsTUFBTCxDQUFZZ0MsT0FBWixHQUFzQixDQUF0QjtBQUNBLFNBQUsvQixNQUFMLENBQVkrQixPQUFaLEdBQXNCLENBQXRCO0FBQ0EsU0FBSzdCLE1BQUwsQ0FBWTZCLE9BQVosR0FBc0IsQ0FBdEI7QUFDQSxTQUFLMUIsUUFBTCxDQUFjMEIsT0FBZCxHQUF3QixDQUF4QjtBQUNBLFNBQUtmLFFBQUwsQ0FBY2UsT0FBZCxHQUF3QixDQUF4QjtBQUNBLFNBQUs5QixLQUFMLENBQVc4QixPQUFYLEdBQXFCLENBQXJCO0FBRUF4QyxJQUFBQSxFQUFFLENBQUN5QyxLQUFILENBQVMsS0FBS3JDLE1BQWQsRUFBc0JzQyxFQUF0QixDQUF5QixDQUF6QixFQUE0QjtBQUFFRixNQUFBQSxPQUFPLEVBQUU7QUFBWCxLQUE1QixFQUE4QztBQUFFRyxNQUFBQSxNQUFNLEVBQUU7QUFBVixLQUE5QyxFQUFxRUMsS0FBckU7QUFFQSxTQUFLWCxZQUFMLENBQWtCLFlBQVk7QUFDMUJqQyxNQUFBQSxFQUFFLENBQUN5QyxLQUFILENBQVMsS0FBS25DLE1BQWQsRUFBc0JvQyxFQUF0QixDQUF5QixDQUF6QixFQUE0QjtBQUFFRixRQUFBQSxPQUFPLEVBQUU7QUFBWCxPQUE1QixFQUE4QztBQUFFRyxRQUFBQSxNQUFNLEVBQUU7QUFBVixPQUE5QyxFQUFxRUMsS0FBckU7QUFDSCxLQUZELEVBRUcsQ0FGSDtBQUlBLFNBQUtYLFlBQUwsQ0FBa0IsWUFBWTtBQUMxQmpDLE1BQUFBLEVBQUUsQ0FBQ3lDLEtBQUgsQ0FBUyxLQUFLbEMsTUFBZCxFQUFzQm1DLEVBQXRCLENBQXlCLENBQXpCLEVBQTRCO0FBQUVGLFFBQUFBLE9BQU8sRUFBRTtBQUFYLE9BQTVCLEVBQThDO0FBQUVHLFFBQUFBLE1BQU0sRUFBRTtBQUFWLE9BQTlDLEVBQXFFQyxLQUFyRTtBQUNILEtBRkQsRUFFRyxDQUZIO0FBSUEsU0FBS1gsWUFBTCxDQUFrQixZQUFZO0FBQzFCLFdBQUs3QixNQUFMLENBQVl5QyxNQUFaLEdBQXFCLEtBQXJCO0FBQ0EsV0FBS3ZDLE1BQUwsQ0FBWXVDLE1BQVosR0FBcUIsS0FBckI7QUFDQSxXQUFLdEMsTUFBTCxDQUFZc0MsTUFBWixHQUFxQixLQUFyQjtBQUNBN0MsTUFBQUEsRUFBRSxDQUFDeUMsS0FBSCxDQUFTLEtBQUtqQyxNQUFkLEVBQXNCa0MsRUFBdEIsQ0FBeUIsQ0FBekIsRUFBNEI7QUFBRUYsUUFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBNUIsRUFBOEM7QUFBRUcsUUFBQUEsTUFBTSxFQUFFO0FBQVYsT0FBOUMsRUFBcUVDLEtBQXJFO0FBQ0gsS0FMRCxFQUtHLEVBTEg7QUFPQSxTQUFLWCxZQUFMLENBQWtCLFlBQVk7QUFDMUJqQyxNQUFBQSxFQUFFLENBQUN5QyxLQUFILENBQVMsS0FBS2hDLE1BQWQsRUFBc0JpQyxFQUF0QixDQUF5QixDQUF6QixFQUE0QjtBQUFFRixRQUFBQSxPQUFPLEVBQUU7QUFBWCxPQUE1QixFQUE4QztBQUFFRyxRQUFBQSxNQUFNLEVBQUU7QUFBVixPQUE5QyxFQUFxRUMsS0FBckU7QUFDQTVDLE1BQUFBLEVBQUUsQ0FBQ3lDLEtBQUgsQ0FBUyxLQUFLL0IsS0FBZCxFQUFxQmdDLEVBQXJCLENBQXdCLENBQXhCLEVBQTJCO0FBQUVGLFFBQUFBLE9BQU8sRUFBRTtBQUFYLE9BQTNCLEVBQTZDO0FBQUVHLFFBQUFBLE1BQU0sRUFBRTtBQUFWLE9BQTdDLEVBQW9FQyxLQUFwRTtBQUNILEtBSEQsRUFHRyxFQUhIO0FBS0EsU0FBS1gsWUFBTCxDQUFrQixZQUFZO0FBRTFCLFdBQUt6QixNQUFMLENBQVlxQyxNQUFaLEdBQXFCLEtBQXJCO0FBQ0EsV0FBS3BDLE1BQUwsQ0FBWW9DLE1BQVosR0FBcUIsS0FBckI7QUFDQSxXQUFLbkMsS0FBTCxDQUFXbUMsTUFBWCxHQUFvQixLQUFwQjtBQUNBN0MsTUFBQUEsRUFBRSxDQUFDeUMsS0FBSCxDQUFTLEtBQUs5QixNQUFkLEVBQXNCK0IsRUFBdEIsQ0FBeUIsQ0FBekIsRUFBNEI7QUFBRUYsUUFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBNUIsRUFBOEM7QUFBRUcsUUFBQUEsTUFBTSxFQUFFO0FBQVYsT0FBOUMsRUFBcUVDLEtBQXJFO0FBQ0E1QyxNQUFBQSxFQUFFLENBQUN5QyxLQUFILENBQVMsS0FBSzNCLFFBQWQsRUFBd0I0QixFQUF4QixDQUEyQixDQUEzQixFQUE4QjtBQUFFRixRQUFBQSxPQUFPLEVBQUU7QUFBWCxPQUE5QixFQUFnRDtBQUFFRyxRQUFBQSxNQUFNLEVBQUU7QUFBVixPQUFoRCxFQUF1RUMsS0FBdkU7QUFFSCxLQVJELEVBUUcsRUFSSDtBQVlBLFNBQUtYLFlBQUwsQ0FBa0IsWUFBWTtBQUMxQjtBQUNBLFdBQUtKLFVBQUwsQ0FBZ0IsS0FBS2IsT0FBckI7QUFDQSxXQUFLaUIsWUFBTCxDQUFrQixZQUFZO0FBQzFCO0FBQ0EsYUFBS0osVUFBTCxDQUFnQixLQUFLWixPQUFyQjtBQUNBLGFBQUtnQixZQUFMLENBQWtCLFlBQVk7QUFDMUI7QUFDQSxlQUFLSixVQUFMLENBQWdCLEtBQUtYLE9BQXJCO0FBQ0EsZUFBS2UsWUFBTCxDQUFrQixZQUFZO0FBQzFCO0FBQ0EsaUJBQUtKLFVBQUwsQ0FBZ0IsS0FBS1YsT0FBckI7QUFDQSxpQkFBS2MsWUFBTCxDQUFrQixZQUFZO0FBQzFCO0FBQ0EsbUJBQUtKLFVBQUwsQ0FBZ0IsS0FBS1QsT0FBckI7QUFDQSxtQkFBS2EsWUFBTCxDQUFrQixZQUFZO0FBQzFCO0FBQ0EscUJBQUtKLFVBQUwsQ0FBZ0IsS0FBS1IsT0FBckI7QUFFQSxxQkFBS1ksWUFBTCxDQUFrQixZQUFZO0FBQzFCakMsa0JBQUFBLEVBQUUsQ0FBQ3lDLEtBQUgsQ0FBUyxLQUFLaEIsUUFBZCxFQUF3QmlCLEVBQXhCLENBQTJCLENBQTNCLEVBQThCO0FBQUVGLG9CQUFBQSxPQUFPLEVBQUU7QUFBWCxtQkFBOUIsRUFBZ0Q7QUFBRUcsb0JBQUFBLE1BQU0sRUFBRTtBQUFWLG1CQUFoRCxFQUF1RUMsS0FBdkUsR0FEMEIsQ0FHMUI7O0FBQ0EsdUJBQUtYLFlBQUwsQ0FBa0IsWUFBWTtBQUMxQmpDLG9CQUFBQSxFQUFFLENBQUN5QyxLQUFILENBQVMsS0FBS2YsTUFBZCxFQUFzQmdCLEVBQXRCLENBQXlCLENBQXpCLEVBQTRCO0FBQUVJLHNCQUFBQSxNQUFNLEVBQUUsR0FBVjtBQUFlQyxzQkFBQUEsTUFBTSxFQUFFO0FBQXZCLHFCQUE1QixFQUEwRDtBQUFFSixzQkFBQUEsTUFBTSxFQUFFO0FBQVYscUJBQTFELEVBQWlGQyxLQUFqRixHQUQwQixDQUcxQjs7QUFDQSx5QkFBS1gsWUFBTCxDQUFrQixZQUFZO0FBQzFCakMsc0JBQUFBLEVBQUUsQ0FBQ21DLFFBQUgsQ0FBWUMsU0FBWixDQUFzQixNQUF0QjtBQUNILHFCQUZELEVBRUcsQ0FGSDtBQUdILG1CQVBELEVBT0csQ0FQSDtBQVFILGlCQVpELEVBWUcsQ0FaSDtBQWFILGVBakJELEVBaUJHLENBakJIO0FBa0JILGFBckJELEVBcUJHLEVBckJIO0FBc0JILFdBekJELEVBeUJHLENBekJIO0FBMEJILFNBN0JELEVBNkJHLENBN0JIO0FBOEJILE9BakNELEVBaUNHLENBakNIO0FBa0NILEtBckNELEVBcUNHLEVBckNIO0FBMkNILEdBM0lJLENBNklMOztBQTdJSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGFuZWwxOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsMjogY2MuTm9kZSxcclxuICAgICAgICBwYW5lbDM6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFuZWw0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsNTogY2MuTm9kZSxcclxuICAgICAgICBzaGFrZTogY2MuTm9kZSxcclxuICAgICAgICByYWJiaXQ6IGNjLk5vZGUsXHJcbiAgICAgICAgdGV4dDogY2MuTGFiZWwsXHJcbiAgICAgICAgdGV4dEFyZWE6IGNjLk5vZGUsXHJcbiAgICAgICAgc2hvd1RleHRTcGVlZDowLjEsXHJcblxyXG4gICAgICAgIHNwZWVjaDE6IFwiQWxpY2UsIHdlbGNvbWUgYmFjayB0byBXb25kZXJsYW5kIVwiLFxyXG4gICAgICAgIHNwZWVjaDI6IFwiIEhvd2V2ZXIsIEkgbXVzdCB0ZWxsIHlvdSB0aGF0IHRoaXMgd29ybGQgaXMgbm8gbG9uZ2VyIHRoZSBzYW1lIGFzIGJlZm9yZS4gXCIsXHJcbiAgICAgICAgc3BlZWNoMzogXCJUaGluZ3MgaGF2ZSBjaGFuZ2VkIGFuZCBub3cgeW91IGFyZW4ndCB0aGUgb25seSBBbGljZS4gSW4gZmFjdCwgdGhlcmUgYXJlIHRvbnMgb2YgQWxpY2VzLiBcIixcclxuICAgICAgICBzcGVlY2g0OiBcIlRoZSBSZWQgUXVlZW4gaXMgZm9yY2luZyB0aGVtIHRvIGNvbXBldGUgYWdhaW5zdCBlYWNoIG90aGVyIGluIGEgcmFjZS5JZiB5b3UgcmVhY2ggdGhlIGVuZCwgeW91IHdpbGwgZ2FpbiBjcm93bnMuTG9zZSBhbmQgeW91IG1pZ2h0IGxvc2UgY3Jvd25zLlwiLFxyXG4gICAgICAgIHNwZWVjaDU6IFwiSWYgeW91IHdpbiBlbm91Z2ggY3Jvd25zLCB5b3UgbWF5IGJlIGFibGUgdG8gZXNjYXBlIFdvbmRlcmxhbmQuXCIsXHJcbiAgICAgICAgc3BlZWNoNjogXCJJIHdpc2ggeW91IHRoZSBiZXN0IG9mIGx1Y2suXCIsXHJcbiAgICAgICAgdGhlQ2hhcjogJ2EnLFxyXG4gICAgICAgIHRleHRJbmRleDogMCxcclxuICAgICAgICB0aGVUZXh0QTogXCJcIixcclxuXHJcbiAgICAgICAgY29vbE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgdGhhbmtzOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93Q2hhcigpIHtcclxuICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlQ2hhcjtcclxuICAgIH0sXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuICAgIHJldmVhbFRleHQodGhlVGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGV4dEluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLnRoZVRleHRBID0gdGhlVGV4dDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoZVRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dEluZGV4IDwgdGhpcy50aGVUZXh0QS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlVGV4dEFbdGhpcy50ZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEluZGV4ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuc2hvd1RleHRTcGVlZCAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBza2lwKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3BlZWNoMVswXSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbDEub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDIub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDMub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5yYWJiaXQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0QXJlYS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB0aGlzLmNvb2xOb2RlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHRoaXMuc2hha2Uub3BhY2l0eSA9IDA7XHJcblxyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWwxKS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5wYW5lbDIpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYy50d2Vlbih0aGlzLnBhbmVsMykudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgIH0sIDYpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwxLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsMi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5wYW5lbDMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw0KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgfSwgMTQpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw1KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMuc2hha2UpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAxOCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFuZWw0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsNS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zaGFrZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5yYWJiaXQpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy50ZXh0QXJlYSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LCAyNik7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3NwZWVjaDFcclxuICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vc3BlZWNoMlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2gzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwZWVjaDRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BlZWNoNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2g2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy5jb29sTm9kZSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhbmt5b3VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy50aGFua3MpLnRvKDIsIHsgc2NhbGVYOiAwLjksIHNjYWxlWTogMC45IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3N3aXRjaCBzY2VuZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDgpO1xyXG4gICAgICAgICAgICAgICAgfSwgOCk7XHJcbiAgICAgICAgICAgIH0sIDYpO1xyXG4gICAgICAgIH0sIDI3KTtcclxuXHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
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
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");
      var jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");
      var potionButton = cc.find("Canvas/UI/MOBILE/POTION");
      var cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");
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
    var emoji = this.emojis.getChildByName(type); //no spam error

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
      //cc.find("Canvas/mainCamera").getComponent("cameraFollow").xOffsetPlayer = 0;
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
        if (this.grounded) this.jump();
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
            cc.find("Canvas/UI/MOBILE").active = true;
            this.joystickBall = cc.find("Canvas/UI/MOBILE/JOYSTICK/BALL");
            var joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");
            var jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");
            var potionButton = cc.find("Canvas/UI/MOBILE/POTION");
            var cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");
            joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
            joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
            joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
            joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
            jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
            potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
            cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          } else {
            this.joystickBall = cc.find("Canvas/UI/MOBILE/JOYSTICK/BALL");

            var _joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");

            var _jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");

            var _potionButton = cc.find("Canvas/UI/MOBILE/POTION");

            var _cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");

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

      cc.director.getPhysicsManager().gravity = cc.v2(0, -this.deltaTime * 1000);
      this.node.getComponent(cc.RigidBody).gravityScale = this.deltaTime * 3000;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92ZW1lbnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJqdW1wSGVpZ2h0Iiwic21hbGxKdW1wSGVpZ2h0IiwianVtcER1cmF0aW9uIiwibW92ZVNwZWVkIiwic21hbGxNb3ZlU3BlZWQiLCJpc1BsYXllciIsImNsaWVudFNjcmlwdCIsIk5vZGUiLCJ4U3BlZWQiLCJ5U3BlZWQiLCJsb2NhbENlbnRlciIsImdyb3VuZGVyIiwiYm9keSIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsImRlbHRhVGltZSIsImZhbGxNdWx0aXBsaWVyIiwiZ3Jvd2luZyIsIm1heFNjYWxlIiwibWluU2NhbGUiLCJhdGVDYWtlIiwiYXRlUG90aW9uIiwiZ3JvdW5kZWQiLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJqb3lzdGlja01heCIsImpveXN0aWNrVmVjdG9yIiwidjIiLCJqb3lzdGlja0JhbGwiLCJlbW9qaXMiLCJ0aW1lU3RlcCIsInN0YXJ0VGltZXIiLCJwbGF5aW5nQW5pbWF0aW9uIiwiam95c3RpY2tNb3ZpbmciLCJwbGF5ZWRGYWxsaW5nIiwic291bmRDb250cm9sbGVyIiwic291bmRzIiwiYnVzeSIsInRvdGFsIiwic3VtIiwiZGlzYWJsZSIsInN5cyIsInBsYXRmb3JtIiwiV0VDSEFUX0dBTUUiLCJqb3lzdGljayIsImZpbmQiLCJqdW1wQnV0dG9uIiwicG90aW9uQnV0dG9uIiwiY2FrZUJ1dHRvbiIsIm9mZiIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwiam95c3RpY2tTdGFydCIsIlRPVUNIX01PVkUiLCJqb3lzdGlja01vdmUiLCJUT1VDSF9FTkQiLCJqb3lzdGlja0VuZCIsIlRPVUNIX0NBTkNFTCIsImp1bXAiLCJzaHJpbmsiLCJncm93Iiwic3lzdGVtRXZlbnQiLCJTeXN0ZW1FdmVudCIsIktFWV9ET1dOIiwib25LZXlEb3duIiwiS0VZX1VQIiwib25LZXlVcCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJSaWdpZEJvZHkiLCJncmF2aXR5U2NhbGUiLCJsaW5lYXJWZWxvY2l0eSIsIlZlYzIiLCJwbGF5RW1vamkiLCJ0eXBlIiwiZW1vamkiLCJnZXRDaGlsZEJ5TmFtZSIsImFjdGl2ZSIsInR3ZWVuIiwidG8iLCJwb3NpdGlvbiIsIngiLCJNYXRoIiwiY2VpbCIsInJhbmRvbSIsInJvdW5kIiwieSIsImVhc2luZyIsInN0YXJ0IiwiZGVsYXkiLCJjYWxsIiwib25CZWdpbkNvbnRhY3QiLCJjb250YWN0Iiwic2VsZiIsIm90aGVyIiwidGFnIiwiZ3JvdXAiLCJtb3ZpbmciLCJwbGF5Iiwic2NoZWR1bGVPbmNlIiwic2NhbGVZIiwib25FbmRDb250YWN0IiwianVtcFJ1bkFjdGlvbiIsImp1bXBVcCIsImJ5IiwianVtcERvd24iLCJzZXF1ZW5jZSIsIm1vdmVSaWdodCIsInNjYWxlWCIsImFuaW1TdGF0ZSIsIndyYXBNb2RlIiwiV3JhcE1vZGUiLCJMb29wIiwic2VuZFBsYXllclN0YXRlIiwibW92ZUxlZnQiLCJzdG9wIiwic3RvcFgiLCJzdG9wWSIsImV2ZW50Iiwia2V5Q29kZSIsIm1hY3JvIiwiS0VZIiwidyIsImEiLCJkIiwiZSIsInEiLCJzcGFjZSIsIm9uTG9hZCIsIk1hcCIsImkiLCJnZXRDb21wb25lbnRzIiwiQXVkaW9Tb3VyY2UiLCJsZW5ndGgiLCJjbGlwIiwibmFtZSIsIm9uRGVzdHJveSIsInRvdWNoUG9zIiwiZ2V0TG9jYXRpb24iLCJvdXQiLCJDYW1lcmEiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJsb2NhbFRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJsaW1pdEpveXN0aWNrIiwic2V0Sm95c3RpY2tCYWxsUG9zIiwiam95c3RpY2tNb3ZlUGxheWVyIiwidG91Y2giLCJnZXRUb3VjaGVzIiwiWkVSTyIsInBvcyIsInNldFBvc2l0aW9uIiwiam95c3RpY2tWZWMiLCJpbnB1dE1hZyIsIm1hZyIsIm11bFNlbGYiLCJ1cGRhdGUiLCJkdCIsImdldExvY2FsQ2VudGVyIiwiZ2FtZVN0YXJ0ZWQiLCJwbGF5ZXJJZCIsImFicyIsInJiIiwib24iLCJ5T2Zmc2V0UGxheWVyIiwieE9mZnNldFBsYXllciIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljc01hbmFnZXIiLCJncmF2aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsVUFBVSxFQUFFLENBREo7QUFFUkMsSUFBQUEsZUFBZSxFQUFFLENBRlQ7QUFHUkMsSUFBQUEsWUFBWSxFQUFFLENBSE47QUFJUkMsSUFBQUEsU0FBUyxFQUFFLENBSkg7QUFLUkMsSUFBQUEsY0FBYyxFQUFFLENBTFI7QUFNUkMsSUFBQUEsUUFBUSxFQUFFLEtBTkY7QUFPUkMsSUFBQUEsWUFBWSxFQUFFVixFQUFFLENBQUNXLElBUFQ7QUFRUkMsSUFBQUEsTUFBTSxFQUFFLENBUkE7QUFTUkMsSUFBQUEsTUFBTSxFQUFFLENBVEE7QUFVUkMsSUFBQUEsV0FBVyxFQUFFLENBVkw7QUFXUkMsSUFBQUEsUUFBUSxFQUFFZixFQUFFLENBQUNXLElBWEw7QUFZUkssSUFBQUEsSUFBSSxFQUFFaEIsRUFBRSxDQUFDVyxJQVpEO0FBYVJNLElBQUFBLFNBQVMsRUFBRWpCLEVBQUUsQ0FBQ2tCLFNBYk47QUFjUkMsSUFBQUEsU0FBUyxFQUFFLENBZEg7QUFlUkMsSUFBQUEsY0FBYyxFQUFFLEdBZlI7QUFnQlJDLElBQUFBLE9BQU8sRUFBRSxDQWhCRDtBQWlCUkMsSUFBQUEsUUFBUSxFQUFFLENBakJGO0FBa0JSQyxJQUFBQSxRQUFRLEVBQUUsR0FsQkY7QUFtQlJDLElBQUFBLE9BQU8sRUFBRSxLQW5CRDtBQW9CUkMsSUFBQUEsU0FBUyxFQUFFLEtBcEJIO0FBcUJSQyxJQUFBQSxRQUFRLEVBQUUsS0FyQkY7QUFzQlJDLElBQUFBLFdBQVcsRUFB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c291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAganVtcEhlaWdodDogMCxcclxuICAgICAgICBzbWFsbEp1bXBIZWlnaHQ6IDAsXHJcbiAgICAgICAganVtcER1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1vdmVTcGVlZDogMCxcclxuICAgICAgICBzbWFsbE1vdmVTcGVlZDogMCxcclxuICAgICAgICBpc1BsYXllcjogZmFsc2UsXHJcbiAgICAgICAgY2xpZW50U2NyaXB0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHhTcGVlZDogMCxcclxuICAgICAgICB5U3BlZWQ6IDAsXHJcbiAgICAgICAgbG9jYWxDZW50ZXI6IDAsXHJcbiAgICAgICAgZ3JvdW5kZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgYm9keTogY2MuTm9kZSxcclxuICAgICAgICBhbmltYXRpb246IGNjLkFuaW1hdGlvbixcclxuICAgICAgICBkZWx0YVRpbWU6IDAsXHJcbiAgICAgICAgZmFsbE11bHRpcGxpZXI6IDIuNSxcclxuICAgICAgICBncm93aW5nOiAwLFxyXG4gICAgICAgIG1heFNjYWxlOiAxLFxyXG4gICAgICAgIG1pblNjYWxlOiAwLjUsXHJcbiAgICAgICAgYXRlQ2FrZTogZmFsc2UsXHJcbiAgICAgICAgYXRlUG90aW9uOiBmYWxzZSxcclxuICAgICAgICBncm91bmRlZDogZmFsc2UsXHJcbiAgICAgICAgbW92aW5nUmlnaHQ6IGZhbHNlLFxyXG4gICAgICAgIG1vdmluZ0xlZnQ6IGZhbHNlLFxyXG4gICAgICAgIGpveXN0aWNrTWF4OiA2OSxcclxuICAgICAgICBqb3lzdGlja1ZlY3RvcjogY2MudjIoKSxcclxuICAgICAgICBqb3lzdGlja0JhbGw6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVTdGVwOiAwLFxyXG4gICAgICAgIHN0YXJ0VGltZXI6IGZhbHNlLFxyXG4gICAgICAgIHBsYXlpbmdBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgam95c3RpY2tNb3Zpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBsYXllZEZhbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIHNvdW5kQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBzb3VuZHM6IG51bGwsXHJcbiAgICAgICAgYnVzeTogZmFsc2UsXHJcblxyXG4gICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgIHN1bTogMCxcclxuICAgIH0sXHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KT1lTVElDS1wiKTtcclxuICAgICAgICAgICAgbGV0IGp1bXBCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIik7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qb3lzdGlja1N0YXJ0LCB0aGlzKTtcclxuICAgICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5qb3lzdGlja0VuZCwgdGhpcyk7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICBqdW1wQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5zaHJpbmssIHRoaXMpO1xyXG4gICAgICAgICAgICBjYWtlQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gMDtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHBsYXlFbW9qaSh0eXBlKSB7XHJcbiAgICAgICAgbGV0IGVtb2ppID0gdGhpcy5lbW9qaXMuZ2V0Q2hpbGRCeU5hbWUodHlwZSk7XHJcbiAgICAgICAgLy9ubyBzcGFtIGVycm9yXHJcbiAgICAgICAgaWYgKCEgZW1vamkuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGVtb2ppLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKGVtb2ppKS50bygwLjUsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS54ICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwKSAqIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID8gMSA6IC0xKSwgdGhpcy5ub2RlLnkgKyAyMDAwKSB9LCB7IGVhc2luZzogJ3NpbmVPdXRJbicgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4oZW1vamkpLmRlbGF5KDEpLnRvKDAsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLngsIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLnkpIH0pLmNhbGwoKCkgPT4geyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9KS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL3RoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9LCAyKTtcclxuICAgIH0sXHJcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmLCBvdGhlcikge1xyXG5cclxuICAgICAgICBpZiAoc2VsZi50YWcgPT0gMiAmJiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVudmlyb25tZW50XCIgfHwgb3RoZXIubm9kZS5ncm91cCA9PSBcIm1vdmluZ1BsYXRmb3JtXCIpKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL3N0b3AgZmFsbGluZyBhbmltYXRpb25cclxuICAgICAgICAgICAgLy90aGlzLmFuaW1hdGlvbi5zdG9wKFwiZmFsbGluZ1wiKTtcclxuICAgICAgICAgICAgLy90aGlzLnBsYXllZEZhbGxpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vcGxheSAgYW5pbWF0aW9uc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImxhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BsYXllcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kc1tcImxhbmRpbmdcIl0ucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jaGFuZ2Ugc3BlZWQgaWYgZGlmZmVyZW50IHNpemVcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb25FbmRDb250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgaWYgKHNlbGYudGFnID09IDIpXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBqdW1wUnVuQWN0aW9uKCkge1xyXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogMzAwIH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSk7XHJcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MudHdlZW4oKS5ieSgxLCB7IHk6IC0zMDAgfSwgeyBlYXNpbmc6ICdzaW5lSW4nIH0pO1xyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMubm9kZSkuc2VxdWVuY2UoanVtcFVwLCBqdW1wRG93bikuc3RhcnQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZVJpZ2h0KCkge1xyXG4gICBcclxuICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJvZHkuc2NhbGVYID0gLTE7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgYW5pbVN0YXRlLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlTGVmdCgpIHtcclxuICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9keS5zY2FsZVggPSAxO1xyXG4gICAgICAgIGlmICghdGhpcy5tb3ZpbmcgJiYgdGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbVN0YXRlID0gdGhpcy5hbmltYXRpb24ucGxheShcIndhbGtcIik7XHJcbiAgICAgICAgICAgIGFuaW1TdGF0ZS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55KTtcclxuICAgICAgICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwibGVmdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGp1bXAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291bmRzW1wianVtcFwiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGlmZmVyZW50IGp1bXAgaGVpZ2h0cyBkZXBlbmRpbmcgb24gc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuc2NhbGVZID49IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuanVtcEhlaWdodCAqIHRoaXMuZGVsdGFUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuc21hbGxKdW1wSGVpZ2h0ICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lciA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImp1bXBcIik7ICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWCgpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIC8vY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoMCwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2hyaW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlUG90aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW1wiZHJpbmtpbmcyXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBncm93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlQ2FrZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tcImVhdGluZ1wiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYTpcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5kOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5lOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm93KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucTpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hyaW5rKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuc3BhY2U6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBvbktleVVwKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS53KSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWSgpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCAtIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBjYy5tYWNyby5LRVkuYSkge1xyXG4gICAgICAgICAgICAvL3RoaXMuc3RvcFgoKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSBjYy5tYWNyby5LRVkuZCkge1xyXG4gICAgICAgICAgICAvL3RoaXMuc3RvcFgoKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKTtcclxuICAgICAgICB0aGlzLmNsaWVudFNjcmlwdCA9IGNjLmZpbmQoXCJzeXN0ZW1cIik7XHJcblxyXG4gICAgICAgIHRoaXMuc291bmRzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIC8vbWFwIHNvdW5kcyB0byB0aGVpciBhdWRpb1NvdXJjZVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSlbaV0uY2xpcC5uYW1lXSA9IHRoaXMuc291bmRDb250cm9sbGVyLmdldENvbXBvbmVudHMoY2MuQXVkaW9Tb3VyY2UpW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgb25EZXN0cm95KCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgam95c3RpY2tTdGFydChldmVudCkge1xyXG4gICAgICAgIGxldCB0b3VjaFBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IG91dCA9IGNjLnYyKCk7XHJcbiAgICAgICAgLy91c2UgY2FtZXJhIHRvIGdldCB0b3VjaCBwb3NcclxuICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KGNjLkNhbWVyYSkuZ2V0U2NyZWVuVG9Xb3JsZFBvaW50KHRvdWNoUG9zLCBvdXQpO1xyXG4gICAgICAgIGxldCBsb2NhbFRvdWNoUG9zID0gdGhpcy5qb3lzdGlja0JhbGwucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKG91dCk7XHJcblxyXG4gICAgICAgIC8vbGltaXQgYmFsbCBzbyBpdCBjYW4ndCBsZWF2ZSBjaXJjbGVcclxuICAgICAgICB0aGlzLmxpbWl0Sm95c3RpY2sobG9jYWxUb3VjaFBvcyk7XHJcblxyXG4gICAgICAgIC8vY2hhbmdlIHBvcyBvZiBiYWxsIGFjY29yZGluZ2x5XHJcbiAgICAgICAgdGhpcy5zZXRKb3lzdGlja0JhbGxQb3MobG9jYWxUb3VjaFBvcyk7IFxyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBsb2NhbFRvdWNoUG9zO1xyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92ZVBsYXllcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja01vdmUoZXZlbnQpIHtcclxuICAgICAgICBsZXQgdG91Y2ggPSBldmVudC5nZXRUb3VjaGVzKClbMF07XHJcbiAgICAgICAgbGV0IHRvdWNoUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcclxuICAgICAgICAvL3VzZSBjYW1lcmEgdG8gZ2V0IHRvdWNoIHBvc1xyXG4gICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoY2MuQ2FtZXJhKS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodG91Y2hQb3MsIG91dCk7XHJcbiAgICAgICAgbGV0IGxvY2FsVG91Y2hQb3MgPSB0aGlzLmpveXN0aWNrQmFsbC5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIob3V0KTtcclxuXHJcbiAgICAgICAgLy9saW1pdCBiYWxsIHNvIGl0IGNhbid0IGxlYXZlIGNpcmNsZVxyXG4gICAgICAgIHRoaXMubGltaXRKb3lzdGljayhsb2NhbFRvdWNoUG9zKTtcclxuXHJcbiAgICAgICAgLy9jaGFuZ2UgcG9zIG9mIGJhbGwgYWNjb3JkaW5nbHlcclxuICAgICAgICB0aGlzLnNldEpveXN0aWNrQmFsbFBvcyhsb2NhbFRvdWNoUG9zKTtcclxuICAgICAgICB0aGlzLmpveXN0aWNrVmVjdG9yID0gbG9jYWxUb3VjaFBvcztcclxuXHJcbiAgICAgICAgdGhpcy5qb3lzdGlja01vdmVQbGF5ZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgam95c3RpY2tNb3ZlUGxheWVyKCkge1xyXG4gICAgICAgIC8vbW92ZSBwbGF5ZXIgaG9yaXpvbnRhbGx5XHJcbiAgICAgICAgaWYgKHRoaXMuam95c3RpY2tWZWN0b3IueCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0KCk7XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5qb3lzdGlja1ZlY3Rvci54IDwgMClcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92aW5nID0gdHJ1ZTtcclxuICAgICAgICAvL21vdmUgcGxheWVyIHZlcnRpY2FsbHlcclxuICAgICAgICAvL2lmICh0aGlzLmpveXN0aWNrVmVjdG9yLnkgPiAxMClcclxuICAgICAgICAvLyAgICB0aGlzLmp1bXAoKVxyXG4gICAgfSxcclxuICAgIGpveXN0aWNrRW5kKCkge1xyXG4gICAgICAgIC8vc3RvcCBwbGF5ZXJcclxuICAgICAgICBpZiAodGhpcy5qb3lzdGlja01vdmluZykge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmpveXN0aWNrTW92aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrVmVjdG9yID0gY2MuVmVjMi5aRVJPO1xyXG4gICAgICAgIHRoaXMuc2V0Sm95c3RpY2tCYWxsUG9zKGNjLlZlYzIuWkVSTyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldEpveXN0aWNrQmFsbFBvcyhwb3MpIHtcclxuICAgICAgICB0aGlzLmpveXN0aWNrQmFsbC5zZXRQb3NpdGlvbihwb3MpO1xyXG4gICAgfSxcclxuXHJcbiAgICBsaW1pdEpveXN0aWNrKGpveXN0aWNrVmVjKSB7XHJcbiAgICAgICAgbGV0IGlucHV0TWFnID0gam95c3RpY2tWZWMubWFnKCk7XHJcbiAgICAgICAgaWYgKGlucHV0TWFnID4gdGhpcy5qb3lzdGlja01heCkge1xyXG4gICAgICAgICAgICBqb3lzdGlja1ZlYy5tdWxTZWxmKHRoaXMuam95c3RpY2tNYXggLyBpbnB1dE1hZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiBcclxuICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueDtcclxuICAgICAgICB0aGlzLnlTcGVlZCA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueTtcclxuICAgICAgICB0aGlzLmxvY2FsQ2VudGVyID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5nZXRMb2NhbENlbnRlcigpO1xyXG4gICAgICAgIHRoaXMuc3VtICs9IGR0O1xyXG4gICAgICAgIHRoaXMudG90YWwgKz0gMTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkICYmICF0aGlzLnBsYXlpbmdBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcInN0YW5kXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL2lmIChkdCA8IDAuMDIgJiYgZHQgPiAwLjAxKVxyXG4gICAgICAgIC8vdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuICAgICAgICBcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGR0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5nYW1lU3RhcnRlZCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5wbGF5ZXJJZCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL2RvIG5vdGhpbmdcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWx0YVRpbWUgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbHRhVGltZSA9IGR0O1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoTWF0aC5hYnMoZHQgLSAodGhpcy5zdW0gLyB0aGlzLnRvdGFsKSkgPCAwLjAzKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gZHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5wbGF5ZXJJZCA9PSB0aGlzLm5vZGUubmFtZSAmJiAhdGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNQbGF5ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByYiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NldCBtb2JpbGUgdG91Y2ggY29udHJvbCBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qb3lzdGlja0JhbGwgPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KT1lTVElDSy9CQUxMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KT1lTVElDS1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGp1bXBCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmpveXN0aWNrU3RhcnQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLmpveXN0aWNrTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5qb3lzdGlja0VuZCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5qb3lzdGlja0VuZCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1bXBCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuanVtcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdGlvbkJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5zaHJpbmssIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWtlQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmdyb3csIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpveXN0aWNrQmFsbCA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLL0JBTExcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqb3lzdGljayA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pVTVBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3Rpb25CdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYWtlQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgIC8vIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gZHQgKiAgICAgO1xyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkIDwgMCkge1xyXG4gICAgICAgIC8vICAgIC8vY29uc29sZS5sb2coY2MuVmVjMigwLCBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSkpO1xyXG4gICAgICAgIC8vICAgIC8vLmxvZyhjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSk7XHJcblxyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCB0aGlzLnlTcGVlZCArIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eS55KiB0aGlzLmRlbHRhVGltZSk7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkID4gMCAmJiAhanVtcCkge1xyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgKz0gY2MuVmVjMih0aGlzLnhTcGVlZCwgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAxICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvLyBncm93ID0gLTEgbWVhbnMgc2hyaW5pbmdcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQgJiYgIWNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIgfHwgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMilcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgKz0gZHQgKiAyMDA7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIDwgNTAgJiYgdGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciArPSBkdCAqIDIwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnhPZmZzZXRQbGF5ZXIgPiAtNTAgJiYgdGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jdXN0b20gZ3Jhdml0eVxyXG4gICAgICAgICAgICAvL2lmICghdGhpcy5ncm91bmRlZClcclxuICAgICAgICAgICAgLy8gICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwICogTWF0aC5hYnModGhpcy55U3BlZWQpICsgLTEwKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkdCAqIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5ID0gY2MudjIoMCwgLXRoaXMuZGVsdGFUaW1lICogMTAwMCk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5ncmF2aXR5U2NhbGUgPSB0aGlzLmRlbHRhVGltZSAqIDMwMDA7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vdmluZ1JpZ2h0ICYmICF0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BYKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ncm93aW5nID09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhTY2FsZSA+IHRoaXMubm9kZS5zY2FsZVkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVYICs9IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVZICs9IDAuMDUgKiBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIHBsYXllciB2ZWxvY2l0eSBpZiBvbiBncm91bmRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3Jvd2luZyA9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblNjYWxlIDwgdGhpcy5ub2RlLnNjYWxlWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVggLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVkgLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVjcmVhc2UgcGxheWVyIHZlbG9jaXR5IGlmIG9uIGdyb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcaGl0Q2hlY2tlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllciIsIk5vZGUiLCJkaWUiLCJnZXRDb21wb25lbnQiLCJpc1BsYXllciIsIlJpZ2lkQm9keSIsImxpbmVhclZlbG9jaXR5IiwiVmVjMiIsIngiLCJmaW5kIiwic3Bhd24iLCJ5IiwiZ3Jvd2luZyIsInN5cyIsInBsYXRmb3JtIiwiV0VDSEFUX0dBTUUiLCJ3eCIsInZpYnJhdGVTaG9ydCIsIndpbiIsIndvbiIsImFjdGl2ZSIsInNlbmRQbGF5ZXJTdGF0ZSIsImRpc2FibGUiLCJlbmFibGVkIiwiZ2V0Q2hpbGRCeU5hbWUiLCJBdWRpb1NvdXJjZSIsInBsYXkiLCJlYXRDYWtlIiwiY2FrZSIsImF0ZUNha2UiLCJzZW5kSXRlbVN0YXRlIiwiaWQiLCJkcmlua1BvdGlvbiIsInBvdGlvbiIsImF0ZVBvdGlvbiIsIm9wZW5DaGVzdCIsImNoZXN0Iiwic2V0Q2hlY2tQb2ludCIsImNoZWNrcG9pbnQiLCJBbmltYXRpb24iLCJvbkNvbGxpc2lvbkVudGVyIiwib3RoZXIiLCJzZWxmIiwibm9kZSIsImdyb3VwIiwidHlwZSIsIm9uTG9hZCIsImdldFBhcmVudCIsInVwZGF0ZSIsImR0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLO0FBREgsR0FIUDtBQU9MQyxFQUFBQSxHQVBLLGlCQU9DO0FBQ0YsUUFBSSxLQUFLRixNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNDLFFBQXpDLEVBQW1EO0FBQy9DLFdBQUtKLE1BQUwsQ0FBWUcsWUFBWixDQUF5QlAsRUFBRSxDQUFDUyxTQUE1QixFQUF1Q0MsY0FBdkMsR0FBd0RWLEVBQUUsQ0FBQ1csSUFBSCxDQUFRLENBQVIsRUFBVyxDQUFYLENBQXhEO0FBQ0EsV0FBS1AsTUFBTCxDQUFZUSxDQUFaLEdBQWdCWixFQUFFLENBQUNhLElBQUgsQ0FBUSxRQUFSLEVBQWtCTixZQUFsQixDQUErQixhQUEvQixFQUE4Q08sS0FBOUMsQ0FBb0RGLENBQXBFO0FBQ0EsV0FBS1IsTUFBTCxDQUFZVyxDQUFaLEdBQWdCZixFQUFFLENBQUNhLElBQUgsQ0FBUSxRQUFSLEVBQWtCTixZQUFsQixDQUErQixhQUEvQixFQUE4Q08sS0FBOUMsQ0FBb0RDLENBQXBFO0FBQ0EsV0FBS1gsTUFBTCxDQUFZRyxZQUFaLENBQXlCLFVBQXpCLEVBQXFDUyxPQUFyQyxHQUErQyxDQUEvQztBQUNBLFVBQUloQixFQUFFLENBQUNpQixHQUFILENBQU9DLFFBQVAsSUFBbUJsQixFQUFFLENBQUNpQixHQUFILENBQU9FLFdBQTlCLEVBQ0lDLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQixRQUFoQjtBQUNQO0FBQ0osR0FoQkk7QUFrQkxDLEVBQUFBLEdBbEJLLGlCQWtCQztBQUVGLFFBQUksS0FBS2xCLE1BQUwsQ0FBWUcsWUFBWixDQUF5QixVQUF6QixFQUFxQ0MsUUFBckMsSUFBaUQsQ0FBQ1IsRUFBRSxDQUFDYSxJQUFILENBQVEsUUFBUixFQUFrQk4sWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNnQixHQUEvRixFQUFvRztBQUNoR3ZCLE1BQUFBLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRLGtCQUFSLEVBQTRCVyxNQUE1QixHQUFxQyxLQUFyQztBQUNBeEIsTUFBQUEsRUFBRSxDQUFDYSxJQUFILENBQVEsUUFBUixFQUFrQk4sWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNnQixHQUF6QyxHQUErQyxJQUEvQztBQUNBdkIsTUFBQUEsRUFBRSxDQUFDYSxJQUFILENBQVEsUUFBUixFQUFrQk4sWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNrQixlQUF6QyxDQUF5RCxLQUF6RDtBQUNBLFdBQUtyQixNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNtQixPQUFyQztBQUNBLFdBQUtDLE9BQUwsR0FBZSxLQUFmO0FBQ0EzQixNQUFBQSxFQUFFLENBQUNhLElBQUgsQ0FBUSxRQUFSLEVBQWtCZSxjQUFsQixDQUFpQyxPQUFqQyxFQUEwQ0EsY0FBMUMsQ0FBeUQsS0FBekQsRUFBZ0VyQixZQUFoRSxDQUE2RVAsRUFBRSxDQUFDNkIsV0FBaEYsRUFBNkZDLElBQTdGO0FBQ0g7QUFDSixHQTVCSTtBQThCTEMsRUFBQUEsT0E5QkssbUJBOEJHQyxJQTlCSCxFQThCUztBQUNWLFFBQUksS0FBSzVCLE1BQUwsQ0FBWUcsWUFBWixDQUF5QixVQUF6QixFQUFxQ0MsUUFBekMsRUFBbUQ7QUFDL0MsV0FBS0osTUFBTCxDQUFZRyxZQUFaLENBQXlCLFVBQXpCLEVBQXFDMEIsT0FBckMsR0FBK0MsSUFBL0M7QUFDQWpDLE1BQUFBLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRLFFBQVIsRUFBa0JOLFlBQWxCLENBQStCLFFBQS9CLEVBQXlDMkIsYUFBekMsQ0FBdURGLElBQUksQ0FBQ3pCLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEI0QixFQUFqRixFQUFxRixNQUFyRixFQUE2RixNQUE3RixFQUFxRyxJQUFyRztBQUNBbkMsTUFBQUEsRUFBRSxDQUFDYSxJQUFILENBQVEsdUJBQVIsRUFBaUNXLE1BQWpDLEdBQTBDLElBQTFDO0FBR0g7QUFFSixHQXZDSTtBQXlDTFksRUFBQUEsV0F6Q0ssdUJBeUNPQyxNQXpDUCxFQXlDZTtBQUNoQixRQUFJLEtBQUtqQyxNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNDLFFBQXpDLEVBQW1EO0FBQy9DLFdBQUtKLE1BQUwsQ0FBWUcsWUFBWixDQUF5QixVQUF6QixFQUFxQytCLFNBQXJDLEdBQWlELElBQWpEO0FBQ0F0QyxNQUFBQSxFQUFFLENBQUNhLElBQUgsQ0FBUSxRQUFSLEVBQWtCTixZQUFsQixDQUErQixRQUEvQixFQUF5QzJCLGFBQXpDLENBQXVERyxNQUFNLENBQUM5QixZQUFQLENBQW9CLE1BQXBCLEVBQTRCNEIsRUFBbkYsRUFBdUYsTUFBdkYsRUFBK0YsUUFBL0YsRUFBeUcsSUFBekc7QUFDQW5DLE1BQUFBLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRLHlCQUFSLEVBQW1DVyxNQUFuQyxHQUE0QyxJQUE1QztBQUNIO0FBQ0osR0EvQ0k7QUFnRExlLEVBQUFBLFNBaERLLHFCQWdES0MsS0FoREwsRUFnRFk7QUFDYkEsSUFBQUEsS0FBSyxDQUFDakMsWUFBTixDQUFtQixNQUFuQixFQUEyQmdDLFNBQTNCLENBQXFDLEtBQUtuQyxNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNDLFFBQTFFO0FBQ0gsR0FsREk7QUFtRExpQyxFQUFBQSxhQW5ESyx5QkFtRFNDLFVBbkRULEVBbURxQjtBQUN0QjtBQUVBLFFBQUksS0FBS3RDLE1BQUwsQ0FBWUcsWUFBWixDQUF5QixVQUF6QixFQUFxQ0MsUUFBckMsSUFBaURSLEVBQUUsQ0FBQ2EsSUFBSCxDQUFRLFFBQVIsRUFBa0JOLFlBQWxCLENBQStCLGFBQS9CLEVBQThDTyxLQUE5QyxJQUF1RDRCLFVBQTVHLEVBQXdIO0FBQ3BIMUMsTUFBQUEsRUFBRSxDQUFDYSxJQUFILENBQVEsUUFBUixFQUFrQk4sWUFBbEIsQ0FBK0IsYUFBL0IsRUFBOENPLEtBQTlDLEdBQXNENEIsVUFBdEQ7QUFDQUEsTUFBQUEsVUFBVSxDQUFDZCxjQUFYLENBQTBCLE1BQTFCLEVBQWtDQSxjQUFsQyxDQUFpRCxNQUFqRCxFQUF5REosTUFBekQsR0FBa0UsS0FBbEU7QUFDQWtCLE1BQUFBLFVBQVUsQ0FBQ2QsY0FBWCxDQUEwQixNQUExQixFQUFrQ0EsY0FBbEMsQ0FBaUQsT0FBakQsRUFBMERKLE1BQTFELEdBQW1FLElBQW5FO0FBQ0FrQixNQUFBQSxVQUFVLENBQUNuQyxZQUFYLENBQXdCUCxFQUFFLENBQUMyQyxTQUEzQixFQUFzQ2IsSUFBdEMsQ0FBMkMsV0FBM0M7QUFDQVksTUFBQUEsVUFBVSxDQUFDbkMsWUFBWCxDQUF3QlAsRUFBRSxDQUFDNkIsV0FBM0IsRUFBd0NDLElBQXhDO0FBQ0g7QUFFSixHQTlESTtBQStETGMsRUFBQUEsZ0JBQWdCLEVBQUUsMEJBQVVDLEtBQVYsRUFBaUJDLElBQWpCLEVBQXVCO0FBRXJDLFFBQUlELEtBQUssQ0FBQ0UsSUFBTixDQUFXQyxLQUFYLElBQW9CLFdBQXhCLEVBQ0ksS0FBSzFDLEdBQUwsR0FESixLQUVLLElBQUl1QyxLQUFLLENBQUNFLElBQU4sQ0FBV0MsS0FBWCxJQUFvQixLQUF4QixFQUNELEtBQUsxQixHQUFMLEdBREMsS0FFQSxJQUFJdUIsS0FBSyxDQUFDRSxJQUFOLENBQVdDLEtBQVgsSUFBb0IsWUFBeEIsRUFDRCxLQUFLUCxhQUFMLENBQW1CSSxLQUFLLENBQUNFLElBQXpCLEVBREMsS0FFQSxJQUFJRixLQUFLLENBQUNFLElBQU4sQ0FBV0MsS0FBWCxJQUFvQixNQUF4QixFQUFnQztBQUNqQyxVQUFJSCxLQUFLLENBQUNFLElBQU4sQ0FBV3hDLFlBQVgsQ0FBd0IsTUFBeEIsRUFBZ0MwQyxJQUFoQyxJQUF3QyxNQUE1QyxFQUNJLEtBQUtsQixPQUFMLENBQWFjLEtBQUssQ0FBQ0UsSUFBbkIsRUFESixLQUVLLElBQUlGLEtBQUssQ0FBQ0UsSUFBTixDQUFXeEMsWUFBWCxDQUF3QixNQUF4QixFQUFnQzBDLElBQWhDLElBQXdDLFFBQTVDLEVBQ0QsS0FBS2IsV0FBTCxDQUFpQlMsS0FBSyxDQUFDRSxJQUF2QixFQURDLEtBRUEsSUFBSUYsS0FBSyxDQUFDRSxJQUFOLENBQVd4QyxZQUFYLENBQXdCLE1BQXhCLEVBQWdDMEMsSUFBaEMsSUFBd0MsT0FBNUMsRUFDRCxLQUFLVixTQUFMLENBQWVNLEtBQUssQ0FBQ0UsSUFBckI7QUFDUDtBQUVKLEdBaEZJO0FBa0ZMO0FBRUFHLEVBQUFBLE1BcEZLLG9CQW9GSTtBQUNMLFFBQUksS0FBSzlDLE1BQUwsSUFBZSxJQUFuQixFQUNJLEtBQUtBLE1BQUwsR0FBYyxLQUFLMkMsSUFBTCxDQUFVSSxTQUFWLEVBQWQ7QUFDUCxHQXZGSTtBQXlGTEMsRUFBQUEsTUF6Rkssa0JBeUZFQyxFQXpGRixFQXlGTSxDQUNQO0FBQ0E7QUFDSDtBQTVGSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVyOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBkaWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueCA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueSA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICAgICAgd3gudmlicmF0ZVNob3J0KFwibWVkaXVtXCIpO1xyXG4gICAgICAgIH0gICBcclxuICAgIH0sXHJcblxyXG4gICAgd2luKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmICFjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS53b24pIHtcclxuICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLndvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcIndpblwiKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDaGlsZEJ5TmFtZShcIkFVRElPXCIpLmdldENoaWxkQnlOYW1lKFwiV0lOXCIpLmdldENvbXBvbmVudChjYy5BdWRpb1NvdXJjZSkucGxheSgpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGVhdENha2UoY2FrZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5hdGVDYWtlID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShjYWtlLmdldENvbXBvbmVudChcIml0ZW1cIikuaWQsIFwidXNlZFwiLCBcImNha2VcIiwgbnVsbCk7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIikuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkcmlua1BvdGlvbihwb3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYXRlUG90aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShwb3Rpb24uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCwgXCJ1c2VkXCIsIFwicG90aW9uXCIsIG51bGwpO1xyXG4gICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIikuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb3BlbkNoZXN0KGNoZXN0KSB7XHJcbiAgICAgICAgY2hlc3QuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5vcGVuQ2hlc3QodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpO1xyXG4gICAgfSxcclxuICAgIHNldENoZWNrUG9pbnQoY2hlY2twb2ludCkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIGdvdHRlbiBhbHJlYWR5XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24gIT0gY2hlY2twb2ludCkge1xyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNwYXduID0gY2hlY2twb2ludDtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJGQUNFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjaGVja3BvaW50LmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcIkZBQ0UyXCIpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNoZWNrcG9pbnQuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInRleHRQb3B1cFwiKTtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDb21wb25lbnQoY2MuQXVkaW9Tb3VyY2UpLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gKG90aGVyLCBzZWxmKSB7XHJcblxyXG4gICAgICAgIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiZGFuZ2Vyb3VzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVuZFwiKSBcclxuICAgICAgICAgICAgdGhpcy53aW4oKTtcclxuICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiY2hlY2twb2ludFwiKVxyXG4gICAgICAgICAgICB0aGlzLnNldENoZWNrUG9pbnQob3RoZXIubm9kZSk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcIml0ZW1cIikge1xyXG4gICAgICAgICAgICBpZiAob3RoZXIubm9kZS5nZXRDb21wb25lbnQoXCJpdGVtXCIpLnR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVhdENha2Uob3RoZXIubm9kZSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG90aGVyLm5vZGUuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS50eXBlID09IFwicG90aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyaW5rUG90aW9uKG90aGVyLm5vZGUpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdldENvbXBvbmVudChcIml0ZW1cIikudHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5DaGVzdChvdGhlci5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIC8vaWYgKCF0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcilcclxuICAgICAgICAvLyAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgXHJcbiAgICB9LFxyXG59KTtcclxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2xpZW50LmpzIl0sIm5hbWVzIjpbInBheUxvYWQiLCJ0eXBlIiwiZGF0YSIsIlBsYXllckRhdGEiLCJpZCIsIngiLCJwb3NYIiwicG9zWSIsInNjYWxlWSIsInNjYWxlWCIsImxpdmVzIiwibmFtZSIsInN0YXR1cyIsImtleSIsInJvdW5kTnVtYmVyIiwicm51bSIsInJsZW5ndGgiLCJuZXdudW1iZXIiLCJNYXRoIiwicm91bmQiLCJwb3ciLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllcklkIiwid3MiLCJwbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwibXlQbGF5ZXIiLCJwb3J0Iiwic3RhcnRQbGFjZSIsIk5vZGUiLCJ0aW1lciIsIndhdGNoIiwibXlUaW1lIiwiZW5lbWllcyIsIndvbiIsImNvdW50RG93biIsIml0ZW1zIiwic2hvcnRPblRpbWUiLCJ3YXRjaEFuaW0iLCJBbmltYXRpb24iLCJjb25uZWN0aW9uRXJyb3JVSSIsInNvY2tldENsb3NlZCIsInBvdGlvblByZWZhYiIsImNha2VQcmVmYWIiLCJnYW1lU3RhcnRlZCIsInN0YXJ0U2NyZWVuIiwiY3Jvd25zIiwiY2hlc3RQcmVmYWIiLCJzZXJ2ZXJJcCIsInBvaW50c0xvc3QiLCJzZW5kV2Vic29ja2V0TWVzc2FnZSIsIm1lc3NhZ2UiLCJhY3RpdmUiLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZW5kUGxheWVyU3RhdGUiLCJzdGF0ZSIsInNlbmRFbmVteVN0YXRlIiwicG9zaXRpb24iLCJlbmVteSIsInNlbmRJdGVtU3RhdGUiLCJwb3MiLCJzY2hlZHVsZU9uY2UiLCJzZW5kRW1vamkiLCJldmVudCIsImN1c3RvbUV2ZW50RGF0YSIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJoaWRlRW1vamlzIiwiY3JlYXRlUGxheWVyIiwicGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJmaW5kIiwieSIsImdldENoaWxkQnlOYW1lIiwiTGFiZWwiLCJzdHJpbmciLCJhUGxheWVyIiwiY29sb3IiLCJDb2xvciIsIldISVRFIiwidXBkYXRlUGxheWVyIiwidGhlUGxheWVyIiwibW92ZVJpZ2h0IiwibW92ZUxlZnQiLCJqdW1wIiwic3RvcFgiLCJzdG9wWSIsInVwZGF0ZUVuZW15IiwiY2hhc2VQbGF5ZXIiLCJ1cGRhdGVQbGF5ZXJQb3NpdGlvbiIsInNldFNjYWxlIiwicmVtb3ZlUGxheWVyIiwiZGVzdHJveSIsInVwZGF0ZVRpbWUiLCJ0aW1lIiwiYW5nbGUiLCJnZXRQYXJlbnQiLCJwbGF5Iiwid3JhcE1vZGUiLCJXcmFwTW9kZSIsIkxvb3AiLCJzdG9wIiwiUkVEIiwidGltZXNVcCIsIkF1ZGlvU291cmNlIiwiY29uc29sZSIsImxvZyIsInNob3dDcm93bnMiLCJkaXNjb25uZWN0Iiwib3MiLCJjbG9zZVNvY2tldCIsImNsb3NlIiwidXBkYXRlSXRlbSIsInRoZUl0ZW0iLCJ1cGRhdGVFbW9qaSIsInBsYXlFbW9qaSIsInN0YXJ0Q291bnREb3duIiwibnVtIiwicmVjaWV2ZU1lc3NhZ2UiLCJteURhdGEiLCJwYXJzZSIsImkiLCJzaG93V2lubmVycyIsImFkZFdpbm5lciIsImpvaW5TZXJ2ZXIiLCJ3eCIsImNvbm5lY3RTb2NrZXQiLCJ1cmwiLCJvbk9wZW4iLCJvbk1lc3NhZ2UiLCJvbkVycm9yIiwib25DbG9zZSIsIldlYlNvY2tldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbkxvYWQiLCJyb29tIiwiTWFwIiwic3RhcnQiLCJ1cGRhdGUiLCJkdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUEsVUFDRixpQkFBWUMsSUFBWixFQUFrQkMsSUFBbEIsRUFBd0I7QUFDcEIsT0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0g7O0FBQ0o7O0lBRUtDLGFBQ0Ysb0JBQVlDLEVBQVosRUFBZ0JDLENBQWhCLEVBQW1CO0FBQUEsT0FNbkJDLElBTm1CLEdBTVosQ0FOWTtBQUFBLE9BT25CQyxJQVBtQixHQU9aLENBUFk7QUFBQSxPQVFuQkMsTUFSbUIsR0FRVixDQVJVO0FBQUEsT0FTbkJDLE1BVG1CLEdBU1YsQ0FUVTtBQUFBLE9BVW5CQyxLQVZtQixHQVVYLENBVlc7QUFBQSxPQVduQkMsSUFYbUIsR0FXWixJQVhZO0FBQ2YsT0FBS1AsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsT0FBS0MsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsT0FBS08sTUFBTCxHQUFjLENBQWQ7QUFDQSxPQUFLQyxHQUFMLEdBQVcsRUFBWDtBQUNIOztBQU9KOztBQUVELFNBQVNDLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxPQUEzQixFQUFvQztBQUNoQyxNQUFJQyxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixJQUFJLEdBQUdHLElBQUksQ0FBQ0UsR0FBTCxDQUFTLEVBQVQsRUFBYUosT0FBYixDQUFsQixJQUEyQ0UsSUFBSSxDQUFDRSxHQUFMLENBQVMsRUFBVCxFQUFhSixPQUFiLENBQTNEO0FBQ0EsU0FBT0MsU0FBUDtBQUNIOztBQUVESSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUVMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsUUFBUSxFQUFFLENBREY7QUFFUkMsSUFBQUEsRUFBRSxFQUFFLElBRkk7QUFHUkMsSUFBQUEsT0FBTyxFQUFFLElBSEQ7QUFJUkMsSUFBQUEsWUFBWSxFQUFFO0FBQ1YsaUJBQVMsSUFEQztBQUVWM0IsTUFBQUEsSUFBSSxFQUFFb0IsRUFBRSxDQUFDUTtBQUZDLEtBSk47QUFRUkMsSUFBQUEsUUFBUSxFQUFFLElBUkY7QUFTUkMsSUFBQUEsSUFBSSxFQUFFLElBVEU7QUFVUkMsSUFBQUEsVUFBVSxFQUFFWCxFQUFFLENBQUNZLElBVlA7QUFXUkMsSUFBQUEsS0FBSyxFQUFFYixFQUFFLENBQUNZLElBWEY7QUFZUkUsSUFBQUEsS0FBSyxFQUFFZCxFQUFFLENBQUNZLElBWkY7QUFhUkcsSUFBQUEsTUFBTSxFQUFFLENBYkE7QUFjUkMsSUFBQUEsT0FBTyxFQUFFaEIsRUFBRSxDQUFDWSxJQWRKO0FBZVJLLElBQUFBLEdBQUcsRUFBRSxLQWZHO0FBZ0JSQyxJQUFBQSxTQUFTLEVBQUUsSUFoQkg7QUFpQlJDLElBQUFBLEtBQUssRUFBRW5CLEVBQUUsQ0FBQ1ksSUFqQkY7QUFrQlJRLElBQUFBLFdBQVcsRUFBRSxLQWxCTDtBQW1CUkMsSUFBQUEsU0FBUyxFQUFFckIsRUFBRSxDQUFDc0IsU0FuQk47QUFvQlJDLElBQUFBLGlCQUFpQixFQUFFdkIsRUFBRSxDQUFDWSxJQXBCZDtBQXFCUlksSUFBQUEsWUFBWSxFQUFFLEtBckJOO0FBc0JSQyxJQUFBQSxZQUFZLEVBQUV6QixFQUFFLENBQUNRLE1BdEJUO0FBdUJSa0IsSUFBQUEsVUFBVSxFQUFFMUIsRUFBRSxDQUFDUSxNQXZCUDtBQXdCUm1CLElBQUFBLFdBQVcsRUFBRSxLQXhCTDtBQXlCUkMsSUFBQUEsV0FBVyxFQUFFNUIsRUFBRSxDQUFDWSxJQXpCUjtBQTBCUmlCLElBQUFBLE1BQU0sRUFBRSxDQTFCQTtBQTJCUkMsSUFBQUEsV0FBVyxFQUFFOUIsRUFBRSxDQUFDUSxNQTNCUjtBQTRCUnVCLElBQUFBLFFBQVEsRUFBRSxFQTVCRjtBQTZCUkMsSUFBQUEsVUFBVSxFQUFFO0FBN0JKLEdBRlA7QUFpQ0xDLEVBQUFBLG9CQWpDSyxnQ0FpQ2dCckQsSUFqQ2hCLEVBaUNzQnNELE9BakN0QixFQWlDK0I7QUFDaEMsUUFBSSxDQUFDLEtBQUtYLGlCQUFMLENBQXVCWSxNQUE1QixFQUFvQztBQUNoQyxVQUFJbkMsRUFBRSxDQUFDb0MsR0FBSCxDQUFPQyxRQUFQLElBQW1CckMsRUFBRSxDQUFDb0MsR0FBSCxDQUFPRSxXQUE5QixFQUEyQztBQUN2QyxhQUFLakMsRUFBTCxDQUFRa0MsSUFBUixDQUFhO0FBQUUxRCxVQUFBQSxJQUFJLEVBQUUyRCxJQUFJLENBQUNDLFNBQUwsQ0FBZSxJQUFJOUQsT0FBSixDQUFZQyxJQUFaLEVBQWtCc0QsT0FBbEIsQ0FBZjtBQUFSLFNBQWI7QUFDSCxPQUZELE1BRU87QUFDSCxhQUFLN0IsRUFBTCxDQUFRa0MsSUFBUixDQUFhQyxJQUFJLENBQUNDLFNBQUwsQ0FBZSxJQUFJOUQsT0FBSixDQUFZQyxJQUFaLEVBQWtCc0QsT0FBbEIsQ0FBZixDQUFiO0FBQ0g7QUFDSjtBQUVKLEdBMUNJO0FBMkNMUSxFQUFBQSxlQTNDSywyQkEyQ1dDLEtBM0NYLEVBMkNrQjtBQUNuQixTQUFLVixvQkFBTCxDQUEwQixtQkFBMUIsRUFBK0MsQ0FBQyxLQUFLN0IsUUFBTixFQUFnQnVDLEtBQWhCLENBQS9DO0FBQ0gsR0E3Q0k7QUE4Q0xDLEVBQUFBLGNBOUNLLDBCQThDVUQsS0E5Q1YsRUE4Q2lCRSxRQTlDakIsRUE4QzJCQyxLQTlDM0IsRUE4Q2tDO0FBQ25DLFNBQUtiLG9CQUFMLENBQTBCLGFBQTFCLEVBQXlDLENBQUMsS0FBSzdCLFFBQU4sRUFBZ0J5QyxRQUFoQixFQUEwQkYsS0FBMUIsRUFBaUNHLEtBQWpDLENBQXpDO0FBQ0gsR0FoREk7QUFpRExDLEVBQUFBLGFBakRLLHlCQWlEU2hFLEVBakRULEVBaURhNEQsS0FqRGIsRUFpRG9CL0QsSUFqRHBCLEVBaUQwQm9FLEdBakQxQixFQWlEK0I7QUFDaEM7QUFDQSxRQUFJcEUsSUFBSSxJQUFJLE9BQVIsSUFBbUIrRCxLQUFLLElBQUksT0FBaEMsRUFBeUM7QUFDckMsV0FBS00sWUFBTCxDQUFrQixZQUFZO0FBQUUsYUFBS2hCLG9CQUFMLENBQTBCLFlBQTFCLEVBQXdDLENBQUNsRCxFQUFELEVBQUs0RCxLQUFMLEVBQVkvRCxJQUFaLEVBQWtCb0UsR0FBbEIsQ0FBeEM7QUFBaUUsT0FBakcsRUFBa0csQ0FBbEc7QUFDSCxLQUZELE1BRU87QUFDSCxXQUFLZixvQkFBTCxDQUEwQixZQUExQixFQUF3QyxDQUFDbEQsRUFBRCxFQUFLNEQsS0FBTCxFQUFZL0QsSUFBWixFQUFrQm9FLEdBQWxCLENBQXhDO0FBQ0g7QUFFSixHQXpESTtBQTBETEUsRUFBQUEsU0FBUyxFQUFFLG1CQUFVQyxLQUFWLEVBQWlCQyxlQUFqQixFQUFrQztBQUN6QztBQUNBLFNBQUtuQixvQkFBTCxDQUEwQixPQUExQixFQUFtQyxDQUFDLEtBQUs3QixRQUFOLEVBQWdCZ0QsZUFBaEIsQ0FBbkM7QUFDQSxTQUFLQyxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0NDLFVBQXRDO0FBQ0gsR0E5REk7QUErRExDLEVBQUFBLFlBL0RLLHdCQStEUUMsTUEvRFIsRUErRGdCO0FBQ2pCO0FBQ0EsUUFBSUEsTUFBTSxDQUFDMUUsRUFBUCxJQUFhLEtBQUtxQixRQUF0QixFQUFnQztBQUM1QixXQUFLSyxRQUFMLEdBQWdCVCxFQUFFLENBQUMwRCxXQUFILENBQWUsS0FBS25ELFlBQXBCLENBQWhCO0FBQ0EsV0FBS0UsUUFBTCxDQUFja0QsTUFBZCxHQUF1QjNELEVBQUUsQ0FBQzRELElBQUgsQ0FBUSxnQkFBUixDQUF2QjtBQUNBLFdBQUtuRCxRQUFMLENBQWN6QixDQUFkLEdBQWtCLEtBQUsyQixVQUFMLENBQWdCM0IsQ0FBbEM7QUFDQSxXQUFLeUIsUUFBTCxDQUFjb0QsQ0FBZCxHQUFrQixLQUFLbEQsVUFBTCxDQUFnQmtELENBQWxDO0FBQ0EsV0FBS3BELFFBQUwsQ0FBY25CLElBQWQsR0FBcUJtRSxNQUFNLENBQUMxRSxFQUE1QjtBQUNBLFdBQUswQixRQUFMLENBQWNxRCxjQUFkLENBQTZCLFNBQTdCLEVBQXdDUixZQUF4QyxDQUFxRHRELEVBQUUsQ0FBQytELEtBQXhELEVBQStEQyxNQUEvRCxHQUF3RVAsTUFBTSxDQUFDbkUsSUFBL0U7QUFDQSxXQUFLbUIsUUFBTCxDQUFjMUIsRUFBZCxHQUFtQjBFLE1BQU0sQ0FBQzFFLEVBQTFCO0FBQ0EsV0FBS3VCLE9BQUwsQ0FBYW1ELE1BQU0sQ0FBQzFFLEVBQXBCLElBQTBCLEtBQUswQixRQUEvQjtBQUNILEtBVEQsTUFTTztBQUNILFVBQUl3RCxPQUFPLEdBQUdqRSxFQUFFLENBQUMwRCxXQUFILENBQWUsS0FBS25ELFlBQXBCLENBQWQ7QUFDQTBELE1BQUFBLE9BQU8sQ0FBQ04sTUFBUixHQUFpQjNELEVBQUUsQ0FBQzRELElBQUgsQ0FBUSxnQkFBUixDQUFqQjtBQUNBSyxNQUFBQSxPQUFPLENBQUNqRixDQUFSLEdBQVksS0FBSzJCLFVBQUwsQ0FBZ0IzQixDQUE1QjtBQUNBaUYsTUFBQUEsT0FBTyxDQUFDSixDQUFSLEdBQVksS0FBS2xELFVBQUwsQ0FBZ0JrRCxDQUE1QjtBQUNBSSxNQUFBQSxPQUFPLENBQUMzRSxJQUFSLEdBQWVtRSxNQUFNLENBQUMxRSxFQUF0QjtBQUNBa0YsTUFBQUEsT0FBTyxDQUFDbEYsRUFBUixHQUFhMEUsTUFBTSxDQUFDMUUsRUFBcEI7QUFDQWtGLE1BQUFBLE9BQU8sQ0FBQ0gsY0FBUixDQUF1QixTQUF2QixFQUFrQ1IsWUFBbEMsQ0FBK0N0RCxFQUFFLENBQUMrRCxLQUFsRCxFQUF5REMsTUFBekQsR0FBa0VQLE1BQU0sQ0FBQ25FLElBQXpFO0FBQ0EyRSxNQUFBQSxPQUFPLENBQUNILGNBQVIsQ0FBdUIsU0FBdkIsRUFBa0NJLEtBQWxDLEdBQTBDbEUsRUFBRSxDQUFDbUUsS0FBSCxDQUFTQyxLQUFuRDtBQUNBLFdBQUs5RCxPQUFMLENBQWFtRCxNQUFNLENBQUMxRSxFQUFwQixJQUEwQmtGLE9BQTFCO0FBQ0g7QUFDSixHQXJGSTtBQXNGTEksRUFBQUEsWUF0Rkssd0JBc0ZRakUsUUF0RlIsRUFzRmtCdUMsS0F0RmxCLEVBc0Z5QjtBQUMxQixRQUFJMkIsU0FBUyxHQUFHLEtBQUtoRSxPQUFMLENBQWFGLFFBQWIsQ0FBaEI7O0FBQ0EsWUFBUXVDLEtBQVI7QUFDSSxXQUFLLE9BQUw7QUFDSTJCLFFBQUFBLFNBQVMsQ0FBQ2hCLFlBQVYsQ0FBdUIsVUFBdkIsRUFBbUNpQixTQUFuQztBQUNBOztBQUNKLFdBQUssTUFBTDtBQUNJRCxRQUFBQSxTQUFTLENBQUNoQixZQUFWLENBQXVCLFVBQXZCLEVBQW1Da0IsUUFBbkM7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSUYsUUFBQUEsU0FBUyxDQUFDaEIsWUFBVixDQUF1QixVQUF2QixFQUFtQ21CLElBQW5DO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0lILFFBQUFBLFNBQVMsQ0FBQ2hCLFlBQVYsQ0FBdUIsVUFBdkIsRUFBbUNvQixLQUFuQztBQUNBOztBQUNKLFdBQUssT0FBTDtBQUNJSixRQUFBQSxTQUFTLENBQUNoQixZQUFWLENBQXVCLFVBQXZCLEVBQW1DcUIsS0FBbkM7QUFDQTtBQWZSO0FBaUJILEdBekdJO0FBMEdMQyxFQUFBQSxXQTFHSyx1QkEwR094RSxRQTFHUCxFQTBHaUJ5QyxRQTFHakIsRUEwRzBCRixLQTFHMUIsRUEwR2lDRyxLQTFHakMsRUEwR3dDO0FBQ3pDLFFBQUl3QixTQUFTLEdBQUcsS0FBS2hFLE9BQUwsQ0FBYUYsUUFBYixDQUFoQjs7QUFDQSxZQUFRdUMsS0FBUjtBQUNJLFdBQUssVUFBTDtBQUNJLGFBQUszQixPQUFMLENBQWE4QyxjQUFiLENBQTRCaEIsS0FBNUIsRUFBbUNRLFlBQW5DLENBQWdELGFBQWhELEVBQStEdUIsV0FBL0QsQ0FBMkVQLFNBQTNFO0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0ksYUFBS3RELE9BQUwsQ0FBYThDLGNBQWIsQ0FBNEJoQixLQUE1QixFQUFtQ1EsWUFBbkMsQ0FBZ0QsYUFBaEQsRUFBK0RpQixTQUEvRDtBQUNBOztBQUNKLFdBQUssTUFBTDtBQUNJLGFBQUt2RCxPQUFMLENBQWE4QyxjQUFiLENBQTRCaEIsS0FBNUIsRUFBbUNRLFlBQW5DLENBQWdELGFBQWhELEVBQStEa0IsUUFBL0Q7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSSxhQUFLeEQsT0FBTCxDQUFhOEMsY0FBYixDQUE0QmhCLEtBQTVCLEVBQW1DUSxZQUFuQyxDQUFnRCxhQUFoRCxFQUErRG1CLElBQS9EO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0ksYUFBS3pELE9BQUwsQ0FBYThDLGNBQWIsQ0FBNEJoQixLQUE1QixFQUFtQzlELENBQW5DLEdBQXVDNkQsUUFBUSxDQUFDLENBQUQsQ0FBL0M7QUFDQSxhQUFLN0IsT0FBTCxDQUFhOEMsY0FBYixDQUE0QmhCLEtBQTVCLEVBQW1DZSxDQUFuQyxHQUF1Q2hCLFFBQVEsQ0FBQyxDQUFELENBQS9DO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0QkE7QUF3QkgsR0FwSUk7QUFzSUxpQyxFQUFBQSxvQkF0SUssZ0NBc0lnQnJCLE1BdEloQixFQXNJd0I7QUFFekIsU0FBS25ELE9BQUwsQ0FBYW1ELE1BQU0sQ0FBQzFFLEVBQXBCLEVBQXdCQyxDQUF4QixHQUE0QnlFLE1BQU0sQ0FBQ3hFLElBQW5DO0FBQ0EsU0FBS3FCLE9BQUwsQ0FBYW1ELE1BQU0sQ0FBQzFFLEVBQXBCLEVBQXdCOEUsQ0FBeEIsR0FBNEJKLE1BQU0sQ0FBQ3ZFLElBQW5DO0FBQ0EsU0FBS29CLE9BQUwsQ0FBYW1ELE1BQU0sQ0FBQzFFLEVBQXBCLEVBQXdCZ0csUUFBeEIsQ0FBaUN0QixNQUFNLENBQUNyRSxNQUF4QyxFQUFnRHFFLE1BQU0sQ0FBQ3RFLE1BQXZELEVBSnlCLENBS3pCO0FBQ0gsR0E1SUk7QUE2SUw2RixFQUFBQSxZQTdJSyx3QkE2SVF2QixNQTdJUixFQTZJZ0I7QUFDakIsU0FBS25ELE9BQUwsQ0FBYW1ELE1BQU0sQ0FBQzFFLEVBQXBCLEVBQXdCa0csT0FBeEI7QUFDQSxTQUFLM0UsT0FBTCxXQUFvQm1ELE1BQU0sQ0FBQzFFLEVBQTNCO0FBQ0gsR0FoSkk7QUFpSkxtRyxFQUFBQSxVQWpKSyxzQkFpSk1DLElBakpOLEVBaUpZO0FBQ2I7QUFDQSxRQUFLLEtBQUtqRSxTQUFMLEdBQWlCaUUsSUFBbEIsSUFBMkIsQ0FBL0IsRUFBa0M7QUFDOUIsV0FBS3RFLEtBQUwsQ0FBV3lDLFlBQVgsQ0FBd0J0RCxFQUFFLENBQUMrRCxLQUEzQixFQUFrQ0MsTUFBbEMsR0FBMkNtQixJQUEzQztBQUNBLFdBQUtyRSxLQUFMLENBQVdzRSxLQUFYLEdBQW1CLEVBQUlELElBQUksR0FBRyxHQUFSLEdBQWUsS0FBS2pFLFNBQXBCLEdBQWdDLEVBQW5DLENBQW5CO0FBQ0EsV0FBS0gsTUFBTCxHQUFjb0UsSUFBZDs7QUFDQSxVQUFJLENBQUMsS0FBSy9ELFdBQU4sSUFBc0IsS0FBS0YsU0FBTCxHQUFpQmlFLElBQWxCLEdBQTBCLEVBQW5ELEVBQXVEO0FBQ25ELGFBQUs5RCxTQUFMLEdBQWlCLEtBQUtQLEtBQUwsQ0FBV3VFLFNBQVgsR0FBdUIvQixZQUF2QixDQUFvQ3RELEVBQUUsQ0FBQ3NCLFNBQXZDLEVBQWtEZ0UsSUFBbEQsQ0FBdUQsYUFBdkQsQ0FBakI7QUFDQSxhQUFLakUsU0FBTCxDQUFla0UsUUFBZixHQUEwQnZGLEVBQUUsQ0FBQ3dGLFFBQUgsQ0FBWUMsSUFBdEM7QUFDQSxhQUFLckUsV0FBTCxHQUFtQixJQUFuQjtBQUNIO0FBQ0osS0FURCxNQVVLO0FBQ0QsVUFBSSxLQUFLQSxXQUFULEVBQXNCO0FBQ2xCLGFBQUtDLFNBQUwsQ0FBZXFFLElBQWYsQ0FBb0IsYUFBcEI7QUFDQSxhQUFLNUUsS0FBTCxDQUFXdUUsU0FBWCxHQUF1Qm5CLEtBQXZCLEdBQStCbEUsRUFBRSxDQUFDbUUsS0FBSCxDQUFTd0IsR0FBeEM7QUFDQTNGLFFBQUFBLEVBQUUsQ0FBQzRELElBQUgsQ0FBUSxRQUFSLEVBQWtCTixZQUFsQixDQUErQixhQUEvQixFQUE4Q3NDLE9BQTlDO0FBQ0EsYUFBS3hFLFdBQUwsR0FBbUIsS0FBbkIsQ0FKa0IsQ0FNbEI7O0FBQ0EsWUFBSSxDQUFDLEtBQUtILEdBQVYsRUFBZTtBQUNYakIsVUFBQUEsRUFBRSxDQUFDNEQsSUFBSCxDQUFRLFFBQVIsRUFBa0JFLGNBQWxCLENBQWlDLE9BQWpDLEVBQTBDQSxjQUExQyxDQUF5RCxNQUF6RCxFQUFpRVIsWUFBakUsQ0FBOEV0RCxFQUFFLENBQUM2RixXQUFqRixFQUE4RlAsSUFBOUY7QUFDQVEsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksS0FBS2xFLE1BQWpCO0FBQ0EsY0FBSSxLQUFLQSxNQUFMLEdBQWMsRUFBbEIsRUFDSSxLQUFLd0IsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEMsVUFBdEMsQ0FBaUQsS0FBS2hFLFVBQXRELEVBREosS0FHSSxLQUFLcUIsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEMsVUFBdEMsQ0FBaUQsQ0FBakQ7QUFDUDtBQUVKO0FBRUo7QUFDSixHQWpMSTtBQWtMTEMsRUFBQUEsVUFsTEssd0JBa0xRO0FBQ1QsU0FBS3pFLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxRQUFJeEIsRUFBRSxDQUFDb0MsR0FBSCxDQUFPOEQsRUFBUCxJQUFhbEcsRUFBRSxDQUFDb0MsR0FBSCxDQUFPRSxXQUF4QixFQUNJLEtBQUtqQyxFQUFMLENBQVE4RixXQUFSLEdBREosS0FHSSxLQUFLOUYsRUFBTCxDQUFRK0YsS0FBUjtBQUNQLEdBeExJO0FBeUxMQyxFQUFBQSxVQXpMSyxzQkF5TE10SCxFQXpMTixFQXlMVTRELEtBekxWLEVBeUxpQi9ELElBekxqQixFQXlMdUJvRSxHQXpMdkIsRUF5TDRCO0FBQzdCLFFBQUlMLEtBQUssSUFBSSxNQUFiLEVBQ0ksS0FBS3hCLEtBQUwsQ0FBVzJDLGNBQVgsQ0FBMEJsRixJQUFJLEdBQUdHLEVBQWpDLEVBQXFDa0csT0FBckMsR0FESixLQUVLLElBQUl0QyxLQUFLLElBQUksT0FBYixFQUFzQjtBQUN2QixVQUFJMkQsT0FBTyxHQUFHLElBQWQ7QUFFQSxVQUFJMUgsSUFBSSxJQUFJLFFBQVosRUFDSTBILE9BQU8sR0FBR3RHLEVBQUUsQ0FBQzBELFdBQUgsQ0FBZSxLQUFLakMsWUFBcEIsQ0FBVixDQURKLEtBRUssSUFBSTdDLElBQUksSUFBSSxNQUFaLEVBQ0QwSCxPQUFPLEdBQUd0RyxFQUFFLENBQUMwRCxXQUFILENBQWUsS0FBS2hDLFVBQXBCLENBQVYsQ0FEQyxLQUVBLElBQUk5QyxJQUFJLElBQUksT0FBWixFQUNEMEgsT0FBTyxHQUFHdEcsRUFBRSxDQUFDMEQsV0FBSCxDQUFlLEtBQUs1QixXQUFwQixDQUFWO0FBRUp3RSxNQUFBQSxPQUFPLENBQUN0SCxDQUFSLEdBQVlnRSxHQUFHLENBQUMsQ0FBRCxDQUFmO0FBQ0FzRCxNQUFBQSxPQUFPLENBQUN6QyxDQUFSLEdBQVliLEdBQUcsQ0FBQyxDQUFELENBQWY7QUFDQXNELE1BQUFBLE9BQU8sQ0FBQzNDLE1BQVIsR0FBaUIsS0FBS3hDLEtBQXRCO0FBQ0FtRixNQUFBQSxPQUFPLENBQUNoSCxJQUFSLEdBQWVWLElBQUksR0FBR0csRUFBdEI7QUFDQXVILE1BQUFBLE9BQU8sQ0FBQ2hELFlBQVIsQ0FBcUIsTUFBckIsRUFBNkJ2RSxFQUE3QixHQUFrQ0EsRUFBbEMsQ0FkdUIsQ0FldkI7QUFDSDtBQUVKLEdBOU1JO0FBK01Md0gsRUFBQUEsV0EvTUssdUJBK01PeEgsRUEvTVAsRUErTVdILElBL01YLEVBK01pQjtBQUNsQixTQUFLMEIsT0FBTCxDQUFhdkIsRUFBYixFQUFpQnVFLFlBQWpCLENBQThCLFVBQTlCLEVBQTBDa0QsU0FBMUMsQ0FBb0Q1SCxJQUFwRDtBQUNILEdBak5JO0FBa05MNkgsRUFBQUEsY0FsTkssMEJBa05VQyxHQWxOVixFQWtOZTtBQUNoQixTQUFLOUUsV0FBTCxDQUFpQk8sTUFBakIsR0FBMEIsSUFBMUI7O0FBQ0EsUUFBSXVFLEdBQUcsSUFBSSxDQUFYLEVBQWM7QUFDVixXQUFLOUUsV0FBTCxDQUFpQk8sTUFBakIsR0FBMEIsS0FBMUI7QUFDQSxXQUFLUixXQUFMLEdBQW1CLElBQW5CO0FBQ0gsS0FIRCxNQUdPO0FBQ0gsV0FBS0MsV0FBTCxDQUFpQmtDLGNBQWpCLENBQWdDLEtBQWhDLEVBQXVDUixZQUF2QyxDQUFvRHRELEVBQUUsQ0FBQytELEtBQXZELEVBQThEQyxNQUE5RCxHQUF1RTBDLEdBQXZFO0FBQ0g7QUFDSixHQTFOSTtBQTJOTEMsRUFBQUEsY0EzTkssMEJBMk5VOUgsSUEzTlYsRUEyTmdCO0FBQ2pCLFFBQUkrSCxNQUFNLEdBQUdwRSxJQUFJLENBQUNxRSxLQUFMLENBQVdoSSxJQUFYLENBQWI7O0FBRUEsWUFBUStILE1BQU0sQ0FBQ2hJLElBQWY7QUFDSSxXQUFLLG1CQUFMO0FBQ0ksWUFBSWdJLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLEtBQWtCLEtBQUt1QixRQUEzQixFQUFxQztBQUNqQyxlQUFLaUUsWUFBTCxDQUFrQnVDLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWxCLEVBQWtDK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBbEM7QUFDSDs7QUFDRDs7QUFDSixXQUFLLFFBQUw7QUFDSSxhQUFLbUcsWUFBTCxDQUFrQjRCLE1BQU0sQ0FBQy9ILElBQXpCO0FBQ0E7O0FBQ0osV0FBSyxVQUFMO0FBQ0k7QUFDQSxhQUFLcUMsU0FBTCxHQUFpQjBGLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWpCO0FBQ0EsYUFBS21ELFVBQUwsR0FBa0I0RSxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixDQUFsQjtBQUNBaUgsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksS0FBSzdFLFNBQWpCLEVBSkosQ0FLSTs7QUFDQSxhQUFLLElBQUk0RixDQUFULElBQWNGLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWQsRUFBOEI7QUFDMUIsZUFBSzJFLFlBQUwsQ0FBa0JvRCxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixFQUFlaUksQ0FBZixDQUFsQjtBQUNIOztBQUNEOztBQUNKLFdBQUssV0FBTDtBQUNJLGFBQUssSUFBSUEsQ0FBVCxJQUFjRixNQUFNLENBQUMvSCxJQUFyQixFQUEyQjtBQUN2QixjQUFJLEtBQUt1QixRQUFMLElBQWlCd0csTUFBTSxDQUFDL0gsSUFBUCxDQUFZaUksQ0FBWixFQUFlL0gsRUFBcEMsRUFDSSxLQUFLK0Ysb0JBQUwsQ0FBMEI4QixNQUFNLENBQUMvSCxJQUFQLENBQVlpSSxDQUFaLENBQTFCO0FBQ1A7O0FBQ0Q7O0FBQ0osV0FBSyxRQUFMO0FBQ0ksWUFBSSxLQUFLMUcsUUFBTCxJQUFpQndHLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLEVBQWVFLEVBQXBDLEVBQXdDO0FBQ3BDLGVBQUtzRSxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0N5RCxXQUF0QztBQUNBLGVBQUsxRCxJQUFMLENBQVVDLFlBQVYsQ0FBdUIsYUFBdkIsRUFBc0MwQyxVQUF0QyxDQUFpRFksTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBakQ7QUFDSDs7QUFDRCxhQUFLd0UsSUFBTCxDQUFVQyxZQUFWLENBQXVCLGFBQXZCLEVBQXNDMEQsU0FBdEMsQ0FBZ0RKLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWhELEVBQWdFK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBaEU7QUFDQTs7QUFDSixXQUFLLE1BQUw7QUFDSTtBQUNBLGFBQUtxRyxVQUFMLENBQWdCMEIsTUFBTSxDQUFDL0gsSUFBdkI7QUFDQTs7QUFDSixXQUFLLGFBQUw7QUFDSSxZQUFJK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosS0FBa0IsS0FBS3VCLFFBQTNCLEVBQ0ksS0FBS3dFLFdBQUwsQ0FBaUJnQyxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixDQUFqQixFQUFpQytILE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWpDLEVBQWlEK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBakQsRUFBaUUrSCxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixDQUFqRTtBQUNKOztBQUNKLFdBQUssWUFBTDtBQUNJLGFBQUt3SCxVQUFMLENBQWdCTyxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixDQUFoQixFQUFnQytILE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWhDLEVBQWdEK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBaEQsRUFBZ0UrSCxNQUFNLENBQUMvSCxJQUFQLENBQVksQ0FBWixDQUFoRSxFQURKLENBRUk7O0FBQ0E7O0FBQ0osV0FBSyxPQUFMO0FBQ0ksYUFBSzBILFdBQUwsQ0FBaUJLLE1BQU0sQ0FBQy9ILElBQVAsQ0FBWSxDQUFaLENBQWpCLEVBQWlDK0gsTUFBTSxDQUFDL0gsSUFBUCxDQUFZLENBQVosQ0FBakM7QUFDQTs7QUFDSixXQUFLLE9BQUw7QUFDSSxhQUFLNEgsY0FBTCxDQUFvQkcsTUFBTSxDQUFDL0gsSUFBM0I7QUFFQTtBQWxEUjtBQW9ESCxHQWxSSTtBQW1STG9JLEVBQUFBLFVBblJLLHdCQW1SUTtBQUFBOztBQUNULFFBQUlqSCxFQUFFLENBQUNvQyxHQUFILENBQU9DLFFBQVAsSUFBbUJyQyxFQUFFLENBQUNvQyxHQUFILENBQU9FLFdBQTlCLEVBQTJDO0FBQ3ZDLFdBQUtqQyxFQUFMLEdBQVU2RyxFQUFFLENBQUNDLGFBQUgsQ0FBaUI7QUFDdkJDLFFBQUFBLEdBQUcsRUFBRSxVQUFVLEtBQUtyRixRQUFmLEdBQXlCLEdBQXpCLEdBQStCLEtBQUtyQjtBQURsQixPQUFqQixDQUFWO0FBSUEsV0FBS0wsRUFBTCxDQUFRZ0gsTUFBUixDQUFlLFlBQU07QUFDakJ2QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxrQkFBWjs7QUFDQSxRQUFBLEtBQUksQ0FBQzlELG9CQUFMLENBQTBCLFlBQTFCLEVBQXdDLEtBQUksQ0FBQzdCLFFBQTdDO0FBQ0gsT0FIRDtBQUtBLFdBQUtDLEVBQUwsQ0FBUWlILFNBQVIsQ0FBa0IsZ0JBQWM7QUFBQSxZQUFYekksSUFBVyxRQUFYQSxJQUFXOztBQUM1QixRQUFBLEtBQUksQ0FBQzhILGNBQUwsQ0FBb0I5SCxJQUFwQjtBQUNILE9BRkQ7QUFJQSxXQUFLd0IsRUFBTCxDQUFRa0gsT0FBUixDQUFnQixZQUFNO0FBQ2xCekIsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksT0FBWjtBQUNBLFFBQUEsS0FBSSxDQUFDeEUsaUJBQUwsQ0FBdUJZLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0FuQyxRQUFBQSxFQUFFLENBQUM0RCxJQUFILENBQVEsa0JBQVIsRUFBNEJ6QixNQUE1QixHQUFxQyxLQUFyQztBQUNILE9BSkQ7QUFNQSxXQUFLOUIsRUFBTCxDQUFRbUgsT0FBUixDQUFnQixZQUFNO0FBQ2xCO0FBQ0EsWUFBSSxDQUFDLEtBQUksQ0FBQ2hHLFlBQVYsRUFBd0I7QUFDcEIsVUFBQSxLQUFJLENBQUNELGlCQUFMLENBQXVCWSxNQUF2QixHQUFnQyxJQUFoQztBQUNBbkMsVUFBQUEsRUFBRSxDQUFDNEQsSUFBSCxDQUFRLGtCQUFSLEVBQTRCekIsTUFBNUIsR0FBcUMsS0FBckM7QUFDSDtBQUNKLE9BTkQ7QUFPSCxLQTNCRCxNQTRCSztBQUNELFdBQUs5QixFQUFMLEdBQVUsSUFBSW9ILFNBQUosQ0FBYyxVQUFVLEtBQUsxRixRQUFmLEdBQTJCLEdBQTNCLEdBQWlDLEtBQUtyQixJQUFwRCxDQUFWO0FBRUEsV0FBS0wsRUFBTCxDQUFRcUgsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsWUFBTTtBQUNuQzVCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaOztBQUNBLFFBQUEsS0FBSSxDQUFDOUQsb0JBQUwsQ0FBMEIsWUFBMUIsRUFBd0MsS0FBSSxDQUFDN0IsUUFBN0M7QUFDSCxPQUhEO0FBS0EsV0FBS0MsRUFBTCxDQUFRcUgsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUNwQzVCLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVo7QUFDQSxRQUFBLEtBQUksQ0FBQ3hFLGlCQUFMLENBQXVCWSxNQUF2QixHQUFnQyxJQUFoQztBQUNBbkMsUUFBQUEsRUFBRSxDQUFDNEQsSUFBSCxDQUFRLGtCQUFSLEVBQTRCekIsTUFBNUIsR0FBcUMsS0FBckM7QUFDSCxPQUpEO0FBTUEsV0FBSzlCLEVBQUwsQ0FBUXFILGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFlBQU07QUFDcEM7QUFDQSxZQUFJLENBQUMsS0FBSSxDQUFDbEcsWUFBVixFQUF3QjtBQUNwQixVQUFBLEtBQUksQ0FBQ0QsaUJBQUwsQ0FBdUJZLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0FuQyxVQUFBQSxFQUFFLENBQUM0RCxJQUFILENBQVEsa0JBQVIsRUFBNEJ6QixNQUE1QixHQUFxQyxLQUFyQztBQUNIO0FBRUosT0FQRDtBQVNBLFdBQUs5QixFQUFMLENBQVFxSCxnQkFBUixDQUF5QixTQUF6QixFQUFvQyxpQkFBYztBQUFBLFlBQVg3SSxJQUFXLFNBQVhBLElBQVc7O0FBQzlDLFFBQUEsS0FBSSxDQUFDOEgsY0FBTCxDQUFvQjlILElBQXBCLEVBRDhDLENBSzlDO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVILE9BdkNEO0FBd0NIO0FBSUosR0FuWEk7QUFxWEw7QUFFQThJLEVBQUFBLE1BdlhLLG9CQXVYSTtBQUNMO0FBQ0E7QUFDQTtBQUVBLFNBQUszRixVQUFMLEdBQWtCLENBQWxCO0FBQ0EsU0FBSzVCLFFBQUwsR0FBZ0JKLEVBQUUsQ0FBQzRELElBQUgsQ0FBUSxTQUFSLEVBQW1CTixZQUFuQixDQUFnQyxhQUFoQyxFQUErQ2xELFFBQS9EO0FBQ0EsU0FBS00sSUFBTCxHQUFZVixFQUFFLENBQUM0RCxJQUFILENBQVEsU0FBUixFQUFtQk4sWUFBbkIsQ0FBZ0MsYUFBaEMsRUFBK0NzRSxJQUEzRDtBQUNBLFNBQUs3RixRQUFMLEdBQWdCL0IsRUFBRSxDQUFDNEQsSUFBSCxDQUFRLFNBQVIsRUFBbUJOLFlBQW5CLENBQWdDLGFBQWhDLEVBQStDdkIsUUFBL0Q7QUFDQSxTQUFLRixNQUFMLEdBQWM3QixFQUFFLENBQUM0RCxJQUFILENBQVEsU0FBUixFQUFtQk4sWUFBbkIsQ0FBZ0MsYUFBaEMsRUFBK0N6QixNQUE3RDtBQUVBLFNBQUt2QixPQUFMLEdBQWUsSUFBSXVILEdBQUosRUFBZjtBQUVBLFNBQUtaLFVBQUw7QUFDSCxHQXJZSTtBQXVZTGEsRUFBQUEsS0F2WUssbUJBdVlHLENBRVAsQ0F6WUk7QUEyWUxDLEVBQUFBLE1BM1lLLGtCQTJZRUMsRUEzWUYsRUEyWU07QUFDUCxRQUFJLEtBQUt2SCxRQUFMLElBQWlCLElBQXJCLEVBQ0ksS0FBS3dCLG9CQUFMLENBQTBCLFVBQTFCLEVBQXNDLENBQUMsS0FBS3hCLFFBQUwsQ0FBY3pCLENBQWYsRUFBa0IsS0FBS3lCLFFBQUwsQ0FBY29ELENBQWhDLEVBQW1DcEUsV0FBVyxDQUFDLEtBQUtnQixRQUFMLENBQWN0QixNQUFmLEVBQXNCLENBQXRCLENBQTlDLEVBQXdFTSxXQUFXLENBQUMsS0FBS2dCLFFBQUwsQ0FBY3JCLE1BQWYsRUFBc0IsQ0FBdEIsQ0FBbkYsQ0FBdEM7QUFFUDtBQS9ZSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgc2NhbGVZID0gMDtcclxuICAgIHNjYWxlWCA9IDA7XHJcbiAgICBsaXZlcyA9IDM7XHJcbiAgICBuYW1lID0gbnVsbDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJvdW5kTnVtYmVyKHJudW0sIHJsZW5ndGgpIHtcclxuICAgIHZhciBuZXdudW1iZXIgPSBNYXRoLnJvdW5kKHJudW0gKiBNYXRoLnBvdygxMCwgcmxlbmd0aCkpIC8gTWF0aC5wb3coMTAsIHJsZW5ndGgpO1xyXG4gICAgcmV0dXJuIG5ld251bWJlcjtcclxufVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcklkOiAwLFxyXG4gICAgICAgIHdzOiBudWxsLFxyXG4gICAgICAgIHBsYXllcnM6IG51bGwsXHJcbiAgICAgICAgcGxheWVyUHJlZmFiOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcclxuICAgICAgICB9LFxyXG4gICAgICAgIG15UGxheWVyOiBudWxsLFxyXG4gICAgICAgIHBvcnQ6IG51bGwsXHJcbiAgICAgICAgc3RhcnRQbGFjZTogY2MuTm9kZSxcclxuICAgICAgICB0aW1lcjogY2MuTm9kZSxcclxuICAgICAgICB3YXRjaDogY2MuTm9kZSxcclxuICAgICAgICBteVRpbWU6IDAsXHJcbiAgICAgICAgZW5lbWllczogY2MuTm9kZSxcclxuICAgICAgICB3b246IGZhbHNlLFxyXG4gICAgICAgIGNvdW50RG93bjogbnVsbCxcclxuICAgICAgICBpdGVtczogY2MuTm9kZSxcclxuICAgICAgICBzaG9ydE9uVGltZTogZmFsc2UsXHJcbiAgICAgICAgd2F0Y2hBbmltOiBjYy5BbmltYXRpb24sXHJcbiAgICAgICAgY29ubmVjdGlvbkVycm9yVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgc29ja2V0Q2xvc2VkOiBmYWxzZSxcclxuICAgICAgICBwb3Rpb25QcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICBjYWtlUHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgZ2FtZVN0YXJ0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHN0YXJ0U2NyZWVuOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBjaGVzdFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIHBvaW50c0xvc3Q6IDAsXHJcbiAgICB9LFxyXG4gICAgc2VuZFdlYnNvY2tldE1lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uRXJyb3JVSS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKHR5cGUsIG1lc3NhZ2UpKSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZCh0eXBlLCBtZXNzYWdlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRQbGF5ZXJTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVQbGF5ZXJTdGF0ZVwiLCBbdGhpcy5wbGF5ZXJJZCwgc3RhdGVdKTtcclxuICAgIH0sXHJcbiAgICBzZW5kRW5lbXlTdGF0ZShzdGF0ZSwgcG9zaXRpb24sIGVuZW15KSB7XHJcbiAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUVuZW15XCIsIFt0aGlzLnBsYXllcklkLCBwb3NpdGlvbiwgc3RhdGUsIGVuZW15XSk7XHJcbiAgICB9LFxyXG4gICAgc2VuZEl0ZW1TdGF0ZShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIC8vIGRlbGF5IGNoZXN0IHNwYXduXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJjaGVzdFwiICYmIHN0YXRlID09IFwic3Bhd25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7IHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVJdGVtXCIsIFtpZCwgc3RhdGUsIHR5cGUsIHBvc10pO30sMyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUl0ZW1cIiwgW2lkLCBzdGF0ZSwgdHlwZSwgcG9zXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRFbW9qaTogZnVuY3Rpb24gKGV2ZW50LCBjdXN0b21FdmVudERhdGEpIHtcclxuICAgICAgICAvLyBzZW5kIGVtb2ppLCBjdXN0b21FdmVudERhdGEgd2lsbCBiZSB0aGUgdHlwZVxyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJlbW9qaVwiLCBbdGhpcy5wbGF5ZXJJZCwgY3VzdG9tRXZlbnREYXRhXSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmhpZGVFbW9qaXMoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVQbGF5ZXIocGxheWVyKSB7XHJcbiAgICAgICAgLy9teSBjaGFyYWN0ZXJcclxuICAgICAgICBpZiAocGxheWVyLmlkID09IHRoaXMucGxheWVySWQpIHtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnNcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIueCA9IHRoaXMuc3RhcnRQbGFjZS54O1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLnkgPSB0aGlzLnN0YXJ0UGxhY2UueTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5uYW1lID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmlkID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXSA9IHRoaXMubXlQbGF5ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFQbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllclByZWZhYik7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzXCIpO1xyXG4gICAgICAgICAgICBhUGxheWVyLnggPSB0aGlzLnN0YXJ0UGxhY2UueDtcclxuICAgICAgICAgICAgYVBsYXllci55ID0gdGhpcy5zdGFydFBsYWNlLnk7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIubmFtZSA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5pZCA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0gPSBhUGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGVQbGF5ZXIocGxheWVySWQsIHN0YXRlKSB7XHJcbiAgICAgICAgbGV0IHRoZVBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bXBcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0b3BYXCI6XHJcbiAgICAgICAgICAgICAgICB0aGVQbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFgoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFlcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVuZW15KHBsYXllcklkLCBwb3NpdGlvbixzdGF0ZSwgZW5lbXkpIHtcclxuICAgICAgICBsZXQgdGhlUGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaGFzZU5ld1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5jaGFzZVBsYXllcih0aGVQbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJqdW1wXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRDaGlsZEJ5TmFtZShlbmVteSkueCA9IHBvc2l0aW9uWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS55ID0gcG9zaXRpb25bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyAgICBjYXNlIFwic3RvcFhcIjpcclxuICAgICAgICAvLyAgICAgICAgdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLnN0b3BYKCk7XHJcbiAgICAgICAgLy8gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vICAgIGNhc2UgXCJzdG9wWVwiOlxyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFkoKTtcclxuICAgICAgICAvLyAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlUGxheWVyUG9zaXRpb24ocGxheWVyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0ueCA9IHBsYXllci5wb3NYO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLnkgPSBwbGF5ZXIucG9zWTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXS5zZXRTY2FsZShwbGF5ZXIuc2NhbGVYLCBwbGF5ZXIuc2NhbGVZKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBsYXllci5pZCArIFwiIFwiICsgcGxheWVyLnNjYWxlWSArIFwiIFwiICsgcGxheWVyLnNjYWxlWCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUGxheWVyKHBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMuZGVsZXRlKHBsYXllci5pZCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVGltZSh0aW1lKSB7XHJcbiAgICAgICAgLy9jaGFuZ2UgdGltZSBvbiB3YXRjaCBhY2NvcmRpbmcgdG8gY291bnRkb3duIHRpbWVcclxuICAgICAgICBpZiAoKHRoaXMuY291bnREb3duIC0gdGltZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGltZTtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hbmdsZSA9IC0gKCh0aW1lICogMzYwKSAvIHRoaXMuY291bnREb3duIC0gOTApO1xyXG4gICAgICAgICAgICB0aGlzLm15VGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG9ydE9uVGltZSAmJiAodGhpcy5jb3VudERvd24gLSB0aW1lKSA8IDE1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbSA9IHRoaXMud2F0Y2guZ2V0UGFyZW50KCkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInNob3J0T25UaW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaEFuaW0ud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG9ydE9uVGltZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3J0T25UaW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbS5zdG9wKFwic2hvcnRPblRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoLmdldFBhcmVudCgpLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS50aW1lc1VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3J0T25UaW1lID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wbGF5IGxvc2Ugc291bmQgJiBsb3NlIGNyb3duc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLndvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q2hpbGRCeU5hbWUoXCJBVURJT1wiKS5nZXRDaGlsZEJ5TmFtZShcIkxPU0VcIikuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jcm93bnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyb3ducyA+IDMwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Nyb3ducyh0aGlzLnBvaW50c0xvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMoMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zb2NrZXRDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlSXRlbShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBcInVzZWRcIilcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5nZXRDaGlsZEJ5TmFtZSh0eXBlICsgaWQpLmRlc3Ryb3koKTtcclxuICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PSBcInNwYXduXCIpIHtcclxuICAgICAgICAgICAgbGV0IHRoZUl0ZW0gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJwb3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBvdGlvblByZWZhYik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYWtlUHJlZmFiKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzdFByZWZhYik7XHJcblxyXG4gICAgICAgICAgICB0aGVJdGVtLnggPSBwb3NbMF07XHJcbiAgICAgICAgICAgIHRoZUl0ZW0ueSA9IHBvc1sxXTtcclxuICAgICAgICAgICAgdGhlSXRlbS5wYXJlbnQgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgICAgICB0aGVJdGVtLm5hbWUgPSB0eXBlICsgaWQ7XHJcbiAgICAgICAgICAgIHRoZUl0ZW0uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCA9IGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVtb2ppKGlkLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW2lkXS5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5wbGF5RW1vamkodHlwZSk7XHJcbiAgICB9LFxyXG4gICAgc3RhcnRDb3VudERvd24obnVtKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGlmIChudW0gPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmdldENoaWxkQnlOYW1lKFwiTlVNXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbnVtO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWNpZXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVBsYXllclN0YXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0Um9vbVwiOlxyXG4gICAgICAgICAgICAgICAgLy9zZXQgY291bmRvd24gdGltZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudERvd24gPSBteURhdGEuZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzTG9zdCA9IG15RGF0YS5kYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3VudERvd24pO1xyXG4gICAgICAgICAgICAgICAgLy9hZGQgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBteURhdGEuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMobXlEYXRhLmRhdGFbMl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmFkZFdpbm5lcihteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRpbWUgb24gd2F0Y2hcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZShteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZUVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVuZW15KG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoaXMucGxheWVyc1tteURhdGEuZGF0YVswXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbW9qaVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbW9qaShteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBqb2luU2VydmVyKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6XCIgKyB0aGlzLnBvcnRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2UgYXJlIGNvbm5lY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwbGF5ZXJJbmZvXCIsIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBkaWRuJ3QgY2xvc2Ugb24gcHVycG9zZSwgYWxlcnRcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb2NrZXRDbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvclVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICArIFwiOlwiICsgdGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBhcmUgY29ubmVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBsYXllckluZm9cIiwgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpZG4ndCBjbG9zZSBvbiBwdXJwb3NlLCBhbGVydFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvY2tldENsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTsgICBcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChteURhdGEudHlwZSA9PSBcInVwZGF0ZVBsYXllclN0YXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2cobXlEYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKG15RGF0YS5kYXRhWzBdICsgXCIgXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJyZW1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiYWRkUGxheWVyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIobXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInBvc2l0aW9uc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiZmluaXNoXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuYWRkV2lubmVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vIHVwZGF0ZSB0aGUgdGltZSBvbiB3YXRjaFxyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy51cGRhdGVUaW1lKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vdmFyIGluZm8gPSByZXF1aXJlKFwibG9iYnkuanNcIik7XHJcbiAgICAgICAgLy90aGlzLnBsYXllcklkID0gaW5mby5pZDtcclxuICAgICAgICAvL3RoaXMucG9ydCA9IGluZm8ucG9ydDtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludHNMb3N0ID0gNTtcclxuICAgICAgICB0aGlzLnBsYXllcklkID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucGxheWVySWQ7XHJcbiAgICAgICAgdGhpcy5wb3J0ID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikucm9vbTtcclxuICAgICAgICB0aGlzLnNlcnZlcklwID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIikuc2VydmVySXA7XHJcbiAgICAgICAgdGhpcy5jcm93bnMgPSBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5jcm93bnM7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgdGhpcy5qb2luU2VydmVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBpZiAodGhpcy5teVBsYXllciAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLnNlbmRXZWJzb2NrZXRNZXNzYWdlKFwicG9zaXRpb25cIiwgW3RoaXMubXlQbGF5ZXIueCwgdGhpcy5teVBsYXllci55LCByb3VuZE51bWJlcih0aGlzLm15UGxheWVyLnNjYWxlWSw1KSwgcm91bmROdW1iZXIodGhpcy5teVBsYXllci5zY2FsZVgsNSldKTtcclxuXHJcbiAgICB9LFxyXG59KTtcclxuIl19
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
    serverIp: null
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcYWJvdXRQbGF5ZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJwbGF5ZXJJZCIsInJvb20iLCJjcm93bnMiLCJvcGVuaWQiLCJzZXJ2ZXJJcCIsIm9uTG9hZCIsImdhbWUiLCJhZGRQZXJzaXN0Um9vdE5vZGUiLCJub2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsUUFBUSxFQUFFLElBREY7QUFFUkMsSUFBQUEsSUFBSSxFQUFFLElBRkU7QUFHUkMsSUFBQUEsTUFBTSxFQUFFLENBSEE7QUFJUkMsSUFBQUEsTUFBTSxFQUFFLElBSkE7QUFLUkMsSUFBQUEsUUFBUSxFQUFFO0FBTEYsR0FIUDtBQVdMO0FBRUFDLEVBQUFBLE1BYkssb0JBYUk7QUFDTFQsSUFBQUEsRUFBRSxDQUFDVSxJQUFILENBQVFDLGtCQUFSLENBQTJCLEtBQUtDLElBQWhDO0FBQ0gsR0FmSSxDQWlCTDs7QUFqQkssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBwbGF5ZXJJZDogbnVsbCxcclxuICAgICAgICByb29tOiBudWxsLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBvcGVuaWQ6IG51bGwsXHJcbiAgICAgICAgc2VydmVySXA6IG51bGwsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBjYy5nYW1lLmFkZFBlcnNpc3RSb290Tm9kZSh0aGlzLm5vZGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------
