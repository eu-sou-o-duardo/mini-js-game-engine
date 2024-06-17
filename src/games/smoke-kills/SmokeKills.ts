import {
  Game,
  GameObject,
  Scene,
  Camera,
  Vector2,
  Bitmap,
  Interval,
  Timeout,
  UI,
  Speaker,
} from "../../core";
import { randomIntFromInterval } from "../../core/utils/randomFromInterval";
import lungData from "./assets/lung.json";
import iconData from "./assets/icon.json";
const ui = new UI(`Smoke kills`);
const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));
import gameOverBitmapData from "../assets/gameOverBitmap.json";
const gameOverBitmap = new Bitmap(gameOverBitmapData);
const gameOverObject = new GameObject(new Vector2(4, 8), gameOverBitmap);
const gameOverScene = new Scene(camera, [gameOverObject], ui);
const cigar = new GameObject(
  new Vector2(17, 37),
  new Bitmap([[0.6, 0.6, 1, 1, 1, 1]])
);
const lung = new GameObject(
  new Vector2(20, 1),
  new Bitmap(lungData.map((y) => y.map((x) => x))),
  "topCenter"
);
const ball = new GameObject(new Vector2(20, 35), new Bitmap([[1]]));
const futureBall = new GameObject(new Vector2(0, 0), new Bitmap([[1]]));
let ballDirection = new Vector2(Math.random() > 0.5 ? 1 : -1, -1);
const bumpBallX = new GameObject(new Vector2(0, 0), new Bitmap([[0.5]]));
const bumpBallY = new GameObject(new Vector2(0, 0), new Bitmap([[0.5]]));
const bumpBallCorner = new GameObject(new Vector2(0, 0), new Bitmap([[0.5]]));

const scene = new Scene(camera, [cigar, lung, ball], ui);

export const smokeKills = new Game(
  "smoke-kills",
  [scene, gameOverScene],
  new Bitmap(iconData)
);
const speaker = new Speaker();
const gamePace = new Interval(60);
const timeout = new Timeout(0);
let isGameOver = false;

smokeKills.setup(() => {
  reset();
  isGameOver = false;
});

smokeKills.update(({ keyboard }) => {
  if (timeout.itssssTime) {
    isGameOver = false;
    smokeKills.setScene(0);
  }

  if (gamePace.itssssTime && !isGameOver) {
    ball.position.x += ballDirection.x;
    ball.position.y += ballDirection.y;

    updateBumpBalls();

    // left wall
    if (ball.position.x <= 0) {
      ballDirection.x = 1;
      speaker.sound2();
    }

    // right wall
    if (ball.position.x >= camera.resolution.w - 1) {
      ballDirection.x = -1;
      speaker.sound2();
    }

    // top wall
    if (ball.position.y <= 0) {
      ballDirection.y = 1;
    }

    // bottom wall
    if (ball.position.y >= camera.resolution.h - 1) {
      reset();
      isGameOver = true;
      timeout.reset(1000);
      smokeKills.setScene(1);
    }
    // cigar
    futureBall.position.xy = ball.position.xy;
    futureBall.position.x += ballDirection.x;
    futureBall.position.y += ballDirection.y;
    if (cigar.isCollidingWith(futureBall, 5)) {
      ballDirection.y = -1;
      speaker.sound1();
    }

    lungCollision();
  }

  if (keyboard.isKeyPressed("ArrowLeft")) {
    cigar.position.x--;
  }

  if (keyboard.isKeyPressed("ArrowRight")) {
    cigar.position.x++;
  }

  if (cigar.position.x < 0) {
    cigar.position.x = 0;
  }

  if (cigar.position.x + cigar.bitmap.width >= camera.resolution.w) {
    cigar.position.x = camera.resolution.w - cigar.bitmap.width;
  }
});

function updateBumpBalls() {
  bumpBallX.position.x =
    ballDirection.x > 0 ? ball.position.x + 1 : ball.position.x - 1;
  bumpBallX.position.y = ball.position.y;

  bumpBallY.position.x = ball.position.x;
  bumpBallY.position.y =
    ballDirection.y > 0 ? ball.position.y + 1 : ball.position.y - 1;

  bumpBallCorner.position.x = bumpBallX.position.x;
  bumpBallCorner.position.y = bumpBallY.position.y;
}

function lungCollision() {
  if (
    lung.isCollidingWith(bumpBallX) ||
    lung.isCollidingWith(bumpBallY) ||
    lung.isCollidingWith(bumpBallCorner)
  ) {
    if (lung.isCollidingWith(bumpBallX) && lung.isCollidingWith(bumpBallY)) {
      removeBlockFromLung(bumpBallX.position);
      removeBlockFromLung(bumpBallY.position);
      ballDirection.y *= -1;
      ballDirection.x *= -1;
      speaker.sound1();
      return;
    }

    if (lung.isCollidingWith(bumpBallX)) {
      removeBlockFromLung(bumpBallX.position);
      ballDirection.x *= -1;
      speaker.sound1();
      return;
    }

    if (lung.isCollidingWith(bumpBallY)) {
      removeBlockFromLung(bumpBallY.position);
      ballDirection.y *= -1;
      speaker.sound1();
      return;
    }

    if (lung.isCollidingWith(bumpBallCorner)) {
      removeBlockFromLung(bumpBallCorner.position);
      ballDirection.y *= -1;
      ballDirection.x *= -1;
      speaker.sound1();
      return;
    }
  }
}

function removeBlockFromLung(position: Vector2) {
  const pixel = new Vector2(
    position.x - lung.position.x - lung.bitmapOffset.x,
    position.y - lung.position.y - lung.bitmapOffset.y
  );

  lung.bitmap.data[pixel.y][pixel.x] = 0;
}

function reset() {
  lung.bitmap = new Bitmap(lungData.map((y) => y.map((x) => x)));
  ball.position = new Vector2(randomIntFromInterval(15, 25), 35);
  ballDirection = new Vector2(Math.random() > 0.5 ? 1 : -1, -1);
}
