import { Vector2 } from "./Vector2";
import { UI } from "./UI";

export class Display {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private backgroundColor: string;
  private pixelRenderer: PixelRendererStrategy;
  private showDebugGrid: boolean;

  constructor(
    canvasSize: Vector2,
    pixelRenderer: PixelRendererStrategy,
    backgroundColor = "#899774",
    showDebugGrid = false
  ) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasSize.w;
    this.canvas.height = canvasSize.h;
    this.context = this.canvas.getContext("2d")!;

    this.backgroundColor = backgroundColor;

    this.pixelRenderer = pixelRenderer;
    this.pixelRenderer.setContext(this.context);

    this.showDebugGrid = showDebugGrid;
  }

  refresh(frame: number[][]) {
    this.context.globalAlpha = 1;
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.showDebugGrid) this.drawDebugGrid(frame);

    const pixelDimensions = new Vector2(
      this.canvas.width / frame[0].length,
      this.canvas.height / frame.length
    );

    frame.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel > 0) {
          const pixelPosition = new Vector2(
            x * pixelDimensions.w,
            y * pixelDimensions.h
          );
          this.drawPixel(pixelPosition, pixelDimensions, pixel);
        }
      });
    });
  }

  renderUI(ui: UI) {
    // background
    if (ui.left) {
      const leftWidthText = this.context.measureText(ui.left).width;
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(18, 25, leftWidthText + 4, 18);
    }

    if (ui.right) {
      const rightWidthText = this.context.measureText(ui.right).width;
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(
        this.canvas.width - rightWidthText - 20,
        25,
        rightWidthText + 4,
        18
      );
    }

    this.context.font = "16px Monospace";
    this.context.fillStyle = "black";

    this.context.textAlign = "left";
    this.context.fillText(ui.left, 20, 40);

    this.context.textAlign = "right";
    this.context.fillText(ui.right, this.canvas.width - 20, 40);
  }

  private drawDebugGrid(frame: number[][]) {
    this.context.strokeStyle = "#5d694c";
    this.context.fillStyle = "#5d694c";

    const pixelDimensions = new Vector2(
      this.canvas.width / frame[0].length,
      this.canvas.height / frame.length
    );

    frame.forEach((row, y) => {
      // row
      this.context.beginPath();
      this.context.moveTo(0, y * pixelDimensions.h);
      this.context.lineTo(this.canvas.width, y * pixelDimensions.h);
      this.context.stroke();

      // text
      this.context.font = "8px Monospace";
      this.context.fillText(`${y}`, 2, y * pixelDimensions.h + 10);

      row.forEach((_, x) => {
        this.context.beginPath();
        this.context.moveTo(x * pixelDimensions.w, 0);
        this.context.lineTo(x * pixelDimensions.w, this.canvas.height);
        this.context.stroke();

        // text
        this.context.font = "8px Monospace";
        this.context.fillText(`${x}`, x * pixelDimensions.w + 2, 10);
      });
    });
  }

  private drawPixel(position: Vector2, dimensions: Vector2, value: number) {
    this.pixelRenderer.render(position, dimensions, value);
  }

  getCanvas() {
    return this.canvas;
  }
}

export interface PixelRendererStrategy {
  setContext(context: CanvasRenderingContext2D): void;
  render(position: Vector2, size: Vector2, value: number): void;
}
