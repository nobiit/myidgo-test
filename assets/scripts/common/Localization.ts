const { ccclass, property } = cc._decorator;
import * as STRINGS from "../../strings";
import Events from "./EventManager";

const enumObj = {};
export const LOCALIZATION_KEYS = Object.keys(STRINGS);
for (let i = 0; i < LOCALIZATION_KEYS.length; i++) {
  enumObj[LOCALIZATION_KEYS[i]] = i;
}

export const LOCALIZATION_ENUM = cc.Enum(enumObj);
export const TextTransforms = cc.Enum({
  None: 0,
  Upper: 1,
  Lower: 2,
});

@ccclass
export default class Localization extends cc.Component {
  static get language() {
    return window.gameLanguage;
  }

  static GetLocalizedString(key: string): string {
    if (STRINGS[key]) return STRINGS[key][this.language.toUpperCase()] || "";
    return "";
  }

  static ChangeLanguage(language: string) {
    window.gameLanguage = language;
    Events.emit(Events.EventLanguageChanged);
  }
}
