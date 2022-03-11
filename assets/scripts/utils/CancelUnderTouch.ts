const { ccclass, property } = cc._decorator;

@ccclass
export default class CancelUnderTouch extends cc.Component {
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, () => {}, this);
  }
}
