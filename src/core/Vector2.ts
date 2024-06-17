export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set xy(xy: Vector2) {
    this.x = xy.x;
    this.y = xy.y;
  }

  get xy() {
    return new Vector2(this.x, this.y);
  }

  get w() {
    return this.x;
  }

  get h() {
    return this.y;
  }

  isUp() {
    return this.y < 0 && this.x === 0;
  }

  isDown() {
    return this.y > 0 && this.x === 0;
  }

  isRight() {
    return this.x > 0 && this.y === 0;
  }

  isLeft() {
    return this.x < 0 && this.y === 0;
  }

  isEqual(vec: Vector2) {
    return this.x === vec.x && this.y === vec.y;
  }

  static up() {
    return new Vector2(0, -1);
  }

  static down() {
    return new Vector2(0, 1);
  }

  static right() {
    return new Vector2(1, 0);
  }

  static left() {
    return new Vector2(-1, 0);
  }
}
