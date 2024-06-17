import { Bitmap } from "./Bitmap";
import { Display } from "./Display";
import { Game } from "./Game";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { Renderer } from "./Renderer";

let fpsCount = 0;

export class Engine {
  private _currentGame = 0;
  display: Display;
  renderer: Renderer;
  games: Game[];
  keyboard: Keyboard;
  mouse: Mouse;
  prevUpdatedTime = 0;
  lastUpdateTime = performance.now();

  constructor(
    display: Display,
    renderer: Renderer,
    keyboard: Keyboard,
    mouse: Mouse,
    games: Game[]
  ) {
    this.display = display;
    this.renderer = renderer;
    this.games = games;
    this.keyboard = keyboard;
    this.mouse = mouse;
    this.mouse.setResolution(
      this.games[this._currentGame].currentScene.camera.resolution
    );
    this.games[this._currentGame].setupCallback({
      availableGames: this.games.map((game) => ({
        title: game.title,
        icon: game.icon,
      })),
    });
    requestAnimationFrame(this.internalUpdate.bind(this));
  }

  private internalUpdate() {
    fpsCount++;
    this.currentGame.updateCallback({
      keyboard: this.keyboard,
      mouse: this.mouse,
      setGame: this.setGame.bind(this),
    });

    if (this.keyboard.isKeyJustPressed("Escape")) {
      this.internalSetGame(0);
    }

    this.render();
    this.keyboard._refresh();
    this.mouse._refresh();

    requestAnimationFrame(this.internalUpdate.bind(this));
  }

  private render() {
    const curScene = this.currentGame.currentScene;

    const frame = this.renderer.render(curScene.camera, curScene.objects);
    this.display.refresh(frame);

    if (curScene.ui) {
      this.display.renderUI(curScene.ui);
    }
  }

  private internalSetGame(index: number) {
    this._currentGame = index;
    this.games[this._currentGame].setupCallback({
      availableGames: this.games.map((game) => ({
        title: game.title,
        icon: game.icon,
      })),
    });
    this.mouse.setResolution(
      this.games[this._currentGame].currentScene.camera.resolution
    );
  }

  setGame(title: string) {
    const index = this.games.findIndex((game) => game.title === title);
    this.internalSetGame(index);
  }

  get currentGame() {
    return this.games[this._currentGame];
  }
}

export type SetupCallback = ({
  availableGames,
}: {
  availableGames: { title: string; icon: Bitmap }[];
}) => void;

export type UpdateCallback = ({
  keyboard,
  mouse,
}: {
  keyboard: Keyboard;
  mouse: Mouse;
  setGame: (title: string) => void;
}) => void;

setInterval(() => {
  document.title = fpsCount.toString();
  fpsCount = 0;
}, 1000);
