
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
    console.log("disabled");

    if (cc.sys.platform == cc.sys.WECHAT_GAME) {
      var joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");
      var jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");
      var potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");
      var cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");
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
    var emoji = this.emojis.getChildByName(type);
    console.log("emoting"); //no spam error

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
    console.log("touched");

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
      //cc.find("Canvas/mainCamera/").getComponent("cameraFollow").xOffsetPlayer = 0;
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
        if (this.grounded) this.jump();else console.log("not grouned");
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
            cc.find("Canvas/mainCamera/UI/MOBILE").active = true;
            this.joystickBall = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK/BALL");
            var joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");
            var jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");
            var potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");
            var cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");
            joystick.on(cc.Node.EventType.TOUCH_START, this.joystickStart, this);
            joystick.on(cc.Node.EventType.TOUCH_MOVE, this.joystickMove, this);
            joystick.on(cc.Node.EventType.TOUCH_END, this.joystickEnd, this);
            joystick.on(cc.Node.EventType.TOUCH_CANCEL, this.joystickEnd, this);
            jumpButton.on(cc.Node.EventType.TOUCH_START, this.jump, this);
            potionButton.on(cc.Node.EventType.TOUCH_START, this.shrink, this);
            cakeButton.on(cc.Node.EventType.TOUCH_START, this.grow, this);
          } else {
            this.joystickBall = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK/BALL");

            var _joystick = cc.find("Canvas/mainCamera/UI/MOBILE/JOYSTICK");

            var _jumpButton = cc.find("Canvas/mainCamera/UI/MOBILE/JUMP");

            var _potionButton = cc.find("Canvas/mainCamera/UI/MOBILE/POTION");

            var _cakeButton = cc.find("Canvas/mainCamera/UI/MOBILE/CAKE");

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

      cc.director.getPhysicsManager().gravity = cc.v2(0, -this.deltaTime * 2000);
      this.node.getComponent(cc.RigidBody).gravityScale = this.deltaTime * 6000;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92ZW1lbnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJqdW1wSGVpZ2h0Iiwic21hbGxKdW1wSGVpZ2h0IiwianVtcER1cmF0aW9uIiwibW92ZVNwZWVkIiwic21hbGxNb3ZlU3BlZWQiLCJpc1BsYXllciIsImNsaWVudFNjcmlwdCIsIk5vZGUiLCJ4U3BlZWQiLCJ5U3BlZWQiLCJsb2NhbENlbnRlciIsImdyb3VuZGVyIiwiYm9keSIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsImRlbHRhVGltZSIsImZhbGxNdWx0aXBsaWVyIiwiZ3Jvd2luZyIsIm1heFNjYWxlIiwibWluU2NhbGUiLCJhdGVDYWtlIiwiYXRlUG90aW9uIiwiZ3JvdW5kZWQiLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJqb3lzdGlja01heCIsImpveXN0aWNrVmVjdG9yIiwidjIiLCJqb3lzdGlja0JhbGwiLCJlbW9qaXMiLCJ0aW1lU3RlcCIsInN0YXJ0VGltZXIiLCJwbGF5aW5nQW5pbWF0aW9uIiwiam95c3RpY2tNb3ZpbmciLCJwbGF5ZWRGYWxsaW5nIiwic291bmRDb250cm9sbGVyIiwic291bmRzIiwiYnVzeSIsInRvdGFsIiwic3VtIiwiZGlzYWJsZSIsImNvbnNvbGUiLCJsb2ciLCJzeXMiLCJwbGF0Zm9ybSIsIldFQ0hBVF9HQU1FIiwiam95c3RpY2siLCJmaW5kIiwianVtcEJ1dHRvbiIsInBvdGlvbkJ1dHRvbiIsImNha2VCdXR0b24iLCJvZmYiLCJFdmVudFR5cGUiLCJUT1VDSF9TVEFSVCIsImpveXN0aWNrU3RhcnQiLCJUT1VDSF9NT1ZFIiwiam95c3RpY2tNb3ZlIiwiVE9VQ0hfRU5EIiwiam95c3RpY2tFbmQiLCJUT1VDSF9DQU5DRUwiLCJqdW1wIiwic2hyaW5rIiwiZ3JvdyIsInN5c3RlbUV2ZW50IiwiU3lzdGVtRXZlbnQiLCJLRVlfRE9XTiIsIm9uS2V5RG93biIsIktFWV9VUCIsIm9uS2V5VXAiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiUmlnaWRCb2R5IiwiZ3Jhdml0eVNjYWxlIiwibGluZWFyVmVsb2NpdHkiLCJWZWMyIiwicGxheUVtb2ppIiwidHlwZSIsImVtb2ppIiwiZ2V0Q2hpbGRCeU5hbWUiLCJhY3RpdmUiLCJ0d2VlbiIsInRvIiwicG9zaXRpb24iLCJ4IiwiTWF0aCIsImNlaWwiLCJyYW5kb20iLCJyb3VuZCIsInkiLCJlYXNpbmciLCJzdGFydCIsImRlbGF5IiwiY2FsbCIsIm9uQmVnaW5Db250YWN0IiwiY29udGFjdCIsInNlbGYiLCJvdGhlciIsInRhZyIsImdyb3VwIiwibW92aW5nIiwicGxheSIsInNjaGVkdWxlT25jZSIsInNjYWxlWSIsIm9uRW5kQ29udGFjdCIsImp1bXBSdW5BY3Rpb24iLCJqdW1wVXAiLCJieSIsImp1bXBEb3duIiwic2VxdWVuY2UiLCJtb3ZlUmlnaHQiLCJzY2FsZVgiLCJhbmltU3RhdGUiLCJ3cmFwTW9kZSIsIldyYXBNb2RlIiwiTG9vcCIsInNlbmRQbGF5ZXJTdGF0ZSIsIm1vdmVMZWZ0Iiwic3RvcCIsInN0b3BYIiwic3RvcFkiLCJldmVudCIsImtleUNvZGUiLCJtYWNybyIsIktFWSIsInciLCJhIiwiZCIsImUiLCJxIiwic3BhY2UiLCJvbkxvYWQiLCJNYXAiLCJpIiwiZ2V0Q29tcG9uZW50cyIsIkF1ZGlvU291cmNlIiwibGVuZ3RoIiwiY2xpcCIsIm5hbWUiLCJvbkRlc3Ryb3kiLCJ0b3VjaFBvcyIsImdldExvY2F0aW9uIiwib3V0IiwiQ2FtZXJhIiwiZ2V0U2NyZWVuVG9Xb3JsZFBvaW50IiwibG9jYWxUb3VjaFBvcyIsInBhcmVudCIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwibGltaXRKb3lzdGljayIsInNldEpveXN0aWNrQmFsbFBvcyIsImpveXN0aWNrTW92ZVBsYXllciIsInRvdWNoIiwiZ2V0VG91Y2hlcyIsIlpFUk8iLCJwb3MiLCJzZXRQb3NpdGlvbiIsImpveXN0aWNrVmVjIiwiaW5wdXRNYWciLCJtYWciLCJtdWxTZWxmIiwidXBkYXRlIiwiZHQiLCJnZXRMb2NhbENlbnRlciIsImdhbWVTdGFydGVkIiwicGxheWVySWQiLCJhYnMiLCJyYiIsIm9uIiwieU9mZnNldFBsYXllciIsInhPZmZzZXRQbGF5ZXIiLCJkaXJlY3RvciIsImdldFBoeXNpY3NNYW5hZ2VyIiwiZ3Jhdml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFVBQVUsRUFBRSxDQURKO0FBRVJDLElBQUFBLGVBQWUsRUFBRSxDQUZUO0FBR1JDLElBQUFBLFlBQVksRUFBRSxDQUhOO0FBSVJDLElBQUFBLFNBQVMsRUFBRSxDQUpIO0FBS1JDLElBQUFBLGNBQWMsRUFBRSxDQUxSO0FBTVJDLElBQUFBLFFBQVEsRUFBRSxLQU5GO0FBT1JDLElBQUFBLFlBQVksRUFBRVYsRUFBRSxDQUFDVyxJQVBUO0FBUVJDLElBQUFBLE1BQU0sRUFBRSxDQVJBO0FBU1JDLElBQUFBLE1BQU0sRUFBRSxDQVRBO0FBVVJDLElBQUFBLFdBQVcsRUFBRSxDQVZMO0FBV1JDLElBQUFBLFFBQVEsRUFBRWYsRUFBRSxDQUFDVyxJQVhMO0FBWVJLLElBQUFBLElBQUksRUFBRWhCLEVBQUUsQ0FBQ1csSUFaRDtBQWFSTSxJQUFBQSxTQUFTLEVBQUVqQixFQUFFLENBQUNrQixTQWJOO0FBY1JDLElBQUFBLFNBQVMsRUFBRSxDQWRIO0FBZVJDLElBQUFBLGNBQWMsRUFBRSxHQWZSO0FBZ0JSQyxJQUFBQSxPQUFPLEVBQUUsQ0FoQkQ7QUFpQlJDLElBQUFBLFFBQVEsRUFBRSxDQWpCRjtBQWtCUkMsSUFBQUEsUUFBUSxFQUFFLEdBbEJGO0FBbUJSQyxJQUFBQSxPQUFPLEVBQUUsS0FuQkQ7QUFvQlJDLElBQUFBLFNBQVMsRUFBRSxLQXBCSDtBQXFCUkMsSUFBQUEsUUFBUSxFQUFFLEtBckJGO0FBc0JS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QUUsQ0FBQzJFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRDdFLEVBQUUsQ0FBQzhFLElBQUgsQ0FBUSxDQUFDLEtBQUt0RSxjQUFOLEdBQXVCLEtBQUtXLFNBQXBDLEVBQStDLEtBQUtOLE1BQXBELENBQWpEO0FBQ1A7QUFDSjtBQUNKO0FBQ0o7QUFHSjtBQTFoQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gICAgXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAganVtcEhlaWdodDogMCxcclxuICAgICAgICBzbWFsbEp1bXBIZWlnaHQ6IDAsXHJcbiAgICAgICAganVtcER1cmF0aW9uOiAwLFxyXG4gICAgICAgIG1vdmVTcGVlZDogMCxcclxuICAgICAgICBzbWFsbE1vdmVTcGVlZDogMCxcclxuICAgICAgICBpc1BsYXllcjogZmFsc2UsXHJcbiAgICAgICAgY2xpZW50U2NyaXB0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHhTcGVlZDogMCxcclxuICAgICAgICB5U3BlZWQ6IDAsXHJcbiAgICAgICAgbG9jYWxDZW50ZXI6IDAsXHJcbiAgICAgICAgZ3JvdW5kZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgYm9keTogY2MuTm9kZSxcclxuICAgICAgICBhbmltYXRpb246IGNjLkFuaW1hdGlvbixcclxuICAgICAgICBkZWx0YVRpbWU6IDAsXHJcbiAgICAgICAgZmFsbE11bHRpcGxpZXI6IDIuNSxcclxuICAgICAgICBncm93aW5nOiAwLFxyXG4gICAgICAgIG1heFNjYWxlOiAxLFxyXG4gICAgICAgIG1pblNjYWxlOiAwLjUsXHJcbiAgICAgICAgYXRlQ2FrZTogZmFsc2UsXHJcbiAgICAgICAgYXRlUG90aW9uOiBmYWxzZSxcclxuICAgICAgICBncm91bmRlZDogZmFsc2UsXHJcbiAgICAgICAgbW92aW5nUmlnaHQ6IGZhbHNlLFxyXG4gICAgICAgIG1vdmluZ0xlZnQ6IGZhbHNlLFxyXG4gICAgICAgIGpveXN0aWNrTWF4OiA2OSxcclxuICAgICAgICBqb3lzdGlja1ZlY3RvcjogY2MudjIoKSxcclxuICAgICAgICBqb3lzdGlja0JhbGw6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVTdGVwOiAwLFxyXG4gICAgICAgIHN0YXJ0VGltZXI6IGZhbHNlLFxyXG4gICAgICAgIHBsYXlpbmdBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgam95c3RpY2tNb3Zpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBsYXllZEZhbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIHNvdW5kQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBzb3VuZHM6IG51bGwsXHJcbiAgICAgICAgYnVzeTogZmFsc2UsXHJcblxyXG4gICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgIHN1bTogMCxcclxuICAgIH0sXHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIGxldCBqb3lzdGljayA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSk9ZU1RJQ0tcIik7XHJcbiAgICAgICAgICAgIGxldCBqdW1wQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9QT1RJT05cIik7XHJcbiAgICAgICAgICAgIGxldCBjYWtlQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9DQUtFXCIpO1xyXG4gICAgICAgICAgICBqb3lzdGljay5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLmpveXN0aWNrTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICBqb3lzdGljay5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAganVtcEJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuanVtcCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHBvdGlvbkJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgY2FrZUJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdyYXZpdHlTY2FsZSA9IDA7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigwLCAwKTtcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBwbGF5RW1vamkodHlwZSkge1xyXG4gICAgICAgIGxldCBlbW9qaSA9IHRoaXMuZW1vamlzLmdldENoaWxkQnlOYW1lKHR5cGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW1vdGluZ1wiKTtcclxuICAgICAgICAvL25vIHNwYW0gZXJyb3JcclxuICAgICAgICBpZiAoISBlbW9qaS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgZW1vamkuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2MudHdlZW4oZW1vamkpLnRvKDAuNSwgeyBwb3NpdGlvbjogY2MudjIodGhpcy5ub2RlLnggKyBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDApICogKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSkgPyAxIDogLTEpLCB0aGlzLm5vZGUueSArIDIwMDApIH0sIHsgZWFzaW5nOiAnc2luZU91dEluJyB9KS5zdGFydCgpO1xyXG4gICAgICAgICAgICBjYy50d2VlbihlbW9qaSkuZGVsYXkoMSkudG8oMCwgeyBwb3NpdGlvbjogY2MudjIodGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcImhlYWRcIikueCwgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiYm9keVwiKS5nZXRDaGlsZEJ5TmFtZShcImhlYWRcIikueSkgfSkuY2FsbCgoKSA9PiB7IGVtb2ppLmFjdGl2ZSA9IGZhbHNlIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vdGhpcy5zY2hlZHVsZShmdW5jdGlvbiAoKSB7IGVtb2ppLmFjdGl2ZSA9IGZhbHNlIH0sIDIpO1xyXG4gICAgfSxcclxuICAgIG9uQmVnaW5Db250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0b3VjaGVkXCIpO1xyXG4gICAgICAgIGlmIChzZWxmLnRhZyA9PSAyICYmIChvdGhlci5ub2RlLmdyb3VwID09IFwiZW52aXJvbm1lbnRcIiB8fCBvdGhlci5ub2RlLmdyb3VwID09IFwibW92aW5nUGxhdGZvcm1cIikpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vc3RvcCBmYWxsaW5nIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAvL3RoaXMuYW5pbWF0aW9uLnN0b3AoXCJmYWxsaW5nXCIpO1xyXG4gICAgICAgICAgICAvL3RoaXMucGxheWVkRmFsbGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy9wbGF5ICBhbmltYXRpb25zXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcIndhbGtcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwibGFuZFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUGxheWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291bmRzW1wibGFuZGluZ1wiXS5wbGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSwgMC4zKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2NoYW5nZSBzcGVlZCBpZiBkaWZmZXJlbnQgc2l6ZVxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMuc21hbGxNb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkVuZENvbnRhY3QoY29udGFjdCwgc2VsZiwgb3RoZXIpIHtcclxuICAgICAgICBpZiAoc2VsZi50YWcgPT0gMilcclxuICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGp1bXBSdW5BY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGp1bXBVcCA9IGNjLnR3ZWVuKCkuYnkoMSwgeyB5OiAzMDAgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KTtcclxuICAgICAgICB2YXIganVtcERvd24gPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogLTMwMCB9LCB7IGVhc2luZzogJ3NpbmVJbicgfSk7XHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5ub2RlKS5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duKS5zdGFydCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlUmlnaHQoKSB7XHJcbiAgIFxyXG4gICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9keS5zY2FsZVggPSAtMTtcclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgbGV0IGFuaW1TdGF0ZSA9IHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICBhbmltU3RhdGUud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwicmlnaHRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vdmVMZWZ0KCkge1xyXG4gICBcclxuICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ib2R5LnNjYWxlWCA9IDE7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgYW5pbVN0YXRlLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuc2NhbGVZIDwgdGhpcy5tYXhTY2FsZSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kUGxheWVyU3RhdGUoXCJsZWZ0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAganVtcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb3VuZHNbXCJqdW1wXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91bmRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kaWZmZXJlbnQganVtcCBoZWlnaHRzIGRlcGVuZGluZyBvbiBzaXplXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPj0gdGhpcy5tYXhTY2FsZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLnYyKHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueCwgdGhpcy5qdW1wSGVpZ2h0ICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLnYyKHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkueCwgdGhpcy5zbWFsbEp1bXBIZWlnaHQgKiB0aGlzLmRlbHRhVGltZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWVyID0gdHJ1ZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50U2NyaXB0LmdldENvbXBvbmVudChcImNsaWVudFwiKS5zZW5kUGxheWVyU3RhdGUoXCJqdW1wXCIpO1xyXG4gICAgICAgICAgICAgICAgfSwgMC4xKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwianVtcFwiKTsgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuICAgIHN0b3BYKCkge1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoXCJ3YWxrXCIpO1xyXG4gICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLm1vdmluZylcclxuICAgICAgICAgICAgdGhpcy5wbGF5aW5nQW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgLy9jYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoMCwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2hyaW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlUG90aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW1wiZHJpbmtpbmcyXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBncm93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlQ2FrZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tcImVhdGluZ1wiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgZ3JvdW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5hOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVSaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmU6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3coKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5xOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaHJpbmsoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5zcGFjZTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uS2V5VXAoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gY2MubWFjcm8uS0VZLncpIHtcclxuICAgICAgICAgICAgLy90aGlzLnN0b3BZKCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5hKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5kKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50U2NyaXB0ID0gY2MuZmluZChcInN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgLy9tYXAgc291bmRzIHRvIHRoZWlyIGF1ZGlvU291cmNlXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1t0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKVtpXS5jbGlwLm5hbWVdID0gdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRvdWNoUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcclxuICAgICAgICAvL3VzZSBjYW1lcmEgdG8gZ2V0IHRvdWNoIHBvc1xyXG4gICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoY2MuQ2FtZXJhKS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodG91Y2hQb3MsIG91dCk7XHJcbiAgICAgICAgbGV0IGxvY2FsVG91Y2hQb3MgPSB0aGlzLmpveXN0aWNrQmFsbC5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIob3V0KTtcclxuXHJcbiAgICAgICAgLy9saW1pdCBiYWxsIHNvIGl0IGNhbid0IGxlYXZlIGNpcmNsZVxyXG4gICAgICAgIHRoaXMubGltaXRKb3lzdGljayhsb2NhbFRvdWNoUG9zKTtcclxuXHJcbiAgICAgICAgLy9jaGFuZ2UgcG9zIG9mIGJhbGwgYWNjb3JkaW5nbHlcclxuICAgICAgICB0aGlzLnNldEpveXN0aWNrQmFsbFBvcyhsb2NhbFRvdWNoUG9zKTsgXHJcbiAgICAgICAgdGhpcy5qb3lzdGlja1ZlY3RvciA9IGxvY2FsVG91Y2hQb3M7XHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZlUGxheWVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpveXN0aWNrTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCB0b3VjaCA9IGV2ZW50LmdldFRvdWNoZXMoKVswXTtcclxuICAgICAgICBsZXQgdG91Y2hQb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBvdXQgPSBjYy52MigpO1xyXG4gICAgICAgIC8vdXNlIGNhbWVyYSB0byBnZXQgdG91Y2ggcG9zXHJcbiAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChjYy5DYW1lcmEpLmdldFNjcmVlblRvV29ybGRQb2ludCh0b3VjaFBvcywgb3V0KTtcclxuICAgICAgICBsZXQgbG9jYWxUb3VjaFBvcyA9IHRoaXMuam95c3RpY2tCYWxsLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvdXQpO1xyXG5cclxuICAgICAgICAvL2xpbWl0IGJhbGwgc28gaXQgY2FuJ3QgbGVhdmUgY2lyY2xlXHJcbiAgICAgICAgdGhpcy5saW1pdEpveXN0aWNrKGxvY2FsVG91Y2hQb3MpO1xyXG5cclxuICAgICAgICAvL2NoYW5nZSBwb3Mgb2YgYmFsbCBhY2NvcmRpbmdseVxyXG4gICAgICAgIHRoaXMuc2V0Sm95c3RpY2tCYWxsUG9zKGxvY2FsVG91Y2hQb3MpO1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBsb2NhbFRvdWNoUG9zO1xyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92ZVBsYXllcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja01vdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgLy9tb3ZlIHBsYXllciBob3Jpem9udGFsbHlcclxuICAgICAgICBpZiAodGhpcy5qb3lzdGlja1ZlY3Rvci54ID4gMClcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLmpveXN0aWNrVmVjdG9yLnggPCAwKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vbW92ZSBwbGF5ZXIgdmVydGljYWxseVxyXG4gICAgICAgIC8vaWYgKHRoaXMuam95c3RpY2tWZWN0b3IueSA+IDEwKVxyXG4gICAgICAgIC8vICAgIHRoaXMuanVtcCgpXHJcbiAgICB9LFxyXG4gICAgam95c3RpY2tFbmQoKSB7XHJcbiAgICAgICAgLy9zdG9wIHBsYXllclxyXG4gICAgICAgIGlmICh0aGlzLmpveXN0aWNrTW92aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBjYy5WZWMyLlpFUk87XHJcbiAgICAgICAgdGhpcy5zZXRKb3lzdGlja0JhbGxQb3MoY2MuVmVjMi5aRVJPKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Sm95c3RpY2tCYWxsUG9zKHBvcykge1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYWxsLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxpbWl0Sm95c3RpY2soam95c3RpY2tWZWMpIHtcclxuICAgICAgICBsZXQgaW5wdXRNYWcgPSBqb3lzdGlja1ZlYy5tYWcoKTtcclxuICAgICAgICBpZiAoaW5wdXRNYWcgPiB0aGlzLmpveXN0aWNrTWF4KSB7XHJcbiAgICAgICAgICAgIGpveXN0aWNrVmVjLm11bFNlbGYodGhpcy5qb3lzdGlja01heCAvIGlucHV0TWFnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuIFxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMueVNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55O1xyXG4gICAgICAgIHRoaXMubG9jYWxDZW50ZXIgPSB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdldExvY2FsQ2VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdW0gKz0gZHQ7XHJcbiAgICAgICAgdGhpcy50b3RhbCArPSAxO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQgJiYgIXRoaXMucGxheWluZ0FuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwic3RhbmRcIik7ICAgXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYgKGR0IDwgMC4wMiAmJiBkdCA+IDAuMDEpXHJcbiAgICAgICAgLy90aGlzLmRlbHRhVGltZSA9IGR0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmdhbWVTdGFydGVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlbHRhVGltZSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gZHQ7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkdCAtICh0aGlzLnN1bSAvIHRoaXMudG90YWwpKSA8IDAuMDMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IHRoaXMubm9kZS5uYW1lICYmICF0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJiID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFXCIpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KT1lTVElDSy9CQUxMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhL1VJL01PQklMRS9KT1lTVElDSy9CQUxMXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmEvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYS9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgIC8vIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gZHQgKiAgICAgO1xyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkIDwgMCkge1xyXG4gICAgICAgIC8vICAgIC8vY29uc29sZS5sb2coY2MuVmVjMigwLCBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSkpO1xyXG4gICAgICAgIC8vICAgIC8vLmxvZyhjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSAqICh0aGlzLmZhbGxNdWx0aXBsaWVyIC0gMSkgKiB0aGlzLmRlbHRhVGltZSk7XHJcblxyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCB0aGlzLnlTcGVlZCArIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eS55KiB0aGlzLmRlbHRhVGltZSk7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIC8vaWYgKHRoaXMueVNwZWVkID4gMCAmJiAhanVtcCkge1xyXG4gICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgKz0gY2MuVmVjMih0aGlzLnhTcGVlZCwgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAxICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvLyBncm93ID0gLTEgbWVhbnMgc2hyaW5pbmdcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQgJiYgIWNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIgfHwgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA+IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyIDwgMilcclxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgKz0gZHQgKiAyMDA7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIDwgNTAgJiYgdGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciArPSBkdCAqIDIwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnhPZmZzZXRQbGF5ZXIgPiAtNTAgJiYgdGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyIC09IGR0ICogMjAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jdXN0b20gZ3Jhdml0eVxyXG4gICAgICAgICAgICAvL2lmICghdGhpcy5ncm91bmRlZClcclxuICAgICAgICAgICAgLy8gICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwICogTWF0aC5hYnModGhpcy55U3BlZWQpICsgLTEwKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkdCAqIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5ID0gY2MudjIoMCwgLXRoaXMuZGVsdGFUaW1lICogMjAwMCk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5ncmF2aXR5U2NhbGUgPSB0aGlzLmRlbHRhVGltZSAqIDYwMDA7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vdmluZ1JpZ2h0ICYmICF0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BYKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ncm93aW5nID09IDEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhTY2FsZSA+IHRoaXMubm9kZS5zY2FsZVkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVYICs9IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVZICs9IDAuMDUgKiBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIHBsYXllciB2ZWxvY2l0eSBpZiBvbiBncm91bmRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ3Jvd2luZyA9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblNjYWxlIDwgdGhpcy5ub2RlLnNjYWxlWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVggLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zY2FsZVkgLT0gMC4wNSAqIGR0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVjcmVhc2UgcGxheWVyIHZlbG9jaXR5IGlmIG9uIGdyb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmluZ1JpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==