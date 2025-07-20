function handleSubmit() {
  const totalCostTeam1 = processTeam1Decisions();
  if (!validateTeam1Budget(totalCostTeam1)) return;

  processAITeams();
  allocateMarketDemand();
  renderPreviousRoundDebug();
  finalizeRound();
}

// Handle submit is Over



function validateTeam1Budget(totalCost) {
  const budget = getAvailableBudget("Team1");
  if (totalCost > budget) {
    alert(`❌ Team1 exceeded budget! Needed ₹${totalCost}, available ₹${budget}`);
    roundHistory = roundHistory.filter(e => !(e.round === currentRound && e.team === "Team1"));
    return false;
  }
  return true;
}



function finalizeRound() {
  calculateRoundProfits(currentRound);
  renderTeamFinancials();
  renderBudgets(); // Ensure budget updates too
  
  console.log("=== Round History for", currentRound, "===");
  console.table(roundHistory.filter(e => e.round === currentRound));
 
  currentRound++;
  
  updateCustomerPreference(); 
  updateRoundHeading();
  generateInputTable();
  attachInputListeners();
//  calculateTotalCosts();
  setTimeout(() => {
  calculateTotalCosts();
}, 0);
  renderReviewTable();
  generateMarketInsights();
  
  if (currentRound > 5) {
    declareWinner();
  }
}


document.addEventListener("DOMContentLoaded", () => {
 generateInputTable();
  //calculateTotalCosts();
  setTimeout(() => {
  calculateTotalCosts();
}, 0);
  attachInputListeners();
  updateRoundHeading();
  renderReviewTable();
  generateMarketInsights();
  renderTeamFinancials(); // ← add this
  renderBudgets(); 
  //renderPreviousRoundDebug();
  
  document.getElementById("submit-btn").addEventListener("click", handleSubmit);
  
  makeSectionsCollapsible();  // ✅ Add this line at the end
});

function declareWinner() {
  const entries = Object.entries(teamProfits);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [winner, maxProfit] = sorted[0];
  alert(`🏆 ${winner} wins with a profit of ₹${maxProfit.toFixed(2)}!`);
}

function declareWinner() {
  let winningTeam = "";
  let maxProfit = -Infinity;

  for (const team in teamProfits) {
    if (teamProfits[team] > maxProfit) {
      maxProfit = teamProfits[team];
      winningTeam = team;
    }
  }

  alert(`🏆 Game Over!\nWinner: ${winningTeam} with ₹${maxProfit.toFixed(2)} profit`);
}

function makeSectionsCollapsible() {
  const headings = document.querySelectorAll("section h2, section h3");

  headings.forEach(heading => {
    heading.style.cursor = "pointer";
    heading.addEventListener("click", () => {
      const section = heading.parentElement;
      const content = [...section.children].filter(el => el !== heading);
      content.forEach(el => {
        el.style.display = (el.style.display === "none") ? "" : "none";
      });
    });
  });
}
