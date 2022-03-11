import GameDefine from "../game/GameDefine";
import Helper from "../utils/Helper";
import { PoolTypes } from "./PoolMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Pool extends cc.Component {
  get CurrentSize() {
    return this.mCurrentSize;
  }

  @property({ type: PoolTypes }) Type: number = 0;
  @property(cc.Prefab) private Prefab: cc.Prefab = null;
  @property(cc.Boolean) private ShouldExpand: boolean = false;
  @property(cc.Boolean) private KillExpand: boolean = false;

  private mPoolSize: number;
  private mCurrentSize: number;
  private mInstantiatedObjects: Array<cc.Node>;

  onLoad() {
    this.mInstantiatedObjects = [];
    this.mPoolSize =
      GameDefine.QTY_POOLS[this.Type] || GameDefine.QTY_POOL_DEFAULT;
    this.mCurrentSize = 0;

    for (let i = 0; i < this.mPoolSize; i++) {
      this.mInstantiatedObjects.push(this.instantiate());
    }
  }

  init() {
    for (let i = 0; i < this.mInstantiatedObjects.length; i++) {
      this.mInstantiatedObjects[i].active = false;
    }
  }

  spawn(parent: cc.Node = null) {
    const node = this.getAvailable();
    if (node) {
      node.setParent(parent || this.node);
      node.active = true;
    }

    return node;
  }

  kill(node: cc.Node) {
    node.active = false;

    if (this.mInstantiatedObjects.length > this.mPoolSize && this.KillExpand) {
      const index = this.mInstantiatedObjects.indexOf(node);
      this.mInstantiatedObjects.splice(index, 1);
      node.destroy();
      this.mCurrentSize--;
    } else {
      node.setParent(this.node);
    }
  }

  private getAvailable() {
    let obj = null;

    for (let i = 0; i < this.mInstantiatedObjects.length; i++) {
      if (!this.mInstantiatedObjects[i].active) {
        obj = this.mInstantiatedObjects[i];
        break;
      }
    }

    if (!obj) {
      if (this.ShouldExpand) {
        obj = this.instantiate();
        this.mInstantiatedObjects.push(obj);
      } else {
        if (GameDefine.SHOW_GAME_DEBUG) {
          console.warn(`${this.Prefab.name} out of pool.`);
        }
      }
    }

    return obj;
  }

  private instantiate() {
    const obj = cc.instantiate(this.Prefab);
    obj.active = false;
    obj.setParent(this.node);
    this.mCurrentSize++;

    return obj;
  }
}
