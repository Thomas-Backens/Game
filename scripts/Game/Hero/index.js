class Hero {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.projectileVelocity = new p5.Vector(0, 0);
    this.endPoint = new p5.Vector(0, 0);

    this.stats = {
      maxHealth: 0,
      health: 0,
      damage: 0,
      defense: 0,
      attackRange: 0,
      attackSpeed: 0,
      speed: 0,
      visionRange: 0,
    };

    this.idle;
    this.walk;
    this.size = 50;
    this.character = config.character;

    this.running = false;

    switch (this.character) {
      case "Arthur":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/walk.gif");
        this.stats = {
          maxHealth: 1000,
          health: 1000,
          damage: 80,
          defense: 25,
          attackRange: 10,
          attackSpeed: 1,
          speed: 5,
          visionRange: 12,
        };
        break;
    }
  }

  display() {
    if (this.running) {
      image(
        this.walk,
        this.position.x + camera.x,
        this.position.y + camera.y,
        100,
        100
      );
    } else {
      image(
        this.idle,
        this.position.x + camera.x,
        this.position.y + camera.y,
        100,
        100
      );
    }
    // noStroke();
    // fill(0, 255, 0);
    // rect(
    //   this.position.x + camera.x,
    //   this.position.y + camera.y,
    //   this.size,
    //   this.size
    // );

    textAlign(CENTER);
    textSize(20);
    fill(255);
    text(
      "Health: " + this.stats.health + "/" + this.stats.maxHealth,
      this.position.x + camera.x,
      this.position.y + camera.y - 50
    );
  }

  displayProjectileLength() {
    let angle = this.projectileVelocity.heading();

    let newPosition = new p5.Vector(this.position.x, this.position.y);
    this.endPoint = calculateEndPosition(
      newPosition,
      this.stats.attackRange * 50,
      angle
    );

    noStroke();
    fill(255, 50);
    push();
    translate(this.position.x + camera.x, this.position.y + camera.y);
    rotate(angle);
    rect(this.stats.attackRange * 25, 0, this.stats.attackRange * 50, 50);
    pop();

    let mouse = new p5.Vector(mouseX - camera.x, mouseY - camera.y);
    let destination = p5.Vector.sub(mouse, this.position);
    destination.normalize();
    destination.mult(10);

    this.projectileVelocity.add(destination);
    this.projectileVelocity.limit(10);
  }

  move() {
    this.running = false;
    if (keys[87]) {
      this.position.y -= this.stats.speed;
    }
    if (keys[83]) {
      this.position.y += this.stats.speed;
      this.running = true;
    }
    if (keys[68]) {
      this.position.x += this.stats.speed;
    }
    if (keys[65]) {
      this.position.x -= this.stats.speed;
    }
  }

  repel(target) {
    let repeller = p5.Vector.sub(this.position, target.position);
    repeller.normalize();
    repeller.mult(10);

    this.velocity.add(repeller);
    this.velocity.limit(this.stats.speed * 2);
    this.position.add(this.velocity);
  }
}
