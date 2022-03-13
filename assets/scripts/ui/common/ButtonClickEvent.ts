import APIMgr from "../../common/APIMgr";
import Events from "../../common/EventManager";
import SoundMgr from "../../common/SoundMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonClickEvent extends cc.Component {
  @property(cc.Float) ClickInterval: number = 0.5; //-1: one time click

  get Interactive() {
    return this.mInteractive;
  }
  set Interactive(value) {
    this.mInteractive = value;
  }

  private mInteractive: boolean;
  private mTimer: number;
  private mPlaySfx: boolean;

  registerEvent(callback, playSfx: boolean = true) {
    this.mPlaySfx = playSfx;
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      this.onClick(callback);

      Events.emit(Events.EventResetSession);
    });
  }

  onEnable() {
    this.mInteractive = true;
    this.mTimer = this.ClickInterval;
  }

  update(dt) {
    if (this.ClickInterval != -1) {
      if (!this.mInteractive) {
        this.mTimer -= dt;
        if (this.mTimer < 0) {
          this.mInteractive = true;
          this.mTimer = this.ClickInterval;
        }
      }
    }
  }

  private onClick(callback: Function) {
    APIMgr.Instance.gameAction();
    if (this.mPlaySfx) {
      SoundMgr.playSfx(SoundMgr.Instance.SFX_CLICK);
    }
    if (!this.mInteractive) {
      return;
    }
    this.mInteractive = false;

    callback();
  }
}
