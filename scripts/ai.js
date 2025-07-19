const AI_PROFILES = {
  aggressive: {
    priceBias: -10,
    promoBias: 10,
    qualityBias: 1
  },
  conservative: {
    priceBias: 10,
    promoBias: -5,
    qualityBias: 2
  },
  balanced: {
    priceBias: 0,
    promoBias: 0,
    qualityBias: 1.5
  }
};

const AI_PERSONALITIES = {
  Team2: "aggressive",
  Team3: "conservative",
  Team4: "balanced"
};


function getEnhancedAIDecision({ team, product, round }) {
  const profile = AI_PROFILES[AI_PERSONALITIES[team]] || AI_PROFILES["balanced"];

  // Get Team1's last round price for the same product
  const lastRound = currentRound - 1;
  const team1Last = roundHistory.find(e => e.team === "Team1" && e.round === lastRound && e.product === product);
  const team1Price = team1Last?.price ?? 100;

  // Base price adjusted by personality and team1's pricing
  let price = team1Price + profile.priceBias + getRandomInt(-5, 5);
  price = Math.max(60, Math.min(price, 140)); // Clamp

  const quantity = getRandomInt(8, 15 + round);
  const promo = getRandomInt(0, 20) + profile.promoBias;

  const appearance = Math.min(5, 1 + Math.floor(Math.random() * (2 + profile.qualityBias)));
  const usability = Math.min(5, 1 + Math.floor(Math.random() * (2 + profile.qualityBias)));

  return { price, quantity, promo, appearance, usability };
}
