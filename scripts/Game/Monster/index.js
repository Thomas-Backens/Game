class Monster {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.repelVelocity = new p5.Vector(0, 0);
    this.type = config.type;
    this.isBoss = config.isBoss || false;

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
    this.abilities = {
      jump: {},
      webSlinger: {},
    };
    this.target = heroes[0];
    this.attackTimer = 0;
    this.size = 0;
    this.glow = false;
    this.dying = false;
    this.dead = false;
    this.deathTimer = 0;
    this.hurtTimer = 0;
    this.flee = false;
    this.speedOffset = 0;

    this.burnTime = 30;
    this.burnTimer = 0;
    this.burning = false;
    this.burningTime = 300;
    this.burningTimer = 0;

    this.isRepelling = false;
    this.repelDuration = 0;
    this.repelTarget = null;
    this.repelTimer = 0;

    this.jabLength = 0;
    this.hasShed = false;
    this.shedAlpha = 255;
    this.shedAngle = 0;
    this.shedX = 0;
    this.shedY = 0;

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
        this.size = 50;
        break;
      case "Snake":
        this.stats = {
          maxHealth: 85,
          health: 85,
          damage: 15,
          defense: 8,
          attackRange: 2,
          attackSpeed: 3,
          speed: 2,
          visionRange: 15,
        };
        this.size = 50;
        break;
      case "Bear":
        this.stats = {
          maxHealth: 110,
          health: 110,
          damage: 20,
          defense: 10,
          attackRange: 1,
          attackSpeed: 5,
          speed: 1,
          visionRange: 12,
        };
        this.size = 75;
        break;
    }

    if (this.isBoss) {
      switch (this.type) {
        case "Spider":
          this.stats = {
            maxHealth: 1000,
            health: 1000,
            damage: 75,
            defense: 20,
            attackRange: 2,
            attackSpeed: 3,
            speed: 4,
            visionRange: 10,
          };
          this.size = 100;
          break;
        case "Snake":
          this.stats = {
            maxHealth: 1500,
            health: 1500,
            damage: 125,
            defense: 35,
            attackRange: 4,
            attackSpeed: 5,
            speed: 5,
            visionRange: 15,
          };
          this.size = 100;
          break;
      }
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

    if (this.glow) {
      noFill();
      strokeWeight(3);
      stroke(255, 0, 0, 150);
      ellipse(
        this.position.x + camera.x,
        this.position.y + camera.y,
        this.size,
        this.size
      );
    }

    push();
    if (this.fakeHealth > this.stats.health + 1 && !this.dying) {
      tint(255, 0, 0);
    }

    switch (this.type) {
      case "Spider":
        push();
        noStroke();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle - 4.8);
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
        break;
      case "Snake":
        push();
        noStroke();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle - 4.8);
        fill(0, 150, 0);
        if (this.dying) {
          fill(80, 100, 0);
        }
        rect(0, -(this.jabLength / 2), 25, 100 + this.jabLength, 10);
        fill(150, 0, 0);
        ellipse(-5, -40 - this.jabLength, 5, 5);
        ellipse(5, -40 - this.jabLength, 5, 5);
        if (this.fakeHealth > this.stats.health + 1 && !this.dying) {
          fill(255, 0, 0, 200);
          rect(0, -(this.jabLength / 2), 25, 100 + this.jabLength, 10);
        }
        pop();

        if (this.hasShed) {
          if (this.shedAlpha > 0) {
            this.shedAlpha -= 3;
            push();
            noStroke();
            translate(this.shedX + camera.x, this.shedY + camera.y);
            rotate(this.shedAngle);
            fill(0, 150, 0, this.shedAlpha);
            rect(0, 0, 25, 100, 10);
            fill(150, 0, 0, this.shedAlpha);
            ellipse(-5, -40, 5, 5);
            ellipse(5, -40, 5, 5);
            pop();
          }
        } else {
          this.shedAngle = this.angle - 4.8;
          this.shedX = this.position.x;
          this.shedY = this.position.y;
        }
        break;
      case "Bear":
        push();
        strokeWeight(1);
        stroke(0);
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle - 4.8);
        fill(130, 70, 0);
        if (this.dying) {
          fill(100, 50, 0);
        }
        ellipse(0, 0, 75, 50);
        ellipse(15, 19, 10, 15);
        ellipse(-15, 19, 10, 15);
        ellipse(0, 7, 50, 40);
        fill(0);
        ellipse(7, -2, 3, 6);
        ellipse(-7, -2, 3, 6);
        ellipse(0, -10, 8, 5);
        pop();
        break;
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
  }

  update() {
    if (this.stats.health <= 0) {
      this.dying = true;
    }

    if (this.dying) {
      if (this.deathTimer === 0) {
        let randomNum1 = round(random(0, 5));
        let randomNum2 = round(random(0, 3));
        for (let i = 0; i < randomNum1; i++) {
          coins.push(
            new Coin({
              x: this.position.x,
              y: this.position.y,
              type: "Coin",
            })
          );
        }
        for (let i = 0; i < randomNum2; i++) {
          coins.push(
            new Coin({
              x: this.position.x,
              y: this.position.y,
              type: "XP",
            })
          );
        }
      }
      this.deathTimer++;

      if (this.deathTimer >= 80) {
        this.dead = true;
      }
    }

    if (this.dying) return;

    this.move();

    switch (this.type) {
      case "Spider":
        if (!this.flee) {
          this.bite();
        }

        if (this.fakeHealth <= this.stats.health + 1) {
          this.hurtTimer++;
        } else {
          this.hurtTimer = 0;
        }

        if (this.hurtTimer >= 300) {
          if (this.stats.health < this.stats.maxHealth) {
            this.stats.health += 2;
          } else {
            this.stats.health = this.stats.maxHealth;
          }
          this.fakeHealth = this.stats.health;
        }

        if (this.stats.health <= this.stats.maxHealth / 4) {
          this.flee = true;
        } else {
          this.flee = false;
        }
        break;
      case "Snake":
        if (!this.flee) {
          this.jab();
        }

        if (this.attacking) {
          if (this.jabLength < 80) {
            this.jabLength += 20;
          }
        } else {
          if (this.jabLength > 0) {
            this.jabLength -= 5;
          }
        }

        if (
          this.stats.health <= this.stats.maxHealth / (100 / 15) &&
          !this.hasShed
        ) {
          this.shed();
        }

        if (
          dist(
            this.position.x,
            this.position.y,
            this.target.position.x,
            this.target.position.y
          ) <
            this.stats.attackRange * 90 &&
          this.jabLength <= 0
        ) {
          this.flee = true;
        }
        if (
          dist(
            this.position.x,
            this.position.y,
            this.target.position.x,
            this.target.position.y
          ) >
            this.stats.attackRange * 150 &&
          this.flee
        ) {
          this.flee = false;
        }
        break;
      case "Bear":
        this.bite();
        break;
    }

    if (this.flee) {
      this.attacking = false;
      this.moving = true;
      // this.speedOffset = this.stats.speed / 2;
    } else {
      // this.speedOffset = 0;
    }

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

    if (this.fakeHealth > this.stats.health + 1) {
      this.fakeHealth -= (this.fakeHealth - this.stats.health) / 6;
      this.hitTimer = 60;
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
    if (this.flee) {
      destination = p5.Vector.sub(this.position, this.target.position);
    }
    destination.normalize();
    if (this.type === "Spider") {
      destination.mult(0.5);
    } else if (this.type === "Snake") {
      destination.mult(0.25);
    } else if (this.type === "Bear") {
      destination.mult(0.125);
    }

    this.velocity.add(destination);
    this.velocity.limit(this.stats.speed + this.speedOffset);

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
      if (!this.flee) {
        this.moving = false;
      }
    }

    if (this.moving && !this.attacking) {
      this.position.add(this.velocity);
    }
  }

  bite() {
    if (this.target === null) {
      return;
    }

    if (this.attackTimer < this.stats.attackSpeed * 48) {
      this.attackTimer++;
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
      if (this.attackTimer >= this.stats.attackSpeed * 48) {
        this.attackTimer++;
      }
      if (
        this.attackTimer >= 0 &&
        this.attackTimer < this.stats.attackSpeed * 42
      ) {
        this.attacking = false;
        this.attackGif.reset();
        this.attackGif.pause();
      }
      if (this.attackTimer >= this.stats.attackSpeed * 48) {
        this.attacking = true;
        this.attackGif.play();
      }

      if (this.attackTimer >= this.stats.attackSpeed * 60) {
        this.target.stats.health -= calculateDefense(
          this.target.stats.defense,
          this.stats.damage
        );
        this.attackTimer = 0;
      }
    } else {
      this.attacking = false;
      // this.attackGif.pause();
      this.attackGif.reset();
    }
  }

  jab() {
    if (this.target === null) {
      return;
    }

    this.attackTimer++;
    if (
      dist(
        this.position.x,
        this.position.y,
        this.target.position.x,
        this.target.position.y
      ) <
        this.stats.attackRange * 100 &&
      !this.flee
    ) {
      if (this.attackTimer >= this.stats.attackSpeed * 60) {
        this.attacking = true;
      }
    }
    if (this.jabLength >= 80) {
      this.target.stats.health -= calculateDefense(
        this.target.stats.defense,
        this.stats.damage
      );
      this.attackTimer = 0;
      this.attacking = false;
    }
  }

  shed() {
    this.stats.health = this.stats.maxHealth;
    this.burning = false;
    this.burnTimer = 0;
    this.hasShed = true;
  }

  spidersAbilities() {
    if (this.abilities.webSlinger.using) {
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
