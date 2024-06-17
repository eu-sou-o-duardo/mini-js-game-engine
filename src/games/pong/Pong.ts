import {
  Game,
  Scene,
  Camera,
  GameObject,
  Bitmap,
  Vector2,
  Interval,
  UI,
  Speaker,
} from "../../core";

import icon from "./assets/icon.json";
const iconBitmap = new Bitmap(icon);

const score = {
  player1: 0,
  player2: 0,
};

const ui = new UI(`Art: ${score.player1}`, `Pat: ${score.player2}`);

const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));
const playerBitmap = new Bitmap([[1], [1], [1], [1]]);
const player1 = new GameObject(new Vector2(2, 17), playerBitmap);
const player2 = new GameObject(new Vector2(37, 17), playerBitmap);

let courtData = Array.from({ length: camera.resolution.h }, () =>
  Array.from({ length: camera.resolution.h }, () => 0)
);

const courtLimits = {
  top: 6,
  bottom: 33,
  right: 40,
  left: 0,
};

courtData = courtData.map((row, y) => {
  return row.map((pixel, x) => {
    // vertical center
    if (x === 20 && y > 6 && y < 33) {
      return 0.07;
    }

    // horizontal
    if (y === 6 || y === 33) {
      return 0.2;
    }

    // horizontal center
    if (y === 19 && x >= 10 && x <= 30) {
      return 0.07;
    }

    // vertical
    if (y > 6 && y < 33 && (x == 9 || x == 31)) {
      return 0.07;
    }

    return pixel;
  });
});

const stage = new GameObject(new Vector2(0, 0), new Bitmap(courtData));

const ball = new GameObject(
  new Vector2(randomIntFromInterval(16, 24), randomIntFromInterval(12, 28)),
  new Bitmap([[1]])
);
const futureBall = new GameObject(new Vector2(0, 0), new Bitmap([[1]]));
let ballDirection = new Vector2(Math.random() > 0.5 ? 1 : -1, 1);

const mainScene = new Scene(camera, [stage, player1, player2, ball], ui);
export const pong = new Game("pong", [mainScene], iconBitmap);

const gamePace = new Interval(60);
const speaker = new Speaker();

pong.setup(() => {
  ball.position.xy = new Vector2(
    randomIntFromInterval(16, 24),
    randomIntFromInterval(12, 28)
  );
  score.player1 = 0;
  score.player2 = 0;
  ballDirection.xy = new Vector2(Math.random() > 0.5 ? 1 : -1, 1);
});

pong.update(({ keyboard }) => {
  ui.left = `Art: ${score.player1}`;
  ui.right = `Pat: ${score.player2}`;

  if (gamePace.itssssTime) {
    futureBall.position.xy = ball.position.xy;
    futureBall.position.x += ballDirection.x;
    futureBall.position.y += ballDirection.y;

    if (futureBall.isCollidingWith(player1)) {
      ballDirection.x = 1;
      speaker.sound1();
    }

    if (futureBall.isCollidingWith(player2)) {
      ballDirection.x = -1;
      speaker.sound1();
    }

    ball.position.x += ballDirection.x;
    ball.position.y += ballDirection.y;
  }

  // player2
  if (keyboard.isKeyPressed("W")) {
    player1.position.y -= 1;
  }

  if (keyboard.isKeyPressed("S")) {
    player1.position.y += 1;
  }

  // top limit
  if (player1.position.y <= 7) {
    player1.position.y = 7;
  }

  // bottom limit
  if (player1.position.y > camera.resolution.h - 11) {
    player1.position.y = camera.resolution.h - 11;
  }

  // player2
  if (keyboard.isKeyPressed("ArrowUp")) {
    player2.position.y -= 1;
  }

  if (keyboard.isKeyPressed("ArrowDown")) {
    player2.position.y += 1;
  }

  // top limit
  if (player2.position.y <= 7) {
    player2.position.y = 7;
  }

  // bottom limit
  if (player2.position.y > camera.resolution.h - 11) {
    player2.position.y = camera.resolution.h - 11;
  }

  // ball trajectory
  if (ball.position.y <= courtLimits.top + 1) {
    ballDirection.y = 1;
    speaker.sound2();
  }
  if (ball.position.y >= courtLimits.bottom - 1) {
    speaker.sound2();
    ballDirection.y = -1;
  }

  // player1 point
  if (ball.position.x >= courtLimits.right) {
    ball.position.xy = new Vector2(
      player2.position.x - 15,
      randomIntFromInterval(12, 28)
    );
    ballDirection.x = -1;
    score.player1++;
  }

  // player2 points
  if (ball.position.x <= courtLimits.left - 1) {
    ball.position.xy = new Vector2(
      player1.position.x + 15,
      randomIntFromInterval(12, 28)
    );
    ballDirection.x = 1;
    score.player2++;
  }
});

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
