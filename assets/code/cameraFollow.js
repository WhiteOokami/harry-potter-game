let player = null;

cc.Class({
    extends: cc.Component,

    properties: {
        player: null,
        following: false,
        // background: cc.Node,
        ui: cc.Node,
        // paralaxLayers: [cc.Node],
        startPos: [],
        xOffsetPlayer: 0,
        maxOffset: 50,
        startY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startPos = [0, 0, 0, 0, 0, 0, 0];
    },


    update(dt) {
        if (!this.following) {
            if (cc.find("system").getComponent("client").myPlayer != null) {
                this.player = cc.find("Canvas/Players/" + cc.find("system").getComponent("client").playerId);
                this.following = true;
            }
        } else {
            let m = this.player.getComponent("movement")
            if(m.movingRight && this.xOffsetPlayer < this.maxOffset)
                this.xOffsetPlayer += 40*dt
            else if(m.movingLeft && this.xOffsetPlayer > -this.maxOffset)
                this.xOffsetPlayer -= 40*dt
            else
                this.xOffsetPlayer/=2
            this.node.x = this.player.x + this.xOffsetPlayer;
            this.node.y = this.startY + (this.player.y=this.startY)/2;
        }
        // for (let i = 0; i < this.paralaxLayers.length; i++) {
        //     this.paralaxLayers[i].setPosition(this.node.x / (i + 1) * 2 + this.startPos[i], this.node.y / (i + 1) * 2);

        //     if (Math.abs(this.node.x - this.paralaxLayers[i].x) >= (this.paralaxLayers[i].width - this.node.width)) {
        //         //this.paralaxLayers[i].setPosition(this.node.x + (this.node.x - this.paralaxLayers[i].x), this.node.y);
        //         this.startPos[i] += this.node.x - this.paralaxLayers[i].x;
        //     }
        // }
        // this.background.setPosition(this.node.x, this.node.y);
        // this.ui.x = this.node.x;
        // this.ui.y = this.node.y;
    },
});
