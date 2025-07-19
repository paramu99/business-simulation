// teamLogic.js

function processTeam1Decisions() {
  let totalCost = 0;
  const team = "Team1";

  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const product = `Product ${i}`;
    const price = Number(document.getElementById(`price_${i}`).value || 0);
    const inputQty = Number(document.getElementById(`quantity_${i}`).value || 0);
    const promo = Number(document.getElementById(`promo_${i}`).value || 0);

    const carryoverQty = teamInventory[team][product] || 0;
    const totalQty = inputQty + carryoverQty;
    const totalCostItem = inputQty * PRODUCT_COST + promo;
    totalCost += totalCostItem;

    const unitsSold = simulateUnitsSold(price, totalQty);
    const unsold = totalQty - unitsSold;

    teamInventory[team][product] = unsold;

    roundHistory.push({
      round: currentRound,
      team,
      product,
      price,
      quantity: inputQty,
      promo,
      totalCost: totalCostItem,
      unitsSold,
      unsold
    });
  }
  return totalCost;
}

function processAITeams() {
  for (let teamNum = 2; teamNum <= 4; teamNum++) {
    const team = `Team${teamNum}`;
    const availableBudget = getAvailableBudget(team);
    let totalCostAI = 0;
    const aiChoices = [];

    for (let i = 1; i <= NUM_PRODUCTS; i++) {
      const product = `Product ${i}`;
      let { price, quantity, promo } = getEnhancedAIDecision({ team, product, round: currentRound });

      price = price ?? getRandomInt(80, 120);
      quantity = quantity ?? getRandomInt(5, 20);
      promo = promo ?? getRandomInt(0, 30);

      const carryoverQty = teamInventory[team][product] || 0;
      const totalQty = quantity + carryoverQty;

      const cost = quantity * PRODUCT_COST + promo;
      totalCostAI += cost;

      const unitsSold = simulateUnitsSold(price, totalQty);
      const unsold = totalQty - unitsSold;

      teamInventory[team][product] = unsold;

      aiChoices.push({ product, price, quantity, promo, cost, unitsSold, unsold });
    }

    if (totalCostAI <= availableBudget) {
      aiChoices.forEach(({ product, price, quantity, promo, cost, unitsSold, unsold }) => {
        roundHistory.push({
          round: currentRound,
          team,
          product,
          price,
          quantity,
          promo,
          totalCost: cost,
          unitsSold,
          unsold
        });
      });
    } else {
      console.log(`${team} skipped this round due to insufficient budget (Needed ₹${totalCostAI}, Available ₹${availableBudget})`);
    }
  }
}
