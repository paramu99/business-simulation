function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function generateInputTable() {
  const tbody = document.getElementById("input-table-body");
  tbody.innerHTML = "";
  for (let i = 1; i <= NUM_PRODUCTS; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>Product ${i}</td>
      <td><input type="number" id="price_${i}" min="0" value="100"/></td>
      <td><input type="number" id="quantity_${i}" min="0" value="10"/></td>
      <td><input type="number" id="promo_${i}" min="0" value="0"/></td>
      <td><input type="number" id="appearance_${i}" min="1" max="5" value="3"/></td>
      <td><input type="number" id="usability_${i}" min="1" max="5" value="3"/></td>
      <td id="total_${i}">₹0</td>
    `;
    tbody.appendChild(row);
  }
  document.getElementById("expected-cost").textContent = "Expected Total Cost: ₹0";
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
  renderBudgets();
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

  Object.entries(grouped).forEach(([round, entries]) => {
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
    const budget = getAvailableBudget(team);
    const profit = teamProfits[team] ?? 0;

    const card = document.createElement("div");
    card.className = "budget-card";
    if (team === "Team1") card.classList.add("highlight-team"); // Optional highlight

    card.innerHTML = `
      <strong>${team}</strong><br>
      Available Budget: ₹${budget.toFixed(2)}<br>
      Cumulative Profit: ₹${profit.toFixed(2)}
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

document.getElementById("toggle-financials-btn").addEventListener("click", () => {
  const budgetDiv = document.getElementById("budgets");
  const currentlyShowingAll = budgetDiv.dataset.showAll === "true";
  budgetDiv.dataset.showAll = (!currentlyShowingAll).toString();

  const btn = document.getElementById("toggle-financials-btn");
  btn.textContent = currentlyShowingAll ? "Show Financial Summary" : "Hide Financial Summary";

  renderBudgets();
});

//collapsible sections
document.querySelectorAll(".collapsible-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === "none" ? "block" : "none";
  });
});
