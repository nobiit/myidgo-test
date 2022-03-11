import APIMgr from "../common/APIMgr";
import { ENABLE_LOG, FetchListViewTypes } from "../game/GameDefine";
import UserLBItem from "../ui/others/UserLBItem";
import ListView from "./ListView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListViewFetchData extends ListView {
  @property({ type: FetchListViewTypes }) protected ListViewType: number = 0;
  @property(cc.Integer) private FetchLimit: number = 10;
  // @property(cc.String) private DataKey: string = '';

  private mCanFetchData: boolean;
  private mPageOffset: number;
  private mIsAppend: boolean;
  private dayOffset: number = 0;

  onLoad() {
    super.onLoad();
    this.registerEvent(
      ListView.EventBounceBottom,
      this.fetchData.bind(this, true)
    );

    this.onFetchSuccess = this.onFetchSuccess.bind(this);
    this.onFetchFail = this.onFetchFail.bind(this);
  }

  onEnable() {
    this.init();
  }

  changeListViewDayOffset(dayOffset: number) {
    this.dayOffset = dayOffset;
  }

  changeListViewType(newType: number) {
    this.ListViewType = newType;
    this.init();
  }

  private init() {
    this.mCanFetchData = true;
    this.mPageOffset = 0;
    this.updateInfo([]);
    this.fetchData(false);
  }

  private fetchData(isAppend: boolean) {
    if (!this.mCanFetchData) {
      return;
    }
    this.mCanFetchData = false;
    this.mIsAppend = isAppend;

    this.show(this.mIsAppend);

    APIMgr.solveApi(
      APIMgr.fetchListView(
        this.ListViewType,
        this.mPageOffset,
        this.FetchLimit,
        this.dayOffset
      ),
      this.onFetchSuccess,
      this.onFetchFail,
      this.mPageOffset <= 0,
    );
  }

  protected onFetchSuccess(res) {
    this.mCanFetchData = true;

    let list = null;

    switch(this.ListViewType) {
      case FetchListViewTypes.LBCurrentWeekly:
        // PopupLeaderboard.instance.lblLeaderBoardTilte.string = `Ngày: ${res.data.date}`;
      case FetchListViewTypes.LBPreviousWeekly:
      case FetchListViewTypes.LBGlobal:
        list = res.data.entries;
        UserLBItem.Instance.init(res.data);
        //
        if(res.data.me.rank <= 3){
          // PopupMgr.push(Popups.PopupTop3LB);
        }
        break;
      case FetchListViewTypes.RewardHistory:
        list = res.data.items;
        list.sort((a, b) =>{
          let t1 = this.formatDateTime(a.claimedAt);
          let t2 = this.formatDateTime(b.claimedAt);
          if (Date.parse(t1) > Date.parse(t2)) {
            return -1;
          }
          if (Date.parse(t1) < Date.parse(t2)) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
        break;
      case FetchListViewTypes.PremiumRewardHistory:
      case FetchListViewTypes.TurnHistory:
        list = res.data.items;
        break;
      default: 
        list = res.result;
        break;
    }

    this.mPageOffset += list.length;

    if (!this.mIsAppend) {
      this.updateInfo(list);
    } else {
      this.appendInfo(list);
    }

    this.show();

    this.logApi(this.ListViewType, res);
  }

  private formatDateTime(time){
    let t = time.split('/');
    let t2 = [t[1], t[0], t[2]];
    return t2.join('/');
  }

  private onFetchFail(err) {
    this.mCanFetchData = true;
    this.show();

    this.logApi(this.ListViewType, err);
  }

  private show(isShow: boolean = true) {
    this.node.opacity = isShow ? 255 : 0;
  }

  private logApi(listViewType, logInfo){
    if(!ENABLE_LOG) return;
    switch(listViewType) {
      case FetchListViewTypes.LBCurrentWeekly:
        console.log('getWeeklyLeaderboard', logInfo)
        break;
      case FetchListViewTypes.LBPreviousWeekly:
        console.log('getWeeklyLeaderboard', logInfo)
        break;
      case FetchListViewTypes.LBGlobal:
        console.log('getGlobalLeaderboard', logInfo)
        break;
      case FetchListViewTypes.RewardHistory:
        console.log('getRewardsHistory', logInfo)
        break;
      case FetchListViewTypes.PremiumRewardHistory:
        console.log('getPremiumRewardHistory', logInfo)
        break;
      case FetchListViewTypes.TurnHistory:
        console.log('getTicketsHistory', logInfo)
        break;
    }
  }
}
