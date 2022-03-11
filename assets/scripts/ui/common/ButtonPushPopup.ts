import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonPushPopup extends cc.Component {

  onLoad() {
    this.getComponent(ButtonClickEvent).registerEvent(this.onClick.bind(this));
  }

  private onClick() {
  }
}
