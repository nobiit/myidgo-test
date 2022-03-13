import GameDefine from "../game/GameDefine";
import { IGunInfo } from "../interface/buy-gun-response";
import Helper from "../utils/Helper";
import SingletonComponent from "../utils/SingletonComponent";
import APIMgr from "./APIMgr";
import Events from "./EventManager";
import Localization from "./Localization";

const { ccclass } = cc._decorator;

@ccclass
export default class ProfileMgr extends SingletonComponent<ProfileMgr>() {
  get IsNewUser() {
    return this.mIsNewUser;
  }
  set IsNewUser(value) {
    this.mIsNewUser = value;
  }
  get AccountId() {
    return this.mAccountId;
  }
  get UserName() {
    const name = decodeURIComponent(window.userName);
    return name.length < 10 ? name : `${name.substr(0, 10)}...`;
  }
  get RawUserName() {
    return decodeURIComponent(window.userName);
  }
  get CurrentCollection() {
    return this.mCurrentCollection;
  }
  set CurrentCollection(value) {
    this.mCurrentCollection = value;
  }
  get RemainTurn() {
    return this.mRemainTurn;
  }
  set RemainTurn(value) {
    const remainturn = this.mRemainTurn;
    this.mRemainTurn = Math.max(0, value);

    if (remainturn != this.mRemainTurn) {
      Events.emit(Events.EventPlayerTurnChanged);
    }
  }
  get WeaponRemainTimes() {
    return this.mWeaponRemainTimes;
  }
  get WeaponLevel() {
    return this.mWeaponLevel;
  }

  private mCurrentCollection = null;
  private mIsNewUser: boolean;
  private mAccountId: string;
  private mRemainTurn: number;
  private mWeaponRemainTimes: Array<number>;
  private mWeaponLevel: number;

  onLoad() {
    super.onLoad();
    this.mIsNewUser = true;
    this.mRemainTurn = 0;
    this.mWeaponRemainTimes = [Infinity, 0, 0];
    this.mWeaponLevel = 1;

    Events.registerEvent(
      Events.EventPlayerChangeWeapon,
      this.onPlayerChangeWeapon.bind(this)
    );
    Events.registerEvent(
      Events.EventPlayerFinishChangeWeapon,
      this.onPlayerFinishChangeWeapon.bind(this)
    );
    Events.registerEvent(
      Events.EventPlayerFinishTutorial,
      this.onPlayerFinishTutorial.bind(this)
    );
  }

  checkWeaponInfo() {
    const weaponIndex = this.mWeaponLevel - 1;
    return this.mWeaponRemainTimes[weaponIndex] > 0;
  }

  updateWeaponInfo(result: Array<IGunInfo>) {
    for (const item of result) {
      const index = Number(item.typeGun.substr(item.typeGun.length - 1)) - 1;
      this.mWeaponRemainTimes[index] = item.amount;
    }
  }

  private onPlayerChangeWeapon(index: number) {
    this.mWeaponLevel = index + 1;
  }

  private onPlayerFinishChangeWeapon(callback: Function) {
    this.mWeaponRemainTimes[this.mWeaponLevel - 1]--;
  }

  private onPlayerFinishTutorial() {
    this.mIsNewUser = false;
  }
}
