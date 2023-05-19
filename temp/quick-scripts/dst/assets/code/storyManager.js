
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcc3RvcnlNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFuZWwxIiwiTm9kZSIsInBhbmVsMiIsInBhbmVsMyIsInBhbmVsNCIsInBhbmVsNSIsInNoYWtlIiwicmFiYml0IiwidGV4dCIsIkxhYmVsIiwidGV4dEFyZWEiLCJzaG93VGV4dFNwZWVkIiwic3BlZWNoMSIsInNwZWVjaDIiLCJzcGVlY2gzIiwic3BlZWNoNCIsInNwZWVjaDUiLCJzcGVlY2g2IiwidGhlQ2hhciIsInRleHRJbmRleCIsInRoZVRleHRBIiwiY29vbE5vZGUiLCJ0aGFua3MiLCJzaG93Q2hhciIsInN0cmluZyIsInJldmVhbFRleHQiLCJ0aGVUZXh0IiwiaSIsImxlbmd0aCIsInNjaGVkdWxlT25jZSIsInNraXAiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIm9uTG9hZCIsImNvbnNvbGUiLCJsb2ciLCJvcGFjaXR5IiwidHdlZW4iLCJ0byIsImVhc2luZyIsInN0YXJ0IiwiYWN0aXZlIiwic2NhbGVYIiwic2NhbGVZIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFSixFQUFFLENBQUNLLElBREg7QUFFUkMsSUFBQUEsTUFBTSxFQUFFTixFQUFFLENBQUNLLElBRkg7QUFHUkUsSUFBQUEsTUFBTSxFQUFFUCxFQUFFLENBQUNLLElBSEg7QUFJUkcsSUFBQUEsTUFBTSxFQUFFUixFQUFFLENBQUNLLElBSkg7QUFLUkksSUFBQUEsTUFBTSxFQUFFVCxFQUFFLENBQUNLLElBTEg7QUFNUkssSUFBQUEsS0FBSyxFQUFFVixFQUFFLENBQUNLLElBTkY7QUFPUk0sSUFB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aUNHLENBakNIO0FBa0NILEtBckNELEVBcUNHLEVBckNIO0FBMkNILEdBM0lJLENBNklMOztBQTdJSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgcGFuZWwxOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsMjogY2MuTm9kZSxcclxuICAgICAgICBwYW5lbDM6IGNjLk5vZGUsXHJcbiAgICAgICAgcGFuZWw0OiBjYy5Ob2RlLFxyXG4gICAgICAgIHBhbmVsNTogY2MuTm9kZSxcclxuICAgICAgICBzaGFrZTogY2MuTm9kZSxcclxuICAgICAgICByYWJiaXQ6IGNjLk5vZGUsXHJcbiAgICAgICAgdGV4dDogY2MuTGFiZWwsXHJcbiAgICAgICAgdGV4dEFyZWE6IGNjLk5vZGUsXHJcbiAgICAgICAgc2hvd1RleHRTcGVlZDowLjEsXHJcblxyXG4gICAgICAgIHNwZWVjaDE6IFwiQWxpY2UsIHdlbGNvbWUgYmFjayB0byBXb25kZXJsYW5kIVwiLFxyXG4gICAgICAgIHNwZWVjaDI6IFwiIEhvd2V2ZXIsIEkgbXVzdCB0ZWxsIHlvdSB0aGF0IHRoaXMgd29ybGQgaXMgbm8gbG9uZ2VyIHRoZSBzYW1lIGFzIGJlZm9yZS4gXCIsXHJcbiAgICAgICAgc3BlZWNoMzogXCJUaGluZ3MgaGF2ZSBjaGFuZ2VkIGFuZCBub3cgeW91IGFyZW4ndCB0aGUgb25seSBBbGljZS4gSW4gZmFjdCwgdGhlcmUgYXJlIHRvbnMgb2YgQWxpY2VzLiBcIixcclxuICAgICAgICBzcGVlY2g0OiBcIlRoZSBSZWQgUXVlZW4gaXMgZm9yY2luZyB0aGVtIHRvIGNvbXBldGUgYWdhaW5zdCBlYWNoIG90aGVyIGluIGEgcmFjZS5JZiB5b3UgcmVhY2ggdGhlIGVuZCwgeW91IHdpbGwgZ2FpbiBjcm93bnMuTG9zZSBhbmQgeW91IG1pZ2h0IGxvc2UgY3Jvd25zLlwiLFxyXG4gICAgICAgIHNwZWVjaDU6IFwiSWYgeW91IHdpbiBlbm91Z2ggY3Jvd25zLCB5b3UgbWF5IGJlIGFibGUgdG8gZXNjYXBlIFdvbmRlcmxhbmQuXCIsXHJcbiAgICAgICAgc3BlZWNoNjogXCJJIHdpc2ggeW91IHRoZSBiZXN0IG9mIGx1Y2suXCIsXHJcbiAgICAgICAgdGhlQ2hhcjogJ2EnLFxyXG4gICAgICAgIHRleHRJbmRleDogMCxcclxuICAgICAgICB0aGVUZXh0QTogXCJcIixcclxuXHJcbiAgICAgICAgY29vbE5vZGU6IGNjLk5vZGUsXHJcbiAgICAgICAgdGhhbmtzOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93Q2hhcigpIHtcclxuICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlQ2hhcjtcclxuICAgIH0sXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuICAgIHJldmVhbFRleHQodGhlVGV4dCkge1xyXG4gICAgICAgIHRoaXMudGV4dC5zdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGV4dEluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLnRoZVRleHRBID0gdGhlVGV4dDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoZVRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dEluZGV4IDwgdGhpcy50aGVUZXh0QS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHQuc3RyaW5nICs9IHRoaXMudGhlVGV4dEFbdGhpcy50ZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEluZGV4ICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMuc2hvd1RleHRTcGVlZCAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICBza2lwKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3BlZWNoMVswXSk7XHJcbiAgICAgICAgdGhpcy5wYW5lbDEub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDIub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDMub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5wYW5lbDUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5yYWJiaXQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0QXJlYS5vcGFjaXR5ID0gMDtcclxuICAgICAgICB0aGlzLmNvb2xOb2RlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHRoaXMuc2hha2Uub3BhY2l0eSA9IDA7XHJcblxyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWwxKS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5wYW5lbDIpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjYy50d2Vlbih0aGlzLnBhbmVsMykudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgIH0sIDYpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwxLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsMi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5wYW5lbDMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw0KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgfSwgMTQpO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMucGFuZWw1KS50bygyLCB7IG9wYWNpdHk6IDI1NSB9LCB7IGVhc2luZzogJ3NpbmVPdXQnIH0pLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMuc2hha2UpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICB9LCAxOCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGFuZWw0LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnBhbmVsNS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zaGFrZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy5yYWJiaXQpLnRvKDIsIHsgb3BhY2l0eTogMjU1IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgY2MudHdlZW4odGhpcy50ZXh0QXJlYSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LCAyNik7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3NwZWVjaDFcclxuICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vc3BlZWNoMlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2gzXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NwZWVjaDRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vc3BlZWNoNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zcGVlY2g2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZlYWxUZXh0KHRoaXMuc3BlZWNoNik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy5jb29sTm9kZSkudG8oMiwgeyBvcGFjaXR5OiAyNTUgfSwgeyBlYXNpbmc6ICdzaW5lT3V0JyB9KS5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhbmt5b3VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MudHdlZW4odGhpcy50aGFua3MpLnRvKDIsIHsgc2NhbGVYOiAwLjksIHNjYWxlWTogMC45IH0sIHsgZWFzaW5nOiAnc2luZU91dCcgfSkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3N3aXRjaCBzY2VuZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDgpO1xyXG4gICAgICAgICAgICAgICAgfSwgOCk7XHJcbiAgICAgICAgICAgIH0sIDYpO1xyXG4gICAgICAgIH0sIDI3KTtcclxuXHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==