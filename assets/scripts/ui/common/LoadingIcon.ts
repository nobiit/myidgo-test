import Spinner from "./Spinner";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingIcon extends Spinner {
  show() {
    this.node.active = true;
  }

  hide() {
    this.node.active = false;
  }
}
