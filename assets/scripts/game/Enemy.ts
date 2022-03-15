enum STATE {
    MOVE,
    NONE
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    @property() speed: number = 100;
    private state:number = STATE.NONE;

    init(x:number, y:number){
        this.state = STATE.MOVE;
        this.node.setPosition(x, y);
    }

    update(dt){
        if(this.state == STATE.MOVE){
            this.node.y -= this.speed*dt;
        }
    }

    stop(){
        this.state = STATE.NONE;
    }

    die(){
        this.node.parent.removeChild(this.node, true);
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == "shield bar") {
            this.stop()
        }
        else if(other.node.group == "bullet"){
            this.die();
        }
    }
}
