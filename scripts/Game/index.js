let keys = [];
let bitMap = [
  "11111111111111111111111111111111111111111",
  "1                   1            1      1",
  "1        11111       1                  1",
  "1  S             11     1 11  11     s  1",
  "1                                       1",
  "1      1111                             1",
  "1            1            1           111",
  "1            1              1        1  1",
  "1           1                11     1   1",
  "1    11           11         1      1   1",
  "1    1    11    11          1           1",
  "1   1          1                        1",
  "1             1      1111               1",
  "1                              1   1    1",
  "1     11                     11    1    1",
  "1    1       1            111      1    1",
  "1    1      1                       1   1",
  "1                11   11                1",
  "1                1     1        1       1",
  "1        1                       1      1",
  "1     111           p            1      1",
  "1                               11      1",
  "1         1      1     1                1",
  "1         1      11   11    1           1",
  "1                           1      1    1",
  "1                          1 1     1    1",
  "1     11      1            1  1         1",
  "1         1    11        111   1        1",
  "1        1       1                  1   1",
  "1        1       1                  1   1",
  "1         1           111          1    1",
  "1                  11            11     1",
  "1                                       1",
  "1    11                1      1         1",
  "1        1              111    11  11   1",
  "1        1                       1      1",
  "1              1                        1",
  "1  s            11111111 1           S  1",
  "1        11         1   1     111       1",
  "1                   1                   1",
  "11111111111111111111111111111111111111111",
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

let buttons = [];

let UI;
let shadow;

let sprites = {
  Spider: {
    idleImg: null,
    walkGif: null,
    idleAttackImg: null,
    loaded: false,
  },
  Snake: {
    idleImg: null,
    walkGif: null,
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

let scene = "game";
let paused = false;

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

  {
    buttons.push(
      new Button(
        50,
        windowHeight - 50,
        75,
        75,
        20,
        "Pause",
        function () {
          paused = true;
          scene = "paused";
        },
        "game",
        10
      )
    );
    buttons.push(
      new Button(
        windowWidth - 150,
        windowHeight - 175,
        200,
        50,
        30,
        "Back to Game",
        function () {
          scene = "game";
          paused = false;
        },
        "stats",
        10
      )
    );
    buttons.push(
      new Button(
        windowWidth - 150,
        windowHeight - 100,
        200,
        50,
        30,
        "Quit Game",
        function () {
          window.location.href = "/html";
        },
        "stats",
        10
      )
    );
    buttons.push(
      new Button(
        windowWidth / 2 - 340,
        windowHeight / 2 - 100,
        150,
        50,
        25,
        "Damage",
        function () {
          if (
            heroes[0].stats.points >= 2 &&
            heroes[0].stats.upgrades.damage < heroes[0].stats.upgrades.maxDamage
          ) {
            heroes[0].stats.points -= 2;
            heroes[0].stats.upgrades.damage++;
            heroes[0].stats.damage += heroes[0].stats.damage * 0.1;
          }
        },
        "stats"
      )
    );
    buttons.push(
      new Button(
        windowWidth / 2 - 340,
        windowHeight / 2,
        150,
        50,
        20,
        "Energy Speed",
        function () {
          if (
            heroes[0].stats.points >= 3 &&
            heroes[0].stats.upgrades.energy < heroes[0].stats.upgrades.maxEnergy
          ) {
            heroes[0].stats.points -= 3;
            heroes[0].stats.upgrades.energy++;
            heroes[0].stats.energyRegen -=
              heroes[0].stats.upgrades.energy * 0.05;
          }
        },
        "stats"
      )
    );
    buttons.push(
      new Button(
        windowWidth / 2 - 340,
        windowHeight / 2 + 100,
        150,
        50,
        25,
        "HP",
        function () {
          if (
            heroes[0].stats.points >= 1 &&
            heroes[0].stats.upgrades.health < heroes[0].stats.upgrades.maxHealth
          ) {
            heroes[0].stats.points--;
            heroes[0].stats.upgrades.health++;
            heroes[0].stats.maxHealth += heroes[0].stats.maxHealth * 0.05;
            heroes[0].stats.health += heroes[0].stats.maxHealth * 0.05;
          }
        },
        "stats"
      )
    );
    buttons.push(
      new Button(
        windowWidth / 2,
        windowHeight - 300,
        200,
        50,
        25,
        "Retry",
        function () {
          if (scene === "death") {
            window.location.reload();
          }
        },
        "death",
        10
      )
    );
    buttons.push(
      new Button(
        windowWidth / 2,
        windowHeight - 225,
        200,
        50,
        25,
        "Return to Menu",
        function () {
          if (scene === "death") {
            window.location.href = "/html";
          }
        },
        "death",
        10
      )
    );
  } // buttons

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
    sprites.Snake.idleImg = loadImage(
      "../../../sprites/Monsters/Snake/Idle.png",
      () => ((sprites.Snake.loaded = true), totalLoadedSprites++),
      () => (sprites.Snake.loaded = false)
    );
    sprites.Snake.walkGif = loadImage(
      "../../../sprites/Monsters/Snake/Walk.gif",
      () => ((sprites.Snake.loaded = true), totalLoadedSprites++),
      () => (sprites.Snake.loaded = false)
    );
  } // Snake Images

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

function draw() {
  cursor("default");
  switch (scene) {
    case "death":
      background(255, 0, 0, 1);
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].scene === scene) buttons[i].display();
      }
      strokeWeight(5);
      stroke(0);
      textAlign(CENTER, CENTER);
      textSize(75);
      fill(255);
      text("You Died!", windowWidth / 2, windowHeight / 2 - 100);
      break;
    case "stats":
      background(50);
      noStroke();
      textAlign(CENTER);
      textSize(30);
      fill(200);
      text(`points: ${heroes[0].stats.points}`, windowWidth / 2, 50);
      strokeWeight(3);
      stroke(20);
      fill(0, 255, 0);
      rect(
        windowWidth / 2 -
          265 +
          map(
            heroes[0].stats.upgrades.damage,
            0,
            heroes[0].stats.upgrades.maxDamage,
            0,
            530
          ) /
            2,
        windowHeight / 2 - 100,
        map(
          heroes[0].stats.upgrades.damage,
          0,
          heroes[0].stats.upgrades.maxDamage,
          0,
          -530
        ),
        35
      );
      noFill();
      for (let i = 0; i < heroes[0].stats.upgrades.maxDamage; i++) {
        rect(
          windowWidth / 2 -
            265 +
            530 / heroes[0].stats.upgrades.maxDamage / 2 +
            (530 / heroes[0].stats.upgrades.maxDamage) * i,
          windowHeight / 2 - 100,
          530 / heroes[0].stats.upgrades.maxDamage,
          35
        );
      }
      noFill();
      rect(windowWidth / 2, windowHeight / 2 - 100, 530, 35);
      fill(0, 255, 0);
      rect(
        windowWidth / 2 -
          265 +
          map(
            heroes[0].stats.upgrades.energy,
            0,
            heroes[0].stats.upgrades.maxEnergy,
            0,
            530
          ) /
            2,
        windowHeight / 2,
        map(
          heroes[0].stats.upgrades.energy,
          0,
          heroes[0].stats.upgrades.maxEnergy,
          0,
          -530
        ),
        35
      );
      noFill();
      for (let i = 0; i < heroes[0].stats.upgrades.maxEnergy; i++) {
        rect(
          windowWidth / 2 -
            265 +
            530 / heroes[0].stats.upgrades.maxEnergy / 2 +
            (530 / heroes[0].stats.upgrades.maxEnergy) * i,
          windowHeight / 2,
          530 / heroes[0].stats.upgrades.maxEnergy,
          35
        );
      }
      noFill();
      rect(windowWidth / 2, windowHeight / 2, 530, 35);
      fill(0, 255, 0);
      rect(
        windowWidth / 2 -
          265 +
          map(
            heroes[0].stats.upgrades.health,
            0,
            heroes[0].stats.upgrades.maxHealth,
            0,
            530
          ) /
            2,
        windowHeight / 2 + 100,
        map(
          heroes[0].stats.upgrades.health,
          0,
          heroes[0].stats.upgrades.maxHealth,
          0,
          -530
        ),
        35
      );
      noFill();
      for (let i = 0; i < heroes[0].stats.upgrades.maxHealth; i++) {
        rect(
          windowWidth / 2 -
            265 +
            530 / heroes[0].stats.upgrades.maxHealth / 2 +
            (530 / heroes[0].stats.upgrades.maxHealth) * i,
          windowHeight / 2 + 100,
          530 / heroes[0].stats.upgrades.maxHealth,
          35
        );
      }
      noFill();
      rect(windowWidth / 2, windowHeight / 2 + 100, 530, 35);
      noStroke();
      fill(20);
      rect(windowWidth / 2 + 290, windowHeight / 2 - 100, 50, 50);
      rect(windowWidth / 2 + 290, windowHeight / 2, 50, 50);
      rect(windowWidth / 2 + 290, windowHeight / 2 + 100, 50, 50);
      fill(200);
      textSize(12);
      text("2", windowWidth / 2 + 290, windowHeight / 2 - 112);
      text("Points", windowWidth / 2 + 290, windowHeight / 2 - 98);
      text("3", windowWidth / 2 + 290, windowHeight / 2 - 12);
      text("Points", windowWidth / 2 + 290, windowHeight / 2 + 2);
      text("1", windowWidth / 2 + 290, windowHeight / 2 + 87);
      text("Point", windowWidth / 2 + 290, windowHeight / 2 + 101);
      textSize(15);
      fill(0, 255, 255);
      text(
        "Increase damage by 10%",
        windowWidth / 2 - 340,
        windowHeight / 2 - 65
      );
      text(
        "Increase energy speed by 5%",
        windowWidth / 2 - 340,
        windowHeight / 2 + 35
      );
      text(
        "Increase health by 5%",
        windowWidth / 2 - 340,
        windowHeight / 2 + 135
      );
      if (
        heroes[0].stats.upgrades.damage >= heroes[0].stats.upgrades.maxDamage
      ) {
        text("Max level", windowWidth / 2, windowHeight / 2 - 140);
      }
      if (
        heroes[0].stats.upgrades.energy >= heroes[0].stats.upgrades.maxEnergy
      ) {
        text("Max level", windowWidth / 2, windowHeight / 2 - 40);
      }
      if (
        heroes[0].stats.upgrades.health >= heroes[0].stats.upgrades.maxHealth
      ) {
        text("Max level", windowWidth / 2, windowHeight / 2 + 60);
      }
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].scene === scene) buttons[i].display();
      }
      break;
    case "game":
      if (!paused) {
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
            switch (monsters[i].type) {
              case "Spider":
                if (monsters[i].loadDelay >= 60 && !monsters[i].setDelays) {
                  monsters[i].deathGif.delay(10000, 13);
                  monsters[i].attackGif.pause();
                  monsters[i].setDelays = true;
                }
                break;
              case "Snake":
                monsters[i].setDelays = true;
                break;
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
          text(
            "Loading Sprites",
            windowWidth / 2 + 5,
            windowHeight / 2 - 100 + 5
          );
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
          if (!sprites.Snake.loaded) {
            loadedSprites = false;
          }
        }
      }
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].scene === scene) {
          if (buttons[i].message === "Play") {
            buttons[i].message = "Pause";
            buttons[i].onClick = function () {
              scene = "paused";
              paused = true;
            };
          }
          buttons[i].display();
        }
      }
      break;
    case "paused":
      background(0, 2);
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].scene === "game") {
          if (buttons[i].message === "Pause") {
            buttons[i].message = "Play";
            buttons[i].onClick = function () {
              scene = "game";
              paused = false;
            };
          }
          buttons[i].display();
        }
      }
      break;
  }
  strokeWeight(15);
  stroke(0);
  fill(255, 255, 0);
  textAlign(LEFT, TOP);
  textSize(50);
  text("FPS:" + round(frameRate()), 10, 10);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (paused) {
    return;
  }
  keys[keyCode] = true;
}
function keyReleased() {
  if (keyCode === 27) {
    paused = false;
    scene = "game";
  }
  if (paused) {
    return;
  }
  keys[keyCode] = false;

  for (let i = 0; i < heroes[0].abilities.length; i++) {
    if (key.toString() === heroes[0].abilities[i].key) {
      heroes[0].useAbility(heroes[0].abilities[i].name);
    }
  }

  if (keyCode === 53) {
    UI.isToggled = !UI.isToggled;
  }

  if (keyCode === 80) {
    paused = true;
    scene = "stats";
  }
}

function mousePressed() {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].mouseHover()) {
      buttons[i].pressed = true;
    }
  }
}
function mouseReleased() {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].mouseHover() && buttons[i].pressed === true) {
      buttons[i].onClick();
    }
  }
  if (paused) {
    return;
  }
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
        heroes[0].stats.energy -= heroes[0].ability.LightningStrike.energy;
      }
    }
  }
  if (mouseButton === RIGHT) {
    if (heroes[0].ability.RainFire.using) {
      heroes[0].ability.RainFire.using = false;
    }
    if (heroes[0].ability.LightningStrike.using) {
      heroes[0].ability.LightningStrike.using = false;
    }
  }
}
