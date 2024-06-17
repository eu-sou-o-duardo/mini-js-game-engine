import { Camera } from "./Camera";
import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";

export class Renderer {
  render(camera: Camera, objects: GameObject[]) {
    const frame = Array.from({ length: camera.resolution.h }, () =>
      Array.from({ length: camera.resolution.h }, () => 0)
    );

    objects.forEach((obj) => {
      if (!this.isObjectInCameraView(obj, camera)) return;

      obj.bitmap.data.forEach((row, y) => {
        row.forEach((pixel, x) => {
          const pixelXPosition =
            Math.round(obj.position.x + obj.bitmapOffset.x) +
            x -
            camera.position.x;
          const pixelYPosition =
            Math.round(obj.position.y + obj.bitmapOffset.y) +
            y -
            camera.position.y;

          if (
            !this.isPixelInCameraView(
              new Vector2(pixelXPosition, pixelYPosition),
              camera
            )
          )
            return;

          frame[pixelYPosition][pixelXPosition] += pixel;
        });
      });
    });

    return frame;
  }

  private isObjectInCameraView(object: GameObject, camera: Camera) {
    const topCrop = camera.position.y;
    const bottomCrop = camera.position.y + camera.resolution.h - 1;

    const leftCrop = camera.position.x;
    const rightCrop = camera.position.x + camera.resolution.w - 1;

    const positionXInteger = Math.round(
      object.position.x + object.bitmapOffset.x
    );
    const positionYInteger = Math.round(
      object.position.y + object.bitmapOffset.y
    );

    if (
      positionXInteger + object.bitmap.width < leftCrop ||
      positionXInteger > rightCrop
    )
      return false;

    if (
      positionYInteger + object.bitmap.height < topCrop ||
      positionYInteger > bottomCrop
    )
      return false;

    return true;
  }

  private isPixelInCameraView(position: Vector2, camera: Camera) {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + 1 <= camera.resolution.w &&
      position.y + 1 <= camera.resolution.h
    );
  }
}
