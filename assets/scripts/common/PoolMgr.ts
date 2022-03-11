import GameDefine from "../game/GameDefine";
import SingletonComponent from "../utils/SingletonComponent";
import Pool from "./Pool";

export const PoolTypes = cc.Enum({
  ITEM_STAR: GameDefine.GAME_OBJECT_TYPES.ITEM_STAR,
  ITEM_GIFT: GameDefine.GAME_OBJECT_TYPES.ITEM_GIFT,
  ITEM_INVINCIBLE: GameDefine.GAME_OBJECT_TYPES.ITEM_INVINCIBLE,
  ITEM_WEAPON_DOUBLE: GameDefine.GAME_OBJECT_TYPES.ITEM_WEAPON_DOUBLE,
  BULLET_PLAYER_NORMAL: GameDefine.GAME_OBJECT_TYPES.BULLET_PLAYER_NORMAL,
  BULLET_BOSS_NORMAL: GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_NORMAL,
  BULLET_BOSS_MISSLE: GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE,
  BULLET_BOSS_MISSLE_ICE: GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE_ICE,
  BULLET_BOSS_MISSLE_THUNDER:
    GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE_THUNDER,
  BULLET_BOSS_03: GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_03,
  BULLET_BOSS_05: GameDefine.GAME_OBJECT_TYPES.BULLET_BOSS_05,
  ENEMY_01: GameDefine.GAME_OBJECT_TYPES.ENEMY_01,
  ENEMY_02: GameDefine.GAME_OBJECT_TYPES.ENEMY_02,
  ENEMY_03: GameDefine.GAME_OBJECT_TYPES.ENEMY_03,
  ENEMY_04: GameDefine.GAME_OBJECT_TYPES.ENEMY_04,
  ENEMY_05: GameDefine.GAME_OBJECT_TYPES.ENEMY_05,
  ENEMY_BOSS_01: GameDefine.GAME_OBJECT_TYPES.ENEMY_BOSS_01,
  ENEMY_BOSS_02: GameDefine.GAME_OBJECT_TYPES.ENEMY_BOSS_02,
  ENEMY_BOSS_03: GameDefine.GAME_OBJECT_TYPES.ENEMY_BOSS_03,
  ENEMY_BOSS_04: GameDefine.GAME_OBJECT_TYPES.ENEMY_BOSS_04,
  ENEMY_BOSS_05: GameDefine.GAME_OBJECT_TYPES.ENEMY_BOSS_05,
  OBSTACLE_FIREBALL: GameDefine.GAME_OBJECT_TYPES.OBSTACLE_FIREBALL,
  FIREBALL_INDICATOR: GameDefine.GAME_OBJECT_TYPES.FIREBALL_INDICATOR,
  EFFECT_ENEMY_DIE: GameDefine.GAME_OBJECT_TYPES.EFFECT_ENEMY_DIE,
  EFFECT_COLLECT_ITEM: GameDefine.GAME_OBJECT_TYPES.EFFECT_COLLECT_ITEM,
  EFFECT_BOSS_DIE: GameDefine.GAME_OBJECT_TYPES.EFFECT_BOSS_DIE,
  EFFECT_BOSS_02_ATTACK: GameDefine.GAME_OBJECT_TYPES.EFFECT_BOSS_02_ATTACK,
});

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolMgr extends SingletonComponent<PoolMgr>() {
  private mPools: Record<number, Pool>;

  static spawn(type: number, parent: cc.Node): cc.Node {
    return this.Instance.getPool(type).spawn(parent);
  }

  static kill(type: number, node: cc.Node) {
    return this.Instance.getPool(type).kill(node);
  }

  onLoad() {
    super.onLoad();
    this.mPools = {};
    for (const node of this.node.children) {
      const pool = node.getComponent(Pool);
      this.mPools[pool.Type] = pool;
    }
  }

  init() {
    for (let key in this.mPools) {
      this.mPools[key].init();
    }
  }

  getPool(type: number) {
    return this.mPools[type];
  }
}
