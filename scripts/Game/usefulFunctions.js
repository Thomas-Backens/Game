function calculateDefense(defense, damage) {
  let calc = 100 / defense;
  let finalDamage = damage / calc;
  return damage - round(finalDamage);
}

function calculateEndPosition(position, attackLength, angle) {
  return new p5.Vector(
    position.x + attackLength * cos(angle),
    position.y + attackLength * sin(angle)
  );
}

var rotatePoint = function(x, y, theta, sine) {
  var cosine = theta;
  if (sine === undefined) {
    cosine = cos(theta);
    sine = sin(theta);
  }
  return {
    x: cosine * x + sine * y,
    y: -sine * x + cosine * y
  };
};
var isInCircle = function(x, y, cx, cy, diam) {
  var dx = x - cx;
  var dy = y - cy;
  return dx * dx + dy * dy <= diam * diam / 4;
};
var rectCircleCollide = function(rx, ry, w, h, theta, cx, cy, diam) {
  if (theta) {
    var r = rotatePoint(cx - rx, cy - ry, theta);
    cx = r.x + rx;
    cy = r.y + ry;
  }
  var closestX = constrain(cx, rx, rx + w);
  var closestY = constrain(cy, ry, ry + h);
  return isInCircle(closestX, closestY, cx, cy, diam);
};
