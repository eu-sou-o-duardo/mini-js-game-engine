import { PixelRendererStrategy } from "./Display";
import { Vector2 } from "./Vector2";
import { clamp } from "./utils/clamp";

export class PixelRendererCircleStrategyImpl implements PixelRendererStrategy {
  private pixelColor = "black";
  private context: CanvasRenderingContext2D | null = null;

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  render(position: Vector2, size: Vector2, value: number) {
    if (!this.context) return;

    const path = new Path2D();
    path.arc(
      position.x + size.w / 2,
      position.y + size.h / 2,
      size.w / 2,
      0,
      2 * Math.PI,
      false
    );
    this.context.strokeStyle = this.pixelColor;
    this.context.globalAlpha = value;
    this.context.lineWidth = 1;
    this.context.stroke(path);

    const path2 = new Path2D();

    const padding = 2;

    path2.arc(
      position.x + size.w / 2,
      position.y + size.h / 2,
      clamp(1, 9999, size.w - padding * 2) / 2,
      0,
      2 * Math.PI,
      false
    );
    this.context.fillStyle = "black";
    this.context.fill(path2);
    this.context.globalAlpha = 1;
  }
}
