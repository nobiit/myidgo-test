import SoundMgr from "../common/SoundMgr";
import UIMgr, { UIs } from "../ui/UIMgr";
import Stage from "./Stage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageInterstitial extends Stage {
  init() {
    super.init();
    
    UIMgr.show(UIs.UIInterstitial);
    SoundMgr.stopMusic();
    SoundMgr.playMusic(SoundMgr.Instance.BGM_MENU, true);
  }
}
