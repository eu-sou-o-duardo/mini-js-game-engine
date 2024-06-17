export class Speaker {
  context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }

  sound1() {
    if ((<any>window).muted) return;

    const osc = this.context.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 440;

    const gainNode = this.context.createGain();
    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.value = 0.2;

    osc.connect(gainNode);
    gainNode.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 1 / 60);
  }

  sound2() {
    if ((<any>window).muted) return;

    const osc = this.context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 220;

    const gainNode = this.context.createGain();
    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.value = 0.2;

    osc.connect(gainNode);
    gainNode.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 1 / 240);
  }
}
