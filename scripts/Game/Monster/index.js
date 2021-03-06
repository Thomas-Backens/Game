class Monster {
  constructor(config) {
    this.sprites = config.sprites;
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
      jump: { timer: 0, timeOut: 18, using: false, damage: 100 },
      swarm: { timer: 0, timeOut: 13, using: false },
      webSlinger: { timer: 0, timeOut: 10, using: false, duration: 5 },
    };
    this.target = heroes[0];
    this.attackTimer = 0;
    this.size = 0;
    this.glow = false;
    this.dying = false;
    this.dead = false;
    this.spawnTimer = 0;
    this.deathTimer = 0;
    this.hurtTimer = 0;
    this.burrowed = true;
    this.burrowTimer = 300;
    this.unburrow = false;
    this.flee = false;
    this.fleeHit = false;
    this.enrage = false;
    this.speedOffset = 0;

    this.burnTime = 30;
    this.burnTimer = 0;
    this.burning = false;
    this.burningTime = 275;
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

    this.loaded = true;
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
          speed: 4,
          visionRange: 15,
        };
        this.size = 50;
        break;
      case "Bear":
        this.stats = {
          maxHealth: 255,
          health: 255,
          damage: 70,
          defense: 10,
          attackRange: 1.5,
          attackSpeed: 3,
          speed: 3,
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
            attackRange: 3,
            attackSpeed: 2,
            speed: 5,
            visionRange: 15,
          };
          this.size = 100;
          break;
        case "Bear":
          this.stats = {
            maxHealth: 2000,
            health: 2500,
            damage: 195,
            defense: 50,
            attackRange: 3,
            attackSpeed: 5,
            speed: 4,
            visionRange: 12,
          };
          this.size = 150;
          break;
      }
    }

    this.fakeHealth = this.stats.maxHealth;
    this.hitTimer = 0;
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
    if (
      this.fakeHealth > this.stats.health + 1 &&
      !this.dying &&
      !this.burrowed
    ) {
      tint(255, 0, 0);
    }

    switch (this.type) {
      case "Spider":
        push();
        noStroke();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle - 4.8);
        if (!this.burrowed) {
          if (this.dying) {
            image(this.sprites.deathGif, 0, 0, this.size * 2, this.size * 2);
          } else {
            if (this.moving) {
              image(this.sprites.walkGif, 0, 0, this.size * 2, this.size * 2);
            } else {
              if (this.attacking) {
                image(
                  this.sprites.attackGif,
                  0,
                  0,
                  this.size * 2,
                  this.size * 2
                );
              } else {
                image(
                  this.sprites.idleAttackImg,
                  0,
                  0,
                  this.size * 2,
                  this.size * 2
                );
              }
            }
          }
        }
        pop();
        break;
      case "Snake":
        if (this.hasShed) {
          if (this.shedAlpha > 0) {
            this.shedAlpha -= 3;
            push();
            noStroke();
            translate(this.shedX + camera.x, this.shedY + camera.y);
            rotate(this.shedAngle);
            tint(50, 100, 0);
            image(this.sprites.idleImg, 0, 0, this.size * 2, this.size * 2);
            pop();
          }
        } else {
          this.shedAngle = this.angle - 4.8;
          this.shedX = this.position.x;
          this.shedY = this.position.y;
        }
        push();
        noStroke();
        translate(this.position.x + camera.x, this.position.y + camera.y);
        rotate(this.angle - 4.8);
        if (!this.burrowed) {
          if (this.dying) {
            image(this.sprites.deathGif, 0, 0, this.size * 2, this.size * 2);
          } else {
            if (this.moving) {
              image(this.sprites.walkGif, 0, 0, this.size * 2, this.size * 2);
            } else {
              if (this.attacking) {
                image(
                  this.sprites.attackGif,
                  0,
                  0,
                  this.size * 4,
                  this.size * 4
                );
              } else {
                image(this.sprites.idleImg, 0, 0, this.size * 2, this.size * 2);
              }
            }
          }
        }
        pop();
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
        ellipse(-30, 20, 25, 25);
        ellipse(30, 20, 25, 25);
        ellipse(-30, 50, 25, 25);
        ellipse(30, 50, 25, 25);
        ellipse(0, 50, 75, 100);
        ellipse(15, 19, 10, 15);
        ellipse(-15, 19, 10, 15);
        ellipse(0, 7, 50, 40);
        fill(0);
        if (this.enrage) {
          fill(255, 0, 0);
        }
        ellipse(7, -2, 3, 6);
        ellipse(-7, -2, 3, 6);
        fill(0);
        ellipse(0, -10, 8, 5);
        pop();
        break;
    }
    if (this.burrowed) {
      if (this.type === "Spider") {
        if (this.unburrow) {
          image(
            this.sprites.unburrowGif,
            this.position.x + camera.x,
            this.position.y + camera.y,
            this.size * 2,
            this.size * 2
          );
        } else {
          image(
            this.sprites.holeImg,
            this.position.x + camera.x,
            this.position.y + camera.y,
            this.size * 2,
            this.size * 2
          );
        }
      } else {
        image(
          this.sprites.holeImg,
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size * 2,
          this.size * 2
        );
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
  }

  update() {
    if (this.stats.health <= 0) {
      this.dying = true;
    }

    if (this.dying) {
      if (this.deathTimer === 0) {
        let randomNum1;
        let randomNum2;
        let coinAmount;
        let xpAmount;
        switch (this.type) {
          case "Spider":
            if (this.isBoss) {
              randomNum1 = round(random(5, 15));
              randomNum2 = round(random(10, 20));
              coinAmount = round(random(30, 50));
              xpAmount = round(random(50, 100));
            } else {
              randomNum1 = round(random(0, 5));
              randomNum2 = round(random(0, 3));
              coinAmount = round(random(1, 10));
              xpAmount = round(random(1, 5));
            }
            break;
          case "Snake":
            if (this.isBoss) {
              randomNum1 = round(random(5, 15));
              randomNum2 = round(random(10, 20));
              coinAmount = round(random(50, 100));
              xpAmount = round(random(150, 250));
            } else {
              randomNum1 = round(random(0, 5));
              randomNum2 = round(random(0, 3));
              coinAmount = round(random(1, 30));
              xpAmount = round(random(1, 20));
            }
            break;
          case "Bear":
            if (this.isBoss) {
              randomNum1 = round(random(5, 15));
              randomNum2 = round(random(10, 20));
              coinAmount = round(random(150, 300));
              xpAmount = round(random(300, 500));
            } else {
              randomNum1 = round(random(0, 5));
              randomNum2 = round(random(0, 3));
              coinAmount = round(random(15, 50));
              xpAmount = round(random(10, 30));
            }
            break;
        }
        for (let i = 0; i < randomNum1; i++) {
          coins.push(
            new Item({
              x: this.position.x,
              y: this.position.y,
              type: "Coin",
              amount: coinAmount,
            })
          );
        }
        for (let i = 0; i < randomNum2; i++) {
          coins.push(
            new Item({
              x: this.position.x,
              y: this.position.y,
              type: "XP",
              amount: xpAmount,
            })
          );
        }
      }
      this.deathTimer++;

      if (this.deathTimer >= 80) {
        this.dead = true;
      }
      return;
    }

    this.move();

    if (this.hurtTimer >= 300 && !this.isBoss) {
      if (this.stats.health < this.stats.maxHealth) {
        this.stats.health++;
      } else {
        this.stats.health = this.stats.maxHealth;
        this.hurtTimer = 0;
      }
      this.fakeHealth = this.stats.health;
    }

    switch (this.type) {
      case "Spider":
        if (!this.flee && !this.burrowed) {
          this.bite();
        }
        if (this.isBoss) {
          this.spidersAbilities();
        }

        if (this.fakeHealth <= this.stats.health + 1) {
          this.fakeHealth = this.stats.health;
        }
        if (this.stats.health < this.stats.maxHealth) {
          this.hurtTimer++;

          if (this.fakeHealth > this.stats.health + 1) {
            this.hurtTimer = 0;
          }
        }

        if (this.hurtTimer >= 600 && this.isBoss) {
          if (this.stats.health < this.stats.maxHealth) {
            this.stats.health += 10;
          } else {
            this.stats.health = this.stats.maxHealth;
          }
          this.fakeHealth = this.stats.health;
        }

        if (this.stats.health <= this.stats.maxHealth / 2) {
          this.flee = true;
        } else {
          this.flee = false;
        }

        if (this.burrowed) {
          this.stats.defense = 80;
        } else {
          this.stats.defense = 2;
        }
        break;
      case "Snake":
        if (!this.flee) {
          this.jab();
        }

        if (this.isBoss) {
          this.spawnTimer++;
          if (this.spawnTimer >= 600) {
            this.spawnTimer = 0;
            let randonNum = round(random(2, 4));
            for (let i = 0; i < randonNum; i++) {
              monsters.push(
                new Monster({
                  sprites: {
                    idleImg: sprites.Snake.idleImg,
                    walkGif: cloneGif(sprites.Snake.walkGif, 0),
                    attackGif: cloneGif(sprites.Snake.attackGif, 0),
                    deathGif: cloneGif(sprites.Snake.deathGif, 0),
                  },
                  x: this.position.x + random(-100, 100),
                  y: this.position.y + random(-100, 100),
                  type: "Spider",
                })
              );
            }
          }
        }

        if (
          this.stats.health <= this.stats.maxHealth / (100 / 15) &&
          !this.hasShed &&
          !this.burrowed
        ) {
          this.shed();
        }

        if (!this.isBoss) {
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
        }

        if (this.burrowed) {
          this.stats.defense = 90;
        } else {
          this.stats.defense = 8;
        }
        break;
      case "Bear":
        this.bite();

        if (
          this.stats.health < this.stats.maxHealth / (100 / 30) &&
          this.enrage === false
        ) {
          this.enrage = true;
        }

        if (this.enrage) {
          this.stats.speed = 5;
          this.stats.attackSpeed = 0.5;
          this.stats.damage = 105;
        }
        break;
    }

    if (this.flee) {
      this.attacking = false;
      this.moving = true;
      if (this.fleeHit && !this.isBoss && this.type !== "Snake") {
        this.burrowed = true;
        this.fleeHit = false;
      }
    }

    if (this.burrowed) {
      this.burrowTimer++;

      if (this.type === "Spider") {
        if (!this.unburrow) {
          this.sprites.unburrowGif.reset();
        }
        if (this.burrowTimer >= 300) {
          this.unburrow = true;
        }
        if (this.burrowTimer >= 360) {
          this.burrowed = false;
          this.unburrow = false;
          this.burrowTimer = 0;
        }
      } else {
        if (this.burrowTimer >= 300) {
          this.burrowed = false;
          this.burrowTimer = 0;
        }
      }
    }

    if (this.burning) {
      this.burnTimer++;
      this.burningTimer++;

      if (this.burnTimer >= this.burnTime) {
        this.stats.health -= calculateDefense(
          this.stats.defense,
          heroes[0].stats.damage / 2
        );
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
      if (
        dist(
          this.position.x,
          this.position.y,
          this.target.position.x,
          this.target.position.y
        ) < this.size
      ) {
        destination = p5.Vector.sub(this.position, this.size);
      }
    }
    destination.normalize();
    if (this.type === "Spider") {
      destination.mult(0.5);
    } else if (this.type === "Snake") {
      destination.mult(0.25);
    } else if (this.type === "Bear") {
      destination.mult(0.5);
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
      } else {
        if (!this.burrowed && !this.attacking) {
          this.moving = true;
        }
      }
    }

    if (this.moving && !this.attacking && !this.burrowed) {
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
        this.sprites.attackGif.reset();
        this.sprites.attackGif.pause();
      }
      if (this.attackTimer >= this.stats.attackSpeed * 48) {
        this.attacking = true;
        this.sprites.attackGif.play();
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
      this.sprites.attackGif.reset();
    }
  }

  jab() {
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
        this.stats.attackRange * 100 &&
      !this.flee
    ) {
      if (this.attackTimer >= this.stats.attackSpeed * 48) {
        this.attackTimer++;
      }
      if (
        this.attackTimer >= 0 &&
        this.attackTimer < this.stats.attackSpeed * 42
      ) {
        this.attacking = false;
        this.sprites.attackGif.reset();
        this.sprites.attackGif.pause();
      }
      if (this.attackTimer >= this.stats.attackSpeed * 48) {
        this.attacking = true;
        this.sprites.attackGif.play();
      }

      if (this.attackTimer === this.stats.attackSpeed * 54) {
        this.target.stats.health -= calculateDefense(
          this.target.stats.defense,
          this.stats.damage
        );
      }
      if (this.attackTimer >= this.stats.attackSpeed * 60) {
        this.attackTimer = 0;
      }
    } else {
      this.attacking = false;
      this.sprites.attackGif.reset();
    }
  }

  shed() {
    this.stats.health = this.stats.maxHealth;
    this.fakeHealth = this.stats.maxHealth;
    this.burning = false;
    this.burnTimer = 0;
    this.hasShed = true;
  }

  spidersAbilities() {
    if (
      this.abilities.webSlinger.timer >=
      this.abilities.webSlinger.timeOut * 60
    ) {
      if (!this.abilities.jump.using) {
        this.abilities.webSlinger.using = true;
        this.abilities.webSlinger.timer = 0;
      }
    } else {
      this.abilities.webSlinger.timer++;
    }
    if (this.abilities.swarm.timer >= this.abilities.swarm.timeOut * 60) {
      this.abilities.swarm.timer = 0;
      this.abilities.swarm.using = true;
    } else {
      this.abilities.swarm.timer++;
    }

    if (this.abilities.jump.using) {
      this.abilities.jump.using = false;
    }
    if (this.abilities.swarm.using) {
      let randonNum = round(random(1, 4));
      for (let i = 0; i < randonNum; i++) {
        monsters.push(
          new Monster({
            sprites: {
              idleImg: sprites.Spider.idleImg,
              idleAttackImg: sprites.Spider.idleAttackImg,
              holeImg: sprites.Spider.holeImg,
              walkGif: cloneGif(sprites.Spider.walkGif, 0),
              unburrowGif: cloneGif(sprites.Spider.unburrowGif, 0),
              attackGif: cloneGif(sprites.Spider.attackGif, 0),
              deathGif: cloneGif(sprites.Spider.deathGif, 0),
            },
            x: this.position.x + random(-200, 200),
            y: this.position.y + random(-200, 200),
            type: "Spider",
          })
        );
      }
      this.abilities.swarm.using = false;
    }
    if (this.abilities.webSlinger.using) {
      projectiles.push(
        new Projectile({
          x: this.position.x,
          y: this.position.y,
          target: heroes[0].position,
          duration: this.abilities.webSlinger.duration * 60,
          type: "Web",
        })
      );
      projectiles.push(
        new Projectile({
          x: this.position.x,
          y: this.position.y,
          target: heroes[0].position,
          duration: this.abilities.webSlinger.duration * 60,
          type: "Web",
        })
      );
      projectiles.push(
        new Projectile({
          x: this.position.x,
          y: this.position.y,
          target: heroes[0].position,
          duration: this.abilities.webSlinger.duration * 60,
          type: "Web",
        })
      );
      this.abilities.webSlinger.using = false;
      this.abilities.webSlinger.timer = 0;
    }
  }

  repelling(target, duration) {
    this.isRepelling = true;
    this.repelDuration = duration;
    this.repelTarget = target;
  }

  repel(target, power) {
    if (this.burrowed) {
      return;
    }
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
