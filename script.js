// Constants and Defaults
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// State variables (100% Backward Compatible with localStorage schemas)
let initialBalances = { "THB": 0 };
let transactions = [];
let lastLoginDate = null;
let googleSheetUrl = "";
let currentTab = "dashboard";
let pendingDeleteIds = [];
let selectedTxIds = new Set();
let visiblePageTxIds = [];

// Pagination State (Tracker: 11 items/page, Daily Breakdown: 5 days/page)
let currentPage = 1;
const ITEMS_PER_PAGE = 11;

let currentDailyPage = 1;
const DAILY_ITEMS_PER_PAGE = 5;

// DOM Elements
const dateDisplay = document.getElementById('current-date');
const monthFilterSelect = document.getElementById('month-filter-select');
const grandTotalList = document.getElementById('grand-total-list');
const dateInput = document.getElementById('date-input');
const amountInput = document.getElementById('amount-input');
const currencySelect = document.getElementById('currency-select');
const descInput = document.getElementById('desc-input');
const submitIncomeBtn = document.getElementById('submit-income-btn');
const submitExpenseBtn = document.getElementById('submit-expense-btn');
const searchInput = document.getElementById('search-input');

const summaryIncomeLabel = document.getElementById('summary-income-label');
const summaryExpenseLabel = document.getElementById('summary-expense-label');
const summaryNetLabel = document.getElementById('summary-net-label');
const todayIncomeDisplay = document.getElementById('today-income');
const todayExpenseDisplay = document.getElementById('today-expense');
const todayNetDisplay = document.getElementById('today-net');
const transactionList = document.getElementById('transaction-list');
const copyBtn = document.getElementById('copy-btn');

// Pagination Elements
const paginationInfo = document.getElementById('pagination-info');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const pageNumberDisplay = document.getElementById('page-number-display');

// Views & Navigation Elements
const viewTracker = document.getElementById('view-tracker');
const viewDashboard = document.getElementById('view-dashboard');
const tabBtnTracker = document.getElementById('tab-btn-tracker');
const tabBtnDashboard = document.getElementById('tab-btn-dashboard');

