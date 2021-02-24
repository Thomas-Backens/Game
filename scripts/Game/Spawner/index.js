class Spawner {
  constructor(config) {
    this.position = new p5.Vector(config.x, config.y);
    this.size = config.size;
    this.type = config.type;

    this.spawnTime = 5;
    this.spawnTimer = 0;
    this.dead = false;

    this.stats = {
      health: 100,
      maxHealth: 100,
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
