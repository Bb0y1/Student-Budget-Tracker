const incomeInput = document.getElementById('income');
const frequencySelect = document.getElementById('frequency');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');

const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const balanceDisplay = document.getElementById('balance');
const summaryTitle = document.getElementById('summary-title');

const dailyIncomeDisplay = document.getElementById('daily-income');
const weeklyIncomeDisplay = document.getElementById('weekly-income');
const monthlyIncomeDisplay = document.getElementById('monthly-income');
const yearlyIncomeDisplay = document.getElementById('yearly-income');

let incomeFrequency = "monthly";
let expenses = [];

const ctx = document.getElementById('budgetChart').getContext('2d');
const budgetChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [{
      label: 'Amount (₱)',
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#f44336', '#2196F3']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `₱${ctx.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function calculateTotalExpenses() {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <span>${expense.name}: ₱${expense.amount.toFixed(2)}</span>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(item);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateChartAndSummary();
}

function updateChartAndSummary() {
  const input = parseFloat(incomeInput.value) || 0;
  let daily = 0, weekly = 0, monthly = 0, yearly = 0;

  switch (incomeFrequency) {
    case 'daily':
      daily = input;
      weekly = daily * 7;
      monthly = daily * 30;
      yearly = daily * 365;
      break;
    case 'weekly':
      weekly = input;
      daily = weekly / 7;
      monthly = weekly * 4;
      yearly = weekly * 52;
      break;
    case 'monthly':
      monthly = input;
      daily = monthly / 30;
      weekly = monthly / 4;
      yearly = monthly * 12;
      break;
    case 'yearly':
      yearly = input;
      monthly = yearly / 12;
      weekly = yearly / 52;
      daily = yearly / 365;
      break;
  }

  let currentIncome = input;
  let totalExpenses = calculateTotalExpenses();
  let currentExpenses = totalExpenses;

  const balance = currentIncome - currentExpenses;

  totalIncomeDisplay.textContent = currentIncome.toFixed(2);
  totalExpensesDisplay.textContent = currentExpenses.toFixed(2);
  balanceDisplay.textContent = balance.toFixed(2);

  budgetChart.data.datasets[0].data = [currentIncome, currentExpenses, balance];
  budgetChart.update();

  summaryTitle.textContent = `Summary (${capitalize(incomeFrequency)} View)`;

  dailyIncomeDisplay.textContent = daily.toFixed(2);
  weeklyIncomeDisplay.textContent = weekly.toFixed(2);
  monthlyIncomeDisplay.textContent = monthly.toFixed(2);
  yearlyIncomeDisplay.textContent = yearly.toFixed(2);

  renderExpenses();
}

incomeInput.addEventListener('input', updateChartAndSummary);
frequencySelect.addEventListener('change', () => {
  incomeFrequency = frequencySelect.value;
  updateChartAndSummary();
});

addExpenseBtn.addEventListener('click', () => {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  if (!name || isNaN(amount) || amount <= 0) {
    alert("Enter a valid expense name and amount.");
    return;
  }

  expenses.push({ name, amount });
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
  updateChartAndSummary();
});