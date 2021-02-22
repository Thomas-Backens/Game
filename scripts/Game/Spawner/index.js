class Spawner {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.size = config.size;
    this.type = config.type;
    this.health = 1000;
    this.spawnTime = 2;
    this.spawnTimer = 0;

    this.stats = {
      health: 1000,
      maxHealth: 1000,
      defense: 50,
    };
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
          type: "Spider",
        })
      );
      this.spawnTimer = 0;
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