// Mobile Sidebar Elements
const appSidebar = document.getElementById('app-sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Dashboard Elements
const dashBalances = document.getElementById('dash-balances');
const dashDailyBreakdown = document.getElementById('dash-daily-breakdown');
const dashTodayStats = document.getElementById('dash-today-stats');
const dashChartsContainer = document.getElementById('dash-charts-container');
const dashActivityStats = document.getElementById('dash-activity-stats');
const toastContainer = document.getElementById('toast-container');

// Delete Confirmation Modal Elements
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const deleteModalTitle = document.getElementById('delete-modal-title');
const deleteModalMsg = document.getElementById('delete-modal-msg');
const deleteConfirmInput = document.getElementById('delete-confirm-input');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');
const selectedCountDisplay = document.getElementById('selected-count');
const selectAllTxCheckbox = document.getElementById('select-all-tx-checkbox');

// Clear All Data Confirmation Modal Elements
const confirmClearModal = document.getElementById('confirm-clear-modal');
const cancelClearBtn = document.getElementById('cancel-clear-btn');
const confirmClearBtn = document.getElementById('confirm-clear-btn');
const clearConfirmInput = document.getElementById('clear-confirm-input');

// Modal Elements - Edit Transaction
const editTxModal = document.getElementById('edit-tx-modal');
const editTxId = document.getElementById('edit-tx-id');
const editTxDate = document.getElementById('edit-tx-date');
const editTxAmount = document.getElementById('edit-tx-amount');
const editTxType = document.getElementById('edit-tx-type');
const editTxCurr = document.getElementById('edit-tx-curr');
const editTxDesc = document.getElementById('edit-tx-desc');
const cancelEditTxBtn = document.getElementById('cancel-edit-tx-btn');
const saveEditTxBtn = document.getElementById('save-edit-tx-btn');

// Modal Elements - Initial Balances
const editBalanceBtn = document.getElementById('edit-balance-btn');
const balanceModal = document.getElementById('balance-modal');
const balanceInputsContainer = document.getElementById('balance-inputs-container');
const addCurrencyBtn = document.getElementById('add-currency-btn');
const cancelBalanceBtn = document.getElementById('cancel-balance-btn');
const saveBalanceBtn = document.getElementById('save-balance-btn');

// Modal Elements - Google Sheets
const sheetsBtn = document.getElementById('sheets-btn');
const sheetsModal = document.getElementById('sheets-modal');
const sheetsUrlInput = document.getElementById('sheets-url-input');
const sheetsStatusDot = document.getElementById('sheets-status-dot');
const cloudStatus = document.getElementById('cloud-status');
const syncAllBtn = document.getElementById('sync-all-btn');
const importSheetsBtn = document.getElementById('import-sheets-btn');
const cancelSheetsBtn = document.getElementById('cancel-sheets-btn');
const saveSheetsBtn = document.getElementById('save-sheets-btn');
const clearDataBtn = document.getElementById('clear-data-btn');

// Modal Elements - Sheets Modal Tabs & Direct Paste
const modalTabCloud = document.getElementById('modal-tab-cloud');
const modalTabPaste = document.getElementById('modal-tab-paste');
const modalTabCode = document.getElementById('modal-tab-code');
const tabContentCloud = document.getElementById('tab-content-cloud');
const tabContentPaste = document.getElementById('tab-content-paste');
const tabContentCode = document.getElementById('tab-content-code');
const pasteImportInput = document.getElementById('paste-import-input');
const pasteImportBtn = document.getElementById('paste-import-btn');
const copyScriptCodeBtn = document.getElementById('copy-script-code-btn');
const scriptCodeSnippet = document.getElementById('script-code-snippet');

// Initialization
function init() {
  loadData();
  checkMissingDays();
  renderDate();
  if (dateInput) dateInput.value = getTodayDateString();
  updateUI();
  setupEventListeners();
  registerServiceWorker();

  // Auto clock check every 1 minute
  setInterval(() => {
    renderDate();
    const todayStr = getTodayDateString();
    if (lastLoginDate !== todayStr) {
      if (dateInput) dateInput.value = todayStr;
      checkMissingDays();
      updateUI();
    }
  }, 60000);
}

function clearAllData() {
  transactions = [];
  initialBalances = { "THB": 0 };
  localStorage.removeItem('tracker_transactions');
  localStorage.removeItem('tracker_initialBalances');
  localStorage.removeItem('tracker_lastLoginDate');
  localStorage.setItem('tracker_isSeeded', 'true');
  saveData();
  currentPage = 1;
  currentDailyPage = 1;
  updateUI();
  if (confirmClearModal) confirmClearModal.classList.add('hidden');
  showToast("ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว", "info");
}

function loadData() {
  const savedInitial = JSON.parse(localStorage.getItem('tracker_initialBalances'));
  if (savedInitial && Object.keys(savedInitial).length > 0) {
    initialBalances = savedInitial;
  } else {
    initialBalances = { "THB": 0 };
  }
  
  const savedTransactions = JSON.parse(localStorage.getItem('tracker_transactions'));
  transactions = savedTransactions || [];
  lastLoginDate = localStorage.getItem('tracker_lastLoginDate');
  googleSheetUrl = localStorage.getItem('tracker_googleSheetUrl') || "";
}

function saveData() {
  localStorage.setItem('tracker_initialBalances', JSON.stringify(initialBalances));
  localStorage.setItem('tracker_transactions', JSON.stringify(transactions));
  localStorage.setItem('tracker_lastLoginDate', getTodayDateString());
  localStorage.setItem('tracker_googleSheetUrl', googleSheetUrl);
}

// Custom Toast Alerts
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '⚡';
  if (type === 'info') icon = '📋';
  if (type === 'error') icon = '⚠️';
  
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Balance Calculation
function getBalances() {
  let bals = { ...initialBalances };
  transactions.forEach(tx => {
    if (!tx.isDummy) {
      if (bals[tx.currency] === undefined) bals[tx.currency] = 0;
      if (tx.type === 'income') bals[tx.currency] += tx.amount;
      else bals[tx.currency] -= tx.amount;
    }
  });
  return bals;
}

// Smart Auto-Reset (Missing Days)
function checkMissingDays() {
  const todayStr = getTodayDateString();
  if (lastLoginDate && lastLoginDate !== todayStr) {
    let lastDate = new Date(lastLoginDate + 'T00:00:00');
    const todayDate = new Date(todayStr + 'T00:00:00');
    
    lastDate.setDate(lastDate.getDate() + 1);
    while (lastDate < todayDate) {
      const year = lastDate.getFullYear();
      const month = String(lastDate.getMonth() + 1).padStart(2, '0');
      const day = String(lastDate.getDate()).padStart(2, '0');
      const missingDateStr = `${year}-${month}-${day}`;

      const alreadyHasTx = transactions.some(tx => tx.date === missingDateStr);
      if (!alreadyHasTx) {
        const dummyTx = {
          id: generateId(),
          date: missingDateStr,
          timestamp: lastDate.getTime(),
          type: 'income',
          currency: 'THB',
          tag: 'NO_DATA',
          amount: 0,
          isDummy: true
        };
        transactions.push(dummyTx);
      }
      lastDate.setDate(lastDate.getDate() + 1);
    }
    saveData();
  }
  
  if (lastLoginDate !== todayStr) {
    lastLoginDate = todayStr;
    localStorage.setItem('tracker_lastLoginDate', lastLoginDate);
  }
}

// Helpers
function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function getYearMonthLabel(ymStr) {
  if (ymStr === "ALL") return "แสดงทุกเดือน (All Time)";
  const parts = ymStr.split('-');
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${THAI_MONTHS[monthIdx]} ${year}`;
}

// Bulletproof Long-Term Google Sheets Sync
function sendToGoogleSheets(data) {
  if (!googleSheetUrl || !googleSheetUrl.includes("script.google.com")) return;
  cloudStatus.textContent = "Syncing to Google Sheets...";
  
  if (data.action === 'add' && data.transaction) {
    const tx = data.transaction;
    const currentBals = getBalances();
    const balance = currentBals[tx.currency] || 0;
    
    const params = new URLSearchParams({
      action: 'add',
      amount: tx.amount,
      currency: tx.currency,
      type: tx.type,
      tag: tx.tag || '',
      date: tx.date,
      timestamp: tx.timestamp,
      balance: balance,
      _t: Date.now()
    });
    
    const img = new Image();
    img.src = `${googleSheetUrl}?${params.toString()}`;
    img.onload = img.onerror = () => {
      cloudStatus.textContent = "Synced to Google Sheets";
    };
  } 
  else if (data.action === 'sync_all') {
    let runningBals = { ...initialBalances };
    const validTxs = transactions.filter(t => !t.isDummy).sort((a, b) => a.timestamp - b.timestamp);
    
    const payloadTxs = validTxs.map(tx => {
      if (runningBals[tx.currency] === undefined) runningBals[tx.currency] = 0;
      if (tx.type === 'income') runningBals[tx.currency] += tx.amount;
      else runningBals[tx.currency] -= tx.amount;
      return {
        ...tx,
        runningBalance: runningBals[tx.currency]
      };
    });

    const CHUNK_SIZE = 30;
    const totalChunks = Math.max(1, Math.ceil(payloadTxs.length / CHUNK_SIZE));

    let completedChunks = 0;
    if (payloadTxs.length === 0) {
      const params = new URLSearchParams({
        action: 'sync_chunk',
        is_first: '1',
        payload: JSON.stringify([]),
        _t: Date.now()
      });
      const img = new Image();
      img.src = `${googleSheetUrl}?${params.toString()}`;
      img.onload = img.onerror = () => {
        cloudStatus.textContent = "Synced to Google Sheets";
      };
      return;
    }

    for (let i = 0; i < payloadTxs.length; i += CHUNK_SIZE) {
      const chunk = payloadTxs.slice(i, i + CHUNK_SIZE);
      const isFirst = (i === 0);
      
      const params = new URLSearchParams({
        action: 'sync_chunk',
        is_first: isFirst ? '1' : '0',
        payload: JSON.stringify(chunk),
        _t: Date.now()
      });
      
      const img = new Image();
      img.src = `${googleSheetUrl}?${params.toString()}`;
      img.onload = img.onerror = () => {
        completedChunks++;
        if (completedChunks >= totalChunks) {
          cloudStatus.textContent = "Synced to Google Sheets";
        }
      };
    }
  }
}

// Rendering
function renderDate() {
  const d = new Date();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  dateDisplay.textContent = d.toLocaleDateString('en-US', options);
}

function updateMonthFilterOptions() {
  const currentSelected = monthFilterSelect.value;
  monthFilterSelect.innerHTML = '';
  
  const currentYM = getTodayDateString().slice(0, 7);
  const activeYMSet = new Set([currentYM]);
  
  transactions.forEach(tx => {
    if (!tx.isDummy && tx.date) {
      activeYMSet.add(tx.date.slice(0, 7));
    }
  });
  
  const sortedYM = Array.from(activeYMSet).sort().reverse();

  // "ALL" Option (แสดงทุกเดือน / All Time)
  const allOpt = document.createElement('option');
  allOpt.value = "ALL";
  allOpt.textContent = getYearMonthLabel("ALL");
  monthFilterSelect.appendChild(allOpt);

  sortedYM.forEach(ym => {
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = getYearMonthLabel(ym);
    monthFilterSelect.appendChild(opt);
  });
  
  if (currentSelected && (sortedYM.includes(currentSelected) || currentSelected === "ALL")) {
    monthFilterSelect.value = currentSelected;
  } else {
    // Default to "ALL" (Show All-Time Months by Default)
    monthFilterSelect.value = "ALL";
  }
}

function updateCurrencyDropdown() {
  const currentVal = currencySelect.value;
  currencySelect.innerHTML = '';
  
  // Dynamically collect currencies that exist in initial balances or transactions
  const activeCurrencies = new Set(Object.keys(initialBalances));
  
  transactions.forEach(tx => {
    if (!tx.isDummy && tx.currency) {
      activeCurrencies.add(tx.currency);
    }
  });
  
  let currencies = Array.from(activeCurrencies);
  if (currencies.length === 0) currencies.push("THB");
  
  currencies.sort((a, b) => {
    if (a === 'THB') return -1;
    if (b === 'THB') return 1;
    return a.localeCompare(b);
  });
  
  currencies.forEach(curr => {
    const opt = document.createElement('option');
    opt.value = curr;
    opt.textContent = curr;
    currencySelect.appendChild(opt);
  });
  
  if (currencies.includes(currentVal)) {
    currencySelect.value = currentVal;
  }
}

function updateUI() {
  const currentBalances = getBalances();
  
  if (googleSheetUrl && googleSheetUrl.includes("script.google.com")) {
    sheetsStatusDot.className = "status-dot online";
    cloudStatus.textContent = "Synced to Google Sheets";
  } else {
    sheetsStatusDot.className = "status-dot offline";
    cloudStatus.textContent = "Saved to Local Storage";
  }
  
  updateMonthFilterOptions();
  updateCurrencyDropdown();
  
  // Remaining balances
  grandTotalList.innerHTML = '';
  const currencies = Object.keys(currentBalances);
  if (currencies.length === 0) currencies.push("THB");
  
  currencies.forEach(curr => {
    const amount = currentBalances[curr] || 0;
    const chip = document.createElement('div');
    chip.className = 'balance-chip';
    chip.style.cursor = 'pointer';
    chip.title = 'Click to edit initial balances';
    chip.innerHTML = `${formatCurrency(amount)} <span class="currency-tag">${curr}</span> <span style="font-size: 0.7rem; opacity: 0.7;">✏️</span>`;
    chip.addEventListener('click', openBalanceModal);
    grandTotalList.appendChild(chip);
  });
  
  // Filtered Month Txs
  const selectedYM = monthFilterSelect.value || "ALL";
  let filteredTxs = [];
  
  if (selectedYM === "ALL") {
    filteredTxs = transactions.filter(tx => !tx.isDummy);
    summaryIncomeLabel.textContent = "TOTAL INCOME (ALL)";
    summaryExpenseLabel.textContent = "TOTAL EXPENSE (ALL)";
    summaryNetLabel.textContent = "NET TOTAL (ALL)";
  } else {
    filteredTxs = transactions.filter(tx => !tx.isDummy && tx.date.startsWith(selectedYM));
    const ymLabel = getYearMonthLabel(selectedYM);
    summaryIncomeLabel.textContent = `INCOME (${ymLabel})`;
    summaryExpenseLabel.textContent = `EXPENSE (${ymLabel})`;
    summaryNetLabel.textContent = `NET (${ymLabel})`;
  }
  
  // Search Filtering
  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
  if (searchQuery) {
    filteredTxs = filteredTxs.filter(tx => {
      const tagMatch = tx.tag && tx.tag.toLowerCase().includes(searchQuery);
      const amountMatch = tx.amount.toString().includes(searchQuery);
      const currMatch = tx.currency.toLowerCase().includes(searchQuery);
      const dateMatch = tx.date.includes(searchQuery);
      return tagMatch || amountMatch || currMatch || dateMatch;
    });
  }
  
  let incomeByCurr = {};
  let expenseByCurr = {};
  
  filteredTxs.forEach(tx => {
    if (!incomeByCurr[tx.currency]) incomeByCurr[tx.currency] = 0;
    if (!expenseByCurr[tx.currency]) expenseByCurr[tx.currency] = 0;
    
    if (tx.type === 'income') incomeByCurr[tx.currency] += tx.amount;
    else expenseByCurr[tx.currency] += tx.amount;
  });
  
  renderSummaryList(todayIncomeDisplay, incomeByCurr, '+');
  renderSummaryList(todayExpenseDisplay, expenseByCurr, '-');
  
  let netByCurr = {};
  const allPeriodCurrencies = new Set([...Object.keys(incomeByCurr), ...Object.keys(expenseByCurr)]);
  allPeriodCurrencies.forEach(curr => {
    netByCurr[curr] = (incomeByCurr[curr] || 0) - (expenseByCurr[curr] || 0);
  });
  renderSummaryList(todayNetDisplay, netByCurr, '');
  
  renderTransactionList(filteredTxs);
  renderDashboardView(selectedYM, filteredTxs);
}

function renderSummaryList(container, data, prefix) {
  container.innerHTML = '';
  const keys = Object.keys(data);
  if (keys.length === 0) {
    container.innerHTML = `<div class="kpi-value-row"><span class="kpi-amount">0</span><span class="kpi-currency">THB</span></div>`;
    return;
  }
  keys.forEach(curr => {
    let val = data[curr];
    if (val === 0 && prefix !== '') return;
    
    let displayPrefix = prefix;
    if (prefix === '' && val > 0) displayPrefix = '+';
    
    const div = document.createElement('div');
    div.className = 'kpi-value-row';
    div.innerHTML = `<span class="kpi-amount">${displayPrefix}${formatCurrency(val)}</span> <span class="kpi-currency">${curr}</span>`;
    container.appendChild(div);
  });
}

// Selection Helpers
window.toggleSelectTransaction = function(id, isChecked) {
  if (isChecked) {
    selectedTxIds.add(id);
  } else {
    selectedTxIds.delete(id);
  }
  updateSelectionUI();
};

function updateSelectionUI() {
  const count = selectedTxIds.size;
  if (selectedCountDisplay) selectedCountDisplay.textContent = count;
  if (deleteSelectedBtn) {
    if (count > 0) {
      deleteSelectedBtn.classList.remove('hidden');
    } else {
      deleteSelectedBtn.classList.add('hidden');
    }
  }

  // Update rows styling
  const rows = transactionList.querySelectorAll('tr[data-tx-id]');
  rows.forEach(tr => {
    const txId = tr.getAttribute('data-tx-id');
    const chk = tr.querySelector('.tx-checkbox');
    if (selectedTxIds.has(txId)) {
      tr.classList.add('selected-row');
      if (chk) chk.checked = true;
    } else {
      tr.classList.remove('selected-row');
      if (chk) chk.checked = false;
    }
  });

  // Update Select All Checkbox state
  if (selectAllTxCheckbox && visiblePageTxIds.length > 0) {
    const allOnPageSelected = visiblePageTxIds.every(id => selectedTxIds.has(id));
    selectAllTxCheckbox.checked = allOnPageSelected;
  }
}

// Render Data Table with Pagination (11 Items per Page)
function renderTransactionList(filteredTxs) {
  transactionList.innerHTML = '';
  
  const totalItems = filteredTxs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  
  if (totalItems === 0) {
    visiblePageTxIds = [];
    transactionList.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <span class="empty-icon">📂</span>
            <p style="font-weight: 500;">No matching transactions found.</p>
          </div>
        </td>
      </tr>
    `;
    if (paginationInfo) paginationInfo.textContent = "Showing 0 of 0 entries";
    if (pageNumberDisplay) pageNumberDisplay.textContent = "Page 1 of 1";
    if (prevPageBtn) prevPageBtn.disabled = true;
    if (nextPageBtn) nextPageBtn.disabled = true;
    updateSelectionUI();
    return;
  }
  
  const sorted = [...filteredTxs].sort((a, b) => b.timestamp - a.timestamp);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageTxs = sorted.slice(startIndex, endIndex);
  visiblePageTxIds = pageTxs.map(t => t.id);
  
  pageTxs.forEach((tx) => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-tx-id', tx.id);
    const isSelected = selectedTxIds.has(tx.id);
    tr.className = `tx-row tx-${tx.type} ${isSelected ? 'selected-row' : ''}`;
    
    const d = new Date(tx.timestamp);
    const dateStr = tx.date || d.toISOString().split('T')[0];
    const timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const amountPrefix = tx.type === 'income' ? '+' : '-';
    const typeLabel = tx.type === 'income' ? 'Income' : 'Expense';
    
    tr.innerHTML = `
      <td class="col-checkbox">
        <input type="checkbox" class="tx-checkbox tx-checkbox-custom" value="${tx.id}" ${isSelected ? 'checked' : ''} onchange="toggleSelectTransaction('${tx.id}', this.checked)">
      </td>
      <td style="font-weight: 500; white-space: nowrap;">${dateStr} <span style="font-size: 0.75rem; color: var(--text-muted);">${timeStr}</span></td>
      <td><span class="type-pill ${tx.type}">${typeLabel}</span></td>
      <td class="tx-amount">${amountPrefix}${formatCurrency(tx.amount)}</td>
      <td style="font-weight: 600; color: var(--text-secondary);">${tx.currency}</td>
      <td title="${tx.tag || ''}">${tx.tag || '-'}</td>
      <td>
        <div class="table-actions">
          <button class="btn-action-icon edit" onclick="openEditTxModal('${tx.id}')" title="Edit Entry" aria-label="Edit Entry">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-action-icon delete" onclick="promptDeleteTransaction('${tx.id}')" title="Delete Row" aria-label="Delete Entry">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    `;
    transactionList.appendChild(tr);
  });

  // Update Pagination Controls UI
  if (paginationInfo) paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries`;
  if (pageNumberDisplay) pageNumberDisplay.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevPageBtn) prevPageBtn.disabled = (currentPage <= 1);
  if (nextPageBtn) nextPageBtn.disabled = (currentPage >= totalPages);
  
  updateSelectionUI();
}

function renderDashboardView(selectedYM, filteredTxs) {
  const currentBalances = getBalances();
  
  let periodIncome = {};
  let periodExpense = {};
  
  filteredTxs.forEach(tx => {
    if (!periodIncome[tx.currency]) periodIncome[tx.currency] = 0;
    if (!periodExpense[tx.currency]) periodExpense[tx.currency] = 0;
    
    if (tx.type === 'income') periodIncome[tx.currency] += tx.amount;
    else periodExpense[tx.currency] += tx.amount;
  });
  
  // 1. Accounts Summary Cards
  dashBalances.innerHTML = '';
  const allCurrencies = new Set([...Object.keys(initialBalances), ...Object.keys(currentBalances)]);
  
  allCurrencies.forEach(curr => {
    const initVal = initialBalances[curr] || 0;
    const incVal = periodIncome[curr] || 0;
    const expVal = periodExpense[curr] || 0;
    const remVal = currentBalances[curr] || 0;
    
    const card = document.createElement('div');
    card.className = 'acc-balance-card';
    card.innerHTML = `
      <div class="acc-title">Account / Currency: ${curr}</div>
      <div class="acc-details-grid">
        <div class="acc-stat-box" onclick="openBalanceModal()" style="cursor: pointer;" title="Click to edit initial balances">
          <label style="cursor: pointer; display: flex; align-items: center; gap: 4px;">Initial Balance <span style="font-size: 0.7rem; opacity: 0.7;">✏️</span></label>
          <val style="color: var(--text-secondary);">${formatCurrency(initVal)}</val>
        </div>
        <div class="acc-stat-box">
          <label>In (${selectedYM === "ALL" ? 'All' : getYearMonthLabel(selectedYM)})</label>
          <val style="color: var(--income-color);">+${formatCurrency(incVal)}</val>
        </div>
        <div class="acc-stat-box">
          <label>Out (${selectedYM === "ALL" ? 'All' : getYearMonthLabel(selectedYM)})</label>
          <val style="color: var(--expense-color);">-${formatCurrency(expVal)}</val>
        </div>
        <div class="acc-stat-box">
          <label>Remaining</label>
          <val style="color: var(--brand-primary); font-size: 1rem;">${formatCurrency(remVal)}</val>
        </div>
      </div>
    `;
    dashBalances.appendChild(card);
  });
  
  // 2. Daily Financial Breakdown Table with Pagination
  if (dashDailyBreakdown) {
    const dailyMap = {};
    filteredTxs.forEach(tx => {
      if (!dailyMap[tx.date]) {
        dailyMap[tx.date] = { income: {}, expense: {} };
      }
      if (!dailyMap[tx.date].income[tx.currency]) dailyMap[tx.date].income[tx.currency] = 0;
      if (!dailyMap[tx.date].expense[tx.currency]) dailyMap[tx.date].expense[tx.currency] = 0;
      
      if (tx.type === 'income') dailyMap[tx.date].income[tx.currency] += tx.amount;
      else dailyMap[tx.date].expense[tx.currency] += tx.amount;
    });

    const sortedDates = Object.keys(dailyMap).sort().reverse();
    const totalDailyDays = sortedDates.length;
    const totalDailyPages = Math.max(1, Math.ceil(totalDailyDays / DAILY_ITEMS_PER_PAGE));

    if (currentDailyPage > totalDailyPages) currentDailyPage = totalDailyPages;
    if (currentDailyPage < 1) currentDailyPage = 1;
    
    if (totalDailyDays === 0) {
      dashDailyBreakdown.innerHTML = '<div class="empty-state"><p>No transaction logs in this period.</p></div>';
    } else {
      const startIndex = (currentDailyPage - 1) * DAILY_ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + DAILY_ITEMS_PER_PAGE, totalDailyDays);
      const pageDates = sortedDates.slice(startIndex, endIndex);

      let tableHtml = `
        <div class="table-scroll-wrapper">
          <table class="daily-breakdown-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total In (+)</th>
                <th>Total Out (-)</th>
                <th>Net Daily (+/-)</th>
              </tr>
            </thead>
            <tbody>
      `;

      pageDates.forEach(dateStr => {
        const dayData = dailyMap[dateStr];
        const incCurrs = Object.keys(dayData.income);
        const expCurrs = Object.keys(dayData.expense);
        const currs = Array.from(new Set([...incCurrs, ...expCurrs]));

        let incStrList = [];
        let expStrList = [];
        let netStrList = [];

        currs.forEach(c => {
          const inc = dayData.income[c] || 0;
          const exp = dayData.expense[c] || 0;
          const net = inc - exp;

          if (inc > 0) incStrList.push(`+${formatCurrency(inc)} ${c}`);
          if (exp > 0) expStrList.push(`-${formatCurrency(exp)} ${c}`);
          if (net !== 0) {
            const netColor = net >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
            const sign = net > 0 ? '+' : '';
            netStrList.push(`<span style="color: ${netColor}; font-weight: 700;">${sign}${formatCurrency(net)} ${c}</span>`);
          }
        });

        const incText = incStrList.length > 0 ? incStrList.join(', ') : '0';
        const expText = expStrList.length > 0 ? expStrList.join(', ') : '0';
        const netText = netStrList.length > 0 ? netStrList.join(', ') : '0';

        tableHtml += `
          <tr>
            <td style="font-weight: 700;">${dateStr}</td>
            <td style="color: var(--income-color); font-weight: 600;">${incText}</td>
            <td style="color: var(--expense-color); font-weight: 600;">${expText}</td>
            <td>${netText}</td>
          </tr>
        `;
      });

      tableHtml += `
            </tbody>
          </table>
        </div>
        <div class="table-pagination">
          <span class="pagination-info">Showing ${startIndex + 1} to ${endIndex} of ${totalDailyDays} days</span>
          <div class="pagination-controls">
            <button id="daily-prev-page-btn" class="btn-secondary pagination-btn" ${currentDailyPage <= 1 ? 'disabled' : ''}>‹ Prev</button>
            <span class="page-number-badge">Page ${currentDailyPage} of ${totalDailyPages}</span>
            <button id="daily-next-page-btn" class="btn-secondary pagination-btn" ${currentDailyPage >= totalDailyPages ? 'disabled' : ''}>Next ›</button>
          </div>
        </div>
      `;
      dashDailyBreakdown.innerHTML = tableHtml;

      const dailyPrevBtn = document.getElementById('daily-prev-page-btn');
      const dailyNextBtn = document.getElementById('daily-next-page-btn');

      if (dailyPrevBtn) {
        dailyPrevBtn.addEventListener('click', () => {
          if (currentDailyPage > 1) {
            currentDailyPage--;
            renderDashboardView(selectedYM, filteredTxs);
          }
        });
      }
      if (dailyNextBtn) {
        dailyNextBtn.addEventListener('click', () => {
          if (currentDailyPage < totalDailyPages) {
            currentDailyPage++;
            renderDashboardView(selectedYM, filteredTxs);
          }
        });
      }
    }
  }

  // 3. Stats & Charts
  dashTodayStats.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 500;"><span>Selected Period:</span> <strong>${getYearMonthLabel(selectedYM)}</strong></div>
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 500; margin-top: 6px;"><span>Total Entries:</span> <strong>${filteredTxs.length} entries</strong></div>
  `;
  
  dashChartsContainer.innerHTML = '';
  if (allCurrencies.size === 0) {
    dashChartsContainer.innerHTML = '<div class="empty-state"><p>No transaction history to chart.</p></div>';
  } else {
    allCurrencies.forEach(curr => {
      const inc = periodIncome[curr] || 0;
      const exp = periodExpense[curr] || 0;
      const maxVal = Math.max(inc, exp, 1);
      
      const incPct = Math.min(100, Math.round((inc / maxVal) * 100));
      const expPct = Math.min(100, Math.round((exp / maxVal) * 100));
      
      const chartGroup = document.createElement('div');
      chartGroup.className = 'chart-currency-group';
      chartGroup.innerHTML = `
        <div class="chart-currency-title">Currency: ${curr}</div>
        <div class="chart-bar-row">
          <span class="chart-label">Income</span>
          <div class="chart-track">
            <div class="chart-fill income" style="width: ${incPct}%;"></div>
          </div>
          <span class="chart-val" style="color: var(--income-color);">+${formatCurrency(inc)}</span>
        </div>
        <div class="chart-bar-row">
          <span class="chart-label">Expense</span>
          <div class="chart-track">
            <div class="chart-fill expense" style="width: ${expPct}%;"></div>
          </div>
          <span class="chart-val" style="color: var(--expense-color);">-${formatCurrency(exp)}</span>
        </div>
      `;
      dashChartsContainer.appendChild(chartGroup);
    });
  }
  
  const totalEntries = transactions.filter(t => !t.isDummy).length;
  const uniqueDays = new Set(transactions.map(t => t.date)).size;
  dashActivityStats.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 500;"><span>Total Logged Days:</span> <strong>${uniqueDays} days</strong></div>
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 500; margin-top: 6px;"><span>Total Lifetime Records:</span> <strong>${totalEntries} entries</strong></div>
  `;
}

// Logic: Add Transaction with Anti-Double-Submit Lock
let isSubmittingTx = false;

function handleTransaction(type) {
  if (isSubmittingTx) return; // Prevent rapid double clicks / double submits

  const amountStr = amountInput.value.trim();
  const currStr = currencySelect.value;
  const descStr = descInput.value.trim();
  const selectedDate = (dateInput && dateInput.value) ? dateInput.value : getTodayDateString();
  
  if (!amountStr) {
    amountInput.focus();
    return; 
  }
  
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    amountInput.value = '';
    amountInput.focus();
    showToast("โปรดกรอกตัวเลขจำนวนเงินให้ถูกต้อง", "error");
    return;
  }

  isSubmittingTx = true;
  setTimeout(() => { isSubmittingTx = false; }, 400); // 400ms cooldown lock
  
  const tx = {
    id: generateId(),
    date: selectedDate,
    timestamp: new Date(selectedDate).getTime() + (Date.now() % 86400000),
    type: type,
    currency: currStr,
    tag: descStr,
    amount: amount
  };
  
  transactions.push(tx);
  saveData();
  currentPage = 1;
  updateUI();
  
  sendToGoogleSheets({ action: 'add', transaction: tx });
  showToast(`บันทึก ${type === 'income' ? 'รายรับ' : 'รายจ่าย'} ${formatCurrency(amount)} ${currStr} แล้ว`, "success");
  
  amountInput.value = '';
  descInput.value = '';
  amountInput.focus();
}

// Logic: Delete Transaction Confirmation Dialog
window.promptDeleteTransaction = function(id) {
  pendingDeleteIds = [id];
  openDeleteModal(1);
};

function promptDeleteSelected() {
  if (selectedTxIds.size === 0) return;
  pendingDeleteIds = Array.from(selectedTxIds);
  openDeleteModal(pendingDeleteIds.length);
}

function openDeleteModal(count) {
  if (deleteModalTitle) {
    deleteModalTitle.textContent = count > 1 ? `🗑️ ยืนยันการลบ ${count} รายการที่เลือก` : `🗑️ ยืนยันการลบรายการ`;
  }
  if (deleteModalMsg) {
    deleteModalMsg.innerHTML = count > 1 
      ? `คุณต้องการลบข้อมูล <strong style="color: var(--expense-color);">${count} รายการ</strong> ที่เลือกไว้ใช่หรือไม่? พิมพ์คำว่า <strong style="color: var(--expense-color);">delete</strong> ด้านล่างเพื่อยืนยัน:`
      : `คุณต้องการลบรายการนี้ใช่หรือไม่? พิมพ์คำว่า <strong style="color: var(--expense-color);">delete</strong> ด้านล่างเพื่อยืนยัน:`;
  }
  if (deleteConfirmInput) deleteConfirmInput.value = '';
  if (confirmDeleteBtn) confirmDeleteBtn.disabled = true;
  confirmDeleteModal.classList.remove('hidden');
  if (deleteConfirmInput) deleteConfirmInput.focus();
}

function confirmDeleteTransaction() {
  if (!pendingDeleteIds || pendingDeleteIds.length === 0) return;

  const count = pendingDeleteIds.length;
  transactions = transactions.filter(t => !pendingDeleteIds.includes(t.id));
  
  pendingDeleteIds.forEach(id => selectedTxIds.delete(id));
  pendingDeleteIds = [];

  saveData();
  updateUI();
  
  sendToGoogleSheets({ action: 'sync_all', transactions: transactions });
  showToast(count > 1 ? `ลบ ${count} รายการที่เลือกเรียบร้อยแล้ว` : "ลบรายการเรียบร้อยแล้ว", "info");

  confirmDeleteModal.classList.add('hidden');
}

// Logic: Edit Transaction Modal
window.openEditTxModal = function(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;
  
  editTxId.value = tx.id;
  editTxDate.value = tx.date || getTodayDateString();
  editTxAmount.value = tx.amount;
  editTxType.value = tx.type;
  editTxCurr.value = tx.currency;
  editTxDesc.value = tx.tag || '';
  
  editTxModal.classList.remove('hidden');
};

function saveEditTransaction() {
  const id = editTxId.value;
  const txIndex = transactions.findIndex(t => t.id === id);
  if (txIndex === -1) return;
  
  const newAmount = parseFloat(editTxAmount.value);
  if (isNaN(newAmount) || newAmount <= 0) {
    showToast("โปรดกรอกจำนวนเงินให้ถูกต้อง", "error");
    return;
  }
  
  transactions[txIndex].date = editTxDate.value;
  transactions[txIndex].amount = newAmount;
  transactions[txIndex].type = editTxType.value;
  transactions[txIndex].currency = editTxCurr.value.trim().toUpperCase();
  transactions[txIndex].tag = editTxDesc.value.trim();
  
  saveData();
  updateUI();
  editTxModal.classList.add('hidden');
  
  sendToGoogleSheets({ action: 'sync_all', transactions: transactions });
  showToast("แก้ไขรายการเรียบร้อยแล้ว", "success");
}

// Modal Logic for Initial Balances
function openBalanceModal() {
  balanceModal.classList.remove('hidden');
  renderBalanceInputs();
}

function renderBalanceInputs() {
  balanceInputsContainer.innerHTML = '';
  const currentBals = getBalances();
  const currencies = Object.keys(currentBals);
  if (currencies.length === 0) currencies.push("THB");
  
  currencies.forEach(curr => {
    addBalanceInputRow(curr, initialBalances[curr] || 0);
  });
}

function addBalanceInputRow(curr = '', amount = 0) {
  const row = document.createElement('div');
  row.className = 'balance-input-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.alignItems = 'center';
  row.innerHTML = `
    <input type="text" class="input-field curr-name" value="${curr}" placeholder="e.g. THB" style="width: 90px;">
    <input type="number" class="input-field curr-amount" value="${amount}" placeholder="0" inputmode="decimal" style="flex: 1;">
    <button class="btn-action-icon delete" onclick="this.parentElement.remove()" style="font-size: 1.2rem;">×</button>
  `;
  balanceInputsContainer.appendChild(row);
}

function saveBalances() {
  const rows = balanceInputsContainer.querySelectorAll('.balance-input-row');
  let newInitBals = {};
  
  rows.forEach(row => {
    const curr = row.querySelector('.curr-name').value.trim().toUpperCase();
    const amount = parseFloat(row.querySelector('.curr-amount').value) || 0;
    if (curr) {
      newInitBals[curr] = amount;
    }
  });
  
  initialBalances = newInitBals;
  saveData();
  updateUI();
  balanceModal.classList.add('hidden');
  showToast("อัปเดตเงินตั้งต้นในบัญชีเรียบร้อยแล้ว", "success");
}

// Google Apps Script Source Code Template
const APPS_SCRIPT_CODE = `function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!e || !e.parameter) {
      return ContentService.createTextOutput("Tracker API Ready!");
    }
    
    // 1. ADD SINGLE TRANSACTION
    if (e.parameter.action === "add") {
      var timestamp = e.parameter.timestamp;
      var sheet = getMonthlySheet(ss, timestamp);
      var amount = Number(e.parameter.amount);
      var currency = e.parameter.currency;
      var type = e.parameter.type;
      var tag = e.parameter.tag || "";
      var date = e.parameter.date;
      var balance = e.parameter.balance ? Number(e.parameter.balance) : "";
      var d = new Date(Number(timestamp) || Date.now());
      var timeStr = d.toLocaleTimeString();
      
      if (!isDuplicateRow(sheet, date, timeStr, type, amount, currency, tag)) {
        sheet.appendRow([date, timeStr, type, amount, currency, tag, balance]);
        var lastRow = sheet.getLastRow();
        styleRow(sheet, lastRow, type);
        sheet.autoResizeColumns(1, 7);
        
        // Auto-Sort by Date (Col 1) and Time (Col 2)
        if (lastRow > 2) {
          sheet.getRange(2, 1, lastRow - 1, 7).sort([
            { column: 1, ascending: true },
            { column: 2, ascending: true }
          ]);
        }
      }
      return ContentService.createTextOutput("SUCCESS");
    } 
    
    // 2. SYNC ALL / CHUNK
    else if (e.parameter.action === "sync_chunk" || e.parameter.action === "sync_all") {
      var isFirst = e.parameter.is_first === "1";
      var txList = [];
      if (e.parameter.payload) {
        txList = JSON.parse(e.parameter.payload);
      }
      
      var txByMonth = {};
      txList.forEach(function(tx) {
        if (!tx.isDummy) {
          var d = new Date(tx.timestamp || Date.now());
          var months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
          ];
          var sheetName = months[d.getMonth()] + " " + d.getFullYear();
          if (!txByMonth[sheetName]) txByMonth[sheetName] = [];
          txByMonth[sheetName].push(tx);
        }
      });
      
      for (var sheetName in txByMonth) {
        var sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
          sheet = ss.insertSheet(sheetName);
        }
        
        if (isFirst) {
          sheet.clear();
          sheet.appendRow(["Date", "Time", "Type", "Amount", "Currency", "Description", "Balance"]);
          var headerRange = sheet.getRange(1, 1, 1, 7);
          headerRange.setBackground("#0F9D58")
                     .setFontColor("#FFFFFF")
                     .setFontWeight("bold")
                     .setHorizontalAlignment("center");
          sheet.setRowHeight(1, 35);
        }
        
        var list = txByMonth[sheetName];
        list.forEach(function(tx) {
          var d = new Date(tx.timestamp);
          var timeStr = d.toLocaleTimeString();
          var amount = Number(tx.amount);
          var tag = tx.tag || "";
          var balance = tx.runningBalance !== undefined ? Number(tx.runningBalance) : "";
          
          sheet.appendRow([tx.date, timeStr, tx.type, amount, tx.currency, tag, balance]);
          var r = sheet.getLastRow();
          styleRow(sheet, r, tx.type);
        });
        sheet.autoResizeColumns(1, 7);
      }
      return ContentService.createTextOutput("SUCCESS SYNC");
    }
    
    // 3. GET ALL (IMPORT TO WEB APP)
    else if (e.parameter.action === "get_all") {
      var sheets = ss.getSheets();
      var allTransactions = [];
      
      sheets.forEach(function(sheet) {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
          for (var i = 0; i < values.length; i++) {
            var row = values[i];
            var dateVal = row[0];
            var timeVal = row[1];
            var typeVal = row[2];
            var amountVal = row[3];
            var currVal = row[4];
            var tagVal = row[5];
            
            if (dateVal && amountVal !== "" && !isNaN(Number(amountVal))) {
              var formattedDate = "";
              if (dateVal instanceof Date) {
                var y = dateVal.getFullYear();
                var m = String(dateVal.getMonth() + 1).padStart(2, '0');
                var day = String(dateVal.getDate()).padStart(2, '0');
                formattedDate = y + "-" + m + "-" + day;
              } else {
                formattedDate = String(dateVal).trim();
              }
              
              allTransactions.push({
                date: formattedDate,
                time: String(timeVal || ""),
                type: String(typeVal || "income").toLowerCase(),
                amount: Number(amountVal),
                currency: String(currVal || "THB").toUpperCase(),
                tag: String(tagVal || "")
              });
            }
          }
        }
      });
      
      var responseObj = {
        status: "success",
        count: allTransactions.length,
        transactions: allTransactions
      };
      
      var callback = e.parameter.callback;
      if (callback) {
        return ContentService.createTextOutput(callback + "(" + JSON.stringify(responseObj) + ")")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(JSON.stringify(responseObj))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput("Tracker API Ready!");
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function isDuplicateRow(sheet, date, timeStr, type, amount, currency, tag) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    if (r[0] && String(r[0]) === String(date) && 
        String(r[1]) === String(timeStr) && 
        String(r[2]).toLowerCase() === String(type).toLowerCase() && 
        Number(r[3]) === Number(amount) && 
        String(r[4]) === String(currency) && 
        String(r[5]) === String(tag)) {
      return true;
    }
  }
  return false;
}

