import {
  Game,
  Scene,
  Camera,
  Vector2,
  Bitmap,
  GameObject,
  Interval,
  UI,
  Timeout,
  Speaker,
} from "../../core";
import { randomIntFromInterval } from "../../core/utils/randomFromInterval";
import iconData from "./assets/icon.json";
import birdData from "./assets/bird.json";
import backgroundBitmapData from "./assets/background.json";
import pipeBitmapData from "./assets/pipe.json";
const backgroundBitmap = new Bitmap(backgroundBitmapData);
const pipeBitmap = new Bitmap(pipeBitmapData);
const invertedPipeBitmap = new Bitmap([...pipeBitmapData].reverse());
import gameOverBitmapData from "../assets/gameOverBitmap.json";
const gameOverBitmap = new Bitmap(gameOverBitmapData);
const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));
const bird = new GameObject(new Vector2(10, 10), new Bitmap(birdData));
const background1 = new GameObject(new Vector2(0, 0), backgroundBitmap);
const background2 = new GameObject(new Vector2(0, 0), backgroundBitmap);
const gameOverObject = new GameObject(new Vector2(4, 8), gameOverBitmap);
const ui = new UI(`Score: ${camera.position.y}`);
const gameOverScene = new Scene(camera, [gameOverObject], ui);

const spaceBetweenPipes = 15;
const topPipeAnchor = 14;
const bottomPipeAnchor = topPipeAnchor + spaceBetweenPipes;
const pipeInitialOffset = 100;

const pipes = Array.from({ length: 3 }, () => {
  return {
    top: new GameObject(new Vector2(0, 0), pipeBitmap, "bottomLeft"),
    bottom: new GameObject(new Vector2(0, 0), invertedPipeBitmap, "topLeft"),
  };
});

const mainScene = new Scene(
  camera,
  [
    background1,
    background2,
    bird,
    ...pipes.map((obj) => [obj.top, obj.bottom]).flat(),
  ],
  ui
);

export const flappyBird = new Game(
  "flappy-bird",
  [mainScene, gameOverScene],
  new Bitmap(iconData)
);

const speaker = new Speaker();
const gamePace = new Interval(1000 / 30);
const acceleration = new Vector2(1, 1);
const timeout = new Timeout(0);
const flappyForce = -1.3;
const gravity = 0.15;
let gameOver = false;
let score = 0;

flappyBird.setup(() => {
  score = 0;
  resetGameState();
  gameOver = false;
});

flappyBird.update(({ keyboard }) => {
  ui.left = `Score: ${score}`;

  if (timeout.itssssTime) {
    gameOver = false;
    score = 0;
    flappyBird.setScene(0);
  }

  if (isColliding()) {
    speaker.sound2();
    resetGameState();
    timeout.reset(1000);
    flappyBird.setScene(1);
  }

  if (gamePace.itssssTime && !gameOver) {
    score++;
    acceleration.y = acceleration.y + gravity;

    bird.position.x += acceleration.x;
    bird.position.y += acceleration.y;

    camera.position.x++;

    if (camera.position.x % background1.bitmap.width === 0) {
      background1.position.x = background1.position.x + 40;
      background2.position.x = background2.position.x + 40;
    }

    if (camera.position.x % 30 === 0) {
      const variation = randomIntFromInterval(-5, 5);

      const fistPipes = pipes.shift()!;
      fistPipes.top.position.x = camera.position.x + 60;
      fistPipes.bottom.position.x = camera.position.x + 60;

      fistPipes.top.position.y = topPipeAnchor + variation;
      fistPipes.bottom.position.y = bottomPipeAnchor + variation;
      pipes.push(fistPipes);
    }
  }

  if (
    (keyboard.isKeyJustPressed("Space") ||
      keyboard.isKeyJustPressed("ArrowUp")) &&
    !gameOver
  ) {
    speaker.sound1();
    acceleration.y = flappyForce;
  }

  if (bird.position.y <= 0) {
    bird.position.y = 0;
    acceleration.y = 0;
  }

  if (bird.position.y + bird.bitmap.height >= camera.resolution.h) {
    bird.position.y = camera.resolution.h - bird.bitmap.height;
  }
});

function isColliding() {
  return pipes
    .map((obj) => [obj.top, obj.bottom])
    .flat()
    .some((pipe) => bird.isCollidingWith(pipe, 25));
}

function resetGameState() {
  bird.position = new Vector2(10, 10);
  acceleration.y = 1;
  acceleration.x = 1;
  gameOver = true;

  camera.position.x = 0;

  setPipesInitialPosition();
  setBackgroundInitialPosition();
}

function setBackgroundInitialPosition() {
  background1.position.x = 0;
  background1.position.y = 31;
  background2.position.x = 40;
  background2.position.y = 31;
}

function setPipesInitialPosition() {
  const variation = randomIntFromInterval(-5, 5);
  pipes.forEach((pipeGroup, i) => {
    pipeGroup.top.position.x = i * 30 + pipeInitialOffset;
    pipeGroup.top.position.y = topPipeAnchor + variation;

    pipeGroup.bottom.position.x = i * 30 + pipeInitialOffset;
    pipeGroup.bottom.position.y = bottomPipeAnchor + variation;
  });
}
