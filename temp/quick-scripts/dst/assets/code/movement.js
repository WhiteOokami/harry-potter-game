
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcbW92ZW1lbnQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJqdW1wSGVpZ2h0Iiwic21hbGxKdW1wSGVpZ2h0IiwianVtcER1cmF0aW9uIiwibW92ZVNwZWVkIiwic21hbGxNb3ZlU3BlZWQiLCJpc1BsYXllciIsImNsaWVudFNjcmlwdCIsIk5vZGUiLCJ4U3BlZWQiLCJ5U3BlZWQiLCJsb2NhbENlbnRlciIsImdyb3VuZGVyIiwiYm9keSIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsImRlbHRhVGltZSIsImZhbGxNdWx0aXBsaWVyIiwiZ3Jvd2luZyIsIm1heFNjYWxlIiwibWluU2NhbGUiLCJhdGVDYWtlIiwiYXRlUG90aW9uIiwiZ3JvdW5kZWQiLCJtb3ZpbmdSaWdodCIsIm1vdmluZ0xlZnQiLCJqb3lzdGlja01heCIsImpveXN0aWNrVmVjdG9yIiwidjIiLCJqb3lzdGlja0JhbGwiLCJsZWZ0QnV0dG9uIiwicmlnaHRCdXR0b24iLCJqdW1wQnV0dG9uIiwicG90aW9uQnV0dG9uIiwiY2FrZUJ1dHRvbiIsImVtb2ppcyIsInRpbWVTdGVwIiwic3RhcnRUaW1lciIsInBsYXlpbmdBbmltYXRpb24iLCJqb3lzdGlja01vdmluZyIsInBsYXllZEZhbGxpbmciLCJzb3VuZENvbnRyb2xsZXIiLCJzb3VuZHMiLCJidXN5IiwidG90YWwiLCJzdW0iLCJzdGFydCIsImZpbmQiLCJkaXNhYmxlIiwic3lzIiwicGxhdGZvcm0iLCJXRUNIQVRfR0FNRSIsIm9mZiIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwibW92ZUxlZnQiLCJtb3ZlUmlnaHQiLCJqdW1wIiwic2hyaW5rIiwiZ3JvdyIsInN5c3RlbUV2ZW50IiwiU3lzdGVtRXZlbnQiLCJLRVlfRE9XTiIsIm9uS2V5RG93biIsIktFWV9VUCIsIm9uS2V5VXAiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiUmlnaWRCb2R5IiwiZ3Jhdml0eVNjYWxlIiwibGluZWFyVmVsb2NpdHkiLCJWZWMyIiwicGxheUVtb2ppIiwidHlwZSIsImVtb2ppIiwiZ2V0Q2hpbGRCeU5hbWUiLCJhY3RpdmUiLCJ0d2VlbiIsInRvIiwicG9zaXRpb24iLCJ4IiwiTWF0aCIsImNlaWwiLCJyYW5kb20iLCJyb3VuZCIsInkiLCJlYXNpbmciLCJkZWxheSIsImNhbGwiLCJvbkJlZ2luQ29udGFjdCIsImNvbnRhY3QiLCJzZWxmIiwib3RoZXIiLCJ0YWciLCJncm91cCIsIm1vdmluZyIsInBsYXkiLCJzY2hlZHVsZU9uY2UiLCJzY2FsZVkiLCJvbkVuZENvbnRhY3QiLCJqdW1wUnVuQWN0aW9uIiwianVtcFVwIiwiYnkiLCJqdW1wRG93biIsInNlcXVlbmNlIiwic2NhbGVYIiwiYW5pbVN0YXRlIiwid3JhcE1vZGUiLCJXcmFwTW9kZSIsIkxvb3AiLCJzZW5kUGxheWVyU3RhdGUiLCJzdG9wIiwic3RvcFgiLCJzdG9wWSIsImV2ZW50Iiwia2V5Q29kZSIsIm1hY3JvIiwiS0VZIiwidyIsImEiLCJkIiwiZSIsInEiLCJzaG93RW1vamlzIiwib25Mb2FkIiwiTWFwIiwiaSIsImdldENvbXBvbmVudHMiLCJBdWRpb1NvdXJjZSIsImxlbmd0aCIsImNsaXAiLCJuYW1lIiwib25EZXN0cm95Iiwiam95c3RpY2tTdGFydCIsInRvdWNoUG9zIiwiZ2V0TG9jYXRpb24iLCJvdXQiLCJDYW1lcmEiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJsb2NhbFRvdWNoUG9zIiwicGFyZW50IiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJsaW1pdEpveXN0aWNrIiwic2V0Sm95c3RpY2tCYWxsUG9zIiwiam95c3RpY2tNb3ZlUGxheWVyIiwiam95c3RpY2tNb3ZlIiwidG91Y2giLCJnZXRUb3VjaGVzIiwiam95c3RpY2tFbmQiLCJaRVJPIiwicG9zIiwic2V0UG9zaXRpb24iLCJqb3lzdGlja1ZlYyIsImlucHV0TWFnIiwibWFnIiwibXVsU2VsZiIsInVwZGF0ZSIsImR0IiwiZ2V0TG9jYWxDZW50ZXIiLCJnYW1lU3RhcnRlZCIsInBsYXllcklkIiwiYWJzIiwicmIiLCJvbiIsInlPZmZzZXRQbGF5ZXIiLCJ4T2Zmc2V0UGxheWVyIiwiZGlyZWN0b3IiLCJnZXRQaHlzaWNzTWFuYWdlciIsImdyYXZpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FESjtBQUVSQyxJQUFBQSxlQUFlLEVBQUUsQ0FGVDtBQUdSQyxJQUFBQSxZQUFZLEVBQUUsQ0FITjtBQUlSQyxJQUFBQSxTQUFTLEVBQUUsQ0FKSDtBQUtSQyxJQUFBQSxjQUFjLEVBQUUsQ0FMUjtBQU1SQyxJQUFBQSxRQUFRLEVBQUUsS0FORjtBQU9SQyxJQUFBQSxZQUFZLEVBQUVWLEVBQUUsQ0FBQ1csSUFQVDtBQVFSQyxJQUFBQSxNQUFNLEVBQUUsQ0FSQTtBQVNSQyxJQUFBQSxNQUFNLEVBQUUsQ0FUQTtBQVVSQyxJQUFBQSxXQUFXLEVBQUUsQ0FWTDtBQVdSQyxJQUFBQSxRQUFRLEVBQUVmLEVBQUUsQ0FBQ1csSUFYTDtBQVlSSyxJQUFBQSxJQUFJLEVBQUVoQixFQUFFLENBQUNXLElBWkQ7QUFhUk0sSUFBQUEsU0FBUyxFQUFFakIsRUFBRSxDQUFDa0IsU0FiTjtBQWNSQyxJQUFBQSxTQUFTLEVBQUUsQ0FkSDtBQWVSQyxJQUFBQSxjQUFjLEVBQUUsR0FmUjtBQWdCUkMsSUFBQUEsT0FBTyxFQUFFLENBaEJEO0FBaUJSQyxJQUFBQSxRQUFRLEVBQUUsQ0FqQkY7QUFrQlJDLElBQUFBLFFBQVEsRUFBRSxHQWxCRjtBQW1CUkMsSUFBQUEsT0FBTyxFQUFFLEtBbkJEO0FBb0JSQyxJQUFBQSxTQUFTLEVBQUUsS0FwQkg7QUFxQlJDLElBQUFBLFFBQVEsRUFBRSxLQXJCRjtBQXNCUkMsSUFBQUEsV0FBVyxFQUFFLEtBdEJMO0FBdUJSQyxJQUFBQSxVQUFVLEVBQUUsS0F2Qko7QUF3QlJDLElBQUFBLFdBQVcsRUFBRSxFQXhCTDtBQXlCUkMsSUFBQUEsY0FBYyxFQUFFOUIsRUFBRSxDQUFDK0IsRUFBSCxFQXpCUjtBQTBCUkMsSUFBQUEsWUFBWSxFQUFFaEMsRUFBRSxDQUFDVyxJQTFCVDtBQTJCUnNCLElBQUFBLFVBQVUsRUFBRWpDLEVBQUUsQ0FBQ1csSUEzQlA7QUE0QlJ1QixJQUFBQSxXQUFXLEVBQUVsQyxFQUFFLENBQUNXLElBNUJSO0FBNkJSd0IsSUFBQUEsVUFBVSxFQUFFbkMsRUFBRSxDQUFDVyxJQTdCUDtBQThCUnlCLElBQUFBLFlBQVksRUFBRXBDLEVBQUUsQ0FBQ1csSUE5QlQ7QUErQlIwQixJQUFBQSxVQUFVLEVBQUVyQyxFQUFFLENBQUNXLElBL0JQO0FBZ0NSMkIsSUFBQUEsTUFBTSxFQUFFdEMsRUFBRSxDQUFDVyxJQWhDSDtBQWlDUjRCLElBQUFBLFFBQVEsRUFBRSxDQWpDRjtBQWtDUkMsSUFBQUEsVUFBVSxFQUFFLEtBbENKO0FBbUNSQyxJQUFBQSxnQkFBZ0IsRUFBRSxJQW5DVjtBQW9DUkMsSUFBQUEsY0FBYyxFQUFFLEtBcENSO0FBcUNSQyxJQUFBQSxhQUFhLEVBQUUsS0FyQ1A7QUFzQ1JDLElBQUFBLGVBQWUsRUFBRTVDLEVBQUUsQ0FBQ1csSUF0Q1o7QUF1Q1JrQyxJQUFBQSxNQUFNLEVBQUUsSUF2Q0E7QUF3Q1JDLElBQUFBLElBQUksRUFBRSxLQXhDRTtBQTBDUkMsSUFBQUEsS0FBSyxFQUFFLENBMUNDO0FBMkNSQyxJQUFBQSxHQUFHLEVBQUU7QUEzQ0csR0FIUDtBQWlETDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0FDLEVBQUFBLEtBdkVLLG1CQXdFTDtBQUNJLFNBQUtoQixVQUFMLEdBQWtCakMsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLHdCQUFSLENBQWxCO0FBQ0EsU0FBS2hCLFdBQUwsR0FBbUJsQyxFQUFFLENBQUNrRCxJQUFILENBQVEseUJBQVIsQ0FBbkI7QUFDQSxTQUFLZixVQUFMLEdBQWtCbkMsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLHdCQUFSLENBQWxCO0FBQ0EsU0FBS2QsWUFBTCxHQUFvQnBDLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSwwQkFBUixDQUFwQjtBQUNBLFNBQUtiLFVBQUwsR0FBa0JyQyxFQUFFLENBQUNrRCxJQUFILENBQVEsd0JBQVIsQ0FBbEI7QUFDSCxHQTlFSTtBQStFTEMsRUFBQUEsT0EvRUsscUJBK0VLO0FBQ04sUUFBSW5ELEVBQUUsQ0FBQ29ELEdBQUgsQ0FBT0MsUUFBUCxJQUFtQnJELEVBQUUsQ0FBQ29ELEdBQUgsQ0FBT0UsV0FBOUIsRUFBMkM7QUFDdkMsV0FBS3JCLFVBQUwsQ0FBZ0JzQixHQUFoQixDQUFvQnZELEVBQUUsQ0FBQ1csSUFBSCxDQUFRNkMsU0FBUixDQUFrQkMsV0FBdEMsRUFBbUQsS0FBS0MsUUFBeEQsRUFBa0UsSUFBbEU7QUFDQSxXQUFLeEIsV0FBTCxDQUFpQnFCLEdBQWpCLENBQXFCdkQsRUFBRSxDQUFDVyxJQUFILENBQVE2QyxTQUFSLENBQWtCQyxXQUF2QyxFQUFvRCxLQUFLRSxTQUF6RCxFQUFvRSxJQUFwRTtBQUNBLFdBQUt4QixVQUFMLENBQWdCb0IsR0FBaEIsQ0FBb0J2RCxFQUFFLENBQUNXLElBQUgsQ0FBUTZDLFNBQVIsQ0FBa0JDLFdBQXRDLEVBQW1ELEtBQUtHLElBQXhELEVBQThELElBQTlEO0FBQ0EsV0FBS3hCLFlBQUwsQ0FBa0JtQixHQUFsQixDQUFzQnZELEVBQUUsQ0FBQ1csSUFBSCxDQUFRNkMsU0FBUixDQUFrQkMsV0FBeEMsRUFBcUQsS0FBS0ksTUFBMUQsRUFBa0UsSUFBbEU7QUFDQSxXQUFLeEIsVUFBTCxDQUFnQmtCLEdBQWhCLENBQW9CdkQsRUFBRSxDQUFDVyxJQUFILENBQVE2QyxTQUFSLENBQWtCQyxXQUF0QyxFQUFtRCxLQUFLSyxJQUF4RCxFQUE4RCxJQUE5RDtBQUNILEtBTkQsTUFNTztBQUNIOUQsTUFBQUEsRUFBRSxDQUFDK0QsV0FBSCxDQUFlUixHQUFmLENBQW1CdkQsRUFBRSxDQUFDZ0UsV0FBSCxDQUFlUixTQUFmLENBQXlCUyxRQUE1QyxFQUFzRCxLQUFLQyxTQUEzRCxFQUFzRSxJQUF0RTtBQUNBbEUsTUFBQUEsRUFBRSxDQUFDK0QsV0FBSCxDQUFlUixHQUFmLENBQW1CdkQsRUFBRSxDQUFDZ0UsV0FBSCxDQUFlUixTQUFmLENBQXlCVyxNQUE1QyxFQUFvRCxLQUFLQyxPQUF6RCxFQUFrRSxJQUFsRTtBQUNIOztBQUVELFNBQUtDLElBQUwsQ0FBVUMsWUFBVixDQUF1QnRFLEVBQUUsQ0FBQ3VFLFNBQTFCLEVBQXFDQyxZQUFyQyxHQUFvRCxDQUFwRDtBQUNBLFNBQUtILElBQUwsQ0FBVUMsWUFBVixDQUF1QnRFLEVBQUUsQ0FBQ3VFLFNBQTFCLEVBQXFDRSxjQUFyQyxHQUFzRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxDQUFSLEVBQVcsQ0FBWCxDQUF0RDtBQUVILEdBOUZJO0FBK0ZMQyxFQUFBQSxTQS9GSyxxQkErRktDLElBL0ZMLEVBK0ZXO0FBQ1osUUFBSUMsS0FBSyxHQUFHLEtBQUt2QyxNQUFMLENBQVl3QyxjQUFaLENBQTJCRixJQUEzQixDQUFaLENBRFksQ0FFWjs7QUFDQSxRQUFJLENBQUVDLEtBQUssQ0FBQ0UsTUFBWixFQUFvQjtBQUNoQkYsTUFBQUEsS0FBSyxDQUFDRSxNQUFOLEdBQWUsSUFBZjtBQUNBL0UsTUFBQUEsRUFBRSxDQUFDZ0YsS0FBSCxDQUFTSCxLQUFULEVBQWdCSSxFQUFoQixDQUFtQixHQUFuQixFQUF3QjtBQUFFQyxRQUFBQSxRQUFRLEVBQUVsRixFQUFFLENBQUMrQixFQUFILENBQU0sS0FBS3NDLElBQUwsQ0FBVWMsQ0FBVixHQUFjQyxJQUFJLENBQUNDLElBQUwsQ0FBVUQsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLElBQTFCLEtBQW1DRixJQUFJLENBQUNHLEtBQUwsQ0FBV0gsSUFBSSxDQUFDRSxNQUFMLEVBQVgsSUFBNEIsQ0FBNUIsR0FBZ0MsQ0FBQyxDQUFwRSxDQUFwQixFQUE0RixLQUFLakIsSUFBTCxDQUFVbUIsQ0FBVixHQUFjLElBQTFHO0FBQVosT0FBeEIsRUFBdUo7QUFBRUMsUUFBQUEsTUFBTSxFQUFFO0FBQVYsT0FBdkosRUFBZ0x4QyxLQUFoTDtBQUNBakQsTUFBQUEsRUFBRSxDQUFDZ0YsS0FBSCxDQUFTSCxLQUFULEVBQWdCYSxLQUFoQixDQUFzQixDQUF0QixFQUF5QlQsRUFBekIsQ0FBNEIsQ0FBNUIsRUFBK0I7QUFBRUMsUUFBQUEsUUFBUSxFQUFFbEYsRUFBRSxDQUFDK0IsRUFBSCxDQUFNLEtBQUtzQyxJQUFMLENBQVVTLGNBQVYsQ0FBeUIsTUFBekIsRUFBaUNBLGNBQWpDLENBQWdELE1BQWhELEVBQXdESyxDQUE5RCxFQUFpRSxLQUFLZCxJQUFMLENBQVVTLGNBQVYsQ0FBeUIsTUFBekIsRUFBaUNBLGNBQWpDLENBQWdELE1BQWhELEVBQXdEVSxDQUF6SDtBQUFaLE9BQS9CLEVBQTBLRyxJQUExSyxDQUErSyxZQUFNO0FBQUVkLFFBQUFBLEtBQUssQ0FBQ0UsTUFBTixHQUFlLEtBQWY7QUFBc0IsT0FBN00sRUFBK005QixLQUEvTTtBQUNILEtBUFcsQ0FTWjs7QUFDSCxHQXpHSTtBQTBHTDJDLEVBQUFBLGNBMUdLLDBCQTBHVUMsT0ExR1YsRUEwR21CQyxJQTFHbkIsRUEwR3lCQyxLQTFHekIsRUEwR2dDO0FBRWpDLFFBQUlELElBQUksQ0FBQ0UsR0FBTCxJQUFZLENBQVosS0FBa0JELEtBQUssQ0FBQzFCLElBQU4sQ0FBVzRCLEtBQVgsSUFBb0IsYUFBcEIsSUFBcUNGLEtBQUssQ0FBQzFCLElBQU4sQ0FBVzRCLEtBQVgsSUFBb0IsZ0JBQTNFLENBQUosRUFBaUc7QUFFN0YsV0FBS3ZFLFFBQUwsR0FBZ0IsSUFBaEIsQ0FGNkYsQ0FHN0Y7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsVUFBSSxLQUFLd0UsTUFBVCxFQUFpQjtBQUNiLGFBQUtqRixTQUFMLENBQWVrRixJQUFmLENBQW9CLE1BQXBCO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsYUFBS2xGLFNBQUwsQ0FBZWtGLElBQWYsQ0FBb0IsTUFBcEI7QUFDQSxZQUFJLEtBQUsxRixRQUFULEVBQ0ksS0FBS29DLE1BQUwsQ0FBWSxTQUFaLEVBQXVCc0QsSUFBdkI7QUFFSixhQUFLQyxZQUFMLENBQWtCLFlBQVk7QUFDMUIsZUFBSzNELGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0gsU0FGRCxFQUVHLEdBRkg7QUFJSCxPQW5CNEYsQ0FxQjdGOzs7QUFDQSxVQUFJLEtBQUs0QixJQUFMLENBQVVnQyxNQUFWLEdBQW1CLEtBQUsvRSxRQUE1QixFQUFzQztBQUNsQyxZQUFJLEtBQUtLLFdBQVQsRUFDSSxLQUFLMkMsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxLQUFLbEUsY0FBTCxHQUFzQixLQUFLVyxTQUFuQyxFQUE4QyxLQUFLTixNQUFuRCxDQUFqRCxDQURKLEtBRUssSUFBSSxLQUFLZSxVQUFULEVBQ0QsS0FBSzBDLFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMwRSxJQUFILENBQVEsQ0FBQyxLQUFLbEUsY0FBTixHQUF1QixLQUFLVyxTQUFwQyxFQUErQyxLQUFLTixNQUFwRCxDQUFqRDtBQUNQLE9BTEQsTUFLTztBQUNILFlBQUksS0FBS2MsV0FBVCxFQUNJLEtBQUsyQyxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLEtBQUtuRSxTQUFMLEdBQWlCLEtBQUtZLFNBQTlCLEVBQXlDLEtBQUtOLE1BQTlDLENBQWpELENBREosS0FFSyxJQUFJLEtBQUtlLFVBQVQsRUFDRCxLQUFLMEMsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxDQUFDLEtBQUtuRSxTQUFOLEdBQWtCLEtBQUtZLFNBQS9CLEVBQTBDLEtBQUtOLE1BQS9DLENBQWpEO0FBQ1A7QUFHSjtBQUVKLEdBakpJO0FBbUpMeUYsRUFBQUEsWUFuSkssd0JBbUpRVCxPQW5KUixFQW1KaUJDLElBbkpqQixFQW1KdUJDLEtBbkp2QixFQW1KOEI7QUFDL0IsUUFBSUQsSUFBSSxDQUFDRSxHQUFMLElBQVksQ0FBaEIsRUFDSSxLQUFLdEUsUUFBTCxHQUFnQixLQUFoQjtBQUNQLEdBdEpJO0FBdUpMNkUsRUFBQUEsYUF2SkssMkJBdUpXO0FBQ1osUUFBSUMsTUFBTSxHQUFHeEcsRUFBRSxDQUFDZ0YsS0FBSCxHQUFXeUIsRUFBWCxDQUFjLENBQWQsRUFBaUI7QUFBRWpCLE1BQUFBLENBQUMsRUFBRTtBQUFMLEtBQWpCLEVBQTZCO0FBQUVDLE1BQUFBLE1BQU0sRUFBRTtBQUFWLEtBQTdCLENBQWI7QUFDQSxRQUFJaUIsUUFBUSxHQUFHMUcsRUFBRSxDQUFDZ0YsS0FBSCxHQUFXeUIsRUFBWCxDQUFjLENBQWQsRUFBaUI7QUFBRWpCLE1BQUFBLENBQUMsRUFBRSxDQUFDO0FBQU4sS0FBakIsRUFBOEI7QUFBRUMsTUFBQUEsTUFBTSxFQUFFO0FBQVYsS0FBOUIsQ0FBZjtBQUNBekYsSUFBQUEsRUFBRSxDQUFDZ0YsS0FBSCxDQUFTLEtBQUtYLElBQWQsRUFBb0JzQyxRQUFwQixDQUE2QkgsTUFBN0IsRUFBcUNFLFFBQXJDLEVBQStDekQsS0FBL0M7QUFDSCxHQTNKSTtBQTZKTFUsRUFBQUEsU0E3SkssdUJBNkpPO0FBRVIsU0FBSy9CLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxTQUFLWixJQUFMLENBQVU0RixNQUFWLEdBQW1CLENBQUMsQ0FBcEI7O0FBQ0EsUUFBSSxDQUFDLEtBQUtWLE1BQU4sSUFBZ0IsS0FBS3hFLFFBQXpCLEVBQW1DO0FBQy9CLFVBQUltRixTQUFTLEdBQUcsS0FBSzVGLFNBQUwsQ0FBZWtGLElBQWYsQ0FBb0IsTUFBcEIsQ0FBaEI7QUFDQVUsTUFBQUEsU0FBUyxDQUFDQyxRQUFWLEdBQXFCOUcsRUFBRSxDQUFDK0csUUFBSCxDQUFZQyxJQUFqQztBQUNBLFdBQUtkLE1BQUwsR0FBYyxJQUFkO0FBQ0g7O0FBQ0QsU0FBS3ZFLFdBQUwsR0FBbUIsSUFBbkI7O0FBQ0EsUUFBSSxLQUFLbEIsUUFBVCxFQUFtQjtBQUNmLFdBQUtxQyxJQUFMLEdBQVksS0FBWjtBQUNBLFVBQUksS0FBS3VCLElBQUwsQ0FBVWdDLE1BQVYsR0FBbUIsS0FBSy9FLFFBQTVCLEVBQ0ksS0FBS2dELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMwRSxJQUFILENBQVEsS0FBS2xFLGNBQUwsR0FBc0IsS0FBS1csU0FBbkMsRUFBOEMsS0FBS21ELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsQ0FBK0NlLENBQTdGLENBQWpELENBREosS0FHSSxLQUFLbEIsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxLQUFLbkUsU0FBTCxHQUFpQixLQUFLWSxTQUE5QixFQUF5QyxLQUFLbUQsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxDQUErQ2UsQ0FBeEYsQ0FBakQ7QUFFSixXQUFLOUUsWUFBTCxDQUFrQjRELFlBQWxCLENBQStCLFFBQS9CLEVBQXlDMkMsZUFBekMsQ0FBeUQsT0FBekQ7QUFDSDtBQUNKLEdBaExJO0FBaUxMdkQsRUFBQUEsUUFqTEssc0JBaUxNO0FBRVAsU0FBSy9CLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLWCxJQUFMLENBQVU0RixNQUFWLEdBQW1CLENBQW5COztBQUNBLFFBQUksQ0FBQyxLQUFLVixNQUFOLElBQWdCLEtBQUt4RSxRQUF6QixFQUFtQztBQUMvQixVQUFJbUYsU0FBUyxHQUFHLEtBQUs1RixTQUFMLENBQWVrRixJQUFmLENBQW9CLE1BQXBCLENBQWhCO0FBQ0FVLE1BQUFBLFNBQVMsQ0FBQ0MsUUFBVixHQUFxQjlHLEVBQUUsQ0FBQytHLFFBQUgsQ0FBWUMsSUFBakM7QUFDQSxXQUFLZCxNQUFMLEdBQWMsSUFBZDtBQUNIOztBQUdELFNBQUt0RSxVQUFMLEdBQWtCLElBQWxCOztBQUNBLFFBQUksS0FBS25CLFFBQVQsRUFBbUI7QUFDZixVQUFJLEtBQUs0RCxJQUFMLENBQVVnQyxNQUFWLEdBQW1CLEtBQUsvRSxRQUE1QixFQUNJLEtBQUtnRCxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLENBQUMsS0FBS2xFLGNBQU4sR0FBdUIsS0FBS1csU0FBcEMsRUFBK0MsS0FBS21ELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsQ0FBK0NlLENBQTlGLENBQWpELENBREosS0FHSSxLQUFLbEIsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxDQUFDLEtBQUtuRSxTQUFOLEdBQWtCLEtBQUtZLFNBQS9CLEVBQTBDLEtBQUttRCxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLENBQStDZSxDQUF6RixDQUFqRDtBQUNKLFdBQUsxQyxJQUFMLEdBQVksS0FBWjtBQUVBLFdBQUtwQyxZQUFMLENBQWtCNEQsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUMyQyxlQUF6QyxDQUF5RCxNQUF6RDtBQUNIO0FBRUosR0F2TUk7QUF3TUxyRCxFQUFBQSxJQXhNSyxrQkF3TUU7QUFDSCxRQUFJLEtBQUtuRCxRQUFULEVBQW1CO0FBQ2YsVUFBSSxLQUFLaUIsUUFBVCxFQUFtQjtBQUNmLGFBQUttQixNQUFMLENBQVksTUFBWixFQUFvQnNELElBQXBCO0FBQ0EsYUFBS2xGLFNBQUwsQ0FBZWtGLElBQWYsQ0FBb0IsTUFBcEI7QUFDQSxhQUFLekUsUUFBTCxHQUFnQixLQUFoQjtBQUVBLGFBQUswRSxZQUFMLENBQWtCLFlBQVk7QUFDMUI7QUFDQSxjQUFJLEtBQUsvQixJQUFMLENBQVVnQyxNQUFWLElBQW9CLEtBQUsvRSxRQUE3QixFQUNJLEtBQUtnRCxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDK0IsRUFBSCxDQUFNLEtBQUt1QyxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLENBQStDVSxDQUFyRCxFQUF3RCxLQUFLL0UsVUFBTCxHQUFrQixLQUFLZSxTQUEvRSxDQUFqRCxDQURKLEtBR0ksS0FBS21ELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMrQixFQUFILENBQU0sS0FBS3VDLFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsQ0FBK0NVLENBQXJELEVBQXdELEtBQUs5RSxlQUFMLEdBQXVCLEtBQUtjLFNBQXBGLENBQWpEO0FBQ0osZUFBS3FCLFVBQUwsR0FBa0IsSUFBbEI7QUFHQSxlQUFLOUIsWUFBTCxDQUFrQjRELFlBQWxCLENBQStCLFFBQS9CLEVBQXlDMkMsZUFBekMsQ0FBeUQsTUFBekQ7QUFDSCxTQVZELEVBVUcsR0FWSDtBQVdIO0FBQ0osS0FsQkQsTUFtQks7QUFDRCxXQUFLaEcsU0FBTCxDQUFlaUcsSUFBZixDQUFvQixNQUFwQjtBQUNBLFdBQUtqRyxTQUFMLENBQWVrRixJQUFmLENBQW9CLE1BQXBCO0FBQ0EsV0FBS3pFLFFBQUwsR0FBZ0IsS0FBaEI7QUFDSDtBQUdKLEdBbk9JO0FBb09MeUYsRUFBQUEsS0FwT0ssbUJBb09HO0FBQ0osU0FBS2xHLFNBQUwsQ0FBZWlHLElBQWYsQ0FBb0IsTUFBcEI7QUFDQSxTQUFLcEUsSUFBTCxHQUFZLEtBQVo7QUFDQSxRQUFJLEtBQUtvRCxNQUFULEVBQ0ksS0FBS3pELGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0osU0FBS2IsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFNBQUtELFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLdUUsTUFBTCxHQUFjLEtBQWQ7O0FBQ0EsUUFBSSxLQUFLekYsUUFBVCxFQUFtQjtBQUNmO0FBQ0EsV0FBSzZELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMwRSxJQUFILENBQVEsQ0FBUixFQUFXLEtBQUs3RCxNQUFoQixDQUFqRDtBQUNBLFdBQUtILFlBQUwsQ0FBa0I0RCxZQUFsQixDQUErQixRQUEvQixFQUF5QzJDLGVBQXpDLENBQXlELE9BQXpEO0FBRUg7QUFFSixHQW5QSTtBQW9QTEcsRUFBQUEsS0FwUEssbUJBb1BHO0FBRUosUUFBSSxLQUFLM0csUUFBVCxFQUFtQjtBQUNmLFdBQUs2RCxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLEtBQUs5RCxNQUFiLEVBQXFCLENBQXJCLENBQWpEO0FBQ0EsV0FBS0YsWUFBTCxDQUFrQjRELFlBQWxCLENBQStCLFFBQS9CLEVBQXlDMkMsZUFBekMsQ0FBeUQsT0FBekQ7QUFDSDtBQUVKLEdBM1BJO0FBNlBMcEQsRUFBQUEsTUE3UEssb0JBNlBJO0FBQ0wsUUFBSSxLQUFLcEQsUUFBTCxJQUFpQixLQUFLZ0IsU0FBMUIsRUFBcUM7QUFDakMsV0FBS29CLE1BQUwsQ0FBWSxXQUFaLEVBQXlCc0QsSUFBekI7QUFDQSxXQUFLOUUsT0FBTCxHQUFlLENBQUMsQ0FBaEI7QUFDSDtBQUNKLEdBbFFJO0FBb1FMeUMsRUFBQUEsSUFwUUssa0JBb1FFO0FBQ0gsUUFBSSxLQUFLckQsUUFBTCxJQUFpQixLQUFLZSxPQUExQixFQUFtQztBQUMvQixXQUFLcUIsTUFBTCxDQUFZLFFBQVosRUFBc0JzRCxJQUF0QjtBQUNBLFdBQUs5RSxPQUFMLEdBQWUsQ0FBZjtBQUNIO0FBQ0osR0F6UUk7QUEwUUw7QUFDQTZDLEVBQUFBLFNBM1FLLHFCQTJRS21ELEtBM1FMLEVBMlFZO0FBRWIsWUFBUUEsS0FBSyxDQUFDQyxPQUFkO0FBQ0ksV0FBS3RILEVBQUUsQ0FBQ3VILEtBQUgsQ0FBU0MsR0FBVCxDQUFhQyxDQUFsQjtBQUNJLFlBQUksS0FBSy9GLFFBQVQsRUFDSSxLQUFLa0MsSUFBTDtBQUNKOztBQUNKLFdBQUs1RCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUUsQ0FBbEI7QUFDSSxhQUFLaEUsUUFBTDtBQUNBOztBQUNKLFdBQUsxRCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUcsQ0FBbEI7QUFDSSxhQUFLaEUsU0FBTDtBQUNBOztBQUNKLFdBQUszRCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUksQ0FBbEI7QUFDSSxhQUFLOUQsSUFBTDtBQUNBOztBQUNKLFdBQUs5RCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUssQ0FBbEI7QUFDSSxhQUFLaEUsTUFBTDtBQUNBOztBQUNKLFdBQUs3RCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUksQ0FBbEI7QUFDSTVILFFBQUFBLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxRQUFSLEVBQWtCb0IsWUFBbEIsQ0FBK0IsYUFBL0IsRUFBOEN3RCxVQUE5QztBQWxCUjtBQXFCSCxHQWxTSTtBQXFTTDFELEVBQUFBLE9BclNLLG1CQXFTR2lELEtBclNILEVBcVNVO0FBRVgsUUFBSUEsS0FBSyxDQUFDQyxPQUFOLElBQWlCdEgsRUFBRSxDQUFDdUgsS0FBSCxDQUFTQyxHQUFULENBQWFDLENBQWxDLEVBQXFDLENBQ2pDO0FBQ0E7QUFDSDs7QUFFRCxRQUFJSixLQUFLLENBQUNDLE9BQU4sSUFBaUJ0SCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUUsQ0FBbEMsRUFBcUM7QUFDakM7QUFDQSxXQUFLOUYsVUFBTCxHQUFrQixLQUFsQjtBQUNIOztBQUVELFFBQUl5RixLQUFLLENBQUNDLE9BQU4sSUFBaUJ0SCxFQUFFLENBQUN1SCxLQUFILENBQVNDLEdBQVQsQ0FBYUcsQ0FBbEMsRUFBcUM7QUFDakM7QUFDQSxXQUFLaEcsV0FBTCxHQUFtQixLQUFuQjtBQUNIO0FBQ0osR0FyVEk7QUF1VExvRyxFQUFBQSxNQUFNLEVBQUUsa0JBQVk7QUFDaEIsU0FBSy9HLElBQUwsR0FBWSxLQUFLcUQsSUFBTCxDQUFVUyxjQUFWLENBQXlCLE1BQXpCLENBQVo7QUFDQSxTQUFLcEUsWUFBTCxHQUFvQlYsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLFFBQVIsQ0FBcEI7QUFFQSxTQUFLTCxNQUFMLEdBQWMsSUFBSW1GLEdBQUosRUFBZCxDQUpnQixDQUtoQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS3JGLGVBQUwsQ0FBcUJzRixhQUFyQixDQUFtQ2xJLEVBQUUsQ0FBQ21JLFdBQXRDLEVBQW1EQyxNQUF2RSxFQUErRUgsQ0FBQyxFQUFoRixFQUFvRjtBQUNoRixXQUFLcEYsTUFBTCxDQUFZLEtBQUtELGVBQUwsQ0FBcUJzRixhQUFyQixDQUFtQ2xJLEVBQUUsQ0FBQ21JLFdBQXRDLEVBQW1ERixDQUFuRCxFQUFzREksSUFBdEQsQ0FBMkRDLElBQXZFLElBQStFLEtBQUsxRixlQUFMLENBQXFCc0YsYUFBckIsQ0FBbUNsSSxFQUFFLENBQUNtSSxXQUF0QyxFQUFtREYsQ0FBbkQsQ0FBL0U7QUFDSDtBQUNKLEdBaFVJO0FBa1VMTSxFQUFBQSxTQWxVSyx1QkFrVU87QUFDUixRQUFJdkksRUFBRSxDQUFDb0QsR0FBSCxDQUFPQyxRQUFQLElBQW1CckQsRUFBRSxDQUFDb0QsR0FBSCxDQUFPRSxXQUE5QixFQUEyQyxDQUMxQyxDQURELE1BRUs7QUFDRHRELE1BQUFBLEVBQUUsQ0FBQytELFdBQUgsQ0FBZVIsR0FBZixDQUFtQnZELEVBQUUsQ0FBQ2dFLFdBQUgsQ0FBZVIsU0FBZixDQUF5QlMsUUFBNUMsRUFBc0QsS0FBS0MsU0FBM0QsRUFBc0UsSUFBdEU7QUFDQWxFLE1BQUFBLEVBQUUsQ0FBQytELFdBQUgsQ0FBZVIsR0FBZixDQUFtQnZELEVBQUUsQ0FBQ2dFLFdBQUgsQ0FBZVIsU0FBZixDQUF5QlcsTUFBNUMsRUFBb0QsS0FBS0MsT0FBekQsRUFBa0UsSUFBbEU7QUFDSDtBQUVKLEdBMVVJO0FBNFVMb0UsRUFBQUEsYUE1VUsseUJBNFVTbkIsS0E1VVQsRUE0VWdCO0FBQ2pCLFFBQUlvQixRQUFRLEdBQUdwQixLQUFLLENBQUNxQixXQUFOLEVBQWY7QUFDQSxRQUFJQyxHQUFHLEdBQUczSSxFQUFFLENBQUMrQixFQUFILEVBQVYsQ0FGaUIsQ0FHakI7O0FBQ0EvQixJQUFBQSxFQUFFLENBQUNrRCxJQUFILENBQVEsbUJBQVIsRUFBNkJvQixZQUE3QixDQUEwQ3RFLEVBQUUsQ0FBQzRJLE1BQTdDLEVBQXFEQyxxQkFBckQsQ0FBMkVKLFFBQTNFLEVBQXFGRSxHQUFyRjtBQUNBLFFBQUlHLGFBQWEsR0FBRyxLQUFLOUcsWUFBTCxDQUFrQitHLE1BQWxCLENBQXlCQyxvQkFBekIsQ0FBOENMLEdBQTlDLENBQXBCLENBTGlCLENBT2pCOztBQUNBLFNBQUtNLGFBQUwsQ0FBbUJILGFBQW5CLEVBUmlCLENBVWpCOztBQUNBLFNBQUtJLGtCQUFMLENBQXdCSixhQUF4QjtBQUNBLFNBQUtoSCxjQUFMLEdBQXNCZ0gsYUFBdEI7QUFFQSxTQUFLSyxrQkFBTDtBQUNILEdBM1ZJO0FBNlZMQyxFQUFBQSxZQTdWSyx3QkE2VlEvQixLQTdWUixFQTZWZTtBQUNoQixRQUFJZ0MsS0FBSyxHQUFHaEMsS0FBSyxDQUFDaUMsVUFBTixHQUFtQixDQUFuQixDQUFaO0FBQ0EsUUFBSWIsUUFBUSxHQUFHcEIsS0FBSyxDQUFDcUIsV0FBTixFQUFmO0FBQ0EsUUFBSUMsR0FBRyxHQUFHM0ksRUFBRSxDQUFDK0IsRUFBSCxFQUFWLENBSGdCLENBSWhCOztBQUNBL0IsSUFBQUEsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLG1CQUFSLEVBQTZCb0IsWUFBN0IsQ0FBMEN0RSxFQUFFLENBQUM0SSxNQUE3QyxFQUFxREMscUJBQXJELENBQTJFSixRQUEzRSxFQUFxRkUsR0FBckY7QUFDQSxRQUFJRyxhQUFhLEdBQUcsS0FBSzlHLFlBQUwsQ0FBa0IrRyxNQUFsQixDQUF5QkMsb0JBQXpCLENBQThDTCxHQUE5QyxDQUFwQixDQU5nQixDQVFoQjs7QUFDQSxTQUFLTSxhQUFMLENBQW1CSCxhQUFuQixFQVRnQixDQVdoQjs7QUFDQSxTQUFLSSxrQkFBTCxDQUF3QkosYUFBeEI7QUFDQSxTQUFLaEgsY0FBTCxHQUFzQmdILGFBQXRCO0FBRUEsU0FBS0ssa0JBQUw7QUFDSCxHQTdXSTtBQStXTEEsRUFBQUEsa0JBL1dLLGdDQStXZ0I7QUFDakI7QUFDQSxRQUFJLEtBQUtySCxjQUFMLENBQW9CcUQsQ0FBcEIsR0FBd0IsQ0FBNUIsRUFDSSxLQUFLeEIsU0FBTCxHQURKLEtBRUssSUFBSSxLQUFLN0IsY0FBTCxDQUFvQnFELENBQXBCLEdBQXdCLENBQTVCLEVBQ0QsS0FBS3pCLFFBQUw7QUFHSixTQUFLaEIsY0FBTCxHQUFzQixJQUF0QixDQVJpQixDQVNqQjtBQUNBO0FBQ0E7QUFDSCxHQTNYSTtBQTRYTDZHLEVBQUFBLFdBNVhLLHlCQTRYUztBQUNWO0FBQ0EsUUFBSSxLQUFLN0csY0FBVCxFQUF5QjtBQUNyQixXQUFLZCxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsV0FBS0QsV0FBTCxHQUFtQixLQUFuQjtBQUNBLFdBQUtlLGNBQUwsR0FBc0IsS0FBdEI7QUFDSDs7QUFHRCxTQUFLWixjQUFMLEdBQXNCOUIsRUFBRSxDQUFDMEUsSUFBSCxDQUFROEUsSUFBOUI7QUFDQSxTQUFLTixrQkFBTCxDQUF3QmxKLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUThFLElBQWhDO0FBQ0gsR0F2WUk7QUF5WUxOLEVBQUFBLGtCQXpZSyw4QkF5WWNPLEdBellkLEVBeVltQjtBQUNwQixTQUFLekgsWUFBTCxDQUFrQjBILFdBQWxCLENBQThCRCxHQUE5QjtBQUNILEdBM1lJO0FBNllMUixFQUFBQSxhQTdZSyx5QkE2WVNVLFdBN1lULEVBNllzQjtBQUN2QixRQUFJQyxRQUFRLEdBQUdELFdBQVcsQ0FBQ0UsR0FBWixFQUFmOztBQUNBLFFBQUlELFFBQVEsR0FBRyxLQUFLL0gsV0FBcEIsRUFBaUM7QUFDN0I4SCxNQUFBQSxXQUFXLENBQUNHLE9BQVosQ0FBb0IsS0FBS2pJLFdBQUwsR0FBbUIrSCxRQUF2QztBQUNIO0FBQ0osR0FsWkk7QUFtWkxHLEVBQUFBLE1BQU0sRUFBRSxnQkFBVUMsRUFBVixFQUFjO0FBRWxCLFNBQUtwSixNQUFMLEdBQWMsS0FBSzBELFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsQ0FBK0NVLENBQTdEO0FBQ0EsU0FBS3RFLE1BQUwsR0FBYyxLQUFLeUQsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxDQUErQ2UsQ0FBN0Q7QUFDQSxTQUFLMUUsV0FBTCxHQUFtQixLQUFLd0QsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDMEYsY0FBaEMsRUFBbkI7QUFDQSxTQUFLakgsR0FBTCxJQUFZZ0gsRUFBWjtBQUNBLFNBQUtqSCxLQUFMLElBQWMsQ0FBZDs7QUFFQSxRQUFJLENBQUMsS0FBS21ELE1BQU4sSUFBZ0IsS0FBS3hFLFFBQXJCLElBQWlDLENBQUMsS0FBS2UsZ0JBQTNDLEVBQTZEO0FBQ3pELFdBQUt4QixTQUFMLENBQWVrRixJQUFmLENBQW9CLE9BQXBCO0FBQ0EsV0FBSzFELGdCQUFMLEdBQXdCLElBQXhCO0FBQ0gsS0FYaUIsQ0FhbEI7QUFDQTtBQUVBOzs7QUFFQSxRQUFJLEtBQUsvQixZQUFMLENBQWtCNEQsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUM0RixXQUE3QyxFQUEwRDtBQUV0RCxVQUFJLEtBQUt4SixZQUFMLENBQWtCNEQsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUM2RixRQUF6QyxJQUFxRCxDQUF6RCxFQUE0RCxDQUN4RDtBQUNILE9BRkQsTUFFTztBQUlILFlBQUksS0FBS2hKLFNBQUwsSUFBa0IsQ0FBdEIsRUFDSSxLQUFLQSxTQUFMLEdBQWlCNkksRUFBakIsQ0FESixLQUVLLElBQUk1RSxJQUFJLENBQUNnRixHQUFMLENBQVNKLEVBQUUsR0FBSSxLQUFLaEgsR0FBTCxHQUFXLEtBQUtELEtBQS9CLElBQXlDLElBQTdDLEVBQ0QsS0FBSzVCLFNBQUwsR0FBaUI2SSxFQUFqQjs7QUFFSixZQUFJLEtBQUt0SixZQUFMLENBQWtCNEQsWUFBbEIsQ0FBK0IsUUFBL0IsRUFBeUM2RixRQUF6QyxJQUFxRCxLQUFLOUYsSUFBTCxDQUFVaUUsSUFBL0QsSUFBdUUsQ0FBQyxLQUFLN0gsUUFBakYsRUFBMkY7QUFDdkYsZUFBS0EsUUFBTCxHQUFnQixJQUFoQjtBQUNBLGNBQUk0SixFQUFFLEdBQUcsS0FBSy9GLFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixDQUFULENBRnVGLENBSXZGO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOztBQUVBLGNBQUl2RSxFQUFFLENBQUNvRCxHQUFILENBQU9DLFFBQVAsSUFBbUJyRCxFQUFFLENBQUNvRCxHQUFILENBQU9FLFdBQTlCLEVBQTJDO0FBQ3ZDO0FBQ0F0RCxZQUFBQSxFQUFFLENBQUNrRCxJQUFILENBQVEsa0JBQVIsRUFBNEI2QixNQUE1QixHQUFxQyxJQUFyQztBQUNIOztBQUVELGVBQUs5QyxVQUFMLENBQWdCcUksRUFBaEIsQ0FBbUJ0SyxFQUFFLENBQUNXLElBQUgsQ0FBUTZDLFNBQVIsQ0FBa0JDLFdBQXJDLEVBQWtELEtBQUtDLFFBQXZELEVBQWlFLElBQWpFO0FBQ0EsZUFBS3hCLFdBQUwsQ0FBaUJvSSxFQUFqQixDQUFvQnRLLEVBQUUsQ0FBQ1csSUFBSCxDQUFRNkMsU0FBUixDQUFrQkMsV0FBdEMsRUFBbUQsS0FBS0UsU0FBeEQsRUFBbUUsSUFBbkU7QUFDQSxlQUFLeEIsVUFBTCxDQUFnQm1JLEVBQWhCLENBQW1CdEssRUFBRSxDQUFDVyxJQUFILENBQVE2QyxTQUFSLENBQWtCQyxXQUFyQyxFQUFrRCxLQUFLRyxJQUF2RCxFQUE2RCxJQUE3RDtBQUNBLGVBQUt4QixZQUFMLENBQWtCa0ksRUFBbEIsQ0FBcUJ0SyxFQUFFLENBQUNXLElBQUgsQ0FBUTZDLFNBQVIsQ0FBa0JDLFdBQXZDLEVBQW9ELEtBQUtJLE1BQXpELEVBQWlFLElBQWpFO0FBQ0EsZUFBS3hCLFVBQUwsQ0FBZ0JpSSxFQUFoQixDQUFtQnRLLEVBQUUsQ0FBQ1csSUFBSCxDQUFRNkMsU0FBUixDQUFrQkMsV0FBckMsRUFBa0QsS0FBS0ssSUFBdkQsRUFBNkQsSUFBN0Q7QUFDQTlELFVBQUFBLEVBQUUsQ0FBQytELFdBQUgsQ0FBZXVHLEVBQWYsQ0FBa0J0SyxFQUFFLENBQUNnRSxXQUFILENBQWVSLFNBQWYsQ0FBeUJTLFFBQTNDLEVBQXFELEtBQUtDLFNBQTFELEVBQXFFLElBQXJFO0FBQ0FsRSxVQUFBQSxFQUFFLENBQUMrRCxXQUFILENBQWV1RyxFQUFmLENBQWtCdEssRUFBRSxDQUFDZ0UsV0FBSCxDQUFlUixTQUFmLENBQXlCVyxNQUEzQyxFQUFtRCxLQUFLQyxPQUF4RCxFQUFpRSxJQUFqRTtBQUNIO0FBQ0o7QUFDSixLQXJGaUIsQ0F3Rm5CO0FBQ0M7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBOzs7QUFFQSxRQUFJLEtBQUszRCxRQUFULEVBQW1CO0FBR2YsVUFBSSxLQUFLaUIsUUFBTCxJQUFpQixDQUFDMUIsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLG1CQUFSLEVBQTZCb0IsWUFBN0IsQ0FBMEMsY0FBMUMsRUFBMERpRyxhQUEzRCxHQUEyRSxDQUE1RixJQUFpR3ZLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEaUcsYUFBMUQsR0FBMEUsQ0FBL0ssRUFBa0w7QUFDOUssWUFBSXZLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEaUcsYUFBMUQsR0FBMEUsQ0FBOUUsRUFDSXZLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEaUcsYUFBMUQsSUFBMkVQLEVBQUUsR0FBRyxHQUFoRixDQURKLEtBRUssSUFBSWhLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEaUcsYUFBMUQsR0FBMEUsQ0FBOUUsRUFDRHZLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEaUcsYUFBMUQsSUFBMkVQLEVBQUUsR0FBRyxHQUFoRjtBQUVQOztBQUVELFVBQUloSyxFQUFFLENBQUNrRCxJQUFILENBQVEsbUJBQVIsRUFBNkJvQixZQUE3QixDQUEwQyxjQUExQyxFQUEwRGtHLGFBQTFELEdBQTBFLEVBQTFFLElBQWdGLEtBQUs3SSxXQUF6RixFQUNJM0IsRUFBRSxDQUFDa0QsSUFBSCxDQUFRLG1CQUFSLEVBQTZCb0IsWUFBN0IsQ0FBMEMsY0FBMUMsRUFBMERrRyxhQUExRCxJQUEyRVIsRUFBRSxHQUFHLEdBQWhGO0FBRUosVUFBSWhLLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEa0csYUFBMUQsR0FBMEUsQ0FBQyxFQUEzRSxJQUFpRixLQUFLNUksVUFBMUYsRUFDSTVCLEVBQUUsQ0FBQ2tELElBQUgsQ0FBUSxtQkFBUixFQUE2Qm9CLFlBQTdCLENBQTBDLGNBQTFDLEVBQTBEa0csYUFBMUQsSUFBMkVSLEVBQUUsR0FBRyxHQUFoRixDQWZXLENBaUJmO0FBQ0E7QUFDQTtBQUNBOztBQUVBaEssTUFBQUEsRUFBRSxDQUFDeUssUUFBSCxDQUFZQyxpQkFBWixHQUFnQ0MsT0FBaEMsR0FBMEMzSyxFQUFFLENBQUMrQixFQUFILENBQU0sQ0FBTixFQUFTLENBQUMsS0FBS1osU0FBTixHQUFrQixJQUEzQixDQUExQztBQUNBLFdBQUtrRCxJQUFMLENBQVVDLFlBQVYsQ0FBdUJ0RSxFQUFFLENBQUN1RSxTQUExQixFQUFxQ0MsWUFBckMsR0FBb0QsS0FBS3JELFNBQUwsR0FBaUIsSUFBckU7QUFHQSxVQUFJLENBQUMsS0FBS1EsV0FBTixJQUFxQixDQUFDLEtBQUtDLFVBQS9CLEVBQ0ksS0FBS3VGLEtBQUw7O0FBRUosVUFBSSxLQUFLOUYsT0FBTCxJQUFnQixDQUFwQixFQUF1QjtBQUVuQixZQUFJLEtBQUtDLFFBQUwsR0FBZ0IsS0FBSytDLElBQUwsQ0FBVWdDLE1BQTlCLEVBQXNDO0FBQ2xDLGVBQUtoQyxJQUFMLENBQVV1QyxNQUFWLElBQW9CLE9BQU9vRCxFQUEzQjtBQUNBLGVBQUszRixJQUFMLENBQVVnQyxNQUFWLElBQW9CLE9BQU8yRCxFQUEzQjtBQUVILFNBSkQsTUFJTztBQUNILGVBQUszSSxPQUFMLEdBQWUsQ0FBZixDQURHLENBR0g7O0FBQ0EsY0FBSSxLQUFLSyxRQUFULEVBQW1CO0FBQ2YsZ0JBQUksS0FBS0MsV0FBVCxFQUNJLEtBQUsyQyxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLEtBQUtuRSxTQUFMLEdBQWlCLEtBQUtZLFNBQTlCLEVBQXlDLEtBQUtOLE1BQTlDLENBQWpELENBREosS0FFSyxJQUFJLEtBQUtlLFVBQVQsRUFDRCxLQUFLMEMsWUFBTCxDQUFrQnRFLEVBQUUsQ0FBQ3VFLFNBQXJCLEVBQWdDRSxjQUFoQyxHQUFpRHpFLEVBQUUsQ0FBQzBFLElBQUgsQ0FBUSxDQUFDLEtBQUtuRSxTQUFOLEdBQWtCLEtBQUtZLFNBQS9CLEVBQTBDLEtBQUtOLE1BQS9DLENBQWpEO0FBQ1A7QUFFSjtBQUNKLE9BbEJELE1Ba0JPLElBQUksS0FBS1EsT0FBTCxJQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBRTNCLFlBQUksS0FBS0UsUUFBTCxHQUFnQixLQUFLOEMsSUFBTCxDQUFVZ0MsTUFBOUIsRUFBc0M7QUFDbEMsZUFBS2hDLElBQUwsQ0FBVXVDLE1BQVYsSUFBb0IsT0FBT29ELEVBQTNCO0FBQ0EsZUFBSzNGLElBQUwsQ0FBVWdDLE1BQVYsSUFBb0IsT0FBTzJELEVBQTNCO0FBQ0gsU0FIRCxNQUdPO0FBRUgsZUFBSzNJLE9BQUwsR0FBZSxDQUFmLENBRkcsQ0FJSDs7QUFDQSxjQUFJLEtBQUtLLFFBQVQsRUFBbUI7QUFDZixnQkFBSSxLQUFLQyxXQUFULEVBQ0ksS0FBSzJDLFlBQUwsQ0FBa0J0RSxFQUFFLENBQUN1RSxTQUFyQixFQUFnQ0UsY0FBaEMsR0FBaUR6RSxFQUFFLENBQUMwRSxJQUFILENBQVEsS0FBS2xFLGNBQUwsR0FBc0IsS0FBS1csU0FBbkMsRUFBOEMsS0FBS04sTUFBbkQsQ0FBakQsQ0FESixLQUVLLElBQUksS0FBS2UsVUFBVCxFQUNELEtBQUswQyxZQUFMLENBQWtCdEUsRUFBRSxDQUFDdUUsU0FBckIsRUFBZ0NFLGNBQWhDLEdBQWlEekUsRUFBRSxDQUFDMEUsSUFBSCxDQUFRLENBQUMsS0FBS2xFLGNBQU4sR0FBdUIsS0FBS1csU0FBcEMsRUFBK0MsS0FBS04sTUFBcEQsQ0FBakQ7QUFDUDtBQUNKO0FBQ0o7QUFDSjtBQUdKO0FBN2pCSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBqdW1wSGVpZ2h0OiAwLFxyXG4gICAgICAgIHNtYWxsSnVtcEhlaWdodDogMCxcclxuICAgICAgICBqdW1wRHVyYXRpb246IDAsXHJcbiAgICAgICAgbW92ZVNwZWVkOiAwLFxyXG4gICAgICAgIHNtYWxsTW92ZVNwZWVkOiAwLFxyXG4gICAgICAgIGlzUGxheWVyOiBmYWxzZSxcclxuICAgICAgICBjbGllbnRTY3JpcHQ6IGNjLk5vZGUsXHJcbiAgICAgICAgeFNwZWVkOiAwLFxyXG4gICAgICAgIHlTcGVlZDogMCxcclxuICAgICAgICBsb2NhbENlbnRlcjogMCxcclxuICAgICAgICBncm91bmRlcjogY2MuTm9kZSxcclxuICAgICAgICBib2R5OiBjYy5Ob2RlLFxyXG4gICAgICAgIGFuaW1hdGlvbjogY2MuQW5pbWF0aW9uLFxyXG4gICAgICAgIGRlbHRhVGltZTogMCxcclxuICAgICAgICBmYWxsTXVsdGlwbGllcjogMi41LFxyXG4gICAgICAgIGdyb3dpbmc6IDAsXHJcbiAgICAgICAgbWF4U2NhbGU6IDEsXHJcbiAgICAgICAgbWluU2NhbGU6IDAuNSxcclxuICAgICAgICBhdGVDYWtlOiBmYWxzZSxcclxuICAgICAgICBhdGVQb3Rpb246IGZhbHNlLFxyXG4gICAgICAgIGdyb3VuZGVkOiBmYWxzZSxcclxuICAgICAgICBtb3ZpbmdSaWdodDogZmFsc2UsXHJcbiAgICAgICAgbW92aW5nTGVmdDogZmFsc2UsXHJcbiAgICAgICAgam95c3RpY2tNYXg6IDY5LFxyXG4gICAgICAgIGpveXN0aWNrVmVjdG9yOiBjYy52MigpLFxyXG4gICAgICAgIGpveXN0aWNrQmFsbDogY2MuTm9kZSxcclxuICAgICAgICBsZWZ0QnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIHJpZ2h0QnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGp1bXBCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgcG90aW9uQnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNha2VCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHRpbWVTdGVwOiAwLFxyXG4gICAgICAgIHN0YXJ0VGltZXI6IGZhbHNlLFxyXG4gICAgICAgIHBsYXlpbmdBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgam95c3RpY2tNb3Zpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBsYXllZEZhbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIHNvdW5kQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBzb3VuZHM6IG51bGwsXHJcbiAgICAgICAgYnVzeTogZmFsc2UsXHJcblxyXG4gICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgIHN1bTogMCxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZGlzYWJsZSgpIHtcclxuICAgIC8vICAgICBpZiAoY2Muc3lzLnBsYXRmb3JtID09IGNjLnN5cy5XRUNIQVRfR0FNRSkge1xyXG4gICAgLy8gICAgICAgICBsZXQgam95c3RpY2sgPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KT1lTVElDS1wiKTtcclxuICAgIC8vICAgICAgICAgbGV0IGp1bXBCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9KVU1QXCIpO1xyXG4gICAgLy8gICAgICAgICBsZXQgcG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvUE9USU9OXCIpO1xyXG4gICAgLy8gICAgICAgICBsZXQgY2FrZUJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0NBS0VcIik7XHJcbiAgICAvLyAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qb3lzdGlja1N0YXJ0LCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgam95c3RpY2sub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5qb3lzdGlja0VuZCwgdGhpcyk7XHJcbiAgICAvLyAgICAgICAgIGpveXN0aWNrLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgLy8gICAgICAgICBqdW1wQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgIC8vICAgICAgICAgcG90aW9uQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5zaHJpbmssIHRoaXMpO1xyXG4gICAgLy8gICAgICAgICBjYWtlQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAvLyAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gMDtcclxuICAgIC8vICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgLy8gfSxcclxuICAgIHN0YXJ0KClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxlZnRCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRTIvTEVGVFwiKTtcclxuICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUyL1JJR0hUXCIpO1xyXG4gICAgICAgIHRoaXMuanVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFMi9KVU1QXCIpO1xyXG4gICAgICAgIHRoaXMucG90aW9uQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUyL1BPVElPTlwiKTtcclxuICAgICAgICB0aGlzLmNha2VCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRTIvQ0FLRVwiKTtcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlKCkge1xyXG4gICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdEJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubW92ZUxlZnQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5tb3ZlUmlnaHQsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmp1bXBCdXR0b24ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBvdGlvbkJ1dHRvbi5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5jYWtlQnV0dG9uLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gMDtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuICAgIHBsYXlFbW9qaSh0eXBlKSB7XHJcbiAgICAgICAgbGV0IGVtb2ppID0gdGhpcy5lbW9qaXMuZ2V0Q2hpbGRCeU5hbWUodHlwZSk7XHJcbiAgICAgICAgLy9ubyBzcGFtIGVycm9yXHJcbiAgICAgICAgaWYgKCEgZW1vamkuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGVtb2ppLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKGVtb2ppKS50bygwLjUsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS54ICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwKSAqIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpID8gMSA6IC0xKSwgdGhpcy5ub2RlLnkgKyAyMDAwKSB9LCB7IGVhc2luZzogJ3NpbmVPdXRJbicgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4oZW1vamkpLmRlbGF5KDEpLnRvKDAsIHsgcG9zaXRpb246IGNjLnYyKHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLngsIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImJvZHlcIikuZ2V0Q2hpbGRCeU5hbWUoXCJoZWFkXCIpLnkpIH0pLmNhbGwoKCkgPT4geyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9KS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL3RoaXMuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyBlbW9qaS5hY3RpdmUgPSBmYWxzZSB9LCAyKTtcclxuICAgIH0sXHJcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmLCBvdGhlcikge1xyXG5cclxuICAgICAgICBpZiAoc2VsZi50YWcgPT0gMiAmJiAob3RoZXIubm9kZS5ncm91cCA9PSBcImVudmlyb25tZW50XCIgfHwgb3RoZXIubm9kZS5ncm91cCA9PSBcIm1vdmluZ1BsYXRmb3JtXCIpKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL3N0b3AgZmFsbGluZyBhbmltYXRpb25cclxuICAgICAgICAgICAgLy90aGlzLmFuaW1hdGlvbi5zdG9wKFwiZmFsbGluZ1wiKTtcclxuICAgICAgICAgICAgLy90aGlzLnBsYXllZEZhbGxpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vcGxheSAgYW5pbWF0aW9uc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoXCJ3YWxrXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImxhbmRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BsYXllcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdW5kc1tcImxhbmRpbmdcIl0ucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdBbmltYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMyk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9jaGFuZ2Ugc3BlZWQgaWYgZGlmZmVyZW50IHNpemVcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnNtYWxsTW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoLXRoaXMubW92ZVNwZWVkICogdGhpcy5kZWx0YVRpbWUsIHRoaXMueVNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgb25FbmRDb250YWN0KGNvbnRhY3QsIHNlbGYsIG90aGVyKSB7XHJcbiAgICAgICAgaWYgKHNlbGYudGFnID09IDIpXHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBqdW1wUnVuQWN0aW9uKCkge1xyXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy50d2VlbigpLmJ5KDEsIHsgeTogMzAwIH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSk7XHJcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MudHdlZW4oKS5ieSgxLCB7IHk6IC0zMDAgfSwgeyBlYXNpbmc6ICdzaW5lSW4nIH0pO1xyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMubm9kZSkuc2VxdWVuY2UoanVtcFVwLCBqdW1wRG93bikuc3RhcnQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgbW92ZVJpZ2h0KCkge1xyXG4gICBcclxuICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJvZHkuc2NhbGVYID0gLTE7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiB0aGlzLmdyb3VuZGVkKSB7XHJcbiAgICAgICAgICAgIGxldCBhbmltU3RhdGUgPSB0aGlzLmFuaW1hdGlvbi5wbGF5KFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgYW5pbVN0YXRlLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcclxuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5zY2FsZVkgPCB0aGlzLm1heFNjYWxlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnNlbmRQbGF5ZXJTdGF0ZShcInJpZ2h0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlTGVmdCgpIHtcclxuICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYm9keS5zY2FsZVggPSAxO1xyXG4gICAgICAgIGlmICghdGhpcy5tb3ZpbmcgJiYgdGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICBsZXQgYW5pbVN0YXRlID0gdGhpcy5hbmltYXRpb24ucGxheShcIndhbGtcIik7XHJcbiAgICAgICAgICAgIGFuaW1TdGF0ZS53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5tb3ZpbmdMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXllcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLnNjYWxlWSA8IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LnkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5tb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55KTtcclxuICAgICAgICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwibGVmdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGp1bXAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc291bmRzW1wianVtcFwiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdW5kZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGlmZmVyZW50IGp1bXAgaGVpZ2h0cyBkZXBlbmRpbmcgb24gc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuc2NhbGVZID49IHRoaXMubWF4U2NhbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuanVtcEhlaWdodCAqIHRoaXMuZGVsdGFUaW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy52Mih0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5LngsIHRoaXMuc21hbGxKdW1wSGVpZ2h0ICogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lciA9IHRydWU7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwianVtcFwiKTtcclxuICAgICAgICAgICAgICAgIH0sIDAuMSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheShcImp1bXBcIik7ICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdyb3VuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWCgpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKFwid2Fsa1wiKTtcclxuICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5tb3ZpbmcpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubW92aW5nUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgIC8vY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIoMCwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFhcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gIFxyXG5cclxuICAgIH0sXHJcbiAgICBzdG9wWSgpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNQbGF5ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIDApO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudFNjcmlwdC5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuc2VuZFBsYXllclN0YXRlKFwic3RvcFlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2hyaW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlUG90aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW1wiZHJpbmtpbmcyXCJdLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm93aW5nID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBncm93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyICYmIHRoaXMuYXRlQ2FrZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tcImVhdGluZ1wiXS5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gICAgb25LZXlEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS53OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYTpcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5kOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5lOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm93KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucTpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hyaW5rKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuZTpcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiZ2FtZU1hbmFnZXJcIikuc2hvd0Vtb2ppcygpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uS2V5VXAoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gY2MubWFjcm8uS0VZLncpIHtcclxuICAgICAgICAgICAgLy90aGlzLnN0b3BZKCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLlZlYzIodGhpcy54U3BlZWQsIC0gMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5hKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IGNjLm1hY3JvLktFWS5kKSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5zdG9wWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmJvZHkgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50U2NyaXB0ID0gY2MuZmluZChcInN5c3RlbVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgLy9tYXAgc291bmRzIHRvIHRoZWlyIGF1ZGlvU291cmNlXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1t0aGlzLnNvdW5kQ29udHJvbGxlci5nZXRDb21wb25lbnRzKGNjLkF1ZGlvU291cmNlKVtpXS5jbGlwLm5hbWVdID0gdGhpcy5zb3VuZENvbnRyb2xsZXIuZ2V0Q29tcG9uZW50cyhjYy5BdWRpb1NvdXJjZSlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHRvdWNoUG9zID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsZXQgb3V0ID0gY2MudjIoKTtcclxuICAgICAgICAvL3VzZSBjYW1lcmEgdG8gZ2V0IHRvdWNoIHBvc1xyXG4gICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoY2MuQ2FtZXJhKS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQodG91Y2hQb3MsIG91dCk7XHJcbiAgICAgICAgbGV0IGxvY2FsVG91Y2hQb3MgPSB0aGlzLmpveXN0aWNrQmFsbC5wYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIob3V0KTtcclxuXHJcbiAgICAgICAgLy9saW1pdCBiYWxsIHNvIGl0IGNhbid0IGxlYXZlIGNpcmNsZVxyXG4gICAgICAgIHRoaXMubGltaXRKb3lzdGljayhsb2NhbFRvdWNoUG9zKTtcclxuXHJcbiAgICAgICAgLy9jaGFuZ2UgcG9zIG9mIGJhbGwgYWNjb3JkaW5nbHlcclxuICAgICAgICB0aGlzLnNldEpveXN0aWNrQmFsbFBvcyhsb2NhbFRvdWNoUG9zKTsgXHJcbiAgICAgICAgdGhpcy5qb3lzdGlja1ZlY3RvciA9IGxvY2FsVG91Y2hQb3M7XHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZlUGxheWVyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGpveXN0aWNrTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCB0b3VjaCA9IGV2ZW50LmdldFRvdWNoZXMoKVswXTtcclxuICAgICAgICBsZXQgdG91Y2hQb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBvdXQgPSBjYy52MigpO1xyXG4gICAgICAgIC8vdXNlIGNhbWVyYSB0byBnZXQgdG91Y2ggcG9zXHJcbiAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChjYy5DYW1lcmEpLmdldFNjcmVlblRvV29ybGRQb2ludCh0b3VjaFBvcywgb3V0KTtcclxuICAgICAgICBsZXQgbG9jYWxUb3VjaFBvcyA9IHRoaXMuam95c3RpY2tCYWxsLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihvdXQpO1xyXG5cclxuICAgICAgICAvL2xpbWl0IGJhbGwgc28gaXQgY2FuJ3QgbGVhdmUgY2lyY2xlXHJcbiAgICAgICAgdGhpcy5saW1pdEpveXN0aWNrKGxvY2FsVG91Y2hQb3MpO1xyXG5cclxuICAgICAgICAvL2NoYW5nZSBwb3Mgb2YgYmFsbCBhY2NvcmRpbmdseVxyXG4gICAgICAgIHRoaXMuc2V0Sm95c3RpY2tCYWxsUG9zKGxvY2FsVG91Y2hQb3MpO1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBsb2NhbFRvdWNoUG9zO1xyXG5cclxuICAgICAgICB0aGlzLmpveXN0aWNrTW92ZVBsYXllcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBqb3lzdGlja01vdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgLy9tb3ZlIHBsYXllciBob3Jpem9udGFsbHlcclxuICAgICAgICBpZiAodGhpcy5qb3lzdGlja1ZlY3Rvci54ID4gMClcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLmpveXN0aWNrVmVjdG9yLnggPCAwKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vbW92ZSBwbGF5ZXIgdmVydGljYWxseVxyXG4gICAgICAgIC8vaWYgKHRoaXMuam95c3RpY2tWZWN0b3IueSA+IDEwKVxyXG4gICAgICAgIC8vICAgIHRoaXMuanVtcCgpXHJcbiAgICB9LFxyXG4gICAgam95c3RpY2tFbmQoKSB7XHJcbiAgICAgICAgLy9zdG9wIHBsYXllclxyXG4gICAgICAgIGlmICh0aGlzLmpveXN0aWNrTW92aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92aW5nTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuam95c3RpY2tNb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHRoaXMuam95c3RpY2tWZWN0b3IgPSBjYy5WZWMyLlpFUk87XHJcbiAgICAgICAgdGhpcy5zZXRKb3lzdGlja0JhbGxQb3MoY2MuVmVjMi5aRVJPKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0Sm95c3RpY2tCYWxsUG9zKHBvcykge1xyXG4gICAgICAgIHRoaXMuam95c3RpY2tCYWxsLnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGxpbWl0Sm95c3RpY2soam95c3RpY2tWZWMpIHtcclxuICAgICAgICBsZXQgaW5wdXRNYWcgPSBqb3lzdGlja1ZlYy5tYWcoKTtcclxuICAgICAgICBpZiAoaW5wdXRNYWcgPiB0aGlzLmpveXN0aWNrTWF4KSB7XHJcbiAgICAgICAgICAgIGpveXN0aWNrVmVjLm11bFNlbGYodGhpcy5qb3lzdGlja01heCAvIGlucHV0TWFnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuIFxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS54O1xyXG4gICAgICAgIHRoaXMueVNwZWVkID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eS55O1xyXG4gICAgICAgIHRoaXMubG9jYWxDZW50ZXIgPSB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdldExvY2FsQ2VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdW0gKz0gZHQ7XHJcbiAgICAgICAgdGhpcy50b3RhbCArPSAxO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIHRoaXMuZ3JvdW5kZWQgJiYgIXRoaXMucGxheWluZ0FuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KFwic3RhbmRcIik7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ0FuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYgKGR0IDwgMC4wMiAmJiBkdCA+IDAuMDEpXHJcbiAgICAgICAgLy90aGlzLmRlbHRhVGltZSA9IGR0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmdhbWVTdGFydGVkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlbHRhVGltZSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsdGFUaW1lID0gZHQ7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChNYXRoLmFicyhkdCAtICh0aGlzLnN1bSAvIHRoaXMudG90YWwpKSA8IDAuMDMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWx0YVRpbWUgPSBkdDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jbGllbnRTY3JpcHQuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkID09IHRoaXMubm9kZS5uYW1lICYmICF0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BsYXllciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJiID0gdGhpcy5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGNjLnN5cy5wbGF0Zm9ybSA9PSBjYy5zeXMuV0VDSEFUX0dBTUUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aGlzLmpveXN0aWNrQmFsbCA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLL0JBTExcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBqb3lzdGljayA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pPWVNUSUNLXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBsZXQganVtcEJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL0pVTVBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBwb3Rpb25CdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9QT1RJT05cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBjYWtlQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvQ0FLRVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuam95c3RpY2tTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGpveXN0aWNrLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMuam95c3RpY2tNb3ZlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLmpveXN0aWNrRW5kLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAganVtcEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qdW1wLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNha2VCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuZ3JvdywgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuam95c3RpY2tCYWxsID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSk9ZU1RJQ0svQkFMTFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGpveXN0aWNrID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSk9ZU1RJQ0tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGxldCBqdW1wQnV0dG9uID0gY2MuZmluZChcIkNhbnZhcy9VSS9NT0JJTEUvSlVNUFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IHBvdGlvbkJ1dHRvbiA9IGNjLmZpbmQoXCJDYW52YXMvVUkvTU9CSUxFL1BPVElPTlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbGV0IGNha2VCdXR0b24gPSBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRS9DQUtFXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5qb3lzdGlja1N0YXJ0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgam95c3RpY2sub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5qb3lzdGlja01vdmUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqb3lzdGljay5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuam95c3RpY2tFbmQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBqdW1wQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBwb3Rpb25CdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuc2hyaW5rLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY2FrZUJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5ncm93LCB0aGlzKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYy5zeXMucGxhdGZvcm0gPT0gY2Muc3lzLldFQ0hBVF9HQU1FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2V0IG1vYmlsZSB0b3VjaCBjb250cm9sIGxpc3RlbmVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL1VJL01PQklMRVwiKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0QnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1vdmVMZWZ0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0QnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm1vdmVSaWdodCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmp1bXAsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG90aW9uQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLnNocmluaywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWtlQnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLmdyb3csIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAvLyB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmdyYXZpdHlTY2FsZSA9IGR0ICogICAgIDtcclxuICAgICAgICAvL2lmICh0aGlzLnlTcGVlZCA8IDApIHtcclxuICAgICAgICAvLyAgICAvL2NvbnNvbGUubG9nKGNjLlZlYzIoMCwgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAodGhpcy5mYWxsTXVsdGlwbGllciAtIDEpICogdGhpcy5kZWx0YVRpbWUpKTtcclxuICAgICAgICAvLyAgICAvLy5sb2coY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5LnkgKiAodGhpcy5mYWxsTXVsdGlwbGllciAtIDEpICogdGhpcy5kZWx0YVRpbWUpO1xyXG5cclxuICAgICAgICAvLyAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLnhTcGVlZCwgdGhpcy55U3BlZWQgKyBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkueSogdGhpcy5kZWx0YVRpbWUpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvL2lmICh0aGlzLnlTcGVlZCA+IDAgJiYgIWp1bXApIHtcclxuICAgICAgICAvLyAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ICs9IGNjLlZlYzIodGhpcy54U3BlZWQsIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eS55ICogMSAqIHRoaXMuZGVsdGFUaW1lKTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgLy8gZ3JvdyA9IC0xIG1lYW5zIHNocmluaW5nXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVyKSB7XHJcbiAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3VuZGVkICYmICFjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgPiAyIHx8IGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA8IDIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnlPZmZzZXRQbGF5ZXIgPiAyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciAtPSBkdCAqIDIwMDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueU9mZnNldFBsYXllciA8IDIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS55T2Zmc2V0UGxheWVyICs9IGR0ICogMjAwO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciA8IDUwICYmIHRoaXMubW92aW5nUmlnaHQpXHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKFwiQ2FudmFzL21haW5DYW1lcmFcIikuZ2V0Q29tcG9uZW50KFwiY2FtZXJhRm9sbG93XCIpLnhPZmZzZXRQbGF5ZXIgKz0gZHQgKiAyMDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2MuZmluZChcIkNhbnZhcy9tYWluQ2FtZXJhXCIpLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS54T2Zmc2V0UGxheWVyID4gLTUwICYmIHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoXCJDYW52YXMvbWFpbkNhbWVyYVwiKS5nZXRDb21wb25lbnQoXCJjYW1lcmFGb2xsb3dcIikueE9mZnNldFBsYXllciAtPSBkdCAqIDIwMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY3VzdG9tIGdyYXZpdHlcclxuICAgICAgICAgICAgLy9pZiAoIXRoaXMuZ3JvdW5kZWQpXHJcbiAgICAgICAgICAgIC8vICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMueFNwZWVkLCAtIDEwMCAqIE1hdGguYWJzKHRoaXMueVNwZWVkKSArIC0xMCk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZHQgKiAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZ3Jhdml0eSA9IGNjLnYyKDAsIC10aGlzLmRlbHRhVGltZSAqIDEwMDApO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkuZ3Jhdml0eVNjYWxlID0gdGhpcy5kZWx0YVRpbWUgKiAzMDAwO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tb3ZpbmdSaWdodCAmJiAhdGhpcy5tb3ZpbmdMZWZ0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wWCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3Jvd2luZyA9PSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4U2NhbGUgPiB0aGlzLm5vZGUuc2NhbGVZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNjYWxlWCArPSAwLjA1ICogZHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNjYWxlWSArPSAwLjA1ICogZHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3dpbmcgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZSBwbGF5ZXIgdmVsb2NpdHkgaWYgb24gZ3JvdW5kXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92aW5nUmlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMih0aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubW92aW5nTGVmdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKC10aGlzLm1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdyb3dpbmcgPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5TY2FsZSA8IHRoaXMubm9kZS5zY2FsZVkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVYIC09IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2NhbGVZIC09IDAuMDUgKiBkdDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3Jvd2luZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRlY3JlYXNlIHBsYXllciB2ZWxvY2l0eSBpZiBvbiBncm91bmRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91bmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZpbmdSaWdodClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkubGluZWFyVmVsb2NpdHkgPSBjYy5WZWMyKHRoaXMuc21hbGxNb3ZlU3BlZWQgKiB0aGlzLmRlbHRhVGltZSwgdGhpcy55U3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1vdmluZ0xlZnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MuVmVjMigtdGhpcy5zbWFsbE1vdmVTcGVlZCAqIHRoaXMuZGVsdGFUaW1lLCB0aGlzLnlTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iXX0=