export type Timestamp = [number, number];

export function now(): Timestamp {
  const nanos = (performance.now() + performance.timeOrigin) * 1000;

  const seconds = Math.floor(nanos / 1000000);
  const subsecondNanos = nanos % 1000000;

  return [seconds, subsecondNanos];
}
