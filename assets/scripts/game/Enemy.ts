enum STATE {
    MOVE,
    NONE
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    @property() speed: number = 2;
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

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == "shield bar") {
            console.log('1111111111')
            self.getComponent(Enemy).stop()
        }
        else{
            console.log(other.node.group)
        }
    }
}
