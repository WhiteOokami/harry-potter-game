cc.Class({
    extends: cc.Component,

    properties: {
        playerId: null,
        room: null,
        crowns: 0,
        openid: null,
        serverIp: null,
        houseIndex: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    // update (dt) {},
});
