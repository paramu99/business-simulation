// insights.js

function generateMarketInsights() {
  const insightsDiv = document.getElementById("market-insights");
  if (!insightsDiv) return;

  const prefMap = {
    price: "Low Prices",
    promo: "Big Promotions",
    appearance: "Trendy Looks",
    usability: "User-Friendly Design"
  };

  const prefText = prefMap[currentCustomerPreference] || "Unknown";
  const preferenceLine = `📢 This round, customers care most about: ${prefText}`;

  const totalRounds = currentRound - 1;
  if (totalRounds < 2) {
    insightsDiv.innerHTML = `<li>${preferenceLine}</li><li>Not enough data for trend insights. Play at least 2 rounds.</li>`;
    return;
  }

  const lookback = Math.min(3, totalRounds); // last 3 rounds
  let playerPrices = [], aiPrices = [], aiPromos = [];

  for (let r = currentRound - lookback; r < currentRound; r++) {
    const roundEntries = roundHistory.filter(e => e.round === r);
    const player = roundEntries.filter(e => e.team === "Team1");
    const ai = roundEntries.filter(e => e.team !== "Team1");

    playerPrices.push(average(player.map(e => e.price)));
    aiPrices.push(average(ai.map(e => e.price)));
    aiPromos.push(average(ai.map(e => e.promo)));
  }

  const insightLines = [
    preferenceLine,
    `📊 Over last ${lookback} rounds:`,
    `• Your avg price: ${trendString(playerPrices)}`,
    `• AI avg price: ${trendString(aiPrices)}`,
    `• AI promo trend: ${trendString(aiPromos)}`,
    trendSummary(playerPrices, aiPrices)
  ];

  insightsDiv.innerHTML = insightLines.map(i => `<li>${i}</li>`).join("");
}


function average(arr) {
  return arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
}

function trendString(values) {
  return values.map(v => `₹${v.toFixed(2)}`).join(" → ");
}

function trendSummary(playerPrices, aiPrices) {
  const yourTrend = playerPrices[0] > playerPrices[playerPrices.length - 1] ? "more aggressive" : "more premium";
  const aiTrend = aiPrices[0] > aiPrices[aiPrices.length - 1] ? "more aggressive" : "more premium";

  return `• You became ${yourTrend}; AI became ${aiTrend}`;
}

function average(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}
