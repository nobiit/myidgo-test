import EventManager from "../common/EventManager";
import { ActionIngame, EventType } from "./Define";
import EnemyMgr from "./EnemyMgr";
import Tile from "./Tile";

const TILE_SIZE = 46;
const TILE_TYPE_MAX = 6;
enum STATE {
    SHIFT, 
    IDLE, 
    ANIMATE,
    SHUFFLE,
    FRENZY
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    @property() numOfColumn: number = 0;
    @property() numOfRow: number = 0;
    @property(cc.Prefab) tilePrefab: cc.Prefab = null;

    private tiles: Array<Array<Tile>> = []; 
    private ADJACENT_DIRECTION:any = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];
    private state = STATE.IDLE;

    private enemyMgr:EnemyMgr = null;
    // LIFE-CYCLE CALLBACKS:

    init(enemyMgr:EnemyMgr){
        this.enemyMgr = enemyMgr;
        //
        for (let i = 0; i < this.numOfRow; i++) {
            let rowTiles:Array<Tile> = [];
            for (let j = 0; j < this.numOfColumn; j++) {
                let tile = cc.instantiate(this.tilePrefab);
                let tileComponent = tile.getComponent(Tile);
                let pos = this.getTilePos(i, j);
                tileComponent.setPos(pos.x, pos.y);

                let indexType = this.randomTileType();
                tileComponent.init(indexType, i, j);
                this.node.addChild(tile);
                // this.tiles[i][j] = tileComponent;
                rowTiles[j] = tileComponent;
            }
            this.tiles[i] = rowTiles;
        }

        EventManager.on(EventType.INGAME, this.onBoardEvent.bind(this));
    }

    protected update(dt: number): void {
        switch(this.state){
            case STATE.ANIMATE:{
                for(let child of this.node.children){
                    if(child.getComponent(Tile).IsHiding) return;
                }
                this.state = STATE.SHIFT;
                this.shiftTiles();
                break;
            }
            case STATE.SHIFT:{
                for(let child of this.node.children){
                    if(!child.getComponent(Tile).IsIdling) return;
                }
                this.state = STATE.IDLE;
                break;
            }
        }
    }

    private onBoardEvent(paramaters:any){
        // console.log(paramaters.rowIndex, paramaters.colIndex);
        let row = paramaters.rowIndex;
        let col = paramaters.colIndex;
        switch(paramaters.action){
            case ActionIngame.TILE_MOVE_LEFT:{
                if(col-1 < 0) return;
                this.swapTilePosition(row, col, row, col-1);
                break;
            }
            case ActionIngame.TILE_MOVE_RIGHT:{
                if(col+1 >= this.numOfColumn) return;
                this.swapTilePosition(row, col, row, col+1);
                break;
            }
            case ActionIngame.TILE_MOVE_UP:{
                if(row+1 >= this.numOfRow) return;
                this.swapTilePosition(row, col, row+1, col);
                break;
            }
            case ActionIngame.TILE_MOVE_DOWN:{
                if(row-1 < 0) return;
                this.swapTilePosition(row, col, row-1, col);
                break;
            }
            case ActionIngame.BOARD_CHECK_INDEX_MATCH:{
                this.checkIndexType(row, col);
                break;
            }
            case ActionIngame.BOARD_CHECK_SPECIAL:{
                if(paramaters.specialType == '4'){
                    this.enableSpecial4(row, col);
                }
                if(paramaters.specialType == '5'){
                    this.enableSpecial5(row, col);
                }
                break;
            }
        }
    }

    private checkIndexType(row:number, col:number){
        let matchedTiles = this.getAllMatchesAt(row, col);
        // console.log(matchedTiles)
        // return;
        if(matchedTiles.length > 2){
            for (let p of matchedTiles) {
                // if (!StateIngame.isTutorial) {
                //     this.score += GameDefine.TILE_SCORE;
                //     FrenzyBar.AddEnergy(GameDefine.TILE_SCORE);

                //     // ScoreBar.SetCurrentScore(this.score);
                // }
                this.tiles[p[0]][p[1]].hide();
            }
            this.state = STATE.ANIMATE;
            //
            if(matchedTiles.length == 4){
                this.tiles[row][col].init(6, row, col);
            }
            else if(matchedTiles.length > 4){
                this.tiles[row][col].init(7, row, col);
            }
        }
    }

    private enableSpecial5(row:number, col:number){
        for (let i = 0; i < this.numOfRow; i++) {
            for (let j = 0; j < this.numOfColumn; j++) {
                let tileComp = this.tiles[i][j];
                if(tileComp.IsIdling && tileComp.IndexType == this.tiles[row][col].IndexType){
                    tileComp.hide();
                }
            }
        }
        this.state = STATE.ANIMATE;
    }

    private enableSpecial4(row:number, col:number){
        this.tiles[row][col].hide();
        for(let i=0; i < this.numOfRow; i++){
            if(i != row) this.tiles[i][col].hide();        
        }
        for(let j=0; j < this.numOfColumn; j++){
            if(j != col) this.tiles[row][j].hide();        
        }
        this.state = STATE.ANIMATE;
    }

    private swapTilePosition(row, col, newRow, newCol){
        if(!this.isTileValid(row, col) || !this.isTileValid(newRow, newCol)) return;
        //
        let p1 = this.getTilePos(row, col);
        let p2 = this.getTilePos(newRow, newCol);
        this.tiles[row][col].moveToPos(p2.x, p2.y, newRow, newCol);
        this.tiles[newRow][newCol].moveToPos(p1.x, p1.y, row, col);

        let tileTmp = this.tiles[row][col];
        this.tiles[row][col] = this.tiles[newRow][newCol];
        this.tiles[newRow][newCol] = tileTmp; 

        // this.logPosIndex();
    }

    private shiftTiles(){
        for (let j = 0; j < this.numOfColumn; j++) {
            let noneTiles = [];
            let count = 0;
            for (let i = this.numOfRow - 1; i >= 0; i--) {
                if (this.tiles[i][j].IsNone) {
                    count++;
                    noneTiles.push(this.tiles[i][j]);
                } else if (count > 0) {
                    let newPos = this.getTilePos(i+count, j);
                    this.tiles[i][j].shiftTo(newPos.y, i+count, j);
                    this.tiles[i + count][j] = this.tiles[i][j];
                };
            }
            for (let n = 0; n < count; n++) {
                let nTile = noneTiles[n];
                let curPos = this.getTilePos(-n - 1, j);
                nTile.init(this.randomTileType(), nTile.PosIndex.row, j);
                nTile.setPos(curPos.x, curPos.y);

                let movePos = this.getTilePos(-(n + 1) + count, j);
                nTile.shiftTo(movePos.y, -(n + 1) + count, j);
                this.tiles[-(n + 1) + count][j] = nTile;
            }
        }
        this.logPosIndex();
    }

    private getTilePos(row:number, col:number){
        return {
            x: (col - (this.numOfColumn - 1) / 2) * TILE_SIZE,
            y: (row - (this.numOfRow - 1)) * TILE_SIZE - TILE_SIZE*0.5
        }
    }

    private getAllMatchesAt(row:number, col:number) {
        let matchList = [];
        matchList.push([row, col]);

        for (let i = 0; i < matchList.length; i++) {
            let tmp = this.getMatchesAdjacent(matchList[i][0], matchList[i][1]);
            for (let pos of tmp) {
                let flag = false;
                for (let check of matchList) {
                    if(check[0] == pos[0] && check[1] == pos[1]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) continue;

                matchList.push(pos);
            }
        }

        return matchList;
    }

    private getMatchesAdjacent(row:number, col:number) {
        let result = [];
        for (let i = 0; i < this.ADJACENT_DIRECTION.length; i++) {
            let dir = this.ADJACENT_DIRECTION[i];
            let newRow = row + dir[0];
            let newCol = col + dir[1];
            if (this.isTileValid(newRow, newCol) && this.tiles[row][col].IndexType == this.tiles[newRow][newCol].IndexType) {
                result.push([newRow, newCol]);
            }
        }
        return result;
    }

    private randomTileType(){
        return Math.floor(Math.random() * TILE_TYPE_MAX);
    }

    private isTileValid(row, col) {
        return row >= 0 && row < this.numOfRow && col >= 0 && col < this.numOfColumn && this.tiles[row][col].IsIdling;
    }

    private logPosIndex(){
        for (let i = 0; i < this.numOfRow; i++) {
            for (let j = 0; j < this.numOfColumn; j++) {
                let tileComp = this.tiles[i][j];
                if(tileComp.IsIdling){
                    if(i != tileComp.PosIndex.row || j != tileComp.PosIndex.col){
                        console.log(i, tileComp.PosIndex.row, j, tileComp.PosIndex.col)
                    }
                }
                
            }
        }
    }
}
