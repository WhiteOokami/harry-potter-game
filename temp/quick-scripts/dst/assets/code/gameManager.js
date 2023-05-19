
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/code/gameManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f88aaqmmHtO/qKttC/WpRhf', 'gameManager');
// code/gameManager.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    distanceText: cc.Node,
    distance: 0,
    player: cc.Node,
    following: false,
    endPosition: cc.Node,
    gameEnded: false,
    winnerCanva: cc.Node,
    finishedPlayers: cc.Node,
    playerPrefab: cc.Prefab,
    timesUpUi: cc.Node,
    spawn: cc.Node,
    camera: cc.Node,
    players: cc.Node,
    spectateIndex: 0,
    spectateUI: cc.Node,
    emojiButton: cc.Node,
    emojiUI: cc.Node,
    mobileController: cc.Node,
    numFinished: cc.Node,
    crownsNode: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.director.getCollisionManager().enabled = true;
    cc.game.setFrameRate(60); //cc.director.getCollisionManager().enabledDebugDraw = true; 
    //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
  },
  addWinner: function addWinner(player, place) {
    this.numFinished.getComponent(cc.Label).string = place + "/" + this.players.children.length + " finished";
    var aPlayer = cc.instantiate(this.playerPrefab);
    aPlayer.parent = this.finishedPlayers;
    aPlayer.getChildByName("TEXT").getComponent(cc.Label).string = player.name + " finished in " + place + " place   " + cc.find("system").getComponent("client").myTime + "s";
  },
  timesUp: function timesUp() {
    this.player.getComponent("movement").disable();
    this.gameEnded = true;
    this.timesUpUi.active = true;
  },
  showCrowns: function showCrowns(crowns) {
    this.crownsNode.active = true;
    console.log(crowns);
    if (crowns > 0) this.crownsNode.getChildByName("CROWNS").getComponent(cc.Label).string = "+ " + crowns;else this.crownsNode.getChildByName("CROWNS").getComponent(cc.Label).string = crowns;
  },
  showWinners: function showWinners(crowns) {
    this.winnerCanva.active = true;
  },
  closeCrowns: function closeCrowns() {
    this.crownsNode.active = false;
  },
  closeSpectate: function closeSpectate() {
    this.winnerCanva.active = true;
    this.spectateUI.active = false;
  },
  goBackToLobby: function goBackToLobby() {
    // go back to lobby
    cc.find("system").getComponent("client").disconnect();
    cc.director.loadScene("home");
  },
  confirmTimesUp: function confirmTimesUp() {
    this.timesUpUi.active = false;
    this.showWinners();
  },
  openSpectateUi: function openSpectateUi() {
    this.winnerCanva.active = false;
    this.spectateUI.active = true;
  },
  showEmojis: function showEmojis() {
    this.emojiButton.active = false;
    this.emojiUI.active = true;
  },
  hideEmojis: function hideEmojis() {
    this.emojiButton.active = true;
    this.emojiUI.active = false;
  },
  sepctatePrev: function sepctatePrev() {
    this.spectateIndex -= 1;
    if (this.spectateIndex < 0) this.spectateIndex = this.players.children.length - 1;
    var newPlayer = this.players.children[this.spectateIndex];
    this.camera.getComponent("cameraFollow").player = newPlayer; // change spectating player name

    this.spectateUI.getChildByName("NAME").getComponent(cc.Label).string = "Spectating " + newPlayer.getChildByName("nameTag").getComponent(cc.Label).string;
  },
  spectateNext: function spectateNext() {
    // spectate next player
    this.spectateIndex += 1;
    if (this.spectateIndex >= this.players.children.length) this.spectateIndex = 0;
    var newPlayer = this.players.children[this.spectateIndex];
    this.camera.getComponent("cameraFollow").player = newPlayer; // change spectating player name

    this.spectateUI.getChildByName("NAME").getComponent(cc.Label).string = "Spectating " + newPlayer.getChildByName("nameTag").getComponent(cc.Label).string;
  },
  update: function update(dt) {
    if (!this.following) {
      if (cc.find("system").getComponent("client").myPlayer != null) {
        this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
        this.following = true;
        this.numFinished.getComponent(cc.Label).string = "0/" + this.players.children.length + " finished";
      }
    } else {
      //this.distance = Math.floor(Math.sqrt(Math.pow((this.endPosition.x - this.player.x), 2) + Math.pow((this.endPosition.y - this.player.y), 2)) / 10);
      //this.distanceText.getComponent(cc.Label).string = this.distance + " m";
      if (this.gameEnded) {
        this.player.getComponent("movement").active = false;
        this.mobileController.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ2FtZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXN0YW5jZVRleHQiLCJOb2RlIiwiZGlzdGFuY2UiLCJwbGF5ZXIiLCJmb2xsb3dpbmciLCJlbmRQb3NpdGlvbiIsImdhbWVFbmRlZCIsIndpbm5lckNhbnZhIiwiZmluaXNoZWRQbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwidGltZXNVcFVpIiwic3Bhd24iLCJjYW1lcmEiLCJwbGF5ZXJzIiwic3BlY3RhdGVJbmRleCIsInNwZWN0YXRlVUkiLCJlbW9qaUJ1dHRvbiIsImVtb2ppVUkiLCJtb2JpbGVDb250cm9sbGVyIiwibnVtRmluaXNoZWQiLCJjcm93bnNOb2RlIiwib25Mb2FkIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZW5hYmxlZCIsImdhbWUiLCJzZXRGcmFtZVJhdGUiLCJhZGRXaW5uZXIiLCJwbGFjZSIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhUGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJnZXRDaGlsZEJ5TmFtZSIsIm5hbWUiLCJmaW5kIiwibXlUaW1lIiwidGltZXNVcCIsImRpc2FibGUiLCJhY3RpdmUiLCJzaG93Q3Jvd25zIiwiY3Jvd25zIiwiY29uc29sZSIsImxvZyIsInNob3dXaW5uZXJzIiwiY2xvc2VDcm93bnMiLCJjbG9zZVNwZWN0YXRlIiwiZ29CYWNrVG9Mb2JieSIsImRpc2Nvbm5lY3QiLCJsb2FkU2NlbmUiLCJjb25maXJtVGltZXNVcCIsIm9wZW5TcGVjdGF0ZVVpIiwic2hvd0Vtb2ppcyIsImhpZGVFbW9qaXMiLCJzZXBjdGF0ZVByZXYiLCJuZXdQbGF5ZXIiLCJzcGVjdGF0ZU5leHQiLCJ1cGRhdGUiLCJkdCIsIm15UGxheWVyIiwicGxheWVySWQiXSwibWFwcGluZ3MiOiI7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QWFtQixRQUFiLENBQXNCQyxNQUE3QixHQUFzQyxXQUF2RjtBQUNIO0FBQ0osS0FORCxNQU1PO0FBQ0g7QUFDQTtBQUNBLFVBQUksS0FBSzVCLFNBQVQsRUFBb0I7QUFDaEIsYUFBS0gsTUFBTCxDQUFZMkIsWUFBWixDQUF5QixVQUF6QixFQUFxQ2MsTUFBckMsR0FBOEMsS0FBOUM7QUFDQSxhQUFLekIsZ0JBQUwsQ0FBc0J5QixNQUF0QixHQUErQixLQUEvQjtBQUNIO0FBQ0o7QUFFSjtBQTNISSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGRpc3RhbmNlVGV4dDogY2MuTm9kZSxcclxuICAgICAgICBkaXN0YW5jZTogMCxcclxuICAgICAgICBwbGF5ZXI6IGNjLk5vZGUsXHJcbiAgICAgICAgZm9sbG93aW5nOiBmYWxzZSxcclxuICAgICAgICBlbmRQb3NpdGlvbjogY2MuTm9kZSxcclxuICAgICAgICBnYW1lRW5kZWQ6IGZhbHNlLFxyXG4gICAgICAgIHdpbm5lckNhbnZhOiBjYy5Ob2RlLFxyXG4gICAgICAgIGZpbmlzaGVkUGxheWVyczogY2MuTm9kZSxcclxuICAgICAgICBwbGF5ZXJQcmVmYWI6IGNjLlByZWZhYixcclxuICAgICAgICB0aW1lc1VwVWk6IGNjLk5vZGUsXHJcbiAgICAgICAgc3Bhd246IGNjLk5vZGUsXHJcbiAgICAgICAgY2FtZXJhOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllcnM6IGNjLk5vZGUsXHJcbiAgICAgICAgc3BlY3RhdGVJbmRleDogMCxcclxuICAgICAgICBzcGVjdGF0ZVVJOiBjYy5Ob2RlLFxyXG4gICAgICAgIGVtb2ppQnV0dG9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGVtb2ppVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgbW9iaWxlQ29udHJvbGxlcjogY2MuTm9kZSxcclxuICAgICAgICBudW1GaW5pc2hlZDogY2MuTm9kZSxcclxuICAgICAgICBjcm93bnNOb2RlOiBjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGNjLmdhbWUuc2V0RnJhbWVSYXRlKDYwKTtcclxuICAgICAgICAvL2NjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRGVidWdEcmF3ID0gdHJ1ZTsgXHJcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZERyYXdCb3VuZGluZ0JveCA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFdpbm5lcihwbGF5ZXIsIHBsYWNlKSB7XHJcbiAgICAgICAgdGhpcy5udW1GaW5pc2hlZC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHBsYWNlICsgXCIvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICBsZXQgYVBsYXllciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyUHJlZmFiKTtcclxuICAgICAgICBhUGxheWVyLnBhcmVudCA9IHRoaXMuZmluaXNoZWRQbGF5ZXJzO1xyXG4gICAgICAgIGFQbGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJURVhUXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxheWVyLm5hbWUgKyBcIiBmaW5pc2hlZCBpbiBcIiArIHBsYWNlICsgXCIgcGxhY2UgICBcIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLm15VGltZSArIFwic1wiO1xyXG4gICAgfSxcclxuICAgIHRpbWVzVXAoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuZGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUVuZGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRpbWVzVXBVaS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHNob3dDcm93bnMoY3Jvd25zKSB7XHJcbiAgICAgICAgdGhpcy5jcm93bnNOb2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgY29uc29sZS5sb2coY3Jvd25zKTtcclxuICAgICAgICBpZiAoY3Jvd25zID4gMClcclxuICAgICAgICAgICAgdGhpcy5jcm93bnNOb2RlLmdldENoaWxkQnlOYW1lKFwiQ1JPV05TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCIrIFwiICsgY3Jvd25zO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5jcm93bnNOb2RlLmdldENoaWxkQnlOYW1lKFwiQ1JPV05TXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gY3Jvd25zO1xyXG4gICAgfSxcclxuICAgIHNob3dXaW5uZXJzKGNyb3ducykge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZUNyb3ducygpIHtcclxuICAgICAgICB0aGlzLmNyb3duc05vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgY2xvc2VTcGVjdGF0ZSgpIHtcclxuICAgICAgICB0aGlzLndpbm5lckNhbnZhLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zcGVjdGF0ZVVJLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGdvQmFja1RvTG9iYnkoKSB7XHJcbiAgICAgICAgLy8gZ28gYmFjayB0byBsb2JieVxyXG4gICAgICAgIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJob21lXCIpO1xyXG4gICAgfSxcclxuICAgIGNvbmZpcm1UaW1lc1VwKCkge1xyXG4gICAgICAgIHRoaXMudGltZXNVcFVpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2hvd1dpbm5lcnMoKTtcclxuICAgIH0sXHJcbiAgICBvcGVuU3BlY3RhdGVVaSgpIHtcclxuICAgICAgICB0aGlzLndpbm5lckNhbnZhLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVVSS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHNob3dFbW9qaXMoKSB7XHJcbiAgICAgICAgdGhpcy5lbW9qaUJ1dHRvbi5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBoaWRlRW1vamlzKCkge1xyXG4gICAgICAgIHRoaXMuZW1vamlCdXR0b24uYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgc2VwY3RhdGVQcmV2KCkge1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCAtPTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlY3RhdGVJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICBzcGVjdGF0ZU5leHQoKSB7XHJcbiAgICAgICAgLy8gc3BlY3RhdGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICB0aGlzLnNwZWN0YXRlSW5kZXggKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVjdGF0ZUluZGV4ID49IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRmluaXNoZWQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIjAvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXN0YW5jZSA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLmVuZFBvc2l0aW9uLnggLSB0aGlzLnBsYXllci54KSwgMikgKyBNYXRoLnBvdygodGhpcy5lbmRQb3NpdGlvbi55IC0gdGhpcy5wbGF5ZXIueSksIDIpKSAvIDEwKTtcclxuICAgICAgICAgICAgLy90aGlzLmRpc3RhbmNlVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuZGlzdGFuY2UgKyBcIiBtXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vYmlsZUNvbnRyb2xsZXIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==