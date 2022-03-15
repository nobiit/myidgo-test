import EventManager from "../common/EventManager";
import { ActionIngame, EventType } from "./Define";

const COLOR_LIST = [
    cc.Color.BLUE,
    cc.Color.GRAY,
    cc.Color.GREEN,
    cc.Color.RED,
    cc.Color.BLACK,
    cc.Color.YELLOW,
    cc.Color.ORANGE,
    cc.Color.MAGENTA
]
enum STATE {
    IDLE, 
    MOVE, 
    HIDE,
    SHOW,
    NONE
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
    @property(cc.Node) private sprite: cc.Node = null;
    @property(cc.Label) private lblSpecialNumer: cc.Label = null;
    @property() private moveDuration: number = 0.5;
    @property() private shiftDuration: number = 0.5;

    get IndexType(){
        return this.indexType;
    }
    get IsIdling(){
        return this.state == STATE.IDLE;
    }
    get IsHiding(){
        return this.state == STATE.HIDE;
    }
    get IsNone(){
        return this.state == STATE.NONE;
    }
    get PosIndex(){
        return {row: this.posIndex.rowIndex, col:this.posIndex.colIndex}
    }

    private indexType:number = -1;
    private touchStartPoint: any = null;
    private offsetEnableMove: number = 30;
    private posIndex:any = null;
    private isSpecial:boolean = false;
    private state: number = STATE.SHOW;

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
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if(this.isSpecial && this.IsIdling)
            EventManager.emit(
                EventType.INGAME,
                {
                    action: ActionIngame.BOARD_CHECK_SPECIAL, rowIndex: this.posIndex.rowIndex, colIndex: this.posIndex.colIndex,
                    specialType: this.lblSpecialNumer.string
                }
            )
        });
        this.lblSpecialNumer.node.active = false;
    }

    init(indexType:number, rowIndex:number, colIndex:number){
        if(indexType == 6){
            this.isSpecial = true;
            this.lblSpecialNumer.node.active = true;
            this.lblSpecialNumer.string = '4';
            this.sprite.color = COLOR_LIST[indexType];
            this.indexType = indexType;
        }
        else if(indexType == 7){
            this.isSpecial = true;
            this.lblSpecialNumer.node.active = true;
            this.lblSpecialNumer.string = '5';
        }
        else{
            this.sprite.color = COLOR_LIST[indexType];
            this.indexType = indexType;
        }

        this.setPosIndex(rowIndex, colIndex)
        //
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.25, {scale:1})
            .call(_=>{
                this.state = STATE.IDLE;
            })
            .start();
        this.state = STATE.SHOW;
    }

    setPos(x:number, y:number){
        this.node.setPosition(x, y);
    }

    moveToPos(x:number, y:number, rowIndex:number, colIndex: number){
        cc.tween(this.node)
        .to(this.moveDuration, {position:cc.v2(x, y)})
        .call(_=>{
            this.state = STATE.IDLE;    
            EventManager.emit(
                EventType.INGAME,
                {action: ActionIngame.BOARD_CHECK_INDEX_MATCH, rowIndex: this.posIndex.rowIndex, colIndex: this.posIndex.colIndex}
            )
        })
        .start();
        //
        this.setPosIndex(rowIndex, colIndex);
        this.state = STATE.MOVE;
    }

    hide(){
        cc.tween(this.node)
            .to(0.25, {scale:0})
            .call(_=>{
                this.state = STATE.NONE;
            })
            .start();
        //
        this.isSpecial = false;
        this.lblSpecialNumer.node.active = false;
        this.state = STATE.HIDE;
    }

    shiftTo(y:number, rowIndex:number, colIndex:number){
        cc.tween(this.node)
            .to(this.shiftDuration, {position:cc.v2(this.node.x, y)}, {easing: 'sineOut'})
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
