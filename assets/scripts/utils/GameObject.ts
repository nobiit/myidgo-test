const { ccclass, property } = cc._decorator;

@ccclass
export default class GameObject extends cc.Component {
  activate() {
    this.node.active = true;
  }

  deactivate() {
    this.node.active = false;
  }
}
