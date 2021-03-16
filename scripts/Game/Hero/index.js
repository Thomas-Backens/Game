class Hero {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.endPoint = new p5.Vector(0, 0);
    this.angle = 0;

    this.stats = {
      maxHealth: 0,
      health: 0,
      damage: 0,
      defense: 0,
      attackRange: 0,
      attackSpeed: 0,
      energy: 0,
      maxEnergy: 0,
      energyRegen: 0,
      xp: 0,
      xpToNextLevel: 0,
      points: 0,
      upgrades: {
        damage: 0,
        health: 0,
        energy: 0,
        maxEnergy: 0,
        maxDamage: 0,
        maxHealth: 0,
        energyLimit: 0,
        maxEnergyLimit: 0,
        damageIncrease: [],
        healthIncrease: [],
      },
      level: 0,
      speed: 0,
      visionRange: 0,
    };
    this.levels = [
      500,
      800,
      1200,
      1600,
      2000,
      2500,
      3200,
      4000,
      5000,
      6500,
      8000,
      10000,
      12500,
      15000,
      19000,
      25000,
    ];
    this.abilities = [];
    this.ability = {
      StaffSmash: { using: false, timeOut: 10, timer: 0, energy: 10 },
      RainFire: {
        using: false,
        used: false,
        timeOut: 60,
        duration: 300,
        energy: 50,
      },
      LightningStrike: { using: false, used: false, duration: 10, energy: 100 },
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
    this.energyRegenTimer = 0;
    this.displayPointTimer = 0;
    this.levelUp = false;

    this.idle;
    this.walk;
    this.staffSmash;
    this.size = 70;
    this.speedOffset = 0;
    this.character = config.character;

    this.running = false;
    this.dead = false;

    switch (this.character) {
      case "Arthur":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/Walk.gif");
        this.staffSmash = loadImage("../../../sprites/Projectiles/Wind.gif");
        this.stats = {
          maxHealth: 200,
          health: 200,
          damage: 15,
          defense: 10,
          attackRange: 10,
          attackSpeed: 0.5,
          energy: 100,
          maxEnergy: 100,
          energyRegen: 1,
          xp: 0,
          xpToNextLevel: this.levels[this.stats.level],
          points: 75,
          upgrades: {
            damage: 0,
            health: 0,
            energy: 0,
            maxEnergy: 0,
            maxDamage: 10,
            maxHealth: 20,
            energyLimit: 5,
            maxEnergyLimit: 20,
            damageIncrease: [
              15,
              25,
              50,
              100,
              175,
              300,
              500,
              800,
              1500,
              3000,
              5000,
            ],
            healthIncrease: [
              200,
              225,
              275,
              350,
              500,
              700,
              1000,
              1500,
              2250,
              3000,
              4000,
              5300,
              7000,
              9000,
              12000,
              16000,
              22000,
              27000,
              34000,
              42000,
              50000,
            ],
          },
          level: 0,
          speed: 4,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Staff Smash",
            damage: "None",
            description: "Pushes Monsters away from you",
            key: "q",
          },
          {
            name: "Rain Fire",
            damage: "Medium",
            description:
              "Throws a Fireball at your mouse location, then has a burn circle where it lands",
            key: "e",
          },
          {
            name: "Lightning Strike",
            damage: "High",
            description: "Strikes a single target, multiple times",
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
          damage: 20,
          defense: 25,
          attackRange: 1.5,
          attackSpeed: 0.5,
          speed: 3,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Spinning Blades",
            damage: "Medium",
            description: "Spins in a circle, damaging all monsters in range",
            key: "q",
          },
          {
            name: "Thorns",
            damage: "Low",
            description: "For the next 10 seconds, he deflects 50% damage",
            key: "e",
          },
          {
            name: "Rage",
            damage: "High",
            description:
              "For the next 5 seconds, he gains a 50% attack boost and a 100% speed boost",
            key: "r",
          },
        ];
        break;
      case "Kora":
        this.idle = loadImage("../../../sprites/Hero/Arthur/Idle.png");
        this.walk = loadImage("../../../sprites/Hero/Arthur/Walk.gif");
        this.stats = {
          maxHealth: 300,
          health: 300,
          damage: 35,
          defense: 15,
          attackRange: 8,
          splashRange: 3,
          attackSpeed: 1.5,
          speed: 4,
          visionRange: 16,
        };
        this.abilities = [
          {
            name: "Poison",
            damage: "Low",
            description: "Poisons enemies for the next 3 throws",
            key: "q",
          },
          {
            name: "Acid",
            damage: "Medium",
            description: "Doubles damage for the next 4 throws",
            key: "e",
          },
          {
            name: "Regeneration",
            damage: "None",
            description: "Heals you and your allies for the next 2 throws",
            key: "r",
          },
          {
            name: "Gas Orb",
            damage: "Medium",
            description:
              "Places an orb that shoots gas at monsters for the next 10 seconds",
            key: "f",
          },
          {
            name: "Rapid Fire",
            damage: "High",
            description:
              "For the next 5 seconds, you have a 500% attack speed boost",
            key: "c",
          },
        ];
        break;
    }

    this.fakeHealth = this.stats.health;
    this.fakeEnergy = this.stats.energy;
  }

  display() {
    if (this.ability.StaffSmash.using) {
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

    push();
    if (this.fakeHealth > this.stats.health + 1) {
      tint(255, 0, 0);
    }

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
    pop();
  }

  displayProjectileLength() {
    this.angle = atan2(
      mouseY - camera.y - this.position.y,
      mouseX - camera.x - this.position.x
    );

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
  }

  update() {
    this.move();
    this.collideWithBlock();
    this.upgradeStats();

    this.attackTimer++;
    this.displayPointTimer++;

    if (this.stats.health <= 0) {
      this.dead = true;
      scene = "death";
      paused = true;
    }
    switch (this.character) {
      case "Arthur":
        this.arthursAbilites();
        break;
    }
    if (this.displayPointTimer < 300 && this.stats.points > 0) {
      this.levelUp = true;
    } else {
      this.levelUp = false;
    }

    if (this.stats.xp >= this.stats.xpToNextLevel) {
      this.stats.xp = this.stats.xp - this.stats.xpToNextLevel;
      if (this.stats.level < this.levels.length - 1) {
        this.stats.level++;
      }
      this.stats.xpToNextLevel = this.levels[this.stats.level];
      this.displayPointTimer = 0;
      this.stats.points += 2;
    }

    if (this.fakeHealth > this.stats.health + 1) {
      this.fakeHealth -= (this.fakeHealth - this.stats.health) / 6;
    } else {
      this.fakeHealth = this.stats.health;
    }
    if (this.fakeEnergy > this.stats.energy + 1) {
      this.fakeEnergy -= (this.fakeEnergy - this.stats.energy) / 6;
    } else {
      this.fakeEnergy = this.stats.energy;
    }

    if (this.energyRegenTimer >= this.stats.energyRegen * 60) {
      this.energyRegenTimer = 0;
      if (this.stats.energy < this.stats.maxEnergy) {
        this.stats.energy++;
      }
    } else {
      this.energyRegenTimer++;
    }

    this.speedOffset = 0;
    for (let i = 0; i < projectiles.length; i++) {
      if (projectiles[i].type === "Web" && projectiles[i].atTheEnd) {
        if (
          dist(
            this.position.x,
            this.position.y,
            projectiles[i].position.x,
            projectiles[i].position.y
          ) < 100
        ) {
          this.speedOffset = -(this.stats.speed / 2);
        }
      }
    }
  }

  upgradeStats() {
    this.stats.damage = this.stats.upgrades.damageIncrease[
      this.stats.upgrades.damage
    ];
    console.log(this.stats.health);
    this.stats.maxHealth = this.stats.upgrades.healthIncrease[
      this.stats.upgrades.health
    ];
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
        this.staffSmash.reset();
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
            damage: (this.stats.upgrades.damage + 1) * (this.stats.damage * 3),
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
            this.closestEnemysDistance &&
          !monsters[i].dying
        ) {
          this.closestEnemy = monsters[i];
          this.closestEnemysDistance =
            Math.pow(monsters[i].position.x - (mouseX - camera.x), 2) +
            Math.pow(monsters[i].position.y - (mouseY - camera.y), 2);
        }

        monsters[i].glow = false;
      }

      for (let i = 0; i < spawners.length; i++) {
        if (
          Math.pow(spawners[i].position.x - (mouseX - camera.x), 2) +
            Math.pow(spawners[i].position.y - (mouseY - camera.y), 2) <
          this.closestEnemysDistance
        ) {
          this.closestEnemy = spawners[i];
          this.closestEnemysDistance =
            Math.pow(spawners[i].position.x - (mouseX - camera.x), 2) +
            Math.pow(spawners[i].position.y - (mouseY - camera.y), 2);
        }

        spawners[i].glow = false;
      }
      this.closestEnemy.glow = true;

      if (this.ability.LightningStrike.used) {
        projectiles.push(
          new Projectile({
            startObj: this,
            damage: (this.stats.upgrades.damage + 1) * this.stats.damage,
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
    if (keys[87]) {
      if (!keys[68] && !keys[65]) {
        if (!this.collidingWith.bottom) {
          this.position.y -= this.stats.speed + this.speedOffset;
        }
      }
      if (keys[68]) {
        if (!this.collidingWith.bottom) {
          this.position.y -= this.stats.speed / 1.2 + this.speedOffset;
        }
        if (!this.collidingWith.left) {
          this.position.x += this.stats.speed / 1.2 + this.speedOffset;
        }
      }
      if (keys[65]) {
        if (!this.collidingWith.bottom) {
          this.position.y -= this.stats.speed / 1.2 + this.speedOffset;
        }
        if (!this.collidingWith.right) {
          this.position.x -= this.stats.speed / 1.2 + this.speedOffset;
        }
      }
    }
    if (keys[83]) {
      this.running = true;
      if (!keys[68] && !keys[65]) {
        if (!this.collidingWith.top) {
          this.position.y += this.stats.speed + this.speedOffset;
        }
      }
      if (keys[68]) {
        if (!this.collidingWith.top) {
          this.position.y += this.stats.speed / 1.2 + this.speedOffset;
        }
        if (!this.collidingWith.left) {
          this.position.x += this.stats.speed / 1.2 + this.speedOffset;
        }
      }
      if (keys[65]) {
        if (!this.collidingWith.top) {
          this.position.y += this.stats.speed / 1.2 + this.speedOffset;
        }
        if (!this.collidingWith.right) {
          this.position.x -= this.stats.speed / 1.2 + this.speedOffset;
        }
      }
    }
    if (keys[68] && !this.collidingWith.left) {
      if (!keys[87] && !keys[83]) {
        this.position.x += this.stats.speed + this.speedOffset;
      }
    }
    if (keys[65] && !this.collidingWith.right) {
      if (!keys[87] && !keys[83]) {
        this.position.x -= this.stats.speed + this.speedOffset;
      }
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
              monsters[i].repelling(this, 5);
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
        if (this.stats.energy >= this.ability.StaffSmash.energy) {
          this.ability.StaffSmash.using = true;
          this.ability.StaffSmash.used = false;
          this.stats.energy -= this.ability.StaffSmash.energy;
        }
        break;
      case "Rain Fire":
        if (this.stats.energy >= this.ability.RainFire.energy) {
          this.ability.RainFire.using = true;
          this.ability.RainFire.used = false;
        }
        break;
      case "Lightning Strike":
        if (monsters.length >= 1) {
          if (this.stats.energy >= this.ability.LightningStrike.energy) {
            this.ability.LightningStrike.using = true;
            this.ability.LightningStrike.used = false;
          }
        }
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
