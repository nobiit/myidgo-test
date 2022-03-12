// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Tile from "./Tile";

const TILE_SIZE = 46;
const TILE_TYPE_MAX = 6;
const {ccclass, property} = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    @property() numOfColumn: number = 0;
    @property() numOfRow: number = 0;
    @property(cc.Prefab) tilePrefab: cc.Prefab;

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
                tileComponent.init(indexColor);
                this.node.addChild(tile);
                // this.tiles[i][j] = tileComponent;
                rowTiles[j] = tileComponent;
            }
            this.tiles[i] = rowTiles;
        }
    }

    private getTilePos(row:number, col:number){
        return {
            x: (col - (this.numOfColumn - 1) / 2) * TILE_SIZE,
            y: (row - (this.numOfRow - 1) / 2) * TILE_SIZE
        }
    }
}
