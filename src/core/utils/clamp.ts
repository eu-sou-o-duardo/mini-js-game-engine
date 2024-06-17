export function clamp(min: number, max: number, num: number) {
  return Math.max(min, Math.min(num, max));
}
