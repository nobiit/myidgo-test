import { IGameInfo } from "../interface/game-info-response";
import { IItemDefine } from "../interface/item-drop-response";
import { IWaveInfo } from "../interface/wave-info-response";

let count = 0;
export const FetchListViewTypes = cc.Enum({
  HistoryReward: count++,
  HistoryAttempt: count++,
  FriendContacts: count++,
  LBTopStarWeekly: count++,
  LBTopStarMonthly: count++,
  LBTopStarPerTurnWeekly: count++,
  LBTopStarPerTurnMonthly: count++,
  LBGrandPrize: count++,
  Notification: count++,
  HistoryPlayTurn: count++,
  HistoryPrize: count++,
  Misson: count++,
  //new type
  LBCurrentWeekly: count++,
  LBPreviousWeekly: count++,
  LBGlobal: count++,
  RewardHistory: count++,
  TurnHistory: count++,
  PremiumRewardHistory: count++,
});

interface IGameDefine {
  doubleGunDuration: number;
  playerSpeeds: Array<number>;
  playerBulletSpeed: number;
  playerGunDamage: Array<number>;
  playerGunDamageIncrease: number;
  playerGunCooldown: Array<number>;
  playerGunCooldownDecrease: number;
  enemyHPIncreaseRate: number;
}

export interface ILevelDefine {
  normalWave: {
    quantity: number;
    hp: number;
  };
  bossWave: {
    type: number;
    hp: Array<number>;
    shootInterval: Array<number>;
    bulletSpeed: Array<number>;
    idleTime: number;
    longIdleTime: number;
    teleportTime: number;
  };
  itemDefine: {
    [name: string]: {
      spawnRate: number;
      quantityMax: number;
      spawnedQuantity?: number;
    };
  };
}

