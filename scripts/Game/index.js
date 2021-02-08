let keys = [];
let bitMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, "p", 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let wallSize = 100;
let camera = {
  x: 0,
  y: 0,
};

let blocks = [];
let heroes = [];
let monsters = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  frameRate(60);

  for (let i = 0; i < bitMap.length; i++) {
    for (let j = 0; j < bitMap[i].length; j++) {
      switch (bitMap[j][i]) {
        case 0:
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );
          break;
        case 1:
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "wall"
            )
          );
          break;
        case 2:
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "pillar"
            )
          );
          break;
        case "p":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );

          heroes.push(
            new Hero({
              x: i * wallSize + wallSize / 2,
              y: j * wallSize + wallSize / 2,
              speed: 5,
            })
          );
          break;
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].loadImages();
  }

  monsters.push(
    new Monster({
      x: 200,
      y: 200,
      speed: 1,
      type: "Spider",
    })
  );
}

function draw() {
  background(0);

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "floor") {
      blocks[i].display();
    }
    if (blocks[i].type === "wall" || blocks[i].type === "pillar") {
      for (let j = 0; j < heroes.length; j++) {
        if (blocks[i].position.y - 5 <= heroes[j].position.y) {
          blocks[i].display();
        }
        blocks[i].collideWithObj(heroes[j]);
      }
      for (let j = 0; j < monsters.length; j++) {
        blocks[i].collideWithObj(monsters[j]);
      }
    }
  }

  for (let i = 0; i < monsters.length; i++) {
    monsters[i].display();
    monsters[i].move();
    monsters[i].attack();
  }

  for (let i = 0; i < heroes.length; i++) {
    heroes[i].display();
    heroes[i].move();
  }

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "wall" || blocks[i].type === "pillar") {
      for (let j = 0; j < heroes.length; j++) {
        if (blocks[i].position.y >= heroes[j].position.y) {
          blocks[i].display();
        }
      }
    }
  }

  {
    if (5 < abs(camera.x + heroes[0].position.x - width / 2)) {
      if (camera.x + heroes[0].position.x - width / 2 < 0) {
        camera.x += round(
          (-heroes[0].position.x - camera.x + width / 2 - 5) * 0.1
        );
      } else {
        camera.x += round(
          (-heroes[0].position.x - camera.x + width / 2 + 5) * 0.1
        );
      }
    }

    if (camera.y + heroes[0].position.y - height / 2 < -10) {
      camera.y += round(
        (-heroes[0].position.y - camera.y + height / 2 - 10) * 0.1
      );
    } else if (camera.y + heroes[0].position.y - height / 2 > 10) {
      camera.y += round(
        (-heroes[0].position.y - camera.y + height / 2 + 10) * 0.1
      );
    }
  } // Camera
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
}
