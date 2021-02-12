function Interface(config) {
  this.character = config.character;

  this.display = function () {
    strokeWeight(3);
    stroke(0, 255, 255, 200);
    fill(0, 255, 255, 50);
    rect(windowWidth / 2, windowHeight - 100, windowWidth / 2.5, 40, 10);

    for (let i = 0; i < this.character.abilities.length; i++) {
      let abilityX =
        windowWidth / 2 -
        windowWidth / 2 / 3.5 +
        (windowWidth / 3.5 / (this.character.abilities.length - 1)) * i;
      let abilityY = windowHeight - 150;

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
    fill(200, 100, 0);
    rect(50, windowHeight - 50, 100, 100);
    rect(windowWidth - 150, windowHeight - 150, 300, 300);
  };
}