export default new (class GameDefine {
  public DEEP_LINK_BACK: string = "mytelpayeu://tabHome?";
  public DEEP_LINK_MISSION: Array<string> = [
    "", //buy attempt
    "mytelpayeu://cashIn?", //cash in
    "mytelpayeu://packDetail?3b293469-cb59-4867-b1d6-022702384fd3", //buy data pack
    "mytelpayeu://topUp?6d3fb605-cf78-4eae-be85-14efc3f28503", //top up
    "mytelpayeu://ftthV2?c7a065a0-f438-4794-a073-3dae7013b50b", //ftth
    'mytelpayeu://packDetail?eee2cb6c-be7a-40c4-9ed8-ca2631d86823', //game
    "mytelpayeu://ycdc?a83ca2a9-eb0d-4f93-a13b-c6301efa7bfd", //bill payment
  ];

  public DEEP_LINK_SHARE: string = "mytelpayeu://fb?";
  public DEEP_LINK_CONNECT_FB: string = "";
  public LANGUAGE_DEFAULT: string = "en";
  public SUPPORTED_LANGUAGES: Array<string> = ["en", "mu", "my"];

  public STRING_TIMEOUT: string = "TIMEOUT";
  public STRING_FULFILLED: string = "fulfilled";
  public STRING_REJECTED: string = "rejected";

  public GAME_VERSION: string = "1.1.1";
  public SHOW_GAME_DEBUG: boolean = true;
  public GAME_WIDTH: number = 576;
  public GAME_HEIGHT: number = 1024;

  public SPEED_GAME_BASE: number = 60;
  public ARR_SPEED_PLAYER: Array<number> = [];
  public SPEED_PLAYER: number = 7 * this.SPEED_GAME_BASE * 0.8 * 0.7;
  // public SPEED_PLAYER: number = 7 * this.SPEED_GAME_BASE;
  public SPEED_PLAYER_ACC: number = 0.2 * this.SPEED_GAME_BASE;
  public SPEED_PLAYER_INVINCIBLE: number = this.SPEED_PLAYER*1.5;
  // public SPEED_PLAYER_INVINCIBLE: number = 20 * this.SPEED_GAME_BASE;
  public SPEED_PLAYER_BULLET: number;
  public SPEED_BOSS_LV5_MISSLE_HOMING: number = 0.5 * this.SPEED_GAME_BASE;

  public POS_BOSS_HORIZONTAL_MOVE_LIMIT: number = 150;
  public POS_BOSS_READY_Y: number = 300;
  public POS_BOSS_TELEPORT_Y_MIN: number = 150;
  public POS_BOSS_TELEPORT_Y_MAX: number = 300;

  public DISTANCE_METEOR_MIN: number = 100;

  public TIME_INGAME_SESSION: number = 120;

  public TIME_API_TIMEOUT: number = 15;
  public TIME_GAME_PLAY: number = 60;
  public TIME_TUTORIAL: number = 3;
  public TIME_FOR_SPAWNED_OBJECT_READY: number = 1;
  public TIME_FOR_SPAWNED_FIREBALL_READY: number = 5;
  public TIME_PLAYER_WEAPON_COOLDOWN: Array<number> = [];
  public TIME_PLAYER_WEAPON_COOLDOWN_MIN: number = 0.05;
  public TIME_PLAYER_WEAPON_COOLDOWN_DECREASE: number;
  public TIME_PLAYER_IDLE_FOR_SPAWN_FIREBALL: number = 4;
  public TIME_BOSS_04_READY_TO_CRUSH: number = 2;
  public TIME_NEXT_LEVEL_DELAY: number = 2;
  public TIME_PLAYER_INVINCIBLE: number = 5;
  public TIME_PLAYER_INVINCIBLE_WARNING: number = 3.5;
  public TIME_DOUBLE_GUN_DURATION: number = 15;

  public HP_PERCENT_ENEMY_INCREASE: number; //each 5 levels
  public DAMAGE_PLAYER_GUN: Array<number> = [];
  public DAMAGE_PLAYER_GUN_INCREASE: number;

  public RATIO_HIGH_DEVICE_MIN = 2;
  public RATIO_ENEMY_DROP_ITEM = 50;//30;

  public QTY_POOL_DEFAULT = 10;
  public QTY_BOSS_MISSLES_PER_SHOT = 5;
  public QTY_BOSS_04_MULTIPLY = 2;
  public QTY_STAR_TARGET = 5;

  public AMOUNT_BG_COVER_OPACITY = 235;

  public IS_SUPPORT_OTP_CREDENTIAL = 'OTPCredential' in window;

  // next index: 27;
  public GAME_OBJECT_TYPES = {
    ITEM_STAR: 0,
    ITEM_GIFT: 16,
    ITEM_INVINCIBLE: 8,
    ITEM_WEAPON_DOUBLE: 9,
    BULLET_PLAYER_NORMAL: 1,
    BULLET_BOSS_NORMAL: 14,
    BULLET_BOSS_MISSLE: 12,
    BULLET_BOSS_MISSLE_ICE: 22,
    BULLET_BOSS_MISSLE_THUNDER: 25,
    BULLET_BOSS_03: 24,
    BULLET_BOSS_05: 26,
    ENEMY_01: 2,
    ENEMY_02: 3,
    ENEMY_03: 4,
    ENEMY_04: 5,
    ENEMY_05: 13,
    ENEMY_BOSS_01: 6,
    ENEMY_BOSS_02: 10,
    ENEMY_BOSS_03: 11,
    ENEMY_BOSS_04: 17,
    ENEMY_BOSS_05: 18,
    OBSTACLE_FIREBALL: 7,
    FIREBALL_INDICATOR: 15,
    EFFECT_ENEMY_DIE: 19,
    EFFECT_COLLECT_ITEM: 20,
    EFFECT_BOSS_DIE: 21,
    EFFECT_BOSS_02_ATTACK: 23,
  };

  public QTY_POOLS = {
    [this.GAME_OBJECT_TYPES.BULLET_PLAYER_NORMAL]: 50,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_NORMAL]: 30,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_03]: 30,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_05]: 30,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE]: 10,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE_ICE]: 10,
    [this.GAME_OBJECT_TYPES.BULLET_BOSS_MISSLE_THUNDER]: 10,
    [this.GAME_OBJECT_TYPES.EFFECT_BOSS_02_ATTACK]: 1,
  };

  public LEVELS: Array<ILevelDefine> = [];
  public ITEM_DEFINES: Array<IItemDefine> = [];

  constructor() {
    if (this.SHOW_GAME_DEBUG) {
      console.warn("Playing in debug mode.");
    }

    // console.warn('Using debug token.');
    // (window as any).token = '9facdad7dcdadbdadadce1dfdfe0adbcfd17262b1822d5f818d8012f29231e00cea6c1c42832c51e1c1e1643203a133d1d3e2b1c34192e0a391d12523d2033583927374e453827284c5459544c563f4548474b4b403a4f60502a3f5b4e663f334c586c35656e577f5d5c717a6c51463f717e5e4269586b64666f52717e5d5a5b1f2c6e8c705872a0805b76a168692d2e2f303132333435383738393a3b3c95.b110061f7054e7375d471cfc9817825645138fd5c70fe000320403045e0a83a04a551231fdf6edc35c3cd8dd536ebfa6534f04b7071a7c90e505c4e8848ccf3f';
    // (window as any).service_host = 'wss://mypa-uat.mytelpay.elofun.net';
    // (window as any).DEBUG_API = true;
    // const script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = 'https://mypa-uat.mytelpay.elofun.net/services/gateway.js';
    // document.body.appendChild(script);
  }

  load(jsonData: any, isRevive = false) {
    // console.log(JSON.stringify(jsonData));
    if (this.SHOW_GAME_DEBUG) {
      const defines: IGameDefine = jsonData.gameDefines;

      if (jsonData.indexWave) {
        //next wave
        const level = jsonData as IWaveInfo;
        this.LEVELS.push(
          this.loadLevel(level, {
            INVINCIBLE: {
              spawnRate: 0.1,
              quantityMax: 3,
            },
            WEAPON_DOUBLE: {
              spawnRate: 0.1,
              quantityMax: 3,
            },
            STAR: {
              spawnRate: 0.8,
              quantityMax: 35,
            },
          })
        );

        return;
      }

      this.LEVELS.push(...jsonData.levels);
      this.TIME_PLAYER_WEAPON_COOLDOWN.push(...defines.playerGunCooldown);
      this.TIME_PLAYER_WEAPON_COOLDOWN_DECREASE =
        defines.playerGunCooldownDecrease;
      this.ARR_SPEED_PLAYER = defines.playerSpeeds;
      this.SPEED_PLAYER = this.ARR_SPEED_PLAYER[0] * this.SPEED_GAME_BASE;
      this.SPEED_PLAYER_BULLET =
        defines.playerBulletSpeed * this.SPEED_GAME_BASE;
      this.HP_PERCENT_ENEMY_INCREASE = defines.enemyHPIncreaseRate;
      // defines.playerGunDamage = [30, 60, 60]
      this.DAMAGE_PLAYER_GUN.push(...defines.playerGunDamage);
      this.DAMAGE_PLAYER_GUN_INCREASE = defines.playerGunDamageIncrease;
    } else if (jsonData.game) {
      //create game
      const { game, mainCharacter } = jsonData as IGameInfo;

      this.LEVELS.length = 0;
      this.TIME_PLAYER_WEAPON_COOLDOWN.length = 0;
      this.DAMAGE_PLAYER_GUN.length = 0;

      this.LEVELS.push(this.loadLevel(game, this.ITEM_DEFINES[0]));
      this.TIME_PLAYER_WEAPON_COOLDOWN.push(
        mainCharacter.rateOfFireGun1,
        mainCharacter.rateOfFireGun2,
        mainCharacter.rateOfFireGun3
      );
      this.TIME_PLAYER_WEAPON_COOLDOWN_DECREASE =
        mainCharacter.rateOfFireLevelUpgrade;
      this.SPEED_PLAYER = game.normalWave.speedOfMovementMC * this.SPEED_GAME_BASE;
      this.SPEED_PLAYER_BULLET =
        mainCharacter.muzzleVelocity * this.SPEED_GAME_BASE;
      this.HP_PERCENT_ENEMY_INCREASE = 0.3;
      this.DAMAGE_PLAYER_GUN.push(
        mainCharacter.damageGun1,
        mainCharacter.damageGun2,
        mainCharacter.damageGun3
      );
      this.DAMAGE_PLAYER_GUN_INCREASE = mainCharacter.damageLevelUpgrade;
    } else if (jsonData.indexWave) {
      const level = jsonData as IWaveInfo;
      if (isRevive) {
        const index = Math.min(4, this.LEVELS.length - 1);
        this.LEVELS[this.LEVELS.length - 1] = this.loadLevel(
          level,
          this.ITEM_DEFINES[index]
        );
      } else {
        //next wave
        const index = Math.min(4, this.LEVELS.length);
        this.SPEED_PLAYER = level.normalWave.speedOfMovementMC * this.SPEED_GAME_BASE;
        this.LEVELS.push(this.loadLevel(level, this.ITEM_DEFINES[index]));
      }
    }
  }

  updateGunDamage(damageGun: Array<number>) {
    damageGun.forEach((item, i) => {
      this.DAMAGE_PLAYER_GUN[i] = item;
    });
  }

  getRewardKey(data: any) {
    //DATA, VOICE, SMS, EMONEY, DATA_VOICE, LOCK, STAR
    let key = `${data.prizeType}`;
    const prizeCode = data.prizeCode ? data.prizeCode : data.code;

    //CARD_1, CARD_2, CARD_3, CARD_4, CARD_5, CARD_6, CARD_7, PREMIUM_CARD_8
    if (data.prizeType == "CARD" || prizeCode == "PREMIUM_CARD_8") {
      key = prizeCode;
    }
    //PREMIUM_EMONEY_10_000_KS, PREMIUM_EMONEY_50_000_KS, PREMIUM_EMONEY_100_000_KS
    //PREMIUM_PS_5, PREMIUM_IPHONE_12,
    //PREMIUM_STAR_500, PREMIUM_DATA_20_000
    else if (data.prizeType == "PREMIUM") {
      key =
        //PREMIUM_EMONEY
        prizeCode.indexOf("PREMIUM_EMONEY") != -1
          ? "PREMIUM_EMONEY"
          //STAR
          : prizeCode.indexOf("PREMIUM_STAR") != -1
            ? "STAR"
            //DATA
            : prizeCode.indexOf("PREMIUM_DATA") != -1
              ? "DATA"
              : prizeCode;
    }

    return key;
  }

  private loadLevel(info: IWaveInfo, itemDefine: IItemDefine) {
    const { normalWave, bossWave } = info;

    return {
      itemDefine,
      normalWave,
      bossWave: {
        type: bossWave.type,
        hp: [bossWave.hp, bossWave.hp],
        shootInterval: [bossWave.rateOfFire, bossWave.rateOfFire],
        bulletSpeed: [bossWave.muzzleVelocity, bossWave.muzzleVelocity],
        idleTime: bossWave.idleTime,
        longIdleTime: bossWave.longIdleTime,
        teleportTime: bossWave.teleportTime,
      },
    };
  }
})();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const enable_log = urlParams.get('enable_log')
export const ENABLE_LOG = (enable_log) ? enable_log : false;
