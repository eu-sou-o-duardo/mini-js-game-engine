export class Interval {
  private interval: number;
  private previousTime = 0;

  constructor(interval: number) {
    this.interval = interval;
  }

  get itssssTime() {
    const now = performance.now();
    const timeElapsed = now - this.previousTime;

    if (timeElapsed < this.interval) {
      return false;
    }

    const excessTime = timeElapsed % this.interval;
    this.previousTime = now - excessTime;

    return true;
  }
}
