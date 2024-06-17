import { Game, GameObject, Scene, Camera, Vector2, Bitmap } from "../../core";

const camera = new Camera(new Vector2(40, 40), new Vector2(0, 0));
const objBitmap = new Bitmap([
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
]);
const object = new GameObject(new Vector2(5, 5), objBitmap, "center");
const dot = new GameObject(
  new Vector2(10, 10),
  new Bitmap([
    [1, 1, 1],
    [1, 1, 0],
  ])
);
const scene = new Scene(camera, [object, dot]);

export const testCollision = new Game(
  "test-collision",
  [scene],
  new Bitmap([[1]])
);

function showDistance() {
  console.log(object.distanceFrom(dot));
  console.log(object.isCollidingWith(dot, 5));
}

testCollision.update(({ keyboard }) => {
  if (keyboard.isKeyJustPressed("ArrowLeft")) {
    object.position.x--;
    showDistance();
    return;
  }

  if (keyboard.isKeyJustPressed("ArrowRight")) {
    object.position.x++;
    showDistance();
    return;
  }

  if (keyboard.isKeyJustPressed("ArrowUp")) {
    object.position.y--;
    showDistance();
    return;
  }

  if (keyboard.isKeyJustPressed("ArrowDown")) {
    object.position.y++;
    showDistance();
    return;
  }
});
