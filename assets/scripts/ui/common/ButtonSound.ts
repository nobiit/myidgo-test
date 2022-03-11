import Events from "../../common/Events";
import FrameMgr from "../../common/FrameMgr";
import SoundMgr from "../../common/SoundMgr";
import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonSound extends cc.Component {
  onLoad() {
    Events.registerEvent(
      Events.EventPlayerToggleSound,
      this.onPlayerToggleSound.bind(this)
    );
    this.getComponent(ButtonClickEvent).registerEvent(this.onClick.bind(this));
  }

  onEnable() {
    this.updateIcon();
  }

  private onPlayerToggleSound() {
    this.updateIcon();
  }

  private onClick() {
    SoundMgr.toggleMute();
    Events.emit(Events.EventPlayerToggleSound);
  }

  private updateIcon() {
    const isMute = SoundMgr.IsMute;
    this.getComponentInChildren(cc.Sprite).spriteFrame =
      FrameMgr.Instance.UI_BUTTON_SOUNDS[Number(isMute)];
  }
}
