const MAX_ROUNDS = 5;
const STARTING_BUDGET = 1000;
const NUM_PRODUCTS = 2;
const PRODUCT_COST = 10;

let currentRound = 1;
let roundHistory = [];

const baseBudget = 700;

let currentCustomerPreference = "price"; // Default for Round 1

let teamProfits = {
  Team1: 0,
  Team2: 0,
  Team3: 0,
  Team4: 0
};

let teamRoundProfitsHistory = {
  Team1: {},
  Team2: {},
  Team3: {},
  Team4: {}
};


let teamInventory = {
  Team1: {},
  Team2: {},
  Team3: {},
  Team4: {}
};

function getAvailableBudget(team) {
  let base = teamBudgets[team] ?? STARTING_BUDGET;
  if (currentRound >= 4) {
    base += teamProfits[team] || 0;
  }
  return base;
}

let teamBudgets = {
  Team1: STARTING_BUDGET,
  Team2: STARTING_BUDGET,
  Team3: STARTING_BUDGET,
  Team4: STARTING_BUDGET,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateRoundProfits(roundNumber) {
  const teamRoundProfits = {
    Team1: 0,
    Team2: 0,
    Team3: 0,
    Team4: 0
  };

  roundHistory
    .filter(entry => entry.round === roundNumber)
    .forEach(entry => {
      const { team, price, unitsSold, quantity, promo, appearance, usability } = entry;

      const upgradeCost = ((appearance - 1) + (usability - 1)) * 50;
      const revenue = price * unitsSold;
      const cost = PRODUCT_COST * quantity + promo + upgradeCost;

      const profit = revenue - cost;

      teamRoundProfits[team] += profit;
    });

  for (const team in teamRoundProfits) {
    teamProfits[team] += teamRoundProfits[team];
	teamRoundProfitsHistory[team][roundNumber] = teamRoundProfits[team];
  }
}


function simulateUnitsSold(team, product, price, quantity, promo, appearance, usability) {
  const BASE_DEMAND = 100;
  const MAX_PRICE = 120;
  const MIN_PRICE = 80;

  const priceScore = 1 - (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE);
  const promoScore = Math.min(promo / 50, 1);
  const appearanceScore = appearance / 5;
  const usabilityScore = usability / 5;

  // Default weights
  let weights = {
    price: 0.5,
    promo: 0.2,
    appearance: 0.15,
    usability: 0.15
  };

  // Adjust weights based on preference
  if (currentCustomerPreference && weights[currentCustomerPreference]) {
    weights[currentCustomerPreference] += 0.15;
    // Reduce others slightly to keep sum ~1
    const others = Object.keys(weights).filter(k => k !== currentCustomerPreference);
    others.forEach(k => weights[k] -= 0.05);
  }

  const desirability = (
    weights.price * priceScore +
    weights.promo * promoScore +
    weights.appearance * appearanceScore +
    weights.usability * usabilityScore
  );

  const maxUnitsSold = Math.floor(BASE_DEMAND * desirability);
  return Math.min(quantity, maxUnitsSold);
}



function updateCustomerPreference() {
  const preferences = ["price", "promo", "appearance", "usability"];
  const randomIndex = Math.floor(Math.random() * preferences.length);
  currentCustomerPreference = preferences[randomIndex];
}
