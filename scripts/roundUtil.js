// roundUtils.js

function isGameOver() {
  return currentRound > 5;
}

function advanceRound() {
  currentRound++;
}

function shouldIncludeProfit(round) {
  return round >= 4;
}
