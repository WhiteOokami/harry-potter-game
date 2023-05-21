
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