
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
    // paralaxLayers: [cc.Node],
    startPos: [],
    xOffsetPlayer: 0,
    maxOffset: 50,
    startY: 0
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.startPos = [0, 0, 0, 0, 0, 0, 0];
  },
  update: function update(dt) {
    if (!this.following) {
      if (cc.find("system").getComponent("client").myPlayer != null) {
        this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        this.following = true;
      }
    } else {
      var m = this.player.getComponent("movement");
      if (m.movingRight && this.xOffsetPlayer < this.maxOffset) this.xOffsetPlayer += 40 * dt;else if (m.movingLeft && this.xOffsetPlayer > -this.maxOffset) this.xOffsetPlayer -= 40 * dt;else this.xOffsetPlayer /= 2;
      this.node.x = this.player.x + this.xOffsetPlayer;
      this.node.y = this.startY + (this.player.y = this.startY) / 2;
    } // for (let i = 0; i < this.paralaxLayers.length; i++) {
    //     this.paralaxLayers[i].setPosition(this.node.x / (i + 1) * 2 + this.startPos[i], this.node.y / (i + 1) * 2);
    //     if (Math.abs(this.node.x - this.paralaxLayers[i].x) >= (this.paralaxLayers[i].width - this.node.width)) {
    //         //this.paralaxLayers[i].setPosition(this.node.x + (this.node.x - this.paralaxLayers[i].x), this.node.y);
    //         this.startPos[i] += this.node.x - this.paralaxLayers[i].x;
    //     }
    // }
    // this.background.setPosition(this.node.x, this.node.y);
    // this.ui.x = this.node.x;
    // this.ui.y = this.node.y;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2FtZXJhRm9sbG93LmpzIl0sIm5hbWVzIjpbInBsYXllciIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZm9sbG93aW5nIiwidWkiLCJOb2RlIiwic3RhcnRQb3MiLCJ4T2Zmc2V0UGxheWVyIiwibWF4T2Zmc2V0Iiwic3RhcnRZIiwib25Mb2FkIiwidXBkYXRlIiwiZHQiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCIsIm0iLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJub2RlIiwieCIsInkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBTSxHQUFHLElBQWI7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JKLElBQUFBLE1BQU0sRUFBRSxJQURBO0FBRVJLLElBQUFBLFNBQVMsRUFBRSxLQUZIO0FBR1I7QUFDQUMsSUFBQUEsRUFBRSxFQUFFTCxFQUFFLENBQUNNLElBSkM7QUFLUjtBQUNBQyxJQUFBQSxRQUFRLEVBQUUsRUFORjtBQU9SQyxJQUFBQSxhQUFhLEVBQUUsQ0FQUDtBQVFSQyxJQUFBQSxTQUFTLEVBQUUsRUFSSDtBQVNSQyxJQUFBQSxNQUFNLEVBQUU7QUFUQSxHQUhQO0FBZUw7QUFFQUMsRUFBQUEsTUFqQkssb0JBaUJJO0FBQ0wsU0FBS0osUUFBTCxHQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQWhCO0FBQ0gsR0FuQkk7QUFzQkxLLEVBQUFBLE1BdEJLLGtCQXNCRUMsRUF0QkYsRUFzQk07QUFDUCxRQUFJLENBQUMsS0FBS1QsU0FBVixFQUFxQjtBQUNqQixVQUFJSixFQUFFLENBQUNjLElBQUgsQ0FBUSxRQUFSLEVBQWtCQyxZQUFsQixDQUErQixRQUEvQixFQUF5Q0MsUUFBekMsSUFBcUQsSUFBekQsRUFBK0Q7QUFDM0QsYUFBS2pCLE1BQUwsR0FBY0MsRUFBRSxDQUFDYyxJQUFILENBQVEsb0JBQW9CZCxFQUFFLENBQUNjLElBQUgsQ0FBUSxRQUFSLEVBQWtCQyxZQUFsQixDQUErQixRQUEvQixFQUF5Q0UsUUFBckUsQ0FBZDtBQUNBLGFBQUtiLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKLEtBTEQsTUFLTztBQUNILFVBQUljLENBQUMsR0FBRyxLQUFLbkIsTUFBTCxDQUFZZ0IsWUFBWixDQUF5QixVQUF6QixDQUFSO0FBQ0EsVUFBR0csQ0FBQyxDQUFDQyxXQUFGLElBQWlCLEtBQUtYLGFBQUwsR0FBcUIsS0FBS0MsU0FBOUMsRUFDSSxLQUFLRCxhQUFMLElBQXNCLEtBQUdLLEVBQXpCLENBREosS0FFSyxJQUFHSyxDQUFDLENBQUNFLFVBQUYsSUFBZ0IsS0FBS1osYUFBTCxHQUFxQixDQUFDLEtBQUtDLFNBQTlDLEVBQ0QsS0FBS0QsYUFBTCxJQUFzQixLQUFHSyxFQUF6QixDQURDLEtBR0QsS0FBS0wsYUFBTCxJQUFvQixDQUFwQjtBQUNKLFdBQUthLElBQUwsQ0FBVUMsQ0FBVixHQUFjLEtBQUt2QixNQUFMLENBQVl1QixDQUFaLEdBQWdCLEtBQUtkLGFBQW5DO0FBQ0EsV0FBS2EsSUFBTCxDQUFVRSxDQUFWLEdBQWMsS0FBS2IsTUFBTCxHQUFjLENBQUMsS0FBS1gsTUFBTCxDQUFZd0IsQ0FBWixHQUFjLEtBQUtiLE1BQXBCLElBQTRCLENBQXhEO0FBQ0gsS0FoQk0sQ0FpQlA7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0g7QUFsREksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHBsYXllciA9IG51bGw7XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcjogbnVsbCxcclxuICAgICAgICBmb2xsb3dpbmc6IGZhbHNlLFxyXG4gICAgICAgIC8vIGJhY2tncm91bmQ6IGNjLk5vZGUsXHJcbiAgICAgICAgdWk6IGNjLk5vZGUsXHJcbiAgICAgICAgLy8gcGFyYWxheExheWVyczogW2NjLk5vZGVdLFxyXG4gICAgICAgIHN0YXJ0UG9zOiBbXSxcclxuICAgICAgICB4T2Zmc2V0UGxheWVyOiAwLFxyXG4gICAgICAgIG1heE9mZnNldDogNTAsXHJcbiAgICAgICAgc3RhcnRZOiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5mb2xsb3dpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLm15UGxheWVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzL1wiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2xsb3dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG0gPSB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKVxyXG4gICAgICAgICAgICBpZihtLm1vdmluZ1JpZ2h0ICYmIHRoaXMueE9mZnNldFBsYXllciA8IHRoaXMubWF4T2Zmc2V0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy54T2Zmc2V0UGxheWVyICs9IDQwKmR0XHJcbiAgICAgICAgICAgIGVsc2UgaWYobS5tb3ZpbmdMZWZ0ICYmIHRoaXMueE9mZnNldFBsYXllciA+IC10aGlzLm1heE9mZnNldClcclxuICAgICAgICAgICAgICAgIHRoaXMueE9mZnNldFBsYXllciAtPSA0MCpkdFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhPZmZzZXRQbGF5ZXIvPTJcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLnBsYXllci54ICsgdGhpcy54T2Zmc2V0UGxheWVyO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSA9IHRoaXMuc3RhcnRZICsgKHRoaXMucGxheWVyLnk9dGhpcy5zdGFydFkpLzI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXJhbGF4TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMucGFyYWxheExheWVyc1tpXS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCAvIChpICsgMSkgKiAyICsgdGhpcy5zdGFydFBvc1tpXSwgdGhpcy5ub2RlLnkgLyAoaSArIDEpICogMik7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoTWF0aC5hYnModGhpcy5ub2RlLnggLSB0aGlzLnBhcmFsYXhMYXllcnNbaV0ueCkgPj0gKHRoaXMucGFyYWxheExheWVyc1tpXS53aWR0aCAtIHRoaXMubm9kZS53aWR0aCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLnNldFBvc2l0aW9uKHRoaXMubm9kZS54ICsgKHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLngpLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0UG9zW2ldICs9IHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLng7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5iYWNrZ3JvdW5kLnNldFBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gdGhpcy51aS54ID0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgLy8gdGhpcy51aS55ID0gdGhpcy5ub2RlLnk7XHJcbiAgICB9LFxyXG59KTtcclxuIl19