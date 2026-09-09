/**
 * SpendWise - Digital Expense Manager
 * Simple, Clean Vanilla JavaScript for TAE-1 Project Based Learning
 */

// ================= CATEGORIES & SAMPLE DATA =================
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#f43f5e' },
  { id: 'housing', name: 'Rent & Housing', color: '#8b5cf6' },
  { id: 'transport', name: 'Transport & Travel', color: '#06b6d4' },
  { id: 'utilities', name: 'Bills & Utilities', color: '#f59e0b' },
  { id: 'shopping', name: 'Shopping & Gear', color: '#ec4899' },
  { id: 'education', name: 'Education & Books', color: '#3b82f6' },
  { id: 'other_exp', name: 'Other Expenses', color: '#71717a' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary & Stipend', color: '#10b981' },
  { id: 'freelance', name: 'Freelance & Gigs', color: '#06b6d4' },
  { id: 'allowance', name: 'Pocket Allowance', color: '#8b5cf6' },
  { id: 'invest', name: 'Investment / Returns', color: '#6366f1' },
  { id: 'other_inc', name: 'Other Income', color: '#71717a' },
];

const SAMPLE_TRANSACTIONS = [
  { id: 't1', title: 'Monthly Stipend', type: 'income', amount: 35000, category: 'salary', method: 'Bank Transfer', date: '2026-09-01', notes: 'College internship stipend' },
  { id: 't2', title: 'Hostel / Room Rent', type: 'expense', amount: 9500, category: 'housing', method: 'UPI / Online', date: '2026-09-02', notes: 'Monthly rent' },
  { id: 't3', title: 'Grocery Restock', type: 'expense', amount: 3200, category: 'food', method: 'UPI / Online', date: '2026-09-03', notes: 'Supermarket' },
  { id: 't4', title: 'Freelance Design Task', type: 'income', amount: 12000, category: 'freelance', method: 'UPI / Online', date: '2026-09-04', notes: 'Logo design project' },
  { id: 't5', title: 'Wi-Fi & Mobile Recharge', type: 'expense', amount: 1299, category: 'utilities', method: 'UPI / Online', date: '2026-09-05', notes: 'Fiber broadband' },
  { id: 't6', title: 'Reference Books', type: 'expense', amount: 1850, category: 'education', method: 'Card', date: '2026-09-06', notes: 'Web Tech textbooks' },
  { id: 't7', title: 'Cafe & Dining Out', type: 'expense', amount: 1450, category: 'food', method: 'Cash', date: '2026-09-07', notes: 'Weekend with friends' },
  { id: 't8', title: 'Metro Smart Card', type: 'expense', amount: 800, category: 'transport', method: 'UPI / Online', date: '2026-09-08', notes: 'Commute' }
];

// ================= APP STATE =================
let transactions = [];
let monthlyBudget = 40000;
let chartViewMode = 'bar'; // 'bar' | 'line'
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

let cashflowChart = null;
let doughnutChart = null;

// ================= AUTHENTICATION =================
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('spendwise_user'));
  const authScreen = document.getElementById('authScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');

  if (user && user.isLoggedIn) {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    document.getElementById('userProfileName').textContent = user.name || 'Prajwal Prajapati';
    document.getElementById('userProfileEmail').textContent = `(${user.email || 'prajwal@gmail.com'})`;
  } else {
    authScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
  }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('loginUsername').value.trim() || 'Prajwal Prajapati';
  const email = document.getElementById('loginEmail').value.trim() || 'prajwal@gmail.com';
  
  localStorage.setItem('spendwise_user', JSON.stringify({
    name: name,
    email: email,
    isLoggedIn: true
  }));

  showToast(`Welcome, ${name}!`, 'success');
  checkAuth();
  refreshUI();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('spendwise_user');
  showToast('Logged out successfully', 'info');
  checkAuth();
});

// ================= LOCAL STORAGE HELPERS =================
function loadData() {
  const savedTx = localStorage.getItem('spendwise_transactions');
  const savedBudget = localStorage.getItem('spendwise_budget');

  transactions = savedTx ? JSON.parse(savedTx) : [...SAMPLE_TRANSACTIONS];
  monthlyBudget = savedBudget ? parseFloat(savedBudget) : 40000;

  if (!savedTx) saveTransactions();
}

