import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyMgr extends cc.Component {

    @property(cc.Prefab) enemyPrefab: cc.Prefab = null;

    spawn(){
        let posXs = [-375/4, 0, 375/4]
        posXs.forEach(element => {
            let enemy = cc.instantiate(this.enemyPrefab);
            enemy.getComponent(Enemy).init(element, 812/2);
            this.node.addChild(enemy);
        });
        
    }
}
