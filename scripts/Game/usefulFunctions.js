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
