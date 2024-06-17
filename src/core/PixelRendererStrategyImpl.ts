import { PixelRendererStrategy } from "./Display";
import { Vector2 } from "./Vector2";

export class PixelRendererStrategyImpl implements PixelRendererStrategy {
  private pixelColor = "black";
  private backgroundColor = "#899774";
  private pixelPadding = 1;
  private context: CanvasRenderingContext2D | null = null;

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  render(position: Vector2, size: Vector2, value: number) {
    if (!this.context) return;

    this.context.globalAlpha = value;
    this.context.fillStyle = this.pixelColor;
    this.context.fillRect(
      position.x + this.pixelPadding,
      position.y + this.pixelPadding,
      size.w - this.pixelPadding * 2,
      size.h - this.pixelPadding * 2
    );

    const borderWidth = 1;

    this.context.globalAlpha = 1;
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(
      position.x + this.pixelPadding + borderWidth,
      position.y + this.pixelPadding + borderWidth,
      size.w - this.pixelPadding * 2 - borderWidth * 2,
      size.h - this.pixelPadding * 2 - borderWidth * 2
    );

    const innerBlockPadding = 1;

    this.context.fillStyle = this.pixelColor;
    this.context.globalAlpha = value;
    this.context.fillRect(
      position.x + this.pixelPadding + borderWidth + innerBlockPadding,
      position.y + this.pixelPadding + borderWidth + innerBlockPadding,
      size.w - this.pixelPadding * 2 - borderWidth * 2 - innerBlockPadding * 2,
      size.h - this.pixelPadding * 2 - borderWidth * 2 - innerBlockPadding * 2
    );
  }
}
