class Spawner {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.size = config.size;
    this.type = config.type;
    this.spawnTime = 2;
    this.spawnTimer = 0;
    this.glow = false;

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
  }

  display() {
    switch (this.type) {
      case "Spider":
        noStroke();
        fill(50);
        rect(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        fill(0);
        ellipse(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
      case "Snake":
        noStroke();
        fill(50);
        rect(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        fill(0);
        ellipse(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
    }

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

    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text(
      "Health: " + this.stats.health + "/" + this.stats.maxHealth,
      this.position.x + camera.x,
      this.position.y + camera.y - this.size / 1.5
    );
  }

  update() {
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnTime * 60) {
      monsters.push(
        new Monster({
          x: this.position.x,
          y: this.position.y,
          speed: 1,
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
