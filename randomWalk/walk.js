import { Point } from "./point.js";

export class Walk {
  constructor(x, y) {
    this.points = [];
    this.nowPos = {
      x: x,
      y: y,
    };
    this.points.push(new Point(this.nowPos.x, this.nowPos.y));
  }

  next() {
    const choice = Math.floor(Math.random() * 4);
    if (choice === 0) {
      this.nowPos.x += 1;
    } else if (choice === 1) {
      this.nowPos.x -= 1;
    } else if (choice === 2) {
      this.nowPos.y += 1;
    } else if (choice === 3) {
      this.nowPos.y -= 1;
    }
  }

  draw(ctx) {
    this.next();
    this.points.push(new Point(this.nowPos.x, this.nowPos.y));
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].draw(ctx);
    }
  }
}
