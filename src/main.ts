import {
  Engine,
  Renderer,
  Display,
  Vector2,
  PixelRendererCircleStrategyImpl,
  Keyboard,
  Mouse,
} from "./core";
import { snake, pong, flappyBird, smokeKills } from "./games";
import { menu } from "./core/menu";

const display = new Display(
  new Vector2(600, 600),
  new PixelRendererCircleStrategyImpl()
);
const renderer = new Renderer();
const keyboard = new Keyboard();
const mouse = new Mouse(display.getCanvas());

new Engine(display, renderer, keyboard, mouse, [
  menu,
  snake,
  pong,
  flappyBird,
  smokeKills,
]);

const appElement = document.querySelector<HTMLDivElement>("#app")!;
appElement.append(display.getCanvas());
