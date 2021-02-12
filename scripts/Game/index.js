let keys = [];
let bitMap = [
  "1111111111",
  "1        1",
  "1 p      1",
  "1        1",
  "1    11  1",
  "1    11  1",
  "1        1",
  "1        1",
  "1        1",
  "1111111111",
];
let camera = {
  x: 0,
  y: 0,
};
let wallSize = 100;

let blocks = [];
let heroes = [];
let monsters = [];
let projectiles = [];

let UI;
let shadow;

let totalLoadedSprites = 0;
let loadedSprites = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  frameRate(60);

  for (let i = 0; i < bitMap.length; i++) {
    for (let j = 0; j < bitMap[i].length; j++) {
      switch (bitMap[j][i]) {
        case " ":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );
          break;
        case "1":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "wall"
            )
          );
          break;
        case "2":
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
              character: "Arthur",
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

  UI = new Interface({
    character: heroes[0],
  });

  shadow = loadImage("../../sprites/Misc/Shadow.png");
}

function draw() {
  if (loadedSprites) {
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
          // blocks[i].collideWithObj(heroes[j]);
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

    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].display();
      projectiles[i].move();
      projectiles[i].hitMonster();

      if (projectiles[i].dead) {
        projectiles.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < heroes.length; i++) {
      heroes[i].displayProjectileLength();
      heroes[i].display();
      heroes[i].update();
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

    fill(0, 0, 0, 50);
    rect(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);

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

    {
      noFill();
      strokeWeight(700);
      stroke(0);
      rect(
        heroes[0].position.x + camera.x,
        heroes[0].position.y + camera.y,
        windowWidth - 100,
        windowHeight + 800
      );
      image(
        shadow,
        heroes[0].position.x + camera.x,
        heroes[0].position.y + camera.y
      );
      noStroke();
    } // Shadow

    UI.display();
  } else {
    background(50);

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(100);
    text("Loading Sprites", windowWidth / 2 + 5, windowHeight / 2 - 100 + 5);
    fill(255);
    text("Loading Sprites", windowWidth / 2, windowHeight / 2 - 100);

    noFill();
    strokeWeight(5);
    stroke(255);
    rect(windowWidth / 2, windowHeight / 2 + 100, 500, 50);
    noStroke();
    fill(255);
    rect(
      windowWidth / 2 -
        250 +
        map(
          constrain(totalLoadedSprites, 0, blocks.length),
          0,
          blocks.length,
          0,
          500
        ) /
          2,
      windowHeight / 2 + 100,
      map(
        constrain(totalLoadedSprites, 0, blocks.length),
        0,
        blocks.length,
        0,
        500
      ),
      50
    );

    for (let i = 0; i < blocks.length; i++) {
      loadedSprites = true;
      if (!blocks[i].loaded) {
        loadedSprites = false;
      } else {
        totalLoadedSprites++;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;

  if (keyCode === ENTER) {
    heroes[0].useAbility("Staff Smash");
  }
}

function mouseReleased() {
  heroes[0].attack();
}
