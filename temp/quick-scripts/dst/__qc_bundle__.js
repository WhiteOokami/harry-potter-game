
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
require('./assets/code/colorTheme');
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
    this.emojiButton.active = !this.emojiButton.active;
    this.emojiUI.active = !this.emojiUI.active;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ2FtZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXN0YW5jZVRleHQiLCJOb2RlIiwiZGlzdGFuY2UiLCJwbGF5ZXIiLCJmb2xsb3dpbmciLCJlbmRQb3NpdGlvbiIsImdhbWVFbmRlZCIsIndpbm5lckNhbnZhIiwiZmluaXNoZWRQbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwidGltZXNVcFVpIiwic3Bhd24iLCJjYW1lcmEiLCJwbGF5ZXJzIiwic3BlY3RhdGVJbmRleCIsInNwZWN0YXRlVUkiLCJlbW9qaUJ1dHRvbiIsImVtb2ppVUkiLCJtb2JpbGVDb250cm9sbGVyIiwibnVtRmluaXNoZWQiLCJjcm93bnNOb2RlIiwib25Mb2FkIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZW5hYmxlZCIsImdhbWUiLCJzZXRGcmFtZVJhdGUiLCJhZGRXaW5uZXIiLCJwbGFjZSIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhUGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJnZXRDaGlsZEJ5TmFtZSIsIm5hbWUiLCJmaW5kIiwibXlUaW1lIiwidGltZXNVcCIsImRpc2FibGUiLCJhY3RpdmUiLCJzaG93Q3Jvd25zIiwiY3Jvd25zIiwiY29uc29sZSIsImxvZyIsInNob3dXaW5uZXJzIiwiY2xvc2VDcm93bnMiLCJjbG9zZVNwZWN0YXRlIiwiZ29CYWNrVG9Mb2JieSIsImRpc2Nvbm5lY3QiLCJsb2FkU2NlbmUiLCJjb25maXJtVGltZXNVcCIsIm9wZW5TcGVjdGF0ZVVpIiwic2hvd0Vtb2ppcyIsInNlcGN0YXRlUHJldiIsIm5ld1BsYXllciIsInNwZWN0YXRlTmV4dCIsInVwZGF0ZSIsImR0IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7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VCxFQUFvQjtBQUNoQixhQUFLSCxNQUFMLENBQVkyQixZQUFaLENBQXlCLFVBQXpCLEVBQXFDYyxNQUFyQyxHQUE4QyxLQUE5QztBQUNBLGFBQUt6QixnQkFBTCxDQUFzQnlCLE1BQXRCLEdBQStCLEtBQS9CO0FBQ0g7QUFDSjtBQUVKO0FBdkhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgZGlzdGFuY2VUZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGRpc3RhbmNlOiAwLFxyXG4gICAgICAgIHBsYXllcjogY2MuTm9kZSxcclxuICAgICAgICBmb2xsb3dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGVuZFBvc2l0aW9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGdhbWVFbmRlZDogZmFsc2UsXHJcbiAgICAgICAgd2lubmVyQ2FudmE6IGNjLk5vZGUsXHJcbiAgICAgICAgZmluaXNoZWRQbGF5ZXJzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHRpbWVzVXBVaTogY2MuTm9kZSxcclxuICAgICAgICBzcGF3bjogY2MuTm9kZSxcclxuICAgICAgICBjYW1lcmE6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyczogY2MuTm9kZSxcclxuICAgICAgICBzcGVjdGF0ZUluZGV4OiAwLFxyXG4gICAgICAgIHNwZWN0YXRlVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlVSTogY2MuTm9kZSxcclxuICAgICAgICBtb2JpbGVDb250cm9sbGVyOiBjYy5Ob2RlLFxyXG4gICAgICAgIG51bUZpbmlzaGVkOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNyb3duc05vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY2MuZ2FtZS5zZXRGcmFtZVJhdGUoNjApO1xyXG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWREZWJ1Z0RyYXcgPSB0cnVlOyBcclxuICAgICAgICAvL2NjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRHJhd0JvdW5kaW5nQm94ID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgYWRkV2lubmVyKHBsYXllciwgcGxhY2UpIHtcclxuICAgICAgICB0aGlzLm51bUZpbmlzaGVkLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxhY2UgKyBcIi9cIiArIHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGggKyBcIiBmaW5pc2hlZFwiO1xyXG4gICAgICAgIGxldCBhUGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpO1xyXG4gICAgICAgIGFQbGF5ZXIucGFyZW50ID0gdGhpcy5maW5pc2hlZFBsYXllcnM7XHJcbiAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlRFWFRcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZSArIFwiIGZpbmlzaGVkIGluIFwiICsgcGxhY2UgKyBcIiBwbGFjZSAgIFwiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikubXlUaW1lICsgXCJzXCI7XHJcbiAgICB9LFxyXG4gICAgdGltZXNVcCgpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGltZXNVcFVpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Nyb3ducyhjcm93bnMpIHtcclxuICAgICAgICB0aGlzLmNyb3duc05vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjcm93bnMpO1xyXG4gICAgICAgIGlmIChjcm93bnMgPiAwKVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIisgXCIgKyBjcm93bnM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjcm93bnM7XHJcbiAgICB9LFxyXG4gICAgc2hvd1dpbm5lcnMoY3Jvd25zKSB7XHJcbiAgICAgICAgdGhpcy53aW5uZXJDYW52YS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlQ3Jvd25zKCkge1xyXG4gICAgICAgIHRoaXMuY3Jvd25zTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZVNwZWN0YXRlKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgZ29CYWNrVG9Mb2JieSgpIHtcclxuICAgICAgICAvLyBnbyBiYWNrIHRvIGxvYmJ5XHJcbiAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgY29uZmlybVRpbWVzVXAoKSB7XHJcbiAgICAgICAgdGhpcy50aW1lc1VwVWkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaG93V2lubmVycygpO1xyXG4gICAgfSxcclxuICAgIG9wZW5TcGVjdGF0ZVVpKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcGVjdGF0ZVVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Vtb2ppcygpIHtcclxuICAgICAgICB0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZSA9ICF0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gIXRoaXMuZW1vamlVSS5hY3RpdmU7XHJcbiAgICB9LFxyXG4gICAgc2VwY3RhdGVQcmV2KCkge1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCAtPTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlY3RhdGVJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICBzcGVjdGF0ZU5leHQoKSB7XHJcbiAgICAgICAgLy8gc3BlY3RhdGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICB0aGlzLnNwZWN0YXRlSW5kZXggKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVjdGF0ZUluZGV4ID49IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRmluaXNoZWQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIjAvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXN0YW5jZSA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLmVuZFBvc2l0aW9uLnggLSB0aGlzLnBsYXllci54KSwgMikgKyBNYXRoLnBvdygodGhpcy5lbmRQb3NpdGlvbi55IC0gdGhpcy5wbGF5ZXIueSksIDIpKSAvIDEwKTtcclxuICAgICAgICAgICAgLy90aGlzLmRpc3RhbmNlVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuZGlzdGFuY2UgKyBcIiBtXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vYmlsZUNvbnRyb2xsZXIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==
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
    houseIndex: 0,
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
    this.node.getComponent("gameManager").showEmojis();
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
    var abp = cc.find("MANAGER").getComponent("aboutPlayer");
    this.playerId = abp.playerId;
    this.port = abp.room;
    this.serverIp = abp.serverIp;
    this.crowns = abp.crowns;
    this.houseIndex = abp.houseIndex;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY2xpZW50LmpzIl0sIm5hbWVzIjpbInBheUxvYWQiLCJ0eXBlIiwiZGF0YSIsIlBsYXllckRhdGEiLCJpZCIsIngiLCJwb3NYIiwicG9zWSIsInNjYWxlWSIsInNjYWxlWCIsImxpdmVzIiwibmFtZSIsInN0YXR1cyIsImtleSIsInJvdW5kTnVtYmVyIiwicm51bSIsInJsZW5ndGgiLCJuZXdudW1iZXIiLCJNYXRoIiwicm91bmQiLCJwb3ciLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllcklkIiwid3MiLCJwbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwibXlQbGF5ZXIiLCJwb3J0Iiwic3RhcnRQbGFjZSIsIk5vZGUiLCJ0aW1lciIsIndhdGNoIiwibXlUaW1lIiwiZW5lbWllcyIsIndvbiIsImNvdW50RG93biIsIml0ZW1zIiwic2hvcnRPblRpbWUiLCJ3YXRjaEFuaW0iLCJBbmltYXRpb24iLCJjb25uZWN0aW9uRXJyb3JVSSIsInNvY2tldENsb3NlZCIsInBvdGlvblByZWZhYiIsImNha2VQcmVmYWIiLCJnYW1lU3RhcnRlZCIsInN0YXJ0U2NyZWVuIiwiY3Jvd25zIiwiaG91c2VJbmRleCIsImNoZXN0UHJlZmFiIiwic2VydmVySXAiLCJwb2ludHNMb3N0Iiwic2VuZFdlYnNvY2tldE1lc3NhZ2UiLCJtZXNzYWdlIiwiYWN0aXZlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VuZFBsYXllclN0YXRlIiwic3RhdGUiLCJzZW5kRW5lbXlTdGF0ZSIsInBvc2l0aW9uIiwiZW5lbXkiLCJzZW5kSXRlbVN0YXRlIiwicG9zIiwic2NoZWR1bGVPbmNlIiwic2VuZEVtb2ppIiwiZXZlbnQiLCJjdXN0b21FdmVudERhdGEiLCJub2RlIiwiZ2V0Q29tcG9uZW50Iiwic2hvd0Vtb2ppcyIsImNyZWF0ZVBsYXllciIsInBsYXllciIsImluc3RhbnRpYXRlIiwicGFyZW50IiwiZmluZCIsInkiLCJnZXRDaGlsZEJ5TmFtZSIsIkxhYmVsIiwic3RyaW5nIiwiYVBsYXllciIsImNvbG9yIiwiQ29sb3IiLCJXSElURSIsInVwZGF0ZVBsYXllciIsInRoZVBsYXllciIsIm1vdmVSaWdodCIsIm1vdmVMZWZ0IiwianVtcCIsInN0b3BYIiwic3RvcFkiLCJ1cGRhdGVFbmVteSIsImNoYXNlUGxheWVyIiwidXBkYXRlUGxheWVyUG9zaXRpb24iLCJzZXRTY2FsZSIsInJlbW92ZVBsYXllciIsImRlc3Ryb3kiLCJ1cGRhdGVUaW1lIiwidGltZSIsImFuZ2xlIiwiZ2V0UGFyZW50IiwicGxheSIsIndyYXBNb2RlIiwiV3JhcE1vZGUiLCJMb29wIiwic3RvcCIsIlJFRCIsInRpbWVzVXAiLCJBdWRpb1NvdXJjZSIsImNvbnNvbGUiLCJsb2ciLCJzaG93Q3Jvd25zIiwiZGlzY29ubmVjdCIsIm9zIiwiY2xvc2VTb2NrZXQiLCJjbG9zZSIsInVwZGF0ZUl0ZW0iLCJ0aGVJdGVtIiwidXBkYXRlRW1vamkiLCJwbGF5RW1vamkiLCJzdGFydENvdW50RG93biIsIm51bSIsInJlY2lldmVNZXNzYWdlIiwibXlEYXRhIiwicGFyc2UiLCJpIiwic2hvd1dpbm5lcnMiLCJhZGRXaW5uZXIiLCJqb2luU2VydmVyIiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Mb2FkIiwiYWJwIiwicm9vbSIsIk1hcCIsInN0YXJ0IiwidXBkYXRlIiwiZHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BLFVBQ0YsaUJBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCO0FBQ3BCLE9BQUtELElBQUwsR0FBWUEsSUFBWjtBQUNBLE9BQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNIOztBQUNKOztJQUVLQyxhQUNGLG9CQUFZ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TCxJQUFpQixJQUFyQixFQUNJLEtBQUt5QixvQkFBTCxDQUEwQixVQUExQixFQUFzQyxDQUFDLEtBQUt6QixRQUFMLENBQWN6QixDQUFmLEVBQWtCLEtBQUt5QixRQUFMLENBQWNxRCxDQUFoQyxFQUFtQ3JFLFdBQVcsQ0FBQyxLQUFLZ0IsUUFBTCxDQUFjdEIsTUFBZixFQUFzQixDQUF0QixDQUE5QyxFQUF3RU0sV0FBVyxDQUFDLEtBQUtnQixRQUFMLENBQWNyQixNQUFmLEVBQXNCLENBQXRCLENBQW5GLENBQXRDO0FBRVA7QUFsWkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgcGF5TG9hZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBkYXRhKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY2xhc3MgUGxheWVyRGF0YSB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgeCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcclxuICAgICAgICB0aGlzLmtleSA9ICcnO1xyXG4gICAgfVxyXG4gICAgcG9zWCA9IDA7XHJcbiAgICBwb3NZID0gMDtcclxuICAgIHNjYWxlWSA9IDA7XHJcbiAgICBzY2FsZVggPSAwO1xyXG4gICAgbGl2ZXMgPSAzO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5mdW5jdGlvbiByb3VuZE51bWJlcihybnVtLCBybGVuZ3RoKSB7XHJcbiAgICB2YXIgbmV3bnVtYmVyID0gTWF0aC5yb3VuZChybnVtICogTWF0aC5wb3coMTAsIHJsZW5ndGgpKSAvIE1hdGgucG93KDEwLCBybGVuZ3RoKTtcclxuICAgIHJldHVybiBuZXdudW1iZXI7XHJcbn1cclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBwbGF5ZXJJZDogMCxcclxuICAgICAgICB3czogbnVsbCxcclxuICAgICAgICBwbGF5ZXJzOiBudWxsLFxyXG4gICAgICAgIHBsYXllclByZWZhYjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBteVBsYXllcjogbnVsbCxcclxuICAgICAgICBwb3J0OiBudWxsLFxyXG4gICAgICAgIHN0YXJ0UGxhY2U6IGNjLk5vZGUsXHJcbiAgICAgICAgdGltZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgd2F0Y2g6IGNjLk5vZGUsXHJcbiAgICAgICAgbXlUaW1lOiAwLFxyXG4gICAgICAgIGVuZW1pZXM6IGNjLk5vZGUsXHJcbiAgICAgICAgd29uOiBmYWxzZSxcclxuICAgICAgICBjb3VudERvd246IG51bGwsXHJcbiAgICAgICAgaXRlbXM6IGNjLk5vZGUsXHJcbiAgICAgICAgc2hvcnRPblRpbWU6IGZhbHNlLFxyXG4gICAgICAgIHdhdGNoQW5pbTogY2MuQW5pbWF0aW9uLFxyXG4gICAgICAgIGNvbm5lY3Rpb25FcnJvclVJOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNvY2tldENsb3NlZDogZmFsc2UsXHJcbiAgICAgICAgcG90aW9uUHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAgICAgY2FrZVByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIGdhbWVTdGFydGVkOiBmYWxzZSxcclxuICAgICAgICBzdGFydFNjcmVlbjogY2MuTm9kZSxcclxuICAgICAgICBjcm93bnM6IDAsXHJcbiAgICAgICAgaG91c2VJbmRleDogMCxcclxuICAgICAgICBjaGVzdFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIHBvaW50c0xvc3Q6IDAsXHJcbiAgICB9LFxyXG4gICAgc2VuZFdlYnNvY2tldE1lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb25uZWN0aW9uRXJyb3JVSS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZCh7IGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ldyBwYXlMb2FkKHR5cGUsIG1lc3NhZ2UpKSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZCh0eXBlLCBtZXNzYWdlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRQbGF5ZXJTdGF0ZShzdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVQbGF5ZXJTdGF0ZVwiLCBbdGhpcy5wbGF5ZXJJZCwgc3RhdGVdKTtcclxuICAgIH0sXHJcbiAgICBzZW5kRW5lbXlTdGF0ZShzdGF0ZSwgcG9zaXRpb24sIGVuZW15KSB7XHJcbiAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUVuZW15XCIsIFt0aGlzLnBsYXllcklkLCBwb3NpdGlvbiwgc3RhdGUsIGVuZW15XSk7XHJcbiAgICB9LFxyXG4gICAgc2VuZEl0ZW1TdGF0ZShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIC8vIGRlbGF5IGNoZXN0IHNwYXduXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJjaGVzdFwiICYmIHN0YXRlID09IFwic3Bhd25cIikge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7IHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJ1cGRhdGVJdGVtXCIsIFtpZCwgc3RhdGUsIHR5cGUsIHBvc10pO30sMyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInVwZGF0ZUl0ZW1cIiwgW2lkLCBzdGF0ZSwgdHlwZSwgcG9zXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHNlbmRFbW9qaTogZnVuY3Rpb24gKGV2ZW50LCBjdXN0b21FdmVudERhdGEpIHtcclxuICAgICAgICAvLyBzZW5kIGVtb2ppLCBjdXN0b21FdmVudERhdGEgd2lsbCBiZSB0aGUgdHlwZVxyXG4gICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJlbW9qaVwiLCBbdGhpcy5wbGF5ZXJJZCwgY3VzdG9tRXZlbnREYXRhXSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dFbW9qaXMoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVQbGF5ZXIocGxheWVyKSB7XHJcbiAgICAgICAgLy9teSBjaGFyYWN0ZXJcclxuICAgICAgICBpZiAocGxheWVyLmlkID09IHRoaXMucGxheWVySWQpIHtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5wYXJlbnQgPSBjYy5maW5kKFwiQ2FudmFzL1BsYXllcnNcIik7XHJcbiAgICAgICAgICAgIHRoaXMubXlQbGF5ZXIueCA9IHRoaXMuc3RhcnRQbGFjZS54O1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLnkgPSB0aGlzLnN0YXJ0UGxhY2UueTtcclxuICAgICAgICAgICAgdGhpcy5teVBsYXllci5uYW1lID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm15UGxheWVyLmlkID0gcGxheWVyLmlkO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXSA9IHRoaXMubXlQbGF5ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFQbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllclByZWZhYik7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkNhbnZhcy9QbGF5ZXJzXCIpO1xyXG4gICAgICAgICAgICBhUGxheWVyLnggPSB0aGlzLnN0YXJ0UGxhY2UueDtcclxuICAgICAgICAgICAgYVBsYXllci55ID0gdGhpcy5zdGFydFBsYWNlLnk7XHJcbiAgICAgICAgICAgIGFQbGF5ZXIubmFtZSA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5pZCA9IHBsYXllci5pZDtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIm5hbWVUYWdcIikuY29sb3IgPSBjYy5Db2xvci5XSElURTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0gPSBhUGxheWVyO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGVQbGF5ZXIocGxheWVySWQsIHN0YXRlKSB7XHJcbiAgICAgICAgbGV0IHRoZVBsYXllciA9IHRoaXMucGxheWVyc1twbGF5ZXJJZF07XHJcbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhlUGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImp1bXBcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0b3BYXCI6XHJcbiAgICAgICAgICAgICAgICB0aGVQbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFgoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFlcIjpcclxuICAgICAgICAgICAgICAgIHRoZVBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5zdG9wWSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVuZW15KHBsYXllcklkLCBwb3NpdGlvbixzdGF0ZSwgZW5lbXkpIHtcclxuICAgICAgICBsZXQgdGhlUGxheWVyID0gdGhpcy5wbGF5ZXJzW3BsYXllcklkXTtcclxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJjaGFzZU5ld1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5jaGFzZVBsYXllcih0aGVQbGF5ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS5nZXRDb21wb25lbnQoXCJlbmVteVNjcmlwdFwiKS5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJqdW1wXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q2hpbGRCeU5hbWUoZW5lbXkpLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmp1bXAoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25cIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRDaGlsZEJ5TmFtZShlbmVteSkueCA9IHBvc2l0aW9uWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmdldENoaWxkQnlOYW1lKGVuZW15KS55ID0gcG9zaXRpb25bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyAgICBjYXNlIFwic3RvcFhcIjpcclxuICAgICAgICAvLyAgICAgICAgdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLnN0b3BYKCk7XHJcbiAgICAgICAgLy8gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vICAgIGNhc2UgXCJzdG9wWVwiOlxyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuc3RvcFkoKTtcclxuICAgICAgICAvLyAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgdXBkYXRlUGxheWVyUG9zaXRpb24ocGxheWVyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW3BsYXllci5pZF0ueCA9IHBsYXllci5wb3NYO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLnkgPSBwbGF5ZXIucG9zWTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbcGxheWVyLmlkXS5zZXRTY2FsZShwbGF5ZXIuc2NhbGVYLCBwbGF5ZXIuc2NhbGVZKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBsYXllci5pZCArIFwiIFwiICsgcGxheWVyLnNjYWxlWSArIFwiIFwiICsgcGxheWVyLnNjYWxlWCk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlUGxheWVyKHBsYXllcikge1xyXG4gICAgICAgIHRoaXMucGxheWVyc1twbGF5ZXIuaWRdLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnBsYXllcnMuZGVsZXRlKHBsYXllci5pZCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVGltZSh0aW1lKSB7XHJcbiAgICAgICAgLy9jaGFuZ2UgdGltZSBvbiB3YXRjaCBhY2NvcmRpbmcgdG8gY291bnRkb3duIHRpbWVcclxuICAgICAgICBpZiAoKHRoaXMuY291bnREb3duIC0gdGltZSkgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGltZTtcclxuICAgICAgICAgICAgdGhpcy53YXRjaC5hbmdsZSA9IC0gKCh0aW1lICogMzYwKSAvIHRoaXMuY291bnREb3duIC0gOTApO1xyXG4gICAgICAgICAgICB0aGlzLm15VGltZSA9IHRpbWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG9ydE9uVGltZSAmJiAodGhpcy5jb3VudERvd24gLSB0aW1lKSA8IDE1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbSA9IHRoaXMud2F0Y2guZ2V0UGFyZW50KCkuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInNob3J0T25UaW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YXRjaEFuaW0ud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG9ydE9uVGltZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3J0T25UaW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoQW5pbS5zdG9wKFwic2hvcnRPblRpbWVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoLmdldFBhcmVudCgpLmNvbG9yID0gY2MuQ29sb3IuUkVEO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJnYW1lTWFuYWdlclwiKS50aW1lc1VwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3J0T25UaW1lID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9wbGF5IGxvc2Ugc291bmQgJiBsb3NlIGNyb3duc1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLndvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q2hpbGRCeU5hbWUoXCJBVURJT1wiKS5nZXRDaGlsZEJ5TmFtZShcIkxPU0VcIikuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jcm93bnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNyb3ducyA+IDMwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Nyb3ducyh0aGlzLnBvaW50c0xvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMoMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgdGhpcy5zb2NrZXRDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlSXRlbShpZCwgc3RhdGUsIHR5cGUsIHBvcykge1xyXG4gICAgICAgIGlmIChzdGF0ZSA9PSBcInVzZWRcIilcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5nZXRDaGlsZEJ5TmFtZSh0eXBlICsgaWQpLmRlc3Ryb3koKTtcclxuICAgICAgICBlbHNlIGlmIChzdGF0ZSA9PSBcInNwYXduXCIpIHtcclxuICAgICAgICAgICAgbGV0IHRoZUl0ZW0gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJwb3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHRoZUl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBvdGlvblByZWZhYik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYWtlUHJlZmFiKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGVJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzdFByZWZhYik7XHJcblxyXG4gICAgICAgICAgICB0aGVJdGVtLnggPSBwb3NbMF07XHJcbiAgICAgICAgICAgIHRoZUl0ZW0ueSA9IHBvc1sxXTtcclxuICAgICAgICAgICAgdGhlSXRlbS5wYXJlbnQgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgICAgICB0aGVJdGVtLm5hbWUgPSB0eXBlICsgaWQ7XHJcbiAgICAgICAgICAgIHRoZUl0ZW0uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCA9IGlkO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUVtb2ppKGlkLCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzW2lkXS5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5wbGF5RW1vamkodHlwZSk7XHJcbiAgICB9LFxyXG4gICAgc3RhcnRDb3VudERvd24obnVtKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNjcmVlbi5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGlmIChudW0gPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVTdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2NyZWVuLmdldENoaWxkQnlOYW1lKFwiTlVNXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbnVtO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZWNpZXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobXlEYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZVBsYXllclN0YXRlXCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInJlbW92ZVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbml0Um9vbVwiOlxyXG4gICAgICAgICAgICAgICAgLy9zZXQgY291bmRvd24gdGltZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudERvd24gPSBteURhdGEuZGF0YVsxXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzTG9zdCA9IG15RGF0YS5kYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb3VudERvd24pO1xyXG4gICAgICAgICAgICAgICAgLy9hZGQgcGxheWVyc1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBteURhdGEuZGF0YVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicG9zaXRpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dDcm93bnMobXlEYXRhLmRhdGFbMl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLmFkZFdpbm5lcihteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ0aW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIHRpbWUgb24gd2F0Y2hcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZShteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwZGF0ZUVuZW15XCI6XHJcbiAgICAgICAgICAgICAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUVuZW15KG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidXBkYXRlSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSwgbXlEYXRhLmRhdGFbMl0sIG15RGF0YS5kYXRhWzNdKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5lbmVtaWVzLmdldENvbXBvbmVudChcImVuZW15U2NyaXB0XCIpLmNoYXNlUGxheWVyKHRoaXMucGxheWVyc1tteURhdGEuZGF0YVswXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbW9qaVwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbW9qaShteURhdGEuZGF0YVswXSwgbXlEYXRhLmRhdGFbMV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJzdGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydENvdW50RG93bihteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBqb2luU2VydmVyKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSB3eC5jb25uZWN0U29ja2V0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArXCI6XCIgKyB0aGlzLnBvcnRcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25PcGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2UgYXJlIGNvbm5lY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwbGF5ZXJJbmZvXCIsIHRoaXMucGxheWVySWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25NZXNzYWdlKCh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndzLm9uRXJyb3IoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25DbG9zZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBkaWRuJ3QgY2xvc2Ugb24gcHVycG9zZSwgYWxlcnRcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb2NrZXRDbG9zZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvclVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChcIndzOi8vXCIgKyB0aGlzLnNlcnZlcklwICArIFwiOlwiICsgdGhpcy5wb3J0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3ZSBhcmUgY29ubmVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kV2Vic29ja2V0TWVzc2FnZShcInBsYXllckluZm9cIiwgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsb3NlXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpZG4ndCBjbG9zZSBvbiBwdXJwb3NlLCBhbGVydFxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvY2tldENsb3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsICh7IGRhdGEgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNpZXZlTWVzc2FnZShkYXRhKTsgICBcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChteURhdGEudHlwZSA9PSBcInVwZGF0ZVBsYXllclN0YXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vY29uc29sZS5sb2cobXlEYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKG15RGF0YS5kYXRhWzBdICsgXCIgXCIgKyBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAobXlEYXRhLmRhdGFbMF0gIT0gdGhpcy5wbGF5ZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMudXBkYXRlUGxheWVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJyZW1vdmVcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy5yZW1vdmVQbGF5ZXIobXlEYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiYWRkUGxheWVyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5jcmVhdGVQbGF5ZXIobXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgLy9lbHNlIGlmIChteURhdGEudHlwZSA9PSBcInBvc2l0aW9uc1wiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBmb3IgKHZhciBpIGluIG15RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgaWYgKHRoaXMucGxheWVySWQgIT0gbXlEYXRhLmRhdGFbaV0uaWQpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24obXlEYXRhLmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAvL2Vsc2UgaWYgKG15RGF0YS50eXBlID09IFwiZmluaXNoXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGlmICh0aGlzLnBsYXllcklkID09IG15RGF0YS5kYXRhWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNob3dXaW5uZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuYWRkV2lubmVyKG15RGF0YS5kYXRhWzBdLCBteURhdGEuZGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgICAgIC8vZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJ0aW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgIC8vIHVwZGF0ZSB0aGUgdGltZSBvbiB3YXRjaFxyXG4gICAgICAgICAgICAgICAgLy8gICAgdGhpcy51cGRhdGVUaW1lKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vdmFyIGluZm8gPSByZXF1aXJlKFwibG9iYnkuanNcIik7XHJcbiAgICAgICAgLy90aGlzLnBsYXllcklkID0gaW5mby5pZDtcclxuICAgICAgICAvL3RoaXMucG9ydCA9IGluZm8ucG9ydDtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludHNMb3N0ID0gNTtcclxuICAgICAgICBsZXQgYWJwID0gY2MuZmluZChcIk1BTkFHRVJcIikuZ2V0Q29tcG9uZW50KFwiYWJvdXRQbGF5ZXJcIik7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IGFicC5wbGF5ZXJJZDtcclxuICAgICAgICB0aGlzLnBvcnQgPSBhYnAucm9vbTtcclxuICAgICAgICB0aGlzLnNlcnZlcklwID0gYWJwLnNlcnZlcklwO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gYWJwLmNyb3ducztcclxuICAgICAgICB0aGlzLmhvdXNlSW5kZXggPSBhYnAuaG91c2VJbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmpvaW5TZXJ2ZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIGlmICh0aGlzLm15UGxheWVyICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFdlYnNvY2tldE1lc3NhZ2UoXCJwb3NpdGlvblwiLCBbdGhpcy5teVBsYXllci54LCB0aGlzLm15UGxheWVyLnksIHJvdW5kTnVtYmVyKHRoaXMubXlQbGF5ZXIuc2NhbGVZLDUpLCByb3VuZE51bWJlcih0aGlzLm15UGxheWVyLnNjYWxlWCw1KV0pO1xyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=
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
    leftButton: cc.Node,
    rightButton: cc.Node,
    jumpButton: cc.Node,
    potionButton: cc.Node,
    cakeButton: cc.Node,
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
  // disable() {
  //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
  //         let joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");
  //         let jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");
  //         let potionButton = cc.find("Canvas/UI/MOBILE/POTION");
  //         let cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");
  //         joystick.off(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
  //         joystick.off(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
  //         joystick.off(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
  //         joystick.off(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
  //         jumpButton.off(cc.Node.EventType.TOUCH_START, this.jump, this);
  //         potionButton.off(cc.Node.EventType.TOUCH_START, this.shrink, this);
  //         cakeButton.off(cc.Node.EventType.TOUCH_START, this.grow, this);
  //     } else {
  //         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  //         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  //     }
  //     this.node.getComponent(cc.RigidBody).gravityScale = 0;
  //     this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2(0, 0);
  // },
  start: function start() {
    this.leftButton = cc.find("Canvas/UI/MOBILE2/LEFT");
    this.rightButton = cc.find("Canvas/UI/MOBILE2/RIGHT");
    this.jumpButton = cc.find("Canvas/UI/MOBILE2/JUMP");
    this.potionButton = cc.find("Canvas/UI/MOBILE2/POTION");
    this.cakeButton = cc.find("Canvas/UI/MOBILE2/CAKE");
  },
  disable: function disable() {
    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      this.leftButton.off(cc.Node.EventType.TOUCH_START, this.moveLeft, this);
      this.rightButton.off(cc.Node.EventType.TOUCH_START, this.moveRight, this);
      this.jumpButton.off(cc.Node.EventType.TOUCH_START, this.jump, this);
      this.potionButton.off(cc.Node.EventType.TOUCH_START, this.shrink, this);
      this.cakeButton.off(cc.Node.EventType.TOUCH_START, this.grow, this);
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

      case cc.macro.KEY.e:
        cc.find("system").getComponent("gameManager").showEmojis();
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
          var rb = this.getComponent(cc.RigidBody); // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
          //     //set mobile touch control listeners
          //     cc.find("Canvas/UI/MOBILE").active = true;
          //     this.joystickBall = cc.find("Canvas/UI/MOBILE/JOYSTICK/BALL");
          //     let joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");
          //     let jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");
          //     let potionButton = cc.find("Canvas/UI/MOBILE/POTION");
          //     let cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");
          //     joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
          //     joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
          //     joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
          //     joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
          //     jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
          //     potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
          //     cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          // } else {
          //     this.joystickBall = cc.find("Canvas/UI/MOBILE/JOYSTICK/BALL");
          //     let joystick = cc.find("Canvas/UI/MOBILE/JOYSTICK");
          //     let jumpButton = cc.find("Canvas/UI/MOBILE/JUMP");
          //     let potionButton = cc.find("Canvas/UI/MOBILE/POTION");
          //     let cakeButton = cc.find("Canvas/UI/MOBILE/CAKE");
          //     joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
          //     joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
          //     joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
          //     joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
          //     jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
          //     potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
          //     cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          //     cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          //     cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          // }

          if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            //set mobile touch control listeners
            cc.find("Canvas/UI/MOBILE").active = true;
          }

          this.leftButton.on(cc.Node.EventType.TOUCH_START, this.moveLeft, this);
          this.rightButton.on(cc.Node.EventType.TOUCH_START, this.moveRight, this);
          this.jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
          this.potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
          this.cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92ZW1lbnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJqdW1wSGVpZ2h0Iiwic21hbGxKdW1wSGVpZ2h0IiwianVtcER1cmF0aW9uIiwibW92ZVNwZWVkIiwic21hbGxNb3ZlU3BlZWQiLCJpc1BsYXllciIsImNsaWVudFNjcmlwdCIsIk5vZGUiLCJ4U3BlZWQiLCJ5U3BlZWQiLCJsb2NhbENlbnRlciIsImdyb3VuZGVyIiwiYm9keSIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsImRlbHRhVGltZSIsImZhbGxNdWx0aXBsaWVyIiwiZ3Jvd2luZyIsIm1heFNjYWxlIiwibWluU2NhbGUiLCJhdGVDYWtlIiwiYXRlUG90aW9uIiwiZ3JvdW5kZWQiLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJqb3lzdGlja01heCIsImpveXN0aWNrVmVjdG9yIiwidjIiLCJqb3lzdGlja0JhbGwiLCJsZWZ0QnV0dG9uIiwicmlnaHRCdXR0b24iLCJqdW1wQnV0dG9uIiwicG90aW9uQnV0dG9uIiwiY2FrZUJ1dHRvbiIsImVtb2ppcyIsInRpbWVTdGVwIiwic3RhcnRUaW1lciIsInBsYXlpbmdBbmltYXRpb24iLCJqb3lzdGlja01vdmluZyIsInBsYXllZEZhbGxpbmciLCJzb3VuZENvbnRyb2xsZXIiLCJzb3VuZHMiLCJidXN5IiwidG90YWwiLCJzdW0iLCJzdGFydCIsImZpbmQiLCJkaXNhYmxlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsIm9mZiIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwibW92ZUxlZnQiLCJtb3ZlUmlnaHQiLCJqdW1wIiwic2hyaW5rIiwiZ3JvdyIsInN5c3RlbUV2ZW50IiwiU3lzdGVtRXZlbnQiLCJLRVlfRE9XTiIsIm9uS2V5RG93biIsIktFWV9VUCIsIm9uS2V5VXAiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiUmlnaWRCb2R5IiwiZ3Jhdml0eVNjYWxlIiwibGluZWFyVmVsb2NpdHkiLCJWZWMyIiwicGxheUVtb2ppIiwidHlwZSIsImVtb2ppIiwiZ2V0Q2hpbGRCeU5hbWUiLCJhY3RpdmUiLCJ0d2VlbiIsInRvIiwicG9zaXRpb24iLCJ4IiwiTWF0aCIsImNlaWwiLCJyYW5kb20iLCJyb3VuZCIsInkiLCJlYXNpbmciLCJkZWxheSIsImNhbGwiLCJvbkJlZ2luQ29udGFjdCIsImNvbnRhY3QiLCJzZWxmIiwib3RoZXIiLCJ0YWciLCJncm91cCIsIm1vdmluZyIsInBsYXkiLCJzY2hlZHVsZU9uY2UiLCJzY2FsZVkiLCJvbkVuZENvbnRhY3QiLCJqdW1wUnVuQWN0aW9uIiwianVtcFVwIiwiYnkiLCJqdW1wRG93biIsInNlcXVlbmNlIiwic2NhbGVYIiwiYW5pbVN0YXRlIiwid3JhcE1vZGUiLCJXcmFwTW9kZSIsIkxvb3AiLCJzZW5kUGxheWVyU3RhdGUiLCJzdG9wIiwic3RvcFgiLCJzdG9wWSIsImV2ZW50Iiwia2V5Q29kZSIsIm1hY3JvIiwiS0VZIiwidyIsImEiLCJkIiwiZSIsInEiLCJzaG93RW1vamlzIiwib25Mb2FkIiwiTWFwIiwiaSIsImdldENvbXBvbmVudHMiLCJBdWRpb1NvdXJjZSIsImxlbmd0aCIsImNsaXAiLCJuYW1lIiwib25EZXN0cm95Iiwiam95c3RpY2tTdGFydCIsInRvdWNoUG9zIiwiZ2V0TG9jYXRpb24iLCJvdXQiLCJDYW1lcmEiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJsb2NhbFRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJsaW1pdEpveXN0aWNrIiwic2V0Sm95c3RpY2tCYWxsUG9zIiwiam95c3RpY2tNb3ZlUGxheWVyIiwiam95c3RpY2tNb3ZlIiwidG91Y2giLCJnZXRUb3VjaGVzIiwiam95c3RpY2tFbmQiLCJaRVJPIiwicG9zIiwic2V0UG9zaXRpb24iLCJqb3lzdGlja1ZlYyIsImlucHV0TWFnIiwibWFnIiwibXVsU2VsZiIsInVwZGF0ZSIsImR0IiwiZ2V0TG9jYWxDZW50ZXIiLCJnYW1lU3RhcnRlZCIsInBsYXllcklkIiwiYWJzIiwicmIiLCJvbiIsInlPZmZzZXRQbGF5ZXIiLCJ4T2Zmc2V0UGxheWVyIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzTWFuYWdlciIsImdyYXZpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSQyxJQUFBQSxlQUFlLEVBQUUsQ0FGVDtBQUdSQyxJQUFBQSxZQUFZLEVBQUUsQ0FITjtBQUlSQyxJQUFBQSxTQUFTLEVBQUUsQ0FKSDtBQUtSQyxJQUFBQSxjQUFjLEVBQUUsQ0FMUjtBQU1SQyxJQUFBQSxRQUFRLEVBQUUsS0FORjtBQU9SQyxJQUFBQSxZQUFZLEVBQUVWLEVBQUUsQ0FBQ1csSUFQVDtBQVFSQyxJQUFBQSxNQUFNLEVBQUUsQ0FSQTtBQVNSQyxJQUFBQSxNQUFNLEVBQUUsQ0FUQTtBQVVSQyxJQUFBQSxXQUFXLEVBQUUsQ0FWTDtBQVdSQyxJQUFBQSxRQUFRLEVBQUVmLEVBQUUsQ0FBQ1csSUFYTDtBQVlSSyxJQUFBQSxJQUFJLEVBQUVoQixFQUFFLENBQUNXLElBWkQ7QUFhUk0sSUFBQUEsU0FBUyxFQUFFakIsRUFBRSxDQUFDa0IsU0FiTjtBQWNSQyxJQUFBQSxTQUFTLEVBQUUsQ0FkSDtBQWVSQyxJQUFBQSxjQUFjLEVBQUUsR0FmUjtBQWdCUkMsSUFBQUEsT0FBTyxFQUFFLENBaEJEO0FBaUJSQyxJQUFBQSxRQUFRLEVBQUUsQ0FqQkY7QUFrQlJDLElBQUFBLFFBQVEsRUFBRSxHQWxCRjtBQW1CUkMsSUFBQUEsT0FBTyxFQUFFLEtBbkJEO0FBb0JSQyxJQUFBQSxTQUFTLEVBQUUsS0FwQkg7QUFxQlJDLElBQUFBLFFBQVEsRUFBRSxLQXJCRjtBQXNCUkMsSUFBQUEsV0FBVyxFQUFFLEtBdEJMO0FBdUJSQyxJQUFB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TCxJQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBRTNCLFlBQUksS0FBS0UsUUFBTCxHQUFnQixLQUFLOEMsSUFBTCxDQUFVZ0MsTUFBOUIsRUFBc0M7QUFDbEMsZUFBS2hDLElBQUwsQ0FBVXVDLE1BQVYsSUFBb0IsT0FBT29ELEVBQTNCO0FBQ0EsZUFBSzNGLElBQUwsQ0FBVWdDLE1BQVYsSUFBb0IsT0FBTzJELEVBQTNCO0FBQ0gsU0FIRCxNQUdPO0FBRUgsZUFBSzNJLE9BQUwsR0FBZSxDQUFmLENBRkcsQ0FJSDs7QUFDQSxjQUFJLEtBQUtLLFFBQVQsRUFBbUI7QUFDZixnQkFBSSxLQUFLQyxXQUFULEVBQ0ksS0FBSzJDLFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMwRSxJQUFILENBQVEsS0FBS2xFLGNBQUwsR0FBc0IsS0FBS1csU0FBbkMsRUFBOEMsS0FBS04sTUFBbkQsQ0FBakQsQ0FESixLQUVLLElBQUksS0FBS2UsVUFBVCxFQUNELEtBQUswQyxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLENBQUMsS0FBS2xFLGNBQU4sR0FBdUIsS0FBS1csU0FBcEMsRUFBK0MsS0FBS04sTUFBcEQsQ0FBakQ7QUFDUDtBQUNKO0FBQ0o7QUFDSjtBQUdKO0FBN2pCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBqdW1wSGVpZ2h0OiAwLFxyXG4gICAgICAgIHNtYWxsSnVtcEhlaWdodDogMCxcclxuICAgICAgICBqdW1wRHVyYXRpb246IDAsXHJcbiAgICAgICAgbW92ZVNwZWVkOiAwLFxyXG4gICAgICAgIHNtYWxsTW92ZVNwZWVkOiAwLFxyXG4gICAgICAgIGlzUGxheWVyOiBmYWxzZSxcclxuICAgICAgICBjbGllbnRTY3JpcHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgeFNwZWVkOiAwLFxyXG4gICAgICAgIHlTcGVlZDogMCxcclxuICAgICAgICBsb2NhbENlbnRlcjogMCxcclxuICAgICAgICBncm91bmRlcjogY2MuTm9kZSxcclxuICAgICAgICBib2R5OiBjYy5Ob2RlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogY2MuQW5pbWF0aW9uLFxyXG4gICAgICAgIGRlbHRhVGltZTogMCxcclxuICAgICAgICBmYWxsTXVsdGlwbGllcjogMi41LFxyXG4gICAgICAgIGdyb3dpbmc6IDAsXHJcbiAgICAgICAgbWF4U2NhbGU6IDEsXHJcbiAgICAgICAgbWluU2NhbGU6IDAuNSxcclxuICAgICAgICBhdGVDYWtlOiBmYWxzZSxcclxuICAgICAgICBhdGVQb3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGdyb3VuZGVkOiBmYWxzZSxcclxuICAgICAgICBtb3ZpbmdSaWdodDogZmFsc2UsXHJcbiAgICAgICAgbW92aW5nTGVmdDogZmFsc2UsXHJcbiAgICAgICAgam95c3RpY2tNYXg6IDY5LFxyXG4gICAgICAgIGpveXN0aWNrVmVjdG9yOiBjYy52MigpLFxyXG4gICAgICAgIGpveXN0aWNrQmFsbDogY2MuTm9kZSxcclxuICAgICAgICBsZWZ0QnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIHJpZ2h0QnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGp1bXBCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgcG90aW9uQnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNha2VCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVTdGVwOiAwLFxyXG4gICAgICAgIHN0YXJ0VGltZXI6IGZhbHNlLFxyXG4gICAgICAgIHBsYXlpbmdBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgam95c3RpY2tNb3Zpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBsYXllZEZhbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIHNvdW5kQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBzb3VuZHM6IG51bGwsXHJcbiAgICAgICAgYnVzeTogZmFsc2UsXHJcblxyXG4gICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgIHN1bTogMCxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZGlzYWJsZSgpIHtcclxuICAgIC8vICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgLy8gICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KT1lTVElDS1wiKTtcclxuICAgIC8vICAgICAgICAgbGV0IGp1bXBCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgLy8gICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgLy8gICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIik7XHJcbiAgICAvLyAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qb3lzdGlja1N0YXJ0LCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5qb3lzdGlja0VuZCwgdGhpcyk7XHJcbiAgICAvLyAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgLy8gICAgICAgICBqdW1wQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgcG90aW9uQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5zaHJpbmssIHRoaXMpO1xyXG4gICAgLy8gICAgICAgICBjYWtlQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAvLyAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gMDtcclxuICAgIC8vICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgLy8gfSxcclxuICAgIHN0YXJ0KClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxlZnRCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRTIvTEVGVFwiKTtcclxuICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUyL1JJR0hUXCIpO1xyXG4gICAgICAgIHRoaXMuanVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFMi9KVU1QXCIpO1xyXG4gICAgICAgIHRoaXMucG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUyL1BPVElPTlwiKTtcclxuICAgICAgICB0aGlzLmNha2VCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRTIvQ0FLRVwiKTtcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdEJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubW92ZUxlZnQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5tb3ZlUmlnaHQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmp1bXBCdXR0b24ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBvdGlvbkJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5jYWtlQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gMDtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHBsYXlFbW9qaSh0eXBlKSB7XHJcbiAgICAgICAgbGV0IGVtb2ppID0gdGhpcy5lbW9qaXMuZ2V0Q2hpbGRCeU5hbWUodHlwZSk7XHJcbiAgICAgICAgLy9ubyBzcGFtIGVycm9yXHJcbiAgICAgICAgaWYgKCEgZW1vamkuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGVtb2ppLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKGVtb2ppKS50bygwLjUsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS54ICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwKSAqIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID8gMSA6IC0xKSwgdGhpcy5ub2RlLnkgKyAyMDAwKSB9LCB7IGVhc2luZzogJ3NpbmVPdXRJbicgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4oZW1vamkpLmRlbGF5KDEpLnRvKDAsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLngsIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLnkpIH0pLmNhbGwoKCkgPT4geyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9KS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL3RoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9LCAyKTtcclxuICAgIH0sXHJcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmLCBvdGhlcikge1xyXG5cclxuICAgICAgICBpZiAoc2VsZi50YWcgPT0gMiAmJiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVudmlyb25tZW50XCIgfHwgb3RoZXIubm9kZS5ncm91cCA9PSBcIm1vdmluZ1BsYXRmb3JtXCIpKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL3N0b3AgZmFsbGluZyBhbmltYXRpb25cclxuICAgICAgICAgICAgLy90aGlzLmFuaW1hdGlvbi5zdG9wKFwiZmFsbGluZ1wiKTtcclxuICAgICAgICAgICAgLy90aGlzLnBsYXllZEZhbGxpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vcGxheSAgYW5pbWF0aW9uc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImxhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BsYXllcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kc1tcImxhbmRpbmdcIl0ucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jaGFuZ2Ugc3BlZWQgaWYgZGlmZmVyZW50IHNpemVcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb25FbmRDb250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgaWYgKHNlbGYudGFnID09IDIpXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBqdW1wUnVuQWN0aW9uKCkge1xyXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogMzAwIH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSk7XHJcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MudHdlZW4oKS5ieSgxLCB7IHk6IC0zMDAgfSwgeyBlYXNpbmc6ICdzaW5lSW4nIH0pO1xyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMubm9kZSkuc2VxdWVuY2UoanVtcFVwLCBqdW1wRG93bikuc3RhcnQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZVJpZ2h0KCkge1xyXG4gICBcclxuICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJvZHkuc2NhbGVYID0gLTE7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgYW5pbVN0YXRlLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlTGVmdCgpIHtcclxuICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9keS5zY2FsZVggPSAxO1xyXG4gICAgICAgIGlmICghdGhpcy5tb3ZpbmcgJiYgdGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbVN0YXRlID0gdGhpcy5hbmltYXRpb24ucGxheShcIndhbGtcIik7XHJcbiAgICAgICAgICAgIGFuaW1TdGF0ZS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55KTtcclxuICAgICAgICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwibGVmdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGp1bXAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291bmRzW1wianVtcFwiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGlmZmVyZW50IGp1bXAgaGVpZ2h0cyBkZXBlbmRpbmcgb24gc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuc2NhbGVZID49IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuanVtcEhlaWdodCAqIHRoaXMuZGVsdGFUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuc21hbGxKdW1wSGVpZ2h0ICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lciA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImp1bXBcIik7ICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWCgpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIC8vY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoMCwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2hyaW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlUG90aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW1wiZHJpbmtpbmcyXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBncm93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlQ2FrZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tcImVhdGluZ1wiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYTpcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5kOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5lOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm93KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucTpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hyaW5rKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuZTpcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Vtb2ppcygpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uS2V5VXAoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gY2MubWFjcm8uS0VZLncpIHtcclxuICAgICAgICAgICAgLy90aGlzLnN0b3BZKCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5hKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5kKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50U2NyaXB0ID0gY2MuZmluZChcInN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgLy9tYXAgc291bmRzIHRvIHRoZWlyIGF1ZGlvU291cmNlXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1t0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKVtpXS5jbGlwLm5hbWVdID0gdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRvdWNoUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcclxuICAgICAgICAvL3VzZSBjYW1lcmEgdG8gZ2V0IHRvdWNoIHBvc1xyXG4gICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoY2MuQ2FtZXJhKS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodG91Y2hQb3MsIG91dCk7XHJcbiAgICAgICAgbGV0IGxvY2FsVG91Y2hQb3MgPSB0aGlzLmpveXN0aWNrQmFsbC5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIob3V0KTtcclxuXHJcbiAgICAgICAgLy9saW1pdCBiYWxsIHNvIGl0IGNhbid0IGxlYXZlIGNpcmNsZVxyXG4gICAgICAgIHRoaXMubGltaXRKb3lzdGljayhsb2NhbFRvdWNoUG9zKTtcclxuXHJcbiAgICAgICAgLy9jaGFuZ2UgcG9zIG9mIGJhbGwgYWNjb3JkaW5nbHlcclxuICAgICAgICB0aGlzLnNldEpveXN0aWNrQmFsbFBvcyhsb2NhbFRvdWNoUG9zKTsgXHJcbiAgICAgICAgdGhpcy5qb3lzdGlja1ZlY3RvciA9IGxvY2FsVG91Y2hQb3M7XHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZlUGxheWVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpveXN0aWNrTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCB0b3VjaCA9IGV2ZW50LmdldFRvdWNoZXMoKVswXTtcclxuICAgICAgICBsZXQgdG91Y2hQb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBvdXQgPSBjYy52MigpO1xyXG4gICAgICAgIC8vdXNlIGNhbWVyYSB0byBnZXQgdG91Y2ggcG9zXHJcbiAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChjYy5DYW1lcmEpLmdldFNjcmVlblRvV29ybGRQb2ludCh0b3VjaFBvcywgb3V0KTtcclxuICAgICAgICBsZXQgbG9jYWxUb3VjaFBvcyA9IHRoaXMuam95c3RpY2tCYWxsLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvdXQpO1xyXG5cclxuICAgICAgICAvL2xpbWl0IGJhbGwgc28gaXQgY2FuJ3QgbGVhdmUgY2lyY2xlXHJcbiAgICAgICAgdGhpcy5saW1pdEpveXN0aWNrKGxvY2FsVG91Y2hQb3MpO1xyXG5cclxuICAgICAgICAvL2NoYW5nZSBwb3Mgb2YgYmFsbCBhY2NvcmRpbmdseVxyXG4gICAgICAgIHRoaXMuc2V0Sm95c3RpY2tCYWxsUG9zKGxvY2FsVG91Y2hQb3MpO1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBsb2NhbFRvdWNoUG9zO1xyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92ZVBsYXllcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja01vdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgLy9tb3ZlIHBsYXllciBob3Jpem9udGFsbHlcclxuICAgICAgICBpZiAodGhpcy5qb3lzdGlja1ZlY3Rvci54ID4gMClcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLmpveXN0aWNrVmVjdG9yLnggPCAwKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vbW92ZSBwbGF5ZXIgdmVydGljYWxseVxyXG4gICAgICAgIC8vaWYgKHRoaXMuam95c3RpY2tWZWN0b3IueSA+IDEwKVxyXG4gICAgICAgIC8vICAgIHRoaXMuanVtcCgpXHJcbiAgICB9LFxyXG4gICAgam95c3RpY2tFbmQoKSB7XHJcbiAgICAgICAgLy9zdG9wIHBsYXllclxyXG4gICAgICAgIGlmICh0aGlzLmpveXN0aWNrTW92aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBjYy5WZWMyLlpFUk87XHJcbiAgICAgICAgdGhpcy5zZXRKb3lzdGlja0JhbGxQb3MoY2MuVmVjMi5aRVJPKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Sm95c3RpY2tCYWxsUG9zKHBvcykge1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYWxsLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxpbWl0Sm95c3RpY2soam95c3RpY2tWZWMpIHtcclxuICAgICAgICBsZXQgaW5wdXRNYWcgPSBqb3lzdGlja1ZlYy5tYWcoKTtcclxuICAgICAgICBpZiAoaW5wdXRNYWcgPiB0aGlzLmpveXN0aWNrTWF4KSB7XHJcbiAgICAgICAgICAgIGpveXN0aWNrVmVjLm11bFNlbGYodGhpcy5qb3lzdGlja01heCAvIGlucHV0TWFnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuIFxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMueVNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55O1xyXG4gICAgICAgIHRoaXMubG9jYWxDZW50ZXIgPSB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdldExvY2FsQ2VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdW0gKz0gZHQ7XHJcbiAgICAgICAgdGhpcy50b3RhbCArPSAxO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQgJiYgIXRoaXMucGxheWluZ0FuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwic3RhbmRcIik7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYgKGR0IDwgMC4wMiAmJiBkdCA+IDAuMDEpXHJcbiAgICAgICAgLy90aGlzLmRlbHRhVGltZSA9IGR0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmdhbWVTdGFydGVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlbHRhVGltZSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gZHQ7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkdCAtICh0aGlzLnN1bSAvIHRoaXMudG90YWwpKSA8IDAuMDMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IHRoaXMubm9kZS5uYW1lICYmICF0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJiID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmpveXN0aWNrQmFsbCA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLL0JBTExcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBqb3lzdGljayA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pVTVBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBwb3Rpb25CdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBjYWtlQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSk9ZU1RJQ0svQkFMTFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGpveXN0aWNrID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSk9ZU1RJQ0tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBqdW1wQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL1BPVElPTlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGNha2VCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9DQUtFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qb3lzdGlja1N0YXJ0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5qb3lzdGlja01vdmUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqdW1wQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBwb3Rpb25CdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY2FrZUJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0QnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1vdmVMZWZ0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1vdmVSaWdodCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWtlQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmdyb3csIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAvLyB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdyYXZpdHlTY2FsZSA9IGR0ICogICAgIDtcclxuICAgICAgICAvL2lmICh0aGlzLnlTcGVlZCA8IDApIHtcclxuICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKGNjLlZlYzIoMCwgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAodGhpcy5mYWxsTXVsdGlwbGllciAtIDEpICogdGhpcy5kZWx0YVRpbWUpKTtcclxuICAgICAgICAvLyAgICAvLy5sb2coY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAodGhpcy5mYWxsTXVsdGlwbGllciAtIDEpICogdGhpcy5kZWx0YVRpbWUpO1xyXG5cclxuICAgICAgICAvLyAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnhTcGVlZCwgdGhpcy55U3BlZWQgKyBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvL2lmICh0aGlzLnlTcGVlZCA+IDAgJiYgIWp1bXApIHtcclxuICAgICAgICAvLyAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ICs9IGNjLlZlYzIodGhpcy54U3BlZWQsIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eS55ICogMSAqIHRoaXMuZGVsdGFUaW1lKTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgLy8gZ3JvdyA9IC0xIG1lYW5zIHNocmluaW5nXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkICYmICFjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgPiAyIHx8IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA8IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgPiAyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciAtPSBkdCAqIDIwMDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA8IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyICs9IGR0ICogMjAwO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciA8IDUwICYmIHRoaXMubW92aW5nUmlnaHQpXHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnhPZmZzZXRQbGF5ZXIgKz0gZHQgKiAyMDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID4gLTUwICYmIHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciAtPSBkdCAqIDIwMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY3VzdG9tIGdyYXZpdHlcclxuICAgICAgICAgICAgLy9pZiAoIXRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCAtIDEwMCAqIE1hdGguYWJzKHRoaXMueVNwZWVkKSArIC0xMCk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZHQgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eSA9IGNjLnYyKDAsIC10aGlzLmRlbHRhVGltZSAqIDEwMDApO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gdGhpcy5kZWx0YVRpbWUgKiAzMDAwO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb3ZpbmdSaWdodCAmJiAhdGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wWCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3Jvd2luZyA9PSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4U2NhbGUgPiB0aGlzLm5vZGUuc2NhbGVZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNjYWxlWCArPSAwLjA1ICogZHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNjYWxlWSArPSAwLjA1ICogZHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3dpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZSBwbGF5ZXIgdmVsb2NpdHkgaWYgb24gZ3JvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92aW5nUmlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdyb3dpbmcgPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5TY2FsZSA8IHRoaXMubm9kZS5zY2FsZVkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVYIC09IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVZIC09IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRlY3JlYXNlIHBsYXllciB2ZWxvY2l0eSBpZiBvbiBncm91bmRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMuc21hbGxNb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcaGl0Q2hlY2tlci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInBsYXllciIsIk5vZGUiLCJkaWUiLCJnZXRDb21wb25lbnQiLCJpc1BsYXllciIsIlJpZ2lkQm9keSIsImxpbmVhclZlbG9jaXR5IiwiVmVjMiIsIngiLCJmaW5kIiwic3Bhd24iLCJ5IiwiZ3Jvd2luZyIsInN5cyIsInBsYXRmb3JtIiwiV0VDSEFUX0dBTUUiLCJ3eCIsInZpYnJhdGVTaG9ydCIsIndpbiIsIndvbiIsImFjdGl2ZSIsInNlbmRQbGF5ZXJTdGF0ZSIsImRpc2FibGUiLCJlbmFibGVkIiwiZ2V0Q2hpbGRCeU5hbWUiLCJBdWRpb1NvdXJjZSIsInBsYXkiLCJlYXRDYWtlIiwiY2FrZSIsImF0ZUNha2UiLCJzZW5kSXRlbVN0YXRlIiwiaWQiLCJkcmlua1BvdGlvbiIsInBvdGlvbiIsImF0ZVBvdGlvbiIsIm9wZW5DaGVzdCIsImNoZXN0Iiwic2V0Q2hlY2tQb2ludCIsImNoZWNrcG9pbnQiLCJBbmltYXRpb24iLCJvbkNvbGxpc2lvbkVudGVyIiwib3RoZXIiLCJzZWxmIiwibm9kZSIsImdyb3VwIiwidHlwZSIsIm9uTG9hZCIsImdldFBhcmVudCIsInVwZGF0ZSIsImR0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLO0FBREgsR0FIUDtBQU9MQyxFQUFBQSxHQVBLLGlCQU9DO0FBQ0YsUUFBSSxLQUFLRixNQUFMLENBQVlHLFlBQVosQ0FBeUIsVUFBekIsRUFBcUNDLFFBQXpDLEVBQW1EO0FBQy9DLFdBQUtKLE1BQUwsQ0FBWUcsWUFBWixDQUF5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QUFWLEVBQWQ7QUFDUCxHQXZGSTtBQXlGTEMsRUFBQUEsTUF6Rkssa0JBeUZFQyxFQXpGRixFQXlGTSxDQUNQO0FBQ0E7QUFDSDtBQTVGSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGxheWVyOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBkaWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueCA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIueSA9IGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24ueTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICAgICAgd3gudmlicmF0ZVNob3J0KFwibWVkaXVtXCIpO1xyXG4gICAgICAgIH0gICBcclxuICAgIH0sXHJcblxyXG4gICAgd2luKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmICFjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS53b24pIHtcclxuICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEVcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLndvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcIndpblwiKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDaGlsZEJ5TmFtZShcIkFVRElPXCIpLmdldENoaWxkQnlOYW1lKFwiV0lOXCIpLmdldENvbXBvbmVudChjYy5BdWRpb1NvdXJjZSkucGxheSgpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGVhdENha2UoY2FrZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5hdGVDYWtlID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShjYWtlLmdldENvbXBvbmVudChcIml0ZW1cIikuaWQsIFwidXNlZFwiLCBcImNha2VcIiwgbnVsbCk7XHJcbiAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIikuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBkcmlua1BvdGlvbihwb3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYXRlUG90aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZEl0ZW1TdGF0ZShwb3Rpb24uZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5pZCwgXCJ1c2VkXCIsIFwicG90aW9uXCIsIG51bGwpO1xyXG4gICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIikuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb3BlbkNoZXN0KGNoZXN0KSB7XHJcbiAgICAgICAgY2hlc3QuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS5vcGVuQ2hlc3QodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuaXNQbGF5ZXIpO1xyXG4gICAgfSxcclxuICAgIHNldENoZWNrUG9pbnQoY2hlY2twb2ludCkge1xyXG4gICAgICAgIC8vIGNoZWNrIGlmIGdvdHRlbiBhbHJlYWR5XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIm1vdmVtZW50XCIpLmlzUGxheWVyICYmIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc3Bhd24gIT0gY2hlY2twb2ludCkge1xyXG4gICAgICAgICAgICBjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImdhbWVNYW5hZ2VyXCIpLnNwYXduID0gY2hlY2twb2ludDtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJGQUNFXCIpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjaGVja3BvaW50LmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcIkZBQ0UyXCIpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNoZWNrcG9pbnQuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheShcInRleHRQb3B1cFwiKTtcclxuICAgICAgICAgICAgY2hlY2twb2ludC5nZXRDb21wb25lbnQoY2MuQXVkaW9Tb3VyY2UpLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gKG90aGVyLCBzZWxmKSB7XHJcblxyXG4gICAgICAgIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiZGFuZ2Vyb3VzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZGllKCk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVuZFwiKSBcclxuICAgICAgICAgICAgdGhpcy53aW4oKTtcclxuICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdyb3VwID09IFwiY2hlY2twb2ludFwiKVxyXG4gICAgICAgICAgICB0aGlzLnNldENoZWNrUG9pbnQob3RoZXIubm9kZSk7XHJcbiAgICAgICAgZWxzZSBpZiAob3RoZXIubm9kZS5ncm91cCA9PSBcIml0ZW1cIikge1xyXG4gICAgICAgICAgICBpZiAob3RoZXIubm9kZS5nZXRDb21wb25lbnQoXCJpdGVtXCIpLnR5cGUgPT0gXCJjYWtlXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVhdENha2Uob3RoZXIubm9kZSk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG90aGVyLm5vZGUuZ2V0Q29tcG9uZW50KFwiaXRlbVwiKS50eXBlID09IFwicG90aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyaW5rUG90aW9uKG90aGVyLm5vZGUpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChvdGhlci5ub2RlLmdldENvbXBvbmVudChcIml0ZW1cIikudHlwZSA9PSBcImNoZXN0XCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5DaGVzdChvdGhlci5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0UGFyZW50KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIC8vaWYgKCF0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5pc1BsYXllcilcclxuICAgICAgICAvLyAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgXHJcbiAgICB9LFxyXG59KTtcclxuIl19
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
    serverIp: null,
    houseIndex: 0
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcYWJvdXRQbGF5ZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJwbGF5ZXJJZCIsInJvb20iLCJjcm93bnMiLCJvcGVuaWQiLCJzZXJ2ZXJJcCIsImhvdXNlSW5kZXgiLCJvbkxvYWQiLCJnYW1lIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwibm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFFBQVEsRUFBRSxJQURGO0FBRVJDLElBQUFBLElBQUksRUFBRSxJQUZFO0FBR1JDLElBQUFBLE1BQU0sRUFBRSxDQUhBO0FBSVJDLElBQUFBLE1BQU0sRUFBRSxJQUpBO0FBS1JDLElBQUFBLFFBQVEsRUFBRSxJQUxGO0FBTVJDLElBQUFBLFVBQVUsRUFBRTtBQU5KLEdBSFA7QUFZTDtBQUVBQyxFQUFBQSxNQWRLLG9CQWNJO0FBQ0xWLElBQUFBLEVBQUUsQ0FBQ1csSUFBSCxDQUFRQyxrQkFBUixDQUEyQixLQUFLQyxJQUFoQztBQUNILEdBaEJJLENBa0JMOztBQWxCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBsYXllcklkOiBudWxsLFxyXG4gICAgICAgIHJvb206IG51bGwsXHJcbiAgICAgICAgY3Jvd25zOiAwLFxyXG4gICAgICAgIG9wZW5pZDogbnVsbCxcclxuICAgICAgICBzZXJ2ZXJJcDogbnVsbCxcclxuICAgICAgICBob3VzZUluZGV4OiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUodGhpcy5ub2RlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbn0pO1xyXG4iXX0=
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

