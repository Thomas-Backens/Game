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

var rotatePoint = function (x, y, theta, sine) {
  var cosine = theta;
  if (sine === undefined) {
    cosine = cos(theta);
    sine = sin(theta);
  }
  return {
    x: cosine * x + sine * y,
    y: -sine * x + cosine * y,
  };
};
var isInCircle = function (x, y, cx, cy, diam) {
  var dx = x - cx;
  var dy = y - cy;
  return dx * dx + dy * dy <= (diam * diam) / 4;
};
var rectCircleCollide = function (rx, ry, w, h, theta, cx, cy, diam, rectM) {
  if (theta) {
    var r = rotatePoint(cx - rx, cy - ry, theta);
    cx = r.x + rx;
    cy = r.y + ry;
  }
  if (rectM === "CENTER") {
    rx -= w / 2;
    ry -= h / 2;
  }
  var closestX = constrain(cx, rx, rx + w);
  var closestY = constrain(cy, ry, ry + h);
  return isInCircle(closestX, closestY, cx, cy, diam);
};

function cloneGif(gif, startFrame) {
  let gifClone = gif.get();
  // access original gif properties
  gp = gif.gifProperties;
  // make a new object for the clone
  gifClone.gifProperties = {
    displayIndex: gp.displayIndex,
    // we still point to the original array of frames
    frames: gp.frames,
    lastChangeTime: gp.lastChangeTime,
    loopCount: gp.loopCount,
    loopLimit: gp.loopLimit,
    numFrames: gp.numFrames,
    playing: gp.playing,
    timeDisplayed: gp.timeDisplayed,
  };
  // optional tweak the start frame
  gifClone.setFrame(startFrame);

  return gifClone;
}
