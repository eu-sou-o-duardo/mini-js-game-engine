export class Keyboard {
  private keysPressed: Record<string, boolean> = {};
  private keysJustPressed: Record<string, boolean> = {};

  constructor() {
    document.onkeydown = this.setKeyPressed.bind(this);
    document.onkeyup = this.removeKeyPressed.bind(this);
  }

  private setKeyPressed(e: KeyboardEvent) {
    this.keysPressed[formatCode(e.code)] = true;
    if (!e.repeat) {
      this.keysJustPressed[formatCode(e.code)] = true;
    }
  }

  private removeKeyPressed(e: KeyboardEvent) {
    this.keysPressed[formatCode(e.code)] = false;
  }

  isKeyPressed(key: string) {
    return this.keysPressed[formatCode(key)];
  }

  isKeyJustPressed(key: string) {
    return this.keysJustPressed[formatCode(key)];
  }

  _refresh() {
    this.keysJustPressed = {};
  }
}

function formatCode(code: string) {
  return code.replace(/Digit|Key/, "");
}
