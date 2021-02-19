let keys = [];
let bitMap = [
  "1111111111",
  "1   1 s  1",
  "1       11",
  "1        1",
  "1 p  11  1",
  "1    11  1",
  "1        1",
  "1s11  1  1",
  "1      1s1",
  "1111111111",
];
let camera = {
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
};
let wallSize = 100;

let blocks = [];
let heroes = [];
let monsters = [];
let projectiles = [];
let coins = [];
let xp = [];
let spawners = [];

let UI;
let shadow;

let totalLoadedSprites = 0;
let loadedSprites = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  frameRate(60);
  angleMode(RADIANS);

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
        case "s":
          spawners.push(
            new Spawner({
              x: i * wallSize + wallSize / 2,
              y: j * wallSize + wallSize / 2,
              size: wallSize,
              type: "Spider",
            })
          );
          break;
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].loadImages();
  }

  // monsters.push(
  //   new Monster({
  //     x: 200,
  //     y: 200,
  //     speed: 1,
  //     type: "Spider",
  //   })
  // );
  // monsters.push(
  //   new Monster({
  //     x: 800,
  //     y: 200,
  //     speed: 1,
  //     type: "Spider",
  //   })
  // );

  for (let i = 0; i < monsters.length; i++) {
    monsters[i].loadImages();
  }

  UI = new Interface({
    character: heroes[0],
  });

  shadow = loadImage("../../sprites/Misc/Shadow.png");
}

let done = false;
let timer = 0;
function draw() {
  if (loadedSprites) {
    background(0);

    if (timer >= 120) {
      monsters.push(
        new Monster({
          x: 200,
          y: 200,
          speed: 1,
          type: "Spider",
        })
      );
      timer = 0;
    } else {
      // timer++;
    }

    push();
    translate(camera.offsetX, camera.offsetY);

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].display();
      if (blocks[i].type === "wall") {
        for (let j = 0; j < monsters.length; j++) {
          blocks[i].collideWithObj(monsters[j]);
        }
      }
    }

    for (let i = 0; i < monsters.length; i++) {
      if (!monsters[i].loaded) {
        monsters[i].loadImages();
      } else {
        monsters[i].display();
        monsters[i].update();

        if (monsters[i].dead) {
          monsters.splice(i, 1);
          i--;
        }
      }
    }

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i].loadDelay >= 60 && !monsters[i].setDelays) {
        monsters[i].attackGif.delay(1400, 0);
        monsters[i].deathGif.delay(10000, 13);
        monsters[i].setDelays = true;
      }
    }

    for (let i = 0; i < spawners.length; i++) {
      spawners[i].display();
      spawners[i].update();
    }

    for (let i = 0; i < coins.length; i++) {
      coins[i].display();
      coins[i].update();

      if (coins[i].dead) {
        coins.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < heroes.length; i++) {
      heroes[i].display();
      heroes[i].update();

      if (
        !heroes[0].ability.RainFire.using &&
        !heroes[0].ability.LightningStrike.using
      ) {
        heroes[i].displayProjectileLength();
      }
    }

    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].display();
      projectiles[i].update();

      if (projectiles[i].dead) {
        projectiles.splice(i, 1);
        i--;
      }
    }

    pop();

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
      strokeWeight(2000 - heroes[0].stats.visionRange * 100);
      stroke(0);
      rect(
        heroes[0].position.x + camera.x,
        heroes[0].position.y + camera.y,
        heroes[0].stats.visionRange * 100 +
          2000 -
          heroes[0].stats.visionRange * 100,
        heroes[0].stats.visionRange * 100 +
          2000 -
          heroes[0].stats.visionRange * 100
      );
      image(
        shadow,
        heroes[0].position.x + camera.x,
        heroes[0].position.y + camera.y,
        heroes[0].stats.visionRange * 100,
        heroes[0].stats.visionRange * 100
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
          constrain(totalLoadedSprites, 0, blocks.length + monsters.length),
          0,
          blocks.length + monsters.length,
          0,
          500
        ) /
          2,
      windowHeight / 2 + 100,
      map(
        constrain(totalLoadedSprites, 0, blocks.length + monsters.length),
        0,
        blocks.length + monsters.length,
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
    for (let i = 0; i < monsters.length; i++) {
      if (!monsters[i].loaded) {
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

  for (let i = 0; i < heroes[0].abilities.length; i++) {
    if (key.toString() === heroes[0].abilities[i].key) {
      heroes[0].useAbility(heroes[0].abilities[i].name);
    }
  }
}

function mouseReleased() {
  if (
    !heroes[0].ability.RainFire.using &&
    !heroes[0].ability.LightningStrike.using
  ) {
    heroes[0].attack();
  } else {
    heroes[0].ability.RainFire.used = true;
    heroes[0].ability.LightningStrike.used = true;
  }
}
