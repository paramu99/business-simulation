function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function generateInputTable() {
  const tbody = document.getElementById("input-table-body");
  tbody.innerHTML = "";
  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
	  <td data-label="Product">Product ${i}</td>
  <td data-label="Price"><input type="number" id="price_${i}" min="0" value="100"/></td>
  <td data-label="Quantity"><input type="number" id="quantity_${i}" min="0" value="10"/></td>
  <td data-label="Promo"><input type="number" id="promo_${i}" min="0" value="0"/></td>
  <td data-label="Appearance"><input type="number" id="appearance_${i}" min="1" max="5" value="3"/></td>
  <td data-label="Usability"><input type="number" id="usability_${i}" min="1" max="5" value="3"/></td>
  <td data-label="Total" id="total_${i}">₹0</td>
    `;
    tbody.appendChild(row);
  }
  document.getElementById("expected-cost").textContent = "Expected Total Cost: ₹0";
  updateExpectedCost();
}


function calculateTotalCosts() {
  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const quantity = Number(document.getElementById(`quantity_${i}`).value || 0);
    const promo = Number(document.getElementById(`promo_${i}`).value || 0);
    const appearance = Number(document.getElementById(`appearance_${i}`).value || 1);
    const usability = Number(document.getElementById(`usability_${i}`).value || 1);

    const upgradeCost = ((appearance - 1) + (usability - 1)) * 50;
    const totalCost = quantity * PRODUCT_COST + promo + upgradeCost;
    document.getElementById(`total_${i}`).textContent = formatCurrency(totalCost);
  }
}

function attachInputListeners() {
  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    ["quantity", "promo", "appearance", "usability"].forEach(field => {
      document.getElementById(`${field}_${i}`).addEventListener("input", () => {
        calculateTotalCosts();
        updateExpectedCost();
      });
    });
  }
}

function updateExpectedCost() {
  let total = 0;
  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const quantity = Number(document.getElementById(`quantity_${i}`).value || 0);
    const promo = Number(document.getElementById(`promo_${i}`).value || 0);
    const appearance = Number(document.getElementById(`appearance_${i}`).value || 1);
    const usability = Number(document.getElementById(`usability_${i}`).value || 1);

    const upgradeCost = ((appearance - 1) + (usability - 1)) * 50;
    total += quantity * PRODUCT_COST + promo + upgradeCost;
  }
  document.getElementById("expected-cost").textContent = `Expected Total Cost: ${formatCurrency(total)}`;
}

function updateRoundHeading() {
  document.getElementById("round-heading").textContent = `Round ${currentRound}: Your Decisions`;
  //renderBudgets();
}

function renderReviewTable() {
  const container = document.getElementById("review-table-body");
  container.innerHTML = "";

  const grouped = {};
  for (const entry of roundHistory) {
    if (!grouped[entry.round]) grouped[entry.round] = [];
    grouped[entry.round].push(entry);
  }

  const wrapper = document.createElement("div");
  wrapper.classList.add("review-cards");

  Object.entries(grouped)
  .sort((a, b) => b[0] - a[0]) // New line: sort descending by round
  .forEach(([round, entries]) => {
    const roundDetails = document.createElement("details");
    roundDetails.className = "review-round";
    roundDetails.open = true;
    roundDetails.innerHTML = `<summary>🔄 Round ${round}</summary>`;

    // My Products Section
    const myHeader = document.createElement("h3");
    myHeader.textContent = `Round ${round}: My Products`;
    myHeader.style.margin = "1rem";
    const myGrid = document.createElement("div");
    myGrid.className = "product-grid";

    // Other Teams Section
    const otherHeader = document.createElement("h3");
    otherHeader.textContent = `Round ${round}: Other Teams`;
    otherHeader.style.margin = "1rem";
    const otherGrid = document.createElement("div");
    otherGrid.className = "product-grid";

    entries.forEach(entry => {
      const card = document.createElement("div");
      card.className = `product-card ${entry.team.toLowerCase()}`;
      card.innerHTML = `
        <h4>${entry.product}</h4>
        <ul>
          <li>Price: ₹${entry.price}</li>
          <li>Qty: ${entry.quantity}, Sold: ${entry.unitsSold ?? "-"}, Unsold: ${entry.unsold ?? "-"}</li>
          <li>Promo: ₹${entry.promo}</li>
          <li>Appearance: ${entry.appearance ?? "-"}, Usability: ${entry.usability ?? "-"}</li>
          <li>Total Cost: ₹${entry.totalCost?.toFixed(2) ?? "-"}</li>
          <li>Profit: ₹${entry.profit ?? "-"}</li>
        </ul>
      `;

      if (entry.team === "Team1") {
        myGrid.appendChild(card);
      } else {
        otherGrid.appendChild(card);
      }
    });

    roundDetails.appendChild(myHeader);
    roundDetails.appendChild(myGrid);
    roundDetails.appendChild(otherHeader);
    roundDetails.appendChild(otherGrid);
    wrapper.appendChild(roundDetails);
  });

  container.appendChild(wrapper);
}


// Helper: assign a class for team color (e.g., team1, team2, team3...)
function teamClass(team) {
  const teamMap = {
    "Team A": "team1",
    "Team B": "team2",
    "Team C": "team3",
    "Team D": "team4"
  };
  return teamMap[team] || "team-default";
}

function renderBudgets() {
  const budgetDiv = document.getElementById("budgets");
  budgetDiv.innerHTML = ""; // Clear previous

  const teams = ["Team1", "Team2", "Team3", "Team4"];
  const wrapper = document.createElement("div");
  wrapper.className = "budget-cards"; // for flex or grid styling

  teams.forEach(team => {
	const totalProfit = teamProfits[team] || 0;
	const roundProfit = teamRoundProfitsHistory[team]?.[currentRound] ?? 0;

    const budget = getAvailableBudget(team);
    const profit = teamProfits[team] ?? 0;

    const card = document.createElement("div");
    card.className = "budget-card";
    if (team === "Team1") card.classList.add("highlight-team"); // Optional highlight

    card.innerHTML = `
      <strong>${team}</strong><br>
        Budget:₹${budget}<br/>
		Profit (Round ${currentRound}):₹${roundProfit}<br/>
		Total Profit:₹${totalProfit}<br/>
    `;

    wrapper.appendChild(card);
  });

  budgetDiv.appendChild(wrapper);
}

function renderTeamFinancials() {
  const container = document.getElementById("team-financials");
  container.innerHTML = "";

  const teams = ["Team1", "Team2", "Team3", "Team4"];
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Team</th>
        <th>Budget</th>
        <th>Profit</th>
      </tr>
    </thead>
    <tbody>
      ${teams.map(team => {
        const budget = getAvailableBudget(team);
        const profit = teamProfits[team] ?? 0;
        return `
          <tr>
            <td>${team}</td>
            <td>${formatCurrency(budget)}</td>
            <td>${formatCurrency(profit)}</td>
          `;
      }).join("")}
    </tbody>
  `;
  container.appendChild(table);
}

