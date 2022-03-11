import FrameMgr from "../../common/FrameMgr";
import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CompTabView extends cc.Component {
  @property(cc.Integer) private DefaultTab: number = 0;
  @property([cc.String]) private ButtonSpriteKeys: Array<string> = [];
  @property([cc.Color]) private ButtonTextColors: Array<cc.Color> = [];
  @property([cc.String]) private ButtonBgSpriteKeys: Array<string> = [];

  private mTabButtonBgs: cc.Node;
  private mTabButtons: cc.Node;
  private mTabs: cc.Node;

  onLoad() {
    this.mTabButtonBgs = this.node.getChildByName("TabButtonBgs");
    this.mTabButtons = this.node.getChildByName("TabButtons");
    this.mTabs = this.node.getChildByName("Tabs");

    for (let i = 0; i < this.mTabButtons.children.length; i++) {
      this.mTabButtons.children[i]
        .getComponent(ButtonClickEvent)
        .registerEvent(() => {
          this.showTab(i);
        });
    }

    this.showTab(this.DefaultTab);
  }

  showTab(index: number) {
    for (let i = 0; i < this.mTabs.children.length; i++) {
      if (this.ButtonSpriteKeys.length > 0) {
        const key =
          this.ButtonSpriteKeys.length == 1
            ? this.ButtonSpriteKeys[0]
            : this.ButtonSpriteKeys[i];
        this.mTabButtons.children[i].getComponentInChildren(
          cc.Sprite
        ).spriteFrame = FrameMgr.Instance[key][i == index ? 0 : 1];
      }
      if (this.ButtonTextColors.length > 0) {
        this.mTabButtons.children[i].getComponentInChildren(
          cc.Label
        ).node.color = this.ButtonTextColors[i == index ? 0 : 1];
      }

      this.mTabs.children[i].active = i == index;
      if (this.mTabButtonBgs) {
        if (this.ButtonBgSpriteKeys.length > 0) {
          const key =
            this.ButtonBgSpriteKeys.length == 1
              ? this.ButtonBgSpriteKeys[0]
              : this.ButtonBgSpriteKeys[i];
          this.mTabButtonBgs.children[i].getComponent(cc.Sprite).spriteFrame =
            FrameMgr.Instance[key][i == index ? 0 : 1];
        }
      }
    }
  }
}
