export class Timeout {
  private timeout: number;
  private triggered = false;

  constructor(timeout: number) {
    this.timeout = performance.now() + timeout;
  }

  get itssssTime() {
    const now = performance.now();
    if (now >= this.timeout && !this.triggered) {
      this.triggered = true;
      return true;
    }

    return false;
  }

  reset(timeout: number) {
    this.triggered = false;
    this.timeout = performance.now() + timeout;
  }
}
