import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletMgr extends cc.Component {
    @property(cc.Prefab) bulletPrefab: cc.Prefab = null;
    @property() poolSize: number = 0;

    spawn(x, y){
        let b = cc.instantiate(this.bulletPrefab);
        b.getComponent(Bullet).init(x, y);
        b.setParent(this.node);
    }
}
