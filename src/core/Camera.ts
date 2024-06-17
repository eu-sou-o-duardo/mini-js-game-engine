import { Vector2 } from "./Vector2";

export class Camera {
  resolution: Vector2;
  position: Vector2;

  constructor(resolution: Vector2, position: Vector2) {
    this.resolution = resolution;
    this.position = position;
  }
}
