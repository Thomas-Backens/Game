class Hero {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);

    this.idle = loadImage("../sprites/Hero/You.png");
  }

  display() {
    image(this.idle, this.position.x, this.position.y, 100, 100);
  }

  move() {
    // To be continued
  }
}