//collapsible sections
document.querySelectorAll(".collapsible-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === "none" ? "block" : "none";
  });
});


// On load, show help if not already seen
if (localStorage.getItem("introSeen") !== "true") {
  document.getElementById("game-help").classList.remove("hidden");
}

// Close help section and remember choice
document.getElementById("close-help").addEventListener("click", () => {
  document.getElementById("game-help").classList.add("hidden");
  localStorage.setItem("introSeen", "true");
});

// Reopen help section from icon
document.getElementById("help-icon").addEventListener("click", () => {
  document.getElementById("game-help").classList.remove("hidden");
});


function renderPreviousRoundDebug() {
  const box = document.getElementById("market-debug-box");
  if (!box) return;

  // Compute weights based on current preference
  const baseWeights = {
    price: 0.5,
    promo: 0.2,
    appearance: 0.15,
    usability: 0.15
  };

  const preference = currentCustomerPreference;
  if (preference && baseWeights[preference] !== undefined) {
    baseWeights[preference] += 0.15;
    const others = Object.keys(baseWeights).filter(k => k !== preference);
    others.forEach(k => baseWeights[k] -= 0.05);
  }

  // Generate weights table HTML
  const weightsTable = Object.entries(baseWeights).map(([factor, weight]) => {
    return `<tr><td>${factor}</td><td>${weight.toFixed(2)}</td></tr>`;
  }).join("");

  // Generate product demand table HTML
  const demandTable = Object.entries(totalDemand).map(([product, demand]) => {
    return `<tr><td>${product}</td><td>${demand}</td></tr>`;
  }).join("");

  box.innerHTML = `
    <h3>🔍 Market Debug Info (Dev Only) — Showing Round ${currentRound} (just completed)</h3>

	<p><em>Rendered at: ${new Date().toLocaleTimeString()}</em></p>

    <h4>📌 Customer Preference</h4>
    <p><strong>Current Focus:</strong> ${preference}</p>

    <h4>⚖️ Final Desirability Weights</h4>
    <table>
      <tr><th>Factor</th><th>Weight</th></tr>
      ${weightsTable}
    </table>

    <h4>📦 Product-Level Demand</h4>
    <table>
      <tr><th>Product</th><th>Demand Units</th></tr>
      ${demandTable}
    </table>
  `;
}
