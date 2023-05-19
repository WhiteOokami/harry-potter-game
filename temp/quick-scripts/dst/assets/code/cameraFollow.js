
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
    background: cc.Node,
    ui: cc.Node,
    yOffset: 0,
    paralaxLayers: [cc.Node],
    startPos: [],
    xOffsetPlayer: 0,
    yOffsetPlayer: 0
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
      this.node.x = this.player.x + this.xOffsetPlayer;
      this.node.y = this.player.y + this.yOffset + this.yOffsetPlayer;
    }

    for (var i = 0; i < this.paralaxLayers.length; i++) {
      this.paralaxLayers[i].setPosition(this.node.x / (i + 1) * 2 + this.startPos[i], this.node.y / (i + 1) * 2);

      if (Math.abs(this.node.x - this.paralaxLayers[i].x) >= this.paralaxLayers[i].width - this.node.width) {
        //this.paralaxLayers[i].setPosition(this.node.x + (this.node.x - this.paralaxLayers[i].x), this.node.y);
        this.startPos[i] += this.node.x - this.paralaxLayers[i].x;
      }
    }

    this.background.setPosition(this.node.x, this.node.y);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2FtZXJhRm9sbG93LmpzIl0sIm5hbWVzIjpbInBsYXllciIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZm9sbG93aW5nIiwiYmFja2dyb3VuZCIsIk5vZGUiLCJ1aSIsInlPZmZzZXQiLCJwYXJhbGF4TGF5ZXJzIiwic3RhcnRQb3MiLCJ4T2Zmc2V0UGxheWVyIiwieU9mZnNldFBsYXllciIsIm9uTG9hZCIsInN0YXJ0IiwidXBkYXRlIiwiZHQiLCJmaW5kIiwiZ2V0Q29tcG9uZW50IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCIsIm5vZGUiLCJ4IiwieSIsImkiLCJsZW5ndGgiLCJzZXRQb3NpdGlvbiIsIk1hdGgiLCJhYnMiLCJ3aWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFNLEdBQUcsSUFBYjtBQUVBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkosSUFBQUEsTUFBTSxFQUFFLElBREE7QUFFUkssSUFBQUEsU0FBUyxFQUFFLEtBRkg7QUFHUkMsSUFBQUEsVUFBVSxFQUFFTCxFQUFFLENBQUNNLElBSFA7QUFJUkMsSUFBQUEsRUFBRSxFQUFFUCxFQUFFLENBQUNNLElBSkM7QUFLUkUsSUFBQUEsT0FBTyxFQUFFLENBTEQ7QUFNUkMsSUFBQUEsYUFBYSxFQUFFLENBQUNULEVBQUUsQ0FBQ00sSUFBSixDQU5QO0FBT1JJLElBQUFBLFFBQVEsRUFBRSxFQVBGO0FBUVJDLElBQUFBLGFBQWEsRUFBRSxDQVJQO0FBU1JDLElBQUFBLGFBQWEsRUFBRTtBQVRQLEdBSFA7QUFlTDtBQUVBQyxFQUFBQSxNQWpCSyxvQkFpQkk7QUFDTCxTQUFLSCxRQUFMLEdBQWdCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBaEI7QUFDSCxHQW5CSTtBQXNCTEksRUFBQUEsS0F0QkssbUJBc0JHLENBQ1AsQ0F2Qkk7QUF5QkxDLEVBQUFBLE1BekJLLGtCQXlCRUMsRUF6QkYsRUF5Qk07QUFDUCxRQUFJLENBQUMsS0FBS1osU0FBVixFQUFxQjtBQUNqQixVQUFJSixFQUFFLENBQUNpQixJQUFILENBQVEsUUFBUixFQUFrQkMsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNDLFFBQXpDLElBQXFELElBQXpELEVBQStEO0FBQzNELGFBQUtwQixNQUFMLEdBQWNDLEVBQUUsQ0FBQ2lCLElBQUgsQ0FBUSxvQkFBb0JqQixFQUFFLENBQUNpQixJQUFILENBQVEsUUFBUixFQUFrQkMsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUNFLFFBQXJFLENBQWQ7QUFDQSxhQUFLaEIsU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBQ0osS0FMRCxNQUtPO0FBQ0gsV0FBS2lCLElBQUwsQ0FBVUMsQ0FBVixHQUFjLEtBQUt2QixNQUFMLENBQVl1QixDQUFaLEdBQWdCLEtBQUtYLGFBQW5DO0FBQ0EsV0FBS1UsSUFBTCxDQUFVRSxDQUFWLEdBQWMsS0FBS3hCLE1BQUwsQ0FBWXdCLENBQVosR0FBZ0IsS0FBS2YsT0FBckIsR0FBK0IsS0FBS0ksYUFBbEQ7QUFDSDs7QUFDRCxTQUFLLElBQUlZLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2YsYUFBTCxDQUFtQmdCLE1BQXZDLEVBQStDRCxDQUFDLEVBQWhELEVBQW9EO0FBQ2hELFdBQUtmLGFBQUwsQ0FBbUJlLENBQW5CLEVBQXNCRSxXQUF0QixDQUFrQyxLQUFLTCxJQUFMLENBQVVDLENBQVYsSUFBZUUsQ0FBQyxHQUFHLENBQW5CLElBQXdCLENBQXhCLEdBQTRCLEtBQUtkLFFBQUwsQ0FBY2MsQ0FBZCxDQUE5RCxFQUFnRixLQUFLSCxJQUFMLENBQVVFLENBQVYsSUFBZUMsQ0FBQyxHQUFHLENBQW5CLElBQXdCLENBQXhHOztBQUVBLFVBQUlHLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEtBQUtQLElBQUwsQ0FBVUMsQ0FBVixHQUFjLEtBQUtiLGFBQUwsQ0FBbUJlLENBQW5CLEVBQXNCRixDQUE3QyxLQUFvRCxLQUFLYixhQUFMLENBQW1CZSxDQUFuQixFQUFzQkssS0FBdEIsR0FBOEIsS0FBS1IsSUFBTCxDQUFVUSxLQUFoRyxFQUF3RztBQUNwRztBQUNBLGFBQUtuQixRQUFMLENBQWNjLENBQWQsS0FBb0IsS0FBS0gsSUFBTCxDQUFVQyxDQUFWLEdBQWMsS0FBS2IsYUFBTCxDQUFtQmUsQ0FBbkIsRUFBc0JGLENBQXhEO0FBQ0g7QUFDSjs7QUFDRCxTQUFLakIsVUFBTCxDQUFnQnFCLFdBQWhCLENBQTRCLEtBQUtMLElBQUwsQ0FBVUMsQ0FBdEMsRUFBeUMsS0FBS0QsSUFBTCxDQUFVRSxDQUFuRDtBQUNBLFNBQUtoQixFQUFMLENBQVFlLENBQVIsR0FBWSxLQUFLRCxJQUFMLENBQVVDLENBQXRCO0FBQ0EsU0FBS2YsRUFBTCxDQUFRZ0IsQ0FBUixHQUFZLEtBQUtGLElBQUwsQ0FBVUUsQ0FBdEI7QUFDSDtBQTlDSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgcGxheWVyID0gbnVsbDtcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVyOiBudWxsLFxyXG4gICAgICAgIGZvbGxvd2luZzogZmFsc2UsXHJcbiAgICAgICAgYmFja2dyb3VuZDogY2MuTm9kZSxcclxuICAgICAgICB1aTogY2MuTm9kZSxcclxuICAgICAgICB5T2Zmc2V0OiAwLFxyXG4gICAgICAgIHBhcmFsYXhMYXllcnM6IFtjYy5Ob2RlXSxcclxuICAgICAgICBzdGFydFBvczogW10sXHJcbiAgICAgICAgeE9mZnNldFBsYXllcjogMCxcclxuICAgICAgICB5T2Zmc2V0UGxheWVyOiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5wbGF5ZXIueCArIHRoaXMueE9mZnNldFBsYXllcjtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLnBsYXllci55ICsgdGhpcy55T2Zmc2V0ICsgdGhpcy55T2Zmc2V0UGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFyYWxheExheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmFsYXhMYXllcnNbaV0uc2V0UG9zaXRpb24odGhpcy5ub2RlLnggLyAoaSArIDEpICogMiArIHRoaXMuc3RhcnRQb3NbaV0sIHRoaXMubm9kZS55IC8gKGkgKyAxKSAqIDIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMubm9kZS54IC0gdGhpcy5wYXJhbGF4TGF5ZXJzW2ldLngpID49ICh0aGlzLnBhcmFsYXhMYXllcnNbaV0ud2lkdGggLSB0aGlzLm5vZGUud2lkdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMucGFyYWxheExheWVyc1tpXS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCArICh0aGlzLm5vZGUueCAtIHRoaXMucGFyYWxheExheWVyc1tpXS54KSwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFBvc1tpXSArPSB0aGlzLm5vZGUueCAtIHRoaXMucGFyYWxheExheWVyc1tpXS54O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMudWkueCA9IHRoaXMubm9kZS54O1xyXG4gICAgICAgIHRoaXMudWkueSA9IHRoaXMubm9kZS55O1xyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==