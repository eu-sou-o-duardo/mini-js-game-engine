import { Scene } from "./Scene";
import { SetupCallback, UpdateCallback } from "./Engine";
import { Bitmap } from "./Bitmap";

export class Game {
  title: string;
  scenes: Scene[];
  icon: Bitmap;
  private _currentScene = 0;
  updateCallback: UpdateCallback = () => {};
  setupCallback: SetupCallback = () => {};

  constructor(title: string, scenes: Scene[], icon: Bitmap) {
    this.title = title;
    this.scenes = scenes;
    this.icon = icon;
  }

  setScene(index: number) {
    this._currentScene = index;
  }

  get currentScene() {
    return this.scenes[this._currentScene];
  }

  setup(setupCallback: SetupCallback) {
    this.setupCallback = setupCallback;
  }

  update(updateCallback: UpdateCallback) {
    this.updateCallback = updateCallback;
  }
}
