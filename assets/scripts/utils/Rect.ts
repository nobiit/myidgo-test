export default class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  init() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }

  set(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  copy(rect: Rect) {
    this.x = rect.x;
    this.y = rect.y;
    this.width = rect.width;
    this.height = rect.height;
  }
}
