class Projectile {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.shadowPosition = new p5.Vector(config.x, config.y);
    this.velocity = new p5.Vector(0, 0);
    this.startObj = config.startObj;
    this.target = config.target;
    this.damage = config.damage;
    this.speed = config.speed;
    this.attackRange = config.attackRange;
    this.waitingTime = config.waitingTime;
    this.duration = config.duration;
    this.type = config.type;

    if (this.type === "Lazer") {
      this.position.x = this.startObj.position.x;
      this.position.y = this.startObj.position.y;
    }

    this.foundRotation = false;
    this.size = 50;
    this.atTheEnd = false;
    this.dead = false;
    this.waitingTimer = 0;
    this.exploded = false;
    this.durationTimer = 0;
    this.r = 0;
    this.curveNum = this.speed / 2;
    this.splashed = false;
    this.splashTimer = 0;

    this.magicBall = loadImage("../../../sprites/Projectiles/MagicBall.gif");
    this.fireBall = loadImage("../../../sprites/Projectiles/FireBall.gif");
    this.fireRing_still = loadImage(
      "../../../sprites/Projectiles/FireRing_still.png"
    );
  }

  display() {
    switch (this.type) {
      case "Bullet":
        noStroke();
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
        break;
      case "Fire Ball":
        noStroke();
        fill(random(100, 255), random(100, 200), 0, 50);
        if (this.waitingTimer >= this.waitingTime) {
          image(
            this.fireRing_still,
            this.position.x + camera.x,
            this.position.y + camera.y
          );
        }
        break;
      case "Lazer":
        noFill();
        strokeWeight(5);
        stroke(0, 255, 255);
        line(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.target.position.x + camera.x,
          this.target.position.y + camera.y
        );
        break;
      case "Toss":
        if (!this.splashed) {
          noStroke();
          fill(0, 50);
          ellipse(
            this.shadowPosition.x + camera.x,
            this.shadowPosition.y + camera.y,
            50,
            50
          );

          fill(100, 100, 100);
          push();
          translate(this.position.x + camera.x, this.position.y + camera.y);
          this.r += 0.25;
          rotate(this.r);
          rect(0, 0, this.size, this.size / 2, 5);
          pop();
        } else {
          noStroke();
          fill(255, map(this.splashTimer, 0, 60, 150, 0));
          ellipse(
            this.target.x + camera.x,
            this.target.y + camera.y,
            this.attackRange,
            this.attackRange
          );

          if (this.splashTimer < 60) {
            this.splashTimer++;
          } else {
            this.dead = true;
          }
        }
        break;
    }
  }

  update() {
    switch (this.type) {
      case "Bullet":
        this.move();
        this.hitObjects();
        break;
      case "Fire Ball":
        this.rain();
        break;
      case "Lazer":
        this.position.x = this.startObj.position.x;
        this.position.y = this.startObj.position.y;

        this.target.stats.health -= calculateDefense(
          this.target.stats.defense,
          this.damage
        );

        this.durationTimer++;
        if (this.durationTimer >= this.duration) {
          this.dead = true;
        }
        break;
      case "Toss":
        if (this.splashed) return;

        let destination = p5.Vector.sub(this.target, this.shadowPosition);
        destination.normalize();
        destination.mult(100);

        this.velocity.add(destination);
        this.velocity.limit(this.speed);

        if (
          dist(
            this.shadowPosition.x,
            this.shadowPosition.y,
            this.target.x,
            this.target.y
          ) < this.speed
        ) {
          for (let i = 0; i < monsters.length; i++) {
            if (
              dist(
                this.target.x,
                this.target.y,
                monsters[i].position.x,
                monsters[i].position.y
              ) <
              this.attackRange / 2
            ) {
              monsters[i].stats.health -= calculateDefense(
                monsters[i].stats.defense,
                this.damage
              );
            }
          }
          this.splashed = true;
          return;
        }

        this.shadowPosition.add(this.velocity);
        this.position.add(this.velocity);

        if (
          dist(
            this.shadowPosition.x,
            this.shadowPosition.y,
            this.target.x,
            this.target.y
          ) <=
          dist(
            this.startObj.position.x,
            this.startObj.position.y,
            this.target.x,
            this.target.y
          ) /
            2
        ) {
          this.size -= this.curveNum / 2;
          this.position.y += this.curveNum;
          this.curveNum += this.speed / 200;
        } else {
          this.size += this.curveNum / 2;
          this.position.y -= this.curveNum;
          this.curveNum -= this.speed / 200;
        }
        break;
    }
  }

  rain() {
    if (this.waitingTimer < this.waitingTime) {
      this.waitingTimer++;

      noFill();
      strokeWeight(5);
      stroke(255, 0, 0);
      ellipse(
        this.position.x + camera.x,
        this.position.y + camera.y,
        this.attackRange * 100,
        this.attackRange * 100
      );

      fill(255, 0, 0, 50);
      ellipse(
        this.position.x + camera.x,
        this.position.y + camera.y,
        map(this.waitingTimer, 0, this.waitingTime, 0, this.attackRange * 100),
        map(this.waitingTimer, 0, this.waitingTime, 0, this.attackRange * 100)
      );

      noStroke();
      push();
      translate(
        this.position.x +
          camera.x +
          map(this.waitingTimer, 0, this.waitingTime, 500, 0),
        this.position.y +
          camera.y -
          map(this.waitingTimer, 0, this.waitingTime, 1000, 0)
      );
      rotate(-0.2);
      image(this.fireBall, 0, 0);
      pop();
      push();
      translate(
        this.position.x +
          camera.x +
          map(this.waitingTimer, 0, this.waitingTime, 500, 0),
        this.position.y +
          camera.y -
          map(this.waitingTimer, 0, this.waitingTime, 1000, 0)
      );
      fill(255, random(0, 100), 0, 30);
      ellipse(0, 0, 100, 100);
      fill(255, random(0, 100), 0, 30);
      ellipse(0, 0, 150, 150);
      fill(255, random(0, 100), 0, 30);
      ellipse(0, 0, 200, 200);
      pop();
    } else {
      if (!this.exploded) {
        for (let i = 0; i < monsters.length; i++) {
          if (
            dist(
              this.position.x,
              this.position.y,
              monsters[i].position.x,
              monsters[i].position.y
            ) <
            this.attackRange * 50
          ) {
            monsters[i].stats.health -= calculateDefense(
              monsters[i].stats.defense,
              this.damage
            );
          }
        }
        for (let i = 0; i < spawners.length; i++) {
          if (
            dist(
              this.position.x,
              this.position.y,
              spawners[i].position.x,
              spawners[i].position.y
            ) <
            this.attackRange * 50
          ) {
            spawners[i].stats.health -= calculateDefense(
              spawners[i].stats.defense,
              this.damage
            );
          }
        }
        this.exploded = true;
      }

      for (let i = 0; i < monsters.length; i++) {
        if (
          dist(
            this.position.x,
            this.position.y,
            monsters[i].position.x,
            monsters[i].position.y
          ) <
          this.attackRange * 50
        ) {
          monsters[i].burning = true;
          monsters[i].burningTimer = 0;
        }
      }
      for (let i = 0; i < spawners.length; i++) {
        if (
          dist(
            this.position.x,
            this.position.y,
            spawners[i].position.x,
            spawners[i].position.y
          ) <
          this.attackRange * 50
        ) {
          spawners[i].burning = true;
          spawners[i].burningTimer = 0;
        }
      }

      this.durationTimer++;
      if (this.durationTimer < 50) {
        camera.offsetX = random(
          -25 + this.durationTimer / 2,
          25 - this.durationTimer / 2
        );
        camera.offsetY = random(
          -25 + this.durationTimer / 2,
          25 - this.durationTimer / 2
        );
      } else {
        camera.offsetX = 0;
        camera.offsetY = 0;
      }

      if (this.durationTimer >= this.duration) {
        this.dead = true;
      }
    }
  }

  move() {
    let destination = p5.Vector.sub(this.target, this.position);
    destination.normalize();
    destination.mult(10);

    if (!this.atTheEnd) {
      this.velocity.add(destination);
      this.velocity.limit(25);
    }
    this.position.add(this.velocity);

    if (
      dist(this.position.x, this.position.y, this.target.x, this.target.y) < 30
    ) {
      this.atTheEnd = true;
    }

    if (this.atTheEnd) {
      this.size -= 5;

      if (this.size <= 0) {
        this.dead = true;
      }
    }
  }

  hitObjects() {
    this.hitMonster();
    this.hitSpawner();
    this.hitWall();
  }

  hitMonster() {
    for (let i = 0; i < monsters.length; i++) {
      if (
        dist(
          this.position.x,
          this.position.y,
          monsters[i].position.x,
          monsters[i].position.y
        ) < this.size &&
        !monsters[i].dying
      ) {
        monsters[i].stats.health -= calculateDefense(
          monsters[i].stats.defense,
          this.damage
        );
        this.dead = true;
      }
    }
  }
  hitSpawner() {
    for (let i = 0; i < spawners.length; i++) {
      if (
        rectCircleCollide(
          spawners[i].position.x,
          spawners[i].position.y,
          spawners[i].size,
          spawners[i].size,
          0,
          this.position.x,
          this.position.y,
          this.size / 2,
          "CENTER"
        )
      ) {
        spawners[i].stats.health -= calculateDefense(
          spawners[i].stats.defense,
          this.damage
        );
        this.dead = true;
      }
    }
  }
  hitWall() {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "wall") {
        if (
          blocks[i].wallTile === 2 ||
          blocks[i].wallTile === 3 ||
          blocks[i].wallTile === 8
        ) {
          if (
            rectCircleCollide(
              blocks[i].position.x - blocks[i].size / 4,
              blocks[i].position.y,
              blocks[i].size / 2,
              blocks[i].size,
              0,
              this.position.x,
              this.position.y,
              this.size / 2,
              "CENTER"
            )
          ) {
            this.dead = true;
          }
        }
        if (
          blocks[i].wallTile === 4 ||
          blocks[i].wallTile === 5 ||
          blocks[i].wallTile === 9
        ) {
          if (
            rectCircleCollide(
              blocks[i].position.x + blocks[i].size / 4,
              blocks[i].position.y,
              blocks[i].size / 2,
              blocks[i].size,
              0,
              this.position.x,
              this.position.y,
              this.size / 2,
              "CENTER"
            )
          ) {
            this.dead = true;
          }
        }
        if (
          blocks[i].wallTile === 0 ||
          blocks[i].wallTile === 1 ||
          blocks[i].wallTile === 6 ||
          blocks[i].wallTile === 7
        ) {
          if (
            rectCircleCollide(
              blocks[i].position.x,
              blocks[i].position.y,
              blocks[i].size,
              blocks[i].size,
              0,
              this.position.x,
              this.position.y,
              this.size / 2,
              "CENTER"
            )
          ) {
            this.dead = true;
          }
        }
      }
    }
  }
}
