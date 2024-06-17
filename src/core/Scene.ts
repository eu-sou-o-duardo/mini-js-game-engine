import { GameObject } from "./GameObject";
import { Camera } from "./Camera";
import { UI } from "./UI";

export class Scene {
  objects: GameObject[];
  camera: Camera;
  ui?: UI;

  constructor(camera: Camera, objects: GameObject[], ui?: UI) {
    this.camera = camera;
    this.objects = objects;
    this.ui = ui;
  }
}
