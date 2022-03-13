import Events from "../common/EventManager";
import Localization from "../common/Localization";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedFrame extends cc.Component {
  @property(cc.SpriteFrame) private EN: cc.SpriteFrame = null;
  @property(cc.SpriteFrame) private MY: cc.SpriteFrame = null;
  @property(cc.SpriteFrame) private MU: cc.SpriteFrame = null;

  private mSprite: cc.Sprite;
  private mDefaultFrame: cc.SpriteFrame;

  onLoad() {
    Events.registerEvent(Events.EventLanguageChanged, this.localize.bind(this));
    this.mSprite = this.node.getComponent(cc.Sprite);
    this.mDefaultFrame = this.mSprite.spriteFrame;
  }

  onEnable() {
    this.localize();
  }

  private localize() {
    this.mSprite.spriteFrame =
      this[Localization.language.toUpperCase()] || this.mDefaultFrame;
  }
}
