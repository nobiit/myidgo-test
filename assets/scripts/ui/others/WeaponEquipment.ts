import Events from "../../common/Events";
import ProfileMgr from "../../common/ProfileMgr";
import SoundMgr from "../../common/SoundMgr";
import ButtonClickEvent from "../common/ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeaponEquipment extends cc.Component {
  @property(cc.Node) private SpriteGuns: Array<cc.Node> = [];
  @property(cc.Node) private CheckboxBgs: Array<cc.Node> = [];
  @property(cc.Node) private SpriteEquippeds: Array<cc.Node> = [];
  @property(cc.Label) private TextQuantities: Array<cc.Label> = [];
  @property(ButtonClickEvent) private ButtonEquips: Array<ButtonClickEvent> =
    [];
  @property(ButtonClickEvent) private ButtonPluses: Array<ButtonClickEvent> =
    [];

  onLoad() {
    for (let i = 0; i < this.ButtonEquips.length; i++) {
      this.ButtonEquips[i].registerEvent(this.onEquip.bind(this, i), false);
      this.ButtonPluses[i].registerEvent(this.onPlus.bind(this, i));
    }
  }

  onEnable() {
    this.init();
  }

  init() {
    const weaponRemainTimes = ProfileMgr.Instance.WeaponRemainTimes;
    for (let i = 0; i < this.TextQuantities.length; i++) {
      this.TextQuantities[i].string = weaponRemainTimes[i].toString();
    }

    this.updateSprites(ProfileMgr.Instance.WeaponLevel - 1);
  }

  private updateSprites(index: number) {
    for (let i = 0; i < this.ButtonEquips.length; i++) {
      this.CheckboxBgs[i] && (this.CheckboxBgs[i].active = i == index);
      this.SpriteEquippeds[i].active = i == index;
      this.SpriteGuns[i].setScale(i == index ? 1.3 : 1);
    }
  }

  private onEquip(index: number) {
    const weaponRemainTimes = ProfileMgr.Instance.WeaponRemainTimes;
    if (weaponRemainTimes[index] > 0) {
      this.updateSprites(index);
      Events.emit(Events.EventPlayerChangeWeapon, index);
    } else {
      this.onPlus(index);
    }

    SoundMgr.playSfx(SoundMgr.Instance.SFX_BUTTON_02);
  }

  private onPlus(index: number) {
    // const popup = PopupMgr.push(Popups.PopupBuyWeapon);
    // popup.getComponent(PopupBuyWeapon).init(index);
    // popup.getComponent(PopupBuyWeapon).setHideCallback(() => {
    //   this.init();
    // });
  }
}
