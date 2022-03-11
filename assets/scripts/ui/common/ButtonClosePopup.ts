import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonClosePopup extends cc.Component {
  onLoad() {
    this.getComponent(ButtonClickEvent).registerEvent(
      this.onClicked.bind(this)
    );
  }

  private onClicked() {
  }
}
