let buttons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  buttons.push(
    new Button(windowWidth / 2, windowHeight / 2, 200, 50, 30, "Play")
  );
  buttons.push(
    new Button(windowWidth / 2, windowHeight / 2 + 60, 200, 50, 30, "Quit")
  );
}

function draw() {
  background(50);

  strokeWeight(10);
  stroke(100, 100, 100);
  fill(70, 70, 70);
  rect(windowWidth / 2, 200, 800, 150, 20);

  noStroke();
  textAlign(CENTER);
  textSize(80);
  fill(100);
  text("Monster Slayer", windowWidth / 2 + 5, 230);
  fill(200);
  text("Monster Slayer", windowWidth / 2, 225);

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyReleased() {
  if (keyCode === ENTER) {
    window.location.href = "/html/game.html";
  }
}
