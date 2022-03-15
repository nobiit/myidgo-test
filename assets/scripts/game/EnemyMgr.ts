import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyMgr extends cc.Component {

    @property(cc.Prefab) enemyPrefab: cc.Prefab = null;

    spawn(){
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent(Enemy).init(0, 812);
        this.node.addChild(enemy);
    }
}
