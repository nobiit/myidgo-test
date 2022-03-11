const { ccclass, property } = cc._decorator;
import SingletonComponent from "../utils/SingletonComponent";
import GameDefine, { ENABLE_LOG } from "../game/GameDefine";

export enum GameStates {
}

@ccclass
export default class GameMgr extends SingletonComponent<GameMgr>() {
}
