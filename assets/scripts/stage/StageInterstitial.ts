import SoundMgr from "../common/SoundMgr";
import UIMgr, { UIs } from "../ui/UIMgr";
import Stage from "./Stage";
import StageMgr, { Stages } from "./StageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageInterstitial extends Stage {
  @property(cc.Label) private lblPlay: cc.Label = null;

  onLoad(): void {
    this.lblPlay.node.on(cc.Node.EventType.TOUCH_END, () => {
      StageMgr.show(Stages.StageGame)
    });
  }

  init() {
    // super.init();
    
    // UIMgr.show(UIs.UIInterstitial);
    // SoundMgr.stopMusic();
    // SoundMgr.playMusic(SoundMgr.Instance.BGM_MENU, true);
  }
}
