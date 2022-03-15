import Stage from "./Stage";
import SingletonComponent from "../utils/SingletonComponent";
import GameMgr from "../game/GameMgr";
import Helper from "../utils/Helper";
import GameDefine from "../game/GameDefine";
import Events from "../common/EventManager";

const { ccclass, property } = cc._decorator;

export enum Stages {
  StageInterstitial,
  StageGame,
}

@ccclass
export default class StageMgr extends SingletonComponent<StageMgr>() {
  @property(cc.Prefab) private StagePrefabs: Array<cc.Prefab> = [];
  private StageCover: cc.Node = null;
  private Canvas: cc.Node = null;

  get CurrentStage(): cc.Node {
    return this.mCurrentStage;
  }
  get CanvasWidth():number{
    return this.Canvas.width;
  }
  get CanvasHeight():number{
    return this.Canvas.height;
  }

  private mPreviousStage: cc.Node = null;
  private mCurrentStage: cc.Node = null;

  static show(stageName: Stages, duration: number = 0.5) {
    const instance = this.Instance;
    instance.mPreviousStage = instance.mCurrentStage;

    for (let stage of instance.node.children) {
      const isActive = stage.name == Stages[stageName];
      if (isActive) {
        instance.mCurrentStage = stage;
      }

      if (stage.active != isActive) {
        stage.active = isActive;
      }
    }

    if (
      instance.mPreviousStage &&
      instance.mCurrentStage &&
      instance.mPreviousStage != instance.mCurrentStage
    ) {
      instance.animate(duration);
    } else {
      instance.mCurrentStage.getComponent(Stage).init();
    }
  }

  static nextStage(isNext: boolean = true, duration: number = 0.5) {
    const instance = this.Instance;
    let index = instance.node.children.indexOf(instance.mCurrentStage);

    if (!isNext && index == 0) {
      (window as any).location = GameDefine.DEEP_LINK_BACK;
    } else if (
      index != -1 &&
      ((isNext && index < instance.node.childrenCount - 1) ||
        (!isNext && index > 0))
    ) {
      index = isNext ? index + 1 : index - 1;
      StageMgr.show(
        Helper.GetIndexEnum(Stages, instance.node.children[index].name),
        duration
      );
    }
  }

  onLoad() {
    super.onLoad();
    for (let i = 0; i < this.StagePrefabs.length; i++) {
      const node = cc.instantiate(this.StagePrefabs[i]);
      this.node.addChild(node);
      node.active = false;
    }

    this.Canvas = cc.find("Canvas");
    //
    this.registerVisibilityChange();
  }

  start() {
    this.StageCover = this.Canvas.getChildByName("Stage Cover");
    this.StageCover.active = false;

    StageMgr.show(Stages.StageInterstitial);
  }

  private animate(duration: number) {
    this.mPreviousStage.active = true;
    this.mCurrentStage.active = false;

    this.StageCover.active = true;
    cc.tween(this.mPreviousStage)
      .to(
        duration,
        { scale: this.mPreviousStage.scaleX },
        {
          progress: (start, end, current, ratio) => {
            // this.mPreviousStage.opacity = (1 - ratio) * 255;
            this.StageCover.opacity = ratio * 255;
            return start + (end - start) * ratio;
          },
        }
      )
      .call(() => {
        this.mPreviousStage.active = false;
        this.mCurrentStage.active = true;
        this.mCurrentStage.getComponent(Stage).init();
      })
      .start();
    cc.tween(this.mCurrentStage)
      .delay(duration)
      .to(
        duration,
        { scale: this.mCurrentStage.scaleX },
        {
          progress: (start, end, current, ratio) => {
            // this.mCurrentStage.opacity = ratio * 255;
            this.StageCover.opacity = (1 - ratio) * 255;
            return start + (end - start) * ratio;
          },
        }
      )
      .call(() => {
        this.StageCover.active = false;
      })
      .start();
  }

  private registerVisibilityChange(){
    var hidden, visibilityChange;
		if (typeof document.hidden !== "undefined") {
			// Opera 12.10 and Firefox 18 and later support
			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
			hidden = "msHidden";
			visibilityChange = "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		}

    (window as any).pointTime = null;
		function handleVisibilityChange() {
			if (document[hidden]) {
				clearTimeout(this.pauseTimeout);
				this.pauseTimeout = setTimeout(() => {
					// console.log('PAUSEEEEEEEEEEEEEEEEEEEEE');
          (window as any).pointTime = Date.now();
				}, 400);
			} else {
				clearTimeout(this.resumeTimeout);
				this.resumeTimeout = setTimeout(() => {
					// console.log('RESUMEEEEEEEEEEEEEEEEEEEE')
          //
          // Events.emit(Events.EventAddSessionTimer, {duration: Date.now() - (window as any).pointTime})
				}, 400);
			}
		}

		// Warn if the browser doesn't support addEventListener or the Page Visibility API
		if (typeof document.addEventListener === "undefined" || hidden === undefined) {
			console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
		} else {
			// Handle page visibility change
			document.addEventListener(visibilityChange, handleVisibilityChange, false);
		}
  }
}
