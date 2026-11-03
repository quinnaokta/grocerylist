// Smart Grocery & Budget Safety Tracker - Core Application Logic

(function () {
  'use strict';

  // State Management
  let state = {
    activeItems: [],
    budgetLimit: 450000,
    historyTrips: [],
    benchmarks: {},
    currentTab: 'viewKatalog',
    selectedCategory: 'all',
    searchQuery: '',
    selectedKatalogCategory: 'all',
    katalogSearchQuery: '',
    wasOverbudget: false,
    historySubTab: 'trips',
    deferredPrompt: null,
    editingItemId: null,
    currentDiscountType: 'none', // 'none' | 'regular' | 'stacked'
    currentUser: null,
    authTab: 'login', // 'login' | 'register'
    soundEnabled: true,
    storeLocation: 'Lotte Mart Grocery - Puri Indah',
    shoppingDate: new Date().toISOString().split('T')[0],
    cloudSyncStatus: 'connecting' // 'connected' | 'offline' | 'syncing'
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

    // Cloud Firestore Multi-Device Indicators & Session Strip
    headerLiveSyncPill: document.getElementById('headerLiveSyncPill'),
    headerLiveSyncText: document.getElementById('headerLiveSyncText'),
    sessionMetaStrip: document.getElementById('sessionMetaStrip'),
    sessionStoreLocation: document.getElementById('sessionStoreLocation'),
    sessionShoppingDate: document.getElementById('sessionShoppingDate'),
    sessionCloudBadge: document.getElementById('sessionCloudBadge'),
    sessionCloudText: document.getElementById('sessionCloudText'),

    // Gatekeeper Full-Page Login Elements
    authGateScreen: document.getElementById('authGateScreen'),
    mainAppContainer: document.getElementById('mainAppContainer'),
    gateTabLogin: document.getElementById('gateTabLogin'),
    gateTabRegister: document.getElementById('gateTabRegister'),
    gateLoginForm: document.getElementById('gateLoginForm'),
    gateRegisterForm: document.getElementById('gateRegisterForm'),
    gateLoginEmail: document.getElementById('gateLoginEmail'),
    gateLoginPassword: document.getElementById('gateLoginPassword'),
    gateToggleLoginPassBtn: document.getElementById('gateToggleLoginPassBtn'),
    gateLoginEyeIcon: document.getElementById('gateLoginEyeIcon'),
    gateRegName: document.getElementById('gateRegName'),
    gateRegEmail: document.getElementById('gateRegEmail'),
    gateRegPassword: document.getElementById('gateRegPassword'),
    gateRegRole: document.getElementById('gateRegRole'),
    gateRegCity: document.getElementById('gateRegCity'),
    gateRegBudget: document.getElementById('gateRegBudget'),
    gateToggleRegPassBtn: document.getElementById('gateToggleRegPassBtn'),
    gateRegEyeIcon: document.getElementById('gateRegEyeIcon'),
    gateQuickLoginBudi: document.getElementById('gateQuickLoginBudi'),
    gateQuickLoginSiti: document.getElementById('gateQuickLoginSiti'),
    gateRememberMe: document.getElementById('gateRememberMe'),
    gateForgotPassBtn: document.getElementById('gateForgotPassBtn'),
    gateSubmitLoginBtn: document.getElementById('gateSubmitLoginBtn'),
    closeAuthGateBtn: document.getElementById('closeAuthGateBtn'),
    menuOpenLoginBtn: document.getElementById('menuOpenLoginBtn'),

    // User Header Pill & Cart Pill
    headerUserBtn: document.getElementById('headerUserBtn'),
    headerUserAvatar: document.getElementById('headerUserAvatar'),
    headerUserName: document.getElementById('headerUserName'),
    headerCartBtn: document.getElementById('headerCartBtn'),
    headerCartBadge: document.getElementById('headerCartBadge'),

    // Floating Budget Safety Bar
    floatingBudgetBar: document.getElementById('floatingBudgetBar'),
    headerSpentText: document.getElementById('headerSpentText'),
    headerLimitText: document.getElementById('headerLimitText'),
    headerRemainingText: document.getElementById('headerRemainingText'),
    budgetProgressBar: document.getElementById('budgetProgressBar'),
    budgetStatusPill: document.getElementById('budgetStatusPill'),
    budgetStatusText: document.getElementById('budgetStatusText'),
    budgetWarningBanner: document.getElementById('budgetWarningBanner'),
    budgetWarningText: document.getElementById('budgetWarningText'),
    budgetCardClickable: document.getElementById('floatingBudgetBar'),

    // Shopee Display Catalog Screen (viewKatalog)
    viewKatalog: document.getElementById('viewKatalog'),
    katalogSearchInput: document.getElementById('katalogSearchInput'),
    katalogSearchClearBtn: document.getElementById('katalogSearchClearBtn'),
    katalogCategoryChips: document.getElementById('katalogCategoryChips'),
    shopeeProductGrid: document.getElementById('shopeeProductGrid'),
    shopeeProductCount: document.getElementById('shopeeProductCount'),
    shopeeLocationText: document.getElementById('shopeeLocationText'),
    navKatalog: document.getElementById('navKatalog'),

    // Overbudget Animated Pop-Up Warning Modal
    budgetExceededModal: document.getElementById('budgetExceededModal'),
    closeBudgetWarningModalBtn: document.getElementById('closeBudgetWarningModalBtn'),
    warnLimitAmount: document.getElementById('warnLimitAmount'),
    warnSpentAmount: document.getElementById('warnSpentAmount'),
    warnOverAmount: document.getElementById('warnOverAmount'),
    btnWarnReviewCart: document.getElementById('btnWarnReviewCart'),
    btnWarnAdjustBudget: document.getElementById('btnWarnAdjustBudget'),
    btnWarnDismiss: document.getElementById('btnWarnDismiss'),

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

  // Helper: Format Category Name
  function formatCategory(catId) {
    if (!catId) return 'Umum';
    if (window.SmartData && Array.isArray(window.SmartData.CATEGORIES)) {
      const found = window.SmartData.CATEGORIES.find(c => c.id === catId);
      if (found) return found.name;
    }
    return catId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Centralized Cart Badge Synchronizer for Top Header and Bottom Nav
  function syncCartBadges() {
    const totalCount = state.activeItems.reduce((acc, i) => acc + (Number(i.qty) || 1), 0);
    if (el.headerCartBadge) {
      el.headerCartBadge.textContent = totalCount;
      el.headerCartBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
    if (el.navCartCount) {
      el.navCartCount.textContent = totalCount;
      el.navCartCount.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Helper: Normalize & clean grocery item name for fuzzy/smart grouping
  function cleanItemNameForMatch(n) {
    if (!n) return '';
    let s = String(n).toLowerCase();
    s = s.replace(/\b1\s*l(iter)?\b/gi, '1 liter');
    s = s.replace(/\b2\s*l(iter)?\b/gi, '2 liter');
    s = s.replace(/\b5\s*kg\b/gi, '5 kg');
    s = s.replace(/\b1\s*kg\b/gi, '1 kg');
    s = s.replace(/\b500\s*g(ram)?\b/gi, '500 gram');
    s = s.replace(/\b250\s*g(ram)?\b/gi, '250 gram');
    s = s.replace(/\b(super|original|fresh|pilihan|premium|spesial|special|refil|refill|cair)\b/gi, '');
    s = s.replace(/[^\w\s]/g, ' ');
    return s.trim().replace(/\s+/g, ' ');
  }

  // Find matching Shopee product catalog entry
  function findMatchingShopeeProduct(item) {
    if (!item || !window.SmartData || !Array.isArray(window.SmartData.SHOPEE_PRODUCTS)) return null;
    const products = window.SmartData.SHOPEE_PRODUCTS;
    if (item.productId) {
      const found = products.find(p => p.id === item.productId);
      if (found) return found;
    }
    const name = (item.name || '').trim().toLowerCase();
    if (!name) return null;
    let found = products.find(p => p.name.trim().toLowerCase() === name);
    if (found) return found;

    const ca = cleanItemNameForMatch(name);
    if (ca) {
      found = products.find(p => {
        const cb = cleanItemNameForMatch(p.name);
        return ca === cb || (ca.length >= 8 && cb.length >= 8 && (ca.includes(cb) || cb.includes(ca)));
      });
      if (found) return found;
    }
    return null;
  }

  // Smart Item Matcher (identifies if two items refer to the same grocery good)
  function isSameGroceryItem(a, b) {
    if (!a || !b) return false;
    const idA = a.productId || a.id;
    const idB = b.productId || b.id;
    if (idA && idB && (idA === idB || a.productId === b.id || b.productId === a.id)) return true;

    const nameA = (typeof a === 'string' ? a : (a.name || '')).trim().toLowerCase();
    const nameB = (typeof b === 'string' ? b : (b.name || '')).trim().toLowerCase();
    if (!nameA || !nameB) return false;
    if (nameA === nameB) return true;

    const ca = cleanItemNameForMatch(nameA);
    const cb = cleanItemNameForMatch(nameB);
    if (ca && cb) {
      if (ca === cb) return true;
      if (ca.length >= 7 && cb.length >= 7 && (ca.includes(cb) || cb.includes(ca))) {
        // Guard against distinct Indomie flavors or sizes
        if (ca.includes('kuah') !== cb.includes('kuah')) return false;
        if (ca.includes('goreng') !== cb.includes('goreng')) return false;
        return true;
      }
    }
    return false;
  }

  // Group identical items into a single entry with combined quantity
  function groupActiveItems(items) {
    if (!Array.isArray(items)) return [];
    const grouped = [];
    items.forEach(item => {
      if (!item) return;
      // Link productId if catalog product found
      if (!item.productId) {
        const match = findMatchingShopeeProduct(item);
        if (match) {
          item.productId = match.id;
        }
      }

      const existing = grouped.find(g => isSameGroceryItem(g, item));
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + (Number(item.qty) || 1);
        if (item.inCart) existing.inCart = true;
        if (item.productId && !existing.productId) existing.productId = item.productId;
        if (item.unitPrice && (!existing.unitPrice || existing.unitPrice === 0)) existing.unitPrice = item.unitPrice;
        if (!existing.note && item.note) existing.note = item.note;
        if (!existing.unit && item.unit) existing.unit = item.unit;
      } else {
        grouped.push({
          ...item,
          qty: Math.max(1, Number(item.qty) || 1)
        });
      }
    });
    return grouped;
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

  // Price Trend Detector vs Historical Benchmarks (Membandingkan histori harga pada toko yang sama)
  function detectPriceTrend(itemName, currentUnitPrice, customStore) {
    const raw = (itemName || '').trim().toLowerCase();
    const activeStore = customStore || state.storeLocation || 'Lotte Mart Grocery - Puri Indah';

    let benchmark = null;

    // 1. Prioritaskan pencarian pada katalog histori toko yang aktif
    if (window.SmartData && window.SmartData.STORE_BENCHMARK_PRICES) {
      const storeMapKeys = Object.keys(window.SmartData.STORE_BENCHMARK_PRICES);
      const matchedStoreKey = storeMapKeys.find(s => 
        s.toLowerCase() === activeStore.toLowerCase() || 
        activeStore.toLowerCase().includes(s.toLowerCase()) || 
        s.toLowerCase().includes(activeStore.toLowerCase())
      );

      if (matchedStoreKey) {
        const storeMap = window.SmartData.STORE_BENCHMARK_PRICES[matchedStoreKey];
        benchmark = storeMap[raw];
        if (!benchmark) {
          const clean = raw.replace(/\s+/g, ' ');
          benchmark = storeMap[clean];
          if (!benchmark) {
            const foundKey = Object.keys(storeMap).find(k => k === clean || clean.includes(k) || k.includes(clean));
            if (foundKey) benchmark = storeMap[foundKey];
          }
        }
      }
    }

    // 2. Fallback ke state.benchmarks
    if (!benchmark) {
      benchmark = state.benchmarks[raw];
      if (!benchmark) {
        const clean = raw.replace(/\s+/g, ' ');
        benchmark = state.benchmarks[clean];
        if (!benchmark) {
          const foundKey = Object.keys(state.benchmarks).find(k => {
            return k === clean || clean.includes(k) || k.includes(clean);
          });
          if (foundKey) {
            benchmark = state.benchmarks[foundKey];
          }
        }
      }
    }

    if (!benchmark || !benchmark.lastPrice) {
      return { status: 'new', label: 'Item Baru', diff: 0, percent: 0, store: activeStore };
    }

    const pastPrice = Number(benchmark.lastPrice);
    const diff = currentUnitPrice - pastPrice;

    if (diff === 0) {
      return {
        status: 'stable',
        label: `= Stabil (sama dengan bulan ${benchmark.previousMonth || 'lalu'} ${formatRp(pastPrice)})`,
        diff: 0,
        percent: 0,
        pastPrice,
        period: benchmark.previousMonth,
        store: benchmark.store || activeStore
      };
    } else if (diff < 0) {
      const pct = Math.abs(Math.round((diff / pastPrice) * 100));
      return {
        status: 'drop',
        label: `↓ Turun ${formatRp(Math.abs(diff))} (-${pct}%)`,
        diff,
        percent: pct,
        pastPrice,
        period: benchmark.previousMonth,
        store: benchmark.store || activeStore
      };
    } else {
      const pct = Math.abs(Math.round((diff / pastPrice) * 100));
      return {
        status: 'up',
        label: `↑ Naik ${formatRp(diff)} (+${pct}%)`,
        diff,
        percent: pct,
        pastPrice,
        period: benchmark.previousMonth,
        store: benchmark.store || activeStore
      };
    }
  }

  // Cross-Store Benchmark Helper (Membandingkan harga barang antar toko/supermarket berbeda)
  function getCrossStoreBenchmarks(itemName, currentPrice) {
    const raw = (itemName || '').trim().toLowerCase();
    const clean = raw.replace(/\s+/g, ' ');
    const results = [];

    if (window.SmartData && window.SmartData.STORE_BENCHMARK_PRICES) {
      const storeLocations = window.SmartData.STORE_LOCATIONS || [];
      Object.keys(window.SmartData.STORE_BENCHMARK_PRICES).forEach(storeName => {
        const storeMap = window.SmartData.STORE_BENCHMARK_PRICES[storeName];
        let found = storeMap[raw] || storeMap[clean];
        if (!found) {
          const k = Object.keys(storeMap).find(x => x === clean || clean.includes(x) || x.includes(clean));
          if (k) found = storeMap[k];
        }

        if (found) {
          const storeMeta = storeLocations.find(l => l.name === storeName) || {};
          const isCurrent = (state.storeLocation || '').toLowerCase().includes(storeName.toLowerCase()) || 
                            storeName.toLowerCase().includes((state.storeLocation || '').toLowerCase());
          const diff = currentPrice > 0 ? (currentPrice - found.lastPrice) : 0;
          results.push({
            storeName,
            icon: storeMeta.icon || '🏪',
            badge: storeMeta.badge || storeMeta.type || 'Toko',
            price: found.lastPrice,
            period: found.previousMonth || 'September 2026',
            unit: found.unit || 'pcs',
            isCurrent,
            diff
          });
        }
      });
    }

    if (results.length > 0) {
      const minPrice = Math.min(...results.map(r => r.price));
      results.forEach(r => {
        r.isCheapest = (r.price === minPrice);
      });
    }

    return results;
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
    try { loadData(); } catch (e) { console.error('loadData error:', e); }
    try { checkAuthGate(); } catch (e) { console.error('checkAuthGate error:', e); }
    try { renderKatalogCategoryChips(); } catch (e) { console.error('renderKatalogCategoryChips error:', e); }
    try { renderShopeeCatalog(); } catch (e) { console.error('renderShopeeCatalog error:', e); }
    try { renderUserProfile(); } catch (e) { console.error('renderUserProfile error:', e); }
    try { renderCategoryChips(); } catch (e) { console.error('renderCategoryChips error:', e); }
    try { renderSuggestionsPills(); } catch (e) { console.error('renderSuggestionsPills error:', e); }
    try { renderGroceryList(); } catch (e) { console.error('renderGroceryList error:', e); }
    try { updateBudgetSafetyMeter(); } catch (e) { console.error('updateBudgetSafetyMeter error:', e); }
    try { syncCartBadges(); } catch (e) { console.error('syncCartBadges error:', e); }
    try { renderHistoryScreen(); } catch (e) { console.error('renderHistoryScreen error:', e); }
    try { renderAnggaranScreen(); } catch (e) { console.error('renderAnggaranScreen error:', e); }
    try { bindEvents(); } catch (e) { console.error('bindEvents error:', e); }
    try { initFirestoreRealtime(); } catch (e) { console.error('initFirestoreRealtime error:', e); }
    try { initPWA(); } catch (e) { console.error('initPWA error:', e); }
    try { if (window.lucide) window.lucide.createIcons(); } catch (e) { console.error('lucide error:', e); }
  }

  // ==========================================
  // GATEKEEPER FULL-PAGE LOGIN CONTROLLER
  // ==========================================

  function showAuthGate() {
    if (el.authGateScreen) {
      el.authGateScreen.style.display = 'flex';
      if (el.closeAuthGateBtn) {
        el.closeAuthGateBtn.style.display = 'flex';
      }
    }
    switchGateTab('login');
    if (window.lucide && el.authGateScreen) {
      window.lucide.createIcons({ root: el.authGateScreen });
    }
  }

  function hideAuthGate() {
    if (el.authGateScreen) {
      el.authGateScreen.style.display = 'none';
    }
    if (el.mainAppContainer) {
      el.mainAppContainer.style.display = 'flex';
    }
    if (window.lucide && el.mainAppContainer) {
      window.lucide.createIcons();
    }
  }

  function enterAsGuest() {
    if (!state.currentUser) {
      state.currentUser = {
        name: 'Tamu Rantau',
        email: 'tamu@rantau.id',
        role: 'Penjelajah Belanja',
        city: 'Semua Kota',
        budget: 450000,
        avatar: '🎒'
      };
      window.SmartData.SmartStorage.setCurrentUser(state.currentUser);
    }
    hideAuthGate();
    renderUserProfile();
    renderShopeeCatalog();
    updateBudgetSafetyMeter();
    switchTab('viewKatalog');
    showToast('Masuk sebagai Tamu! Silakan jelajahi etalase & belanja.', 'info');
  }

  function handleFloatingBudgetClick() {
    if (el.floatingBudgetBar && el.floatingBudgetBar.classList.contains('is-overbudget')) {
      checkBudgetThresholdAndWarn();
    } else {
      switchTab('viewAnggaran');
    }
  }

  function checkAuthGate() {
    const user = state.currentUser;
    if (!user) {
      showAuthGate();
      if (el.mainAppContainer) el.mainAppContainer.style.display = 'none';
      if (el.closeAuthGateBtn) el.closeAuthGateBtn.style.display = 'flex';
    } else {
      hideAuthGate();
      renderUserProfile();
      if (el.shopeeLocationText && user.city) {
        el.shopeeLocationText.textContent = `Kost ${user.name.split(' ')[0]} • ${user.city}`;
      }
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function switchGateTab(tab) {
    if (tab === 'login') {
      if (el.gateTabLogin) el.gateTabLogin.classList.add('active');
      if (el.gateTabRegister) el.gateTabRegister.classList.remove('active');
      if (el.gateLoginForm) el.gateLoginForm.style.display = 'flex';
      if (el.gateRegisterForm) el.gateRegisterForm.style.display = 'none';
    } else {
      if (el.gateTabRegister) el.gateTabRegister.classList.add('active');
      if (el.gateTabLogin) el.gateTabLogin.classList.remove('active');
      if (el.gateRegisterForm) el.gateRegisterForm.style.display = 'flex';
      if (el.gateLoginForm) el.gateLoginForm.style.display = 'none';
    }
    if (window.lucide && el.authGateScreen) {
      window.lucide.createIcons({ root: el.authGateScreen });
    }
  }

  function handleGateLoginSubmit(e) {
    e.preventDefault();
    const email = el.gateLoginEmail.value.trim();
    const pass = el.gateLoginPassword.value.trim();

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
      }
      checkAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderAnggaranScreen();
      switchTab('viewKatalog');
      showToast(`Selamat datang kembali, ${res.user.name}! 👋`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    } else {
      showToast(res.message, 'danger');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function handleGateRegisterSubmit(e) {
    e.preventDefault();
    const name = el.gateRegName.value.trim();
    const email = el.gateRegEmail.value.trim();
    const password = el.gateRegPassword.value.trim();
    const role = el.gateRegRole.value;
    const city = el.gateRegCity.value.trim();
    const budget = Number(el.gateRegBudget.value) || 450000;

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
      checkAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderAnggaranScreen();
      switchTab('viewKatalog');
      showToast(`Akun berhasil dibuat! Halo ${res.user.name} 🎉`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    } else {
      showToast(res.message, 'danger');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function gateQuickLogin(email, password) {
    const res = window.SmartData.SmartStorage.loginUser(email, password);
    if (res.success) {
      state.currentUser = res.user;
      if (res.user.budget) {
        state.budgetLimit = res.user.budget;
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
      }
      checkAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderAnggaranScreen();
      switchTab('viewKatalog');
      showToast(`Masuk sebagai ${res.user.name}! 👋`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    } else {
      showToast(res.message, 'danger');
    }
  }

  // ==========================================
  // SHOPEE PRODUCT DISPLAY ETALASE CONTROLLER
  // ==========================================

  function renderKatalogCategoryChips() {
    if (!el.katalogCategoryChips) return;
    el.katalogCategoryChips.innerHTML = '';
    window.SmartData.CATEGORIES.forEach(cat => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `category-chip ${state.selectedKatalogCategory === cat.id ? 'active' : ''}`;
      chip.innerHTML = `<span>${cat.name}</span>`;
      chip.addEventListener('click', () => {
        state.selectedKatalogCategory = cat.id;
        renderKatalogCategoryChips();
        renderShopeeCatalog();
        if (window.soundCtrl) window.soundCtrl.playTick();
      });
      el.katalogCategoryChips.appendChild(chip);
    });
  }

  function renderShopeeCatalog() {
    if (!el.shopeeProductGrid) return;
    el.shopeeProductGrid.innerHTML = '';

    const products = window.SmartData.SHOPEE_PRODUCTS || [];
    const query = (state.katalogSearchQuery || '').toLowerCase().trim();
    const category = state.selectedKatalogCategory || 'all';

    const filtered = products.filter(p => {
      const matchCat = category === 'all' || p.category === category;
      const matchQuery = !query || p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (el.shopeeProductCount) {
      el.shopeeProductCount.textContent = `${filtered.length} Barang Tersedia`;
    }

    if (filtered.length === 0) {
      el.shopeeProductGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 16px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 700; color: var(--text-main);">Barang Tidak Ditemukan</div>
          <p style="font-size: 12px; margin-top: 4px;">Coba gunakan kata kunci lain di pencarian etalase.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(prod => {
      const existingInCart = state.activeItems.find(i => isSameGroceryItem(i, prod));
      const qtyInCart = existingInCart ? Number(existingInCart.qty) || 0 : 0;

      const card = document.createElement('div');
      card.className = `shopee-card ${qtyInCart > 0 ? 'has-in-cart' : ''}`;
      card.innerHTML = `
        <div class="shopee-card-img-box" title="Klik untuk atur / perbarui barang ini">
          <span class="shopee-card-emoji">${prod.emoji || '🛍️'}</span>
          ${qtyInCart > 0 ? `<span class="shopee-in-cart-indicator">${qtyInCart} di Troli</span>` : ''}
        </div>
        <div class="shopee-card-body">
          <div class="shopee-card-tag">${formatCategory(prod.category)} • ${prod.unit || 'pcs'}</div>
          <div class="shopee-card-title" title="${escapeHtml(prod.name)}">${escapeHtml(prod.name)}</div>
          <div class="shopee-card-prices">
            <span class="shopee-price-main">${formatRp(prod.price)}</span>
            ${prod.originalPrice && prod.originalPrice > prod.price ? `<span class="shopee-price-original">${formatRp(prod.originalPrice)}</span>` : ''}
          </div>
          <div class="shopee-card-action">
            ${qtyInCart > 0 ? `
              <div class="shopee-stepper-row">
                <div class="shopee-qty-stepper">
                  <button type="button" class="shopee-stepper-btn btn-minus" aria-label="Kurang">−</button>
                  <span class="shopee-stepper-val">${qtyInCart}</span>
                  <button type="button" class="shopee-stepper-btn btn-plus" aria-label="Tambah">+</button>
                </div>
                <button type="button" class="btn-shopee-edit-item" title="Update / Detail Barang">
                  <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i>
                </button>
              </div>
              <button type="button" class="btn-shopee-check-toggle ${existingInCart && existingInCart.inCart ? 'is-checked' : ''}" title="Centang untuk hitung ke anggaran">
                <i data-lucide="${existingInCart && existingInCart.inCart ? 'check-circle' : 'circle'}" style="width: 13px; height: 13px;"></i>
                <span>${existingInCart && existingInCart.inCart ? 'Siap Beli (Dihitung)' : 'Centang Beli'}</span>
              </button>
            ` : `
              <button type="button" class="btn-shopee-add">
                <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                <span>+ Keranjang</span>
              </button>
            `}
          </div>
        </div>
      `;

      const addBtn = card.querySelector('.btn-shopee-add');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addToCartFromCatalog(prod);
        });
      }

      const minusBtn = card.querySelector('.btn-minus');
      if (minusBtn) {
        minusBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          decreaseCartFromCatalog(prod);
        });
      }

      const plusBtn = card.querySelector('.btn-plus');
      if (plusBtn) {
        plusBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addToCartFromCatalog(prod);
        });
      }

      const editBtn = card.querySelector('.btn-shopee-edit-item');
      if (editBtn && existingInCart) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditItemModal(existingInCart);
        });
      }

      const checkToggleBtn = card.querySelector('.btn-shopee-check-toggle');
      if (checkToggleBtn && existingInCart) {
        checkToggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          existingInCart.inCart = !existingInCart.inCart;
          saveAndRefresh();
          if (window.soundCtrl) window.soundCtrl.playPop();
          showToast(existingInCart.inCart ? `"${existingInCart.name}" siap dibeli (masuk anggaran)!` : `"${existingInCart.name}" hanya disimpan di troli`, 'info');
        });
      }

      // Klik foto / emoji barang untuk cepat update detail barang jika ada di troli
      const imgBox = card.querySelector('.shopee-card-img-box');
      if (imgBox) {
        imgBox.style.cursor = 'pointer';
        imgBox.addEventListener('click', () => {
          if (existingInCart) {
            openEditItemModal(existingInCart);
          } else {
            addToCartFromCatalog(prod);
          }
        });
      }

      el.shopeeProductGrid.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons({ root: el.shopeeProductGrid });
    }
  }

  function addToCartFromCatalog(prod) {
    const existing = state.activeItems.find(i => isSameGroceryItem(i, prod));
    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + 1;
      if (!existing.productId) existing.productId = prod.id;
    } else {
      state.activeItems.push({
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        unit: prod.unit || 'pcs',
        qty: 1,
        unitPrice: prod.price,
        discountType: prod.discountPercent ? 'percent' : 'none',
        discountValue: prod.discountPercent || 0,
        stackedDiscount: { enabled: false, type: 'percent', value: 0 },
        inCart: false, // Default: masuk troli tapi belum dichecklist untuk dibeli
        note: ''
      });
    }

    state.activeItems = groupActiveItems(state.activeItems);
    saveAndRefresh();

    if (el.headerCartBadge) {
      el.headerCartBadge.classList.add('pop');
      setTimeout(() => el.headerCartBadge.classList.remove('pop'), 250);
    }
    if (el.navCartCount) {
      el.navCartCount.classList.add('pop');
      setTimeout(() => el.navCartCount.classList.remove('pop'), 250);
    }

    showToast(`${prod.name} dimasukkan ke troli!`, 'success');
    if (window.soundCtrl) window.soundCtrl.playPop();

    checkBudgetThresholdAndWarn();
  }

  function decreaseCartFromCatalog(prod) {
    const idx = state.activeItems.findIndex(i => isSameGroceryItem(i, prod));
    if (idx !== -1) {
      if (state.activeItems[idx].qty > 1) {
        state.activeItems[idx].qty -= 1;
      } else {
        state.activeItems.splice(idx, 1);
      }
      state.activeItems = groupActiveItems(state.activeItems);
      saveAndRefresh();
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  function checkBudgetThresholdAndWarn() {
    let checkedSpent = 0;
    let checkedCount = 0;
    state.activeItems.forEach(item => {
      const p = calculateItemPricing(item);
      if (item.inCart) {
        checkedCount++;
        checkedSpent += p.finalSubtotal;
      }
    });

    // Analisis belanja hanya mempertimbangkan barang yang dichecklist (siap beli)
    const activeSpent = checkedSpent;
    const limit = state.budgetLimit || 450000;
    if (checkedCount > 0 && activeSpent > limit) {
      showOverbudgetWarningPopup(activeSpent, limit);
    }
  }

  function showOverbudgetWarningPopup(activeSpent, limit) {
    if (!el.budgetExceededModal) return;
    const overAmount = activeSpent - limit;
    if (el.warnLimitAmount) el.warnLimitAmount.textContent = formatRp(limit);
    if (el.warnSpentAmount) el.warnSpentAmount.textContent = formatRp(activeSpent);
    if (el.warnOverAmount) el.warnOverAmount.textContent = formatRp(overAmount > 0 ? overAmount : 0);
    el.budgetExceededModal.style.display = 'flex';
    if (window.soundCtrl) window.soundCtrl.playWarning();
    if (window.lucide) window.lucide.createIcons({ root: el.budgetExceededModal });
  }

  function closeOverbudgetWarningPopup() {
    if (el.budgetExceededModal) {
      el.budgetExceededModal.style.display = 'none';
    }
  }

  // Load Data from LocalStorage (0ms Synchronous Fallback for Offline / F5 Reload)
  function loadData() {
    state.currentUser = window.SmartData.SmartStorage.getCurrentUser();
    const rawItems = window.SmartData.SmartStorage.getActiveItems();
    state.activeItems = groupActiveItems(rawItems);
    window.SmartData.SmartStorage.saveActiveItems(state.activeItems);

    // Sinkronisasi pagu sesuai dengan akun yang aktif
    if (state.currentUser && state.currentUser.budget) {
      state.budgetLimit = Number(state.currentUser.budget);
      window.SmartData.SmartStorage.saveBudgetLimit(state.budgetLimit);
    } else {
      state.budgetLimit = window.SmartData.SmartStorage.getBudgetLimit() || 450000;
    }

    state.storeLocation = window.SmartData.SmartStorage.getStoreLocation();
    state.shoppingDate = window.SmartData.SmartStorage.getShoppingDate();
    state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
    state.benchmarks = window.SmartData.SmartStorage.getBenchmarks();

    if (el.sessionStoreLocation) el.sessionStoreLocation.value = state.storeLocation;
    if (el.sessionShoppingDate) el.sessionShoppingDate.value = state.shoppingDate;
    if (el.budgetLimitInput) el.budgetLimitInput.value = state.budgetLimit;
    syncStoreChips(state.storeLocation);
  }

  function syncStoreChips(activeStore) {
    const loc = (activeStore || state.storeLocation || '').toLowerCase();
    document.querySelectorAll('.store-chip-btn').forEach(btn => {
      const btnStore = (btn.dataset.store || '').toLowerCase();
      const isMatch = loc.includes(btnStore) || btnStore.includes(loc);
      btn.classList.toggle('active', isMatch);
    });
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
    syncCartBadges();

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
          trendBadgeHtml = `<span class="price-trend-tag drop" title="${trend.label}"><i data-lucide="arrow-down" style="width: 10px; height: 10px;"></i> ↓ -${formatRp(Math.abs(trend.diff))}</span>`;
        } else if (trend.status === 'up') {
          trendBadgeHtml = `<span class="price-trend-tag up" title="${trend.label}"><i data-lucide="arrow-up" style="width: 10px; height: 10px;"></i> ↑ +${formatRp(trend.diff)}</span>`;
        } else if (trend.status === 'stable') {
          trendBadgeHtml = `<span class="price-trend-tag stable" title="${trend.label}"><i data-lucide="equal" style="width: 10px; height: 10px;"></i> = Stabil</span>`;
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
              ${item.inCart 
                ? '<span class="pill-in-cart"><i data-lucide="check" style="width: 9px; height: 9px;"></i> Siap Beli</span>' 
                : ''}
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
    // Evaluasi pengeluaran & analisis belanja:
    // HANYA hitung barang yang sudah dichecklist (siap beli).
    // Barang yang belum dichecklist tidak dihitung karena belum tentu dibeli.
    const activeSpent = checkedSpent;
    const ratio = limit > 0 ? (activeSpent / limit) : 0;
    const percent = Math.round(ratio * 100);
    const remainder = limit - activeSpent;

    // Header Display
    el.headerSpentText.textContent = formatRp(activeSpent);
    el.headerLimitText.textContent = ` / ${formatRp(limit)}`;

    // Progress Bar Width & Color
    const barWidth = Math.min(100, percent);
    el.budgetProgressBar.style.width = `${barWidth}%`;

    // Status Pill & Banner logic
    if (ratio < 0.9) {
      // SAFE (< 90%)
      el.budgetProgressBar.style.backgroundColor = 'var(--safe-green)';
      el.budgetStatusPill.className = 'budget-status-pill status-safe';
      el.budgetStatusPill.innerHTML = `<i data-lucide="check-circle" style="width: 12px; height: 12px;"></i><span>Aman (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--safe-green)';
      el.headerRemainingText.textContent = checkedCount > 0 ? `Sisa ${formatRp(remainder)} (${checkedCount} checklist)` : `Sisa ${formatRp(remainder)} (0 checklist)`;
      el.budgetWarningBanner.style.display = 'none';
    } else if (ratio <= 1.0) {
      // WARNING (90% - 100% Peringatan Waspada)
      el.budgetProgressBar.style.backgroundColor = 'var(--warn-amber)';
      el.budgetStatusPill.className = 'budget-status-pill status-warning';
      el.budgetStatusPill.innerHTML = `<i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i><span>Waspada (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--warn-amber)';
      el.headerRemainingText.textContent = `Tersisa ${formatRp(remainder)} (${checkedCount} checklist)`;
      el.budgetWarningBanner.style.display = 'flex';
      el.budgetWarningBanner.className = 'alert-banner warning';
      el.budgetWarningText.textContent = `Peringatan Waspada: Total belanja sudah mencapai ${percent}% dari batas saldo dompet!`;
    } else {
      // DANGER / OVERBUDGET (> 100%)
      el.budgetProgressBar.style.backgroundColor = 'var(--danger-rose)';
      el.budgetStatusPill.className = 'budget-status-pill status-danger';
      el.budgetStatusPill.innerHTML = `<i data-lucide="alert-octagon" style="width: 12px; height: 12px;"></i><span>Overbudget (${percent}%)</span>`;
      el.headerRemainingText.style.color = 'var(--danger-rose)';
      el.headerRemainingText.textContent = `Lebih ${formatRp(Math.abs(remainder))}!`;
      el.budgetWarningBanner.style.display = 'flex';
      el.budgetWarningBanner.className = 'alert-banner danger';
      el.budgetWarningText.textContent = `🚨 Total belanja melebihi batas saldo dompet! Kurangi kuantitas atau batalkan barang sekunder. (Lebih ${formatRp(Math.abs(remainder))})`;
    }

    // Overbudget State & Animated Pop-up Trigger (Hanya jika ada checklist yang melebihi limit)
    if (ratio > 1.0 && checkedCount > 0) {
      if (el.floatingBudgetBar) el.floatingBudgetBar.classList.add('is-overbudget');
      if (!state.wasOverbudget) {
        state.wasOverbudget = true;
        showOverbudgetWarningPopup(activeSpent, limit);
      }
    } else {
      if (el.floatingBudgetBar) el.floatingBudgetBar.classList.remove('is-overbudget');
      state.wasOverbudget = false;
    }

    // Sync Cart Count Badges in Top Header and Bottom Nav
    syncCartBadges();

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

  // Save changes to localStorage (synchronous fallback) and push to Firestore Realtime
  function saveAndRefresh() {
    state.activeItems = groupActiveItems(state.activeItems);
    window.SmartData.SmartStorage.saveActiveItems(state.activeItems);
    renderShopeeCatalog();
    renderGroceryList();
    updateBudgetSafetyMeter();
    renderAnggaranScreen();
    syncCartBadges();

    // Push mutation to Firestore Realtime (instant sync to other open devices)
    pushToFirestore();
  }

  // ==========================================
  // CLOUD FIRESTORE MULTI-DEVICE REALTIME SYNC
  // ==========================================

  function updateCloudSyncUI(status) {
    state.cloudSyncStatus = status;
    const isLive = status === 'connected';
    const isSyncing = status === 'syncing';

    if (el.headerLiveSyncPill) {
      el.headerLiveSyncPill.className = `header-live-pill ${isLive ? '' : isSyncing ? 'syncing' : 'offline'}`;
      if (el.headerLiveSyncText) {
        el.headerLiveSyncText.textContent = isLive ? 'Live' : isSyncing ? 'Sync...' : 'Offline';
      }
    }

    if (el.sessionCloudBadge) {
      el.sessionCloudBadge.className = `session-cloud-badge ${isLive ? '' : isSyncing ? 'syncing' : 'offline'}`;
      if (el.sessionCloudText) {
        el.sessionCloudText.textContent = isLive ? 'Realtime Multi-Device' : isSyncing ? 'Menyinkronkan...' : 'Mode Offline (LocalStorage)';
      }
    }
  }

  function pushToFirestore() {
    const syncMgr = window.SmartData && window.SmartData.FirestoreRealtimeSync;
    if (!syncMgr || !syncMgr.isReady) return;

    let checkedSpent = 0;
    let checkedSavings = 0;
    let checkedCount = 0;

    state.activeItems.forEach(item => {
      const p = calculateItemPricing(item);
      if (item.inCart) {
        checkedCount++;
        checkedSpent += p.finalSubtotal;
        checkedSavings += p.totalSavings;
      }
    });

    const isMobile = window.innerWidth <= 768;
    const deviceLabel = isMobile ? 'HP' : 'PC';
    const userLabel = state.currentUser ? `${state.currentUser.name} (${deviceLabel})` : `Tamu (${deviceLabel})`;

    const sessionPayload = {
      storeLocation: state.storeLocation || 'Lotte Mart Grocery - Puri Indah',
      shoppingDate: state.shoppingDate || new Date().toISOString().split('T')[0],
      walletLimit: Number(state.budgetLimit) || 450000,
      items: state.activeItems,
      totalSpent: checkedSpent,
      totalSavings: checkedSavings,
      checkedCount: checkedCount,
      updatedBy: userLabel
    };

    syncMgr.pushSession(sessionPayload);
  }

  function initFirestoreRealtime() {
    const syncMgr = window.SmartData && window.SmartData.FirestoreRealtimeSync;
    if (!syncMgr) {
      updateCloudSyncUI('offline');
      return;
    }

    syncMgr.onStatusChange(status => {
      updateCloudSyncUI(status);
    });

    const ok = syncMgr.init();
    if (!ok) {
      updateCloudSyncUI('offline');
      return;
    }

    // Subscribe to REALTIME listener onSnapshot() - NO getDoc() / getDocs()
    syncMgr.listenToSession(cloudData => {
      if (!cloudData) return;

      const isFromOtherDevice = cloudData.updateDeviceId && cloudData.updateDeviceId !== syncMgr.deviceId;
      let hasChanged = false;

      // 1. Items array from Firestore
      if (Array.isArray(cloudData.items)) {
        state.activeItems = cloudData.items;
        window.SmartData.SmartStorage.saveActiveItems(state.activeItems);
        hasChanged = true;
      }

      // 2. Wallet limit from Firestore
      if (typeof cloudData.walletLimit === 'number' && cloudData.walletLimit > 0) {
        if (state.budgetLimit !== cloudData.walletLimit) {
          state.budgetLimit = cloudData.walletLimit;
          window.SmartData.SmartStorage.saveBudgetLimit(state.budgetLimit);
          hasChanged = true;
        }
      }

      // 3. Store location from Firestore
      if (cloudData.storeLocation && cloudData.storeLocation !== state.storeLocation) {
        state.storeLocation = cloudData.storeLocation;
        window.SmartData.SmartStorage.saveStoreLocation(state.storeLocation);
        if (el.sessionStoreLocation) el.sessionStoreLocation.value = state.storeLocation;
        hasChanged = true;
      }

      // 4. Shopping date from Firestore
      if (cloudData.shoppingDate && cloudData.shoppingDate !== state.shoppingDate) {
        state.shoppingDate = cloudData.shoppingDate;
        window.SmartData.SmartStorage.saveShoppingDate(state.shoppingDate);
        if (el.sessionShoppingDate) el.sessionShoppingDate.value = state.shoppingDate;
        hasChanged = true;
      }

      // If cloud update received, re-render UI instantaneously without writing back
      if (hasChanged) {
        renderShopeeCatalog();
        renderGroceryList();
        updateBudgetSafetyMeter();
        renderAnggaranScreen();
        syncCartBadges();

        // If change was made on another device, notify user with audio & visual toast
        if (isFromOtherDevice) {
          showToast(`⚡ Sinkron Realtime: Belanjaan diperbarui dari ${cloudData.updatedBy || 'perangkat lain'}!`, 'info');
          if (window.soundCtrl) window.soundCtrl.playPop();
        }
      }
    });

    // Handle online / offline events
    window.addEventListener('online', () => {
      updateCloudSyncUI('connected');
      pushToFirestore();
      showToast('Koneksi internet kembali! Cloud Realtime tersambung.', 'success');
    });

    window.addEventListener('offline', () => {
      updateCloudSyncUI('offline');
      showToast('Koneksi internet terputus. Mode offline aktif (LocalStorage aman).', 'warning');
    });
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

  // Real-time Price Comparison Insight inside Modal (Histori Toko Sama & Komparasi Antartoko)
  function checkModalPriceComparison() {
    const name = el.inputItemName.value;
    const price = Number(el.inputUnitPrice.value) || 0;
    if (!name.trim() || price <= 0) {
      el.priceComparisonNotice.style.display = 'none';
      return;
    }

    const trend = detectPriceTrend(name, price);
    const crossStores = getCrossStoreBenchmarks(name, price);
    el.priceComparisonNotice.style.display = 'block';

    const activeStoreShort = (state.storeLocation || 'Lotte Mart').split('-')[0].trim();
    let noticeHtml = '';

    if (trend.status === 'drop') {
      noticeHtml = `
        <div style="padding: 9px 12px; background: #E8F7F0; border-radius: 12px; font-size: 11.5px; color: #059669; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="arrow-down" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <span><strong>Kabar Baik di ${escapeHtml(activeStoreShort)}!</strong> Lebih hemat ${formatRp(Math.abs(trend.diff))} (${trend.percent}%) dibanding bulan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else if (trend.status === 'up') {
      noticeHtml = `
        <div style="padding: 9px 12px; background: #FFE8ED; border-radius: 12px; font-size: 11.5px; color: #E11D48; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="arrow-up" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <span><strong>Harga Naik di ${escapeHtml(activeStoreShort)}:</strong> Naik ${formatRp(trend.diff)} (+${trend.percent}%) dibanding catatan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else if (trend.status === 'stable') {
      noticeHtml = `
        <div style="padding: 9px 12px; background: #F3F4F6; border-radius: 12px; font-size: 11.5px; color: #4B5563; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="equal" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <span><strong>Harga Stabil di ${escapeHtml(activeStoreShort)}:</strong> Sama dengan catatan belanja bulan ${trend.period || 'lalu'} (${formatRp(trend.pastPrice)}).</span>
        </div>
      `;
    } else {
      noticeHtml = `
        <div style="padding: 9px 12px; background: #EFF6FF; border-radius: 12px; font-size: 11.5px; color: #2563EB; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <span>Item baru di ${escapeHtml(activeStoreShort)}! Acuan untuk belanja berikutnya.</span>
        </div>
      `;
    }

    // Komparasi harga antar toko (Lotte Mart, Indomaret, Alfamart, Superindo, dll)
    if (crossStores && crossStores.length > 0) {
      noticeHtml += `
        <div class="cross-store-box">
          <div class="cross-store-title">
            <i data-lucide="store" style="width: 14px; height: 14px; color: var(--primary);"></i>
            <span>Perbandingan Harga di Lokasi Toko Lain:</span>
          </div>
          <div class="cross-store-grid">
      `;

      crossStores.forEach(cs => {
        let tagHtml = '';
        if (cs.isCheapest) {
          tagHtml = `<span class="cross-store-tag cheapest">⭐ Termurah</span>`;
        } else if (cs.isCurrent) {
          tagHtml = `<span class="cross-store-tag current">📍 Toko Anda</span>`;
        } else if (cs.diff < 0) {
          tagHtml = `<span class="cross-store-tag diff-up">+${formatRp(Math.abs(cs.diff))}</span>`;
        } else if (cs.diff > 0) {
          tagHtml = `<span class="cross-store-tag diff-down">-${formatRp(cs.diff)}</span>`;
        }

        noticeHtml += `
          <div class="cross-store-row ${cs.isCurrent ? 'is-current' : ''} ${cs.isCheapest ? 'is-cheapest' : ''}">
            <div class="cross-store-name">
              <span>${cs.icon}</span>
              <span>${escapeHtml(cs.storeName.split('-')[0].trim())}</span>
              <small style="color: var(--text-soft); font-size: 9px;">(${escapeHtml(cs.badge)})</small>
            </div>
            <div class="cross-store-price-area">
              <span class="cross-store-price">${formatRp(cs.price)}</span>
              ${tagHtml}
            </div>
          </div>
        `;
      });

      noticeHtml += `
          </div>
        </div>
      `;
    }

    el.priceComparisonNotice.innerHTML = noticeHtml;
    if (window.lucide) window.lucide.createIcons({ root: el.priceComparisonNotice });
  }

  // Save Item from Modal
  function saveItemFromModal() {
    const name = el.inputItemName.value.trim();
    const category = el.inputCategory.value;
    const unit = el.inputUnit.value;
    const rawPrice = Number(el.inputUnitPrice.value);
    const rawQty = Number(el.inputQty.value);

    if (!name) {
      showToast('Silakan masukkan nama barang belanjaan.', 'warning');
      if (el.inputItemName) el.inputItemName.focus();
      return;
    }

    if (el.inputUnitPrice.value === '' || isNaN(rawPrice) || rawPrice <= 0) {
      showToast('Harga satuan harus lebih besar dari Rp 0 dan tidak boleh negatif!', 'warning');
      if (el.inputUnitPrice) el.inputUnitPrice.focus();
      return;
    }

    if (el.inputQty.value === '' || isNaN(rawQty) || rawQty <= 0) {
      showToast('Kuantitas (Qty) harus minimal 1!', 'warning');
      if (el.inputQty) el.inputQty.focus();
      return;
    }

    const qty = Math.max(1, rawQty);
    const unitPrice = rawPrice;
    const note = el.inputItemNote.value.trim();

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
      // Add new: check if same item already exists in cart, group if so!
      const existing = state.activeItems.find(i => isSameGroceryItem(i, { name, category, unit }));
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + qty;
        if (unitPrice > 0) existing.unitPrice = unitPrice;
        if (discountType !== 'none') {
          existing.discountType = discountType;
          existing.discountValue = discountValue;
          existing.stackedDiscount = stackedDiscount;
        }
        if (note) {
          existing.note = existing.note ? `${existing.note} • ${note}` : note;
        }
        showToast(`"${existing.name}" sudah ada di troli, jumlah digabungkan jadi ${existing.qty} ${existing.unit || 'pcs'}!`, 'success');
        if (window.soundCtrl) window.soundCtrl.playSuccess();
      } else {
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
          inCart: true,
          note
        };
        state.activeItems.unshift(newItem);
        showToast(`"${name}" masuk ke daftar belanja!`, 'success');
        if (window.soundCtrl) window.soundCtrl.playSuccess();
      }
    }

    state.activeItems = groupActiveItems(state.activeItems);
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

    // Hitung pengeluaran hanya dari barang yang sudah dichecklist
    let checkedSpent = 0;
    let checkedCount = 0;
    state.activeItems.forEach(item => {
      if (item.inCart) {
        checkedCount++;
        const p = calculateItemPricing(item);
        checkedSpent += p.finalSubtotal;
      }
    });

    const totalSpent = checkedSpent;
    const remainder = state.budgetLimit - totalSpent;
    const pct = state.budgetLimit > 0 ? Math.round((totalSpent / state.budgetLimit) * 100) : 0;

    el.budgetCardCurrent.textContent = formatRp(totalSpent);
    el.budgetCardRemainder.textContent = remainder >= 0 ? formatRp(remainder) : `Lebih ${formatRp(Math.abs(remainder))}`;
    el.budgetCardRemainder.style.color = remainder >= 0 ? 'var(--safe-green)' : 'var(--danger-rose)';
    el.budgetCardPercent.textContent = `${pct}% (${checkedCount} checklist)`;
  }

  function saveBudgetLimit() {
    const val = Number(el.budgetLimitInput.value);
    if (!val || val <= 0) {
      showToast('Masukkan batas anggaran yang valid.', 'warning');
      return;
    }

    state.budgetLimit = val;
    window.SmartData.SmartStorage.saveBudgetLimit(val);

    // Update pagu anggaran di akun pengguna yang sedang aktif
    if (state.currentUser) {
      state.currentUser.budget = val;
      window.SmartData.SmartStorage.setCurrentUser(state.currentUser);
      window.SmartData.SmartStorage.updateUserBudget(state.currentUser.id || state.currentUser.email, val);
    }

    updateBudgetSafetyMeter();
    renderAnggaranScreen();
    renderUserProfile();
    pushToFirestore();
    showToast(`Batas anggaran akun berhasil diperbarui menjadi ${formatRp(val)}`, 'success');
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

    // Refresh contents if switching to catalog or cart
    if (targetViewId === 'viewKatalog') {
      renderShopeeCatalog();
    } else if (targetViewId === 'viewBelanja') {
      renderGroceryList();
    } else if (targetViewId === 'viewRiwayat') {
      renderHistoryScreen();
    } else if (targetViewId === 'viewAnggaran') {
      renderAnggaranScreen();
    } else if (targetViewId === 'viewAkun') {
      renderUserProfile();
    }

    // Trolley summary bar is visible primarily on Belanja view
    if (el.trolleySummaryBar) {
      el.trolleySummaryBar.style.display = targetViewId === 'viewBelanja' ? 'flex' : 'none';
    }

    // Scroll to top
    if (el.viewport) {
      el.viewport.scrollTop = 0;
    }

    if (window.soundCtrl) window.soundCtrl.playTick();
    if (window.lucide) window.lucide.createIcons();
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
      const budgetVal = (user && user.budget) ? user.budget : (state.budgetLimit || 450000);
      if (el.profileBudgetLimit) el.profileBudgetLimit.textContent = formatRp(budgetVal);

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
      checkAuthGate();
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
    // Gatekeeper Full-Page Login Events
    if (el.closeAuthGateBtn) {
      el.closeAuthGateBtn.addEventListener('click', () => hideAuthGate());
    }
    if (el.gateTabLogin) {
      el.gateTabLogin.addEventListener('click', () => switchGateTab('login'));
    }
    if (el.gateTabRegister) {
      el.gateTabRegister.addEventListener('click', () => switchGateTab('register'));
    }
    if (el.gateLoginForm) {
      el.gateLoginForm.addEventListener('submit', handleGateLoginSubmit);
    }
    if (el.gateRegisterForm) {
      el.gateRegisterForm.addEventListener('submit', handleGateRegisterSubmit);
    }
    if (el.gateToggleLoginPassBtn) {
      el.gateToggleLoginPassBtn.addEventListener('click', () => togglePassword('gateLoginPassword', 'gateLoginEyeIcon'));
    }
    if (el.gateToggleRegPassBtn) {
      el.gateToggleRegPassBtn.addEventListener('click', () => togglePassword('gateRegPassword', 'gateRegEyeIcon'));
    }
    if (el.gateForgotPassBtn) {
      el.gateForgotPassBtn.addEventListener('click', () => {
        showToast('Petunjuk pemulihan kata sandi telah dikirim ke email kos kamu.', 'info');
      });
    }

    // Header Cart Pill Button (jump to cart from any tab)
    if (el.headerCartBtn) {
      el.headerCartBtn.addEventListener('click', () => switchTab('viewBelanja'));
    }

    // Realtime Multi-Device Session Strip: Store Location & Shopping Date
    if (el.sessionStoreLocation) {
      el.sessionStoreLocation.addEventListener('change', (e) => {
        state.storeLocation = e.target.value.trim() || 'Lotte Mart Grocery - Puri Indah';
        window.SmartData.SmartStorage.saveStoreLocation(state.storeLocation);
        syncStoreChips(state.storeLocation);
        renderGroceryList();
        pushToFirestore();
        showToast(`Lokasi toko diset: ${state.storeLocation} (tersinkron ke PC/HP)`, 'info');
      });
    }

    // Quick store selector chips (Lotte Mart, Indomaret, Alfamart, Superindo, dll)
    const storeChips = document.querySelectorAll('.store-chip-btn');
    storeChips.forEach(btn => {
      btn.addEventListener('click', () => {
        const storeName = btn.dataset.store;
        if (!storeName) return;

        state.storeLocation = storeName;
        window.SmartData.SmartStorage.saveStoreLocation(storeName);
        if (el.sessionStoreLocation) el.sessionStoreLocation.value = storeName;
        syncStoreChips(storeName);

        // Render grocery list with the selected store's price comparison
        renderGroceryList();
        pushToFirestore();
        showToast(`📍 Lokasi toko: ${storeName} (Komparasi harga disesuaikan)`, 'info');
        if (window.soundCtrl) window.soundCtrl.playPop();
      });
    });

    if (el.sessionShoppingDate) {
      el.sessionShoppingDate.addEventListener('change', (e) => {
        state.shoppingDate = e.target.value;
        window.SmartData.SmartStorage.saveShoppingDate(state.shoppingDate);
        pushToFirestore();
        showToast('Tanggal belanja diperbarui & disinkronkan!', 'info');
      });
    }

    // Header user profile button tap -> Buka halaman login / ganti akun
    if (el.headerUserBtn) {
      el.headerUserBtn.addEventListener('click', () => {
        showAuthGate();
      });
    }

    // Floating budget bar tap
    if (el.floatingBudgetBar) {
      el.floatingBudgetBar.addEventListener('click', () => {
        if (el.floatingBudgetBar.classList.contains('is-overbudget')) {
          checkBudgetThresholdAndWarn();
        } else {
          switchTab('viewAnggaran');
        }
      });
    }

    // Shopee Catalog Search
    if (el.katalogSearchInput) {
      el.katalogSearchInput.addEventListener('input', (e) => {
        state.katalogSearchQuery = e.target.value;
        if (el.katalogSearchClearBtn) {
          el.katalogSearchClearBtn.style.display = state.katalogSearchQuery ? 'block' : 'none';
        }
        renderShopeeCatalog();
      });
    }
    if (el.katalogSearchClearBtn) {
      el.katalogSearchClearBtn.addEventListener('click', () => {
        el.katalogSearchInput.value = '';
        state.katalogSearchQuery = '';
        el.katalogSearchClearBtn.style.display = 'none';
        renderShopeeCatalog();
      });
    }

    // Overbudget Warning Pop-Up Modal Actions
    if (el.closeBudgetWarningModalBtn) {
      el.closeBudgetWarningModalBtn.addEventListener('click', closeOverbudgetWarningPopup);
    }
    if (el.btnWarnDismiss) {
      el.btnWarnDismiss.addEventListener('click', closeOverbudgetWarningPopup);
    }
    if (el.btnWarnReviewCart) {
      el.btnWarnReviewCart.addEventListener('click', () => {
        closeOverbudgetWarningPopup();
        switchTab('viewBelanja');
      });
    }
    if (el.btnWarnAdjustBudget) {
      el.btnWarnAdjustBudget.addEventListener('click', () => {
        closeOverbudgetWarningPopup();
        switchTab('viewAnggaran');
      });
    }

    // Bottom Navigation clicks
    if (el.bottomNav) {
      el.bottomNav.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.nav-tab-btn');
        if (tabBtn && tabBtn.dataset.tab) {
          switchTab(tabBtn.dataset.tab);
        }
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

    // Profile menu actions
    if (el.btnLogoutUser) {
      el.btnLogoutUser.addEventListener('click', handleLogout);
    }
    if (el.menuSetBudgetBtn) {
      el.menuSetBudgetBtn.addEventListener('click', () => switchTab('viewAnggaran'));
    }
    if (el.menuOpenLoginBtn) {
      el.menuOpenLoginBtn.addEventListener('click', () => {
        showAuthGate();
      });
    }
    if (el.menuSwitchAccountBtn) {
      el.menuSwitchAccountBtn.addEventListener('click', () => {
        showAuthGate();
      });
    }
    if (el.menuSoundToggleBtn) {
      el.menuSoundToggleBtn.addEventListener('click', () => el.soundToggleBtn.click());
    }
    if (el.forgotPassBtn) {
      el.forgotPassBtn.addEventListener('click', () => {
        showToast('Petunjuk pemulihan kata sandi telah dikirim ke email kos kamu.', 'info');
      });
    }

    // Header budget card tap opens Anggaran settings
    if (el.budgetCardClickable) {
      el.budgetCardClickable.addEventListener('click', () => {
        switchTab('viewAnggaran');
      });
    }

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
  window.switchTab = switchTab;
  window.openAddItemModal = openAddItemModal;
  window.saveItemFromModal = saveItemFromModal;
  window.closeItemModal = closeItemModal;
  window.showAuthGate = showAuthGate;
  window.hideAuthGate = hideAuthGate;
  window.gateQuickLogin = gateQuickLogin;
  window.switchGateTab = switchGateTab;
  window.switchAuthTab = switchAuthTab;
  window.enterAsGuest = enterAsGuest;
  window.handleFloatingBudgetClick = handleFloatingBudgetClick;
  window.checkBudgetThresholdAndWarn = checkBudgetThresholdAndWarn;
  window.closeOverbudgetWarningPopup = closeOverbudgetWarningPopup;
  window.formatCategory = formatCategory;
  window.formatRp = formatRp;
  window.renderShopeeCatalog = renderShopeeCatalog;

  // Start app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
