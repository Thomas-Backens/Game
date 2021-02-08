class Monster {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.repelVelocity = new p5.Vector(0, 0);
    this.type = config.type;

    this.stats = {
      maxHealth: 0,
      damage: 0,
      defense: 0,
      attackRange: 0,
      attackSpeed: 0,
      speed: 0,
      visionRange: 0,
    };
    this.target = heroes[0];
    this.attackTimer = 0;
    this.size = 100;

    switch (this.type) {
      case "Spider":
        this.stats = {
          maxHealth: 55,
          damage: 7,
          defense: 2,
          attackRange: 1,
          attackSpeed: 2,
          speed: 3,
          visionRange: 10,
        };
        break;
    }
  }

  display() {
    // let angle = this.velocity.heading();

    fill(255, 0, 0);
    // push();
    // translate(this.position.x + camera.x, this.position.y + camera.y);
    // rotate(angle);
    rect(this.position.x + camera.x, this.position.y + camera.y, 50, 50);
    // pop();
  }

  move() {
    let destination = p5.Vector.sub(this.target.position, this.position);
    destination.normalize();
    destination.mult(10);

    this.velocity.add(destination);
    this.velocity.limit(this.stats.speed);

    if (
      dist(
        this.position.x,
        this.position.y,
        this.target.position.x,
        this.target.position.y
      ) >
      this.stats.attackRange * 100
    ) {
      this.position.add(this.velocity);
    }
  }

  attack() {
    if (this.target === null) {
      return;
    }

    if (
      dist(
        this.position.x,
        this.position.y,
        this.target.position.x,
        this.target.position.y
      ) <
      this.stats.attackRange * 100
    ) {
      this.attackTimer++;

      if (this.attackTimer >= this.stats.attackSpeed * 60) {
        this.target.health -= this.stats.damage;
        this.attackTimer = 0;
      }
    }
  }

  repel(target) {
    let repeller = p5.Vector.sub(this.position, target.position);
    repeller.normalize();
    repeller.mult(10);

    this.repelVelocity.add(repeller);
    this.repelVelocity.limit(this.stats.speed * 2);
    this.position.add(this.repelVelocity);
  }
}
