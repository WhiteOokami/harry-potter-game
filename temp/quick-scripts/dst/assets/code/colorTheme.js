
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
  changeColor: function changeColor(event, customEventData) {
    var i = parseInt(customEventData);
    if (i > 3) i = 0;
    this.node.getComponent("aboutPlayer").houseIndex = i;

    for (var index = 0; index < this.frames.length; index++) {
      this.frames[index].getComponent(cc.Sprite).enabled = false;
    }

    this.frames[i].getComponent(cc.Sprite).enabled = true;

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

    cc.find("Lobby Manager").getComponent("lobby").changeHouse(i);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcY29sb3JUaGVtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdUaGVtZTAiLCJnVGhlbWUxIiwiaFRoZW1lMCIsImhUaGVtZTEiLCJyVGhlbWUwIiwiclRoZW1lMSIsInNUaGVtZTAiLCJzVGhlbWUxIiwiZWxlbWVudHMwIiwiTm9kZSIsImVsZW1lbnRzMSIsImZyYW1lcyIsInN0YXJ0IiwiY2hhbmdlQ29sb3IiLCJldmVudCIsImN1c3RvbUV2ZW50RGF0YSIsImkiLCJwYXJzZUludCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJob3VzZUluZGV4IiwiaW5kZXgiLCJsZW5ndGgiLCJTcHJpdGUiLCJlbmFibGVkIiwiY29sb3IiLCJDb2xvciIsImZyb21IRVgiLCJmaW5kIiwiY2hhbmdlSG91c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxPQUFPLEVBQUMsU0FEQTtBQUVSQyxJQUFBQSxPQUFPLEVBQUMsU0FGQTtBQUdSQyxJQUFBQSxPQUFPLEVBQUMsU0FIQTtBQUlSQyxJQUFBQSxPQUFPLEVBQUMsU0FKQTtBQUtSQyxJQUFBQSxPQUFPLEVBQUMsU0FMQTtBQU1SQyxJQUFBQSxPQUFPLEVBQUMsU0FOQTtBQU9SQyxJQUFBQSxPQUFPLEVBQUMsU0FQQTtBQVFSQyxJQUFBQSxPQUFPLEVBQUMsU0FSQTtBQVNSQyxJQUFBQSxTQUFTLEVBQUMsQ0FBQ1osRUFBRSxDQUFDYSxJQUFKLENBVEY7QUFVUkMsSUFBQUEsU0FBUyxFQUFDLENBQUNkLEVBQUUsQ0FBQ2EsSUFBSixDQVZGO0FBV1JFLElBQUFBLE1BQU0sRUFBQyxDQUFDZixFQUFFLENBQUNhLElBQUo7QUFY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QUE0RDtBQUFDLGVBQUtYLFNBQUwsQ0FBZVcsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLdEIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7QUFDaEk7O0FBQ0osV0FBSyxDQUFMO0FBQ0ksYUFBSyxJQUFJZ0IsT0FBSyxHQUFHLENBQWpCLEVBQW9CQSxPQUFLLEdBQUcsS0FBS2IsU0FBTCxDQUFlYyxNQUEzQyxFQUFtREQsT0FBSyxFQUF4RCxFQUE0RDtBQUFDLGVBQUtiLFNBQUwsQ0FBZWEsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLckIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7O0FBQ2hJLGFBQUssSUFBSWUsT0FBSyxHQUFHLENBQWpCLEVBQW9CQSxPQUFLLEdBQUcsS0FBS1gsU0FBTCxDQUFlWSxNQUEzQyxFQUFtREQsT0FBSyxFQUF4RCxFQUE0RDtBQUFDLGVBQUtYLFNBQUwsQ0FBZVcsT0FBZixFQUFzQkksS0FBdEIsR0FBOEIsSUFBSTdCLEVBQUUsQ0FBQzhCLEtBQVAsR0FBZUMsT0FBZixDQUF1QixLQUFLcEIsT0FBNUIsQ0FBOUI7QUFBbUU7O0FBQUE7QUFDaEk7QUFoQlI7O0FBbUJBWCxJQUFBQSxFQUFFLENBQUNnQyxJQUFILENBQVEsZUFBUixFQUF5QlQsWUFBekIsQ0FBc0MsT0FBdEMsRUFBK0NVLFdBQS9DLENBQTJEYixDQUEzRDtBQUNIO0FBdERJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBnVGhlbWUwOlwiIzc0MDAwMVwiLFxyXG4gICAgICAgIGdUaGVtZTE6XCIjRDNBNjI1XCIsXHJcbiAgICAgICAgaFRoZW1lMDpcIiNGRkQ4MDBcIixcclxuICAgICAgICBoVGhlbWUxOlwiIzAwMDAwMFwiLFxyXG4gICAgICAgIHJUaGVtZTA6XCIjMEUxQTQwXCIsXHJcbiAgICAgICAgclRoZW1lMTpcIiM5NDZCMkRcIixcclxuICAgICAgICBzVGhlbWUwOlwiIzFBNDcyQVwiLFxyXG4gICAgICAgIHNUaGVtZTE6XCIjNUQ1RDVEXCIsXHJcbiAgICAgICAgZWxlbWVudHMwOltjYy5Ob2RlXSxcclxuICAgICAgICBlbGVtZW50czE6W2NjLk5vZGVdLFxyXG4gICAgICAgIGZyYW1lczpbY2MuTm9kZV1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgLy8gb25Mb2FkICgpIHt9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuICAgIGNoYW5nZUNvbG9yKGV2ZW50LGN1c3RvbUV2ZW50RGF0YSlcclxuICAgIHtcclxuICAgICAgICBsZXQgaSA9IHBhcnNlSW50KGN1c3RvbUV2ZW50RGF0YSk7XHJcbiAgICAgICAgaWYoaT4zKSBpPTA7XHJcbiAgICAgICAgdGhpcy5ub2RlLmdldENvbXBvbmVudChcImFib3V0UGxheWVyXCIpLmhvdXNlSW5kZXggPSBpO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZyYW1lcy5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmZyYW1lc1tpbmRleF0uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuZW5hYmxlZCA9IGZhbHNlO31cclxuICAgICAgICB0aGlzLmZyYW1lc1tpXS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzd2l0Y2ggKGkpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5nVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmdUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czAubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czBbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLmhUaGVtZTApfTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMS5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMVtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuaFRoZW1lMSl9O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRzMC5sZW5ndGg7IGluZGV4KyspIHt0aGlzLmVsZW1lbnRzMFtpbmRleF0uY29sb3IgPSBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKHRoaXMuclRoZW1lMCl9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMxLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMxW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5yVGhlbWUxKX07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudHMwLmxlbmd0aDsgaW5kZXgrKykge3RoaXMuZWxlbWVudHMwW2luZGV4XS5jb2xvciA9IG5ldyBjYy5Db2xvcigpLmZyb21IRVgodGhpcy5zVGhlbWUwKX07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50czEubGVuZ3RoOyBpbmRleCsrKSB7dGhpcy5lbGVtZW50czFbaW5kZXhdLmNvbG9yID0gbmV3IGNjLkNvbG9yKCkuZnJvbUhFWCh0aGlzLnNUaGVtZTEpfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MuZmluZChcIkxvYmJ5IE1hbmFnZXJcIikuZ2V0Q29tcG9uZW50KFwibG9iYnlcIikuY2hhbmdlSG91c2UoaSk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=