import GameDefine from "../../game/GameDefine";
import SingletonComponent from "../../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingCover extends SingletonComponent<LoadingCover>() {
  @property(cc.Node) private Container: cc.Node = null;
  @property(cc.Node) private Bg: cc.Node = null;

  onLoad() {
    super.onLoad();
    this.hide();
    this.Bg.opacity = GameDefine.AMOUNT_BG_COVER_OPACITY;
  }

  show() {
    this.Container.active = true;
  }

  hide() {
    this.Container.active = false;
  }
}
