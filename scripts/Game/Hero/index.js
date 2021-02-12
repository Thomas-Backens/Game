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
    this.abilities = [];
    this.usingAbility = {
      StaffSmash: { using: false, timeOut: 20, timer: 0 },
    };
    this.collidingWith = {
      top: false,
      bottom: false,
      right: false,
      left: false,
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
        this.abilities = [
          {
            name: "Staff Smash",
            damage: "Low",
            description:
              "Pushes Monsters away from you, dealing minimal damage",
            key: "Q",
          },
          {
            name: "Rain Fire",
            damage: "Medium",
            description:
              "Throw a Fireball at your mouse location, dealing medium damage",
            key: "E",
          },
          {
            name: "Lightning Strike",
            damage: "High",
            description: "Hits a single target, dealing high damage",
            key: "R",
          },
        ];
        break;
    }
  }

  display() {
    noStroke();
    fill(0, 50);
    ellipse(
      this.position.x + camera.x,
      this.position.y + camera.y + 50,
      50,
      40
    );

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
    noStroke();
    fill(0, 255, 0);
    rect(
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size,
      this.size
    );

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

  update() {
    this.move();
    this.collideWithBlock();

    if (this.usingAbility.StaffSmash.using) {
      for (let i = 0; i < monsters.length; i++) {
        if (
          dist(
            this.position.x,
            this.position.y,
            monsters[i].position.x,
            monsters[i].position.y
          ) <
          this.stats.attackRange * 50
        ) {
          monsters[i].repel(
            this,
            50 -
              dist(
                this.position.x,
                this.position.y,
                monsters[i].position.x,
                monsters[i].position.y
              ) /
                10
          );
        }
      }
      this.usingAbility.StaffSmash.timer++;

      if (
        this.usingAbility.StaffSmash.timer >=
        this.usingAbility.StaffSmash.timeOut
      ) {
        this.usingAbility.StaffSmash.using = false;
        this.usingAbility.StaffSmash.timer = 0;
      }
    }
  }

  move() {
    this.running = false;
    if (keys[87] && this.collidingWith.bottom === false) {
      this.position.y -= this.stats.speed;
    }
    if (keys[83] && this.collidingWith.top === false) {
      this.position.y += this.stats.speed;
      this.running = true;
    }
    if (keys[68] && this.collidingWith.left === false) {
      this.position.x += this.stats.speed;
    }
    if (keys[65] && this.collidingWith.right === false) {
      this.position.x -= this.stats.speed;
    }
  }

  attack() {
    projectiles.push(
      new Projectile({
        x: this.position.x,
        y: this.position.y,
        target: this.endPoint,
        damage: this.stats.damage,
        type: "bullet",
      })
    );
  }
  useAbility(ability) {
    switch (ability) {
      case "Staff Smash":
        this.usingAbility.StaffSmash.using = true;
        break;
    }
  }

  collideWithBlock() {
    this.collideWithBottomBlock();
    this.collideWithTopBlock();
    this.collideWithRightBlock();
    this.collideWithLeftBlock();
  }

  collideWithBottomBlock() {
    this.collidingWith.bottom = false;
    for (let i = 0; i < blocks.length; i++) {
      if (
        this.position.x + this.size / 2 >=
          blocks[i].position.x - blocks[i].size / 2 + 5 &&
        this.position.x - this.size / 2 <=
          blocks[i].position.x + blocks[i].size / 2 - 5 &&
        this.position.y + this.size / 2 >= blocks[i].position.y &&
        this.position.y - this.size / 2 <=
          blocks[i].position.y + blocks[i].size / 2 &&
        blocks[i].type === "wall"
      ) {
        this.collidingWith.bottom = true;
      }
    }
  }
  collideWithTopBlock() {
    this.collidingWith.top = false;
    for (let i = 0; i < blocks.length; i++) {
      if (
        this.position.x + this.size / 2 >=
          blocks[i].position.x - blocks[i].size / 2 + 5 &&
        this.position.x - this.size / 2 <=
          blocks[i].position.x + blocks[i].size / 2 - 5 &&
        this.position.y + this.size / 2 >=
          blocks[i].position.y - blocks[i].size / 2 &&
        this.position.y - this.size / 2 <= blocks[i].position.y &&
        blocks[i].type === "wall"
      ) {
        this.collidingWith.top = true;
      }
    }
  }
  collideWithRightBlock() {
    this.collidingWith.right = false;
    for (let i = 0; i < blocks.length; i++) {
      if (
        this.position.x + this.size / 2 >= blocks[i].position.x &&
        this.position.x - this.size / 2 <=
          blocks[i].position.x + blocks[i].size / 2 &&
        this.position.y + this.size / 2 >=
          blocks[i].position.y - blocks[i].size / 2 + 5 &&
        this.position.y - this.size / 2 <=
          blocks[i].position.y + blocks[i].size / 2 - 5 &&
        blocks[i].type === "wall"
      ) {
        this.collidingWith.right = true;
      }
    }
  }
  collideWithLeftBlock() {
    this.collidingWith.left = false;
    for (let i = 0; i < blocks.length; i++) {
      if (
        this.position.x + this.size / 2 >=
          blocks[i].position.x - blocks[i].size / 2 &&
        this.position.x - this.size / 2 <= blocks[i].position.x &&
        this.position.y + this.size / 2 >=
          blocks[i].position.y - blocks[i].size / 2 + 5 &&
        this.position.y - this.size / 2 <=
          blocks[i].position.y + blocks[i].size / 2 - 5 &&
        blocks[i].type === "wall"
      ) {
        this.collidingWith.left = true;
      }
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
