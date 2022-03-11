import APIMgr from "../common/APIMgr";
import GameDefine from "../game/GameDefine";

export default new (class Helper {
  Rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  RandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  RandArgument(...args) {
    return arguments[this.RandInt(0, arguments.length - 1)];
  }

  RandArray(arr) {
    return arr[this.RandInt(0, arr.length - 1)];
  }

  RandTypeEnum(obj) {
    const keys = Object.keys(obj);
    return Number(keys[this.RandInt(0, keys.length / 2 - 1)]);
  }

  ShuffleArray(arr) {
    const temp = [...arr];
    const result = [];
    while (result.length < arr.length) {
      const i = this.RandInt(0, temp.length - 1);
      result.push(temp[i]);
      temp.splice(i, 1);
    }
    return result;
  }

  GetKey(obj, index) {
    return Object.keys(obj)[index];
  }

  GetKeyCCEnum(obj, index) {
    const keys = Object.keys(obj);
    return keys[index];
  }

  GetIndexEnum(obj, name) {
    const keys = Object.keys(obj);
    for (let i = keys.length / 2; i < keys.length; i++) {
      if (keys[i] == name) {
        return i - keys.length / 2;
      }
    }

    return -1;
  }

  EnumToCCEnum(enumObj) {
    const keys = Object.keys(enumObj);
    const obj = {};
    const startKeyIndex = keys.length / 2;
    for (let i = 0; i < startKeyIndex; i++) {
      obj[keys[startKeyIndex + i]] = Number(keys[i]);
    }
    return cc.Enum(obj);
  }

  Normalize(x1, y1, x2, y2) {
    const dX = x1 - x2;
    const dY = y1 - y2;
    const length = Math.sqrt(dX * dX + dY * dY);

    return new cc.Vec2(dX / length, dY / length);
  }

  MoveToTarget(current, target, speed) {
    speed = Math.abs(speed);

    if (current < target) {
      return Math.min(target, current + speed);
    } else {
      return Math.max(target, current - speed);
    }
  }

  Collision2Rect(rect1, rect2) {
    if (
      rect1.x + rect1.width < rect2.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.x + rect2.width < rect1.x ||
      rect2.y + rect2.height < rect1.y
    ) {
      return false;
    }

    return true;
  }

  CollisionPointRect(x, y, rect) {
    if (
      x < rect.x ||
      y < rect.y ||
      x > rect.x + rect.width ||
      y > rect.y + rect.height
    ) {
      return false;
    }

    return true;
  }

  Distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  Constrain(value, min, max) {
    value = Math.max(min, value);
    value = Math.min(max, value);

    return value;
  }

  ToRadian(angle) {
    return (angle / 180) * Math.PI;
  }

  ToDegree(radian) {
    return (radian / Math.PI) * 180;
  }

  ToDigitStr(num, digitCount) {
    return `${"0".repeat(digitCount - ("" + num).length)}${num}`;
  }

  ToHHMMSS(date) {
    return `${this.ToDigitStr(date.getHours(), 2)}:${this.ToDigitStr(
      date.getMinutes(),
      2
    )}:${this.ToDigitStr(date.getSeconds(), 2)}`;
  }

  ToDDMMYYYY(date) {
    return `${this.ToDigitStr(date.getDate(), 2)}-${this.ToDigitStr(
      date.getMonth() + 1,
      2
    )}-${this.ToDigitStr(date.getFullYear(), 4)}`;
  }

  ToYYYYMMDD(date) {
    return `${this.ToDigitStr(date.getFullYear(), 4)}-${this.ToDigitStr(
      date.getMonth() + 1,
      2
    )}-${this.ToDigitStr(date.getDate(), 2)}`;
  }

  TimeoutPromise(time, promise) {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(GameDefine.STRING_TIMEOUT);
      }, time * 1000);
    });

    return Promise.race([promise, timeout]);
  }

  HttpRequest(method, url, body, responseType, headers = null) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      if (method == "POST") {
        xhr.setRequestHeader("Content-Type", "application/json");
      }

      for (let item of headers) {
        xhr.setRequestHeader(item.key, item.value);
      }

      if (responseType) {
        xhr.responseType = responseType;
      }

      xhr.timeout = GameDefine.TIME_API_TIMEOUT;

      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.onerror = function (e) {
        reject(e);
      };

      xhr.ontimeout = (e) => {
        reject("timed out");
      };

      xhr.send(body);
    });
  }

  TranslateApiErrorMsg(apiName: string, error: any) {
    if (error && error.message) {
      console.log(`Notice 101 ${apiName} \n${error.message}`);
      return "Có lỗi xảy ra, vui lòng thử lại sau.";
    }

    if (error === GameDefine.STRING_TIMEOUT || error == "timeout!") {
      console.log(`Notice 102 ${apiName} Không có phản hồi. \nVui lòng thử lại sau.`);
      return "Không có phản hồi. Vui lòng thử lại sau.";
    }

    // return `Notice 103 Oops có gì đó sai sai. Vui lòng thử lại sau.`;
    // return `Hết phiên đăng nhập. \nVui lòng đăng nhập lại`;
    return "Có lỗi xảy ra, vui lòng thử lại sau.";
  }

  DrawLine(graphic, x1, y1, x2, y2, color = cc.Color.RED, lineWidth = 2) {
    graphic.lineWidth = lineWidth;
    graphic.strokeColor = color;
    graphic.moveTo(x1, y1);
    graphic.lineTo(x2, y2);
    graphic.stroke();
  }

  DrawSquare(graphic, x, y, width, color = cc.Color.RED, lineWidth = 2) {
    this.DrawRect(graphic, x, y, width, width, color, lineWidth);
  }

  DrawRect(graphic, x, y, width, height, color = cc.Color.RED, lineWidth = 2) {
    graphic.lineWidth = lineWidth;
    graphic.strokeColor = color;
    typeof x === "number"
      ? graphic.rect(x, y, width, height)
      : graphic.rect(x.x, x.y, x.width, x.height);
    graphic.stroke();
  }

  DrawArc(
    graphic,
    x,
    y,
    r,
    startAngle = 0,
    endAngle = Math.PI * 2,
    offsetAngle = 0,
    anticlockwise = true,
    color = cc.Color.RED,
    lineWidth = 2,
    withLine = false
  ) {
    const TWO_PI = Math.PI * 2;
    const drawOffset = Math.PI * 1.5; // start angle at 0 o'clock
    startAngle += drawOffset + offsetAngle;
    endAngle += drawOffset + offsetAngle;
    startAngle = TWO_PI - startAngle;
    endAngle = TWO_PI - endAngle;

    startAngle = startAngle > TWO_PI ? startAngle % TWO_PI : startAngle;
    endAngle = endAngle > TWO_PI ? endAngle % TWO_PI : endAngle;

    graphic.lineWidth = lineWidth;
    graphic.strokeColor = color;
    graphic.arc(x, y, r, startAngle, endAngle, anticlockwise);
    if (withLine) {
      graphic.lineTo(x, y);
      graphic.close();
    }
    graphic.stroke();
  }

  DrawCircle(graphic, x, y, r, color = cc.Color.RED, lineWidth = 2) {
    this.DrawEllipse(graphic, x, y, r, r, color, lineWidth);
  }

  DrawEllipse(graphic, x, y, rX, rY, color = cc.Color.RED, lineWidth = 2) {
    graphic.lineWidth = lineWidth;
    graphic.strokeColor = color;
    graphic.ellipse(x, y, rX, rY);
    graphic.stroke();
  }

  FillSquare(graphic, x, y, width, color = cc.Color.RED) {
    this.FillRect(graphic, x, y, width, width, color);
  }

  FillRect(graphic, x, y, width, height, color = cc.Color.RED) {
    graphic.fillColor = color;
    this.DrawRect(graphic, x, y, width, height, color, 0);
    graphic.fill();
  }

  FillArc(
    graphic,
    x,
    y,
    r,
    startAngle = 0,
    endAngle = Math.PI * 2,
    offsetAngle = 0,
    anticlockwise = true,
    color = cc.Color.RED
  ) {
    graphic.fillColor = color;
    this.DrawArc(
      graphic,
      x,
      y,
      r,
      startAngle,
      endAngle,
      offsetAngle,
      anticlockwise,
      undefined,
      0,
      true
    );
    graphic.fill();
  }

  FillCircle(graphic, x, y, r, color = cc.Color.RED) {
    this.FillEllipse(graphic, x, y, r, r, color);
  }

  FillEllipse(graphic, x, y, rX, rY, color = cc.Color.RED) {
    graphic.fillColor = color;
    this.DrawEllipse(graphic, x, y, rX, rY, color, 0);
    graphic.fill();
  }
})();
