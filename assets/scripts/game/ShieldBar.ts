const {ccclass, property} = cc._decorator;

@ccclass
export default class ShieldBar extends cc.Component {
    @property(cc.Label) lblHP: cc.Label = null;

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        // if (other.node.group == "enemy") {
        //     console.log('enemyyyyyyyyyyyyyyyyyyyy')
        // }
        // else{
        //     console.log(other.node.group)
        // }
    }
}