function getMonthlySheet(ss, timestamp) {
  var d = new Date(Number(timestamp) || Date.now());
  var months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  var sheetName = months[d.getMonth()] + " " + d.getFullYear();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Date", "Time", "Type", "Amount", "Currency", "Description", "Balance"]);
    var headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setBackground("#0F9D58")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setHorizontalAlignment("center");
    sheet.setRowHeight(1, 35);
  }
  return sheet;
}

function styleRow(sheet, rowIdx, type) {
  var rowRange = sheet.getRange(rowIdx, 1, 1, 7);
  rowRange.setFontColor("#E0E0E0");
  rowRange.setBackground(rowIdx % 2 === 0 ? "#1E1F24" : "#17181C");
  sheet.getRange(rowIdx, 1, 1, 7).setHorizontalAlignment("center");
  sheet.getRange(rowIdx, 6).setHorizontalAlignment("left");
  
  var typeCell = sheet.getRange(rowIdx, 3);
  var amtCell = sheet.getRange(rowIdx, 4);
  if (type === "income") {
    typeCell.setFontColor("#10B981").setFontWeight("bold");
    amtCell.setFontColor("#10B981").setFontWeight("bold");
  } else {
    typeCell.setFontColor("#EF4444").setFontWeight("bold");
    amtCell.setFontColor("#EF4444").setFontWeight("bold");
  }
}`;

// Modal Logic for Google Sheets & Tab Switching
function openSheetsModal() {
  sheetsModal.classList.remove('hidden');
  sheetsUrlInput.value = googleSheetUrl;
  switchSheetsModalTab('cloud');
  if (scriptCodeSnippet) {
    scriptCodeSnippet.textContent = APPS_SCRIPT_CODE;
  }
}

function switchSheetsModalTab(tabName) {
  if (modalTabCloud) modalTabCloud.classList.toggle('active', tabName === 'cloud');
  if (modalTabPaste) modalTabPaste.classList.toggle('active', tabName === 'paste');
  if (modalTabCode) modalTabCode.classList.toggle('active', tabName === 'code');

  if (tabContentCloud) tabContentCloud.classList.toggle('hidden', tabName !== 'cloud');
  if (tabContentPaste) tabContentPaste.classList.toggle('hidden', tabName !== 'paste');
  if (tabContentCode) tabContentCode.classList.toggle('hidden', tabName !== 'code');
}

function saveSheetsUrl() {
  const inputUrl = sheetsUrlInput.value.trim();
  
  if (inputUrl && inputUrl.includes("docs.google.com/spreadsheets")) {
    showToast("กรุณาก๊อปปี้ Web App URL จาก Apps Script (ที่ขึ้นต้นด้วย script.google.com)", "error");
    return;
  }
  
  googleSheetUrl = inputUrl;
  saveData();
  updateUI();
  sheetsModal.classList.add('hidden');
  if (googleSheetUrl) {
    showToast("บันทึก Web App URL เรียบร้อยแล้ว", "success");
  }
}

// 📥 Import Data from Google Sheets
function importFromGoogleSheets() {
  let urlToUse = (sheetsUrlInput.value.trim() || googleSheetUrl).trim();
  if (!urlToUse || !urlToUse.includes("script.google.com")) {
    showToast("กรุณากรอก Web App URL จาก Apps Script ให้ถูกต้องก่อนกด Import ครับ", "error");
    return;
  }

  // Auto-fix URL if missing /exec
  urlToUse = urlToUse.replace(/\/+$/, '');
  if (!urlToUse.endsWith('/exec') && urlToUse.includes('/macros/s/')) {
    urlToUse = urlToUse + '/exec';
    if (sheetsUrlInput) sheetsUrlInput.value = urlToUse;
  }

  // Save URL if valid
  googleSheetUrl = urlToUse;
  saveData();

  // Set Loading UI
  if (importSheetsBtn) {
    importSheetsBtn.disabled = true;
    importSheetsBtn.innerHTML = `<span class="spinner"></span> กำลัง Import...`;
  }

  const handleImportedData = (rawList) => {
    if (!Array.isArray(rawList) || rawList.length === 0) {
      showToast("ไม่พบรายการข้อมูลใน Google Sheets ครับ", "info");
      return;
    }

    const importedTransactions = [];
    rawList.forEach((item, index) => {
      const amt = Number(item.amount);
      if (isNaN(amt) || amt <= 0) return;
      const type = (item.type || 'income').toLowerCase();
      const curr = (item.currency || 'THB').toUpperCase();
      const tag = item.tag || item.description || '';
      const dateStr = item.date || getTodayDateString();
      const timeStr = item.time || '';

      let parsedTimestamp = Date.now() - (rawList.length - index) * 1000;
      if (timeStr) {
        const tryDate = new Date(`${dateStr} ${timeStr}`);
        if (!isNaN(tryDate.getTime())) parsedTimestamp = tryDate.getTime();
      } else {
        const tryDate = new Date(dateStr);
        if (!isNaN(tryDate.getTime())) parsedTimestamp = tryDate.getTime() + (index * 60000);
      }

      importedTransactions.push({
        id: generateId(),
        date: dateStr,
        timestamp: parsedTimestamp,
        type: type,
        currency: curr,
        tag: tag,
        amount: amt
      });

      // Ensure currency exists in initialBalances
      if (initialBalances[curr] === undefined) {
        initialBalances[curr] = 0;
      }
    });

    if (importedTransactions.length > 0) {
      transactions = importedTransactions;
      localStorage.setItem('tracker_isSeeded', 'true');
      saveData();
      currentPage = 1;
      updateUI();

      showToast(`นำเข้าข้อมูลครบถ้วน ${transactions.length} รายการจาก Google Sheets สำเร็จ!`, "success");
      sheetsModal.classList.add('hidden');
    } else {
      showToast("ไม่พบข้อมูลที่สามารถนำเข้าได้", "info");
    }
  };

  // Attempt JSONP Callback first (100% reliable cross-origin for Google Apps Script)
  const callbackName = 'gscript_import_cb_' + Date.now();
  let completed = false;

  window[callbackName] = (data) => {
    completed = true;
    if (importSheetsBtn) {
      importSheetsBtn.disabled = false;
      importSheetsBtn.innerHTML = `<span>📥 Import จาก Sheets</span>`;
    }
    delete window[callbackName];
    if (scriptElem && scriptElem.parentNode) {
      scriptElem.parentNode.removeChild(scriptElem);
    }

    if (data && data.status === 'success' && data.transactions) {
      handleImportedData(data.transactions);
    } else {
      showToast("นำเข้าไม่สำเร็จ หรือยังไม่ได้อัปเดตโค้ด Apps Script ใหม่", "error");
    }
  };

  const scriptElem = document.createElement('script');
  scriptElem.src = `${urlToUse}${urlToUse.includes('?') ? '&' : '?'}action=get_all&callback=${callbackName}&_t=${Date.now()}`;
  scriptElem.onerror = () => {
    if (!completed) {
      completed = true;
      delete window[callbackName];
      if (scriptElem && scriptElem.parentNode) {
        scriptElem.parentNode.removeChild(scriptElem);
      }

      // Fallback to fetch
      fetch(`${urlToUse}${urlToUse.includes('?') ? '&' : '?'}action=get_all&_t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success' && data.transactions) {
            handleImportedData(data.transactions);
          } else {
            showToast("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบการอัปเดตโค้ด Apps Script ครับ", "error");
          }
        })
        .catch(err => {
          console.error("Import error:", err);
          showToast("ไม่สามารถเชื่อมต่อ Apps Script ได้ กรุณาลองวิธี Direct Paste แทนครับ", "error");
        })
        .finally(() => {
          if (importSheetsBtn) {
            importSheetsBtn.disabled = false;
            importSheetsBtn.innerHTML = `<span>📥 Import จาก Sheets</span>`;
          }
        });
    }
  };

  document.body.appendChild(scriptElem);

  // Timeout guard (12 seconds)
  setTimeout(() => {
    if (!completed) {
      completed = true;
      if (window[callbackName]) delete window[callbackName];
      if (scriptElem && scriptElem.parentNode) scriptElem.parentNode.removeChild(scriptElem);
      if (importSheetsBtn) {
        importSheetsBtn.disabled = false;
        importSheetsBtn.innerHTML = `<span>📥 Import จาก Sheets</span>`;
      }
      showToast("การเชื่อมต่อหมดเวลา โปรดตรวจสอบว่า Apps Script เผยแพร่เป็น 'Anyone' แล้วหรือไม่", "error");
    }
  }, 12000);
}

