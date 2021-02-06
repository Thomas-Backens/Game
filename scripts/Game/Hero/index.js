class Hero {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);

    this.idle = loadImage("../sprites/Hero/You.png");
    this.speed = config.speed;
    this.size = 50;
  }

  display() {
    image(
      this.idle,
      this.position.x + camera.x,
      this.position.y + camera.y,
      100,
      100
    );
    fill(0, 255, 0);
    rect(
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size,
      this.size
    );
  }

  move() {
    if (keys[87]) {
      this.position.y -= this.speed;
    }
    if (keys[83]) {
      this.position.y += this.speed;
    }
    if (keys[68]) {
      this.position.x += this.speed;
    }
    if (keys[65]) {
      this.position.x -= this.speed;
    }
  }

  repel(target) {
    let repeller = p5.Vector.sub(this.position, target.position);
    repeller.normalize();
    repeller.mult(10);

    this.velocity.add(repeller);
    this.velocity.limit(this.speed * 2);
    this.position.add(this.velocity);
  }
}
