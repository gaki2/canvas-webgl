import { Circle } from "./circle.js";

export class Set {
  constructor(x, y) {
    this.circles = [];
    this.fixedPos = {
      x: x,
      y: y,
    };
    this.nowPos = {
      x: x,
      y: y,
    };
    this.circles.push(new Circle(this.nowPos.x, this.nowPos.y));
  }

  next() {
    this.nowPos.x = this.normalDistribution(this.fixedPos.x, 150);
  }

  draw(ctx) {
    this.next();
    this.circles.push(new Circle(this.nowPos.x, this.fixedPos.y));
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].draw(ctx);
    }
  }

  normalDistribution(mean = 0, sd = 1) {
    const percent = Math.random();
    if (0 <= percent && percent < 0.341) {
      // 평균 ~ 평균 + 표준편차 사이의 값
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean + temp * sd;
        }
      }
    } else if (0.341 <= percent && percent < 0.682) {
      // 평균 - 표준편차 ~ 평균 사이의 값
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean - temp * sd;
        }
      }
    } else if (0.682 <= percent && percent < 0.818) {
      // 평균 + 표준편차 ~ 평균 + 2 표준편차 사이의 값
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean + sd + temp * sd;
        }
      }
    } else if (0.818 <= percent && percent < 0.954) {
      // 평균 - 2 표준편차 ~ 평균 - 표준편차 사이의 값
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean - sd - temp * sd;
        }
      }
    } else if (0.954 <= percent && percent < 0.975) {
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean + 2 * sd + temp * sd;
        }
      }
    } else if (0.975 <= percent && percent < 0.996) {
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean - 2 * sd - temp * sd;
        }
      }
    } else if (0.996 <= percent && percent < 0.998) {
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean + 3 * sd + temp * sd;
        }
      }
    } else {
      while (true) {
        const temp = Math.random();
        if (temp < Math.random()) {
          return mean - 3 * sd - temp * sd;
        }
      }
    }
  }
}
