
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
    this.emojiButton.active = !this.emojiButton.active;
    this.emojiUI.active = !this.emojiUI.active;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcY29kZVxcZ2FtZU1hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXN0YW5jZVRleHQiLCJOb2RlIiwiZGlzdGFuY2UiLCJwbGF5ZXIiLCJmb2xsb3dpbmciLCJlbmRQb3NpdGlvbiIsImdhbWVFbmRlZCIsIndpbm5lckNhbnZhIiwiZmluaXNoZWRQbGF5ZXJzIiwicGxheWVyUHJlZmFiIiwiUHJlZmFiIiwidGltZXNVcFVpIiwic3Bhd24iLCJjYW1lcmEiLCJwbGF5ZXJzIiwic3BlY3RhdGVJbmRleCIsInNwZWN0YXRlVUkiLCJlbW9qaUJ1dHRvbiIsImVtb2ppVUkiLCJtb2JpbGVDb250cm9sbGVyIiwibnVtRmluaXNoZWQiLCJjcm93bnNOb2RlIiwib25Mb2FkIiwiZGlyZWN0b3IiLCJnZXRDb2xsaXNpb25NYW5hZ2VyIiwiZW5hYmxlZCIsImdhbWUiLCJzZXRGcmFtZVJhdGUiLCJhZGRXaW5uZXIiLCJwbGFjZSIsImdldENvbXBvbmVudCIsIkxhYmVsIiwic3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJhUGxheWVyIiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJnZXRDaGlsZEJ5TmFtZSIsIm5hbWUiLCJmaW5kIiwibXlUaW1lIiwidGltZXNVcCIsImRpc2FibGUiLCJhY3RpdmUiLCJzaG93Q3Jvd25zIiwiY3Jvd25zIiwiY29uc29sZSIsImxvZyIsInNob3dXaW5uZXJzIiwiY2xvc2VDcm93bnMiLCJjbG9zZVNwZWN0YXRlIiwiZ29CYWNrVG9Mb2JieSIsImRpc2Nvbm5lY3QiLCJsb2FkU2NlbmUiLCJjb25maXJtVGltZXNVcCIsIm9wZW5TcGVjdGF0ZVVpIiwic2hvd0Vtb2ppcyIsInNlcGN0YXRlUHJldiIsIm5ld1BsYXllciIsInNwZWN0YXRlTmV4dCIsInVwZGF0ZSIsImR0IiwibXlQbGF5ZXIiLCJwbGF5ZXJJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7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VCxFQUFvQjtBQUNoQixhQUFLSCxNQUFMLENBQVkyQixZQUFaLENBQXlCLFVBQXpCLEVBQXFDYyxNQUFyQyxHQUE4QyxLQUE5QztBQUNBLGFBQUt6QixnQkFBTCxDQUFzQnlCLE1BQXRCLEdBQStCLEtBQS9CO0FBQ0g7QUFDSjtBQUVKO0FBdkhJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgZGlzdGFuY2VUZXh0OiBjYy5Ob2RlLFxyXG4gICAgICAgIGRpc3RhbmNlOiAwLFxyXG4gICAgICAgIHBsYXllcjogY2MuTm9kZSxcclxuICAgICAgICBmb2xsb3dpbmc6IGZhbHNlLFxyXG4gICAgICAgIGVuZFBvc2l0aW9uOiBjYy5Ob2RlLFxyXG4gICAgICAgIGdhbWVFbmRlZDogZmFsc2UsXHJcbiAgICAgICAgd2lubmVyQ2FudmE6IGNjLk5vZGUsXHJcbiAgICAgICAgZmluaXNoZWRQbGF5ZXJzOiBjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXllclByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgICAgIHRpbWVzVXBVaTogY2MuTm9kZSxcclxuICAgICAgICBzcGF3bjogY2MuTm9kZSxcclxuICAgICAgICBjYW1lcmE6IGNjLk5vZGUsXHJcbiAgICAgICAgcGxheWVyczogY2MuTm9kZSxcclxuICAgICAgICBzcGVjdGF0ZUluZGV4OiAwLFxyXG4gICAgICAgIHNwZWN0YXRlVUk6IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlCdXR0b246IGNjLk5vZGUsXHJcbiAgICAgICAgZW1vamlVSTogY2MuTm9kZSxcclxuICAgICAgICBtb2JpbGVDb250cm9sbGVyOiBjYy5Ob2RlLFxyXG4gICAgICAgIG51bUZpbmlzaGVkOiBjYy5Ob2RlLFxyXG4gICAgICAgIGNyb3duc05vZGU6IGNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY2MuZ2FtZS5zZXRGcmFtZVJhdGUoNjApO1xyXG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWREZWJ1Z0RyYXcgPSB0cnVlOyBcclxuICAgICAgICAvL2NjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRHJhd0JvdW5kaW5nQm94ID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgYWRkV2lubmVyKHBsYXllciwgcGxhY2UpIHtcclxuICAgICAgICB0aGlzLm51bUZpbmlzaGVkLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gcGxhY2UgKyBcIi9cIiArIHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGggKyBcIiBmaW5pc2hlZFwiO1xyXG4gICAgICAgIGxldCBhUGxheWVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJQcmVmYWIpO1xyXG4gICAgICAgIGFQbGF5ZXIucGFyZW50ID0gdGhpcy5maW5pc2hlZFBsYXllcnM7XHJcbiAgICAgICAgYVBsYXllci5nZXRDaGlsZEJ5TmFtZShcIlRFWFRcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBwbGF5ZXIubmFtZSArIFwiIGZpbmlzaGVkIGluIFwiICsgcGxhY2UgKyBcIiBwbGFjZSAgIFwiICsgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikubXlUaW1lICsgXCJzXCI7XHJcbiAgICB9LFxyXG4gICAgdGltZXNVcCgpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJtb3ZlbWVudFwiKS5kaXNhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lRW5kZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudGltZXNVcFVpLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Nyb3ducyhjcm93bnMpIHtcclxuICAgICAgICB0aGlzLmNyb3duc05vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjcm93bnMpO1xyXG4gICAgICAgIGlmIChjcm93bnMgPiAwKVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIisgXCIgKyBjcm93bnM7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmNyb3duc05vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJDUk9XTlNcIikuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjcm93bnM7XHJcbiAgICB9LFxyXG4gICAgc2hvd1dpbm5lcnMoY3Jvd25zKSB7XHJcbiAgICAgICAgdGhpcy53aW5uZXJDYW52YS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNsb3NlQ3Jvd25zKCkge1xyXG4gICAgICAgIHRoaXMuY3Jvd25zTm9kZS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBjbG9zZVNwZWN0YXRlKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgZ29CYWNrVG9Mb2JieSgpIHtcclxuICAgICAgICAvLyBnbyBiYWNrIHRvIGxvYmJ5XHJcbiAgICAgICAgY2MuZmluZChcInN5c3RlbVwiKS5nZXRDb21wb25lbnQoXCJjbGllbnRcIikuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhvbWVcIik7XHJcbiAgICB9LFxyXG4gICAgY29uZmlybVRpbWVzVXAoKSB7XHJcbiAgICAgICAgdGhpcy50aW1lc1VwVWkuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaG93V2lubmVycygpO1xyXG4gICAgfSxcclxuICAgIG9wZW5TcGVjdGF0ZVVpKCkge1xyXG4gICAgICAgIHRoaXMud2lubmVyQ2FudmEuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcGVjdGF0ZVVJLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgc2hvd0Vtb2ppcygpIHtcclxuICAgICAgICB0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZSA9ICF0aGlzLmVtb2ppQnV0dG9uLmFjdGl2ZTtcclxuICAgICAgICB0aGlzLmVtb2ppVUkuYWN0aXZlID0gIXRoaXMuZW1vamlVSS5hY3RpdmU7XHJcbiAgICB9LFxyXG4gICAgc2VwY3RhdGVQcmV2KCkge1xyXG4gICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCAtPTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BlY3RhdGVJbmRleCA8IDApXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgtMTtcclxuXHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICBzcGVjdGF0ZU5leHQoKSB7XHJcbiAgICAgICAgLy8gc3BlY3RhdGUgbmV4dCBwbGF5ZXJcclxuICAgICAgICB0aGlzLnNwZWN0YXRlSW5kZXggKz0gMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVjdGF0ZUluZGV4ID49IHRoaXMucGxheWVycy5jaGlsZHJlbi5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuc3BlY3RhdGVJbmRleCA9IDA7XHJcbiAgICAgICAgbGV0IG5ld1BsYXllciA9IHRoaXMucGxheWVycy5jaGlsZHJlblt0aGlzLnNwZWN0YXRlSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLmdldENvbXBvbmVudChcImNhbWVyYUZvbGxvd1wiKS5wbGF5ZXIgPSBuZXdQbGF5ZXI7XHJcbiAgICAgICAgLy8gY2hhbmdlIHNwZWN0YXRpbmcgcGxheWVyIG5hbWVcclxuICAgICAgICB0aGlzLnNwZWN0YXRlVUkuZ2V0Q2hpbGRCeU5hbWUoXCJOQU1FXCIpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJTcGVjdGF0aW5nIFwiICsgbmV3UGxheWVyLmdldENoaWxkQnlOYW1lKFwibmFtZVRhZ1wiKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZztcclxuICAgIH0sXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuZm9sbG93aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChjYy5maW5kKFwic3lzdGVtXCIpLmdldENvbXBvbmVudChcImNsaWVudFwiKS5teVBsYXllciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9IGNjLmZpbmQoXCJDYW52YXMvUGxheWVycy9cIiArIGNjLmZpbmQoXCJzeXN0ZW1cIikuZ2V0Q29tcG9uZW50KFwiY2xpZW50XCIpLnBsYXllcklkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubnVtRmluaXNoZWQuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIjAvXCIgKyB0aGlzLnBsYXllcnMuY2hpbGRyZW4ubGVuZ3RoICsgXCIgZmluaXNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXN0YW5jZSA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLmVuZFBvc2l0aW9uLnggLSB0aGlzLnBsYXllci54KSwgMikgKyBNYXRoLnBvdygodGhpcy5lbmRQb3NpdGlvbi55IC0gdGhpcy5wbGF5ZXIueSksIDIpKSAvIDEwKTtcclxuICAgICAgICAgICAgLy90aGlzLmRpc3RhbmNlVGV4dC5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IHRoaXMuZGlzdGFuY2UgKyBcIiBtXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVFbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KFwibW92ZW1lbnRcIikuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vYmlsZUNvbnRyb2xsZXIuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiJdfQ==