let keys = [];

let heroes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);

  heroes.push(
    new Hero({
      x: 100,
      y: 150,
    })
  );
  heroes.push(
    new Hero({
      x: 200,
      y: 400,
    })
  );
  heroes.push(
    new Hero({
      x: 800,
      y: 500,
    })
  );
}

function draw() {
  background(255);

  for (let i = 0; i < heroes.length; i++) {
    heroes[i].display();
    heroes[i].move();
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
}
