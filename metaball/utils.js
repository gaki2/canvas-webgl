export function map(v, a, b, min, max) {
  const per = v / (b - a);
  return lerp(min, max, per);
}

export function lerp(a, b, per) {
  return a + (b - a) * per;
}

export function dist(x0, y0, x1, y1) {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
}
