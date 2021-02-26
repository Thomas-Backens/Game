class Block {
  constructor(x, y, size, type) {
    this.position = new p5.Vector(x, y);
    this.size = size;
    this.type = type;

    this.shadows = [
      { x: 0, y: 0, alpha: 0, size: this.size / 2 },
      { x: 0, y: 0, alpha: 0, size: this.size / 2 },
      { x: 0, y: 0, alpha: 0, size: this.size / 2 },
      { x: 0, y: 0, alpha: 0, size: this.size / 2 },
    ];
    this.shadowTimer = 0;

    this.floorTiles = [];
    this.floorTile = 0;
    this.wallTiles = [];
    this.wallTile;

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
    if (!sprites.Blocks.loaded) return;

    this.floorTiles = sprites.Blocks.floorTiles;
    this.wallTiles = sprites.Blocks.wallTiles;
    // this.pillarTile = loadImage("../../../sprites/Tiles/Pillar.png");

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

    this.loaded = true;
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
      case "light":
        noStroke();
        fill(50);
        rect(
          this.position.x + camera.x,
          this.position.y + camera.y,
          this.size,
          this.size
        );
        break;
    }
  }

  displayShadow() {
    this.shadows[0].x = this.position.x - this.size / 4;
    this.shadows[0].y = this.position.y - this.size / 4;

    this.shadows[1].x = this.position.x + this.size / 4;
    this.shadows[1].y = this.position.y - this.size / 4;

    this.shadows[2].x = this.position.x - this.size / 4;
    this.shadows[2].y = this.position.y + this.size / 4;

    this.shadows[3].x = this.position.x + this.size / 4;
    this.shadows[3].y = this.position.y + this.size / 4;

    if (this.shadowTimer >= 30) {
      for (let i = 0; i < this.shadows.length; i++) {
        let distToHero = dist(
          heroes[0].position.x,
          heroes[0].position.y,
          this.shadows[i].x,
          this.shadows[i].y
        );
        this.shadows[i].alpha = 0;
        for (let j = 300; j < 600; j += 50) {
          if (distToHero >= j && distToHero < j + 50) {
            this.shadows[i].alpha = j - 300;
          }
        }
        if (distToHero >= 600) {
          this.shadows[i].alpha = 255;
        }

        for (let j = 0; j < blocks.length; j++) {
          if (blocks[j].type === "light") {
            let distToBlock = dist(
              blocks[j].position.x,
              blocks[j].position.y,
              this.shadows[i].x,
              this.shadows[i].y
            );

            if (distToBlock < 300) {
              this.shadows[i].alpha = 0;
            }
            // for (let j = 300; j < 600; j += 50) {
            //   if (
            //     distToBlock >= j &&
            //     distToBlock < j + 50 &&
            //     distToHero > 300
            //   ) {
            //     this.shadows[i].alpha = j - 300;
            //   }
            // }
          }
        }
      }
      this.shadowTimer = 0;
    } else {
      this.shadowTimer++;
    }

    for (let i = 0; i < this.shadows.length; i++) {
      noStroke();
      fill(0, 0, 0, this.shadows[i].alpha);
      rect(
        this.shadows[i].x + camera.x,
        this.shadows[i].y + camera.y,
        this.shadows[i].size,
        this.shadows[i].size
      );
    }
  }

  onScreen() {
    return (
      this.position.x > heroes[0].position.x - windowWidth / 1.5 &&
      this.position.x < heroes[0].position.x + windowWidth / 1.5 &&
      this.position.y > heroes[0].position.y - windowHeight / 1.5 &&
      this.position.y < heroes[0].position.y + windowHeight / 1.5
    );
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
