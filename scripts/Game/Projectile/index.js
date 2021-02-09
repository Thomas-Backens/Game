class Projectile {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.target = config.target;
    this.damage = config.damage;
    this.type = config.type;

    this.foundRotation = false;
    this.size = 50;
    this.atTheEnd = false;
    this.dead = false;

    this.magicBall = loadImage("../../../sprites/Projectiles/MagicBall.gif");
  }

  display() {
    fill(0, 200, 255, 20);
    ellipse(
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size,
      this.size
    );
    ellipse(
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size * 2,
      this.size * 2
    );
    ellipse(
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size * 3,
      this.size * 3
    );

    let angle = this.velocity.heading();

    push();
    translate(this.position.x + camera.x, this.position.y + camera.y);
    rotate(angle);
    image(this.magicBall, 0, 0, this.size * 2, this.size * 2);
    pop();
  }

  move() {
    let destination = p5.Vector.sub(this.target, this.position);
    destination.normalize();
    destination.mult(10);

    if (!this.foundRotation) {
      this.velocity.add(destination);
      this.velocity.limit(15);
      this.foundRotation = true;
    }
    this.position.add(this.velocity);

    if (
      dist(this.position.x, this.position.y, this.target.x, this.target.y) < 30
    ) {
      this.atTheEnd = true;
    }

    if (this.atTheEnd) {
      this.size -= 3;

      if (this.size <= 0) {
        this.dead = true;
      }
    }
  }

  hitMonster() {
    for (let i = 0; i < monsters.length; i++) {
      if (
        dist(
          this.position.x,
          this.position.y,
          monsters[i].position.x,
          monsters[i].position.y
        ) < this.size
      ) {
        monsters[i].stats.health -= calculateDefense(
          monsters[i].stats.defense,
          this.damage
        );
        this.dead = true;
      }
    }
  }
}