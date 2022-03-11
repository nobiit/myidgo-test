import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonShareFb extends cc.Component {

  onLoad() {
    this.getComponent(ButtonClickEvent).registerEvent(this.shareFb.bind(this));
  }

  private shareFb() {
  }
}
