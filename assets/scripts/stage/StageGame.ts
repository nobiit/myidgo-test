const { ccclass, property } = cc._decorator;
import SoundMgr from "../common/SoundMgr";
import GameMgr from "../game/GameMgr";
import UIMgr, { UIs } from "../ui/UIMgr";
import Stage from "./Stage";

@ccclass
export default class StageGame extends Stage {
  @property(cc.Prefab) private GameMgrPrefab: cc.Prefab = null;

  onLoad() {
    super.onLoad();

    this.callbackEndSession = _=>{GameMgr.Instance.pause();}
    this.node.addChild(cc.instantiate(this.GameMgrPrefab));
  }

  init() {
    super.init();

    UIMgr.show(UIs.UIGame);
    GameMgr.Instance.startGame();
    SoundMgr.stopMusic();
    SoundMgr.playMusic(SoundMgr.Instance.BGM, true);
  }
}
