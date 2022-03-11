import PoolMgr, { PoolTypes } from "../common/PoolMgr";
import GameObject from "./GameObject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PooledGameObject extends GameObject {
  @property({ type: PoolTypes }) PoolType: number = 0;

  spawn(parent: cc.Node = null) {
    return PoolMgr.spawn(this.PoolType, parent);
  }

  kill() {
    PoolMgr.kill(this.PoolType, this.node);
  }
}
