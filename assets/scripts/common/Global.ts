import GameDefine from "../game/GameDefine";

declare global {
  interface Window {
    language: string;
    gameLanguage: string;
    userName: string;
  }
}

window.gameLanguage = window.language || GameDefine.LANGUAGE_DEFAULT;
window.userName = window.userName || "Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Global extends cc.Component {
  onLoad() {}
}
