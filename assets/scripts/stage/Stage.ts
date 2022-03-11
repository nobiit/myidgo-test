import Events from "../common/Events";
import GameDefine from "../game/GameDefine";
import Timer from "../utils/Timer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Stage extends cc.Component {
  private ingameSessionTimer = new Timer();
  protected callbackEndSession:any = null;

  onLoad() {
    this.ingameSessionTimer.SetDuration(GameDefine.TIME_INGAME_SESSION);
    Events.registerEvent(
      Events.EventResetSession,
      ()=>{
        // console.log(this.ingameSessionTimer.FirstFinished())
        if(!this.ingameSessionTimer.FirstFinished()) this.ingameSessionTimer.Reset();
      }
    );
    Events.registerEvent(
      Events.EventStartSessionTimer,
      ()=>{
        if(!this.ingameSessionTimer.FirstFinished()) this.ingameSessionTimer.Reset();
        this.ingameSessionTimer.Start();
        // console.log('start')
      }
    );
    Events.registerEvent(
      Events.EventStopSessionTimer,
      ()=>{
        this.ingameSessionTimer.Stop();
        // console.log('stop')
      }
    );
    Events.registerEvent(Events.EventAddSessionTimer, (data)=>{
      // console.log(data.duration/1000)
      this.ingameSessionTimer.Add(data.duration/1000);
    })
  }

  public init() {
    this.ingameSessionTimer.Reset();
  }

  protected update(dt: number): void {
    this.ingameSessionTimer.Update(dt);
    if(this.ingameSessionTimer.FirstFinished()){
      const message = 'Thời gian lượt tham gia Dũng sĩ hổ vàng\nlần này đã hết, vui lòng truy cập lại';
      // PopupMgr.push(Popups.PopupError).getComponent(PopupError).init(message, ()=>{
      //   window.location.href = "viettelpay://back";
      //   // (window as any).location = 'viettelpay://back'
      // }, "Đóng");
      if(this.callbackEndSession){
        this.callbackEndSession();
        this.callbackEndSession = null;
      }
    }
  }
}
