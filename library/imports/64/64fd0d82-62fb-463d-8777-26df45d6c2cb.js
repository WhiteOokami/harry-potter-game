"use strict";
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