import GameMgr from "../../game/GameMgr";
import Helper from "../../utils/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class McEmotion extends cc.Component {
  @property(String) private Emotions: Array<string> = [];
  @property(cc.Boolean) private IsEndScreen: boolean = false;

  onEnable() {
    // 'CRY', 'IDLE', 'SAD', 'STUN', 'SURPRISE'
    if (!this.IsEndScreen) {
      this.getComponent(sp.Skeleton).setAnimation(
        0,
        Helper.RandArray(this.Emotions),
        true
      );
    } else {
      const animName =
        GameMgr.Instance.LevelMgr.SpawnedLevelCount == 1
          ? "STUN"
          : Helper.RandArray(this.Emotions);
      this.getComponent(sp.Skeleton).setAnimation(0, animName, true);
    }
  }
}
