import { Vector2 } from "./Vector2";
import { Bitmap } from "./Bitmap";

const anchors = [
  "center",
  "topLeft",
  "topCenter",
  "topRight",
  "bottomRight",
  "bottomLeft",
] as const;

type Anchor = (typeof anchors)[number];

export class GameObject {
  position: Vector2;
  bitmap: Bitmap;
  bitmapOffset = new Vector2(0, 0);

  constructor(
    position: Vector2,
    bitmap: Bitmap,
    bitmapOffset: Vector2 | Anchor = "topLeft"
  ) {
    this.position = position;
    this.bitmap = bitmap;

    if (bitmapOffset instanceof Vector2) {
      this.bitmapOffset = bitmapOffset;
    } else {
      this.calculateAnchor(bitmapOffset);
    }
  }

  get positionInt() {
    return new Vector2(
      Math.round(this.position.x),
      Math.round(this.position.y)
    );
  }

  distanceFrom(anotherObject: GameObject) {
    return Math.sqrt(
      (this.position.x - anotherObject.position.x) ** 2 +
        (this.position.y - anotherObject.position.y) ** 2
    );
  }

  getBoundingBox() {
    return {
      xMin: this.positionInt.x + this.bitmapOffset.x,
      xMax: this.positionInt.x + this.bitmapOffset.x + this.bitmap.width - 1,
      yMin: this.positionInt.y + this.bitmapOffset.y,
      yMax: this.positionInt.y + this.bitmapOffset.y + this.bitmap.height - 1,
    };
  }

  isCollidingWith(anotherObject: GameObject, threshold = -1) {
    if (threshold > 0 && this.distanceFrom(anotherObject) > threshold) {
      return false;
    }

    if (!this.isBoundingBoxColliding(anotherObject)) return false;
    return this.isOverlappingBoundingBoxPixelsColliding(anotherObject);
  }

  private isBoundingBoxColliding(anotherObject: GameObject) {
    const obj1 = this.getBoundingBox();
    const obj2 = anotherObject.getBoundingBox();

    if (obj1.xMax < obj2.xMin || obj1.xMin > obj2.xMax) {
      return false;
    }

    if (obj1.yMax < obj2.yMin || obj1.yMin > obj2.yMax) {
      return false;
    }

    return true;
  }

  private isOverlappingBoundingBoxPixelsColliding(anotherObject: GameObject) {
    const obj1 = this.getBoundingBox();
    const obj2 = anotherObject.getBoundingBox();

    const overlap = {
      xMin: Math.max(obj1.xMin, obj2.xMin),
      xMax: Math.min(obj1.xMax, obj2.xMax),
      yMin: Math.max(obj1.yMin, obj2.yMin),
      yMax: Math.min(obj1.yMax, obj2.yMax),
    };

    for (let y = overlap.yMin; y <= overlap.yMax; y++) {
      for (let x = overlap.xMin; x <= overlap.xMax; x++) {
        const obj1Pixel = new Vector2(
          x - this.positionInt.x - this.bitmapOffset.x,
          y - this.positionInt.y - this.bitmapOffset.y
        );

        const obj2Pixel = new Vector2(
          x - anotherObject.positionInt.x - anotherObject.bitmapOffset.x,
          y - anotherObject.positionInt.y - anotherObject.bitmapOffset.y
        );

        if (
          this.bitmap.data[obj1Pixel.y][obj1Pixel.x] > 0 &&
          anotherObject.bitmap.data[obj2Pixel.y][obj2Pixel.x] > 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private calculateAnchor(anchor: Anchor) {
    switch (anchor) {
      case "topLeft":
        this.bitmapOffset = new Vector2(0, 0);
        break;

      case "topCenter":
        this.bitmapOffset = new Vector2(
          Math.floor(this.bitmap.width / 2) * -1,
          0
        );
        break;

      case "topRight":
        this.bitmapOffset = new Vector2((this.bitmap.width - 1) * -1, 0);
        break;

      case "bottomRight":
        this.bitmapOffset = new Vector2(
          (this.bitmap.width - 1) * -1,
          (this.bitmap.height - 1) * -1
        );
        break;

      case "bottomLeft":
        this.bitmapOffset = new Vector2(0, (this.bitmap.height - 1) * -1);
        break;

      case "center":
        this.bitmapOffset = new Vector2(
          Math.floor(this.bitmap.width / 2) * -1,
          Math.floor(this.bitmap.height / 2) * -1
        );
    }
  }
}
