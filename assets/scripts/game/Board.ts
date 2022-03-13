// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventManager from "../common/EventManager";
import { ActionIngame, EventType } from "./Define";
import Tile from "./Tile";

const TILE_SIZE = 46;
const TILE_TYPE_MAX = 6;
const {ccclass, property} = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    @property() numOfColumn: number = 0;
    @property() numOfRow: number = 0;
    @property(cc.Prefab) tilePrefab: cc.Prefab = null;

    private tiles: Array<Array<Tile>> = []; 
    // LIFE-CYCLE CALLBACKS:

    init(){
        for (let i = 0; i < this.numOfRow; i++) {
            let rowTiles:Array<Tile> = [];
            for (let j = 0; j < this.numOfColumn; j++) {
                let tile = cc.instantiate(this.tilePrefab);
                let tileComponent = tile.getComponent(Tile);
                let pos = this.getTilePos(i, j);
                tileComponent.setPos(pos.x, pos.y);

                let indexColor = Math.floor(Math.random() * TILE_TYPE_MAX)
                tileComponent.init(indexColor, i, j);
                this.node.addChild(tile);
                // this.tiles[i][j] = tileComponent;
                rowTiles[j] = tileComponent;
            }
            this.tiles[i] = rowTiles;
        }

        EventManager.on(EventType.INGAME, this.onTileEvent.bind(this));
    }

    private onTileEvent(paramaters:any){
        // console.log(paramaters.rowIndex, paramaters.colIndex);
        let row = paramaters.rowIndex;
        let col = paramaters.colIndex;
        let newRow = row; 
        let newCol = col;
        switch(paramaters.action){
            case ActionIngame.TILE_MOVE_LEFT:{
                if(col-1 < 0) return;
                newCol = col-1;  
                break;
            }
            case ActionIngame.TILE_MOVE_RIGHT:{
                if(col+1 >= this.numOfColumn) return;
                newCol = col+1;
                break;
            }
            case ActionIngame.TILE_MOVE_UP:{
                if(row+1 >= this.numOfRow) return;
                newRow = row+1;
                break;
            }
            case ActionIngame.TILE_MOVE_DOWN:{
                if(row-1 < 0) return;
                newRow = row-1;
                break;
            }
        }
        let p1 = this.getTilePos(row, col);
        let p2 = this.getTilePos(newRow, newCol);
        this.tiles[row][col].moveToPos(p2.x, p2.y, newRow, newCol);
        this.tiles[newRow][newCol].moveToPos(p1.x, p1.y, row, col);

        let tileTmp = this.tiles[row][col];
        this.tiles[row][col] = this.tiles[newRow][newCol];
        this.tiles[newRow][newCol] = tileTmp; 
    }

    private getTilePos(row:number, col:number){
        return {
            x: (col - (this.numOfColumn - 1) / 2) * TILE_SIZE,
            y: (row - (this.numOfRow - 1) / 2) * TILE_SIZE
        }
    }
}
