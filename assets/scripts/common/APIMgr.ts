import SingletonComponent from "../utils/SingletonComponent";
import GameDefine, {
  FetchListViewTypes,
  ILevelDefine,
} from "../game/GameDefine";

import { connectWsgw } from '@elofun/vds-wsgw';

interface IAPIResponse {
  status: number;
  data: any;
}

let scheme = window.location.protocol.match(/s:$/) ? 'wss' : 'ws';
let hostname = window.location.host;
let base_path = window.location.pathname.replace(/(^|\/)\//g, '').replace(/\/web\/?$/, '/');
if (hostname.match(/localhost|github\.io/)) {
  scheme = 'wss';
  hostname = 'vds-dev.elofun.net'; // Nếu chạy ở localhost thì sử dụng hostname của môi trường dev
  base_path = '';
}
const SERVICE_HOST = `${scheme}://${hostname}/${base_path}wsgw/`;
// const SERVICE_HOST = "ws://125.235.38.229:8080/hovang/wsgw/"

// #const SERVICE_HOST = `wss://${window.location.host}/wsgw/`; // For production
// const SERVICE_HOST = 'https://vds-dev.elofun.net/cms/#/users'; // For development




const { ccclass, property } = cc._decorator;

@ccclass
export default class APIMgr
  extends SingletonComponent<APIMgr>()
  implements IApi {
  private apis: IApi;
  private wsgw = null;
  public isDisconnectedWSGW: boolean = false;

  static solveApi(promise, onSuccess, onFail, showLoading = true) {
    if (showLoading) {
      LoadingCover.Instance.show();
    }

    Helper.TimeoutPromise(GameDefine.TIME_API_TIMEOUT, promise)
      .then((res) => {
        this.Instance.isDisconnectedWSGW = false;
        
        if (showLoading) {
          LoadingCover.Instance.hide();
        }

        let responses = res;
        if (!Array.isArray(res)) {
          responses = [res];
        }

        const isSuccess = responses.every((item) => item.status === 200);
        if (isSuccess) {
          onSuccess(res);
        } else {
          onFail(res);
        }
      })
      .catch((err) => {
        if (showLoading) {
          LoadingCover.Instance.hide();
        }
        
        if(err == "timeout!") {
          this.Instance.isDisconnectedWSGW = true;
        }
        onFail(err);
      });
  }

  static settleApis(promises, callback, showLoading = true) {
    if (showLoading) {
      LoadingCover.Instance.show();
    }

    let responseCount = 0;
    const responses = [];
    const checkFinish = () => {
      responseCount++;
      if (responseCount == promises.length) {
        if (showLoading) {
          LoadingCover.Instance.hide();
        }

        callback(responses);
      }
    };
    const handlePromise = (i, promise) => {
      Helper.TimeoutPromise(GameDefine.TIME_API_TIMEOUT, promise)
        .then((res) => {
          responses[i] = res.status === 200
            ? { status: GameDefine.STRING_FULFILLED, value: res }
            : { status: GameDefine.STRING_REJECTED, reason: res };
          checkFinish();
        })
        .catch((err) => {
          responses[i] = { status: GameDefine.STRING_REJECTED, reason: err };
          checkFinish();
        });
    };

    for (let i = 0; i < promises.length; i++) {
      handlePromise(i, promises[i]);
    }
  }

  static callApiSync(apis, callback, showLoading = true) {
    if (showLoading) {
      LoadingCover.Instance.show();
    }

    let index = 0;
    const responses = [];
    const handleApi = () => {
      if (index < apis.length) {
        Helper.TimeoutPromise(GameDefine.TIME_API_TIMEOUT, apis[index]())
          .then((res) => {
            responses.push(
              res.status === 200
                ? { status: GameDefine.STRING_FULFILLED, value: res }
                : { status: GameDefine.STRING_REJECTED, reason: res }
            );
            index++;
            handleApi();
          })
          .catch((err) => {
            responses.push({ status: GameDefine.STRING_REJECTED, reason: err });
            index++;
            handleApi();
          });
      } else {
        if (showLoading) {
          LoadingCover.Instance.hide();
        }

        callback(responses);
      }
    };

    handleApi();
  }

  static fetchListView(type: number, offset: number, limit: number, dayOffset: number = 0) {
    switch (type) {
      case FetchListViewTypes.HistoryReward:
        return this.Instance.getPrizeHistory(offset, limit);
      case FetchListViewTypes.HistoryAttempt:
        return this.Instance.getTurnHistory(offset, limit);
      case FetchListViewTypes.FriendContacts:
        return this.Instance.getAllFriend();
      case FetchListViewTypes.LBGrandPrize:
        return this.Instance.getGrandPrize(offset, limit);
      case FetchListViewTypes.LBTopStarWeekly:
        return this.Instance.getWeeklyTopStar(offset, limit);
      case FetchListViewTypes.LBTopStarMonthly:
        return this.Instance.getTopTotalStarLastWeek(offset, limit);
      case FetchListViewTypes.LBTopStarPerTurnWeekly:
        return this.Instance.getWeeklyTopHighStar(offset, limit);
      case FetchListViewTypes.LBTopStarPerTurnMonthly:
        return this.Instance.getMonthlyTopHighStar(offset, limit);
      case FetchListViewTypes.Notification:
        return this.Instance.getNotification(offset, limit);
      //new type
      case FetchListViewTypes.LBGlobal:
        return this.Instance.getGlobalLeaderboard(offset, limit);
      case FetchListViewTypes.LBCurrentWeekly:
        return this.Instance.getDailyLeaderboard(offset, limit, dayOffset);
      case FetchListViewTypes.LBPreviousWeekly:
        return this.Instance.getDailyLeaderboard(offset, limit, -1);
      case FetchListViewTypes.RewardHistory:
        return this.Instance.getRewardsHistory(offset, limit, 0);
      case FetchListViewTypes.TurnHistory:
        return this.Instance.getTicketsHistory(offset, limit);
      case FetchListViewTypes.PremiumRewardHistory:
        return this.Instance.getPremiumRewardHistory(offset, limit);
    }
  }

  onLoad() {
    super.onLoad();
    // if ((window as any).getGameApis) {
    //   this.apis = (window as any).getGameApis();
    // }

    // connectWsgw(SERVICE_HOST).then((wsgw) => {
    //   // current userId
    //   // const userId = wsgw.userId;
    //   // current credential (msisdn)
    //   // const msisdn = wsgw.credential;
    //   // ....
    //   // console.log(userId, msisdn);
    //   wsgw.request('auth', 'me', {}).then(({ status, data }) => {
    //     if (status === 200) {
    //       const userId = data.info.userId;
    //       const msisdn = data.info.credential;
    //       console.log({ userId, msisdn });

    //       // this.wsgw = wsgw;
    //     } else {
    //       // handle login failed!
    //       PopupMgr.push(Popups.PopupError).getComponent(PopupError).init('Login unsuccess');
    //     }
    //   })
    // });

    // this.apis = mockApis;
    // (window as any).apis = this.apis;
  }

  _getWsgw() {
    if (!this.wsgw) {
      this.wsgw = connectWsgw(SERVICE_HOST);
    }
    return this.wsgw;
  }

  _request(service: string, api: string, data: any, timeout?: number): Promise<IAPIResponse> {
    return this._getWsgw().then((wsgw) =>
      wsgw.request(service, api, data, timeout)
    );
  }

  login() {
    return this._request('auth', 'me', {});
  }

  claimDailyRewards() {
    return this._request('game', 'claimDailyRewards', {});
  }
  getBalances() {
    return this._request('game', 'getBalances', {});
  }
  bookRewards() {
    return this._request('game', 'bookRewards', {});
  }
  claimReward(reward_id, level) {
    return this._request('game', 'claimReward', { id: reward_id, level: level });
  }
  rewardInventorys() {
    return this._request('game', 'rewardInventorys', {});
  }
  getGlobalLeaderboard(offset, limit) {
    return this._request('game', 'getGlobalLeaderboard', {offset: offset, limit: limit });
  }
  getDailyLeaderboard(offset, limit, dayOffset) {
    return this._request('game', 'getDailyLeaderboard', {offset: offset, limit: limit, dayOffset: dayOffset});
  }
  getRewardsHistory(offset, limit, weekOffset) {
    return this._request('game', 'getRewardsHistory', {offset: offset, limit: limit, weekOffset: weekOffset});
  }
  getTicketsHistory(offset, limit) {
    return this._request('game', 'getTicketsHistory', {offset: offset, limit: limit});
  }
  exchangeReward(rewardType: string) {
    return this._request('game', 'exchangeReward', {rewardType: rewardType});
  }
  getPremiumRewardHistory(offset, limit) {
    return this._request('game', 'getPremiumRewardHistory', {offset: offset, limit: limit});
  }
  claimStar(id) {
    return this._request('game', 'claimStar', {id: id});
  }
  checkDailyWinner() {
    return this._request('game', 'checkDailyWinner', {});
  }
  checkGlobalWinner() {
    return this._request('game', 'checkGlobalWinner', {});
  }

  getTest() {
    if (this.apis) {
      return this.apis.getTest();
    }

    return Promise.reject();
  }
  gameAction(): void {
    if (this.apis) {
      return this.apis.gameAction();
    }
  }
  getTurn() {
    if (this.apis) {
      return this.apis.getTurn();
    }

    return Promise.reject();
  }
  getTurnHistory(offset: number, limit: number): Promise<ITurnHistoryResponse> {
    if (this.apis) {
      return this.apis.getTurnHistory(offset, limit);
    }

    return Promise.reject();
  }
  getPrizeHistory(offset: number, limit: number): Promise<IPrizeHistoryResponse> {
    if (this.apis) {
      return this.apis.getPrizeHistory(offset, limit);
    }

    return Promise.reject();
  }
  getPlayerInfo(): Promise<IPlayerInfoResponse> {
    if (this.apis) {
      return this.apis.getPlayerInfo();
    }

    return Promise.reject();
  }
  createGame(gunType: string): Promise<IGameInfoResponse> {
    if (this.apis) {
      return this.apis.createGame(gunType);
    }

    return Promise.reject();
  }
  killBoss(): Promise<IBossRewardResponse> {
    if (this.apis) {
      return this.apis.killBoss();
    }

    return Promise.reject();
  }
  createNextWave(): Promise<IWaveInfoResponse> {
    if (this.apis) {
      return this.apis.createNextWave();
    }

    return Promise.reject();
  }
  createEndGame(star: number, score: number): Promise<IEndGameResponse> {
    if (this.apis) {
      return this.apis.createEndGame(star, score);
    }

    return Promise.reject();
  }
  checkDailyLogin(): Promise<IDailyLoginResponse> {
    if (this.apis) {
      return this.apis.checkDailyLogin();
    }

    return Promise.reject();
  }
  searchFriend(msisdnFriend: string): Promise<IFriendResponse> {
    if (this.apis) {
      return this.apis.searchFriend(msisdnFriend);
    }

    return Promise.reject();
  }
  shareFB(): Promise<IShareResponse> {
    if (this.apis) {
      return this.apis.shareFB();
    }

    return Promise.reject();
  }
  getAllFriend(): Promise<IFriendsResponse> {
    if (this.apis) {
      return this.apis.getAllFriend();
    }

    return Promise.reject();
  }
  addFriend(msisdnFriend: string): Promise<IAddFriendResponse> {
    if (this.apis) {
      return this.apis.addFriend(msisdnFriend);
    }

    return Promise.reject();
  }
  getGameDefines(): Promise<IGameDefineResponse> {
    if (this.apis) {
      return this.apis.getGameDefines();
    }

    return Promise.reject();
  }
  getLevelDefines(level: number): Promise<ILevelDefineResponse> {
    if (this.apis) {
      return this.apis.getLevelDefines(level);
    }

    return Promise.reject();
  }

  getWeeklyTopStar(offset: number, limit: number): Promise<ITopStarResponse> {
    if (this.apis) {
      return this.apis.getWeeklyTopStar(offset, limit);
    }

    return Promise.reject();
  }
  getWeeklyTopHighStar(
    offset: number,
    limit: number
  ): Promise<ITopStarResponse> {
    if (this.apis) {
      return this.apis.getWeeklyTopHighStar(offset, limit);
    }

    return Promise.reject();
  }
  getMonthlyTopStar(offset: number, limit: number): Promise<ITopStarResponse> {
    if (this.apis) {
      return this.apis.getMonthlyTopStar(offset, limit);
    }

    return Promise.reject();
  }
  getMonthlyTopHighStar(
    offset: number,
    limit: number
  ): Promise<ITopStarResponse> {
    if (this.apis) {
      return this.apis.getMonthlyTopHighStar(offset, limit);
    }

    return Promise.reject();
  }
  getTopTotalStarLastWeek(
    offset: number,
    limit: number
  ): Promise<ITopStarResponse> {
    if (this.apis) {
      return this.apis.getTopTotalStarLastWeek(offset, limit);
    }

    return Promise.reject();
  }
  getGrandPrize(offset: number, limit: number): Promise<IGrandPrizeResponse> {
    if (this.apis) {
      return this.apis.getGrandPrize(offset, limit);
    }

    return Promise.reject();
  }
  getListAnimalMySelf(): Promise<IAnimalsResponse> {
    if (this.apis) {
      return this.apis.getListAnimalMySelf();
    }

    return Promise.reject();
  }
  getAnimalFriend(friendMsisdn: string): Promise<IFriendAnimalsResponse> {
    if (this.apis) {
      return this.apis.getAnimalFriend(friendMsisdn);
    }

    return Promise.reject();
  }
  getRequestBuyTurn(buyTurnType: string): Promise<IRequestBuyTurnResponse> {
    if (this.apis) {
      return this.apis.getRequestBuyTurn(buyTurnType);
    }

    return Promise.reject();
  }
  implementBuyTurn(
    otp: string,
    buyingTurnLogId: string
  ): Promise<IBuyTurnResponse> {
    if (this.apis) {
      return this.apis.implementBuyTurn(otp, buyingTurnLogId);
    }

    return Promise.reject();
  }
  getRequestBuyGun(
    gunTypeEnum: string,
    amountGun: number
  ): Promise<IRequestBuyGunResponse> {
    if (this.apis) {
      return this.apis.getRequestBuyGun(gunTypeEnum, amountGun);
    }

    return Promise.reject();
  }
  implementBuyGun(
    otp: string,
    buyingGunLogId: string
  ): Promise<IBuyGunResponse> {
    if (this.apis) {
      return this.apis.implementBuyGun(otp, buyingGunLogId);
    }

    return Promise.reject();
  }
  getGunInfo(): Promise<IGunInfoResponse> {
    if (this.apis) {
      return this.apis.getGunInfo();
    }

    return Promise.reject();
  }
  tempDie(): Promise<ITempDieResponse> {
    if (this.apis) {
      return this.apis.tempDie();
    }

    return Promise.reject();
  }

  getComboRevive(comboReviveGun: string): Promise<IRequestBuyRevivalResponse> {
    if (this.apis) {
      return this.apis.getComboRevive(comboReviveGun);
    }

    return Promise.reject();
  }
  buyComboRevive(
    otp: string,
    buyingRevivalLogId: string
  ): Promise<IBuyRevivalResponse> {
    if (this.apis) {
      return this.apis.buyComboRevive(otp, buyingRevivalLogId);
    }

    return Promise.reject();
  }
  getInfoLock(): Promise<ILockInfoResponse> {
    if (this.apis) {
      return this.apis.getInfoLock();
    }

    return Promise.reject();
  }
  getLockCard(cardCode: string): Promise<ILockCardResponse> {
    if (this.apis) {
      return this.apis.getLockCard(cardCode);
    }

    return Promise.reject();
  }
  getUnlockCard(cardCode: string): Promise<ILockCardResponse> {
    if (this.apis) {
      return this.apis.getUnlockCard(cardCode);
    }

    return Promise.reject();
  }
  itemDropByMonster(): Promise<IItemDropResponse> {
    if (this.apis) {
      return this.apis.itemDropByMonster();
    }

    return Promise.reject();
  }
  getStar(): Promise<IGetStarResponse> {
    if (this.apis) {
      return this.apis.getStar();
    }

    return Promise.reject();
  }
  getTotalStar(): Promise<IGetTotalStarResponse> {
    if (this.apis) {
      return this.apis.getTotalStar();
    }

    return Promise.reject();
  }
  getAllStarInEndGame(): Promise<IGetTotalStarResponse> {
    if (this.apis) {
      return this.apis.getAllStarInEndGame();
    }

    return Promise.reject();
  }
  upgradeGun(): Promise<IUpgradeGunResponse> {
    if (this.apis) {
      return this.apis.upgradeGun();
    }

    return Promise.reject();
  }
  isPossibleStealCard(victimMsisdn: string): Promise<IPossibleStealResponse> {
    if (this.apis) {
      return this.apis.isPossibleStealCard(victimMsisdn);
    }

    return Promise.reject();
  }
  isPossibleStealTurn(victimMsisdn: string): Promise<IPossibleStealResponse> {
    if (this.apis) {
      return this.apis.isPossibleStealTurn(victimMsisdn);
    }

    return Promise.reject();
  }
  stealCard(victimMsisdn: string): Promise<IStealCardResponse> {
    if (this.apis) {
      return this.apis.stealCard(victimMsisdn);
    }

    return Promise.reject();
  }
  stealTurn(victimMsisdn: string): Promise<IStealTurnResponse> {
    if (this.apis) {
      return this.apis.stealTurn(victimMsisdn);
    }

    return Promise.reject();
  }
  shareCard(toMsisdn: string, cardCode: string): Promise<IShareCardResponse> {
    if (this.apis) {
      return this.apis.shareCard(toMsisdn, cardCode);
    }

    return Promise.reject();
  }
  getNotification(
    offset: number,
    limit: number
  ): Promise<INotificationResponse> {
    if (this.apis) {
      return this.apis.getNotification(offset, limit);
    }

    return Promise.reject();
  }
  getPremiumPrize(): Promise<IAnnouncementResponse> {
    if (this.apis) {
      return this.apis.getPremiumPrize();
    }

    return Promise.reject();
  }
  setLanguage(language: string): Promise<ISetLanguageReponse> {
    if (this.apis) {
      return this.apis.setLanguage(language);
    }

    return Promise.reject();
  }

  getRankStar(type: "THIS_WEEK" | "LAST_WEEK"): Promise<IRankStarResponse> {
    if (this.apis) {
      return this.apis.getRankStar(type);
    }

    return Promise.reject();
  }
}

export interface IApi {
  getTest: Function;
  gameAction: Function;
  getTurn: Function;
  getTurnHistory: (offset: number, limit: number) => Promise<ITurnHistoryResponse>;
  getPrizeHistory: (offset: number, limit: number) => Promise<IPrizeHistoryResponse>;
  getPlayerInfo: () => Promise<IPlayerInfoResponse>;
  createGame: (gunType: string) => Promise<IGameInfoResponse>;
  killBoss: () => Promise<IBossRewardResponse>;
  createNextWave: () => Promise<IWaveInfoResponse>;
  createEndGame: (star: number, score: number) => Promise<IEndGameResponse>;
  checkDailyLogin: () => Promise<IDailyLoginResponse>;
  searchFriend: (msisdnFriend: string) => Promise<IFriendResponse>;
  shareFB: () => Promise<IShareResponse>;
  getAllFriend: () => Promise<IFriendsResponse>;
  addFriend: (msisdnFriend: string) => Promise<IAddFriendResponse>;
  getGameDefines: () => Promise<IGameDefineResponse>;
  getLevelDefines: (level: number) => Promise<ILevelDefineResponse>;
  getWeeklyTopStar: (
    offset: number,
    limit: number
  ) => Promise<ITopStarResponse>;
  getWeeklyTopHighStar: (
    offset: number,
    limit: number
  ) => Promise<ITopStarResponse>;
  getMonthlyTopStar: (
    offset: number,
    limit: number
  ) => Promise<ITopStarResponse>;
  getMonthlyTopHighStar: (
    offset: number,
    limit: number
  ) => Promise<ITopStarResponse>;
  getTopTotalStarLastWeek: (
    offset: number,
    limit: number
  ) => Promise<ITopStarResponse>;
  getGrandPrize: (
    offset: number,
    limit: number
  ) => Promise<IGrandPrizeResponse>;
  getListAnimalMySelf: () => Promise<IAnimalsResponse>;
  getAnimalFriend: (friendMsisdn: string) => Promise<IFriendAnimalsResponse>;
  getRequestBuyTurn: (buyTurnType: string) => Promise<IRequestBuyTurnResponse>;
  implementBuyTurn: (
    otp: string,
    buyingTurnLogId: string
  ) => Promise<IBuyTurnResponse>;
  getRequestBuyGun: (
    gunTypeEnum: string,
    amountGun: number
  ) => Promise<IRequestBuyGunResponse>;
  implementBuyGun: (
    otp: string,
    buyingGunLogId: string
  ) => Promise<IBuyGunResponse>;
  getGunInfo: () => Promise<IGunInfoResponse>;
  tempDie: () => Promise<ITempDieResponse>;
  getComboRevive: (
    comboReviveGun: string
  ) => Promise<IRequestBuyRevivalResponse>;
  buyComboRevive: (
    otp: string,
    buyingRevivalLogId: string
  ) => Promise<IBuyRevivalResponse>;
  getInfoLock: () => Promise<ILockInfoResponse>;
  getLockCard: (cardCode: string) => Promise<ILockCardResponse>;
  getUnlockCard: (cardCode: string) => Promise<ILockCardResponse>;
  itemDropByMonster: () => Promise<IItemDropResponse>;
  getStar: () => Promise<IGetStarResponse>;
  getTotalStar: () => Promise<IGetTotalStarResponse>;
  getAllStarInEndGame: () => Promise<IGetTotalStarResponse>;
  upgradeGun: () => Promise<IUpgradeGunResponse>;
  isPossibleStealCard: (victimMsisdn: string) => Promise<IPossibleStealResponse>;
  isPossibleStealTurn: (
    victimMsisdn: string
  ) => Promise<IPossibleStealResponse>;
  stealCard: (victimMsisdn: string) => Promise<IStealCardResponse>;
  stealTurn: (victimMsisdn: string) => Promise<IStealTurnResponse>;
  shareCard: (
    toMsisdn: string,
    cardCode: string
  ) => Promise<IShareCardResponse>;
  getNotification: (
    offset: number,
    limit: number
  ) => Promise<INotificationResponse>;
  getPremiumPrize: () => Promise<IAnnouncementResponse>;
  setLanguage: (language: string) => Promise<ISetLanguageReponse>;
  getRankStar: (type: string) => Promise<IRankStarResponse>;
}
