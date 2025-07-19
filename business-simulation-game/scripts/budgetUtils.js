// budgetUtils.js

function getAvailableBudget(team) {
  let budget = baseBudget;
  if (currentRound >= 4) {
    budget += teamProfits[team] || 0;
  }
  return budget;
}

function hasSufficientBudget(team, cost) {
  return getAvailableBudget(team) >= cost;
}
