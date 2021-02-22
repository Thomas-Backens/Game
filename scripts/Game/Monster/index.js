class Monster {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.repelVelocity = new p5.Vector(0, 0);
    this.type = config.type;

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
    this.target = heroes[0];
    this.attackTimer = 0;
    this.size = 50;
    this.glow = false;
    this.dying = false;
    this.dead = false;
    this.deathTimer = 0;

    this.burnTime = 30;
    this.burnTimer = 0;
    this.burning = false;
    this.burningTime = 300;
    this.burningTimer = 0;

    this.isRepelling = false;
    this.repelDuration = 0;
    this.repelTarget = null;
    this.repelTimer = 0;

    this.idleImg;
    this.walkGif;
    this.idleAttackImg;
    this.attackGif;
    this.deathGif;
    this.loaded = false;
    this.loadDelay = 0;
    this.setDelays = false;
    this.attacking = false;
    this.moving = false;
    this.angle = 0;

    switch (this.type) {
      case "Spider":
        this.stats = {
          maxHealth: 55,
          health: 55,
          damage: 7,
          defense: 2,
          attackRange: 1,
          attackSpeed: 2,
          speed: 3,
          visionRange: 10,
        };
        break;
    }

    this.fakeHealth = this.stats.maxHealth;
    this.hitTimer = 0;
  }

  loadImages() {
    this.idleImg = sprites.Spider.idleImg;
    this.walkGif = sprites.Spider.walkGif;
    this.idleAttackImg = sprites.Spider.idleAttackImg;
    this.attackGif = loadImage(
      "../../../sprites/Monsters/Spider/Attack.gif",
      () => (this.loaded = true),
      () => (this.loaded = false)
    );
    this.deathGif = loadImage(
      "../../../sprites/Monsters/Spider/Death.gif",
      () => (this.loaded = true),
      () => (this.loaded = false)
    );
  }

  display() {
    if (!this.dying) {
      this.angle = this.velocity.heading();
    }

    noStroke();
    if (this.glow) {
      strokeWeight(5);
      stroke(0, 255, 0);
      ellipse(
        this.position.x + camera.x,
        this.position.y + camera.y,
        this.size,
        this.size
      );
    }
    push();
    translate(this.position.x + camera.x, this.position.y + camera.y);
    rotate(this.angle - 4.8);
    // rect(this.position.x + camera.x, this.position.y + camera.y, 50, 50);
    if (this.dying) {
      image(this.deathGif, 0, 0, this.size * 2, this.size * 2);
    } else {
      if (this.moving) {
        image(this.walkGif, 0, 0, this.size * 2, this.size * 2);
      } else {
        if (this.attacking) {
          image(this.attackGif, 0, 0, this.size * 2, this.size * 2);
        } else {
          image(this.idleAttackImg, 0, 0, this.size * 2, this.size * 2);
        }
      }
    }
    pop();

    if (this.dying) return;

    if (this.hitTimer > 0) {
      this.hitTimer--;

      noStroke();
      fill(200, 0, 0);
      rect(
        this.position.x + camera.x,
        this.position.y + camera.y - this.size,
        50,
        10
      );
      fill(255);
      rect(
        this.position.x +
          camera.x -
          25 +
          map(
            constrain(this.fakeHealth, 0, this.stats.maxHealth),
            0,
            this.stats.maxHealth,
            0,
            50
          ) /
            2,
        this.position.y + camera.y - this.size,
        map(
          constrain(this.fakeHealth, 0, this.stats.maxHealth),
          0,
          this.stats.maxHealth,
          0,
          50
        ),
        10
      );
      fill(0, 200, 0);
      rect(
        this.position.x +
          camera.x -
          25 +
          map(
            constrain(this.stats.health, 0, this.stats.maxHealth),
            0,
            this.stats.maxHealth,
            0,
            50
          ) /
            2,
        this.position.y + camera.y - this.size,
        map(
          constrain(this.stats.health, 0, this.stats.maxHealth),
          0,
          this.stats.maxHealth,
          0,
          50
        ),
        10
      );
    }

    if (this.fakeHealth > this.stats.health + 1) {
      this.fakeHealth -= (this.fakeHealth - this.stats.health) / 6;
      this.hitTimer = 60;
    }
  }

  update() {
    if (this.stats.health <= 0) {
      this.dying = true;
    }

    if (this.dying) {
      this.deathTimer++;

      if (this.deathTimer >= 90) {
        this.dead = true;
      }
    }

    if (this.dying) return;

    this.move();
    this.attack();

    if (this.burning) {
      this.burnTimer++;
      this.burningTimer++;

      if (this.burnTimer >= this.burnTime) {
        this.stats.health -= calculateDefense(this.stats.defense, 30);
        this.burnTimer = 0;
      }

      if (this.burningTimer >= this.burningTime) {
        this.burning = false;
        this.burnTimer = 0;
      }
    }

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i] === this) continue;
      if (
        dist(
          this.position.x,
          this.position.y,
          monsters[i].position.x,
          monsters[i].position.y
        ) <
          this.size / 2 &&
        !monsters[i].dying
      ) {
        this.repel(monsters[i], this.speed);
      }
    }

    if (this.loaded) {
      if (this.loadDelay < 60) {
        this.loadDelay++;
      }
    }

    if (this.isRepelling) {
      this.repel(this.repelTarget, 20);

      this.repelTimer++;
      if (this.repelTimer >= this.repelDuration) {
        this.isRepelling = false;
        this.repelTimer = 0;
        this.repelDuration = 0;
        this.repelTarget = null;
      }
    }
  }

  onScreen() {
    return (
      this.position.x > heroes[0].position.x - windowWidth / 2 &&
      this.position.x < heroes[0].position.x + windowWidth / 2 &&
      this.position.y > heroes[0].position.y - windowHeight / 1.5 &&
      this.position.y < heroes[0].position.y + windowHeight / 1.5
    );
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
      this.moving = true;
    } else {
      this.moving = false;
    }

    if (this.moving && !this.attacking) {
      this.position.add(this.velocity);
    }
  }

  attack() {
    if (this.target === null) {
      return;
    }

    this.attacking = false;
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
      // if (this.attackTimer >= this.stats.attackSpeed * 30) {
      this.attacking = true;
      // }

      if (this.attackTimer >= this.stats.attackSpeed * 60) {
        this.target.stats.health -= calculateDefense(
          this.target.stats.defense,
          this.stats.damage
        );
        this.attackTimer = 0;
      }
    }
  }

  repelling(target, duration) {
    this.isRepelling = true;
    this.repelDuration = duration;
    this.repelTarget = target;
  }

  repel(target, power) {
    let strength;
    if (!power) {
      strength = this.stats.speed * 2;
    } else {
      strength = power;
    }

    let repeller = p5.Vector.sub(this.position, target.position);
    repeller.normalize();
    repeller.mult(10);

    this.repelVelocity.add(repeller);
    this.repelVelocity.limit(strength);
    this.position.add(this.repelVelocity);
  }
}
