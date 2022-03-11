import SingletonComponent from "../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Events extends SingletonComponent<Events>() {
  static EventLanguageChanged: string = "EventLanguageChanged";
  static EventPlayerToggleSound: string = "EventPlayerToggleSound";
  static EventGameStateChanged: string = "EventGameStateChanged";
  static EventGamePause: string = "EventGamePause";
  static EventPlayerFinishTutorial: string = "EventPlayerFinishTutorial";
  static EventPlayerCollectedItem: string = "EventPlayerCollectedItem";
  static EventItemSpawned: string = "EventItemSpawned";
  static EventPlayerReachNewLevel: string = "EventPlayerReachNewLevel";
  static EventPlayerTurnChanged: string = "EventPlayerTurnChanged";
  static EventPlayerChangeWeapon: string = "EventPlayerChangeWeapon";
  static EventPlayerFinishChangeWeapon: string =
    "EventPlayerFinishChangeWeapon";
  static EventPlayerWeaponUpgrade: string = "EventPlayerWeaponUpgrade";
  static EventPlayerDie: string = "EventPlayerDie";
  static EventShowGameNotice: string = "EventShowGameNotice";
  static EventHideGiftBox: string = "EventHideGiftBox";
  
  static EventResetSession: string = "EventResetSession";
  static EventStartSessionTimer: string = "EventStartSessionTimer";
  static EventStopSessionTimer: string = "EventStopSessionTimer";
  static EventAddSessionTimer: string = "EventAddSessionTimer";
  static EventFadeInButton: string = "EventFadeInButton";

  static registerEvent(name: string, callback: Function) {
    this.Instance.node.on(name, callback);
  }

  static unregisterEvent(name: string, callback: Function) {
    this.Instance.node.off(name, callback);
  }

  static registerEventOnce(name: string, callback: Function) {
    this.Instance.node.once(name, callback);
  }

  static emit(name: string, ...args) {
    this.Instance.node.emit(name, ...args);
  }
}
