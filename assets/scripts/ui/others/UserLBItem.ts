const {ccclass, property} = cc._decorator;

@ccclass
export default class UserLBItem extends cc.Component {

    @property(cc.Label) lblUserName: cc.Label = null;
    @property(cc.Label) lblRank: cc.Label = null;
    @property(cc.Label) lblStarAmount: cc.Label = null;
    @property(cc.ScrollView) ScrollViewLB: cc.ScrollView = null;

    static Instance: UserLBItem = null;
    public userRank: number = 0;
    public userName: string = "";

    onLoad() {
        UserLBItem.Instance = this;
    }

    init(data) {
        this.node.active = !(data.me.rank < 10 && data.me.rank > 0);
        this.ScrollViewLB.node.height = this.node.active ? 450 : 550;
        this.userName = data.me.nickName;
        this.lblUserName.string = data.me.nickName;
        this.lblRank.string = data.me.rank ? data.me.rank : "-";
        this.lblStarAmount.string = data.me.score;
        this.userRank = data.me.rank;
    }
}
