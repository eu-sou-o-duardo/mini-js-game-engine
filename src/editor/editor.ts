import {
  Engine,
  Display,
  Vector2,
  PixelRendererCircleStrategyImpl,
  Keyboard,
  Mouse,
  Renderer,
} from "../core";

import { Game, Scene, Camera, GameObject, Bitmap } from "../core";

const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));

const bitmap = new Bitmap(
  Array.from({ length: camera.resolution.h }, () =>
    Array.from({ length: camera.resolution.h }, () => 0)
  )
);

const player = new GameObject(new Vector2(0, 0), bitmap);
const scene = new Scene(camera, [player]);
export const editor = new Game("editor", [scene], new Bitmap([]));

const display = new Display(
  new Vector2(600, 600),
  new PixelRendererCircleStrategyImpl()
);
const renderer = new Renderer();

const keyboard = new Keyboard();
const mouse = new Mouse(display.getCanvas());
let pixelValue = 1;
let isXMirrorEnabled = false;

new Engine(display, renderer, keyboard, mouse, [editor]);
editor.update(({ mouse }) => {
  if (mouse.isClicked()) {
    player.bitmap.data[mouse.position.y - 1][mouse.position.x - 1] = pixelValue;

    if (isXMirrorEnabled) {
      player.bitmap.data[mouse.position.y - 1][
        camera.resolution.w - mouse.position.x
      ] = pixelValue;
    }
  }

  if (mouse.isRightClicked()) {
    player.bitmap.data[mouse.position.y - 1][mouse.position.x - 1] = 0;

    if (isXMirrorEnabled) {
      player.bitmap.data[mouse.position.y - 1][
        camera.resolution.w - mouse.position.x
      ] = 0;
    }
  }
});

const appElement = document.querySelector<HTMLDivElement>("#app")!;
appElement.append(display.getCanvas());

document.querySelectorAll(".select-color").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    pixelValue = Number(value) / 10;
  });
});

document.getElementById("clear-all")?.addEventListener("click", () => {
  player.bitmap.data = Array.from({ length: camera.resolution.h }, () =>
    Array.from({ length: camera.resolution.h }, () => 0)
  );
});
document.getElementById("copy-to-clipboard")?.addEventListener("click", () => {
  copyBitmapToClipboard(clipTransparent());
});
document.getElementById("x-mirror")?.addEventListener("click", () => {
  isXMirrorEnabled = !isXMirrorEnabled;
});

function clipTransparent() {
  let left = Number.MAX_SAFE_INTEGER;
  let top = Number.MAX_SAFE_INTEGER;
  let right = Number.MIN_SAFE_INTEGER;
  let bottom = Number.MIN_SAFE_INTEGER;

  player.bitmap.data.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel === 0) return;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    });
  });

  const cropped: number[][] = [];

  for (let y = top; y <= bottom; y++) {
    const row: number[] = [];
    for (let x = left; x <= right; x++) {
      row.push(player.bitmap.data[y][x]);
    }

    cropped.push(row);
  }

  return cropped;
}

function copyBitmapToClipboard(bitmap: number[][]) {
  const text = JSON.stringify(bitmap);
  navigator.clipboard.writeText(text);
}
