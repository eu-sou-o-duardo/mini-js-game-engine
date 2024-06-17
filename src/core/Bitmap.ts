export class Bitmap {
  data: number[][];
  private _width: number = 0;
  private _height: number = 0;

  constructor(data: number[][]) {
    this.data = data;

    this._height = data.length;
    if (this._height > 0) {
      this._width = data[0].length;
    }
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}
