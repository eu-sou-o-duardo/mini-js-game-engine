import { Vector2 } from "../../core/Vector2";

export class Shape {
  static rasterize(dimensions: Vector2, shape: Vector2[]) {
    const bitmap = Array.from({ length: dimensions.h }, () =>
      Array.from({ length: dimensions.h }, () => 0)
    );
    shape.forEach((section) => {
      if (section.x < 0 || section.y < 0) return;
      if (section.x >= dimensions.x || section.y >= dimensions.h) return;
      bitmap[section.y][section.x] = 1;
    });

    return bitmap;
  }
}
