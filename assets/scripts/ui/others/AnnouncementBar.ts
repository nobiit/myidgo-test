import APIMgr from "../../common/APIMgr";
import GameDefine from "../../game/GameDefine";
import GameMgr from "../../game/GameMgr";
import { IAnnouncement } from "../../interface/announcement-response";
import Timer from "../../utils/Timer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnnouncementBar extends cc.Component {
  @property(cc.Node) private DetailContainer: cc.Node = null;
  @property(cc.Node) private TextTemplate: cc.Node = null;

  private mAnnouncement: Array<IAnnouncement>;
  private mContainerInitX: number;
  private mTextMarginX: number;
  private mContainerWidth: number;

  onLoad() {
    this.mContainerInitX = this.DetailContainer.x;
    this.mTextMarginX = this.DetailContainer.getComponent(cc.Layout).spacingX;
    this.mContainerWidth = 0;
  }

  onEnable() {
    this.init();
  }

  update(dt) {
    if (this.mContainerWidth > 0) {
      this.DetailContainer.setPosition(
        this.DetailContainer.x - 1.5 * dt * GameDefine.SPEED_GAME_BASE,
        this.DetailContainer.y
      );
      if (
        this.DetailContainer.x + this.mContainerWidth <
        -GameMgr.Instance.Canvas.width / 2
      ) {
        this.initAnnouncement();
      }
    }
  }

  private init() {
    this.checkAnnouncement();
  }

  private checkAnnouncement() {
    APIMgr.solveApi(
      APIMgr.Instance.getPremiumPrize(),
      ({ result }: { result: Array<IAnnouncement> }) => {
        this.mAnnouncement = result;
        if (this.mContainerWidth == 0) {
          this.initAnnouncement();
        }
      },
      (err) => { },
      false
    );
  }

  private initAnnouncement() {
    this.DetailContainer.destroyAllChildren();
    this.DetailContainer.setPosition(
      this.mContainerInitX,
      this.DetailContainer.y
    );
    this.mContainerWidth = 0;

    const grandAnnouncements = this.mAnnouncement;
    for (let i = 0; i < grandAnnouncements.length; i++) {
      const textItem = cc.instantiate(this.TextTemplate);
      textItem.getComponent(
        cc.Label
      ).string = `${grandAnnouncements[i].msisdn} wins ${grandAnnouncements[i].prizeDescription}`;
      textItem.active = true;

      this.DetailContainer.addChild(textItem);
      this.mContainerWidth += textItem.width;
      this.mContainerWidth += this.mTextMarginX;
    }
    this.DetailContainer.width = this.mContainerWidth;
  }
}
