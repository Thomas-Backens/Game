class Coin {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.type = config.type;
    this.speed = new p5.Vector(random(-4, 4), random(-4, 4));
    this.dead = false;
    this.velocity = new p5.Vector(0, 0);
    this.xpSpeed = 0;
    this.amount = config.amount;
  }

  display() {
    noStroke();
    switch (this.type) {
      case "Coin":
        fill(255, 255, 0);
        ellipse(this.position.x + camera.x, this.position.y + camera.y, 15, 15);
        break;
      case "XP":
        fill(0, 255, 0);
        rect(this.position.x + camera.x, this.position.y + camera.y, 15, 15);
        break;
    }
  }

  update() {
    this.position.add(this.speed);
    if (this.speed.x > 0) {
      this.speed.x -= 0.1;
    }
    if (this.speed.x < 0) {
      this.speed.x += 0.1;
    }
    if (this.speed.y > 0) {
      this.speed.y -= 0.1;
    }
    if (this.speed.y < 0) {
      this.speed.y += 0.1;
    }
    if (this.speed.x > -0.1 && this.speed.x < 0.1) {
      this.speed.x = 0;
    }
    if (this.speed.y > -0.1 && this.speed.y < 0.1) {
      this.speed.y = 0;
    }

    let destination = p5.Vector.sub(heroes[0].position, this.position);
    destination.normalize();
    destination.mult(10);

    this.velocity.add(destination);
    this.velocity.limit(this.xpSpeed);
    this.position.add(this.velocity);
    this.xpSpeed += 0.1;

    if (this.collideWithPlayer()) {
      if (this.type === "XP") {
        heroes[0].stats.xp += this.amount;
      }
      this.dead = true;
    }
  }

  collideWithPlayer() {
    if (
      dist(
        this.position.x,
        this.position.y,
        heroes[0].position.x,
        heroes[0].position.y
      ) < 65
    ) {
      return true;
    }
    return false;
  }
}
