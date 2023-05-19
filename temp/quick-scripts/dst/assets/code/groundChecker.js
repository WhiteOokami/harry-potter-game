
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