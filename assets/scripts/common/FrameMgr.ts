import SingletonComponent from "../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FrameMgr extends SingletonComponent<FrameMgr>() {
  @property(cc.SpriteFrame) UI_GIFT_ICON_DEFAULT: cc.SpriteFrame = null;
  @property(cc.SpriteFrame) GAME_GIFT_BOX_ICONS: Array<cc.SpriteFrame> = [];
  @property(cc.SpriteFrame) GAME_PLAYER_BULLETS: Array<cc.SpriteFrame> = [];

  @property(cc.SpriteFrame) RewardSpriteFrames: cc.SpriteFrame[] = [];

  static getRewardSpriteFrameFromRewardCode(rewardType: string) {
    switch (rewardType) {
      case "Bưởi":
        return FrameMgr.Instance.RewardSpriteFrames[14];
      case "Chuối xanh":
        return FrameMgr.Instance.RewardSpriteFrames[10];
      case "Quýt đỏ":
        return FrameMgr.Instance.RewardSpriteFrames[12];
      case "Thanh Long":
        return FrameMgr.Instance.RewardSpriteFrames[13];
      case "Đu đủ":
        return FrameMgr.Instance.RewardSpriteFrames[11];
      case "Hoa Cúc":
        return FrameMgr.Instance.RewardSpriteFrames[5];
      case "Hoa Hải đường":
        return FrameMgr.Instance.RewardSpriteFrames[7];
      case "Hoa Mai":
        return FrameMgr.Instance.RewardSpriteFrames[9];
      case "Hoa lan":
        return FrameMgr.Instance.RewardSpriteFrames[8];
      case "Hoa Đào":
        return FrameMgr.Instance.RewardSpriteFrames[6];
      case "Bánh chưng":
        return FrameMgr.Instance.RewardSpriteFrames[0];
      case "Giò lụa":
        return FrameMgr.Instance.RewardSpriteFrames[2];
      case "Gà luộc":
        return FrameMgr.Instance.RewardSpriteFrames[1];
      case "Khổ qua nhồi thịt":
        return FrameMgr.Instance.RewardSpriteFrames[3];
      case "Nem":
        return FrameMgr.Instance.RewardSpriteFrames[4];
      default:
        if(rewardType.includes("Sao")) {
          return FrameMgr.Instance.RewardSpriteFrames[15];
        } else if(rewardType.includes("Lượt")) {
          return FrameMgr.Instance.RewardSpriteFrames[16];
        } else {
          return FrameMgr.Instance.RewardSpriteFrames[17];
        }
    }
  }
}
