class Spawner {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.size = config.size;
    this.type = config.type;
    this.spawnTime = 0;
    this.spawnTimer = 0;
    this.glow = false;
    this.dead = false;

    this.stats = {
      health: 300,
      maxHealth: 300,
      defense: 50,
    };

    this.burnTime = 30;
    this.burnTimer = 0;
    this.burning = false;
    this.burningTime = 300;
    this.burningTimer = 0;

    this.spawnerImg;
    this.loaded = false;

    switch (this.type) {
      case "Spider":
        this.spawnTime = 7;
        break;
      case "Snake":
        this.spawnTime = 10;
        break;
      case "Bear":
        this.spawnTime = 15;
        break;
      default:
        this.spawnTime = 5;
        break;
    }

    this.fakeHealth = this.stats.maxHealth;
    this.hitTimer = 0;
  }

  loadImages() {
    if (sprites.Spawners.loaded) {
      this.spawnerImg = sprites.Spawners.Spider;
      this.loaded = true;
    }
  }

  display() {
    image(
      this.spawnerImg,
      this.position.x + camera.x,
      this.position.y + camera.y,
      this.size,
      this.size
    );
    // switch (this.type) {
    //   case "Spider":
    //     noStroke();
    //     fill(50);
    //     rect(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     fill(0);
    //     ellipse(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     break;
    //   case "Snake":
    //     noStroke();
    //     fill(50);
    //     rect(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     fill(0);
    //     ellipse(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     break;
    //   case "Bear":
    //     noStroke();
    //     fill(50);
    //     rect(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     fill(0);
    //     ellipse(
    //       this.position.x + camera.x,
    //       this.position.y + camera.y,
    //       this.size,
    //       this.size
    //     );
    //     break;
    // }

    if (this.glow) {
      noFill();
      strokeWeight(3);
      stroke(255, 0, 0, 150);
      ellipse(
        this.position.x + camera.x,
        this.position.y + camera.y,
        this.size + 50,
        this.size + 50
      );
    }

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
      this.dead = true;
      monsters.push(
        new Monster({
          x: this.position.x,
          y: this.position.y,
          type: this.type,
          isBoss: true,
        })
      );
    }

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i].isBoss) {
        return;
      }
    }

    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnTime * 60) {
      monsters.push(
        new Monster({
          x: this.position.x,
          y: this.position.y,
          type: this.type,
        })
      );
      this.spawnTimer = 0;
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
}