function saveTransactions() {
  localStorage.setItem('spendwise_transactions', JSON.stringify(transactions));
}

function formatINR(num) {
  return '₹' + Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getCategory(id, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.find(c => c.id === id) || { id, name: id, color: '#71717a' };
}

// ================= THEME TOGGLE =================
function initTheme() {
  const theme = localStorage.getItem('spendwise_theme') || 'dark';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('spendwise_theme', isDark ? 'dark' : 'light');
    showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
    renderCharts();
  });
}

// ================= BALANCER & SUMMARY CARDS =================
function updateSummaryAndBalancer() {
  const incomeTx = transactions.filter(t => t.type === 'income');
  const expenseTx = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTx.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = expenseTx.reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  // Stat numbers
  document.getElementById('netBalanceDisplay').textContent = formatINR(netBalance);
  document.getElementById('totalIncomeDisplay').textContent = formatINR(totalIncome);
  document.getElementById('totalExpenseDisplay').textContent = formatINR(totalExpense);
  document.getElementById('transactionCountBadge').textContent = transactions.length;
  document.getElementById('headerBudgetCap').textContent = formatINR(monthlyBudget);

  document.getElementById('incomeSubtext').textContent = `${incomeTx.length} deposits logged`;
  document.getElementById('expenseSubtext').textContent = `${expenseTx.length} spendings logged`;

  // Savings rate
  const savingsPct = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;
  const savingsBadge = document.getElementById('savingsRateBadge');
  savingsBadge.textContent = `${savingsPct}% Saved`;

  // --- Visual Balancer Flow Bar ---
  const totalFlow = totalIncome + totalExpense;
  let incomeRatio = 50;
  let expenseRatio = 50;

  if (totalFlow > 0) {
    incomeRatio = Math.round((totalIncome / totalFlow) * 100);
    expenseRatio = 100 - incomeRatio;
  }

  document.getElementById('inflowPercentage').textContent = `${incomeRatio}%`;
  document.getElementById('outflowPercentage').textContent = `${expenseRatio}%`;

  const barIncome = document.getElementById('ratioIncomeBar');
  const barExpense = document.getElementById('ratioExpenseBar');
  
  barIncome.style.width = `${incomeRatio}%`;
  barExpense.style.width = `${expenseRatio}%`;
  barIncome.textContent = incomeRatio > 12 ? `${incomeRatio}%` : '';
  barExpense.textContent = expenseRatio > 12 ? `${expenseRatio}%` : '';

  // Financial Health Status
  const healthLabel = document.getElementById('financialHealthLabel');
  const liveDot = document.getElementById('liveStatusDot');

  if (totalFlow === 0) {
    healthLabel.textContent = 'No Activity';
    healthLabel.className = 'text-center font-semibold text-zinc-500 text-[11px]';
    liveDot.className = 'w-2 h-2 rounded-full bg-zinc-500';
  } else if (netBalance > (totalIncome * 0.3)) {
    healthLabel.textContent = 'Surplus (Healthy)';
    healthLabel.className = 'text-center font-semibold text-emerald-500 text-[11px]';
    liveDot.className = 'w-2 h-2 rounded-full bg-emerald-500';
  } else if (netBalance >= 0) {
    healthLabel.textContent = 'Balanced Flow';
    healthLabel.className = 'text-center font-semibold text-indigo-400 text-[11px]';
    liveDot.className = 'w-2 h-2 rounded-full bg-indigo-500';
  } else {
    healthLabel.textContent = 'Deficit (Overspending)';
    healthLabel.className = 'text-center font-semibold text-rose-500 text-[11px]';
    liveDot.className = 'w-2 h-2 rounded-full bg-rose-500 animate-pulse';
  }

  // Budget Tracker
  const budgetUsedPct = Math.min(100, Math.round((totalExpense / monthlyBudget) * 100));
  const budgetRem = Math.max(0, monthlyBudget - totalExpense);
  document.getElementById('budgetSpentText').textContent = `Budget: ${budgetUsedPct}% used (${formatINR(totalExpense)} / ${formatINR(monthlyBudget)})`;
  document.getElementById('budgetRemainingText').textContent = `Remaining: ${formatINR(budgetRem)}`;

  // Top Spend Category
  const catMap = {};
  expenseTx.forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
  });

  let topCat = '-';
  let topAmt = 0;
  for (const [k, v] of Object.entries(catMap)) {
    if (v > topAmt) {
      topAmt = v;
      topCat = k;
    }
  }

  if (topAmt > 0) {
    document.getElementById('topExpenseCategory').textContent = getCategory(topCat, 'expense').name;
    document.getElementById('topCategoryAmount').textContent = `${formatINR(topAmt)} spent`;
  } else {
    document.getElementById('topExpenseCategory').textContent = 'None';
    document.getElementById('topCategoryAmount').textContent = '₹0.00 spent';
  }

  // Avg Transaction
  if (transactions.length > 0) {
    document.getElementById('avgTransactionDisplay').textContent = formatINR(totalFlow / transactions.length);
  } else {
    document.getElementById('avgTransactionDisplay').textContent = '₹0.00';
  }
}

