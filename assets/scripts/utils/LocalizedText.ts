const { ccclass, property, executeInEditMode } = cc._decorator;
import Events from "../common/Events";
import Localization, {
  LOCALIZATION_ENUM,
  LOCALIZATION_KEYS,
  TextTransforms,
} from "../common/Localization";

@ccclass
@executeInEditMode
export default class LocalizedText extends cc.Component {
  @property({ type: LOCALIZATION_ENUM }) private KeyIndex: number = 0;
  @property(cc.String) private Key: string = "";
  @property({ type: TextTransforms }) private TextTransform: number = 0;

  get LocalizationKey() {
    return this.Key;
  }
  set LocalizationKey(value) {
    this.Key = value;
    this.onEnable();
  }

  private mLabel: cc.Label;
  private mDefaultString: string;

  onLoad() {
    this.localize = this.localize.bind(this);
    //runtime only
    try {
      Events.registerEvent(Events.EventLanguageChanged, this.localize);
    } catch (e) {}

    this.mLabel = this.node.getComponent(cc.Label);
    this.mDefaultString = this.mLabel.string;
  }

  onDestroy() {
    //runtime only
    try {
      Events.unregisterEvent(Events.EventLanguageChanged, this.localize);
    } catch (e) {}
  }

  onEnable() {
    //include edit mode
    if (!this.Key) {
      if (this.KeyIndex != 0) {
        this.Key = LOCALIZATION_KEYS[this.KeyIndex] || "";
      }
    } else if (this.Key != LOCALIZATION_KEYS[this.KeyIndex]) {
      const index = LOCALIZATION_KEYS.indexOf(this.Key);
      this.KeyIndex = index != -1 ? index : 0;
    }

    this.localize();
  }

  private localize() {
    let string =
      Localization.GetLocalizedString(this.Key) || this.mDefaultString;
    switch (this.TextTransform) {
      case TextTransforms.None:
        break;
      case TextTransforms.Upper:
        string = string.toUpperCase();
        break;
      case TextTransforms.Lower:
        string = string.toLowerCase();
        break;
    }

    this.mLabel.string = string;
  }
}
