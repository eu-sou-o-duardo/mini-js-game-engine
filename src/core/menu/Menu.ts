import { Game } from "../Game";
import { Scene } from "../Scene";
import { Camera } from "../Camera";
import { Vector2 } from "../Vector2";
import { GameObject } from "../GameObject";
import { Bitmap } from "../Bitmap";
import { UI } from "../UI";
import { Speaker } from "../Speaker";

const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));

import leftArrowBitmapData from "./assets/leftArrow.json";
const leftArrowBitmap = new Bitmap(leftArrowBitmapData);
const leftArrow = new GameObject(new Vector2(1, 18), leftArrowBitmap);

import rightArrowBitmapData from "./assets/rightArrow.json";
const rightArrowBitmap = new Bitmap(rightArrowBitmapData);
const rightArrow = new GameObject(new Vector2(35, 18), rightArrowBitmap);

const icon = new GameObject(new Vector2(0, 0), new Bitmap([]));
const ui = new UI("Insert Coin", "or just press enter");
const scene = new Scene(camera, [leftArrow, rightArrow, icon], ui);
export const menu = new Game("menu", [scene], new Bitmap([]));
const speaker = new Speaker();
let selectedGame = 0;
let gamesList: { title: string; icon: Bitmap }[] = [];

function setSelected() {
  icon.bitmap = gamesList[selectedGame].icon;

  icon.position.x = Math.floor(
    (camera.resolution.w - gamesList[selectedGame].icon.width) / 2
  );

  icon.position.y = Math.floor(
    (camera.resolution.h - gamesList[selectedGame].icon.height) / 2
  );
}

function moveLeft() {
  selectedGame = selectedGame == 0 ? gamesList.length - 1 : selectedGame - 1;
  setSelected();
}

function moveRight() {
  selectedGame = selectedGame >= gamesList.length - 1 ? 0 : selectedGame + 1;
  setSelected();
}

menu.setup(({ availableGames }) => {
  gamesList = availableGames.filter((game) => game.title !== "menu");
  selectedGame = 0;
  setSelected();
});

menu.update(({ keyboard, mouse, setGame }) => {
  if (mouse.isJustClicked()) {
    if (mouse.position.x > rightArrow.position.x) {
      moveRight();
    }

    if (
      mouse.position.x <
      leftArrow.position.x + leftArrow.bitmap.data.length - 1
    ) {
      moveLeft();
    }
  }

  if (keyboard.isKeyJustPressed("ArrowLeft")) {
    speaker.sound1();
    moveLeft();
  }

  if (keyboard.isKeyJustPressed("ArrowRight")) {
    speaker.sound1();
    moveRight();
  }

  if (keyboard.isKeyJustPressed("Enter")) {
    setGame(gamesList[selectedGame].title);
  }
});
