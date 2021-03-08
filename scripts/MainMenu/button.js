function Button(
  x,
  y,
  width,
  height,
  fontSize,
  textDivisor,
  message,
  onClick,
  scene
) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.fontSize = fontSize;
  this.textDivisor = textDivisor;
  this.message = message;
  this.onClick = onClick || function () {};
  this.scene = scene || null;

  this.pressed = false;

  this.display = function () {
    noStroke();
    fill(100);
    rect(this.x, this.y, this.width, this.height, 10);
    textAlign(CENTER);
    textSize(this.fontSize);
    fill(50);
    text(this.message, this.x + 2, this.y + this.height / this.textDivisor + 2);
    fill(200);
    text(this.message, this.x, this.y + this.height / this.textDivisor);

    if (this.mouseHover()) {
      fill(0, 50);
      rect(this.x, this.y, this.width, this.height, 10);
      cursor("pointer");
    }
  };
  this.mouseHover = function () {
    return (
      mouseX >= this.x - this.width / 2 &&
      mouseX <= this.x + this.width / 2 &&
      mouseY >= this.y - this.height / 2 &&
      mouseY <= this.y + this.height / 2
    );
  };
}
