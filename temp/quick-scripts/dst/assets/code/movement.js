
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