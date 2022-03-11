import FrameMgr from "../../common/FrameMgr";
import Localization from "../../common/Localization";
import GameDefine from "../../game/GameDefine";
import { IBossReward } from "../../interface/boss-reward-response";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndscreenGift extends cc.Component {
  @property(cc.Sprite) private Sprite: cc.Sprite = null;
  @property(cc.Label) private TextDesc: cc.Label = null;

  init(data: IBossReward) {
    const rewardKey = GameDefine.getRewardKey(data);
    this.Sprite.spriteFrame =
      FrameMgr.Instance[`GAME_END_SCREEN_GIFT_${rewardKey}`];
    this.TextDesc.string = data.description;

    if (data.prizeType == "CARD" || data.code == "PREMIUM_CARD_8") {
      const animalIndex = Number(data.code.charAt(data.code.length - 1)) - 1;
      this.Sprite.spriteFrame =
        FrameMgr.Instance.GAME_ANIMAL_ICONS[animalIndex];
      this.TextDesc.string = Localization.GetLocalizedString(
        `ANIMAL_${rewardKey}`
      );
    }
  }
}