// 📋 Import from Direct Paste (TSV / CSV / Text from Sheets)
function importFromPastedText() {
  if (!pasteImportInput) return;
  const rawText = pasteImportInput.value.trim();
  if (!rawText) {
    showToast("กรุณาวางตารางหรือข้อความที่คัดลอกจาก Google Sheets ก่อนครับ", "error");
    return;
  }

  // 💡 Smart UX: If the user pasted a Web App URL here instead of table rows
  if (rawText.includes("script.google.com")) {
    const matchedUrl = rawText.match(/https:\/\/script\.google\.com\/[^\s\r\n]+/);
    if (matchedUrl) {
      if (sheetsUrlInput) sheetsUrlInput.value = matchedUrl[0];
      switchSheetsModalTab('cloud');
      showToast("ตรวจพบ Web App URL! กำลังดึงข้อมูลจาก Google Sheets ให้...", "info");
      importFromGoogleSheets();
      return;
    }
  }

  const lines = rawText.split(/\r?\n/);
  let addedCount = 0;
  const existingKeys = new Set(
    transactions.filter(t => !t.isDummy).map(t => `${t.date}_${t.type}_${Number(t.amount)}_${t.currency}_${t.tag || ''}`)
  );

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Detect delimiter (\t from copy-pasting tables, comma, or semicolon)
    let cols = [];
    if (trimmedLine.includes('\t')) cols = trimmedLine.split('\t');
    else if (trimmedLine.includes(',')) cols = trimmedLine.split(',');
    else if (trimmedLine.includes(';')) cols = trimmedLine.split(';');
    else cols = trimmedLine.split(/\s{2,}/); // 2 or more spaces

    cols = cols.map(c => c.trim());
    if (cols.length < 3) return;

    // Skip header row
    const firstCol = cols[0].toLowerCase();
    if (firstCol.includes('date') || firstCol.includes('วันที่') || firstCol.includes('เวลา') || firstCol.includes('ลำดับ')) return;

    // Parse Date
    let rawDate = cols[0];
    let dateStr = "";
    if (rawDate.includes('/') || rawDate.includes('-')) {
      const parts = rawDate.split(/[\/\-]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          dateStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        } else if (parts[2].length === 4) {
          // DD/MM/YYYY
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else {
          dateStr = rawDate;
        }
      } else {
        dateStr = rawDate;
      }
    } else {
      dateStr = getTodayDateString();
    }

    // Determine column mapping based on standard sheets columns:
    // Format A (7 cols): Date, Time, Type, Amount, Currency, Description, Balance
    // Format B (6 cols): Date, Time, Type, Amount, Currency, Description
    // Format C (5 cols): Date, Type, Amount, Currency, Description
    let timeStr = "";
    let typeStr = "income";
    let rawAmount = "";
    let curr = "THB";
    let tag = "";

    if (cols.length >= 6) {
      timeStr = cols[1];
      typeStr = cols[2].toLowerCase();
      rawAmount = cols[3];
      curr = cols[4] ? cols[4].toUpperCase() : "THB";
      tag = cols[5] || "";
    } else if (cols.length === 5) {
      if (cols[1].includes(':')) {
        // Date, Time, Type, Amount, Description
        timeStr = cols[1];
        typeStr = cols[2].toLowerCase();
        rawAmount = cols[3];
        tag = cols[4] || "";
      } else {
        // Date, Type, Amount, Currency, Description
        typeStr = cols[1].toLowerCase();
        rawAmount = cols[2];
        curr = cols[3] ? cols[3].toUpperCase() : "THB";
        tag = cols[4] || "";
      }
    } else if (cols.length >= 3) {
      // Date, Type, Amount
      typeStr = cols[1].toLowerCase();
      rawAmount = cols[2];
      if (cols[3]) tag = cols[3];
    }

    // Sanitize type
    if (typeStr.includes('exp') || typeStr.includes('จ่าย') || typeStr.includes('เสีย') || typeStr.includes('-')) {
      typeStr = 'expense';
    } else {
      typeStr = 'income';
    }

    const amt = parseFloat(rawAmount.replace(/[^0-9.-]+/g, ''));
    if (isNaN(amt) || amt <= 0) return;
    if (!curr || curr.length > 5) curr = "THB";

    let parsedTimestamp = Date.now() - (lines.length - index) * 1000;
    if (timeStr) {
      const tryDate = new Date(`${dateStr} ${timeStr}`);
      if (!isNaN(tryDate.getTime())) parsedTimestamp = tryDate.getTime();
    } else {
      const tryDate = new Date(dateStr);
      if (!isNaN(tryDate.getTime())) parsedTimestamp = tryDate.getTime() + (index * 60000);
    }

    transactions.push({
      id: generateId(),
      date: dateStr,
      timestamp: parsedTimestamp,
      type: typeStr,
      currency: curr,
      tag: tag,
      amount: amt
    });

    if (initialBalances[curr] === undefined) {
      initialBalances[curr] = 0;
    }
    addedCount++;
  });

  if (addedCount > 0) {
    localStorage.setItem('tracker_isSeeded', 'true');
    saveData();
    currentPage = 1;
    updateUI();
    pasteImportInput.value = '';
    sheetsModal.classList.add('hidden');
    showToast(`นำเข้าข้อมูลครบถ้วน ${addedCount} รายการสำเร็จ!`, "success");
  } else {
    showToast("ไม่พบรายการที่สามารถนำเข้าได้", "info");
  }
}

