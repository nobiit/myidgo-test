const { ccclass, property } = cc._decorator;
import SoundMgr from "../common/SoundMgr";
import Board from "../game/Board";
import EnemyMgr from "../game/EnemyMgr";
import GameMgr from "../game/GameMgr";
import UIMgr, { UIs } from "../ui/UIMgr";
import Stage from "./Stage";

@ccclass
export default class StageGame extends Stage {
  @property(Board) private board: Board = null;
  @property(EnemyMgr) private enemyMgr: EnemyMgr = null;
  // @property() private enemyMgr: EnemyMgr = null;
  @property() private spawnEnemyDuration: number = 2;

  private spawnEnemyTimer:number = 0;
  onLoad() {
    super.onLoad();

    // this.callbackEndSession = _=>{GameMgr.Instance.pause();}
    // this.node.addChild(cc.instantiate(this.GameMgrPrefab));
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
    manager.enabledDebugDraw = true;
    manager.enabledDrawBoundingBox = true;
  }

  init() {
    super.init();

    this.board.init(this.enemyMgr);
    this.spawnEnemyTimer = this.spawnEnemyDuration;

    this.enemyMgr.spawn();

    // UIMgr.show(UIs.UIGame);
    // GameMgr.Instance.startGame();
    // SoundMgr.stopMusic();
    // SoundMgr.playMusic(SoundMgr.Instance.BGM, true);
  }

  protected update(dt: number): void {
    if(this.spawnEnemyTimer > 0){
      this.spawnEnemyTimer = Math.max(this.spawnEnemyTimer-dt, 0);
      if(this.spawnEnemyTimer == 0){
        this.spawnEnemyTimer = this.spawnEnemyDuration;
        this.enemyMgr.spawn();
      }
    }
  }
}
