
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