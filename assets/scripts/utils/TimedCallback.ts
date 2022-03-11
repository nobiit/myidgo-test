export default class TimedCallback extends cc.Component {
  get Time() {
    return this.mTime;
  }

  private mIsActive: boolean;
  private mTime: number;
  private mCallback: Function;

  update(dt: number) {
    if (!this.mIsActive || !this.mCallback) {
      return;
    }

    this.mTime = Math.max(0, this.mTime - dt);
    if (this.mTime == 0) {
      this.mIsActive = false;
      this.mCallback();
      this.mCallback = null;
    }
  }

  init(time: number, callback: Function) {
    this.mTime = time;
    this.mCallback = callback;
    this.mIsActive = true;
  }

  pause() {
    this.mIsActive = false;
  }

  resume() {
    this.mIsActive = true;
  }

  cancel() {
    this.mCallback = null;
  }
}
