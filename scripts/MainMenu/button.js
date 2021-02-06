function Button(x, y, width, height, fontSize, message) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.fontSize = fontSize;
  this.message = message;

  this.display = function () {
    noStroke();
    fill(100);
    rect(this.x, this.y, this.width, this.height, 10);
    textAlign(CENTER);
    textSize(this.fontSize);
    fill(50);
    text(this.message, this.x + 2, this.y + this.height / 5 + 2);
    fill(200);
    text(this.message, this.x, this.y + this.height / 5);
  };
}
