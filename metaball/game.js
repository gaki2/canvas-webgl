import { Ball } from "./ball.js";
import * as Util from "./utils.js";
export class Game {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.aspectRatio = this.canvasHeight / this.canvasWidth;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.stageWidth = 400;
    this.stageHeight = this.stageWidth * this.aspectRatio;

    this.scale = 1;

    this.width = this.canvasWidth / this.scale;
    this.height = this.canvasHeight / this.scale;

    this.threshold = 0.1;
    this.time = 0;

    this.tmpCanvas = document.createElement("canvas");
    this.tmpCanvas.width = this.width;
    this.tmpCanvas.height = this.height;
    this.tmpCtx = this.tmpCanvas.getContext("2d");
  }

  start() {
    this.init();
    this.run();
  }

  init() {
    this.balls = [];

    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 2 - 1 + this.stageWidth / 2.0;
      const y = Math.random() * 2 - 1 + this.stageHeight / 2.0;

      this.balls.push(new Ball(x, y));
    }
  }

  run(t) {
    let delta = t - this.time;
    if (isNaN(delta)) delta = 1;

    this.time = t;

    const fps = Math.round(1000 / delta);

    this.updata(delta);
    this.render();

    this.ctx.font = "28px sansserif";
    this.ctx.fillText(fps + "fps", 5, 25);

    window.requestAnimationFrame(this.run.bind(this));
  }

  updata(delta) {
    delta /= 10.0;

    this.balls.forEach((ball) => {
      ball.x += ball.vx * delta;
      ball.y += ball.vy * delta;

      if (ball.x < 0 || ball.x >= this.stageWidth) {
        ball.vx *= -1;
        ball.x += ball.vx;
      }
      if (ball.y < 0 || ball.y >= this.stageHeight) {
        ball.vy *= 1;
        ball.y += ball.vy;
      }
    });
  }

  render() {
    let pixels = new ImageData(this.width, this.height);

    for (let y = 0; y < this.height; y++) {
      const my = Util.map(y, 0, this.height, 0, this.stageHeight);
      for (let x = 0; x < this.width; x++) {
        const mx = Util.map(x, 0, this.width, 0, this.stageWidth);

        let color = 0xffffff;
        let weight = 0;

        this.balls.forEach((b) => {
          weight += 1 / Util.dist(mx, my, b.x, b.y);
        });

        if (weight > this.threshold) {
          color = 0xff00ff;
        }

        const ptr = (x + y * this.width) * 4;
        pixels.data[ptr] = (color >> 16) & 0xff;
        pixels.data[ptr + 1] = (color >> 8) & 0xff;
        pixels.data[ptr + 2] = color & 0xff;
        pixels.data[ptr + 3] = 0xff;
      }
    }

    this.tmpCtx.putImageData(pixels, 0, 0);
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.tmpCanvas, 0, 0);
    this.ctx.restore();
  }
}
