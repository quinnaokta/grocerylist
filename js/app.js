// Smart Grocery & Budget Safety Tracker - Core Application Logic

(function () {
  'use strict';

  // State Management
  let state = {
    activeItems: [],
    budgetLimit: 450000,
    historyTrips: [],
    benchmarks: {},
    currentTab: 'viewBelanja',
    selectedCategory: 'all',
    searchQuery: '',
    historySubTab: 'trips',
    deferredPrompt: null,
    editingItemId: null,
    currentDiscountType: 'none', // 'none' | 'regular' | 'stacked'
    currentUser: null,
    authTab: 'login', // 'login' | 'register'
    soundEnabled: true
  };

  // DOM Elements Cache
  const el = {
    viewport: document.getElementById('viewport'),
    groceryListContainer: document.getElementById('groceryListContainer'),
    emptyState: document.getElementById('emptyState'),
    categoryChips: document.getElementById('categoryChips'),
    searchItemInput: document.getElementById('searchItemInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    listCounterLabel: document.getElementById('listCounterLabel'),
    listCheckedStatus: document.getElementById('listCheckedStatus'),
    toggleCheckAllBtn: document.getElementById('toggleCheckAllBtn'),
    toggleCheckAllText: document.getElementById('toggleCheckAllText'),
    openAddItemBtn: document.getElementById('openAddItemBtn'),
    emptyAddBtn: document.getElementById('emptyAddBtn'),

    // User Header Pill
    headerUserBtn: document.getElementById('headerUserBtn'),
    headerUserAvatar: document.getElementById('headerUserAvatar'),
    headerUserName: document.getElementById('headerUserName'),

    // Budget Header Elements
    headerSpentText: document.getElementById('headerSpentText'),
    headerLimitText: document.getElementById('headerLimitText'),
    headerRemainingText: document.getElementById('headerRemainingText'),
    budgetProgressBar: document.getElementById('budgetProgressBar'),
    budgetStatusPill: document.getElementById('budgetStatusPill'),
    budgetStatusText: document.getElementById('budgetStatusText'),
    budgetWarningBanner: document.getElementById('budgetWarningBanner'),
    budgetWarningText: document.getElementById('budgetWarningText'),
    budgetCardClickable: document.getElementById('budgetCardClickable'),

    // Trolley Summary Bar
    trolleySummaryBar: document.getElementById('trolleySummaryBar'),
    summaryCartBadge: document.getElementById('summaryCartBadge'),
    summarySavingsBadge: document.getElementById('summarySavingsBadge'),
    summaryTotalAmount: document.getElementById('summaryTotalAmount'),
    finishShoppingBtn: document.getElementById('finishShoppingBtn'),

    // Bottom Navigation
    bottomNav: document.getElementById('bottomNav'),
    navCartCount: document.getElementById('navCartCount'),
    navAkun: document.getElementById('navAkun'),
    navAkunLabel: document.getElementById('navAkunLabel'),

    // Item Modal Elements
    itemModal: document.getElementById('itemModal'),
    modalTitle: document.getElementById('modalTitle'),
    closeItemModalBtn: document.getElementById('closeItemModalBtn'),
    cancelItemModalBtn: document.getElementById('cancelItemModalBtn'),
    saveItemModalBtn: document.getElementById('saveItemModalBtn'),
    saveBtnText: document.getElementById('saveBtnText'),
    itemSuggestionsScroll: document.getElementById('itemSuggestionsScroll'),
    inputItemName: document.getElementById('inputItemName'),
    inputCategory: document.getElementById('inputCategory'),
    inputUnit: document.getElementById('inputUnit'),
    inputQty: document.getElementById('inputQty'),
    modalQtyMinus: document.getElementById('modalQtyMinus'),
    modalQtyPlus: document.getElementById('modalQtyPlus'),
    inputUnitPrice: document.getElementById('inputUnitPrice'),
    priceComparisonNotice: document.getElementById('priceComparisonNotice'),
    disTabNone: document.getElementById('disTabNone'),
    disTabRegular: document.getElementById('disTabRegular'),
    disTabStacked: document.getElementById('disTabStacked'),
    regularDiscountInputs: document.getElementById('regularDiscountInputs'),
    inputDiscountMode: document.getElementById('inputDiscountMode'),
    inputDiscountValue: document.getElementById('inputDiscountValue'),
    stackedDiscountInputs: document.getElementById('stackedDiscountInputs'),
    inputStacked1: document.getElementById('inputStacked1'),
    inputStacked2: document.getElementById('inputStacked2'),
    discountLiveCalculation: document.getElementById('discountLiveCalculation'),
    liveNormalTotal: document.getElementById('liveNormalTotal'),
    liveSavingsRow: document.getElementById('liveSavingsRow'),
    liveTotalSavings: document.getElementById('liveTotalSavings'),
    liveFinalSubtotal: document.getElementById('liveFinalSubtotal'),
    inputItemNote: document.getElementById('inputItemNote'),

    // Checkout Modal
    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckoutModalBtn: document.getElementById('closeCheckoutModalBtn'),
    cancelCheckoutBtn: document.getElementById('cancelCheckoutBtn'),
    confirmCheckoutBtn: document.getElementById('confirmCheckoutBtn'),
    checkoutTotalAmount: document.getElementById('checkoutTotalAmount'),
    checkoutBudgetLimit: document.getElementById('checkoutBudgetLimit'),
    checkoutTotalSaved: document.getElementById('checkoutTotalSaved'),
    checkoutStatusLabel: document.getElementById('checkoutStatusLabel'),
    checkoutTripTitle: document.getElementById('checkoutTripTitle'),

    // Trip Detail Modal
    tripDetailModal: document.getElementById('tripDetailModal'),
    closeTripDetailBtn: document.getElementById('closeTripDetailBtn'),
    closeTripDetailFooterBtn: document.getElementById('closeTripDetailFooterBtn'),
    tripDetailTitle: document.getElementById('tripDetailTitle'),
    tripDetailDate: document.getElementById('tripDetailDate'),
    tripDetailItemsList: document.getElementById('tripDetailItemsList'),

    // Help Modal
    helpModal: document.getElementById('helpModal'),
    headerInfoBtn: document.getElementById('headerInfoBtn'),
    closeHelpModalBtn: document.getElementById('closeHelpModalBtn'),
    closeHelpFooterBtn: document.getElementById('closeHelpFooterBtn'),

    // Sound Toggle
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),

    // Riwayat Screen Elements
    viewRiwayat: document.getElementById('viewRiwayat'),
    histTotalSpent: document.getElementById('histTotalSpent'),
    histTotalSavings: document.getElementById('histTotalSavings'),
    histTripCount: document.getElementById('histTripCount'),
    subtabTrips: document.getElementById('subtabTrips'),
    subtabCatalog: document.getElementById('subtabCatalog'),
    historyTripsContainer: document.getElementById('historyTripsContainer'),
    historyCatalogContainer: document.getElementById('historyCatalogContainer'),
    catalogItemsList: document.getElementById('catalogItemsList'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),

    // Anggaran Screen Elements
    viewAnggaran: document.getElementById('viewAnggaran'),
    budgetLimitInput: document.getElementById('budgetLimitInput'),
    saveBudgetLimitBtn: document.getElementById('saveBudgetLimitBtn'),
    budgetCardLimit: document.getElementById('budgetCardLimit'),
    budgetCardCurrent: document.getElementById('budgetCardCurrent'),
    budgetCardRemainder: document.getElementById('budgetCardRemainder'),
    budgetCardPercent: document.getElementById('budgetCardPercent'),

    // Akun & Auth Screen Elements
    viewAkun: document.getElementById('viewAkun'),
    authLoggedInView: document.getElementById('authLoggedInView'),
    authLoggedOutView: document.getElementById('authLoggedOutView'),
    profileBigAvatar: document.getElementById('profileBigAvatar'),
    profileFullName: document.getElementById('profileFullName'),
    profileRoleBadge: document.getElementById('profileRoleBadge'),
    profileEmail: document.getElementById('profileEmail'),
    profileLocation: document.getElementById('profileLocation'),
    profileBudgetLimit: document.getElementById('profileBudgetLimit'),
    profileTripCount: document.getElementById('profileTripCount'),
    profileTotalSpent: document.getElementById('profileTotalSpent'),
    quickSwitchChips: document.getElementById('quickSwitchChips'),
    tabBtnLogin: document.getElementById('tabBtnLogin'),
    tabBtnRegister: document.getElementById('tabBtnRegister'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    toggleLoginPasswordBtn: document.getElementById('toggleLoginPasswordBtn'),
    loginEyeIcon: document.getElementById('loginEyeIcon'),
    submitLoginBtn: document.getElementById('submitLoginBtn'),
    regName: document.getElementById('regName'),
    regEmail: document.getElementById('regEmail'),
    regPassword: document.getElementById('regPassword'),
    toggleRegPasswordBtn: document.getElementById('toggleRegPasswordBtn'),
    regEyeIcon: document.getElementById('regEyeIcon'),
    regRole: document.getElementById('regRole'),
    regCity: document.getElementById('regCity'),
    regBudget: document.getElementById('regBudget'),
    submitRegisterBtn: document.getElementById('submitRegisterBtn'),
    quickLoginBudi: document.getElementById('quickLoginBudi'),
    quickLoginSiti: document.getElementById('quickLoginSiti'),
    btnLogoutUser: document.getElementById('btnLogoutUser'),
    menuSetBudgetBtn: document.getElementById('menuSetBudgetBtn'),
    menuSwitchAccountBtn: document.getElementById('menuSwitchAccountBtn'),
    menuSoundToggleBtn: document.getElementById('menuSoundToggleBtn'),
    menuSoundStatus: document.getElementById('menuSoundStatus'),
    forgotPassBtn: document.getElementById('forgotPassBtn'),

    // PWA & Toast
    pwaBanner: document.getElementById('pwaBanner'),
    pwaInstallBtn: document.getElementById('pwaInstallBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper: Format Indonesian Rupiah
  function formatRp(num) {
    const val = Math.round(Number(num) || 0);
    return 'Rp ' + val.toLocaleString('id-ID');
  }

  // Helper: Calculate Item Pricing & Discounts
  function calculateItemPricing(item) {
    const qty = Math.max(1, Number(item.qty) || 1);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const normalTotal = qty * unitPrice;
    let finalUnitPrice = unitPrice;

    if (item.discountType === 'percent') {
      const p = Math.min(100, Math.max(0, Number(item.discountValue) || 0));
      finalUnitPrice = unitPrice * (1 - p / 100);
    } else if (item.discountType === 'amount') {
      const a = Math.max(0, Number(item.discountValue) || 0);
      finalUnitPrice = Math.max(0, unitPrice - a);
    } else if (item.discountType === 'stacked') {
      const p1 = Math.min(100, Math.max(0, Number(item.stackedDiscount?.val1) || 0));
      const p2 = Math.min(100, Math.max(0, Number(item.stackedDiscount?.val2) || 0));
      const priceAfterFirst = unitPrice * (1 - p1 / 100);
      finalUnitPrice = priceAfterFirst * (1 - p2 / 100);
    }

    finalUnitPrice = Math.round(finalUnitPrice);
    const finalSubtotal = Math.round(qty * finalUnitPrice);
    const totalSavings = Math.max(0, normalTotal - finalSubtotal);

    return {
      qty,
      unitPrice,
      normalTotal,
      finalUnitPrice,
      finalSubtotal,
      totalSavings
    };
  }

  // Price Trend Detector vs Historical Benchmarks
  function detectPriceTrend(itemName, currentUnitPrice) {
    const key = (itemName || '').trim().toLowerCase();
    const benchmark = state.benchmarks[key];

    if (!benchmark || !benchmark.lastPrice) {
      return { status: 'new', label: 'Item Baru', diff: 0, percent: 0 };
    }

    const pastPrice = Number(benchmark.lastPrice);
    const diff = currentUnitPrice - pastPrice;

    if (diff === 0) {
      return {
        status: 'stable',
        label: 'Stabil vs ' + (benchmark.previousMonth || 'lalu'),
        diff: 0,
        percent: 0,
        pastPrice
      };
    } else if (diff < 0) {
      const pct = Math.abs(Math.round((diff / pastPrice) * 100));
      return {
        status: 'drop',
        label: `Turun ${formatRp(Math.abs(diff))} (-${pct}%)`,
        diff,
        percent: pct,
        pastPrice,
        period: benchmark.previousMonth
      };
    } else {
      const pct = Math.abs(Math.round((diff / pastPrice) * 100));
      return {
        status: 'up',
        label: `Naik ${formatRp(diff)} (+${pct}%)`,
        diff,
        percent: pct,
        pastPrice,
        period: benchmark.previousMonth
      };
    }
  }

  // Native-style Toast Notifications
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'danger') iconName = 'alert-octagon';

    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span>${message}</span>
    `;
    el.toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // App Initialization
  function initApp() {
    loadData();
    renderUserProfile();
    renderCategoryChips();
    renderSuggestionsPills();
    renderGroceryList();
    updateBudgetSafetyMeter();
    renderHistoryScreen();
    renderAnggaranScreen();
    bindEvents();
    initPWA();
    if (window.lucide) window.lucide.createIcons();
  }

  // Load Data from LocalStorage
  function loadData() {
    state.currentUser = window.SmartData.SmartStorage.getCurrentUser();
    state.activeItems = window.SmartData.SmartStorage.getActiveItems();
    state.budgetLimit = window.SmartData.SmartStorage.getBudgetLimit();
    state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
    state.benchmarks = window.SmartData.SmartStorage.getBenchmarks();
  }

  // Render Horizontal Category Chips Carousel
  function renderCategoryChips() {
    el.categoryChips.innerHTML = '';
    window.SmartData.CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `category-chip ${state.selectedCategory === cat.id ? 'active' : ''}`;
      chip.innerHTML = `<span>${cat.name}</span>`;
      chip.addEventListener('click', () => {
        state.selectedCategory = cat.id;
        renderCategoryChips();
        renderGroceryList();
        if (window.soundCtrl) window.soundCtrl.playTick();
      });
      el.categoryChips.appendChild(chip);
    });
  }

  // Render Autocomplete Suggestions for Modal
  function renderSuggestionsPills() {
    el.itemSuggestionsScroll.innerHTML = '';
    window.SmartData.GROCERY_SUGGESTIONS.forEach(sug => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'suggestion-pill';
      pill.textContent = sug.name;
      pill.addEventListener('click', () => {
        el.inputItemName.value = sug.name;
        el.inputCategory.value = sug.category;
        el.inputUnit.value = sug.unit;
        el.inputUnitPrice.value = sug.defaultPrice;
        updateModalCalculations();
        checkModalPriceComparison();
        if (window.soundCtrl) window.soundCtrl.playPop();
      });
      el.itemSuggestionsScroll.appendChild(pill);
    });
  }

  // Render Grocery Cards (Modern Sebaris / Single-Row Ergonomic Layout)
  function renderGroceryList() {
    el.groceryListContainer.innerHTML = '';

    // Filter items by category & search query
    let filtered = state.activeItems.filter(item => {
      const matchCat = state.selectedCategory === 'all' || item.category === state.selectedCategory;
      const matchSearch = !state.searchQuery || item.name.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    const checkedCount = state.activeItems.filter(i => i.inCart).length;

    // Update list count labels
    el.listCounterLabel.textContent = `${filtered.length} Barang Belanja`;
    if (el.listCheckedStatus) {
      el.listCheckedStatus.textContent = checkedCount > 0 ? `• ${checkedCount} Siap Beli` : '• Belum ada dipilih';
    }
    if (el.toggleCheckAllText) {
      el.toggleCheckAllText.textContent = (checkedCount === state.activeItems.length && state.activeItems.length > 0) ? 'Batal Semua' : 'Pilih Semua';
    }
    el.navCartCount.textContent = state.activeItems.length;

    if (filtered.length === 0) {
      el.emptyState.style.display = 'block';
    } else {
      el.emptyState.style.display = 'none';

      filtered.forEach(item => {
        const pricing = calculateItemPricing(item);
        const trend = detectPriceTrend(item.name, item.unitPrice);
        const catObj = window.SmartData.CATEGORIES.find(c => c.id === item.category) || { name: item.category };

        const card = document.createElement('div');
        card.className = `grocery-card ${item.inCart ? 'in-cart' : ''}`;
        card.dataset.id = item.id;

        // Discount tag text
        let discountBadgeHtml = '';
        if (item.discountType === 'percent') {
          discountBadgeHtml = `<span class="discount-applied-badge"><i data-lucide="tag" style="width: 10px; height: 10px;"></i> ${item.discountValue}% Off</span>`;
        } else if (item.discountType === 'amount') {
          discountBadgeHtml = `<span class="discount-applied-badge"><i data-lucide="tag" style="width: 10px; height: 10px;"></i> -${formatRp(item.discountValue)}</span>`;
        } else if (item.discountType === 'stacked') {
          const s1 = item.stackedDiscount?.val1 || 0;
          const s2 = item.stackedDiscount?.val2 || 0;
          discountBadgeHtml = `<span class="discount-applied-badge"><i data-lucide="layers" style="width: 10px; height: 10px;"></i> ${s1}%+${s2}%</span>`;
        }

        // Price trend badge HTML
        let trendBadgeHtml = '';
        if (trend.status === 'drop') {
          trendBadgeHtml = `<span class="price-trend-tag drop" title="${trend.label}"><i data-lucide="trending-down" style="width: 10px; height: 10px;"></i> Turun</span>`;
        } else if (trend.status === 'up') {
          trendBadgeHtml = `<span class="price-trend-tag up" title="${trend.label}"><i data-lucide="trending-up" style="width: 10px; height: 10px;"></i> Naik</span>`;
        }

        card.innerHTML = `
          <!-- 1. Tombol Centang Beli (Left) -->
          <button class="cart-check-btn ${item.inCart ? 'checked' : ''}" data-action="toggle-cart" title="${item.inCart ? 'Dicentang untuk dibeli (Klik untuk batalkan)' : 'Klik centang saat ingin beli barang ini'}" aria-label="Tandai Beli">
            <i data-lucide="check" style="width: 17px; height: 17px;"></i>
          </button>
          
          <!-- 2. Informasi Barang Tengah (Sebaris & Padat) -->
          <div class="card-center-info">
            <div class="card-name-row">
              <span class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
              ${item.inCart ? '<span class="pill-in-cart"><i data-lucide="shopping-bag" style="width: 9px; height: 9px;"></i> Siap Beli</span>' : ''}
            </div>
            <div class="card-sub-row">
              <span class="item-price-at">@ ${formatRp(pricing.finalUnitPrice)}/${item.unit || 'pcs'}</span>
              <span class="sub-sep">•</span>
              <span class="category-tag-mini">${catObj.name}</span>
              ${trendBadgeHtml}
              ${discountBadgeHtml}
            </div>
            ${item.note ? `<div class="item-note-inline"><em>Catatan: ${escapeHtml(item.note)}</em></div>` : ''}
          </div>

          <!-- 3. Stepper & Subtotal Kanan (Sebaris) -->
          <div class="card-right-group">
            <div class="stepper-control-compact">
              <button class="stepper-btn-compact" data-action="qty-minus" aria-label="Kurangi Jumlah">−</button>
              <span class="stepper-value-compact">${item.qty}</span>
              <button class="stepper-btn-compact" data-action="qty-plus" aria-label="Tambah Jumlah">+</button>
            </div>
            <div class="card-price-stack">
              ${pricing.totalSavings > 0 ? `<div class="card-original-price">${formatRp(pricing.normalTotal)}</div>` : ''}
              <div class="card-final-subtotal">${formatRp(pricing.finalSubtotal)}</div>
            </div>
          </div>

          <!-- 4. Quick Mini Actions (Edit & Hapus) -->
          <div class="card-mini-actions-row">
            <button class="card-action-icon-btn" data-action="edit" title="Edit Barang" aria-label="Edit">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
            </button>
            <button class="card-action-icon-btn delete" data-action="delete" title="Hapus Barang" aria-label="Hapus">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        `;

        // Card button click delegation
        card.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-action]');
          if (!btn) return;
          const action = btn.dataset.action;

          if (action === 'toggle-cart') {
            item.inCart = !item.inCart;
            saveAndRefresh();
            if (window.soundCtrl) window.soundCtrl.playPop();
            if (item.inCart) {
              showToast(`"${item.name}" dicentang siap beli!`, 'success');
            }
          } else if (action === 'qty-plus') {
            item.qty = (Number(item.qty) || 1) + 1;
            saveAndRefresh();
            if (window.soundCtrl) window.soundCtrl.playTick();
          } else if (action === 'qty-minus') {
            if (item.qty > 1) {
              item.qty -= 1;
              saveAndRefresh();
              if (window.soundCtrl) window.soundCtrl.playTick();
            } else {
              // Confirm removal if qty reaches 0
              if (confirm(`Hapus "${item.name}" dari daftar belanja?`)) {
                deleteItem(item.id);
              }
            }
          } else if (action === 'edit') {
            openEditItemModal(item);
          } else if (action === 'delete') {
            if (confirm(`Hapus "${item.name}"?`)) {
              deleteItem(item.id);
            }
          }
        });

        el.groceryListContainer.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons({ root: el.groceryListContainer });
  }

  // Toggle Check All items (Pilih Semua / Batal Semua)
  function toggleCheckAll() {
    if (state.activeItems.length === 0) {
      showToast('Daftar belanja masih kosong!', 'warning');
      return;
    }
    const allChecked = state.activeItems.every(i => i.inCart);
    const newStatus = !allChecked;
    state.activeItems.forEach(i => {
      i.inCart = newStatus;
    });
    saveAndRefresh();
    if (window.soundCtrl) window.soundCtrl.playPop();
    showToast(newStatus ? 'Semua barang dicentang siap beli!' : 'Semua centang dibatalkan', 'info');
  }

  // Delete Item helper
  function deleteItem(itemId) {
    state.activeItems = state.activeItems.filter(i => i.id !== itemId);
    saveAndRefresh();
    showToast('Barang berhasil dihapus', 'warning');
    if (window.soundCtrl) window.soundCtrl.playTick();
  }

  // Update Budget Safety Tracker & Sticky Summary Bar
  function updateBudgetSafetyMeter() {
    let totalPlanSpent = 0;
    let totalPlanSavings = 0;
    let checkedCount = 0;
    let checkedSpent = 0;
    let checkedSavings = 0;

    state.activeItems.forEach(item => {
      const p = calculateItemPricing(item);
      totalPlanSpent += p.finalSubtotal;
      totalPlanSavings += p.totalSavings;
      if (item.inCart) {
        checkedCount++;
        checkedSpent += p.finalSubtotal;
        checkedSavings += p.totalSavings;
      }
    });

    const limit = state.budgetLimit || 450000;
    // Current spending evaluates the items selected to be bought in trolley!
    const activeSpent = checkedCount > 0 ? checkedSpent : totalPlanSpent;
    const ratio = activeSpent / limit;
    const percent = Math.round(ratio * 100);
    const remainder = limit - activeSpent;

    // Header Display
    el.headerSpentText.textContent = formatRp(activeSpent);
    el.headerLimitText.textContent = ` / ${formatRp(limit)}`;

    // Progress Bar Width & Color
    const barWidth = Math.min(100, percent);
    el.budgetProgressBar.style.width = `${barWidth}%`;

    // Status Pill & Banner logic
    if (ratio < 0.8) {
      // SAFE (< 80%)
      el.budgetProgressBar.style.backgroundColor = 'var(--safe-green)';
      el.budgetStatusPill.className = 'budget-status-pill status-safe';
      el.budgetStatusPill.innerHTML = `<i data-lucide="check-circle" style="width: 12px; height: 12px;"></i><span>Aman (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--safe-green)';
      el.headerRemainingText.textContent = checkedCount > 0 ? `Sisa ${formatRp(remainder)} (${checkedCount} dibeli)` : `Sisa ${formatRp(remainder)}`;
      el.budgetWarningBanner.style.display = 'none';
    } else if (ratio <= 1.0) {
      // WARNING (80% - 100%)
      el.budgetProgressBar.style.backgroundColor = 'var(--warn-amber)';
      el.budgetStatusPill.className = 'budget-status-pill status-warning';
      el.budgetStatusPill.innerHTML = `<i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i><span>Waspada (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--warn-amber)';
      el.headerRemainingText.textContent = `Tersisa ${formatRp(remainder)}`;
      el.budgetWarningBanner.style.display = 'flex';
      el.budgetWarningBanner.className = 'alert-banner warning';
      el.budgetWarningText.textContent = `Mendekati limit! Belanjaan troli sudah ${percent}% dari anggaran bulanan.`;
    } else {
      // DANGER / OVERBUDGET (> 100%)
      el.budgetProgressBar.style.backgroundColor = 'var(--danger-rose)';
      el.budgetStatusPill.className = 'budget-status-pill status-danger';
      el.budgetStatusPill.innerHTML = `<i data-lucide="alert-octagon" style="width: 12px; height: 12px;"></i><span>Overbudget (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--danger-rose)';
      el.headerRemainingText.textContent = `Lebih ${formatRp(Math.abs(remainder))}!`;
      el.budgetWarningBanner.style.display = 'flex';
      el.budgetWarningBanner.className = 'alert-banner danger';
      el.budgetWarningText.textContent = `🚨 OVERBUDGET! Belanjaan troli melebihi batas anggaran sebesar ${formatRp(Math.abs(remainder))}.`;
    }

    // Sticky Summary Cart Bar (Above Bottom Navigation)
    if (checkedCount > 0) {
      el.summaryCartBadge.textContent = `${checkedCount}/${state.activeItems.length} Siap Beli`;
      el.summaryTotalAmount.textContent = formatRp(checkedSpent);
      el.summarySavingsBadge.textContent = checkedSavings > 0 ? `Hemat ${formatRp(checkedSavings)}` : 'Harga Normal';
    } else {
      el.summaryCartBadge.textContent = `0/${state.activeItems.length} Belum Dicentang`;
      el.summaryTotalAmount.textContent = 'Rp 0';
      el.summarySavingsBadge.textContent = 'Centang barang untuk dibeli';
    }

    // List header counter & status
    if (el.listCheckedStatus) {
      el.listCheckedStatus.textContent = checkedCount > 0 ? `• ${checkedCount} Siap Beli` : '• Belum ada dipilih';
    }
    if (el.toggleCheckAllText) {
      el.toggleCheckAllText.textContent = (checkedCount === state.activeItems.length && state.activeItems.length > 0) ? 'Batal Semua' : 'Pilih Semua';
    }

    if (window.lucide) {
      window.lucide.createIcons({ root: el.budgetStatusPill });
      window.lucide.createIcons({ root: el.budgetWarningBanner });
    }
  }

  // Save changes to localStorage and refresh views
  function saveAndRefresh() {
    window.SmartData.SmartStorage.saveActiveItems(state.activeItems);
    renderGroceryList();
    updateBudgetSafetyMeter();
    renderAnggaranScreen();
  }

  // Escape HTML string
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // ==========================================
  // MODAL: ADD / EDIT ITEM & DISCOUNT SIMULATOR
  // ==========================================

  function openAddItemModal() {
    state.editingItemId = null;
    if (el.modalTitle) el.modalTitle.textContent = 'Tambah Belanjaan Baru';
    if (el.saveBtnText) el.saveBtnText.textContent = 'Simpan ke Troli';
    if (el.inputItemName) el.inputItemName.value = '';
    if (el.inputCategory) el.inputCategory.value = 'bahan_pokok';
    if (el.inputUnit) el.inputUnit.value = 'pcs';
    if (el.inputQty) el.inputQty.value = 1;
    if (el.inputUnitPrice) el.inputUnitPrice.value = '';
    if (el.inputItemNote) el.inputItemNote.value = '';

    setDiscountTab('none');
    updateModalCalculations();
    checkModalPriceComparison();

    if (el.itemModal) el.itemModal.classList.add('open');
    setTimeout(() => {
      if (el.inputItemName) el.inputItemName.focus();
    }, 150);
  }

  function openEditItemModal(item) {
    state.editingItemId = item.id;
    if (el.modalTitle) el.modalTitle.textContent = 'Edit Barang Belanja';
    if (el.saveBtnText) el.saveBtnText.textContent = 'Perbarui Barang';
    el.inputItemName.value = item.name;
    el.inputCategory.value = item.category;
    el.inputUnit.value = item.unit;
    el.inputQty.value = item.qty;
    el.inputUnitPrice.value = item.unitPrice;
    el.inputItemNote.value = item.note || '';

    if (item.discountType === 'percent') {
      setDiscountTab('regular');
      el.inputDiscountMode.value = 'percent';
      el.inputDiscountValue.value = item.discountValue;
    } else if (item.discountType === 'amount') {
      setDiscountTab('regular');
      el.inputDiscountMode.value = 'amount';
      el.inputDiscountValue.value = item.discountValue;
    } else if (item.discountType === 'stacked') {
      setDiscountTab('stacked');
      el.inputStacked1.value = item.stackedDiscount?.val1 || 0;
      el.inputStacked2.value = item.stackedDiscount?.val2 || 0;
    } else {
      setDiscountTab('none');
    }

    updateModalCalculations();
    checkModalPriceComparison();
    el.itemModal.classList.add('open');
  }

  function closeItemModal() {
    el.itemModal.classList.remove('open');
  }

  function setDiscountTab(type) {
    state.currentDiscountType = type;
    el.disTabNone.classList.toggle('active', type === 'none');
    el.disTabRegular.classList.toggle('active', type === 'regular');
    el.disTabStacked.classList.toggle('active', type === 'stacked');

    el.regularDiscountInputs.style.display = type === 'regular' ? 'block' : 'none';
    el.stackedDiscountInputs.style.display = type === 'stacked' ? 'block' : 'none';

    updateModalCalculations();
  }

  // Live Reactive Discount Simulator Calculation inside Modal
  function updateModalCalculations() {
    const qty = Math.max(1, Number(el.inputQty.value) || 1);
    const unitPrice = Math.max(0, Number(el.inputUnitPrice.value) || 0);
    const normalTotal = qty * unitPrice;
    let finalUnitPrice = unitPrice;

    if (state.currentDiscountType === 'regular') {
      const mode = el.inputDiscountMode.value;
      const val = Math.max(0, Number(el.inputDiscountValue.value) || 0);
      if (mode === 'percent') {
        finalUnitPrice = unitPrice * (1 - Math.min(100, val) / 100);
      } else {
        finalUnitPrice = Math.max(0, unitPrice - val);
      }
    } else if (state.currentDiscountType === 'stacked') {
      const p1 = Math.min(100, Math.max(0, Number(el.inputStacked1.value) || 0));
      const p2 = Math.min(100, Math.max(0, Number(el.inputStacked2.value) || 0));
      const price1 = unitPrice * (1 - p1 / 100);
      finalUnitPrice = price1 * (1 - p2 / 100);
    }

    finalUnitPrice = Math.round(finalUnitPrice);
    const finalSubtotal = Math.round(qty * finalUnitPrice);
    const totalSavings = Math.max(0, normalTotal - finalSubtotal);

    el.liveNormalTotal.textContent = formatRp(normalTotal);
    el.liveFinalSubtotal.textContent = formatRp(finalSubtotal);

    if (totalSavings > 0) {
      el.liveSavingsRow.style.display = 'flex';
      el.liveTotalSavings.textContent = `- ${formatRp(totalSavings)}`;
    } else {
      el.liveSavingsRow.style.display = 'none';
    }
  }

  // Real-time Price Comparison Insight inside Modal
  function checkModalPriceComparison() {
    const name = el.inputItemName.value;
    const price = Number(el.inputUnitPrice.value) || 0;
    if (!name.trim() || price <= 0) {
      el.priceComparisonNotice.style.display = 'none';
      return;
    }

    const trend = detectPriceTrend(name, price);
    el.priceComparisonNotice.style.display = 'block';

    if (trend.status === 'drop') {
      el.priceComparisonNotice.innerHTML = `
        <div style="padding: 8px 12px; background: #E8F7F0; border-radius: 12px; font-size: 11.5px; color: #059669; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="trending-down" style="width: 16px; height: 16px;"></i>
          <span><strong>Kabar Baik!</strong> Harga lebih murah ${formatRp(Math.abs(trend.diff))} (${trend.percent}%) dibanding bulan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else if (trend.status === 'up') {
      el.priceComparisonNotice.innerHTML = `
        <div style="padding: 8px 12px; background: #FFE8ED; border-radius: 12px; font-size: 11.5px; color: #E11D48; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="trending-up" style="width: 16px; height: 16px;"></i>
          <span><strong>Perhatian:</strong> Harga naik ${formatRp(trend.diff)} (+${trend.percent}%) dibanding bulan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else if (trend.status === 'stable') {
      el.priceComparisonNotice.innerHTML = `
        <div style="padding: 8px 12px; background: #F3F4F6; border-radius: 12px; font-size: 11.5px; color: #4B5563; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="check" style="width: 16px; height: 16px;"></i>
          <span>Harga sama persis dengan catatan belanja bulan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else {
      el.priceComparisonNotice.innerHTML = `
        <div style="padding: 8px 12px; background: #EFF6FF; border-radius: 12px; font-size: 11.5px; color: #2563EB; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="info" style="width: 16px; height: 16px;"></i>
          <span>Item baru! Harga ini akan menjadi acuan perbandingan untuk belanja berikutnya.</span>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons({ root: el.priceComparisonNotice });
  }

  // Save Item from Modal
  function saveItemFromModal() {
    const name = el.inputItemName.value.trim();
    const category = el.inputCategory.value;
    const unit = el.inputUnit.value;
    const qty = Math.max(1, Number(el.inputQty.value) || 1);
    const unitPrice = Math.max(0, Number(el.inputUnitPrice.value) || 0);
    const note = el.inputItemNote.value.trim();

    if (!name) {
      showToast('Silakan masukkan nama barang belanjaan.', 'warning');
      if (el.inputItemName) el.inputItemName.focus();
      return;
    }

    // Determine discount fields
    let discountType = 'none';
    let discountValue = 0;
    let stackedDiscount = { val1: 0, val2: 0 };

    if (state.currentDiscountType === 'regular') {
      const mode = el.inputDiscountMode.value;
      const val = Math.max(0, Number(el.inputDiscountValue.value) || 0);
      if (val > 0) {
        discountType = mode;
        discountValue = val;
      }
    } else if (state.currentDiscountType === 'stacked') {
      const s1 = Math.max(0, Number(el.inputStacked1.value) || 0);
      const s2 = Math.max(0, Number(el.inputStacked2.value) || 0);
      if (s1 > 0 || s2 > 0) {
        discountType = 'stacked';
        stackedDiscount = { val1: s1, val2: s2 };
      }
    }

    if (state.editingItemId) {
      // Edit existing
      const idx = state.activeItems.findIndex(i => i.id === state.editingItemId);
      if (idx !== -1) {
        state.activeItems[idx] = {
          ...state.activeItems[idx],
          name,
          category,
          unit,
          qty,
          unitPrice,
          discountType,
          discountValue,
          stackedDiscount,
          note
        };
        showToast(`"${name}" berhasil diperbarui!`, 'success');
      }
    } else {
      // Add new
      const newItem = {
        id: 'item-' + Date.now(),
        name,
        category,
        unit,
        qty,
        unitPrice,
        discountType,
        discountValue,
        stackedDiscount,
        inCart: false,
        note
      };
      state.activeItems.unshift(newItem);
      showToast(`"${name}" masuk ke daftar belanja!`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    }

    closeItemModal();
    saveAndRefresh();
  }

  // ==========================================
  // CHECKOUT TRIP WORKFLOW
  // ==========================================

  function openCheckoutModal() {
    if (state.activeItems.length === 0) {
      showToast('Daftar belanja masih kosong!', 'warning');
      return;
    }

    const checkedItems = state.activeItems.filter(i => i.inCart);
    if (checkedItems.length === 0) {
      if (confirm('Belum ada barang yang dicentang. Apakah kamu ingin mencentang dan membeli SEMUA barang sekarang?')) {
        state.activeItems.forEach(i => i.inCart = true);
        saveAndRefresh();
        openCheckoutModal();
      } else {
        showToast('Centang tombol ✓ pada barang yang ingin kamu beli!', 'warning');
      }
      return;
    }

    let totalSpent = 0;
    let totalSaved = 0;
    checkedItems.forEach(item => {
      const p = calculateItemPricing(item);
      totalSpent += p.finalSubtotal;
      totalSaved += p.totalSavings;
    });

    const limit = state.budgetLimit;
    const now = new Date();
    const dateFormatted = `${now.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]} ${now.getFullYear()}`;

    el.checkoutTotalAmount.textContent = `${formatRp(totalSpent)} (${checkedItems.length} barang)`;
    el.checkoutBudgetLimit.textContent = formatRp(limit);
    el.checkoutTotalSaved.textContent = totalSaved > 0 ? formatRp(totalSaved) : 'Rp 0';
    el.checkoutTripTitle.value = `Belanja Bulanan Supermarket - ${dateFormatted}`;

    if (totalSpent <= limit) {
      el.checkoutStatusLabel.textContent = 'Aman & Terkendali';
      el.checkoutStatusLabel.style.color = 'var(--safe-green)';
    } else {
      const over = totalSpent - limit;
      el.checkoutStatusLabel.textContent = `Overbudget ${formatRp(over)}!`;
      el.checkoutStatusLabel.style.color = 'var(--danger-rose)';
    }

    el.checkoutModal.classList.add('open');
    if (window.soundCtrl) window.soundCtrl.playPop();
  }

  function confirmCheckout() {
    const checkedItems = state.activeItems.filter(i => i.inCart);
    if (checkedItems.length === 0) {
      showToast('Tidak ada barang yang dicentang untuk dibeli!', 'warning');
      return;
    }

    const title = el.checkoutTripTitle.value.trim() || 'Belanja Supermarket Rantau';
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    let totalSpent = 0;
    let totalSaved = 0;
    const tripItems = checkedItems.map(item => {
      const p = calculateItemPricing(item);
      totalSpent += p.finalSubtotal;
      totalSaved += p.totalSavings;

      // Update benchmark price catalog for next trips!
      window.SmartData.SmartStorage.updateBenchmark(
        item.name,
        p.finalUnitPrice,
        item.unit,
        item.category
      );

      return {
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        finalPrice: p.finalSubtotal,
        unitPrice: p.finalUnitPrice,
        category: item.category
      };
    });

    const newTrip = {
      id: 'trip-' + Date.now(),
      date: dateStr,
      title,
      totalSpent,
      totalBudget: state.budgetLimit,
      totalSaved,
      itemsCount: checkedItems.length,
      items: tripItems
    };

    // Save to history
    state.historyTrips.unshift(newTrip);
    window.SmartData.SmartStorage.saveHistoryTrips(state.historyTrips);

    // Refresh benchmarks state
    state.benchmarks = window.SmartData.SmartStorage.getBenchmarks();

    // Remove ONLY checked items, keep unchecked items in active trolley
    state.activeItems = state.activeItems.filter(i => !i.inCart);
    window.SmartData.SmartStorage.saveActiveItems(state.activeItems);

    el.checkoutModal.classList.remove('open');
    saveAndRefresh();
    renderHistoryScreen();
    renderUserProfile();

    // Celebrate checkout completion
    if (window.soundCtrl) window.soundCtrl.playSuccess();
    showToast(`${checkedItems.length} barang belanjaan berhasil disimpan ke riwayat!`, 'success');

    // Switch to Riwayat tab to view saved trip
    switchTab('viewRiwayat');
  }

  // ==========================================
  // RIWAYAT & KATALOG SCREEN
  // ==========================================

  function renderHistoryScreen() {
    let grandTotalSpent = 0;
    let grandTotalSaved = 0;

    state.historyTrips.forEach(t => {
      grandTotalSpent += Number(t.totalSpent) || 0;
      grandTotalSaved += Number(t.totalSaved) || 0;
    });

    el.histTotalSpent.textContent = formatRp(grandTotalSpent);
    el.histTotalSavings.textContent = formatRp(grandTotalSaved);
    el.histTripCount.textContent = `${state.historyTrips.length} Kali Belanja`;

    renderHistoryTripsList();
    renderCatalogPricesList();
  }

  function renderHistoryTripsList() {
    el.historyTripsContainer.innerHTML = '';

    if (state.historyTrips.length === 0) {
      el.historyTripsContainer.innerHTML = `
        <div class="empty-state">
          <i data-lucide="calendar" style="width: 32px; height: 32px; color: var(--text-soft);"></i>
          <p style="margin-top: 8px;">Belum ada riwayat belanja yang disimpan.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ root: el.historyTripsContainer });
      return;
    }

    state.historyTrips.forEach(trip => {
      const card = document.createElement('div');
      card.className = 'history-trip-card';
      const isOver = trip.totalSpent > trip.totalBudget;

      card.innerHTML = `
        <div class="trip-header-row">
          <div class="trip-title">${escapeHtml(trip.title)}</div>
          <div class="trip-date">${trip.date}</div>
        </div>
        <div class="trip-meta-row" style="margin-bottom: 8px;">
          <div>
            <strong style="color: var(--text-main); font-size: 14px;">${formatRp(trip.totalSpent)}</strong>
            <span style="font-size: 11px; color: var(--text-soft);"> / Pagu ${formatRp(trip.totalBudget)}</span>
          </div>
          <span class="trip-items-pill">${trip.itemsCount || (trip.items ? trip.items.length : 0)} Barang</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
          <span style="color: ${isOver ? 'var(--danger-rose)' : 'var(--safe-green)'}; font-weight: 700;">
            ${isOver ? 'Overbudget' : 'Dompet Aman'} • Hemat ${formatRp(trip.totalSaved || 0)}
          </span>
          <button class="mini-action-btn" style="color: var(--primary); font-weight: 700; width: auto; padding: 2px 8px; font-size: 11.5px;" data-tripid="${trip.id}">
            Lihat Rincian <i data-lucide="chevron-right" style="width: 14px; height: 14px; vertical-align: middle;"></i>
          </button>
        </div>
      `;

      card.querySelector('[data-tripid]').addEventListener('click', () => {
        openTripDetail(trip);
      });

      el.historyTripsContainer.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons({ root: el.historyTripsContainer });
  }

  function renderCatalogPricesList() {
    el.catalogItemsList.innerHTML = '';
    const keys = Object.keys(state.benchmarks);

    if (keys.length === 0) {
      el.catalogItemsList.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 20px;">Belum ada katalog harga pasar.</p>`;
      return;
    }

    keys.forEach(k => {
      const b = state.benchmarks[k];
      const card = document.createElement('div');
      card.className = 'catalog-item-card';
      const catObj = window.SmartData.CATEGORIES.find(c => c.id === b.category) || { name: b.category || 'Barang' };

      card.innerHTML = `
        <div>
          <div style="font-size: 13.5px; font-weight: 700; text-transform: capitalize; color: var(--text-main);">${escapeHtml(k)}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${catObj.name} • Terakhir: ${b.previousMonth || 'Bulan ini'}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: 800; color: var(--primary);">${formatRp(b.lastPrice)}</div>
          <div style="font-size: 11px; color: var(--text-soft);">per ${b.unit || 'pcs'}</div>
        </div>
      `;
      el.catalogItemsList.appendChild(card);
    });
  }

  function openTripDetail(trip) {
    el.tripDetailTitle.textContent = trip.title;
    el.tripDetailDate.textContent = `Tanggal Belanja: ${trip.date} • Total: ${formatRp(trip.totalSpent)}`;
    el.tripDetailItemsList.innerHTML = '';

    if (trip.items && trip.items.length > 0) {
      trip.items.forEach(it => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 10px; background: #FAF5F7; border-radius: 10px; font-size: 12.5px;';
        row.innerHTML = `
          <div>
            <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(it.name)}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${it.qty} ${it.unit}</div>
          </div>
          <div style="font-weight: 800; color: var(--primary);">
            ${formatRp(it.finalPrice || it.unitPrice * it.qty)}
          </div>
        `;
        el.tripDetailItemsList.appendChild(row);
      });
    } else {
      el.tripDetailItemsList.innerHTML = `<p style="font-size: 12px; color: var(--text-muted);">Tidak ada rincian barang.</p>`;
    }

    el.tripDetailModal.classList.add('open');
  }

  // ==========================================
  // ANGGARAN SCREEN
  // ==========================================

  function renderAnggaranScreen() {
    el.budgetLimitInput.value = state.budgetLimit;
    el.budgetCardLimit.textContent = formatRp(state.budgetLimit);

    let totalSpent = 0;
    state.activeItems.forEach(item => {
      const p = calculateItemPricing(item);
      totalSpent += p.finalSubtotal;
    });

    const remainder = state.budgetLimit - totalSpent;
    const pct = Math.round((totalSpent / state.budgetLimit) * 100);

    el.budgetCardCurrent.textContent = formatRp(totalSpent);
    el.budgetCardRemainder.textContent = remainder >= 0 ? formatRp(remainder) : `Lebih ${formatRp(Math.abs(remainder))}`;
    el.budgetCardRemainder.style.color = remainder >= 0 ? 'var(--safe-green)' : 'var(--danger-rose)';
    el.budgetCardPercent.textContent = `${pct}%`;
  }

  function saveBudgetLimit() {
    const val = Number(el.budgetLimitInput.value);
    if (!val || val <= 0) {
      alert('Masukkan batas anggaran yang valid.');
      return;
    }

    state.budgetLimit = val;
    window.SmartData.SmartStorage.saveBudgetLimit(val);
    updateBudgetSafetyMeter();
    renderAnggaranScreen();
    showToast(`Batas anggaran diubah menjadi ${formatRp(val)}`, 'success');
    if (window.soundCtrl) window.soundCtrl.playSuccess();
  }

  // ==========================================
  // NAVIGATION & TABS
  // ==========================================

  function switchTab(targetViewId) {
    state.currentTab = targetViewId;

    // Toggle screen views
    document.querySelectorAll('.screen-view').forEach(view => {
      view.classList.toggle('active', view.id === targetViewId);
    });

    // Update bottom nav button active states
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetViewId);
    });

    // Trolley summary bar is visible primarily on Belanja view
    el.trolleySummaryBar.style.display = targetViewId === 'viewBelanja' ? 'flex' : 'none';

    // Scroll to top
    el.viewport.scrollTop = 0;

    if (window.soundCtrl) window.soundCtrl.playTick();
  }

  // ==========================================
  // SCREEN 4: USER AUTHENTICATION & PROFILE
  // ==========================================

  function renderUserProfile() {
    const user = state.currentUser;

    if (user) {
      // Logged in state
      if (el.authLoggedInView) el.authLoggedInView.style.display = 'block';
      if (el.authLoggedOutView) el.authLoggedOutView.style.display = 'none';

      // Header button updates
      if (el.headerUserAvatar) el.headerUserAvatar.textContent = user.avatar || '👨‍🎓';
      if (el.headerUserName) el.headerUserName.textContent = (user.name || '').split(' ')[0];

      // Profile hero card updates
      if (el.profileBigAvatar) el.profileBigAvatar.textContent = user.avatar || '👨‍🎓';
      if (el.profileFullName) el.profileFullName.textContent = user.name;
      if (el.profileRoleBadge) el.profileRoleBadge.textContent = user.role || 'Mahasiswa Rantau';
      if (el.profileEmail) el.profileEmail.textContent = user.email;
      if (el.profileLocation) el.profileLocation.textContent = `📍 Kost di ${user.city || 'Yogyakarta'}`;
      if (el.profileBudgetLimit) el.profileBudgetLimit.textContent = formatRp(state.budgetLimit);

      // Mini stats
      let grandSpent = 0;
      state.historyTrips.forEach(t => {
        grandSpent += Number(t.totalSpent) || 0;
      });
      if (el.profileTripCount) el.profileTripCount.textContent = `${state.historyTrips.length} Kali`;
      if (el.profileTotalSpent) el.profileTotalSpent.textContent = formatRp(grandSpent);

      // Render Quick Switch account chips
      renderQuickSwitchChips();
    } else {
      // Logged out state
      if (el.authLoggedInView) el.authLoggedInView.style.display = 'none';
      if (el.authLoggedOutView) el.authLoggedOutView.style.display = 'block';

      if (el.headerUserAvatar) el.headerUserAvatar.textContent = '👤';
      if (el.headerUserName) el.headerUserName.textContent = 'Masuk';

      switchAuthTab(state.authTab || 'login');
    }

    if (window.lucide) {
      if (el.viewAkun) window.lucide.createIcons({ root: el.viewAkun });
    }
  }

  function renderQuickSwitchChips() {
    if (!el.quickSwitchChips) return;
    el.quickSwitchChips.innerHTML = '';
    const users = window.SmartData.SmartStorage.getUsers();

    users.forEach(u => {
      const isCurrent = state.currentUser && state.currentUser.id === u.id;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `quick-user-pill ${isCurrent ? 'active' : ''}`;
      chip.innerHTML = `<span>${u.avatar || '👤'}</span> <span>${escapeHtml(u.name)}</span>`;
      chip.addEventListener('click', () => {
        if (!isCurrent) {
          window.SmartData.SmartStorage.setCurrentUser(u);
          state.currentUser = u;
          if (u.budget) {
            state.budgetLimit = u.budget;
            window.SmartData.SmartStorage.saveBudgetLimit(u.budget);
            updateBudgetSafetyMeter();
            renderAnggaranScreen();
          }
          renderUserProfile();
          showToast(`Beralih ke akun ${u.name}!`, 'success');
          if (window.soundCtrl) window.soundCtrl.playPop();
        }
      });
      el.quickSwitchChips.appendChild(chip);
    });
  }

  function switchAuthTab(tab) {
    state.authTab = tab;
    if (tab === 'login') {
      if (el.tabBtnLogin) el.tabBtnLogin.classList.add('active');
      if (el.tabBtnRegister) el.tabBtnRegister.classList.remove('active');
      if (el.loginForm) el.loginForm.style.display = 'flex';
      if (el.registerForm) el.registerForm.style.display = 'none';
    } else {
      if (el.tabBtnRegister) el.tabBtnRegister.classList.add('active');
      if (el.tabBtnLogin) el.tabBtnLogin.classList.remove('active');
      if (el.registerForm) el.registerForm.style.display = 'flex';
      if (el.loginForm) el.loginForm.style.display = 'none';
    }
    if (window.lucide && el.viewAkun) {
      window.lucide.createIcons({ root: el.viewAkun });
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = el.loginEmail.value.trim();
    const pass = el.loginPassword.value.trim();

    if (!email || !pass) {
      showToast('Harap masukkan email/nama dan password!', 'warning');
      return;
    }

    const res = window.SmartData.SmartStorage.loginUser(email, pass);
    if (res.success) {
      state.currentUser = res.user;
      if (res.user.budget) {
        state.budgetLimit = res.user.budget;
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
        updateBudgetSafetyMeter();
        renderAnggaranScreen();
      }
      renderUserProfile();
      showToast(`Selamat datang kembali, ${res.user.name}! 👋`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewBelanja');
    } else {
      showToast(res.message, 'danger');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = el.regName.value.trim();
    const email = el.regEmail.value.trim();
    const password = el.regPassword.value.trim();
    const role = el.regRole.value;
    const city = el.regCity.value.trim();
    const budget = Number(el.regBudget.value) || 450000;

    const res = window.SmartData.SmartStorage.registerUser({
      name,
      email,
      password,
      role,
      city,
      budget,
      avatar: role.includes('Mahasiswa') ? '👨‍🎓' : role.includes('Hemat') ? '👩‍💻' : '🎒'
    });

    if (res.success) {
      state.currentUser = res.user;
      state.budgetLimit = budget;
      window.SmartData.SmartStorage.saveBudgetLimit(budget);
      renderUserProfile();
      updateBudgetSafetyMeter();
      renderAnggaranScreen();
      showToast(`Akun berhasil dibuat! Halo ${res.user.name} 🎉`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewBelanja');
    } else {
      showToast(res.message, 'danger');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function quickLogin(email, password) {
    const res = window.SmartData.SmartStorage.loginUser(email, password);
    if (res.success) {
      state.currentUser = res.user;
      if (res.user.budget) {
        state.budgetLimit = res.user.budget;
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
        updateBudgetSafetyMeter();
        renderAnggaranScreen();
      }
      renderUserProfile();
      showToast(`Masuk sebagai ${res.user.name}!`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewBelanja');
    } else {
      showToast(res.message, 'danger');
    }
  }

  function handleLogout() {
    if (confirm('Apakah kamu yakin ingin keluar dari akun?')) {
      window.SmartData.SmartStorage.logoutUser();
      state.currentUser = null;
      renderUserProfile();
      showToast('Kamu telah keluar dari akun.', 'info');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function togglePassword(inputId, iconId) {
    const inp = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!inp || !icon) return;

    if (inp.type === 'password') {
      inp.type = 'text';
      icon.setAttribute('data-lucide', 'eye-off');
    } else {
      inp.type = 'password';
      icon.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons({ root: icon.parentElement });
  }

  // ==========================================
  // PWA SUPPORT & EVENTS BINDING
  // ==========================================

  function initPWA() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('PWA Service Worker registered:', reg.scope))
          .catch(err => console.log('Service Worker registration failed:', err));
      });
    }

    // Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      el.pwaBanner.style.display = 'flex';
    });

    el.pwaInstallBtn.addEventListener('click', async () => {
      if (state.deferredPrompt) {
        state.deferredPrompt.prompt();
        const { outcome } = await state.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Terima kasih telah memasang Smart Grocery!', 'success');
        }
        state.deferredPrompt = null;
        el.pwaBanner.style.display = 'none';
      }
    });
  }

  // Event Listeners
  function bindEvents() {
    // Bottom Navigation clicks
    el.bottomNav.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.nav-tab-btn');
      if (tabBtn && tabBtn.dataset.tab) {
        switchTab(tabBtn.dataset.tab);
      }
    });

    // Header user profile button tap
    if (el.headerUserBtn) {
      el.headerUserBtn.addEventListener('click', () => {
        switchTab('viewAkun');
      });
    }

    // Quick toggle check/uncheck all items
    if (el.toggleCheckAllBtn) {
      el.toggleCheckAllBtn.addEventListener('click', toggleCheckAll);
    }

    // Auth tabs switching
    if (el.tabBtnLogin) {
      el.tabBtnLogin.addEventListener('click', () => switchAuthTab('login'));
    }
    if (el.tabBtnRegister) {
      el.tabBtnRegister.addEventListener('click', () => switchAuthTab('register'));
    }

    // Auth forms submit
    if (el.loginForm) {
      el.loginForm.addEventListener('submit', handleLoginSubmit);
    }
    if (el.registerForm) {
      el.registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    // Password visibility toggles
    if (el.toggleLoginPasswordBtn) {
      el.toggleLoginPasswordBtn.addEventListener('click', () => togglePassword('loginPassword', 'loginEyeIcon'));
    }
    if (el.toggleRegPasswordBtn) {
      el.toggleRegPasswordBtn.addEventListener('click', () => togglePassword('regPassword', 'regEyeIcon'));
    }

    // Quick demo login accounts
    if (el.quickLoginBudi) {
      el.quickLoginBudi.addEventListener('click', () => quickLogin('budi@rantau.id', '123'));
    }
    if (el.quickLoginSiti) {
      el.quickLoginSiti.addEventListener('click', () => quickLogin('siti@rantau.id', '123'));
    }

    // Profile menu actions
    if (el.btnLogoutUser) {
      el.btnLogoutUser.addEventListener('click', handleLogout);
    }
    if (el.menuSetBudgetBtn) {
      el.menuSetBudgetBtn.addEventListener('click', () => switchTab('viewAnggaran'));
    }
    if (el.menuSwitchAccountBtn) {
      el.menuSwitchAccountBtn.addEventListener('click', () => {
        window.SmartData.SmartStorage.logoutUser();
        state.currentUser = null;
        renderUserProfile();
        showToast('Silakan pilih akun demo atau login.', 'info');
      });
    }
    if (el.menuSoundToggleBtn) {
      el.menuSoundToggleBtn.addEventListener('click', () => el.soundToggleBtn.click());
    }
    if (el.forgotPassBtn) {
      el.forgotPassBtn.addEventListener('click', () => {
        alert('Petunjuk pemulihan kata sandi telah dikirim ke email kos kamu (Password akun demo: 123).');
      });
    }

    // Header budget card tap opens Anggaran settings
    el.budgetCardClickable.addEventListener('click', () => {
      switchTab('viewAnggaran');
    });

    // Search bar typing & clear
    el.searchItemInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      el.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderGroceryList();
    });

    el.searchClearBtn.addEventListener('click', () => {
      el.searchItemInput.value = '';
      state.searchQuery = '';
      el.searchClearBtn.style.display = 'none';
      renderGroceryList();
    });

    // Add Item triggers
    el.openAddItemBtn.addEventListener('click', openAddItemModal);
    el.emptyAddBtn.addEventListener('click', openAddItemModal);

    // Modal close & save
    el.closeItemModalBtn.addEventListener('click', closeItemModal);
    el.cancelItemModalBtn.addEventListener('click', closeItemModal);
    el.saveItemModalBtn.addEventListener('click', saveItemFromModal);

    // Enter key shortcuts to quickly save item
    if (el.inputItemName) {
      el.inputItemName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveItemFromModal();
        }
      });
    }
    if (el.inputUnitPrice) {
      el.inputUnitPrice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveItemFromModal();
        }
      });
    }

    // Modal Qty Stepper
    el.modalQtyPlus.addEventListener('click', () => {
      el.inputQty.value = (Number(el.inputQty.value) || 1) + 1;
      updateModalCalculations();
      if (window.soundCtrl) window.soundCtrl.playTick();
    });

    el.modalQtyMinus.addEventListener('click', () => {
      const q = Number(el.inputQty.value) || 1;
      if (q > 1) {
        el.inputQty.value = q - 1;
        updateModalCalculations();
        if (window.soundCtrl) window.soundCtrl.playTick();
      }
    });

    // Realtime modal calculations on input changes
    ['input', 'change'].forEach(evt => {
      el.inputQty.addEventListener(evt, updateModalCalculations);
      el.inputUnitPrice.addEventListener(evt, () => {
        updateModalCalculations();
        checkModalPriceComparison();
      });
      el.inputDiscountMode.addEventListener(evt, updateModalCalculations);
      el.inputDiscountValue.addEventListener(evt, updateModalCalculations);
      el.inputStacked1.addEventListener(evt, updateModalCalculations);
      el.inputStacked2.addEventListener(evt, updateModalCalculations);
      el.inputItemName.addEventListener(evt, checkModalPriceComparison);
    });

    // Discount Tabs inside Modal
    el.disTabNone.addEventListener('click', () => setDiscountTab('none'));
    el.disTabRegular.addEventListener('click', () => setDiscountTab('regular'));
    el.disTabStacked.addEventListener('click', () => setDiscountTab('stacked'));

    // Checkout Modal
    el.finishShoppingBtn.addEventListener('click', openCheckoutModal);
    el.closeCheckoutModalBtn.addEventListener('click', () => el.checkoutModal.classList.remove('open'));
    el.cancelCheckoutBtn.addEventListener('click', () => el.checkoutModal.classList.remove('open'));
    el.confirmCheckoutBtn.addEventListener('click', confirmCheckout);

    // Trip Detail Modal Close
    el.closeTripDetailBtn.addEventListener('click', () => el.tripDetailModal.classList.remove('open'));
    el.closeTripDetailFooterBtn.addEventListener('click', () => el.tripDetailModal.classList.remove('open'));

    // Help Modal
    el.headerInfoBtn.addEventListener('click', () => el.helpModal.classList.add('open'));
    el.closeHelpModalBtn.addEventListener('click', () => el.helpModal.classList.remove('open'));
    el.closeHelpFooterBtn.addEventListener('click', () => el.helpModal.classList.remove('open'));

    // Sound Toggle
    el.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      if (window.soundCtrl) window.soundCtrl.enabled = state.soundEnabled;
      el.soundToggleBtn.classList.toggle('active', state.soundEnabled);
      el.soundIcon.setAttribute('data-lucide', state.soundEnabled ? 'volume-2' : 'volume-x');
      if (window.lucide) window.lucide.createIcons({ root: el.soundToggleBtn });
      showToast(state.soundEnabled ? 'Efek audio diaktifkan' : 'Efek audio dibisukan', 'warning');
    });

    // Subtabs on Riwayat Screen
    el.subtabTrips.addEventListener('click', () => {
      state.historySubTab = 'trips';
      el.subtabTrips.classList.add('active');
      el.subtabCatalog.classList.remove('active');
      el.historyTripsContainer.style.display = 'block';
      el.historyCatalogContainer.style.display = 'none';
    });

    el.subtabCatalog.addEventListener('click', () => {
      state.historySubTab = 'catalog';
      el.subtabCatalog.classList.add('active');
      el.subtabTrips.classList.remove('active');
      el.historyTripsContainer.style.display = 'none';
      el.historyCatalogContainer.style.display = 'block';
    });

    // Budget Limit Preset Chips
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        el.budgetLimitInput.value = btn.dataset.preset;
        saveBudgetLimit();
      });
    });

    el.saveBudgetLimitBtn.addEventListener('click', saveBudgetLimit);

    // Backup / Export JSON
    el.exportDataBtn.addEventListener('click', () => {
      const backupData = {
        activeItems: state.activeItems,
        budgetLimit: state.budgetLimit,
        historyTrips: state.historyTrips,
        benchmarks: state.benchmarks,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-grocery-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data berhasil diekspor!', 'success');
    });

    // Reset Demo Data
    el.resetDemoBtn.addEventListener('click', () => {
      if (confirm('Kembalikan semua data ke setelan demo awal?')) {
        window.SmartData.SmartStorage.resetToDemo();
        loadData();
        renderGroceryList();
        updateBudgetSafetyMeter();
        renderHistoryScreen();
        renderAnggaranScreen();
        showToast('Data dikembalikan ke setelan demo!', 'success');
      }
    });
  }

  // Expose helpful functions to window for resilience
  window.openAddItemModal = openAddItemModal;
  window.saveItemFromModal = saveItemFromModal;
  window.closeItemModal = closeItemModal;

  // Start app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
