// DOM elements
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");

let transactions = [];

// Load from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("transactions");
  if (stored) {
    transactions = JSON.parse(stored);
    renderTransactions();
  }
});

// Add new transaction
addBtn.addEventListener("click", () => {
  const descVal = desc.value.trim();
  const amountVal = parseFloat(amount.value);

  if (descVal === "" || isNaN(amountVal)) {
    alert("Please enter valid description and amount!");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    desc: descVal,
    amount: amountVal,
    type: type.value,
  };

  transactions.push(newTransaction);
  saveToLocal();
  renderTransactions();

  desc.value = "";
  amount.value = "";
});

// Save to localStorage
function saveToLocal() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render all transactions
function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      <span>${t.desc}</span>
      <div>
        <span>${t.type === "expense" ? "-" : "+"}₹${t.amount.toFixed(2)}</span>
        <button onclick="deleteTransaction(${t.id})">×</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateSummary();
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveToLocal();
  renderTransactions();
}

// Update balance, income, expense
function updateSummary() {
  let income = 0,
    expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const total = income - expense;

  totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpense.textContent = `₹${expense.toFixed(2)}`;
  balance.textContent = `₹${total.toFixed(2)}`;

  // Dynamic color change
  if (total > 0) balance.style.color = "#2ecc71";
  else if (total < 0) balance.style.color = "#e74c3c";
  else balance.style.color = "#fff";
}
