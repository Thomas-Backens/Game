function Interface(config) {
  this.character = config.character;

  this.display = function () {
    strokeWeight(3);
    stroke(0, 255, 255, 200);
    fill(0, 255, 255, 50);
    rect(windowWidth / 2, windowHeight - 100, windowWidth / 1.5, 40, 10);

    for (let i = 0; i < this.character.abilities.length; i++) {
      let abilityX =
        windowWidth / 2 -
        windowWidth / 2 / 2 +
        (windowWidth / 2 / (this.character.abilities.length - 1)) * i;
      let abilityY = windowHeight - 160;

      noStroke();
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(0, 255, 255);
      text(this.character.abilities[i].name, abilityX, abilityY - 110);
      strokeWeight(3);
      stroke(0, 255, 255, 200);
      fill(0, 255, 255, 50);
      rect(abilityX, abilityY, 120, 120, 20);
      rect(abilityX, abilityY - 75, 70, 30, 10, 10, 0, 0);
      noStroke();
      fill(0, 255, 255);
      text(this.character.abilities[i].key, abilityX, abilityY - 75);
    }
  };
}
