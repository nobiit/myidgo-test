import APIMgr from "../common/APIMgr";
import Events from "../common/Events";
import Localization from "../common/Localization";
import ProfileMgr from "../common/ProfileMgr";
import SoundMgr from "../common/SoundMgr";
import GameDefine, { ENABLE_LOG } from "../game/GameDefine";
import GameMgr from "../game/GameMgr";
// import PopupNotification from "../popup/PopupNotification";
import StageMgr, { Stages } from "../stage/StageMgr";
import Helper from "../utils/Helper";
import ButtonClickEvent from "./common/ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIInterstitial extends cc.Component {
  @property(sp.Skeleton) private SpineMC: sp.Skeleton = null;
  @property(cc.Vec2) private WaterPositions: Array<cc.Vec2> = [];
  @property(sp.Skeleton) private SpineWater: sp.Skeleton = null;
  @property(ButtonClickEvent) private ButtonExit: ButtonClickEvent = null;
  @property(ButtonClickEvent) private ButtonAddTurn: ButtonClickEvent = null;
  @property(ButtonClickEvent) private ButtonPlay: ButtonClickEvent = null;
  @property(cc.Label) private TextTurn: cc.Label = null;
  @property(cc.Label) private TextRemainingTurn: cc.Label = null;
  @property(ButtonClickEvent) private ButtonCollection: ButtonClickEvent = null;

  private mShouldCallGetStar: boolean = false;
  private mShouldCallGetGun: boolean = true;

  private isLogged:boolean = false;
  private remainingturn:number = 0;
  private dailyRemain: number = 0;
  private expiredDate:Date = new Date(Date.UTC(2022, 2, 8, 0, 0, 0, 0)); // 0h 08/03/2022
  private intervalGetBalance = null;

  onLoad() {
  }

  onEnable() {
    let currentDate = new Date();
    if(currentDate.getTime() >= this.expiredDate.getTime()) {
      this.ButtonCollection.node
        .getChildByName("Background")
        .getComponent(cc.Sprite)
        .setMaterial(0, cc.MaterialVariant.getBuiltinMaterial('2d-gray-sprite'))
    }

    this.intervalGetBalance = setInterval(()=>{
      Events.emit(Events.EventPlayerTurnChanged);
    }, 10000)
  }
}
