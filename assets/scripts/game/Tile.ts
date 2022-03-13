import EventManager from "../common/EventManager";
import { ActionIngame, EventType } from "./Define";

const COLOR_LIST = [
    cc.Color.BLUE,
    cc.Color.GRAY,
    cc.Color.GREEN,
    cc.Color.RED,
    cc.Color.BLACK,
    cc.Color.YELLOW,
]
enum STATE {
    IDLE, 
    MOVE
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
    @property(cc.Node) private sprite: cc.Node = null;
    @property() private moveDuration: number = 0.5;

    private indexColor:number = -1;
    private touchStartPoint: any = null;
    private offsetEnableMove: number = 30;
    private posIndex:any = null;
    private state: number = STATE.IDLE;

    // LIFE-CYCLE CALLBACKS:
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.touchStartPoint = {
                x: event.getLocationX(),
                y: event.getLocationY()
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            this.handleEnableMove(event);
        });
    }

    init(indexColor:number, rowIndex:number, colIndex:number){
        this.indexColor = indexColor;
        this.sprite.color = COLOR_LIST[indexColor];

        this.setPosIndex(rowIndex, colIndex)
        this.state = STATE.IDLE;
    }

    setPos(x:number, y:number){
        this.node.setPosition(x, y);
    }

    moveToPos(x:number, y:number, rowIndex:number, colIndex: number){
        cc.tween(this.node)
        .to(this.moveDuration, {position:cc.v2(x, y)})
        .call(_=>{
            this.state = STATE.IDLE;    
        })
        .start();
        //
        this.setPosIndex(rowIndex, colIndex);
        this.state = STATE.MOVE;
    }

    private setPosIndex(rowIndex:number, colIndex:number){
        this.posIndex = {
            rowIndex: rowIndex,
            colIndex: colIndex
        }
    }

    private handleEnableMove(event){
        if(!this.touchStartPoint || this.state != STATE.IDLE) return;
        //
        let offsetX = event.getLocationX()-this.touchStartPoint.x;
        let offsetY = event.getLocationY()-this.touchStartPoint.y;
        if( Math.max(
                Math.abs(offsetX), 
                Math.abs(offsetY)
            ) > this.offsetEnableMove
        ){
            let actionName = ActionIngame.TILE_MOVE_LEFT
            if(Math.abs(offsetX) > Math.abs(offsetY))
                actionName = (offsetX > 0) ? ActionIngame.TILE_MOVE_RIGHT : ActionIngame.TILE_MOVE_LEFT;
            else
                actionName = (offsetY > 0) ? ActionIngame.TILE_MOVE_UP : ActionIngame.TILE_MOVE_DOWN;
            EventManager.emit(
                EventType.INGAME,
                {action: actionName, rowIndex: this.posIndex.rowIndex, colIndex: this.posIndex.colIndex}
            )
            //
            this.touchStartPoint = null;
        }
    }
}
