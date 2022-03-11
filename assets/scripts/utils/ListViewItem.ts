const { ccclass, property } = cc._decorator;

@ccclass
export default class ListViewItem extends cc.Component {
  tmplID: number = 0;
  itemID: number = 0;

  onLoad() {
    // this.node.on('touchend', function () {
    //     console.log("Item " + this.itemID + ' clicked');
    // }, this);
  }

  initItem(tmplID, itemID) {
    this.tmplID = tmplID;
    this.itemID = itemID;
  }

  updateItem(itemID) {
    this.itemID = itemID;
  }

  updateInfo(index, info) {}
}
