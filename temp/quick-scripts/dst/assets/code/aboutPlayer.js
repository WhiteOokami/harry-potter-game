
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
    serverIp: null
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcYWJvdXRQbGF5ZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJwbGF5ZXJJZCIsInJvb20iLCJjcm93bnMiLCJvcGVuaWQiLCJzZXJ2ZXJJcCIsIm9uTG9hZCIsImdhbWUiLCJhZGRQZXJzaXN0Um9vdE5vZGUiLCJub2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsUUFBUSxFQUFFLElBREY7QUFFUkMsSUFBQUEsSUFBSSxFQUFFLElBRkU7QUFHUkMsSUFBQUEsTUFBTSxFQUFFLENBSEE7QUFJUkMsSUFBQUEsTUFBTSxFQUFFLElBSkE7QUFLUkMsSUFBQUEsUUFBUSxFQUFFO0FBTEYsR0FIUDtBQVdMO0FBRUFDLEVBQUFBLE1BYkssb0JBYUk7QUFDTFQsSUFBQUEsRUFBRSxDQUFDVSxJQUFILENBQVFDLGtCQUFSLENBQTJCLEtBQUtDLElBQWhDO0FBQ0gsR0FmSSxDQWlCTDs7QUFqQkssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBwbGF5ZXJJZDogbnVsbCxcclxuICAgICAgICByb29tOiBudWxsLFxyXG4gICAgICAgIGNyb3duczogMCxcclxuICAgICAgICBvcGVuaWQ6IG51bGwsXHJcbiAgICAgICAgc2VydmVySXA6IG51bGwsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBjYy5nYW1lLmFkZFBlcnNpc3RSb290Tm9kZSh0aGlzLm5vZGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==