// Clipboard Formatting
function formatClipboardText() {
  if (transactions.length === 0) return "No data to copy.";

  const groupedByDate = {};
  const validTxs = transactions.filter(t => !t.isDummy).sort((a, b) => a.timestamp - b.timestamp);
  
  let runningBals = { ...initialBalances };
  const grandTotalByDate = {};
  
  validTxs.forEach(tx => {
    if (runningBals[tx.currency] === undefined) runningBals[tx.currency] = 0;
    
    if (tx.type === 'income') runningBals[tx.currency] += tx.amount;
    else runningBals[tx.currency] -= tx.amount;
    
    grandTotalByDate[tx.date] = { ...runningBals };
  });

  transactions.forEach(tx => {
    if (!groupedByDate[tx.date]) {
      groupedByDate[tx.date] = {
        date: tx.date,
        incomeTxs: [],
        expenseTxs: [],
        incomeByCurr: {},
        expenseByCurr: {}
      };
    }
    
    if (!tx.isDummy) {
      let descStr = tx.tag ? `(${tx.tag})` : '';
      if (tx.type === 'income') {
        groupedByDate[tx.date].incomeTxs.push(`+${tx.amount}${tx.currency}${descStr}`);
        if(!groupedByDate[tx.date].incomeByCurr[tx.currency]) groupedByDate[tx.date].incomeByCurr[tx.currency] = 0;
        groupedByDate[tx.date].incomeByCurr[tx.currency] += tx.amount;
      } else {
        groupedByDate[tx.date].expenseTxs.push(`-${tx.amount}${tx.currency}${descStr}`);
        if(!groupedByDate[tx.date].expenseByCurr[tx.currency]) groupedByDate[tx.date].expenseByCurr[tx.currency] = 0;
        groupedByDate[tx.date].expenseByCurr[tx.currency] += tx.amount;
      }
    }
  });

  const sortedDates = Object.keys(groupedByDate).sort();
  let resultStr = "";

  const formatCurrMap = (map, prefix) => {
    const keys = Object.keys(map);
    if(keys.length === 0) return "0";
    return keys.map(k => `${prefix}${formatCurrency(map[k])} ${k}`).join(', ');
  };

  sortedDates.forEach(dateStr => {
    const d = new Date(dateStr);
    const dayNum = d.getDate();
    
    const dayData = groupedByDate[dateStr];
    
    const incomeStr = dayData.incomeTxs.length > 0 ? dayData.incomeTxs.join('/') + '/' : '0/';
    const expenseStr = dayData.expenseTxs.length > 0 ? dayData.expenseTxs.join('/') + '/' : '0/';
    
    const totalIncomeStr = formatCurrMap(dayData.incomeByCurr, '+');
    
    let netByCurr = {};
    const allTodayCurrencies = new Set([...Object.keys(dayData.incomeByCurr), ...Object.keys(dayData.expenseByCurr)]);
    allTodayCurrencies.forEach(c => {
      netByCurr[c] = (dayData.incomeByCurr[c] || 0) - (dayData.expenseByCurr[c] || 0);
    });
    
    let netStr = Array.from(allTodayCurrencies).map(c => {
      return `${netByCurr[c] >= 0 ? '+' : ''}${formatCurrency(netByCurr[c])} ${c}`;
    }).join(', ');
    if(netStr === "") netStr = "0";

    let eodGrandTotal = grandTotalByDate[dateStr];
    if (eodGrandTotal === undefined) {
      const pastDates = Object.keys(grandTotalByDate).filter(d => d <= dateStr).sort();
      if (pastDates.length > 0) {
        eodGrandTotal = grandTotalByDate[pastDates[pastDates.length - 1]];
      } else {
        eodGrandTotal = { ...initialBalances };
      }
    }

    const formattedEod = formatCurrMap(eodGrandTotal, '');
    
    const line = `###### ${dayNum}. เงินที่ได้จากเกม ${incomeStr} = รวมเงินรายวันทีได้จากเกม ${totalIncomeStr}  = เสียเงินวันนี้ ${expenseStr} = รวมทั้งวันวันนี้ ${netStr} = รวมเงินเก่าทั้งหมดใน บช ${formattedEod}\n`;
    
    resultStr += line;
  });

  return resultStr.trim();
}

