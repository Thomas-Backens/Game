let keys = [];
let bitMap = [
  "111111111111111111111111111111",
  "1               1            1",
  "1  b            1         s  1",
  "1             111            1",
  "1        11                  1",
  "1                    11      1",
  "1    1                       1",
  "1    1    111   111          1",
  "1    1                   1   1",
  "1    11                  1   1",
  "1                      111   1",
  "1          11   11       1   1",
  "1     1    1     1       1   1",
  "1     1                      1",
  "1             p     111      1",
  "1111                         1",
  "1          1     1    1   1111",
  "1    1     11   11    1      1",
  "1    1                       1",
  "1                         1111",
  "111  111    1                1",
  "1           1                1",
  "1           1     11111      1",
  "1       1                    1",
  "1       1                    1",
  "1                            1",
  "1         11111111111        1",
  "1  s           1          S  1",
  "1              1             1",
  "111111111111111111111111111111",
];
let camera = {
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
};
let wallSize = 100;
let floorTiles = [];
let wallTiles = [];

let blocks = [];
let heroes = [];
let monsters = [];
let projectiles = [];
let coins = [];
let spawners = [];

let UI;
let shadow;

let sprites = {
  Spider: {
    idleImg: null,
    walkGif: null,
    idleAttackImg: null,
    loaded: false,
  },
  Blocks: {
    floorTiles: [],
    wallTiles: [],
    loaded: false,
  },
};

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
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );

          spawners.push(
            new Spawner({
              x: i * wallSize + wallSize / 2,
              y: j * wallSize + wallSize / 2,
              size: wallSize,
              type: "Spider",
            })
          );
          break;
        case "S":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );

          spawners.push(
            new Spawner({
              x: i * wallSize + wallSize / 2,
              y: j * wallSize + wallSize / 2,
              size: wallSize,
              type: "Snake",
            })
          );
          break;
        case "b":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "floor"
            )
          );

          spawners.push(
            new Spawner({
              x: i * wallSize + wallSize / 2,
              y: j * wallSize + wallSize / 2,
              size: wallSize,
              type: "Bear",
            })
          );
          break;
        case "l":
          blocks.push(
            new Block(
              i * wallSize + wallSize / 2,
              j * wallSize + wallSize / 2,
              wallSize,
              "light"
            )
          );
          break;
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].loadImages();
  }

  UI = new Interface({
    character: heroes[0],
  });

  shadow = loadImage("../../sprites/Misc/Shadow.png");

  {
    sprites.Spider.idleImg = loadImage(
      "../../../sprites/Monsters/Spider/Idle.png",
      () => ((sprites.Spider.loaded = true), totalLoadedSprites++),
      () => (sprites.Spider.loaded = false)
    );
    sprites.Spider.walkGif = loadImage(
      "../../../sprites/Monsters/Spider/Walk.gif",
      () => ((sprites.Spider.loaded = true), totalLoadedSprites++),
      () => (sprites.Spider.loaded = false)
    );
    sprites.Spider.idleAttackImg = loadImage(
      "../../../sprites/Monsters/Spider/Attack.png",
      () => ((sprites.Spider.loaded = true), totalLoadedSprites++),
      () => (sprites.Spider.loaded = false)
    );
  } // Spider Images

  {
    sprites.Blocks.floorTiles = [
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt3.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt4.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Dirt/Dirt_wall_top.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
    ];
    sprites.Blocks.wallTiles = [
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1_side1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone1_side2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2_side1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone2_side2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_corner1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_corner2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_side_corner1.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
      loadImage(
        "../../../sprites/Tiles/Stone/Stone_side_corner2.png",
        () => ((sprites.Blocks.loaded = true), totalLoadedSprites++),
        () => (sprites.Blocks.loaded = false)
      ),
    ];
  } // Block Images
}

let done = false;
function draw() {
  if (loadedSprites) {
    background(0);

    push();
    translate(camera.offsetX, camera.offsetY);

    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].loaded) {
        blocks[i].loadImages();
      } else {
        if (blocks[i].onScreen()) {
          blocks[i].display();
        }
      }
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
        if (monsters[i].onScreen()) {
          if (!monsters[i].isBoss) {
            monsters[i].display();
          }
        }
        monsters[i].update();

        if (monsters[i].dead) {
          monsters.splice(i, 1);
          i--;
        }
      }
    }

    for (let i = 0; i < monsters.length; i++) {
      if (!monsters[i].loaded) {
        monsters[i].loadImages();
      } else {
        if (monsters[i].onScreen()) {
          if (monsters[i].isBoss) {
            monsters[i].display();
          }
        }
      }
    }

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i].loadDelay >= 60 && !monsters[i].setDelays) {
        // monsters[i].attackGif.delay(1400, 0);
        monsters[i].deathGif.delay(10000, 13);
        monsters[i].attackGif.pause();
        monsters[i].setDelays = true;
      }
    }

    for (let i = 0; i < spawners.length; i++) {
      if (spawners[i].onScreen()) {
        spawners[i].display();
      }
      spawners[i].update();

      if (spawners[i].dead) {
        spawners.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < coins.length; i++) {
      coins[i].display();
      coins[i].update();

      if (coins[i].dead) {
        coins.splice(i, 1);
        i--;
      }
    }

    // for (let i = 0; i < blocks.length; i++) {
    //   blocks[i].displayShadow();
    // }

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

    strokeWeight(15);
    stroke(0);
    fill(255, 255, 0);
    textAlign(LEFT, TOP);
    textSize(50);
    text("FPS:" + round(frameRate()), 10, 10);
    noStroke();
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
          constrain(
            totalLoadedSprites,
            0,
            sprites.Blocks.floorTiles.length +
              sprites.Blocks.wallTiles.length +
              3
          ),
          0,
          sprites.Blocks.floorTiles.length +
            sprites.Blocks.wallTiles.length +
            3,
          0,
          500
        ) /
          2,
      windowHeight / 2 + 100,
      map(
        constrain(
          totalLoadedSprites,
          0,
          sprites.Blocks.floorTiles.length + sprites.Blocks.wallTiles.length + 3
        ),
        0,
        sprites.Blocks.floorTiles.length + sprites.Blocks.wallTiles.length + 3,
        0,
        500
      ),
      50
    );

    loadedSprites = true;
    if (!sprites.Blocks.loaded) {
      loadedSprites = false;
    }
    if (!sprites.Spider.loaded) {
      loadedSprites = false;
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

  if (keyCode === 53) {
    UI.isToggled = !UI.isToggled;
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    if (
      !heroes[0].ability.RainFire.using &&
      !heroes[0].ability.LightningStrike.using
    ) {
      heroes[0].attack();
    } else {
      if (
        heroes[0].stats.energy >= heroes[0].ability.RainFire.energy &&
        heroes[0].ability.RainFire.using
      ) {
        heroes[0].ability.RainFire.used = true;
        heroes[0].stats.energy -= heroes[0].ability.RainFire.energy;
      }
      if (
        heroes[0].stats.energy >= heroes[0].ability.LightningStrike.energy &&
        heroes[0].ability.LightningStrike.using
      ) {
        heroes[0].ability.LightningStrike.used = true;
        console.log(heroes[0].ability.LightningStrike.used);
        heroes[0].stats.energy -= heroes[0].ability.LightningStrike.energy;
      }
    }
  }
  if (mouseButton === RIGHT) {
    console.log("HEY!");
    if (heroes[0].ability.RainFire.using) {
      heroes[0].ability.RainFire.using = false;
    }
    if (heroes[0].ability.LightningStrike.using) {
      heroes[0].ability.LightningStrike.using = false;
    }
  }
}
