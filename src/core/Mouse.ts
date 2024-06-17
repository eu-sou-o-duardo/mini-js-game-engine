import { Vector2 } from "./Vector2";
import { clamp } from "./utils/clamp";

export class Mouse {
  private element: HTMLElement;
  private resolution = new Vector2(40, 50);
  private isClickFired = false;
  private isRightClickDown = false;
  private isRightClickFired = false;
  private click: {
    clicked: boolean;
    position: Vector2;
  } = {
    clicked: false,
    position: new Vector2(0, 0),
  };

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.onmousedown = this.setClickDown.bind(this);
    this.element.onmouseup = this.setClickUp.bind(this);
    this.element.onmousemove = this.updateClickState.bind(this);
    this.element.oncontextmenu = this.setRightClickDown.bind(this);
  }

  private setRightClickDown(e: MouseEvent) {
    e.preventDefault();
  }

  private setClickDown(e: MouseEvent) {
    e.preventDefault();

    if (e.button === 0) {
      this.isClickFired = false;
    }
    if (e.button === 2) {
      this.isRightClickDown = true;
      this.isRightClickFired = false;
    }
    this.updateClickState(e);
  }

  private setClickUp(e: MouseEvent) {
    this.isRightClickDown = false;
    this.updateClickState(e);
    this.isClickFired = false;
  }

  private updateClickState(e: MouseEvent) {
    const {
      x: elementPositionX,
      y: elementPositionY,
      width,
      height,
    } = this.element.getBoundingClientRect();

    const realClickPosition = new Vector2(
      e.x - elementPositionX,
      e.y - elementPositionY
    );

    const virtualClickPosition = new Vector2(
      clamp(
        1,
        this.resolution.x,
        Math.ceil((realClickPosition.x * this.resolution.x) / width)
      ),
      clamp(
        1,
        this.resolution.y,
        Math.ceil((realClickPosition.y * this.resolution.y) / height)
      )
    );

    this.click = {
      clicked: e.buttons == 1,
      position: virtualClickPosition,
    };
  }

  setResolution(resolution: Vector2) {
    this.resolution = resolution;
  }

  isClicked() {
    return this.click.clicked;
  }

  isJustClicked() {
    return this.click.clicked && !this.isClickFired;
  }

  isRightClicked() {
    return this.isRightClickDown;
  }

  isJustRightClicked() {
    return this.isRightClickDown && !this.isRightClickFired;
  }

  get position() {
    return this.click.position;
  }

  _refresh() {
    this.isClickFired = true;
    this.isRightClickFired = true;
  }
}
