import StageMgr from "../stage/StageMgr";
import Enemy from "./Enemy";

enum STATE {
    MOVE,
    NONE
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property() speed: number = 0;

    private state = STATE.MOVE;

    // LIFE-CYCLE CALLBACKS:

    init(x:number, y:number){
        this.state = STATE.MOVE;
        this.node.setPosition(x, y);
    }

    update (dt) {
        if(this.state == STATE.MOVE){
            if(this.isOutOfCanvas()){
                this.state = STATE.NONE;
                this.node.parent.removeChild(this.node, true);
            }
            this.node.y += this.speed*dt;
        }
    }

    private isOutOfCanvas():boolean{
        return this.node.y > StageMgr.Instance.CanvasHeight/2 + this.node.height/2
    }
}