// ================= CHARTS ENGINE =================
function renderCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#a1a1aa' : '#52525b';
  const gridColor = isDark ? 'rgba(63, 63, 70, 0.4)' : 'rgba(228, 228, 231, 0.9)';

  // --- 1. TIMELINE & TREND CHART ---
  // Group by Date for crisp, multi-point continuous trends
  const dateMap = {};
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(t => {
    const d = t.date || '2026-09-01';
    if (!dateMap[d]) {
      dateMap[d] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dateMap[d].income += Number(t.amount);
    } else {
      dateMap[d].expense += Number(t.amount);
    }
  });

  let dateLabels = Object.keys(dateMap);
  if (dateLabels.length === 0) {
    dateLabels = ['2026-09-01', '2026-09-02'];
    dateMap['2026-09-01'] = { income: 0, expense: 0 };
    dateMap['2026-09-02'] = { income: 0, expense: 0 };
  }

  // Format date labels (e.g. "1 Sep", "2 Sep")
  const displayLabels = dateLabels.map(d => {
    const parts = d.split('-');
    if (parts.length === 3) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return d;
  });

  const incomeData = dateLabels.map(d => dateMap[d].income);
  const expenseData = dateLabels.map(d => dateMap[d].expense);

  if (cashflowChart) cashflowChart.destroy();

  const ctxCashflow = document.getElementById('cashflowChart').getContext('2d');
  cashflowChart = new Chart(ctxCashflow, {
    type: chartViewMode === 'bar' ? 'bar' : 'line',
    data: {
      labels: displayLabels,
      datasets: [
        {
          label: 'Income Inflow (₹)',
          data: incomeData,
          backgroundColor: chartViewMode === 'bar' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6,
          maxBarThickness: 36,
          tension: 0.35,
          fill: chartViewMode === 'line',
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#10b981'
        },
        {
          label: 'Expense Outflow (₹)',
          data: expenseData,
          backgroundColor: chartViewMode === 'bar' ? '#f43f5e' : 'rgba(244, 63, 94, 0.15)',
          borderColor: '#f43f5e',
          borderWidth: 2,
          borderRadius: 6,
          maxBarThickness: 36,
          tension: 0.35,
          fill: chartViewMode === 'line',
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#f43f5e'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: { size: 11, family: '"Plus Jakarta Sans", sans-serif' },
            boxWidth: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatINR(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 10 },
            callback: (val) => '₹' + val.toLocaleString('en-IN')
          }
        }
      }
    }
  });

  // --- 2. EXPENSE DOUGHNUT CHART ---
  const expenseTx = transactions.filter(t => t.type === 'expense');
  const catTotals = {};
  let totalExpenseAmt = 0;

  expenseTx.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
    totalExpenseAmt += Number(t.amount);
  });

  const catKeys = Object.keys(catTotals);
  let dLabels = [];
  let dData = [];
  let dColors = [];

  if (catKeys.length === 0) {
    dLabels = ['No Expenses'];
    dData = [1];
    dColors = [isDark ? '#27272a' : '#e4e4e7'];
  } else {
    catKeys.forEach(k => {
      const c = getCategory(k, 'expense');
      dLabels.push(c.name);
      dData.push(catTotals[k]);
      dColors.push(c.color);
    });
  }

  if (doughnutChart) doughnutChart.destroy();

  const ctxDoughnut = document.getElementById('categoryDoughnutChart').getContext('2d');
  doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: dLabels,
      datasets: [{
        data: dData,
        backgroundColor: dColors,
        borderColor: isDark ? '#0f0f11' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (catKeys.length === 0) return 'No expenses logged';
              const val = ctx.raw;
              const pct = totalExpenseAmt > 0 ? Math.round((val / totalExpenseAmt) * 100) : 0;
              return `${ctx.label}: ${formatINR(val)} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  // Category legend list
  const legendBox = document.getElementById('categoryLegendContainer');
  if (catKeys.length === 0) {
    legendBox.innerHTML = '<div class="col-span-2 text-center text-zinc-400 py-1">No expenses recorded</div>';
  } else {
    legendBox.innerHTML = catKeys.map(k => {
      const c = getCategory(k, 'expense');
      const amt = catTotals[k];
      const pct = totalExpenseAmt > 0 ? Math.round((amt / totalExpenseAmt) * 100) : 0;
      return `
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-brand-950 border border-zinc-200/60 dark:border-zinc-800">
          <div class="flex items-center gap-1.5 truncate">
            <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${c.color}"></span>
            <span class="truncate text-[11px] font-medium text-zinc-700 dark:text-zinc-300">${c.name}</span>
          </div>
          <span class="font-mono text-[10px] text-zinc-400 shrink-0">${pct}%</span>
        </div>
      `;
    }).join('');
  }
}

// ================= LEDGER TABLE & FILTER =================
function renderTable() {
  const query = document.getElementById('searchTransactions').value.toLowerCase().trim();
  const filterType = document.getElementById('filterType').value;
  const filterCat = document.getElementById('filterCategory').value;
  const sortBy = document.getElementById('sortBy').value;

  let filtered = transactions.filter(t => {
    const matchQ = t.title.toLowerCase().includes(query) || (t.notes && t.notes.toLowerCase().includes(query));
    const matchT = filterType === 'all' || t.type === filterType;
    const matchC = filterCat === 'all' || t.category === filterCat;
    return matchQ && matchT && matchC;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
    if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

  const tbody = document.getElementById('transactionTableBody');
  const emptyState = document.getElementById('emptyStateContainer');

  if (total === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    document.getElementById('showingRecordsText').textContent = 'Showing 0 entries';
  } else {
    emptyState.classList.add('hidden');
    document.getElementById('showingRecordsText').textContent = `Showing ${start + 1} to ${Math.min(start + ITEMS_PER_PAGE, total)} of ${total} entries`;

    tbody.innerHTML = paged.map(t => {
      const isInc = t.type === 'income';
      const cat = getCategory(t.category, t.type);

      return `
        <tr class="hover:bg-zinc-50 dark:hover:bg-brand-900/60 transition-colors">
          <td class="py-3 px-4 sm:px-6 whitespace-nowrap font-mono text-zinc-500 dark:text-zinc-400">${t.date || '-'}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-zinc-900 dark:text-zinc-100">${t.title}</div>
            ${t.notes ? `<div class="text-[11px] text-zinc-400">${t.notes}</div>` : ''}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium" style="background-color: ${cat.color}20; color: ${cat.color};">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${cat.color}"></span>
              ${cat.name}
            </span>
          </td>
          <td class="py-3 px-4 whitespace-nowrap text-zinc-400">${t.method || 'General'}</td>
          <td class="py-3 px-4 text-right whitespace-nowrap font-mono font-bold ${isInc ? 'text-emerald-500' : 'text-rose-500'}">
            ${isInc ? '+' : '-'}${formatINR(t.amount)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-1">
              <button onclick="editTransaction('${t.id}')" class="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-brand-800 text-zinc-400 hover:text-zinc-200">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="deleteTransaction('${t.id}')" class="p-1 rounded-lg hover:bg-rose-950/40 text-rose-500">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Pagination controls
  document.getElementById('pageIndicator').textContent = `${currentPage} / ${totalPages}`;
  document.getElementById('prevPageBtn').disabled = currentPage <= 1;
  document.getElementById('nextPageBtn').disabled = currentPage >= totalPages;

  lucide.createIcons();
}

// ================= TRANSACTION MODAL (ADD & EDIT) =================
function populateCategorySelect(type) {
  const select = document.getElementById('entryCategory');
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  select.innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function populateFilterCategories() {
  const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const unique = Array.from(new Set(allCats.map(c => c.id))).map(id => allCats.find(c => c.id === id));
  document.getElementById('filterCategory').innerHTML = '<option value="all">All Categories</option>' +
    unique.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function setModalType(type) {
  document.getElementById('entryType').value = type;
  const expBtn = document.getElementById('typeExpenseBtn');
  const incBtn = document.getElementById('typeIncomeBtn');
  const titleBox = document.getElementById('titleFieldContainer');

  if (type === 'income') {
    incBtn.className = 'py-2 rounded-xl font-bold bg-emerald-500 text-white transition-all';
    expBtn.className = 'py-2 rounded-xl font-bold bg-zinc-100 dark:bg-brand-950 text-zinc-500 transition-all';
    if (titleBox) titleBox.classList.add('hidden');
    populateCategorySelect('income');
  } else {
    expBtn.className = 'py-2 rounded-xl font-bold bg-rose-500 text-white transition-all';
    incBtn.className = 'py-2 rounded-xl font-bold bg-zinc-100 dark:bg-brand-950 text-zinc-500 transition-all';
    if (titleBox) titleBox.classList.remove('hidden');
    populateCategorySelect('expense');
  }
}

function openModal(editId = null) {
  document.getElementById('transactionForm').reset();
  const modal = document.getElementById('transactionModal');

  if (editId) {
    const tx = transactions.find(t => t.id === editId);
    if (!tx) return;
    document.getElementById('editEntryId').value = tx.id;
    document.getElementById('modalTitle').textContent = 'Edit Entry';
    document.getElementById('entryAmount').value = tx.amount;
    document.getElementById('entryDate').value = tx.date;
    document.getElementById('entryTitle').value = tx.title || '';
    document.getElementById('entryMethod').value = tx.method || 'UPI / Online';
    document.getElementById('entryNotes').value = tx.notes || '';
    setModalType(tx.type);
    document.getElementById('entryCategory').value = tx.category;
  } else {
    document.getElementById('editEntryId').value = '';
    document.getElementById('modalTitle').textContent = 'New Entry';
    setModalType('expense');
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('transactionModal').classList.add('hidden');
}

window.editTransaction = function(id) {
  openModal(id);
};

window.deleteTransaction = function(id) {
  if (confirm('Delete this transaction record?')) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    refreshUI();
    showToast('Transaction deleted', 'info');
  }
};

document.getElementById('transactionForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const editId = document.getElementById('editEntryId').value;
  const type = document.getElementById('entryType').value;
  const amount = parseFloat(document.getElementById('entryAmount').value);
  const date = document.getElementById('entryDate').value;
  const rawTitle = document.getElementById('entryTitle').value.trim();
  const category = document.getElementById('entryCategory').value;
  const method = document.getElementById('entryMethod').value;
  const notes = document.getElementById('entryNotes').value.trim();

  // If income or empty title, use category source name
  const title = (type === 'income' || !rawTitle) ? getCategory(category, type).name : rawTitle;

  if (editId) {
    const idx = transactions.findIndex(t => t.id === editId);
    if (idx !== -1) {
      transactions[idx] = { ...transactions[idx], type, amount, date, title, category, method, notes };
      showToast('Transaction updated', 'success');
    }
  } else {
    transactions.unshift({
      id: 't-' + Date.now(),
      type,
      amount,
      date,
      title,
      category,
      method,
      notes
    });
    showToast(`${type === 'income' ? 'Income' : 'Expense'} saved`, 'success');
  }

  saveTransactions();
  closeModal();
  refreshUI();
});

// ================= TOAST NOTIFICATION =================
function showToast(msg, type = 'info') {
  const box = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const color = type === 'success' ? 'border-emerald-500' : (type === 'error' ? 'border-rose-500' : 'border-zinc-700');
  
  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-brand-900 border ${color} shadow-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 pointer-events-auto`;
  toast.textContent = msg;
  box.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ================= UI REFRESH =================
function refreshUI() {
  updateSummaryAndBalancer();
  renderCharts();
  renderTable();
}

// ================= EVENT HANDLERS =================
function setupEvents() {
  // Modal buttons
  document.getElementById('openAddModalBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  document.getElementById('typeExpenseBtn').addEventListener('click', () => setModalType('expense'));
  document.getElementById('typeIncomeBtn').addEventListener('click', () => setModalType('income'));

  // Chart view switcher
  document.getElementById('chartViewBar').addEventListener('click', () => {
    chartViewMode = 'bar';
    document.getElementById('chartViewBar').className = 'px-3 py-1 rounded-lg font-medium text-xs bg-white dark:bg-brand-800 text-zinc-900 dark:text-white shadow-xs transition-all';
    document.getElementById('chartViewLine').className = 'px-3 py-1 rounded-lg font-medium text-xs text-zinc-400 hover:text-white transition-all';
    renderCharts();
  });

  document.getElementById('chartViewLine').addEventListener('click', () => {
    chartViewMode = 'line';
    document.getElementById('chartViewLine').className = 'px-3 py-1 rounded-lg font-medium text-xs bg-white dark:bg-brand-800 text-zinc-900 dark:text-white shadow-xs transition-all';
    document.getElementById('chartViewBar').className = 'px-3 py-1 rounded-lg font-medium text-xs text-zinc-400 hover:text-white transition-all';
    renderCharts();
  });

  // Table filters & Search
  document.getElementById('searchTransactions').addEventListener('input', () => { currentPage = 1; renderTable(); });
  document.getElementById('filterType').addEventListener('change', () => { currentPage = 1; renderTable(); });
  document.getElementById('filterCategory').addEventListener('change', () => { currentPage = 1; renderTable(); });
  document.getElementById('sortBy').addEventListener('change', () => renderTable());

  // Pagination
  document.getElementById('prevPageBtn').addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  document.getElementById('nextPageBtn').addEventListener('click', () => { currentPage++; renderTable(); });

  // Quick Options Dropdown
  const optBtn = document.getElementById('quickOptionsBtn');
  const optMenu = document.getElementById('optionsDropdown');
  optBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    optMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!optMenu.contains(e.target) && e.target !== optBtn) optMenu.classList.add('hidden');
  });

  // Budget Modal
  document.getElementById('setBudgetBtn').addEventListener('click', () => {
    optMenu.classList.add('hidden');
    document.getElementById('monthlyBudgetInput').value = monthlyBudget;
    document.getElementById('budgetModal').classList.remove('hidden');
  });
  document.getElementById('cancelBudgetBtn').addEventListener('click', () => document.getElementById('budgetModal').classList.add('hidden'));
  document.getElementById('saveBudgetBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('monthlyBudgetInput').value);
    if (val > 0) {
      monthlyBudget = val;
      localStorage.setItem('spendwise_budget', val.toString());
      document.getElementById('budgetModal').classList.add('hidden');
      refreshUI();
      showToast(`Monthly budget set to ${formatINR(val)}`, 'success');
    }
  });

  // Export CSV & Reset
  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    optMenu.classList.add('hidden');
    const headers = ['ID,Date,Type,Title,Category,Payment Method,Amount,Notes'];
    const rows = transactions.map(t => `${t.id},${t.date},${t.type},"${t.title}",${t.category},${t.method || 'General'},${t.amount},"${t.notes || ''}"`);
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `SpendWise_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('CSV downloaded', 'success');
  });

  document.getElementById('exportJsonBtn').addEventListener('click', () => {
    optMenu.classList.add('hidden');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ monthlyBudget, transactions }, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `SpendWise_Backup.json`;
    link.click();
    showToast('JSON backup downloaded', 'success');
  });

  document.getElementById('loadDemoDataBtn').addEventListener('click', () => {
    optMenu.classList.add('hidden');
    if (confirm('Reset to default sample data?')) {
      transactions = [...SAMPLE_TRANSACTIONS];
      monthlyBudget = 40000;
      saveTransactions();
      refreshUI();
      showToast('Sample demo loaded', 'info');
    }
  });

  document.getElementById('clearAllDataBtn').addEventListener('click', () => {
    optMenu.classList.add('hidden');
    if (confirm('Clear ALL transactions?')) {
      transactions = [];
      saveTransactions();
      refreshUI();
      showToast('All records cleared', 'error');
    }
  });
}

// ================= APP INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  populateCategorySelect('expense');
  populateFilterCategories();
  setupEvents();
  checkAuth();
  refreshUI();
  lucide.createIcons();
});
