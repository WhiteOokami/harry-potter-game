
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