const { ccclass, property } = cc._decorator;

@ccclass
export default class Loader extends cc.Component {
  @property(cc.Prefab) private SystemPrefabs: Array<cc.Prefab> = [];
  @property(cc.Prefab) private PlaceHolderPrefabs: Array<cc.Prefab> = [];

  onLoad() {
    (window as any).gameVersion = "0.0.52 - 28/01"
    console.log("Version : " + (window as any).gameVersion)
    //
    for (let i = 0; i < this.SystemPrefabs.length; i++) {
      this.node.addChild(cc.instantiate(this.SystemPrefabs[i]));
    }
    for (let i = 0; i < this.PlaceHolderPrefabs.length; i++) {
      this.node.addChild(cc.instantiate(this.PlaceHolderPrefabs[i]));
    }
  }
}
