class Block {
  constructor(x, y, size, type) {
    this.position = new p5.Vector(x, y);
    this.size = size;
    this.type = type;

    this.floorTile = loadImage("../../../sprites/Tiles/Wood_floor.png");
  }

  display() {
    noStroke();

    switch (this.type) {
      case "floor":
        // fill(255, 0, 0);
        // rect(
        //   this.position.x + camera.x,
        //   this.position.y + camera.y,
        //   this.size,
        //   this.size
        // );
        image(
          this.floorTile,
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
      case "wall":
        fill(0, 0, 255);
        rect(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        fill(0, 0, 200);
        rect(
          this.position.x + camera.x,
          this.position.y - this.size / 2 + camera.y,
          this.size,
          this.size
        );
        break;
    }
  }

  collideWithPlayer() {
    for (let i = 0; i < heroes.length; i++) {
      if (
        heroes[i].position.x + heroes[i].size / 2 >=
          this.position.x - this.size / 2 &&
        heroes[i].position.x - heroes[i].size / 2 <=
          this.position.x + this.size / 2 &&
        heroes[i].position.y + heroes[i].size / 2 >=
          this.position.y - this.size / 2 &&
        heroes[i].position.y - heroes[i].size / 2 <=
          this.position.y + this.size / 2
      ) {
        heroes[i].repel(this);
      }
    }
  }
}
