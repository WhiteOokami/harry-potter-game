
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY29sb3JUaGVtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdUaGVtZTAiLCJnVGhlbWUxIiwiaFRoZW1lMCIsImhUaGVtZTEiLCJyVGhlbWUwIiwiclRoZW1lMSIsInNUaGVtZTAiLCJzVGhlbWUxIiwiZWxlbWVudHMwIiwiTm9kZSIsImVsZW1lbnRzMSIsImZyYW1lcyIsInN0YXJ0IiwiY2hhbmdlQ29sb3IiLCJpIiwibm9kZSIsImdldENvbXBvbmVudCIsImhvdXNlSW5kZXgiLCJpbmRleCIsImxlbmd0aCIsImFjdGl2ZSIsImNvbG9yIiwiQ29sb3IiLCJmcm9tSEVYIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsT0FBTyxFQUFDLFNBREE7QUFFUkMsSUFBQUEsT0FBTyxFQUFDLFNBRkE7QUFHUkMsSUFBQUEsT0FBTyxFQUFDLFNBSEE7QUFJUkMsSUFBQUEsT0FBTyxFQUFDLFNBSkE7QUFLUkMsSUFBQUEsT0FBTyxFQUFDLFNBTEE7QUFNUkMsSUFBQUEsT0FBTyxFQUFDLFNBTkE7QUFPUkMsSUFBQUEsT0FBTyxFQUFDLFNBUEE7QUFRUkMsSUFBQUEsT0FBTyxFQUFDLFNBUkE7QUFTUkMsSUFBQUEsU0FBUyxFQUFDLENBQUNaLEVBQUUsQ0FBQ2EsSUFBSixDQVRGO0FBVVJDLElBQUFBLFNBQVMsRUFBQyxDQUFDZCxFQUFFLENBQUNhLElBQUosQ0FWRjtBQVdSRSxJQUFBQSxNQUFNLEVBQUMsQ0FBQ2YsRUFBRSxDQUFDYSxJQUFKO0FBWEMsR0FIUDtBQWlCTDtBQUVBO0FBRUFHLEVBQUFBLEtBckJLLG1CQXFCSSxDQUVSLENBdkJJO0FBeUJMO0FBRUFDLEVB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Q0FBZVcsTUFBM0MsRUFBbURELE9BQUssRUFBeEQsRUFBNEQ7QUFBQyxlQUFLVixTQUFMLENBQWVVLE9BQWYsRUFBc0JHLEtBQXRCLEdBQThCLElBQUl6QixFQUFFLENBQUMwQixLQUFQLEdBQWVDLE9BQWYsQ0FBdUIsS0FBS2pCLE9BQTVCLENBQTlCO0FBQW1FOztBQUFBOztBQUNoSSxhQUFLLElBQUlZLE9BQUssR0FBRyxDQUFqQixFQUFvQkEsT0FBSyxHQUFHLEtBQUtSLFNBQUwsQ0FBZVMsTUFBM0MsRUFBbURELE9BQUssRUFBeEQsRUFBNEQ7QUFBQyxlQUFLUixTQUFMLENBQWVRLE9BQWYsRUFBc0JHLEtBQXRCLEdBQThCLElBQUl6QixFQUFFLENBQUMwQixLQUFQLEdBQWVDLE9BQWYsQ0FBdUIsS0FBS2hCLE9BQTVCLENBQTlCO0FBQW1FOztBQUFBO0FBQ2hJO0FBaEJSO0FBa0JIO0FBbkRJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBnVGhlbWUwOlwiIzc0MDAwMVwiLFxyXG4gICAgICAgIGdUaGVtZTE6XCIjRDNBNjI1XCIsXHJcbiAgICAgICAgaFRoZW1lMDpcIiNGRkQ4MDBcIixcclxuICAgICAgICBoVGhlbWUxOlwiIzAwMDAwMFwiLFxyXG4gICAgICAgIHJUaGVtZTA6XCIjMEUxQTQwXCIsXHJcbiAgICAgICAgclRoZW1lMTpcIiM5NDZCMkRcIixcclxuICAgICAgICBzVGhlbWUwOlwiIzFBNDcyQVwiLFxyXG4gICAgICAgIHNUaGVtZTE6XCIjNUQ1RDVEXCIsXHJcbiAgICAgICAgZWxlbWVudHMwOltjYy5Ob2RlXSxcclxuICAgICAgICBlbGVtZW50czE6W2NjLk5vZGVdLFxyXG4gICAgICAgIGZyYW1lczpbY2MuTm9kZV0sXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIC8vIG9uTG9hZCAoKSB7fSxcclxuXHJcbiAgICBzdGFydCAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcbiAgICBjaGFuZ2VDb2xvcihpKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGk+MykgaT0wO1xyXG4gICAgICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJhYm91dFBsYXllclwiKS5ob3VzZUluZGV4ID0gaTtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5mcmFtZXMubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5mcmFtZXNbaW5kZXhdLmFjdGl2ZSA9IGZhbHNlO31cclxuICAgICAgICB0aGlzLmZyYW1lc1tpXS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHN3aXRjaCAoaSkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmdUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuZ1RoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMC5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMFtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuaFRoZW1lMCl9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMxLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMxW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5oVGhlbWUxKX07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5yVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnJUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnNUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuc1RoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl19