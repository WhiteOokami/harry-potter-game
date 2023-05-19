
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