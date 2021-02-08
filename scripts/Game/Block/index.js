class Block {
  constructor(x, y, size, type) {
    this.position = new p5.Vector(x, y);
    this.size = size;
    this.type = type;

    this.floorTiles;
    this.floorTile;
    this.wallTiles;
    this.wallTile;
    this.pillarTile;
  }

  loadImages() {
    this.floorTiles = [
      loadImage("../../../sprites/Tiles/Dirt/Dirt1.png"),
      loadImage("../../../sprites/Tiles/Dirt/Dirt2.png"),
      loadImage("../../../sprites/Tiles/Dirt/Dirt3.png"),
      loadImage("../../../sprites/Tiles/Dirt/Dirt4.png"),
      loadImage("../../../sprites/Tiles/Dirt/Dirt_wall_top.png"),
    ];
    this.wallTiles = [
      loadImage("../../../sprites/Tiles/Stone/Stone1.png"),
      loadImage("../../../sprites/Tiles/Stone/Stone2.png"),
      loadImage("../../../sprites/Tiles/Stone/Stone1_side.png"),
      loadImage("../../../sprites/Tiles/Stone/Stone2_side.png"),
    ];
    this.pillarTile = loadImage("../../../sprites/Tiles/Pillar.png");

    this.floorTile = round(random(0, this.floorTiles.length - 2));
    this.wallTile = round(random(0, 1));

    for (let i = 0; i < blocks.length; i++) {
      if (
        blocks[i].position.x === this.position.x &&
        blocks[i].position.y === this.position.y - wallSize
      ) {
        if (blocks[i].type === "wall") {
          this.floorTile = this.floorTiles.length - 1;
        }
      }
      if (
        blocks[i].position.y === this.position.y &&
        blocks[i].position.x === this.position.x + wallSize
      ) {
        if (blocks[i].type === "floor") {
          this.wallTile = 2;
        }
      }
      if (
        blocks[i].position.y === this.position.y &&
        blocks[i].position.x === this.position.x - wallSize
      ) {
        if (blocks[i].type === "floor") {
          this.wallTile = 3;
        }
      }
    }
  }

  display() {
    noStroke();

    switch (this.type) {
      case "floor":
        image(
          this.floorTiles[this.floorTile],
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
      case "wall":
        image(
          this.wallTiles[this.wallTile],
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
    }
  }

  collideWithObj(target) {
    if (
      target.position.x + target.size / 2 >= this.position.x - this.size / 2 &&
      target.position.x - target.size / 2 <= this.position.x + this.size / 2 &&
      target.position.y + target.size / 2 >= this.position.y - this.size / 2 &&
      target.position.y - target.size / 2 <= this.position.y + this.size / 2
    ) {
      target.repel(this);
    }
  }
}