var PlayerInfo = function PlayerInfo(id, name, crowns, wins, loses, houseIndex) {
  this.id = id;
  this.name = name;
  this.crowns = crowns;
  this.wins = wins;
  this.loses = loses;
  this.houseIndex = houseIndex;
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
    houseIndex: 0,
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
        _this.houseIndex = myData.data.houseIndex;
        cc.find("Canvas/CROWNS/num").getComponent(cc.Label).string = myData.data.crowns;
        cc.find("Canvas/WINS").getComponent(cc.Label).string = myData.data.wins + " wins";
        cc.find("Canvas/LOSES").getComponent(cc.Label).string = myData.data.loses + " loses";
        cc.find("Canvas/USERNAME").getComponent(cc.Label).string = _this.playerName;
        cc.find("MANAGER").getComponent("colorTheme").changeColor(_this.houseIndex);
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

          var abp = cc.find("MANAGER").getComponent("aboutPlayer");
          abp.playerId = this.playerId;
          abp.room = myData.data[1];
          abp.serverIp = this.serverIp;
          abp.crowns = this.crowns;
          abp.houseIndex = this.houseIndex;
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
    var houses = ["Gry", "Huf", "Rav", "Sly"];

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
            player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[houseIndex] + "] " + response[i].name;
            player.getChildByName("CROWNS").getComponent(cc.Label).string = response[i].crowns;
          }
        }
      });
      console.log("refreshing");
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        cc.find("Lobby Manager").getComponent("lobby").leaderboardNode.removeAllChildren();
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText).data;

        for (var i = 0; i < response.length; i++) {
          var player = cc.instantiate(cc.find("Lobby Manager").getComponent("lobby").playerStatPrefab);
          player.parent = cc.find("Lobby Manager").getComponent("lobby").leaderboardNode;
          player.getChildByName("PLACE").getComponent(cc.Label).string = i + 1 + ".";
          player.getChildByName("NAME").getComponent(cc.Label).string = "[" + houses[houseIndex] + "] " + response[i].name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbG9iYnkuanMiXSwibmFtZXMiOlsicGF5TG9hZCIsInR5cGUiLCJkYXRhIiwiUGxheWVyRGF0YSIsImlkIiwieCIsInBvc1giLCJwb3NZIiwibmFtZSIsInN0YXR1cyIsImtleSIsIlBsYXllckluZm8iLCJjcm93bnMiLCJ3aW5zIiwibG9zZXMiLCJob3VzZUluZGV4IiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ3cyIsInBsYXllck5hbWVOb2RlIiwiTm9kZSIsInBsYXllck5hbWUiLCJqb2luaW5nIiwiYnV0dG9uVGV4dCIsImxvYmJ5SW5mb1RleHQiLCJsb2JieVN0YXR1c1RleHQiLCJwbGF5ZXJJZCIsImNvbm5lY3RlZCIsImVycm9yTm9kZSIsImNvbm5lY3RpbmciLCJ0dXRvcmlhbHMiLCJ0dXRvcmlhbEluZGV4IiwidHV0b3JpYWxQYWdlIiwidXNlcm5hbWVOb2RlIiwic2VydmVySXAiLCJoYXZlVXNlckRhdGEiLCJzaG93aW5nTGVhZGVyYm9hcmQiLCJsZWFkZXJib2FyZE5vZGUiLCJsZWFkZXJib2FyZFRpdGxlIiwicGxheWVyU3RhdFByZWZhYiIsIlByZWZhYiIsInBsYXllclJlY29yZFByZWZhYiIsInJlY29yZHNOb2RlIiwicmVjb3Jkc1RpdGxlIiwic2lnbkluTm9kZSIsImlucHV0VXNlcm5hbWVOb2RlIiwicGFzc3dvcmROb2RlIiwicGFzc3dvcmQiLCJsb2dpbkVycm9yTm9kZSIsInNob3dOZXh0IiwiYWN0aXZlIiwiZ2l2ZVNpZ25JbkVycm9yIiwiZXJyb3IiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsInByZXNzU2lnbkluIiwic2lnbkluVXAiLCJFZGl0Qm94IiwidGhlTmFtZSIsInRoZVBhc3N3b3JkIiwic2VudCIsInRvVXBwZXJDYXNlIiwibGVuZ3RoIiwiaSIsImNoYXJDb2RlQXQiLCJXZWJTb2NrZXQiLCJhZGRFdmVudExpc3RlbmVyIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJteURhdGEiLCJwYXJzZSIsImZpbmQiLCJjaGFuZ2VDb2xvciIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xvc2UiLCJyZWZyZXNoTGVhZGVyIiwiam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5IiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsInJlY2VpdmVNZXNzYWdlIiwidXBkYXRlVXNlcnMiLCJhYnAiLCJyb29tIiwibGVhdmVMb2JieSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwidXBkYXRlU3RhdHVzIiwic2hvd0xlYWRlcmJvYXJkIiwiY2xvc2VMZWFkZXJib2FyZCIsImNsb3NlTG9iYnkiLCJjbG9zZUVycm9yIiwiam9pbkxvYmJ5Iiwid3giLCJjb25uZWN0U29ja2V0IiwidXJsIiwib25PcGVuIiwib25NZXNzYWdlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJvcyIsImNsb3NlU29ja2V0IiwibnVtIiwicHJlc3NKb2luIiwid2F0Y2giLCJjcmVhdGVXZUNoYXRCdXR0b24iLCJob3VzZXMiLCJyZXF1ZXN0Iiwic3VjY2VzcyIsInJlcyIsInJlbW92ZUFsbENoaWxkcmVuIiwicmVzcG9uc2UiLCJwbGF5ZXIiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImdldENoaWxkQnlOYW1lIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZXNwb25zZVRleHQiLCJvcGVuIiwicmVmcmVzaFJlY29yZHMiLCJzcGVlZCIsIm9wZW5UdXRvcmlhbCIsIm5leHRUdXRvcmlhbCIsImdvVG9TdG9yeSIsInN5c0luZm8iLCJ3aW5kb3ciLCJnZXRTeXN0ZW1JbmZvU3luYyIsIndpZHRoIiwic2NyZWVuV2lkdGgiLCJoZWlnaHQiLCJzY3JlZW5IZWlnaHQiLCJnZXRTZXR0aW5nIiwiYXV0aFNldHRpbmciLCJnZXRVc2VySW5mbyIsInVzZXJJbmZvIiwibmlja05hbWUiLCJsb2dpbiIsImQiLCJhcHBpZCIsInNlY3JlY3QiLCJsIiwiY29kZSIsIm1ldGhvZCIsIm9wZW5pZCIsImJ1dHRvbiIsImNyZWF0ZVVzZXJJbmZvQnV0dG9uIiwidGV4dCIsInN0eWxlIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiZm9udFNpemUiLCJ0ZXh0QWxpZ24iLCJsaW5lSGVpZ2h0Iiwib25UYXAiLCJkZXN0cm95Iiwib25Mb2FkIiwiZ2V0U3RvcmFnZSIsImZhaWwiLCJzZXRTdG9yYWdlIiwiZ2V0SXRlbSIsInN0YXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQSxVQUNGLGlCQUFZQyxJQUFaLEVBQWtCQyxJQUFsQixFQUF3QjtBQUNwQixPQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSDs7QUFDSjs7SUFFS0MsYUFDRixvQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFBQSxPQU1uQkMsSUFObUIsR0FNWixDQU5ZO0FBQUEsT0FPbkJDLElBUG1CLEdBT1osQ0FQWTtBQUFBLE9BUW5CQyxJQVJtQixHQVFaLElBUlk7QUFDZixPQUFLSixFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxPQUFLSSxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0g7O0FBSUo7O0lBR0tDLGFBQ0Ysb0JBQVlQLEVBQVosRUFBZ0JJLElBQWhCLEVBQXNCSSxNQUF0QixFQUE4QkMsSUFBOUIsRUFBb0NDLEtBQXBDLEVBQTJDQyxVQUEzQyxFQUF1RDtBQUNuRCxPQUFLWCxFQUFMLEdBQVVBLEVBQVY7QUFDQSxPQUFLSSxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLSSxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxPQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxPQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNIOztBQUNKO0FBRURDLEVBQUUsQ0FBQ0Ms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RW5HLElBQUksQ0FBQ0csS0FBTCxDQUFXMUQsRUFBRSxDQUFDNkQsR0FBSCxDQUFPQyxZQUFQLENBQW9CNEYsT0FBcEIsQ0FBNEIsVUFBNUIsQ0FBWCxDQUFuRTtBQUNILE9BRkQsTUFFTztBQUNILGFBQUt4QyxZQUFMO0FBQ0EsYUFBS3BGLFVBQUwsQ0FBZ0JNLE1BQWhCLEdBQXlCLElBQXpCO0FBQ0g7QUFFSjs7QUFFRCxTQUFLK0IsYUFBTDtBQUVILEdBcmdCSTtBQXVnQkx3RixFQUFBQSxLQXZnQkssbUJBdWdCSSxDQUVSLENBemdCSSxDQTJnQkw7O0FBM2dCSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBwYXlMb2FkIHtcclxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBQbGF5ZXJEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCB4KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAwO1xyXG4gICAgICAgIHRoaXMua2V5ID0gJyc7XHJcbiAgICB9XHJcbiAgICBwb3NYID0gMDtcclxuICAgIHBvc1kgPSAwO1xyXG4gICAgbmFtZSA9IG51bGw7XHJcbn07XHJcblxyXG5cclxuY2xhc3MgUGxheWVySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgY3Jvd25zLCB3aW5zLCBsb3NlcywgaG91c2VJbmRleCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY3Jvd25zID0gY3Jvd25zO1xyXG4gICAgICAgIHRoaXMud2lucyA9IHdpbnM7XHJcbiAgICAgICAgdGhpcy5sb3NlcyA9IGxvc2VzO1xyXG4gICAgICAgIHRoaXMuaG91c2VJbmRleCA9IGhvdXNlSW5kZXg7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHdzOiBudWxsLFxyXG4gICAgICAgIHBsYXllck5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllck5hbWU6IG51bGwsXHJcbiAgICAgICAgam9pbmluZzogZmFsc2UsXHJcbiAgICAgICAgYnV0dG9uVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBsb2JieUluZm9UZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGxvYmJ5U3RhdHVzVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJJZDogbnVsbCxcclxuICAgICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHN0YXR1czogXCIod2FpdGluZyBmb3IgcGxheWVycy4uLilcIixcclxuXHJcbiAgICAgICAgZXJyb3JOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNvbm5lY3Rpbmc6IGZhbHNlLFxyXG5cclxuICAgICAgICB0dXRvcmlhbHM6IFtjYy5Ob2RlXSxcclxuICAgICAgICB0dXRvcmlhbEluZGV4OiAwLFxyXG4gICAgICAgIHR1dG9yaWFsUGFnZTogY2MuTm9kZSxcclxuXHJcbiAgICAgICAgdXNlcm5hbWVOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHNlcnZlcklwOiBcIlwiLFxyXG4gICAgICAgIGhhdmVVc2VyRGF0YTogZmFsc2UsXHJcblxyXG4gICAgICAgIHNob3dpbmdMZWFkZXJib2FyZDogdHJ1ZSxcclxuICAgICAgICBsZWFkZXJib2FyZE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgbGVhZGVyYm9hcmRUaXRsZTogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJTdGF0UHJlZmFiOiBjYy5QcmVmYWIsXHJcblxyXG4gICAgICAgIHBsYXllclJlY29yZFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHJlY29yZHNOb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHJlY29yZHNUaXRsZTogY2MuTm9kZSxcclxuXHJcblxyXG4gICAgICAgIHNpZ25Jbk5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgaW5wdXRVc2VybmFtZU5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFzc3dvcmROb2RlOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhc3N3b3JkOiBudWxsLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBob3VzZUluZGV4OiAwLFxyXG4gICAgICAgIGxvZ2luRXJyb3JOb2RlOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93TmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zaG93aW5nTGVhZGVyYm9hcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGVhZGVyYm9hcmRUaXRsZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzVGl0bGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRzTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dpbmdMZWFkZXJib2FyZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sZWFkZXJib2FyZFRpdGxlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3Jkc1RpdGxlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZHNOb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dpbmdMZWFkZXJib2FyZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdpdmVTaWduSW5FcnJvcihlcnJvcikge1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBlcnJvcjtcclxuICAgIH0sXHJcbiAgICBwcmVzc1NpZ25JbigpIHtcclxuICAgICAgICB0aGlzLnNpZ25JblVwKHRoaXMuaW5wdXRVc2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZywgdGhpcy5wYXNzd29yZE5vZGUuZ2V0Q29tcG9uZW50KGNjLkVkaXRCb3gpLnN0cmluZylcclxuICAgIH0sXHJcbiAgICBzaWduSW5VcCh0aGVOYW1lLHRoZVBhc3N3b3JkKSB7XHJcbiAgICAgICAgbGV0IHNlbnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnBsYXllck5hbWUgPSB0aGVOYW1lLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgdGhpcy5wYXNzd29yZCA9IHRoZVBhc3N3b3JkO1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllck5hbWUubGVuZ3RoIDwgMSB8fCB0aGlzLnBhc3N3b3JkLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5naXZlU2lnbkluRXJyb3IoXCJ1c2VybmFtZS9wYXNzd29yZCB0b28gc2hvcnRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTmFtZS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllck5hbWVbaV0uY2hhckNvZGVBdCgpIDwgJ0EnLmNoYXJDb2RlQXQoKSB8fCB0aGlzLnBsYXllck5hbWVbaV0uY2hhckNvZGVBdCgpID4gJ1onLmNoYXJDb2RlQXQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5naXZlU2lnbkluRXJyb3IoXCJ1c2VybmFtZSBoYXMgaW52YWxpZCBjaGFyYWN0ZXJzXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhc3N3b3JkW2ldLmNoYXJDb2RlQXQoKSA8ICcwJy5jaGFyQ29kZUF0KCkgfHwgdGhpcy5wYXNzd29yZFtpXS5jaGFyQ29kZUF0KCkgPiAneicuY2hhckNvZGVBdCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcInBhc3N3b3JkIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDJcIik7XHJcblxyXG4gICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShuZXcgcGF5TG9hZChcInNpZ25JblwiLCBbdGhpcy5wbGF5ZXJOYW1lLCB0aGlzLnBhc3N3b3JkXSkpKTsgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChteURhdGEudHlwZSA9PSBcImZhaWxlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVTaWduSW5FcnJvcihcImNvdWxkbid0IHNpZ24gaW4gKGNoZWNrIGluZm8gb3IgdXNlcm5hbWUgaXMgdGFrZW4pXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobXlEYXRhLnR5cGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVySWQgPSBteURhdGEuZGF0YS5pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3Jvd25zID0gbXlEYXRhLmRhdGEuY3Jvd25zO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3VzZUluZGV4ID0gbXlEYXRhLmRhdGEuaG91c2VJbmRleDtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvQ1JPV05TL251bVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLmNyb3ducztcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvV0lOU1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG15RGF0YS5kYXRhLndpbnMgKyBcIiB3aW5zXCI7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL0xPU0VTXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbXlEYXRhLmRhdGEubG9zZXMgKyBcIiBsb3Nlc1wiO1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9VU0VSTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMucGxheWVyTmFtZTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJNQU5BR0VSXCIpLmdldENvbXBvbmVudChcImNvbG9yVGhlbWVcIikuY2hhbmdlQ29sb3IodGhpcy5ob3VzZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucGxheWVyTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGFzc3dvcmRcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5wYXNzd29yZCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduSW5Ob2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZCA9IFwiICsgdGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5KCkge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcImpvaW5lZCBsb2JieVwiKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgLy9pZiAoY2Muc3lzLnBsYXRmb3JtICE9IGNjLnN5cy5XRUNIQVRfR0FNRSlcclxuICAgICAgICAvLyAgICB0aGlzLnBsYXllcklkID0gdGhpcy5wbGF5ZXJOYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuRWRpdEJveCkuc3RyaW5nO1xyXG5cclxuICAgICAgICB0aGlzLmpvaW5pbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiQ0FOQ0VMXCI7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxvYmJ5U3RhdHVzVGV4dC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSlcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKHsgZGF0YTogSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQoXCJwbGF5ZXJfbmFtZVwiLCBbdGhpcy5wbGF5ZXJOYW1lLCBcIndlY2hhdFwiLCB0aGlzLnBsYXllcklkXSkpIH0pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3IHBheUxvYWQoXCJwbGF5ZXJfbmFtZVwiLCBbdGhpcy5wbGF5ZXJOYW1lLCBcIndlY2hhdFwiLCB0aGlzLnBsYXllcklkXSkpKTtcclxuICAgIH0sXHJcbiAgICByZWNlaXZlTWVzc2FnZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IG15RGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgc3dpdGNoIChteURhdGEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibG9iYnlJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhteURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJzKG15RGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicGxheWVySW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IG15RGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wbGF5ZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInN0YXR1c1wiOlxyXG4gICAgICAgICAgICAgICAgaWYgKG15RGF0YS5kYXRhWzBdID09IFwic3RhcnRpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBpcyBzdGFydGluZyBpbiBcIiArIG15RGF0YS5kYXRhWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiKHN0YXJ0aW5nIGluIFwiICsgbXlEYXRhLmRhdGFbMV0gKyBcIilcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG15RGF0YS5kYXRhWzBdID09IFwic3RhcnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vc3RhcnQgZ2FtZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3ZhciB0aGVQbGF5ZXJJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIGlkOiB0aGlzLnBsYXllcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHBvcnQ6IG15RGF0YS5kYXRhWzFdLGZcclxuICAgICAgICAgICAgICAgICAgICAvL307XHJcbiAgICAgICAgICAgICAgICAgICAgLy9tb2R1bGUuZXhwb3J0cyA9IHRoZVBsYXllckluZm87XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhYnAgPSBjYy5maW5kKFwiTUFOQUdFUlwiKS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhYnAucGxheWVySWQgPSB0aGlzLnBsYXllcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIGFicC5yb29tID0gbXlEYXRhLmRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLnNlcnZlcklwID0gdGhpcy5zZXJ2ZXJJcDtcclxuICAgICAgICAgICAgICAgICAgICBhYnAuY3Jvd25zID0gdGhpcy5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICAgICAgYWJwLmhvdXNlSW5kZXggPSB0aGlzLmhvdXNlSW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG15RGF0YS5kYXRhWzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTogY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFwMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6IGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1hcDJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOiBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYXAzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobXlEYXRhLmRhdGFbMF0gPT0gXCJzdG9wXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiKHdhaXRpbmcgZm9yIHBsYXllcnMuLi4pXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1cygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNob3dMZWFkZXJib2FyZCgpIHtcclxuICAgICAgICB0aGlzLmxlYWRlcmJvYXJkTm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlTGVhZGVyYm9hcmQoKSB7XHJcbiAgICAgICAgdGhpcy5sZWFkZXJib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VMb2JieSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3RlZFwiKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuam9pbmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiUExBWVwiO1xyXG4gICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG4gICAgICAgIC8vdGhpcy5sb2JieUluZm9UZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbG9zZUVycm9yKCkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGpvaW5Mb2JieSgpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieWVzXCIpO1xyXG4gICAgICAgICAgICB0aGlzLndzID0gd3guY29ubmVjdFNvY2tldCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwid3M6Ly9cIiArIHRoaXMuc2VydmVySXAgK1wiOjkwOTFcIlxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbk9wZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qb2luTG9iYnlTdWNjZXNzZnVsbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uTWVzc2FnZSgoeyBkYXRhIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZU1lc3NhZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbkVycm9yKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bGRuJ3QgY29ubmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLm9uQ2xvc2UoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUxvYmJ5KCk7ICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuICAgICAgICAgICAgdGhpcy53cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjkwOTFcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuam9pbkxvYmJ5U3VjY2Vzc2Z1bGx5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3MuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY291bGRuJ3QgY29ubmVjdFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbG9zZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlTG9iYnkoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBsZWF2ZUxvYmJ5KCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLldFQ0hBVF9HQU1FKVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlU29ja2V0KCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLndzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVXNlcnMobnVtKSB7XHJcbiAgICAgICAgLy90aGlzLmxvYmJ5SW5mb1RleHQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBudW0gKyBcIi8xMCBwbGF5ZXJzIFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlU3RhdHVzKCkge1xyXG4gICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdGhpcy5zdGF0dXM7XHJcbiAgICB9LFxyXG4gICAgcHJlc3NKb2luKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJJZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaExlYWRlcigpO1xyXG4gICAgICAgICAgICAvLyBjYW5ub3Qgam9pbiBtdWx0aXBsZSB0aW1lc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXZlVXNlckRhdGEgfHwgY2Muc3lzLnBsYXRmb3JtICE9IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmpvaW5pbmcgJiYgIXRoaXMuY29ubmVjdGluZykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmpvaW5Mb2JieSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuam9pbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiUExBWVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMb2JieSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9iYnlJbmZvVGV4dC5hY3RpdmUgPSBmYWxzZTsgdGhpcy53YXRjaFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9iYnlTdGF0dXNUZXh0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVXZUNoYXRCdXR0b24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlZnJlc2hMZWFkZXIoKSB7XHJcbiAgICAgICAgbGV0IGhvdXNlcyA9ICBbXCJHcnlcIiwgXCJIdWZcIiwgXCJSYXZcIiwgXCJTbHlcIl07XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJTdGF0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYFske2hvdXNlc1tob3VzZUluZGV4XX1dIGAgKyByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVmcmVzaGluZ1wiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikubGVhZGVyYm9hcmROb2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyU3RhdFByZWZhYik7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhcmVudCA9IGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLmxlYWRlcmJvYXJkTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJQTEFDRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGkgKyAxICsgXCIuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGBbJHtob3VzZXNbaG91c2VJbmRleF19XSBgICsgcmVzcG9uc2VbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5jcm93bnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cDovL1wiICsgdGhpcy5zZXJ2ZXJJcCArIFwiOjMwMDAvXCIpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZnJlc2hSZWNvcmRzKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICByZWZyZXNoUmVjb3JkcygpIHtcclxuICAgICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogXCJodHRwOi8vXCIgKyB0aGlzLnNlcnZlcklwICsgXCI6MzAwMS9cIixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSByZXMuZGF0YS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZCAtIG5hbWUgLSBjcm93bnMgLSB3aW5zIC0gbG9zZXNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBjYy5pbnN0YW50aWF0ZShjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJSZWNvcmRQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlBMQUNFXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gaSArIDEgKyBcIi5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiTkFNRVwiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHJlc3BvbnNlW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWZyZXNoaW5nXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWNvcmRzTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuZGF0YTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gY2MuaW5zdGFudGlhdGUoY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucGxheWVyUmVjb3JkUHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGFyZW50ID0gY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikucmVjb3Jkc05vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmdldENoaWxkQnlOYW1lKFwiUExBQ0VcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpICsgMSArIFwiLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIk5BTUVcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSByZXNwb25zZVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlNQRUVEXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcmVzcG9uc2VbaV0uc3BlZWQgKyBcIiBzXCIgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcImh0dHA6Ly9cIiArIHRoaXMuc2VydmVySXAgKyBcIjozMDAxL1wiKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgICBvcGVuVHV0b3JpYWwoKSB7XHJcbiAgICAgICAgdGhpcy50dXRvcmlhbFBhZ2UuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1swXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIG5leHRUdXRvcmlhbCgpIHtcclxuICAgICAgICB0aGlzLnR1dG9yaWFsc1t0aGlzLnR1dG9yaWFsSW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudHV0b3JpYWxJbmRleCArPSAxOyAgICBcclxuICAgICAgICBpZiAodGhpcy50dXRvcmlhbEluZGV4IDwgdGhpcy50dXRvcmlhbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHV0b3JpYWxzW3RoaXMudHV0b3JpYWxJbmRleF0uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnR1dG9yaWFsUGFnZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy50dXRvcmlhbEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGdvVG9TdG9yeSgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJzdG9yeVwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlV2VDaGF0QnV0dG9uKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyTmFtZU5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWVOb2RlLmFjdGl2ZSA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHN5c0luZm8gPSB3aW5kb3cud3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHN5c0luZm8uc2NyZWVuV2lkdGg7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBzeXNJbmZvLnNjcmVlbkhlaWdodDtcclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5hdXRoU2V0dGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJJbmZvXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnVzZXJuYW1lTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwiMVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB1c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS51c2VybmFtZU5vZGUuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSB1c2VySW5mby5uaWNrTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5wbGF5ZXJOYW1lID0gdXNlckluZm8ubmlja05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuaGF2ZVVzZXJEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NmdWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5hcHBpZCA9IFwid3hhNjYwMmU1MDE2MjU0NzFmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnNlY3JlY3QgPSBcImEwYWY0Yzg5NmYyMmNlOWMwMGQ2MWEyNzRlMmFmYWQxXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbCA9ICdodHRwczovL2FwaS53ZWl4aW4ucXEuY29tL3Nucy9qc2NvZGUyc2Vzc2lvbj9hcHBpZD0nICsgZC5hcHBpZCArICcmc2VjcmV0PScgKyBkLnNlY3JlY3QgKyAnJmpzX2NvZGU9JyArIHJlcy5jb2RlICsgJyZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLm9wZW5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJMb2JieSBNYW5hZ2VyXCIpLmdldENvbXBvbmVudChcImxvYmJ5XCIpLnBsYXllcklkID0gcmVzLmRhdGEub3BlbmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5yZWZyZXNoTGVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidXR0b24gPSB3eC5jcmVhdGVVc2VySW5mb0J1dHRvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnYWxsb3cgbWluaXByb2dyYW0gdG8gdXNlIGluZm8/JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZBRUIzQycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5vblRhcCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zb21ldGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlckluZm8gPSByZXMudXNlckluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikudXNlcm5hbWVOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gdXNlckluZm8ubmlja05hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc29tZXRoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3BsYXllZCBiZWZvcmVcclxuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiTG9iYnkgTWFuYWdlclwiKS5nZXRDb21wb25lbnQoXCJsb2JieVwiKS5vcGVuVHV0b3JpYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBcInBsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBcInllc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV2VDaGF0QnV0dG9uKCk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwbGF5ZWQgYmVmb3JlXHJcbiAgICAgICAgICAgIGlmIChjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPSBudWxsICYmIGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2lnbkluVXAoSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSksIEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblR1dG9yaWFsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25Jbk5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoTGVhZGVyKCk7ICAgXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/colorTheme.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY29sb3JUaGVtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdUaGVtZTAiLCJnVGhlbWUxIiwiaFRoZW1lMCIsImhUaGVtZTEiLCJyVGhlbWUwIiwiclRoZW1lMSIsInNUaGVtZTAiLCJzVGhlbWUxIiwiZWxlbWVudHMwIiwiTm9kZSIsImVsZW1lbnRzMSIsImZyYW1lcyIsInN0YXJ0IiwiY2hhbmdlQ29sb3IiLCJpIiwibm9kZSIsImdldENvbXBvbmVudCIsImhvdXNlSW5kZXgiLCJpbmRleCIsImxlbmd0aCIsImFjdGl2ZSIsImNvbG9yIiwiQ29sb3IiLCJmcm9tSEVYIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsT0FBTyxFQUFDLFNBREE7QUFFUkMsSUFBQUEsT0FBTyxFQUFDLFNBRkE7QUFHUkMsSUFBQUEsT0FBTyxFQUFDLFNBSEE7QUFJUkMsSUFBQUEsT0FBTyxFQUFDLFNBSkE7QUFLUkMsSUFBQUEsT0FBTyxFQUFDLFNBTEE7QUFNUkMsSUFBQUEsT0FBTyxFQUFDLFNBTkE7QUFPUkMsSUFBQUEsT0FBTyxFQUFDLFNBUEE7QUFRUkMsSUFBQUEsT0FBTyxFQUFDLFNBUkE7QUFTUkMsSUFBQUEsU0FBUyxFQUFDLENBQUNaLEVBQUUsQ0FBQ2EsSUFBSixDQVRGO0FBVVJDLElBQUFBLFNBQVMsRUFBQyxDQUFDZCxFQUFFLENBQUNhLElBQUosQ0FWRjtBQVdSRSxJQUFBQSxNQUFNLEVBQUMsQ0FBQ2YsRUFBRSxDQUFDYSxJQUFKO0FBWEMsR0FIUDtBQWlCTDtBQUVBO0FBRUFHLEVBQUFBLEtBckJLLG1CQXFCSSxDQUVSLENBdkJJO0FBeUJMO0FBRUFDLEVBQUFBLFdBM0JLLHVCQTJCT0MsQ0EzQlAsRUE0Qkw7QUFDSSxRQUFHQSxDQUFDLEdBQUMsQ0FBTCxFQUFRQSxDQUFDLEdBQUMsQ0FBRjtBQUNSLFNBQUtDLElBQUwsQ0FBVUMsWUFBVixDQUF1QixhQUF2QixFQUFzQ0MsVUFBdEMsR0FBbURILENBQW5EOztBQUNBLFNBQUssSUFBSUksS0FBSyxHQUFHLENBQWpCLEVBQW9CQSxLQUFLLEdBQUcsS0FBS1AsTUFBTCxDQUFZUSxNQUF4QyxFQUFnREQsS0FBSyxFQUFyRCxFQUF5RDtBQUFDLFdBQUtQLE1BQUwsQ0FBWU8sS0FBWixFQUFtQkUsTUFBbkIsR0FBNEIsS0FBNUI7QUFBbUM7O0FBQzdGLFNBQUtULE1BQUwsQ0FBWUcsQ0FBWixFQUFlTSxNQUFmLEdBQXdCLElBQXhCOztBQUNBLFlBQVFOLENBQVI7QUFDSSxXQUFLLENBQUw7QUFDSSxhQUFLLElBQUlJLE1BQUssR0FBRyxDQUFqQixFQUFvQkEsTUFBSyxHQUFHLEtBQUtWLFNBQUwsQ0FBZVcsTUFBM0MsRUFBbURELE1BQUssRUFBeEQsRUFBNEQ7QUFBQyxlQUFLVixTQUFMLENBQWVVLE1BQWYsRUFBc0JHLEtBQXRCLEdBQThCLElBQUl6QixFQUFFLENBQUMwQixLQUFQLEdBQWVDLE9BQWYsQ0FBdUIsS0FBS3ZCLE9BQTVCLENBQTlCO0FBQW1FOztBQUFBOztBQUNoSSxhQUFLLElBQUlrQixPQUFLLEdBQUcsQ0FBakIsRUFBb0JBLE9BQUssR0FBRyxLQUFLUixTQUFMLENBQWVTLE1BQTNDLEVBQW1ERCxPQUFLLEVBQXhELEVBQTREO0FBQUMsZUFBS1IsU0FBTCxDQUFlUSxPQUFmLEVBQXNCRyxLQUF0QixHQUE4QixJQUFJekIsRUFBRSxDQUFDMEIsS0FBUCxHQUFlQyxPQUFmLENBQXVCLEtBQUt0QixPQUE1QixDQUE5QjtBQUFtRTs7QUFBQTtBQUNoSTs7QUFDSixXQUFLLENBQUw7QUFDSSxhQUFLLElBQUlpQixPQUFLLEdBQUcsQ0FBakIsRUFBb0JBLE9BQUssR0FBRyxLQUFLVixTQUFMLENBQWVXLE1BQTNDLEVBQW1ERCxPQUFLLEVBQXhELEVBQTREO0FBQUMsZUFBS1YsU0FBTCxDQUFlVSxPQUFmLEVBQXNCRyxLQUF0QixHQUE4QixJQUFJekIsRUFBRSxDQUFDMEIsS0FBUCxHQUFlQyxPQUFmLENBQXVCLEtBQUtyQixPQUE1QixDQUE5QjtBQUFtRTs7QUFBQTs7QUFDaEksYUFBSyxJQUFJZ0IsT0FBSyxHQUFHLENBQWpCLEVBQW9CQSxPQUFLLEdBQUcsS0FBS1IsU0FBTCxDQUFlUyxNQUEzQyxFQUFtREQsT0FBSyxFQUF4RCxFQUE0RDtBQUFDLGVBQUtSLFNBQUwsQ0FBZVEsT0FBZixFQUFzQkcsS0FBdEIsR0FBOEIsSUFBSXpCLEVBQUUsQ0FBQzBCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLcEIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7QUFDaEk7O0FBQ0osV0FBSyxDQUFMO0FBQ0ksYUFBSyxJQUFJZSxPQUFLLEdBQUcsQ0FBakIsRUFBb0JBLE9BQUssR0FBRyxLQUFLVixTQUFMLENBQWVXLE1BQTNDLEVBQW1ERCxPQUFLLEVBQXhELEVBQTREO0FBQUMsZUFBS1YsU0FBTCxDQUFlVSxPQUFmLEVBQXNCRyxLQUF0QixHQUE4QixJQUFJekIsRUFBRSxDQUFDMEIsS0FBUCxHQUFlQyxPQUFmLENBQXVCLEtBQUtuQixPQUE1QixDQUE5QjtBQUFtRTs7QUFBQTs7QUFDaEksYUFBSyxJQUFJYyxPQUFLLEdBQUcsQ0FBakIsRUFBb0JBLE9BQUssR0FBRyxLQUFLUixTQUFMLENBQWVTLE1BQTNDLEVBQW1ERCxPQUFLLEVBQXhELEVBQTREO0FBQUMsZUFBS1IsU0FBTCxDQUFlUSxPQUFmLEVBQXNCRyxLQUF0QixHQUE4QixJQUFJekIsRUFBRSxDQUFDMEIsS0FBUCxHQUFlQyxPQUFmLENBQXVCLEtBQUtsQixPQUE1QixDQUE5QjtBQUFtRTs7QUFBQTtBQUNoSTs7QUFDSixXQUFLLENBQUw7QUFDSSxhQUFLLElBQUlhLE9BQUssR0FBRyxDQUFqQixFQUFvQkEsT0FBSyxHQUFHLEtBQUtWLFNBQUwsQ0FBZVcsTUFBM0MsRUFBbURELE9BQUssRUFBeEQsRUFBNEQ7QUFBQyxlQUFLVixTQUFMLENBQWVVLE9BQWYsRUFBc0JHLEtBQXRCLEdBQThCLElBQUl6QixFQUFFLENBQUMwQixLQUFQLEdBQWVDLE9BQWYsQ0FBdUIsS0FBS2pCLE9BQTVCLENBQTlCO0FBQW1FOztBQUFBOztBQUNoSSxhQUFLLElBQUlZLE9BQUssR0FBRyxDQUFqQixFQUFvQkEsT0FBSyxHQUFHLEtBQUtSLFNBQUwsQ0FBZVMsTUFBM0MsRUFBbURELE9BQUssRUFBeEQsRUFBNEQ7QUFBQyxlQUFLUixTQUFMLENBQWVRLE9BQWYsRUFBc0JHLEtBQXRCLEdBQThCLElBQUl6QixFQUFFLENBQUMwQixLQUFQLEdBQWVDLE9BQWYsQ0FBdUIsS0FBS2hCLE9BQTVCLENBQTlCO0FBQW1FOztBQUFBO0FBQ2hJO0FBaEJSO0FBa0JIO0FBbkRJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBnVGhlbWUwOlwiIzc0MDAwMVwiLFxyXG4gICAgICAgIGdUaGVtZTE6XCIjRDNBNjI1XCIsXHJcbiAgICAgICAgaFRoZW1lMDpcIiNGRkQ4MDBcIixcclxuICAgICAgICBoVGhlbWUxOlwiIzAwMDAwMFwiLFxyXG4gICAgICAgIHJUaGVtZTA6XCIjMEUxQTQwXCIsXHJcbiAgICAgICAgclRoZW1lMTpcIiM5NDZCMkRcIixcclxuICAgICAgICBzVGhlbWUwOlwiIzFBNDcyQVwiLFxyXG4gICAgICAgIHNUaGVtZTE6XCIjNUQ1RDVEXCIsXHJcbiAgICAgICAgZWxlbWVudHMwOltjYy5Ob2RlXSxcclxuICAgICAgICBlbGVtZW50czE6W2NjLk5vZGVdLFxyXG4gICAgICAgIGZyYW1lczpbY2MuTm9kZV0sXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIC8vIG9uTG9hZCAoKSB7fSxcclxuXHJcbiAgICBzdGFydCAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcbiAgICBjaGFuZ2VDb2xvcihpKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGk+MykgaT0wO1xyXG4gICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5ob3VzZUluZGV4ID0gaTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5mcmFtZXMubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5mcmFtZXNbaW5kZXhdLmFjdGl2ZSA9IGZhbHNlO31cclxuICAgICAgICB0aGlzLmZyYW1lc1tpXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHN3aXRjaCAoaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmdUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuZ1RoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMC5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMFtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuaFRoZW1lMCl9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMxLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMxW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5oVGhlbWUxKX07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5yVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnJUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnNUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuc1RoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl19
//------QC-SOURCE-SPLIT------
