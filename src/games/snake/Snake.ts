import {
  Game,
  Scene,
  Vector2,
  Camera,
  GameObject,
  Bitmap,
  Interval,
  Timeout,
  UI,
  Speaker,
} from "../../core";

import { Shape } from "./Shape";
import icon from "./assets/icon.json";
import gameOverBitmapData from "../assets/gameOverBitmap.json";
const gameOverBitmap = new Bitmap(gameOverBitmapData);
const iconBitmap = new Bitmap(icon);
const speaker = new Speaker();
const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));

let snakeShape = [
  new Vector2(10, 10),
  new Vector2(11, 10),
  new Vector2(12, 10),
];
const snakeDirection = Vector2.right();
const desiredDirection = Vector2.right();

const snakeBitmap = new Bitmap(Shape.rasterize(camera.resolution, snakeShape));

const snakeObject = new GameObject(new Vector2(0, 0), snakeBitmap);
const frogObject = new GameObject(new Vector2(20, 20), new Bitmap([[1]]));
setFrogInRandomPosition();
const ui = new UI(`Score: ${snakeShape.length - 3}`);

const mainScene = new Scene(camera, [snakeObject, frogObject], ui);

const gameOverObject = new GameObject(new Vector2(4, 8), gameOverBitmap);
const gameOverScene = new Scene(camera, [gameOverObject]);

export const snake = new Game("snake", [mainScene, gameOverScene], iconBitmap);

const gamePace = new Interval(100);
let gameOver = false;

const timeout = new Timeout(0);

snake.setup(() => {
  snakeShape = [new Vector2(10, 10), new Vector2(11, 10), new Vector2(12, 10)];
  desiredDirection.xy = Vector2.right();
  setFrogInRandomPosition();
  snake.setScene(0);
  gameOver = false;
});

snake.update(({ keyboard }) => {
  ui.left = `Score: ${snakeShape.length - 3}`;
  if (timeout.itssssTime) {
    gameOver = false;
    snake.setScene(0);
  }

  if (gamePace.itssssTime && !gameOver) {
    snakeDirection.xy = desiredDirection;
    if (isGameOver(snakeShape, camera.resolution)) {
      gameOver = true;
      timeout.reset(1000);
      snake.setScene(1);
      speaker.sound2();

      snakeShape = [
        new Vector2(10, 10),
        new Vector2(11, 10),
        new Vector2(12, 10),
      ];
      desiredDirection.xy = Vector2.right();
      setFrogInRandomPosition();
    }

    const head = snakeShape[snakeShape.length - 1];
    const newHead = new Vector2(
      head.x + snakeDirection.x,
      head.y + snakeDirection.y
    );
    snakeShape.push(newHead);
    speaker.sound1();

    if (head.isEqual(frogObject.position)) {
      setFrogInRandomPosition();
    } else {
      snakeShape.shift();
    }

    snakeObject.bitmap.data = Shape.rasterize(camera.resolution, snakeShape);
  }

  if (keyboard.isKeyPressed("ArrowLeft") && !snakeDirection.isRight()) {
    desiredDirection.xy = Vector2.left();
    return;
  }

  if (keyboard.isKeyPressed("ArrowRight") && !snakeDirection.isLeft()) {
    desiredDirection.xy = Vector2.right();
    return;
  }

  if (keyboard.isKeyPressed("ArrowUp") && !snakeDirection.isDown()) {
    desiredDirection.xy = Vector2.up();
    return;
  }

  if (keyboard.isKeyPressed("ArrowDown") && !snakeDirection.isUp()) {
    desiredDirection.xy = Vector2.down();
    return;
  }
});

function isGameOver(snake: Vector2[], boundingBox: Vector2) {
  const head = snake[snake.length - 1];

  return (
    head.x < 0 ||
    head.x >= boundingBox.w ||
    head.y < 0 ||
    head.y >= boundingBox.h ||
    hasSnakeSelfColision(head, snake)
  );
}

function hasSnakeSelfColision(head: Vector2, snake: Vector2[]) {
  return snake.some((segment, index) => {
    if (index === snake.length - 1) return false;
    if (head.isEqual(segment)) return true;
    return false;
  });
}

function setFrogInRandomPosition() {
  let frog = generateRandomPosition();

  while (snakeShape.some((segment) => segment.isEqual(frog))) {
    frog = generateRandomPosition();
  }

  frogObject.position.xy = frog;
}

function generateRandomPosition() {
  return new Vector2(
    Math.ceil(Math.random() * camera.resolution.x - 1),
    Math.ceil(Math.random() * camera.resolution.y - 1)
  );
}
