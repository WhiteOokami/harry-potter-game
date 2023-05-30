
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
    maxOffset: 20,
    startY: 0
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.startPos = [0, 0, 0, 0, 0, 0, 0];
  },
  start: function start() {
    startY = this.player.y;
  },
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
      this.node.y = this.player.y + (this.player.y - startY) * 0.5;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2FtZXJhRm9sbG93LmpzIl0sIm5hbWVzIjpbInBsYXllciIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZm9sbG93aW5nIiwidWkiLCJOb2RlIiwieU9mZnNldCIsInN0YXJ0UG9zIiwieE9mZnNldFBsYXllciIsInlPZmZzZXRQbGF5ZXIiLCJtYXhPZmZzZXQiLCJzdGFydFkiLCJvbkxvYWQiLCJzdGFydCIsInkiLCJ1cGRhdGUiLCJkdCIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJteVBsYXllciIsInBsYXllcklkIiwibSIsIm1vdmluZ1JpZ2h0IiwibW92aW5nTGVmdCIsIm5vZGUiLCJ4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLE1BQU0sR0FBRyxJQUFiO0FBRUFDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSSixJQUFBQSxNQUFNLEVBQUUsSUFEQTtBQUVSSyxJQUFBQSxTQUFTLEVBQUUsS0FGSDtBQUdSO0FBQ0FDLElBQUFBLEVBQUUsRUFBRUwsRUFBRSxDQUFDTSxJQUpDO0FBS1JDLElBQUFBLE9BQU8sRUFBRSxDQUxEO0FBTVI7QUFDQUMsSUFBQUEsUUFBUSxFQUFFLEVBUEY7QUFRUkMsSUFBQUEsYUFBYSxFQUFFLENBUlA7QUFTUkMsSUFBQUEsYUFBYSxFQUFFLENBVFA7QUFVUkMsSUFBQUEsU0FBUyxFQUFFLEVBVkg7QUFXUkMsSUFBQUEsTUFBTSxFQUFFO0FBWEEsR0FIUDtBQWlCTDtBQUVBQyxFQUFBQSxNQW5CSyxvQkFtQkk7QUFDTCxTQUFLTCxRQUFMLEdBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDSCxHQXJCSTtBQXdCTE0sRUFBQUEsS0F4QkssbUJBd0JHO0FBQ0pGLElBQUFBLE1BQU0sR0FBRyxLQUFLYixNQUFMLENBQVlnQixDQUFyQjtBQUNILEdBMUJJO0FBNEJMQyxFQUFBQSxNQTVCSyxrQkE0QkVDLEVBNUJGLEVBNEJNO0FBQ1AsUUFBSSxDQUFDLEtBQUtiLFNBQVYsRUFBcUI7QUFDakIsVUFBSUosRUFBRSxDQUFDa0IsSUFBSCxDQUFRLFFBQVIsRUFBa0JDLFlBQWxCLENBQStCLFFBQS9CLEVBQXlDQyxRQUF6QyxJQUFxRCxJQUF6RCxFQUErRDtBQUMzRCxhQUFLckIsTUFBTCxHQUFjQyxFQUFFLENBQUNrQixJQUFILENBQVEsb0JBQW9CbEIsRUFBRSxDQUFDa0IsSUFBSCxDQUFRLFFBQVIsRUFBa0JDLFlBQWxCLENBQStCLFFBQS9CLEVBQXlDRSxRQUFyRSxDQUFkO0FBQ0EsYUFBS2pCLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKLEtBTEQsTUFLTztBQUNILFVBQUlrQixDQUFDLEdBQUcsS0FBS3ZCLE1BQUwsQ0FBWW9CLFlBQVosQ0FBeUIsVUFBekIsQ0FBUjtBQUNBLFVBQUdHLENBQUMsQ0FBQ0MsV0FBRixJQUFpQixLQUFLZCxhQUFMLEdBQXFCLEtBQUtFLFNBQTlDLEVBQ0ksS0FBS0YsYUFBTCxJQUFzQixLQUFHUSxFQUF6QixDQURKLEtBRUssSUFBR0ssQ0FBQyxDQUFDRSxVQUFGLElBQWdCLEtBQUtmLGFBQUwsR0FBcUIsQ0FBQyxLQUFLRSxTQUE5QyxFQUNELEtBQUtGLGFBQUwsSUFBc0IsS0FBR1EsRUFBekIsQ0FEQyxLQUdELEtBQUtSLGFBQUwsSUFBb0IsRUFBcEI7QUFDSixXQUFLZ0IsSUFBTCxDQUFVQyxDQUFWLEdBQWMsS0FBSzNCLE1BQUwsQ0FBWTJCLENBQVosR0FBZ0IsS0FBS2pCLGFBQW5DO0FBQ0EsV0FBS2dCLElBQUwsQ0FBVVYsQ0FBVixHQUFjLEtBQUtoQixNQUFMLENBQVlnQixDQUFaLEdBQWdCLENBQUMsS0FBS2hCLE1BQUwsQ0FBWWdCLENBQVosR0FBY0gsTUFBZixJQUF1QixHQUFyRDtBQUNILEtBaEJNLENBaUJQO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQUtQLEVBQUwsQ0FBUXFCLENBQVIsR0FBWSxLQUFLRCxJQUFMLENBQVVDLENBQXRCO0FBQ0EsU0FBS3JCLEVBQUwsQ0FBUVUsQ0FBUixHQUFZLEtBQUtVLElBQUwsQ0FBVVYsQ0FBdEI7QUFDSDtBQXhESSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgcGxheWVyID0gbnVsbDtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVyOiBudWxsLFxyXG4gICAgICAgIGZvbGxvd2luZzogZmFsc2UsXHJcbiAgICAgICAgLy8gYmFja2dyb3VuZDogY2MuTm9kZSxcclxuICAgICAgICB1aTogY2MuTm9kZSxcclxuICAgICAgICB5T2Zmc2V0OiAwLFxyXG4gICAgICAgIC8vIHBhcmFsYXhMYXllcnM6IFtjYy5Ob2RlXSxcclxuICAgICAgICBzdGFydFBvczogW10sXHJcbiAgICAgICAgeE9mZnNldFBsYXllcjogMCxcclxuICAgICAgICB5T2Zmc2V0UGxheWVyOiAwLFxyXG4gICAgICAgIG1heE9mZnNldDogMjAsXHJcbiAgICAgICAgc3RhcnRZOiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHN0YXJ0WSA9IHRoaXMucGxheWVyLnk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5mb2xsb3dpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLm15UGxheWVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzL1wiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikucGxheWVySWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2xsb3dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG0gPSB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKVxyXG4gICAgICAgICAgICBpZihtLm1vdmluZ1JpZ2h0ICYmIHRoaXMueE9mZnNldFBsYXllciA8IHRoaXMubWF4T2Zmc2V0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy54T2Zmc2V0UGxheWVyICs9IDIwKmR0XHJcbiAgICAgICAgICAgIGVsc2UgaWYobS5tb3ZpbmdMZWZ0ICYmIHRoaXMueE9mZnNldFBsYXllciA+IC10aGlzLm1heE9mZnNldClcclxuICAgICAgICAgICAgICAgIHRoaXMueE9mZnNldFBsYXllciAtPSAyMCpkdFxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhPZmZzZXRQbGF5ZXIvPTEwXHJcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5wbGF5ZXIueCArIHRoaXMueE9mZnNldFBsYXllcjtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLnBsYXllci55ICsgKHRoaXMucGxheWVyLnktc3RhcnRZKSowLjU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXJhbGF4TGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMucGFyYWxheExheWVyc1tpXS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCAvIChpICsgMSkgKiAyICsgdGhpcy5zdGFydFBvc1tpXSwgdGhpcy5ub2RlLnkgLyAoaSArIDEpICogMik7XHJcblxyXG4gICAgICAgIC8vICAgICBpZiAoTWF0aC5hYnModGhpcy5ub2RlLnggLSB0aGlzLnBhcmFsYXhMYXllcnNbaV0ueCkgPj0gKHRoaXMucGFyYWxheExheWVyc1tpXS53aWR0aCAtIHRoaXMubm9kZS53aWR0aCkpIHtcclxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLnNldFBvc2l0aW9uKHRoaXMubm9kZS54ICsgKHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLngpLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0YXJ0UG9zW2ldICs9IHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLng7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5iYWNrZ3JvdW5kLnNldFBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy51aS54ID0gdGhpcy5ub2RlLng7XHJcbiAgICAgICAgdGhpcy51aS55ID0gdGhpcy5ub2RlLnk7XHJcbiAgICB9LFxyXG59KTtcclxuIl19