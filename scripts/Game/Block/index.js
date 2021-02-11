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

    this.loaded = false;

    this.walls = {
      above: null,
      below: null,
      left: null,
      right: null,
      topLeft: null,
      topRight: null,
    };
  }

  loadImages() {
    this.floorTiles = [
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt3.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt4.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt_wall_top.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
    ];
    this.wallTiles = [
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1_side1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1_side2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2_side1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2_side2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_corner1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_corner2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_side_corner1.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_side_corner2.png",
        () => (this.loaded = true),
        () => (this.loaded = false)
      ),
    ];
    this.pillarTile = loadImage("../../../sprites/Tiles/Pillar.png");

    this.floorTile = round(random(0, this.floorTiles.length - 2));
    this.wallTile = round(random(0, 1));

    for (let i = 0; i < blocks.length; i++) {
      if (
        blocks[i].position.x === this.position.x &&
        blocks[i].position.y === this.position.y - wallSize
      ) {
        this.walls.above = blocks[i];
      }
      if (
        blocks[i].position.x === this.position.x &&
        blocks[i].position.y === this.position.y + wallSize
      ) {
        this.walls.below = blocks[i];
      }
      if (
        blocks[i].position.x === this.position.x - wallSize &&
        blocks[i].position.y === this.position.y
      ) {
        this.walls.left = blocks[i];
      }
      if (
        blocks[i].position.x === this.position.x + wallSize &&
        blocks[i].position.y === this.position.y
      ) {
        this.walls.right = blocks[i];
      }
      if (
        blocks[i].position.x === this.position.x + wallSize &&
        blocks[i].position.y === this.position.y - wallSize
      ) {
        this.walls.topRight = blocks[i];
      }
      if (
        blocks[i].position.x === this.position.x - wallSize &&
        blocks[i].position.y === this.position.y - wallSize
      ) {
        this.walls.topLeft = blocks[i];
      }
    }

    if (this.walls.above !== null) {
      if (this.walls.above.type === "wall") {
        this.floorTile = this.floorTiles.length - 1;
      }
    }
    if (this.walls.left !== null) {
      if (this.walls.left.type === "floor") {
        this.wallTile = round(random(4, 5));
      }
    }
    if (this.walls.right !== null) {
      if (this.walls.right.type === "floor") {
        this.wallTile = round(random(2, 3));
      }
    }
    if (this.walls.below !== null) {
      if (this.walls.below.type === "floor") {
        this.wallTile = round(random(0, 1));
      }

      if (this.walls.right !== null) {
        if (
          this.walls.right.type === "wall" &&
          this.walls.below.type === "wall"
        ) {
          this.wallTile = 6;
        }
      }
      if (this.walls.left !== null) {
        if (
          this.walls.left.type === "wall" &&
          this.walls.below.type === "wall"
        ) {
          this.wallTile = 7;
        }
      }
    }
    if (this.walls.above !== null) {
      if (this.walls.topRight !== null) {
        if (
          this.walls.above.type === "wall" &&
          this.walls.topRight.type === "wall"
        ) {
          this.wallTile = 8;
        }
      }
      if (this.walls.topLeft !== null) {
        if (
          this.walls.above.type === "wall" &&
          this.walls.topLeft.type === "wall"
        ) {
          this.wallTile = 9;
        }
      }
      if (this.walls.left !== null) {
        if (
          this.walls.left.type === "wall" &&
          this.walls.above.type === "wall"
        ) {
          this.wallTile = round(random(0, 1));
        }
      }
      if (this.walls.right !== null) {
        if (
          this.walls.right.type === "wall" &&
          this.walls.above.type === "wall"
        ) {
          this.wallTile = round(random(0, 1));
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
