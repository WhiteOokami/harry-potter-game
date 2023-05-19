
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