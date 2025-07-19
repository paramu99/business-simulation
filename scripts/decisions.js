let pendingDecisions = [];

// 🧠 Human Player Decision
function processTeam1Decisions() {
  let totalCost = 0;

  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const product = `Product ${i}`;
    const price = Number(document.getElementById(`price_${i}`).value || 0);
    const inputQty = Number(document.getElementById(`quantity_${i}`).value || 0);
    const promo = Number(document.getElementById(`promo_${i}`).value || 0);
    const appearance = Number(document.getElementById(`appearance_${i}`).value || 1);
    const usability = Number(document.getElementById(`usability_${i}`).value || 1);

    const upgradeCost = ((appearance - 1) + (usability - 1)) * 50;
    const totalCostProduct = inputQty * PRODUCT_COST + promo + upgradeCost;
    totalCost += totalCostProduct;

    pendingDecisions.push({
      team: "Team1", product, price, quantity: inputQty,
      promo, appearance, usability, totalCost: totalCostProduct
    });
  }

  return totalCost;
}

// 🤖 AI Team Decisions
function processAITeams() {
  for (let teamNum = 2; teamNum <= 4; teamNum++) {
    const team = `Team${teamNum}`;
    const budget = getAvailableBudget(team);
    let totalCost = 0;

    for (let i = 1; i <= NUM_PRODUCTS; i++) {
      const product = `Product ${i}`;
      let { price, quantity, promo, appearance, usability } =
        getEnhancedAIDecision({ team, product, round: currentRound });

      price = price ?? getRandomInt(80, 120);
      quantity = quantity ?? getRandomInt(5, 20);
      promo = promo ?? getRandomInt(0, 30);
      appearance = appearance ?? getRandomInt(1, 5);
      usability = usability ?? getRandomInt(1, 5);

      const upgradeCost = ((appearance - 1) + (usability - 1)) * 50;
      const cost = quantity * PRODUCT_COST + promo + upgradeCost;
      totalCost += cost;

      pendingDecisions.push({
        team, product, price, quantity, promo, appearance, usability, totalCost: cost
      });
    }

    if (totalCost > budget) {
      console.log(`${team} skipped round due to insufficient budget (Needed ₹${totalCost}, Available ₹${budget})`);
      pendingDecisions = pendingDecisions.filter(p => p.team !== team);
    }
  }
}

const totalDemand = {
  "Product 1": 40,
  "Product 2": 40
};

function computeDesirability(entry) {
  const priceScore = 1 - (entry.price - 80) / 40;
  const promoScore = Math.min(entry.promo / 50, 1);
  const appearanceScore = entry.appearance / 5;
  const usabilityScore = entry.usability / 5;

  return (
    0.5 * priceScore +
    0.2 * promoScore +
    0.15 * appearanceScore +
    0.15 * usabilityScore
  );
}

function allocateMarketDemand() {
  const productGroups = {};

  for (const entry of pendingDecisions) {
    if (!productGroups[entry.product]) productGroups[entry.product] = [];
    productGroups[entry.product].push(entry);
  }

  for (const product in productGroups) {
    const entries = productGroups[product];
    const desirabilities = entries.map(entry => ({
      ...entry,
      desirability: computeDesirability(entry)
    }));

    const totalDesirability = desirabilities.reduce((sum, d) => sum + d.desirability, 0);
    const demand = totalDemand[product];

    for (const d of desirabilities) {
      const { team, quantity, totalCost, desirability } = d;
      const carryoverQty = teamInventory[team][product] || 0;
      const totalQty = quantity + carryoverQty;

      const share = (desirability / totalDesirability);
      const unitsSold = Math.min(totalQty, Math.floor(demand * share));
      const unsold = totalQty - unitsSold;

      teamInventory[team][product] = unsold;

      roundHistory.push({
        round: currentRound,
        ...d,
        unitsSold,
        unsold,
		profit: (d.price * unitsSold) - d.totalCost
      });
    }
  }

  pendingDecisions = []; // Clear for next round
}
