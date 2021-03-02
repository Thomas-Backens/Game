function Interface(config) {
  this.character = config.character;
  this.isToggled = false;
  this.y = 0;

  this.display = function () {
    if (this.isToggled) {
      if (this.y < 500) {
        this.y += 10;
      }
    } else {
      if (this.y > 0) {
        this.y -= 10;
      }
    }

    strokeWeight(3);
    stroke(0, 255, 255, 200);
    fill(0, 255, 255, 50);
    rect(
      windowWidth / 2,
      windowHeight - 100 + this.y,
      windowWidth / 2.5,
      40,
      10
    );

    for (let i = 0; i < this.character.abilities.length; i++) {
      let abilityX =
        windowWidth / 2 -
        windowWidth / 2 / 3.5 +
        (windowWidth / 3.5 / (this.character.abilities.length - 1)) * i;
      let abilityY = windowHeight - 150 + this.y;

      noStroke();
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(0, 255, 255);
      text(this.character.abilities[i].name, abilityX, abilityY - 100);
      strokeWeight(3);
      stroke(0, 255, 255, 200);
      fill(0, 255, 255, 50);
      rect(abilityX, abilityY, 100, 100, 20);
      rect(abilityX, abilityY - 65, 50, 30, 10, 10, 0, 0);
      noStroke();
      fill(0, 255, 255);
      text(this.character.abilities[i].key, abilityX, abilityY - 65);
    }

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(15);
    fill(0, 255, 255);
    text("Press 5 to toggle UI", windowWidth / 2, windowHeight - 50);

    fill(200, 100, 0);
    rect(50, windowHeight - 50, 100, 100);
    rect(windowWidth - 150, windowHeight - 150, 300, 300);

    // Health
    noStroke();
    fill(255);
    rect(
      windowWidth - 50,
      windowHeight -
        25 -
        map(
          constrain(heroes[0].fakeHealth, 0, heroes[0].stats.maxHealth),
          0,
          heroes[0].stats.maxHealth,
          0,
          250
        ) /
          2,
      50,
      map(
        constrain(heroes[0].fakeHealth, 0, heroes[0].stats.maxHealth),
        0,
        heroes[0].stats.maxHealth,
        0,
        -250
      ),
      5
    );

    noStroke();
    fill(255, 0, 0);
    rect(
      windowWidth - 50,
      windowHeight -
        25 -
        map(
          constrain(heroes[0].stats.health, 0, heroes[0].stats.maxHealth),
          0,
          heroes[0].stats.maxHealth,
          0,
          250
        ) /
          2,
      50,
      map(
        constrain(heroes[0].stats.health, 0, heroes[0].stats.maxHealth),
        0,
        heroes[0].stats.maxHealth,
        0,
        -250
      ),
      5
    );

    strokeWeight(5);
    stroke(0);
    noFill();
    rect(windowWidth - 50, windowHeight - 150, 50, 250, 5);

    // Energy
    noStroke();
    fill(255);
    rect(
      windowWidth - 125,
      windowHeight -
        25 -
        map(
          constrain(heroes[0].fakeEnergy, 0, heroes[0].stats.maxEnergy),
          0,
          heroes[0].stats.maxEnergy,
          0,
          225
        ) /
          2,
      50,
      map(
        constrain(heroes[0].fakeEnergy, 0, heroes[0].stats.maxEnergy),
        0,
        heroes[0].stats.maxEnergy,
        0,
        -225
      ),
      5
    );

    noStroke();
    fill(0, 150, 255);
    rect(
      windowWidth - 125,
      windowHeight -
        25 -
        map(
          constrain(heroes[0].stats.energy, 0, heroes[0].stats.maxEnergy),
          0,
          heroes[0].stats.maxEnergy,
          0,
          225
        ) /
          2,
      50,
      map(
        constrain(heroes[0].stats.energy, 0, heroes[0].stats.maxEnergy),
        0,
        heroes[0].stats.maxEnergy,
        0,
        -225
      ),
      5
    );

    strokeWeight(5);
    stroke(0);
    noFill();
    rect(windowWidth - 125, windowHeight - 137.5, 50, 225, 5);

    // XP
    noStroke();
    fill(0, 255, 0);
    rect(
      windowWidth - 200,
      windowHeight -
        25 -
        map(
          constrain(heroes[0].stats.xp, 0, heroes[0].stats.xpToNextLevel),
          0,
          heroes[0].stats.xpToNextLevel,
          0,
          200
        ) /
          2,
      50,
      map(
        constrain(heroes[0].stats.xp, 0, heroes[0].stats.xpToNextLevel),
        0,
        heroes[0].stats.xpToNextLevel,
        0,
        -200
      ),
      5
    );

    strokeWeight(5);
    stroke(0);
    noFill();
    rect(windowWidth - 200, windowHeight - 125, 50, 200, 5);

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text(
      `Level: ${heroes[0].stats.level}`,
      windowWidth - 200,
      windowHeight - 250
    );
    text(heroes[0].stats.xp, windowWidth - 200, windowHeight - 125);
    text(heroes[0].stats.energy, windowWidth - 125, windowHeight - 137.5);
    text(heroes[0].stats.health, windowWidth - 50, windowHeight - 150);

    noFill();
    if (heroes[0].levelUp) {
      fill(255);
    }
    text("You gained a point!", windowWidth - 150, windowHeight - 350);
    text("Press 'P' to upgrade", windowWidth - 150, windowHeight - 350 + 25);
  };
}
