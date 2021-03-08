let buttons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  buttons.push(
    new Button(
      windowWidth / 2,
      windowHeight / 2,
      200,
      50,
      30,
      "Play",
      function () {
        window.location.href = "/html/game.html";
      }
    )
  );
  buttons.push(
    new Button(windowWidth / 2, windowHeight / 2 + 60, 200, 50, 30, "Quit")
  );
}

function draw() {
  cursor("default");
  background(50);

  strokeWeight(10);
  stroke(100, 100, 100);
  fill(70, 70, 70);
  rect(windowWidth / 2, 175, 500, 200, 20);

  noStroke();
  textAlign(CENTER);
  textSize(150);
  fill(100);
  text("Slain", windowWidth / 2 + 5, 185);
  fill(200);
  text("Slain", windowWidth / 2, 180);

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].display();
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
    if (buttons[i].mouseHover() && buttons[i].pressed) {
      buttons[i].onClick();
    }
    buttons[i].pressed = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