// Close mobile sidebar helper
function closeMobileSidebar() {
  if (appSidebar) appSidebar.classList.remove('open');
  if (sidebarOverlay) sidebarOverlay.classList.remove('open');
}

// Events
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      updateUI();
    });
  }

  monthFilterSelect.addEventListener('change', () => {
    currentPage = 1;
    updateUI();
  });

  // Mobile Sidebar Toggle
  if (sidebarToggleBtn && appSidebar && sidebarOverlay) {
    sidebarToggleBtn.addEventListener('click', () => {
      appSidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('open');
    });

    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // Bulk Delete Button
  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', promptDeleteSelected);
  }

  // Select All Checkbox Header
  if (selectAllTxCheckbox) {
    selectAllTxCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      visiblePageTxIds.forEach(id => {
        if (isChecked) selectedTxIds.add(id);
        else selectedTxIds.delete(id);
      });
      updateSelectionUI();
    });
  }

  // Delete Confirm Input Typing Verification ('delete')
  if (deleteConfirmInput) {
    deleteConfirmInput.addEventListener('input', () => {
      const val = deleteConfirmInput.value.trim().toLowerCase();
      if (val === 'delete') {
        if (confirmDeleteBtn) confirmDeleteBtn.disabled = false;
      } else {
        if (confirmDeleteBtn) confirmDeleteBtn.disabled = true;
      }
    });
  }

  // Confirmation Modal Delete Actions
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      pendingDeleteIds = [];
      confirmDeleteModal.classList.add('hidden');
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (deleteConfirmInput && deleteConfirmInput.value.trim().toLowerCase() === 'delete') {
        confirmDeleteTransaction();
      }
    });
  }

  // Keyboard Shortcuts for Modals (Enter = Confirm/Submit, Escape = Cancel/Close)
  document.addEventListener('keydown', (e) => {
    // 1. Delete Confirmation Modal
    if (confirmDeleteModal && !confirmDeleteModal.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        if (deleteConfirmInput && deleteConfirmInput.value.trim().toLowerCase() === 'delete') {
          e.preventDefault();
          confirmDeleteTransaction();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        pendingDeleteIds = [];
        confirmDeleteModal.classList.add('hidden');
      }
      return;
    }

    // 2. Clear All Data Confirmation Modal
    if (confirmClearModal && !confirmClearModal.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        if (clearConfirmInput && clearConfirmInput.value.trim().toLowerCase() === 'clearall') {
          e.preventDefault();
          clearAllData();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        confirmClearModal.classList.add('hidden');
      }
      return;
    }

    // 3. Edit Transaction Modal
    if (editTxModal && !editTxModal.classList.contains('hidden')) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        saveEditTransaction();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        editTxModal.classList.add('hidden');
      }
      return;
    }

    // 4. Initial Balances Modal
    if (balanceModal && !balanceModal.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBalances();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        balanceModal.classList.add('hidden');
      }
      return;
    }

    // 5. Google Sheets Modal
    if (sheetsModal && !sheetsModal.classList.contains('hidden')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveSheetsUrl();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        sheetsModal.classList.add('hidden');
      }
      return;
    }
  });

  // Table Pagination Events (Prev / Next)
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateUI();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      updateUI();
    });
  }

  // Navigation Tabs
  tabBtnTracker.addEventListener('click', () => {
    currentTab = "tracker";
    tabBtnTracker.classList.add('active');
    tabBtnDashboard.classList.remove('active');
    viewTracker.classList.remove('hidden');
    viewDashboard.classList.add('hidden');
    closeMobileSidebar();
  });

  tabBtnDashboard.addEventListener('click', () => {
    currentTab = "dashboard";
    tabBtnDashboard.classList.add('active');
    tabBtnTracker.classList.remove('active');
    viewDashboard.classList.remove('hidden');
    viewTracker.classList.add('hidden');
    renderDashboardView(monthFilterSelect.value || "ALL", transactions.filter(t => !t.isDummy));
    closeMobileSidebar();
  });

  submitIncomeBtn.addEventListener('click', () => handleTransaction('income'));
  submitExpenseBtn.addEventListener('click', () => handleTransaction('expense'));

  descInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      handleTransaction('income');
    }
  });
  
  amountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      descInput.focus();
    }
  });

  // Modal Edit Events
  cancelEditTxBtn.addEventListener('click', () => editTxModal.classList.add('hidden'));
  saveEditTxBtn.addEventListener('click', saveEditTransaction);

  // Sidebar Settings Buttons
  editBalanceBtn.addEventListener('click', () => {
    closeMobileSidebar();
    openBalanceModal();
  });
  cancelBalanceBtn.addEventListener('click', () => balanceModal.classList.add('hidden'));
  saveBalanceBtn.addEventListener('click', saveBalances);
  addCurrencyBtn.addEventListener('click', () => addBalanceInputRow('', 0));

  sheetsBtn.addEventListener('click', () => {
    closeMobileSidebar();
    openSheetsModal();
  });
  cancelSheetsBtn.addEventListener('click', () => sheetsModal.classList.add('hidden'));
  saveSheetsBtn.addEventListener('click', saveSheetsUrl);
  
  if (importSheetsBtn) {
    importSheetsBtn.addEventListener('click', importFromGoogleSheets);
  }

  if (modalTabCloud) modalTabCloud.addEventListener('click', () => switchSheetsModalTab('cloud'));
  if (modalTabPaste) modalTabPaste.addEventListener('click', () => switchSheetsModalTab('paste'));
  if (modalTabCode) modalTabCode.addEventListener('click', () => switchSheetsModalTab('code'));

  if (pasteImportBtn) {
    pasteImportBtn.addEventListener('click', importFromPastedText);
  }

  if (copyScriptCodeBtn) {
    copyScriptCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(APPS_SCRIPT_CODE).then(() => {
        showToast("คัดลอกโค้ด Apps Script ลง Clipboard แล้ว", "info");
      }).catch(err => {
        console.error('Could not copy code:', err);
        showToast("ไม่สามารถคัดลอกโค้ดได้", "error");
      });
    });
  }
  
  syncAllBtn.addEventListener('click', () => {
    if (!googleSheetUrl || !googleSheetUrl.includes("script.google.com")) {
      showToast("กรุณาก๊อปปี้ Web App URL จาก Apps Script มาวางก่อนครับ", "error");
      return;
    }
    
    // Loading State Feedback
    syncAllBtn.disabled = true;
    syncAllBtn.classList.add('is-loading');
    syncAllBtn.innerHTML = `<span class="spinner"></span> Syncing...`;

    sendToGoogleSheets({ action: 'sync_all', transactions: transactions });
    showToast("ส่งคำขอ Sync ข้อมูลทั้งหมดไป Google Sheets แล้ว", "success");

    setTimeout(() => {
      syncAllBtn.disabled = false;
      syncAllBtn.classList.remove('is-loading');
      syncAllBtn.innerHTML = `⚡ Sync ข้อมูลไป Sheets`;
      sheetsModal.classList.add('hidden');
    }, 1500);
  });

  copyBtn.addEventListener('click', () => {
    closeMobileSidebar();
    const text = formatClipboardText();
    navigator.clipboard.writeText(text).then(() => {
      showToast("คัดลอกข้อความลง Clipboard เรียบร้อยแล้ว", "info");
    }).catch(err => {
      console.error('Could not copy text: ', err);
      showToast("ไม่สามารถคัดลอกลง Clipboard ได้", "error");
    });
  });

  if (clearConfirmInput) {
    clearConfirmInput.addEventListener('input', () => {
      const val = clearConfirmInput.value.trim().toLowerCase();
      if (val === 'clearall') {
        confirmClearBtn.disabled = false;
      } else {
        confirmClearBtn.disabled = true;
      }
    });
  }

  if (cancelClearBtn) {
    cancelClearBtn.addEventListener('click', () => {
      if (confirmClearModal) confirmClearModal.classList.add('hidden');
    });
  }

  if (confirmClearBtn) {
    confirmClearBtn.addEventListener('click', () => {
      if (clearConfirmInput && clearConfirmInput.value.trim().toLowerCase() === 'clearall') {
        clearAllData();
      }
    });
  }

  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      closeMobileSidebar();
      if (confirmClearModal) {
        if (clearConfirmInput) clearConfirmInput.value = '';
        if (confirmClearBtn) confirmClearBtn.disabled = true;
        confirmClearModal.classList.remove('hidden');
        if (clearConfirmInput) clearConfirmInput.focus();
      }
    });
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}

// Start Application
init();
