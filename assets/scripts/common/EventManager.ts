import SingletonComponent from "../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventManager extends SingletonComponent<EventManager>() {
  static on(name: string, callback: Function) {
    this.Instance.node.on(name, callback);
  }

  static off(name: string, callback: Function) {
    this.Instance.node.off(name, callback);
  }

  static once(name: string, callback: Function) {
    this.Instance.node.once(name, callback);
  }

  static emit(name: string, ...args) {
    this.Instance.node.emit(name, ...args);
  }
}
