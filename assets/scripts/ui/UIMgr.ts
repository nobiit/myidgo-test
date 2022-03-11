import GameMgr from "../game/GameMgr";
import Helper from "../utils/Helper";
import SingletonComponent from "../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

export enum UIs {
  UIInterstitial,
  UIGame,
  UITutorial,
}

export enum UI_SHOW_EFFECT {
  APPEAR,
  MOVE,
  SCALE,
  FADE,
}

export enum UI_MOVE_DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

@ccclass
export default class UIMgr extends SingletonComponent<UIMgr>() {
  set MoveDirection(value: UI_MOVE_DIRECTION) {
    this.mMoveDirection = value;
  }

  get CurrentView(): cc.Node {
    return this.mCurrentView;
  }

  @property(cc.Prefab) private UIPrefabs: Array<cc.Prefab> = [];

  private Canvas: cc.Node = null;
  private mMoveDirection: UI_MOVE_DIRECTION = UI_MOVE_DIRECTION.LEFT;
  private mPreviousView: cc.Node = null;
  private mCurrentView: cc.Node = null;

  static show(
    viewName: UIs,
    effectType: UI_SHOW_EFFECT = UI_SHOW_EFFECT.APPEAR,
    easing: string = "smooth",
    duration: number = 0.5
  ) {
    const instance = this.Instance;
    instance.mPreviousView = instance.mCurrentView;

    for (let view of instance.node.children) {
      const isActive = view.name == UIs[viewName];
      if (isActive) {
        instance.mCurrentView = view;
        instance.mCurrentView.active = true;
      }

      // if (view.active != isActive) {
      //   view.active = isActive;
      // }
    }

    if (
      instance.mPreviousView &&
      instance.mCurrentView &&
      instance.mPreviousView != instance.mCurrentView
    ) {
      instance.animate(effectType, easing, duration);
    }
  }

  static nextView(
    isNext: boolean = true,
    effectType: UI_SHOW_EFFECT,
    easing: string,
    duration: number
  ) {
    const instance = this.Instance;
    let index = instance.node.children.indexOf(instance.mCurrentView);

    if (
      index != -1 &&
      ((isNext && index < instance.node.childrenCount - 1) ||
        (!isNext && index > 0))
    ) {
      index = isNext ? index + 1 : index - 1;
      this.show(
        Helper.GetIndexEnum(UIs, instance.node.children[index].name),
        effectType,
        easing,
        duration
      );
    }
  }

  static getUI<T>(viewName: UIs): T {
    return this.Instance.node
      .getChildByName(UIs[viewName])
      .getComponent(UIs[viewName]);
  }

  onLoad() {
    super.onLoad();
    for (let i = 0; i < this.UIPrefabs.length; i++) {
      const node = cc.instantiate(this.UIPrefabs[i]);
      node.active = false;
      this.node.addChild(node);
    }

    this.Canvas = cc.find("Canvas");
  }

  start() {
    // if(GameMgr.Instance.IsHighRatioDevice){
    //     this.node.setScale(0.85);
    // }
  }

  private animate(
    effectType: UI_SHOW_EFFECT,
    easing: string,
    duration: number
  ) {
    // this.mPreviousView.active = true;

    switch (effectType) {
      case UI_SHOW_EFFECT.APPEAR: {
        this.mPreviousView.active = false;
        break;
      }
      case UI_SHOW_EFFECT.MOVE: {
        let previousViewPosition;
        let currentViewPosition;
        switch (this.mMoveDirection) {
          case UI_MOVE_DIRECTION.UP: {
            currentViewPosition = cc.v2(0, -this.Canvas.height * 1.5);
            previousViewPosition = cc.v2(0, this.Canvas.height * 1.5);
            break;
          }
          case UI_MOVE_DIRECTION.DOWN: {
            currentViewPosition = cc.v2(0, this.Canvas.height * 1.5);
            previousViewPosition = cc.v2(0, -this.Canvas.height * 1.5);
            break;
          }
          case UI_MOVE_DIRECTION.LEFT: {
            currentViewPosition = cc.v2(this.Canvas.width * 1.5, 0);
            previousViewPosition = cc.v2(-this.Canvas.width * 1.5, 0);
            break;
          }
          case UI_MOVE_DIRECTION.RIGHT: {
            currentViewPosition = cc.v2(-this.Canvas.width * 1.5, 0);
            previousViewPosition = cc.v2(this.Canvas.width * 1.5, 0);
            break;
          }
        }

        cc.tween(this.mPreviousView)
          .to(duration, { position: previousViewPosition }, { easing })
          .call(() => (this.mPreviousView.active = false))
          .start();
        cc.tween(this.mCurrentView)
          .set({ opacity: 0 })
          .delay(0)
          .set({ opacity: 255, position: currentViewPosition })
          .to(duration, { position: cc.Vec3.ZERO }, { easing })
          .start();

        break;
      }
      case UI_SHOW_EFFECT.SCALE: {
        this.mCurrentView.setScale(cc.Vec2.ZERO);
        cc.tween(this.mPreviousView)
          .to(duration, { scale: 0 }, { easing })
          .call(() => (this.mPreviousView.active = false))
          .start();
        cc.tween(this.mCurrentView)
          .delay(duration)
          .to(duration, { scale: 1 }, { easing })
          .start();

        break;
      }
      case UI_SHOW_EFFECT.FADE: {
        cc.tween(this.mPreviousView)
          .to(
            duration,
            { scale: this.mPreviousView.scaleX },
            {
              progress: (start, end, current, ratio) => {
                this.mPreviousView.opacity = (1 - ratio) * 255;
                return start + (end - start) * ratio;
              },
            }
          )
          .call(() => (this.mPreviousView.active = false))
          .start();
        cc.tween(this.mCurrentView)
          .delay(duration)
          .to(
            duration,
            { scale: this.mCurrentView.scaleX },
            {
              progress: (start, end, current, ratio) => {
                this.mCurrentView.opacity = ratio * 255;
                return start + (end - start) * ratio;
              },
            }
          )
          .start();

        break;
      }
    }
  }
}
