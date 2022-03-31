export class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fill();
    ctx.closePath();
  }
}
