import SingletonComponent from "../utils/SingletonComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundMgr extends SingletonComponent<SoundMgr>() {
  @property({ type: cc.AudioClip }) BGM: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) BGM_MENU: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) BGM_BOSS: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_CLICK: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BUTTON_01: cc.AudioClip = null; //connect, buy now, home, play
  @property({ type: cc.AudioClip }) SFX_BUTTON_02: cc.AudioClip = null; //weapon -> equip
  @property({ type: cc.AudioClip }) SFX_BUTTON_03: cc.AudioClip = null; //weapon -> unlock
  @property({ type: cc.AudioClip }) SFX_BUTTON_08: cc.AudioClip = null; //hunt -> card
  @property({ type: cc.AudioClip }) SFX_BUTTON_09: cc.AudioClip = null; //hunt -> water
  @property({ type: cc.AudioClip }) SFX_BUTTON_10: cc.AudioClip = null; //hunt animal
  @property({ type: cc.AudioClip }) SFX_BULLET_MC: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BULLET_BOSS: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_MOP_DIE: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BOSS_02_ATTACK: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BOSS_03_TELEPORT: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BOSS_04_ATTACK: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BOSS_05_TELEPORT: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_BOSS_DIE: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_MC_DIE: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_COLLECT_BUFF: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_COLLECT_STAR: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_COLLECT_GIFT: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_END_GAME: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_FIREBALL_WARNING: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_FIREBALL: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_ATTENTION: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_OPEN_GIFT: cc.AudioClip = null;
  @property({ type: cc.AudioClip }) SFX_COUNT_DOWN: cc.AudioClip = null;

  static get IsMute() {
    return this.IsMusicMute && this.IsSfxMute;
  }
  static get IsMusicMute() {
    return cc.audioEngine.getMusicVolume() == 0;
  }
  static get IsSfxMute() {
    return cc.audioEngine.getEffectsVolume() == 0;
  }
  static get IsMusicPlaying() {
    return cc.audioEngine.isMusicPlaying();
  }

  static playMusic(clip: cc.AudioClip, loop: boolean = true) {
    cc.audioEngine.playMusic(clip, loop);
  }

  static playSfx(clip: cc.AudioClip, loop: boolean = false) {
    cc.audioEngine.playEffect(clip, loop);
  }

  static pauseMusic() {
    cc.audioEngine.pauseMusic();
  }

  static pauseAll() {
    cc.audioEngine.pauseAll();
  }

  static stopMusic() {
    cc.audioEngine.stopMusic();
  }

  static stopAll() {
    cc.audioEngine.stopAll();
  }

  static setMute(value: boolean = true) {
    const volume = Number(!value);
    this.setMusicVolume(volume);
    this.setSfxVolume(volume);
  }

  static setMuteMusic(value: boolean = true) {
    const volume = Number(!value);
    this.setMusicVolume(volume);
  }

  static setMuteSfx(value: boolean = true) {
    const volume = Number(!value);
    this.setSfxVolume(volume);
  }

  static setMusicVolume(value) {
    cc.audioEngine.setMusicVolume(value);
  }

  static setSfxVolume(value) {
    cc.audioEngine.setEffectsVolume(value);
  }

  static toggleMute() {
    this.setMute(!this.IsMute);
  }

  static toggleMuteMusic() {
    this.setMuteMusic(!this.IsMusicMute);
  }

  static toggleMuteSfx() {
    this.setMuteSfx(!this.IsSfxMute);
  }
}
