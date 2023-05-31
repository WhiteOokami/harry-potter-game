// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gTheme0:"#740001",
        gTheme1:"#D3A625",
        hTheme0:"#FFD800",
        hTheme1:"#000000",
        rTheme0:"#0E1A40",
        rTheme1:"#946B2D",
        sTheme0:"#1A472A",
        sTheme1:"#5D5D5D",
        elements0:[cc.Node],
        elements1:[cc.Node],
        frames:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    changeColor(event,customEventData)
    {
        let i = parseInt(customEventData);
        if(i>3) i=0;
        this.node.getComponent("aboutPlayer").houseIndex = i;
        for (let index = 0; index < this.frames.length; index++) {this.frames[index].getComponent(cc.Sprite).enabled = false;}
        this.frames[i].getComponent(cc.Sprite).enabled = true;
        switch (i) {
            case 0:
                for (let index = 0; index < this.elements0.length; index++) {this.elements0[index].color = new cc.Color().fromHEX(this.gTheme0)};
                for (let index = 0; index < this.elements1.length; index++) {this.elements1[index].color = new cc.Color().fromHEX(this.gTheme1)};
                break;
            case 1:
                for (let index = 0; index < this.elements0.length; index++) {this.elements0[index].color = new cc.Color().fromHEX(this.hTheme0)};
                for (let index = 0; index < this.elements1.length; index++) {this.elements1[index].color = new cc.Color().fromHEX(this.hTheme1)};
                break;
            case 2:
                for (let index = 0; index < this.elements0.length; index++) {this.elements0[index].color = new cc.Color().fromHEX(this.rTheme0)};
                for (let index = 0; index < this.elements1.length; index++) {this.elements1[index].color = new cc.Color().fromHEX(this.rTheme1)};
                break;
            case 3:
                for (let index = 0; index < this.elements0.length; index++) {this.elements0[index].color = new cc.Color().fromHEX(this.sTheme0)};
                for (let index = 0; index < this.elements1.length; index++) {this.elements1[index].color = new cc.Color().fromHEX(this.sTheme1)};
                break;
        }

        cc.find("Lobby Manager").getComponent("lobby").changeHouse(i);
    }
});
