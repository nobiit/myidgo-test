import Events from "../common/Events";
import ListViewItem from "./ListViewItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListView extends cc.Component {
  static EventBounceBottom: string = "EventBounceBottom";

  @property(cc.Node) private itemTemplate: cc.Node = null; // item template to instantiate other items
  @property(cc.ScrollView) private scrollView: cc.ScrollView = null;
  // @property(Number)
  private totalCount: number = 0; // how many items we need for the whole list
  @property(cc.Float) private spacing: number = 0; // space between each item
  @property(cc.Float) private bufferZone: number = 0; // when item is away from bufferZone, we relocate it

  private content: cc.Node;
  private items: Array<cc.Node>;
  private updateTimer: number;
  private updateInterval: number;
  private lastContentPosY: number;
  private initContentY: number;

  onLoad() {
    this.totalCount = 0;
    this.content = this.scrollView.content;
    this.items = []; // array to store spawned items
    // this.initialize();
    this.updateTimer = 0;
    this.updateInterval = 0.2;
    this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
    this.initContentY = this.scrollView.content.y;
  }

  registerEvent(name: string, callback: Function) {
    this.node.on(name, callback);
  }

  updateInfo(list) {
    this.totalCount = list.length;
    this.items.length = 0;
    this.scrollView.content.y = this.initContentY;
    this.content.destroyAllChildren();

    this.initialize(list);
  }

  appendInfo(list) {
    this.totalCount += list.length;
    this.initialize(list);
  }

  initialize(list) {
    const spawnCount = list.length;

    this.content.height =
      this.totalCount * (this.itemTemplate.height + this.spacing) +
      this.spacing; // get total content height
    for (let i = 0; i < spawnCount; ++i) {
      // spawn items, we only need to do this once
      const info = list[i];
      const posIndex = this.totalCount - spawnCount + i;
      let item = cc.instantiate(this.itemTemplate);

      this.content.addChild(item);
      item.setPosition(
        0,
        -item.height * (0.5 + posIndex) - this.spacing * (posIndex + 1)
      );
      item.getComponent(ListViewItem).initItem(posIndex, posIndex);
      item.getComponent(ListViewItem).updateInfo(posIndex, info);

      this.items.push(item);
    }
  }

  getPositionInView(item) {
    // get item position in scrollview's node space
    let worldPos = item.parent.convertToWorldSpaceAR(item.position);
    let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
    return viewPos;
  }

  update(dt) {
    this.updateTimer += dt;
    if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
    this.updateTimer = 0;
    let items = this.items;
    let buffer = this.bufferZone;
    let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
    let offset = (this.itemTemplate.height + this.spacing) * items.length;

    for (let i = 0; i < items.length; ++i) {
      let viewPos = this.getPositionInView(items[i]);
      if (isDown) {
        // if away from buffer zone and not reaching top of content
        if (viewPos.y < -buffer && items[i].y + offset < 0) {
          items[i].y = items[i].y + offset;
          let item = items[i].getComponent(ListViewItem);
          let itemId = item.itemID - items.length; // update item id
          item.updateItem(itemId);
        }
      } else {
        // if away from buffer zone and not reaching bottom of content
        if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
          items[i].y = items[i].y - offset;
          let item = items[i].getComponent(ListViewItem);
          let itemId = item.itemID + items.length;
          item.updateItem(itemId);
        }
      }
    }

    // update lastContentPosY
    this.lastContentPosY = this.scrollView.content.y;
  }

  scrollEvent(sender, event) {
    switch (event) {
      case cc.ScrollView.EventType.BOUNCE_BOTTOM:
        this.node.emit(ListView.EventBounceBottom);
        break;
      case cc.ScrollView.EventType.TOUCH_UP:
        Events.emit(Events.EventResetSession);
        break;
    }
  }

  addItem() {
    this.content.height =
      (this.totalCount + 1) * (this.itemTemplate.height + this.spacing) +
      this.spacing; // get total content height
    this.totalCount = this.totalCount + 1;
  }

  removeItem() {
    if (this.totalCount - 1 < 30) {
      cc.error("can't remove item less than 30!");
      return;
    }

    this.content.height =
      (this.totalCount - 1) * (this.itemTemplate.height + this.spacing) +
      this.spacing; // get total content height
    this.totalCount = this.totalCount - 1;

    this.moveBottomItemToTop();
  }

  moveBottomItemToTop() {
    let offset = (this.itemTemplate.height + this.spacing) * this.items.length;
    let length = this.items.length;
    let item = this.getItemAtBottom();

    // whether need to move to top
    if (item.y + offset < 0) {
      item.y = item.y + offset;
      let itemComp = item.getComponent(ListViewItem);
      let itemId = itemComp.itemID - length;
      itemComp.updateItem(itemId);
    }
  }

  getItemAtBottom() {
    let item = this.items[0];
    for (let i = 1; i < this.items.length; ++i) {
      if (item.y > this.items[i].y) {
        item = this.items[i];
      }
    }
    return item;
  }

  scrollToFixedPosition() {
    this.scrollView.scrollToOffset(cc.v2(0, 500), 2);
  }
}
