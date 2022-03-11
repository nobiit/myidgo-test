import GameDefine from "../../game/GameDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Spinner extends cc.Component {
  @property(cc.Integer) private Speed: number = 10 * GameDefine.SPEED_GAME_BASE;

  update(dt: number) {
    this.node.angle = (this.node.angle - this.Speed * dt) % 360;
  }
}
