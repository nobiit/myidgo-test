// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const COLOR_LIST = [
    cc.Color.BLUE,
    cc.Color.GRAY,
    cc.Color.GREEN,
    cc.Color.RED,
    cc.Color.BLACK,
    cc.Color.YELLOW,
]
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
    @property(cc.Node) private sprite: cc.Node;

    private indexColor:number = -1;

    // LIFE-CYCLE CALLBACKS:
    init(indexColor:number){
        this.indexColor = indexColor;
        this.sprite.color = COLOR_LIST[indexColor];
    }

    setPos(x:number, y:number){
        this.node.setPosition(x, y);
    }

    // update (dt) {}
}
