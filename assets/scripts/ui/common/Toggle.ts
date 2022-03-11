import ButtonClickEvent from "./ButtonClickEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Toggle extends cc.Component {
  @property(cc.Boolean) IsOn: boolean = true;
  @property(cc.Node) private OnNode: cc.Node = null;
  @property(cc.Node) private OffNode: cc.Node = null;
  @property(cc.Boolean) isOneWayToggle: boolean = false;

  private mToggleCallback: Function;

  onLoad() {
    this.getComponent(ButtonClickEvent).registerEvent(this.onClick.bind(this));
  }

  onEnable() {
    this.toggle();
  }

  setToggleCallback(callback: Function) {
    this.mToggleCallback = callback;
  }

  private onClick() {
    this.IsOn = this.isOneWayToggle ? true : !this.IsOn;
    this.mToggleCallback && this.mToggleCallback();
    this.toggle();
  }

  toggle(isOn:boolean = null) {
    if(isOn !== null) this.IsOn = isOn;
    this.OnNode.active = this.IsOn;
    this.OffNode.active = !this.IsOn;
  }
}
