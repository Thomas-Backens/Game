class Hero {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    // this.projectileVelocity = new p5.Vector(0, 0);
    this.endPoint = new p5.Vector(0, 0);
    this.angle = 0;

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
    this.ability = {
      StaffSmash: { using: false, timeOut: 20, timer: 0 },
      RainFire: { using: false, used: false, timeOut: 60, duration: 300 },
      LightningStrike: { using: false, used: false, duration: 10 },
    };
    this.collidingWith = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };
    this.closestEnemy = null;
    this.closestEnemysDistance = Infinity;
    this.attackTimer = 0;

    this.idle;
    this.walk;
    this.staffSmash;
    this.size = 70;
    this.character = config.character;

    this.running = false;

    switch (this.character) {
      case "Arthur":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/Walk.gif");
        this.staffSmash = loadImage("../../../sprites/Projectiles/Wind.gif");
        this.stats = {
          maxHealth: 500,
          health: 500,
          damage: 50,
          defense: 25,
          attackRange: 10,
          attackSpeed: 0.5,
          speed: 5,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Staff Smash",
            damage: "Low",
            description:
              "Pushes Monsters away from you, dealing minimal damage",
            key: "q",
          },
          {
            name: "Rain Fire",
            damage: "Medium",
            description:
              "Throw a Fireball at your mouse location, dealing medium damage",
            key: "e",
          },
          {
            name: "Lightning Strike",
            damage: "High",
            description: "Hits a single target, dealing high damage",
            key: "r",
          },
        ];
        break;
      case "Rex":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/Walk.gif");
        this.stats = {
          maxHealth: 500,
          health: 500,
          damage: 50,
          defense: 25,
          attackRange: 1.5,
          attackSpeed: 1,
          speed: 5,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Staff Smash",
            damage: "Low",
            description:
              "Pushes Monsters away from you, dealing minimal damage",
            key: "q",
          },
          {
            name: "Rain Fire",
            damage: "Medium",
            description:
              "Throw a Fireball at your mouse location, dealing medium damage",
            key: "e",
          },
          {
            name: "Lightning Strike",
            damage: "High",
            description: "Hits a single target, dealing high damage",
            key: "r",
          },
        ];
        break;
      case "Kora":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/Walk.gif");
        this.stats = {
          maxHealth: 500,
          health: 500,
          damage: 50,
          defense: 25,
          attackRange: 8,
          splashRange: 3,
          attackSpeed: 2,
          speed: 5,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Staff Smash",
            damage: "Low",
            description:
              "Pushes Monsters away from you, dealing minimal damage",
            key: "q",
          },
          {
            name: "Rain Fire",
            damage: "Medium",
            description:
              "Throw a Fireball at your mouse location, dealing medium damage",
            key: "e",
          },
          {
            name: "Lightning Strike",
            damage: "High",
            description: "Hits a single target, dealing high damage",
            key: "r",
          },
        ];
        break;
    }
  }

  display() {
    if (this.ability.StaffSmash.using) {
      this.staffSmash.reset();
      image(
        this.staffSmash,
        this.position.x + camera.x,
        this.position.y + camera.y
      );
    }

    noStroke();
    fill(0, 50);
    ellipse(
      this.position.x + camera.x,
      this.position.y + camera.y + 30,
      50,
      40
    );

    if (this.running) {
      image(
        this.walk,
        this.position.x + camera.x,
        this.position.y + camera.y - 15,
        100,
        100
      );
    } else {
      image(
        this.idle,
        this.position.x + camera.x,
        this.position.y + camera.y - 15,
        100,
        100
      );
    }

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
    // let angle = this.projectileVelocity.heading();
    this.angle = atan2(
      mouseY - camera.y - this.position.y,
      mouseX - camera.x - this.position.x
    );

    // let newPosition = new p5.Vector(this.position.x, this.position.y);
    this.endPoint = calculateEndPosition(
      this.position,
      this.stats.attackRange * 50,
      this.angle
    );

    switch (this.character) {
      case "Arthur":
        noStroke();
        if (this.attackTimer < this.stats.attackSpeed * 60) {
          fill(255, 0, 0, 50);
        } else {
          fill(255, 50);
        }
        push();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle);
        rect(
          this.stats.attackRange * 25 + 50,
          0,
          this.stats.attackRange * 50 - 50,
          50
        );
        pop();
        break;
      case "Rex":
        noFill();
        strokeCap(SQUARE);
        strokeWeight(this.stats.attackRange * 100);
        if (this.attackTimer < this.stats.attackSpeed * 60) {
          stroke(255, 0, 0, 50);
        } else {
          stroke(255, 50);
        }
        push();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle);
        arc(
          0,
          0,
          this.stats.attackRange * 100 + 100,
          this.stats.attackRange * 100 + 100,
          -HALF_PI / 1.5,
          HALF_PI / 1.5
        );
        pop();
        break;
      case "Kora":
        noStroke();
        if (this.attackTimer < this.stats.attackSpeed * 60) {
          fill(255, 0, 0, 50);
        } else {
          fill(255, 50);
        }
        if (
          dist(
            mouseX,
            mouseY,
            this.position.x + camera.x,
            this.position.y + camera.y
          ) <
          this.stats.attackRange * 50
        ) {
          ellipse(
            mouseX,
            mouseY,
            this.stats.splashRange * 100,
            this.stats.splashRange * 100
          );
        } else {
          push();
          translate(this.position.x + camera.x, this.position.y + camera.y);
          rotate(this.angle);
          ellipse(
            this.stats.attackRange * 50,
            0,
            this.stats.splashRange * 100,
            this.stats.splashRange * 100
          );
          pop();
        }
        break;
    }

    // let mouse = new p5.Vector(mouseX - camera.x, mouseY - camera.y);
    // let destination = p5.Vector.sub(mouse, this.position);
    // destination.normalize();
    // destination.mult(100);

    // this.projectileVelocity.add(destination);
    // this.projectileVelocity.limit(10);
  }

  update() {
    this.move();
    this.collideWithBlock();

    this.attackTimer++;

    switch (this.character) {
      case "Arthur":
        this.arthursAbilites();
        break;
    }
  }

  arthursAbilites() {
    if (this.ability.StaffSmash.using) {
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
      this.ability.StaffSmash.timer++;

      if (this.ability.StaffSmash.timer >= this.ability.StaffSmash.timeOut) {
        this.ability.StaffSmash.using = false;
        this.ability.StaffSmash.timer = 0;
      }
    }

    if (this.ability.RainFire.using) {
      strokeWeight(5);
      stroke(255, 0, 0);
      fill(255, 0, 0, 50);
      ellipse(mouseX, mouseY, 300, 300);
    }
    if (this.ability.RainFire.used) {
      if (this.ability.RainFire.using) {
        projectiles.push(
          new Projectile({
            x: mouseX - camera.x,
            y: mouseY - camera.y,
            damage: 100,
            waitingTime: this.ability.RainFire.timeOut,
            duration: this.ability.RainFire.duration,
            attackRange: 3,
            type: "Fire Ball",
          })
        );
        this.ability.RainFire.using = false;
        this.ability.RainFire.used = false;
      }
    }

    if (this.ability.LightningStrike.using) {
      this.closestEnemysDistance = Infinity;
      this.closestEnemy = null;
      for (let i = 0; i < monsters.length; i++) {
        if (
          Math.pow(monsters[i].position.x - (mouseX - camera.x), 2) +
            Math.pow(monsters[i].position.y - (mouseY - camera.y), 2) <
          this.closestEnemysDistance
        ) {
          this.closestEnemy = monsters[i];
          this.closestEnemysDistance =
            Math.pow(monsters[i].position.x - (mouseX - camera.x), 2) +
            Math.pow(monsters[i].position.y - (mouseY - camera.y), 2);
        }

        monsters[i].glow = false;
      }
      this.closestEnemy.glow = true;

      if (this.ability.LightningStrike.used) {
        projectiles.push(
          new Projectile({
            startObj: this,
            damage: 100,
            duration: this.ability.LightningStrike.duration,
            target: this.closestEnemy,
            type: "Lazer",
          })
        );
        this.ability.LightningStrike.using = false;
        this.ability.LightningStrike.used = false;
        this.closestEnemy.glow = false;
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
    if (this.attackTimer < this.stats.attackSpeed * 60) return;

    this.attackTimer = 0;
    switch (this.character) {
      case "Arthur":
        projectiles.push(
          new Projectile({
            x: this.position.x,
            y: this.position.y,
            target: this.endPoint,
            damage: this.stats.damage,
            type: "Bullet",
          })
        );
        break;
      case "Rex":
        for (let i = 0; i < monsters.length; i++) {
          if (
            dist(
              this.position.x + camera.x,
              this.position.y + camera.y,
              monsters[i].position.x + camera.x,
              monsters[i].position.y + camera.y
            ) <
            50 + this.stats.attackRange * 100
          ) {
            if (
              rectCircleCollide(
                this.position.x + camera.x,
                this.position.y + camera.y,
                200,
                200,
                this.angle - HALF_PI / 1.5,
                monsters[i].position.x + camera.x,
                monsters[i].position.y + camera.y,
                5
              ) ||
              rectCircleCollide(
                this.position.x + camera.x,
                this.position.y + camera.y,
                200,
                200,
                this.angle + HALF_PI / 3 - HALF_PI / 1.5,
                monsters[i].position.x + camera.x,
                monsters[i].position.y + camera.y,
                5
              )
            ) {
              monsters[i].stats.health -= calculateDefense(
                monsters[i].stats.defense,
                this.stats.damage
              );
              monsters[i].repel(this, 1500);
            }
          }
        }
        break;
      case "Kora":
        if (
          dist(
            this.position.x + camera.x,
            this.position.y + camera.y,
            mouseX,
            mouseY
          ) <
          this.stats.attackRange * 50
        ) {
          projectiles.push(
            new Projectile({
              x: this.position.x,
              y: this.position.y,
              startObj: this,
              target: new p5.Vector(mouseX - camera.x, mouseY - camera.y),
              damage: this.stats.damage,
              speed: 5,
              attackRange: this.stats.splashRange * 100,
              type: "Toss",
            })
          );
        } else {
          projectiles.push(
            new Projectile({
              x: this.position.x,
              y: this.position.y,
              startObj: this,
              target: this.endPoint,
              damage: this.stats.damage,
              speed: 5,
              attackRange: this.stats.splashRange * 100,
              type: "Toss",
            })
          );
        }
        break;
    }
  }
  useAbility(ability) {
    switch (ability) {
      case "Staff Smash":
        this.ability.StaffSmash.using = true;
        this.ability.StaffSmash.used = false;
        break;
      case "Rain Fire":
        this.ability.RainFire.using = true;
        this.ability.RainFire.used = false;
        break;
      case "Lightning Strike":
        this.ability.LightningStrike.using = true;
        this.ability.LightningStrike.used = false;
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
      if (blocks[i].type === "wall") {
        if (
          blocks[i].wallTile === 4 ||
          blocks[i].wallTile === 5 ||
          blocks[i].wallTile === 9
        ) {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x + 5 &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 - 5 &&
            this.position.y + this.size / 2 >= blocks[i].position.y &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2
          ) {
            this.collidingWith.bottom = true;
          }
        } else if (
          blocks[i].wallTile === 2 ||
          blocks[i].wallTile === 3 ||
          blocks[i].wallTile === 8
        ) {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 + 5 &&
            this.position.x - this.size / 2 <= blocks[i].position.x - 5 &&
            this.position.y + this.size / 2 >= blocks[i].position.y &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2
          ) {
            this.collidingWith.bottom = true;
          }
        } else {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 + 5 &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 - 5 &&
            this.position.y + this.size / 2 >= blocks[i].position.y &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2
          ) {
            this.collidingWith.bottom = true;
          }
        }
      }
    }
  }
  collideWithTopBlock() {
    this.collidingWith.top = false;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "wall") {
        if (
          blocks[i].wallTile === 4 ||
          blocks[i].wallTile === 5 ||
          blocks[i].wallTile === 9
        ) {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x + 5 &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 - 5 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 &&
            this.position.y - this.size / 2 <= blocks[i].position.y
          ) {
            this.collidingWith.top = true;
          }
        } else if (
          blocks[i].wallTile === 2 ||
          blocks[i].wallTile === 3 ||
          blocks[i].wallTile === 8
        ) {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 + 5 &&
            this.position.x - this.size / 2 <= blocks[i].position.x - 5 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 &&
            this.position.y - this.size / 2 <= blocks[i].position.y
          ) {
            this.collidingWith.top = true;
          }
        } else {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 + 5 &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 - 5 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 &&
            this.position.y - this.size / 2 <= blocks[i].position.y
          ) {
            this.collidingWith.top = true;
          }
        }
      }
    }
  }
  collideWithRightBlock() {
    this.collidingWith.right = false;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "wall") {
        if (
          blocks[i].wallTile === 4 ||
          blocks[i].wallTile === 5 ||
          blocks[i].wallTile === 9
        ) {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x + 5 &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.right = true;
          }
        } else if (
          blocks[i].wallTile === 2 ||
          blocks[i].wallTile === 3 ||
          blocks[i].wallTile === 8
        ) {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x &&
            this.position.x - this.size / 2 <= blocks[i].position.x &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.right = true;
          }
        } else {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x &&
            this.position.x - this.size / 2 <=
              blocks[i].position.x + blocks[i].size / 2 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.right = true;
          }
        }
      }
    }
  }
  collideWithLeftBlock() {
    this.collidingWith.left = false;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "wall") {
        if (
          blocks[i].wallTile === 4 ||
          blocks[i].wallTile === 5 ||
          blocks[i].wallTile === 9
        ) {
          if (
            this.position.x + this.size / 2 >= blocks[i].position.x &&
            this.position.x - this.size / 2 <= blocks[i].position.x &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.left = true;
          }
        } else if (
          blocks[i].wallTile === 2 ||
          blocks[i].wallTile === 3 ||
          blocks[i].wallTile === 8
        ) {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 &&
            this.position.x - this.size / 2 <= blocks[i].position.x - 5 &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.left = true;
          }
        } else {
          if (
            this.position.x + this.size / 2 >=
              blocks[i].position.x - blocks[i].size / 2 &&
            this.position.x - this.size / 2 <= blocks[i].position.x &&
            this.position.y + this.size / 2 >=
              blocks[i].position.y - blocks[i].size / 2 + 5 &&
            this.position.y - this.size / 2 <=
              blocks[i].position.y + blocks[i].size / 2 - 5
          ) {
            this.collidingWith.left = true;
          }
        }
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
