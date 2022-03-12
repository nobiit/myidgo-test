import GameMgr from "../../game/GameMgr";
import Helper from "../../utils/Helper";
import SingletonComponent from "../../utils/SingletonComponent";
import PopupBase from "./PopupBase";

const { ccclass, property } = cc._decorator;

export enum Popups {
  PopupDailyQuest,
  PopupDailyReward,
  PopupEndscreen,
  PopupError,
  PopupExchangeSuccess,
  PopupExitApp,
  PopupExitConfirm,
  PopupGuide,
  PopupHistory,
  PopupHuntAnimal,
  PopupInfo,
  PopupLeaderboard,
  PopupLevelComplete,
  PopupNotice,
  PopupRewardInfo,
  PopupSettings,
  PopupTop3LB,
  PopupTop3Global,
  PopupExpiredDate,
  PopupPreEndscreen,
}

export const PopupsCCEnum = Helper.EnumToCCEnum(Popups);

export enum POPUP_EFFECT {
  APPEAR,
  SCALE,
}

@ccclass
export default class PopupMgr extends SingletonComponent<PopupMgr>() {
  @property(cc.Node) private PopupContainer: cc.Node = null;
  @property(cc.Node) private ShownPopups: cc.Node = null;
  @property(cc.Prefab) private PopupPrefabs: Array<cc.Prefab> = [];

  static push(
    popupName: Popups,
    effectType: POPUP_EFFECT = POPUP_EFFECT.SCALE,
    easing: string = "smooth",
    duration: number = 0.25
  ) {
    const instance = this.Instance;
    const popup = instance.PopupContainer.getChildByName(Popups[popupName]);
    if (popup) {
      if (instance.ShownPopups.childrenCount > 0) {
        // instance.ShownPopups.children[instance.ShownPopups.childrenCount - 1]
        //   .getComponent(PopupBase)
        //   .showBackground(false);
      }
      popup.getComponent(PopupBase).showBackground(true);
      instance.usePopup(popup);
      instance.animate(true, popup, effectType, easing, duration);
    }
    return popup;
  }

  static pop(
    effectType: POPUP_EFFECT = POPUP_EFFECT.SCALE,
    easing: string = "smooth",
    duration: number = 0.25
  ) {
    const instance = this.Instance;
    if (instance.ShownPopups.childrenCount > 0) {
      const popup =
        instance.ShownPopups.children[instance.ShownPopups.childrenCount - 1];
      instance.animate(false, popup, effectType, easing, duration);
      return popup;
    }
  }

  static hide(
    popupName: Popups,
    effectType: POPUP_EFFECT = POPUP_EFFECT.SCALE,
    easing: string = "smooth",
    duration: number = 0.25
  ) {
    const instance = this.Instance;
    const popup = instance.ShownPopups.getChildByName(Popups[popupName]);
    if (popup) {
      instance.animate(false, popup, effectType, easing, duration);
    }
    return popup;
  }

  static getPopup<T>(popupName: Popups): T {
    const instance = this.Instance;
    let popup = instance.PopupContainer.getChildByName(Popups[popupName]);
    if (popup) {
      return popup.getComponent(Popups[popupName]);
    }

    return instance.ShownPopups.getChildByName(Popups[popupName]).getComponent(
      Popups[popupName]
    );
  }

  onLoad() {
    super.onLoad();
    for (let i = 0; i < this.PopupPrefabs.length; i++) {
      this.PopupContainer.addChild(cc.instantiate(this.PopupPrefabs[i]));
    }
  }

  start() {
    // if(GameMgr.Instance.IsHighRatioDevice){
    //     this.node.setScale(0.85);
    // }

    this.PopupContainer.active = false;
  }

  private animate(
    isShow: boolean,
    popup: cc.Node,
    effectType: POPUP_EFFECT,
    easing: string,
    duration: number
  ) {
    const popupBase = popup.getComponent(PopupBase);
    const popupContainer = popupBase.Container;
    switch (effectType) {
      case POPUP_EFFECT.APPEAR: {
        if (isShow) {
          popupContainer.setScale(cc.Vec2.ONE);
          popupBase.showCallback();
        } else {
          this.returnPopup(popup);
          popupBase.hideCallback();
        }

        break;
      }
      case POPUP_EFFECT.SCALE: {
        popupBase.activeWidgetNodes(false);
        popupContainer.setScale(isShow ? cc.Vec2.ZERO : cc.Vec2.ONE);

        cc.tween(popupContainer)
          .to(duration, { scale: isShow ? 1 : 0 }, { easing })
          .call(() => {
            if (isShow) {
              popupBase.showCallback();
            } else {
              this.returnPopup(popup);
              popupBase.hideCallback();
            }
            popupBase.activeWidgetNodes(true);
          })
          .start();

        break;
      }
    }
  }

  private usePopup(popup: cc.Node) {
    this.PopupContainer.removeChild(popup, false);
    this.ShownPopups.addChild(popup);
  }

  private returnPopup(popup: cc.Node) {
    this.ShownPopups.removeChild(popup, false);
    this.PopupContainer.addChild(popup);

    const instance = PopupMgr.Instance;
    if (instance.ShownPopups.childrenCount > 0) {
      instance.ShownPopups.children[instance.ShownPopups.childrenCount - 1]
        .getComponent(PopupBase)
        .showBackground(true);
    }
  }
}
