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
    editingEtalaseProdId: null,
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
    gateGoogleLoginBtn: document.getElementById('gateGoogleLoginBtn'),
    gateGoogleRegBtn: document.getElementById('gateGoogleRegBtn'),
    closeAuthGateBtn: document.getElementById('closeAuthGateBtn'),
    menuOpenLoginBtn: document.getElementById('menuOpenLoginBtn'),

    // Theme Switcher Elements
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    gateThemeToggleBtn: document.getElementById('gateThemeToggleBtn'),
    menuThemeToggleBtn: document.getElementById('menuThemeToggleBtn'),
    menuThemeStatus: document.getElementById('menuThemeStatus'),

    // Add to Etalase Elements
    openAddEtalaseModalBtnTop: document.getElementById('openAddEtalaseModalBtnTop'),
    openAddEtalaseModalBtn: document.getElementById('openAddEtalaseModalBtn'),
    addEtalaseModal: document.getElementById('addEtalaseModal'),
    closeAddEtalaseModalBtn: document.getElementById('closeAddEtalaseModalBtn'),
    cancelAddEtalaseBtn: document.getElementById('cancelAddEtalaseBtn'),
    saveAddEtalaseBtn: document.getElementById('saveAddEtalaseBtn'),
    addEtalaseForm: document.getElementById('addEtalaseForm'),
    etalaseItemName: document.getElementById('etalaseItemName'),
    etalaseCategory: document.getElementById('etalaseCategory'),
    etalaseUnit: document.getElementById('etalaseUnit'),
    etalaseUnitChips: document.getElementById('etalaseUnitChips'),
    etalasePrice: document.getElementById('etalasePrice'),
    etalaseOriginalPrice: document.getElementById('etalaseOriginalPrice'),
    etalaseEmoji: document.getElementById('etalaseEmoji'),
    quickEmojiChips: document.getElementById('quickEmojiChips'),
    etalaseDesc: document.getElementById('etalaseDesc'),

    // Session Meta Strip & Store Location Modal (Persis Screenshot 2)
    headerStoreLocationBtn: document.getElementById('headerStoreLocationBtn'),
    headerCurrentStoreName: document.getElementById('headerCurrentStoreName'),
    openLocationModalBtn: document.getElementById('openLocationModalBtn'),
    sessionLocationDisplay: document.getElementById('sessionLocationDisplay'),
    storeLocationModal: document.getElementById('storeLocationModal'),
    storeLocationSheet: document.getElementById('storeLocationSheet'),
    closeStoreLocationModalBtn: document.getElementById('closeStoreLocationModalBtn'),
    detectGpsStoreBtn: document.getElementById('detectGpsStoreBtn'),
    storeLocationCardsList: document.getElementById('storeLocationCardsList'),
    inputNewStoreName: document.getElementById('inputNewStoreName'),
    submitNewStoreBtn: document.getElementById('submitNewStoreBtn'),

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

    // Item Modal Elements (Persis Screenshot 2)
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
    unitSelectorChips: document.getElementById('unitSelectorChips'),
    inputQty: document.getElementById('inputQty'),
    inputUnitPrice: document.getElementById('inputUnitPrice'),
    priceComparisonNotice: document.getElementById('priceComparisonNotice'),
    inputDiscountFormula: document.getElementById('inputDiscountFormula'),
    discountPresetChips: document.getElementById('discountPresetChips'),
    inputTaxPPN: document.getElementById('inputTaxPPN'),
    liveNormalPrice: document.getElementById('liveNormalPrice'),
    liveDiscountDeduction: document.getElementById('liveDiscountDeduction'),
    liveDiscountedPrice: document.getElementById('liveDiscountedPrice'),
    liveTaxRow: document.getElementById('liveTaxRow'),
    liveTaxAmount: document.getElementById('liveTaxAmount'),
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

  // Helper: Format number with Indonesian dot thousands separators (misal: 50.000, 400.000 - BUKAN 0000)
  function formatNumberDots(num) {
    if (num === null || num === undefined || num === '') return '';
    const clean = String(num).replace(/[^\d]/g, '');
    if (!clean) return '';
    const n = parseInt(clean, 10);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Helper: Parse currency / number string with dots into integer (misal: "50.000" -> 50000)
  function parseCurrencyInput(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return Math.round(val);
    const clean = String(val).replace(/[^\d]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }

  // Helper: Format Indonesian Rupiah (misal: Rp 50.000, Rp 400.000 - format titik, BUKAN 0000)
  function formatRp(num) {
    if (num === null || num === undefined || num === '') return 'Rp 0';
    if (typeof num === 'string') {
      const clean = num.replace(/[^\d]/g, '');
      if (!clean) return 'Rp 0';
      const n = parseInt(clean, 10);
      return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const val = Math.round(Number(num) || 0);
    return 'Rp ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Mask & Format real-time input angka mata uang dengan titik (misal 50.000, bukan 50000)
  function setupCurrencyInputs() {
    const currencyInputs = document.querySelectorAll('.currency-input');
    currencyInputs.forEach(input => {
      if (input.dataset.masked) return;
      input.dataset.masked = 'true';

      input.addEventListener('input', () => {
        const cursor = input.selectionStart;
        const prevLen = input.value.length;
        const raw = input.value.replace(/[^\d]/g, '');
        if (!raw) {
          input.value = '';
          return;
        }
        const formatted = formatNumberDots(raw);
        input.value = formatted;
        const diff = formatted.length - prevLen;
        if (cursor !== null) {
          const newPos = Math.max(0, cursor + diff);
          input.setSelectionRange(newPos, newPos);
        }
      });

      // Format nilai awal jika ada
      if (input.value) {
        input.value = formatNumberDots(input.value);
      }
    });
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
    if (!item) return null;
    const products = typeof getAllEtalaseProducts === 'function' ? getAllEtalaseProducts() : (window.SmartData?.SHOPEE_PRODUCTS || []);
    if (!Array.isArray(products) || products.length === 0) return null;
    if (item.productId) {
      const found = products.find(p => p.id === item.productId);
      if (found) return found;
    }
    const name = (item.name || '').trim().toLowerCase();
    if (!name) return null;
    let found = products.find(p => (p.name || '').trim().toLowerCase() === name);
    if (found) return found;

    const ca = cleanItemNameForMatch(name);
    if (ca) {
      found = products.find(p => {
        const cb = cleanItemNameForMatch(p.name || '');
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
        if (item.unitPrice) existing.unitPrice = item.unitPrice;
        if (item.name) existing.name = item.name;
        if (item.unit) existing.unit = item.unit;
        if (item.category) existing.category = item.category;
        if (item.note) existing.note = item.note;
        if (item.discountFormula) existing.discountFormula = item.discountFormula;
        if (typeof item.taxPPN === 'boolean') existing.taxPPN = item.taxPPN;
      } else {
        grouped.push({
          ...item,
          qty: Math.max(1, Number(item.qty) || 1)
        });
      }
    });
    return grouped;
  }

  // Parser Rumus Diskon Fleksibel (Persis Screenshot 2: 25%, 50% + 20%, 20% + 5%, Rp 5000, dll)
  function parseDiscountFormula(formula, unitPrice) {
    if (!formula || typeof formula !== 'string') return { discountAmount: 0, discountPercent: 0, label: '' };
    const raw = formula.trim().toLowerCase();
    if (!raw) return { discountAmount: 0, discountPercent: 0, label: '' };

    // Stacked percentage: misal "50% + 20%" atau "20% + 5%"
    if (raw.includes('+')) {
      const parts = raw.split('+').map(p => parseFloat(p.replace(/[^0-9.]/g, '')) || 0);
      let current = unitPrice;
      parts.forEach(pct => {
        current = current * (1 - (pct / 100));
      });
      const discountAmount = Math.max(0, unitPrice - current);
      const effPercent = unitPrice > 0 ? Math.round((discountAmount / unitPrice) * 100) : 0;
      return { discountAmount, discountPercent: effPercent, label: formula };
    }

    // Single percentage: misal "25%" atau "25% (Sabun Cuci)" atau "Beli 1 Gratis 1 (50%)"
    if (raw.includes('%')) {
      const match = raw.match(/(\d+(\.\d+)?)%/);
      const pct = match ? parseFloat(match[1]) : 0;
      const discountAmount = unitPrice * (pct / 100);
      return { discountAmount, discountPercent: pct, label: formula };
    }

    // Flat amount: misal "Rp 5.000" atau "5000" atau "5.000"
    const digitsOnly = raw.replace(/[^\d]/g, '');
    const num = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    if (!isNaN(num) && num > 0) {
      const discountAmount = Math.min(unitPrice, num);
      const effPercent = unitPrice > 0 ? Math.round((discountAmount / unitPrice) * 100) : 0;
      return { discountAmount, discountPercent: effPercent, label: formatRp(num) };
    }

    return { discountAmount: 0, discountPercent: 0, label: '' };
  }

  // Helper: Calculate Item Pricing & Discounts (Persis Screenshot 2)
  function calculateItemPricing(item) {
    const qty = Math.max(1, Number(item.qty) || 1);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const normalTotal = qty * unitPrice;
    let discountAmount = 0;
    let discountPercent = 0;

    if (item.discountFormula) {
      const parsed = parseDiscountFormula(item.discountFormula, unitPrice);
      discountAmount = Math.round(parsed.discountAmount);
      discountPercent = parsed.discountPercent;
    } else if (item.discountType === 'percent') {
      const p = Math.min(100, Math.max(0, Number(item.discountValue) || 0));
      discountPercent = p;
      discountAmount = Math.round(unitPrice * (p / 100));
    } else if (item.discountType === 'amount') {
      const a = Math.max(0, Number(item.discountValue) || 0);
      discountAmount = Math.round(a);
      discountPercent = unitPrice > 0 ? Math.round((a / unitPrice) * 100) : 0;
    } else if (item.discountType === 'stacked') {
      const p1 = Math.min(100, Math.max(0, Number(item.stackedDiscount?.val1) || 0));
      const p2 = Math.min(100, Math.max(0, Number(item.stackedDiscount?.val2) || 0));
      const priceAfterFirst = unitPrice * (1 - p1 / 100);
      const priceAfterSecond = priceAfterFirst * (1 - p2 / 100);
      discountAmount = Math.round(unitPrice - priceAfterSecond);
      discountPercent = unitPrice > 0 ? Math.round((discountAmount / unitPrice) * 100) : 0;
    }

    const finalUnitPrice = Math.max(0, unitPrice - discountAmount);
    let finalSubtotal = Math.round(qty * finalUnitPrice);

    // Pajak PPN 11% (Persis Screenshot 2)
    let taxAmount = 0;
    if (item.taxPPN) {
      taxAmount = Math.round(finalSubtotal * 0.11);
      finalSubtotal += taxAmount;
    }

    const totalSavings = Math.max(0, normalTotal - (qty * finalUnitPrice));

    return {
      qty,
      unitPrice,
      normalTotal,
      finalUnitPrice,
      discountAmount,
      discountPercent,
      taxAmount,
      hasTaxPPN: !!item.taxPPN,
      finalSubtotal,
      totalSavings
    };
  }

  // Evaluasi Keamanan Anggaran (Fitur: Tidak Bisa Menambah Barang Jika Overbudget)
  function getCartBudgetStatus(additionalCost = 0) {
    let checkedSpent = 0;
    let checkedCount = 0;
    let totalAllSpent = 0;

    state.activeItems.forEach(item => {
      const p = calculateItemPricing(item);
      totalAllSpent += p.finalSubtotal;
      if (item.inCart) {
        checkedCount++;
        checkedSpent += p.finalSubtotal;
      }
    });

    const baseSpent = checkedCount > 0 ? checkedSpent : totalAllSpent;
    const userBudget = state.currentUser && state.currentUser.budget ? Number(state.currentUser.budget) : null;
    const limit = (userBudget && userBudget > 0) ? userBudget : (state.budgetLimit || 400000);
    const potentialSpent = baseSpent + Number(additionalCost || 0);

    const isOverbudget = baseSpent > limit;
    const wouldBeOverbudget = potentialSpent > limit;
    const excess = Math.max(0, potentialSpent - limit);

    return {
      baseSpent,
      potentialSpent,
      limit,
      isOverbudget,
      wouldBeOverbudget,
      excess
    };
  }

  // Ambil Harga Efektif Produk per Toko (Memperhitungkan update harga & benchmark toko)
  function getEffectiveProductPrice(prod, storeName) {
    if (!prod) return 0;
    const targetStore = storeName || state.storeLocation || 'Lotte Mart Grocery – Puri Indah';
    const cleanStore = targetStore.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
    const prodName = (prod.name || '').trim().toLowerCase();
    const cleanName = cleanItemNameForMatch(prodName);

    // 1. Cek penyimpanan harga custom yang diperbarui pengguna di toko ini (prioritas tertinggi)
    if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.getCustomStorePrices) {
      const customMap = window.SmartData.SmartStorage.getCustomStorePrices(targetStore);
      if (prod.id && customMap[prod.id] && Number(customMap[prod.id]) > 0) {
        return Number(customMap[prod.id]);
      }
      if (customMap[prodName] && Number(customMap[prodName]) > 0) {
        return Number(customMap[prodName]);
      }
      if (cleanName && customMap[cleanName] && Number(customMap[cleanName]) > 0) {
        return Number(customMap[cleanName]);
      }
      // Fuzzy search jika nama sedikit berbeda (misal "Telur Ayam" vs "Telur Ayam Negeri 1kg")
      const cKeys = Object.keys(customMap);
      for (const k of cKeys) {
        if (Number(customMap[k]) > 0 && isSameGroceryItem({ name: k }, prod)) {
          return Number(customMap[k]);
        }
      }
    }

    // 2. Cek apakah barang sedang ada di keranjang belanja aktif
    const inCart = state.activeItems.find(i => isSameGroceryItem(i, prod));
    if (inCart && Number(inCart.unitPrice) > 0) {
      return Number(inCart.unitPrice);
    }

    // 3. Cek harga yang tercatat di objek produk katalog SHOPEE_PRODUCTS
    if (prod.price && Number(prod.price) > 0) {
      return Number(prod.price);
    }

    // 4. Fallback ke STORE_BENCHMARK_PRICES sesuai toko yang aktif
    if (window.SmartData && window.SmartData.STORE_BENCHMARK_PRICES) {
      const keys = Object.keys(window.SmartData.STORE_BENCHMARK_PRICES);
      const matchedKey = keys.find(k => {
        const nK = k.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
        return nK === cleanStore || cleanStore.includes(nK) || nK.includes(cleanStore) ||
               cleanStore.split('-')[0].trim() === nK.split('-')[0].trim();
      });

      if (matchedKey) {
        const storeMap = window.SmartData.STORE_BENCHMARK_PRICES[matchedKey];
        if (storeMap[prodName] && storeMap[prodName].lastPrice) {
          return Number(storeMap[prodName].lastPrice);
        }
        if (cleanName && storeMap[cleanName] && storeMap[cleanName].lastPrice) {
          return Number(storeMap[cleanName].lastPrice);
        }
        const foundKey = Object.keys(storeMap).find(k => k === cleanName || cleanName.includes(k) || k.includes(cleanName));
        if (foundKey && storeMap[foundKey].lastPrice) {
          return Number(storeMap[foundKey].lastPrice);
        }
      }
    }

    return 0;
  }

  // Update Harga Produk Toko & Sinkronisasi Realtime ke Etalase & Benchmark Toko Tanpa Refresh
  function updateStoreProductPrice(itemName, newPrice, storeName, reRenderCatalog = true) {
    const rawName = (itemName || '').trim();
    const priceVal = Number(newPrice);
    if (!rawName || isNaN(priceVal) || priceVal <= 0) return;

    const targetStore = (storeName || state.storeLocation || 'Lotte Mart Grocery – Puri Indah').trim();

    // 1. Simpan ke LocalStorage agar harga toko ini menetap
    if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.saveStoreProductPrice) {
      window.SmartData.SmartStorage.saveStoreProductPrice(targetStore, rawName, priceVal);
    }

    // 2. Perbarui harga di katalog SHOPEE_PRODUCTS dan simpan aliasnya
    const matchProd = findMatchingShopeeProduct({ name: rawName });
    if (matchProd) {
      matchProd.price = priceVal;
      if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.saveStoreProductPrice) {
        window.SmartData.SmartStorage.saveStoreProductPrice(targetStore, matchProd.name, priceVal);
        if (matchProd.id) {
          window.SmartData.SmartStorage.saveStoreProductPrice(targetStore, matchProd.id, priceVal);
        }
      }
    }

    // 3. Update juga barang yang sedang aktif di troli belanja
    let itemInCartChanged = false;
    state.activeItems.forEach(it => {
      if (isSameGroceryItem(it, { name: rawName, productId: matchProd ? matchProd.id : undefined })) {
        it.unitPrice = priceVal;
        itemInCartChanged = true;
      }
    });

    if (itemInCartChanged && window.SmartData && window.SmartData.SmartStorage) {
      window.SmartData.SmartStorage.saveActiveItems(state.activeItems);
    }

    // 4. Render ulang etalase seketika tanpa perlu refresh halaman
    if (reRenderCatalog) {
      renderShopeeCatalog();
      if (itemInCartChanged) {
        renderGroceryList();
        updateBudgetSafetyMeter();
      }
    }
  }

  // Price Trend Detector vs Historical Benchmarks (Membandingkan histori harga pada toko yang sama)
  function detectPriceTrend(itemName, currentUnitPrice, customStore) {
    const raw = (itemName || '').trim().toLowerCase();
    const activeStore = (customStore || state.storeLocation || 'Lotte Mart Grocery – Puri Indah').trim();
    const normActive = activeStore.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ');

    let benchmark = null;

    // 1. Prioritaskan pencarian pada katalog histori toko yang aktif
    if (window.SmartData && window.SmartData.STORE_BENCHMARK_PRICES) {
      const storeMapKeys = Object.keys(window.SmartData.STORE_BENCHMARK_PRICES);
      const matchedStoreKey = storeMapKeys.find(s => {
        const nKey = s.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ');
        return nKey === normActive || normActive.includes(nKey) || nKey.includes(normActive) ||
               normActive.split('-')[0].trim() === nKey.split('-')[0].trim();
      });

      if (matchedStoreKey) {
        const storeMap = window.SmartData.STORE_BENCHMARK_PRICES[matchedStoreKey];
        const clean = raw.replace(/\s+/g, ' ');
        if (storeMap[clean]) {
          benchmark = storeMap[clean];
        } else {
          const foundKey = Object.keys(storeMap).find(k => k === clean || clean.includes(k) || k.includes(clean));
          if (foundKey) benchmark = storeMap[foundKey];
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
    try { initTheme(); } catch (e) { console.error('initTheme error:', e); }
    try { checkAuthGate(true); } catch (e) { console.error('checkAuthGate error:', e); }
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
    try { setupCurrencyInputs(); } catch (e) { console.error('setupCurrencyInputs error:', e); }
    try { initFirestoreRealtime(); } catch (e) { console.error('initFirestoreRealtime error:', e); }
    try { initPWA(); } catch (e) { console.error('initPWA error:', e); }
    try { if (window.lucide) window.lucide.createIcons(); } catch (e) { console.error('lucide error:', e); }
  }

  // ==========================================
  // THEME (DARK / LIGHT MODE) SYSTEM
  // ==========================================

  function initTheme() {
    const savedTheme = localStorage.getItem('sg_theme') || 'light';
    applyTheme(savedTheme, false);
  }

  function applyTheme(theme, showNotice = false) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('sg_theme', isDark ? 'dark' : 'light');

    // Update icons
    const themeIcons = document.querySelectorAll('.theme-toggle-icon');
    themeIcons.forEach(icon => {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    });

    // Update labels
    const gateThemeText = document.querySelector('.gate-theme-text');
    if (gateThemeText) {
      gateThemeText.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
    }

    const menuThemeStatus = document.getElementById('menuThemeStatus');
    if (menuThemeStatus) {
      menuThemeStatus.textContent = isDark ? 'Aktif' : 'Nonaktif';
      menuThemeStatus.style.background = isDark ? 'var(--primary-soft)' : '';
      menuThemeStatus.style.color = isDark ? 'var(--primary)' : '';
    }

    if (window.lucide) window.lucide.createIcons();

    if (showNotice) {
      showToast(isDark ? 'Mode Gelap diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️', 'info');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
    if (window.soundCtrl) window.soundCtrl.playTick();
  }

  // ==========================================
  // GATEKEEPER FULL-PAGE LOGIN CONTROLLER
  // ==========================================

  function showAuthGate(fromInside = false) {
    if (el.authGateScreen) {
      el.authGateScreen.style.display = 'flex';
    }
    if (el.mainAppContainer) {
      el.mainAppContainer.style.display = 'none';
    }
    if (el.closeAuthGateBtn) {
      // Tombol kembali hanya boleh aktif jika dipanggil dari dalam aplikasi (saat pengguna sudah login)
      el.closeAuthGateBtn.style.display = (fromInside && state.currentUser) ? 'inline-flex' : 'none';
    }
    if (el.gateRememberMe) {
      el.gateRememberMe.checked = localStorage.getItem('sg_remember_me') !== 'false';
    }
    prefillAuthGate();
    switchGateTab('login');
    if (window.lucide && el.authGateScreen) {
      window.lucide.createIcons({ root: el.authGateScreen });
    }
  }

  function prefillAuthGate() {
    if (!el.gateLoginEmail) return;
    if (state.currentUser && state.currentUser.email && state.currentUser.id !== 'user-quinna' && state.currentUser.email !== 'budi@rantau.id') {
      if (!el.gateLoginEmail.value) {
        el.gateLoginEmail.value = state.currentUser.email || '';
      }
      if (el.gateLoginPassword && !el.gateLoginPassword.value && state.currentUser.password) {
        el.gateLoginPassword.value = state.currentUser.password;
      }
    } else {
      el.gateLoginEmail.value = '';
      if (el.gateLoginPassword) {
        el.gateLoginPassword.value = '';
      }
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

  function handleFloatingBudgetClick() {
    if (el.floatingBudgetBar && el.floatingBudgetBar.classList.contains('is-overbudget')) {
      checkBudgetThresholdAndWarn();
    } else {
      switchTab('viewAnggaran');
    }
  }

  function checkAuthGate(isInitialEntry = false) {
    const isRemembered = localStorage.getItem('sg_remember_me') !== 'false';
    const user = state.currentUser || (window.SmartData && window.SmartData.SmartStorage ? window.SmartData.SmartStorage.getCurrentUser() : null);

    if (user && isRemembered) {
      state.currentUser = user;
      hideAuthGate();
      renderUserProfile();
      if (el.shopeeLocationText && user.city) {
        el.shopeeLocationText.textContent = `Kost ${user.name.split(' ')[0]} • ${user.city}`;
      }
    } else {
      showAuthGate(false);
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

  async function handleGateLoginSubmit(e) {
    e.preventDefault();
    const email = el.gateLoginEmail ? el.gateLoginEmail.value.trim() : '';
    const pass = el.gateLoginPassword ? el.gateLoginPassword.value.trim() : '';

    if (!email) {
      showToast('Harap masukkan email atau nama pengguna!', 'warning');
      if (el.gateLoginEmail) el.gateLoginEmail.focus();
      return;
    }

    const res = await window.SmartData.SmartStorage.loginUserWithCloudFallback(email, pass);
    if (res.success) {
      state.currentUser = res.user;
      window.SmartData.SmartStorage.setCurrentUser(res.user);
      if (res.user.budget) {
        state.budgetLimit = res.user.budget;
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
      }
      const isRemember = el.gateRememberMe ? el.gateRememberMe.checked : true;
      localStorage.setItem('sg_remember_me', isRemember ? 'true' : 'false');

      // Sambungkan realtime listener ke sesi akun pengguna
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user);
      }

      hideAuthGate();
      renderUserProfile();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderGroceryList();
      renderAnggaranScreen();
      syncCartBadges();
      pushToFirestore();
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
    const budget = parseCurrencyInput(el.gateRegBudget.value) || 450000;

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
      state.activeItems = []; // Keranjang belanja bersih 0 item untuk akun baru
      state.historyTrips = []; // Riwayat belanja bersih 0 kali untuk akun baru
      window.SmartData.SmartStorage.saveBudgetLimit(budget);
      window.SmartData.SmartStorage.saveActiveItems([]);
      window.SmartData.SmartStorage.saveHistoryTrips([]);
      localStorage.setItem('sg_remember_me', 'true');
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user);
      }
      hideAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderGroceryList();
      renderHistoryScreen();
      renderUserProfile();
      renderAnggaranScreen();
      syncCartBadges();
      pushToFirestore();
      switchTab('viewKatalog');
      showToast(`Akun berhasil dibuat! Halo ${res.user.name} 🎉`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    } else {
      showToast(res.message, 'danger');
      if (window.soundCtrl) window.soundCtrl.playTick();
    }
  }

  // Google OAuth Login & Register Handler (Persis Screenshot 1)
  function openGoogleAccountModal() {
    if (el.googleAccountModal) {
      el.googleAccountModal.style.display = 'flex';
      if (window.lucide) window.lucide.createIcons({ root: el.googleAccountModal });
      if (el.googleCustomEmailInput) {
        setTimeout(() => el.googleCustomEmailInput.focus(), 150);
      }
    }
  }

  function closeGoogleAccountModal() {
    if (el.googleAccountModal) {
      el.googleAccountModal.style.display = 'none';
    }
  }

  function completeGoogleSignIn(googlePayload) {
    if (!googlePayload || !googlePayload.email) return;

    closeGoogleAccountModal();

    const res = window.SmartData.SmartStorage.loginOrRegisterGoogleUser(googlePayload);
    if (res && res.success) {
      state.currentUser = res.user;
      if (res.user.budget) {
        state.budgetLimit = res.user.budget;
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
      }

      if (res.isNew) {
        state.activeItems = [];
        state.historyTrips = [];
        window.SmartData.SmartStorage.saveActiveItems([]);
        window.SmartData.SmartStorage.saveHistoryTrips([]);
      }

      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user.id);
      }

      checkAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderGroceryList();
      renderHistoryScreen();
      renderUserProfile();
      renderAnggaranScreen();
      syncCartBadges();
      pushToFirestore();
      switchTab('viewKatalog');

      showToast(`Berhasil masuk dengan Google! Halo ${res.user.name} 🚀`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
    }
  }

  async function handleGoogleSignIn() {
    try {
      showToast('Menghubungkan ke Akun Google...', 'info');

      // 1. Pastikan Firebase terinisialisasi
      if (window.firebase && (!firebase.apps || !firebase.apps.length) && window.SmartData && window.SmartData.FIREBASE_CONFIG) {
        try {
          firebase.initializeApp(window.SmartData.FIREBASE_CONFIG);
        } catch (e) {
          console.warn('Firebase init error:', e);
        }
      }

      // 2. Coba signInWithPopup jika didukung Firebase Auth
      let popupSucceeded = false;
      if (window.firebase && firebase.auth && firebase.apps && firebase.apps.length) {
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const result = await firebase.auth().signInWithPopup(provider);
          if (result && result.user) {
            popupSucceeded = true;
            completeGoogleSignIn({
              uid: result.user.uid,
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL
            });
            return;
          }
        } catch (popupErr) {
          console.warn('Firebase popup unavailable or domain not registered:', popupErr);
        }
      }

      // 3. Fallback andal: Buka Google Account Chooser Modal langsung
      if (!popupSucceeded) {
        openGoogleAccountModal();
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      openGoogleAccountModal();
    }
  }

  function confirmGoogleAccount(email, name) {
    completeGoogleSignIn({
      uid: 'google-' + btoa(email).slice(0, 10),
      displayName: name || email.split('@')[0],
      email: email,
      photoURL: null
    });
  }

  function submitCustomGoogleAccount() {
    if (!el.googleCustomEmailInput) return;
    const email = el.googleCustomEmailInput.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Harap masukkan alamat email Google yang valid!', 'warning');
      return;
    }
    const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    confirmGoogleAccount(email, formattedName);
  }

  function gateQuickLogin(email, password) {
    const res = window.SmartData.SmartStorage.loginUser(email, password);
    if (res.success) {
      state.currentUser = res.user;
      if (res.user.budget) {
        state.budgetLimit = Number(res.user.budget);
        window.SmartData.SmartStorage.saveBudgetLimit(state.budgetLimit);
      }
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user.id);
      }
      state.activeItems = window.SmartData.SmartStorage.getActiveItems();
      state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
      checkAuthGate();
      updateBudgetSafetyMeter();
      renderShopeeCatalog();
      renderGroceryList();
      renderHistoryScreen();
      renderUserProfile();
      renderAnggaranScreen();
      syncCartBadges();
      pushToFirestore();
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

  function getEtalaseOverrides() {
    try {
      const raw = localStorage.getItem('sg_etalase_overrides');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveEtalaseOverride(productId, updates) {
    if (!productId || !updates) return;
    const overrides = getEtalaseOverrides();
    overrides[productId] = { ...(overrides[productId] || {}), ...updates };
    try {
      localStorage.setItem('sg_etalase_overrides', JSON.stringify(overrides));
    } catch (e) {}

    // Update in-memory SHOPEE_PRODUCTS
    if (window.SmartData && Array.isArray(window.SmartData.SHOPEE_PRODUCTS)) {
      const p = window.SmartData.SHOPEE_PRODUCTS.find(x => x.id === productId);
      if (p) {
        Object.assign(p, updates);
      }
    }

    // Update custom etalase products in storage and in-memory
    if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.getCustomEtalaseProducts) {
      const customList = window.SmartData.SmartStorage.getCustomEtalaseProducts();
      let updated = false;
      customList.forEach(cp => {
        if (cp.id === productId || (updates.oldName && cp.name === updates.oldName)) {
          Object.assign(cp, updates);
          updated = true;
        }
      });
      if (updated) {
        window.SmartData.SmartStorage.saveCustomEtalaseProducts(customList);
      }
    }
  }

  function getAllEtalaseProducts() {
    const custom = (window.SmartData && window.SmartData.SmartStorage) ? window.SmartData.SmartStorage.getCustomEtalaseProducts() : [];
    const base = (window.SmartData && window.SmartData.SHOPEE_PRODUCTS) ? window.SmartData.SHOPEE_PRODUCTS : [];
    const customList = Array.isArray(custom) ? custom : [];
    const customIds = new Set(customList.map(p => p.id));
    const combined = [...customList, ...base.filter(p => !customIds.has(p.id))];

    const overrides = getEtalaseOverrides();
    return combined.map(prod => {
      if (overrides[prod.id]) {
        return { ...prod, ...overrides[prod.id] };
      }
      return prod;
    });
  }

  function openAddEtalaseModal() {
    if (!el.addEtalaseModal) return;
    if (el.addEtalaseForm) el.addEtalaseForm.reset();
    if (el.etalaseEmoji) el.etalaseEmoji.value = '🛍️';
    if (el.etalaseUnit) el.etalaseUnit.value = 'pcs';

    if (el.etalaseUnitChips) {
      el.etalaseUnitChips.querySelectorAll('.unit-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-unit') === 'pcs');
      });
    }

    if (el.quickEmojiChips) {
      el.quickEmojiChips.querySelectorAll('.emoji-pick-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-emoji') === '🛍️');
      });
    }

    el.addEtalaseModal.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons({ root: el.addEtalaseModal });
    setTimeout(() => {
      if (el.etalaseItemName) el.etalaseItemName.focus();
    }, 150);
  }

  function closeAddEtalaseModal() {
    if (el.addEtalaseModal) {
      el.addEtalaseModal.style.display = 'none';
    }
  }

  function saveAddEtalase() {
    const name = (el.etalaseItemName ? el.etalaseItemName.value : '').trim();
    const category = el.etalaseCategory ? el.etalaseCategory.value : 'bahan_pokok';
    const unit = el.etalaseUnit ? el.etalaseUnit.value : 'pcs';
    const price = parseCurrencyInput(el.etalasePrice ? el.etalasePrice.value : 0);
    const origPrice = parseCurrencyInput(el.etalaseOriginalPrice ? el.etalaseOriginalPrice.value : 0);
    const emoji = (el.etalaseEmoji ? el.etalaseEmoji.value : '').trim() || '🛍️';
    const desc = (el.etalaseDesc ? el.etalaseDesc.value : '').trim();

    if (!name) {
      showToast('Nama barang etalase wajib diisi!', 'warning');
      if (el.etalaseItemName) el.etalaseItemName.focus();
      return;
    }

    if (!price || price <= 0) {
      showToast('Harga barang harus lebih dari Rp 0!', 'warning');
      if (el.etalasePrice) el.etalasePrice.focus();
      return;
    }

    const discountPercent = (origPrice > price) ? Math.round(((origPrice - price) / origPrice) * 100) : 0;

    const newProduct = {
      id: 'sp-custom-' + Date.now(),
      name: name,
      category: category,
      unit: unit,
      price: price,
      originalPrice: origPrice > price ? origPrice : null,
      discountPercent: discountPercent,
      rating: 5.0,
      soldCount: 'Baru',
      emoji: emoji,
      badge: 'Etalase Saya',
      description: desc || 'Barang kebutuhan tambahan di etalase.'
    };

    window.SmartData.SmartStorage.addCustomEtalaseProduct(newProduct);
    renderShopeeCatalog();
    closeAddEtalaseModal();
    showToast(`"${name}" berhasil ditambahkan ke etalase! 🎉`, 'success');
    if (window.soundCtrl) window.soundCtrl.playSuccess();
  }

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

  // Buka Modal Edit Barang Etalase (Ubah Nama, Harga, Kategori, Satuan langsung di etalase)
  function openEditEtalaseProductModal(prod) {
    if (!prod) return;
    const existingInCart = state.activeItems.find(i => isSameGroceryItem(i, prod));
    state.editingEtalaseProdId = prod.id;
    state.editingItemId = existingInCart ? existingInCart.id : null;

    if (el.modalTitle) el.modalTitle.textContent = `Edit Barang: ${prod.name}`;
    if (el.saveBtnText) el.saveBtnText.textContent = 'Simpan ke Etalase';
    if (el.inputItemName) el.inputItemName.value = prod.name || '';
    if (el.inputCategory) el.inputCategory.value = prod.category || 'bahan_pokok';
    const unit = prod.unit || 'pcs';
    if (el.inputUnit) el.inputUnit.value = unit;
    setModalUnit(unit);

    const effPrice = getEffectiveProductPrice(prod, state.storeLocation);
    if (el.inputUnitPrice) el.inputUnitPrice.value = formatNumberDots(effPrice || prod.price || 0);
    if (el.inputQty) el.inputQty.value = existingInCart ? (existingInCart.qty || 1) : 1;

    let formula = existingInCart ? (existingInCart.discountFormula || '') : '';
    if (!formula && prod.discountPercent) formula = `${prod.discountPercent}%`;
    if (el.inputDiscountFormula) el.inputDiscountFormula.value = formula;
    if (el.inputTaxPPN) el.inputTaxPPN.checked = existingInCart ? !!existingInCart.taxPPN : false;
    if (el.inputItemNote) el.inputItemNote.value = existingInCart ? (existingInCart.note || '') : (prod.description || '');

    updateModalCalculations();
    checkModalPriceComparison();
    if (el.itemModal) el.itemModal.classList.add('open');
    setTimeout(() => {
      if (el.inputItemName) {
        el.inputItemName.focus();
        el.inputItemName.select();
      }
    }, 150);
  }

  function renderShopeeCatalog() {
    if (!el.shopeeProductGrid) return;
    el.shopeeProductGrid.innerHTML = '';

    const products = getAllEtalaseProducts();
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
      const effPrice = getEffectiveProductPrice(prod, state.storeLocation);
      const trend = detectPriceTrend(prod.name, effPrice, state.storeLocation);
      const storeShort = (state.storeLocation || 'Toko Ini').split(/[–—-]/)[0].trim();
      const budgetStatus = getCartBudgetStatus();
      const isOverbudget = budgetStatus.isOverbudget;

      let trendPillHtml = '';
      if (trend && trend.status === 'up') {
        trendPillHtml = `
          <div class="shopee-trend-pill up" title="Harga naik di ${escapeHtml(storeShort)} dibanding catatan sebelumnya">
            <i data-lucide="arrow-up" style="width: 10px; height: 10px;"></i>
            <span>Naik ${formatRp(trend.diff)}</span>
          </div>
        `;
      } else if (trend && trend.status === 'drop') {
        trendPillHtml = `
          <div class="shopee-trend-pill drop" title="Harga turun di ${escapeHtml(storeShort)} dibanding catatan sebelumnya">
            <i data-lucide="arrow-down" style="width: 10px; height: 10px;"></i>
            <span>Turun ${formatRp(Math.abs(trend.diff))}</span>
          </div>
        `;
      } else if (trend && trend.status === 'stable' && trend.pastPrice) {
        trendPillHtml = `
          <div class="shopee-trend-pill stable" title="Harga stabil di ${escapeHtml(storeShort)}">
            <i data-lucide="equal" style="width: 10px; height: 10px;"></i>
            <span>Stabil (${escapeHtml(storeShort)})</span>
          </div>
        `;
      }

      const isCustomProd = prod.id && prod.id.startsWith('sp-custom-');

      const card = document.createElement('div');
      card.className = `shopee-card ${qtyInCart > 0 ? 'has-in-cart' : ''}`;
      card.innerHTML = `
        <div class="shopee-card-img-box" title="Klik untuk edit nama & harga barang di etalase" style="position: relative; cursor: pointer;">
          <span class="shopee-card-emoji">${prod.emoji || '🛍️'}</span>
          ${qtyInCart > 0 ? `<span class="shopee-in-cart-indicator">${qtyInCart} di Troli</span>` : isCustomProd ? `<span class="shopee-in-cart-indicator" style="background: var(--primary);">Etalase Saya</span>` : ''}
          <button type="button" class="btn-shopee-edit-badge" title="Edit nama & harga barang ini di etalase" style="position: absolute; top: 6px; right: 6px; width: 28px; height: 28px; border-radius: 50%; background: var(--bg-card); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 4; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <i data-lucide="edit-3" style="width: 13px; height: 13px; color: var(--primary);"></i>
          </button>
          ${isCustomProd ? `<button type="button" class="btn-delete-custom-etalase" title="Hapus dari etalase"><i data-lucide="trash-2" style="width: 12px; height: 12px;"></i></button>` : ''}
        </div>
        <div class="shopee-card-body">
          <div class="shopee-card-tag">${formatCategory(prod.category)} • ${prod.unit || 'pcs'}</div>
          <div class="shopee-card-title" title="${escapeHtml(prod.name)}" style="cursor: pointer;">${escapeHtml(prod.name)}</div>
          <div class="shopee-card-prices" style="cursor: pointer;" title="Klik untuk edit harga barang ini">
            <span class="shopee-price-main">${formatRp(effPrice)}</span>
            ${prod.originalPrice && prod.originalPrice > effPrice ? `<span class="shopee-price-original">${formatRp(prod.originalPrice)}</span>` : ''}
          </div>
          ${trendPillHtml}
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
                <span>${existingInCart && existingInCart.inCart ? 'Masuk Troli' : 'Centang Beli'}</span>
              </button>
            ` : isOverbudget ? `
              <button type="button" class="btn-shopee-add disabled-overbudget" title="Tidak dapat menambah barang karena anggaran belanja sudah overbudget">
                <i data-lucide="lock" style="width: 13px; height: 13px;"></i>
                <span>Overbudget</span>
              </button>
            ` : `
              <div style="display: flex; gap: 6px; width: 100%;">
                <button type="button" class="btn-shopee-add" style="flex: 1;">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                  <span>Keranjang</span>
                </button>
                <button type="button" class="btn-shopee-edit-item" title="Edit Barang di Etalase" style="width: 36px; height: 36px; flex-shrink: 0;">
                  <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
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

      const delCustomBtn = card.querySelector('.btn-delete-custom-etalase');
      if (delCustomBtn) {
        delCustomBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.SmartData.SmartStorage.deleteCustomEtalaseProduct(prod.id);
          renderShopeeCatalog();
          showToast(`"${prod.name}" dihapus dari etalase.`, 'warning');
          if (window.soundCtrl) window.soundCtrl.playTick();
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

      // Klik tombol edit, badge edit, judul, atau kotak harga -> Langsung buka modal edit etalase
      const editTriggers = card.querySelectorAll('.btn-shopee-edit-item, .btn-shopee-edit-badge, .shopee-card-title, .shopee-card-prices');
      editTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditEtalaseProductModal(prod);
        });
      });

      const checkToggleBtn = card.querySelector('.btn-shopee-check-toggle');
      if (checkToggleBtn && existingInCart) {
        checkToggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!existingInCart.inCart) {
            const p = calculateItemPricing(existingInCart);
            const budgetCheck = getCartBudgetStatus(p.finalSubtotal);
            if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
              const overAmt = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.potentialSpent - budgetCheck.limit);
              showToast(`🚨 Tidak dapat mencentang "${existingInCart.name}"! Total belanja melebihi pagu ${formatRp(budgetCheck.limit)} (Kelebihan ${formatRp(overAmt)}).`, 'danger');
              if (window.soundCtrl) window.soundCtrl.playWarning();
              showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
              return;
            }
          }
          existingInCart.inCart = !existingInCart.inCart;
          saveAndRefresh();
          if (window.soundCtrl) window.soundCtrl.playPop();
          showToast(existingInCart.inCart ? `"${existingInCart.name}" siap dibeli (masuk anggaran)!` : `"${existingInCart.name}" hanya disimpan di troli`, 'info');
        });
      }

      // Klik foto / emoji barang (kecuali tombol hapus / badge) -> Buka edit etalase
      const imgBox = card.querySelector('.shopee-card-img-box');
      if (imgBox) {
        imgBox.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-custom-etalase') || e.target.closest('.btn-shopee-edit-badge')) return;
          openEditEtalaseProductModal(prod);
        });
      }

      el.shopeeProductGrid.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons({ root: el.shopeeProductGrid });
    }
  }

  function addToCartFromCatalog(prod) {
    const effPrice = getEffectiveProductPrice(prod, state.storeLocation);
    const budgetCheck = getCartBudgetStatus(effPrice);

    // Fitur Proteksi Pagu: Tidak bisa menambahkan barang jika overbudget
    if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
      const overAmount = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.baseSpent + effPrice - budgetCheck.limit);
      showToast(`🚨 Tidak bisa menambah "${prod.name}"! Anggaran dompet ${formatRp(budgetCheck.limit)} terlampaui (Overbudget ${formatRp(overAmount)}). Kurangi barang belanjaan lain terlebih dahulu!`, 'danger');
      if (window.soundCtrl) window.soundCtrl.playWarning();
      showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
      return false;
    }

    const existing = state.activeItems.find(i => isSameGroceryItem(i, prod));
    if (existing) {
      existing.qty = (Number(existing.qty) || 0) + 1;
      if (!existing.productId) existing.productId = prod.id;
      if (effPrice > 0) existing.unitPrice = effPrice;
    } else {
      state.activeItems.push({
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        unit: prod.unit || 'pcs',
        qty: 1,
        unitPrice: effPrice,
        discountType: prod.discountPercent ? 'percent' : 'none',
        discountValue: prod.discountPercent || 0,
        stackedDiscount: { enabled: false, type: 'percent', value: 0 },
        inCart: true,
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

    showToast(`${prod.name} (${formatRp(effPrice)}) dimasukkan ke keranjang!`, 'success');
    if (window.soundCtrl) window.soundCtrl.playPop();

    checkBudgetThresholdAndWarn();
    return true;
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
    const isRemembered = localStorage.getItem('sg_remember_me') !== 'false';
    if (!isRemembered) {
      // Jika pengguna tidak mencentang Ingat Saya, hapus sesi login saat refresh
      window.SmartData.SmartStorage.logoutUser();
      state.currentUser = null;
    } else {
      state.currentUser = window.SmartData.SmartStorage.getCurrentUser();
    }
    // Bersihkan sisa akun demo / tamu / budi / default lama jika ada
    if (state.currentUser && (state.currentUser.id === 'user-quinna' || state.currentUser.email === 'tamu@rantau.id' || state.currentUser.name === 'Tamu Rantau' || state.currentUser.email === 'budi@rantau.id' || state.currentUser.name === 'Budi Santoso')) {
      window.SmartData.SmartStorage.logoutUser();
      state.currentUser = null;
    }
    if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
      window.SmartData.FirestoreRealtimeSync.setSessionUser(state.currentUser);
    }
    const rawItems = window.SmartData.SmartStorage.getActiveItems();
    state.activeItems = groupActiveItems(rawItems);
    window.SmartData.SmartStorage.saveActiveItems(state.activeItems);

    // Sinkronisasi pagu sesuai dengan akun yang aktif
    if (state.currentUser && state.currentUser.budget) {
      state.budgetLimit = Number(state.currentUser.budget);
      window.SmartData.SmartStorage.saveBudgetLimit(state.budgetLimit);
    } else {
      state.budgetLimit = window.SmartData.SmartStorage.getBudgetLimit() || 400000;
    }

    state.storeLocation = window.SmartData.SmartStorage.getStoreLocation();
    state.shoppingDate = window.SmartData.SmartStorage.getShoppingDate();
    state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
    window.SmartData.SmartStorage.saveHistoryTrips(state.historyTrips);
    state.benchmarks = window.SmartData.SmartStorage.getBenchmarks();

    if (el.sessionStoreLocation) el.sessionStoreLocation.value = state.storeLocation;
    if (el.sessionLocationDisplay) el.sessionLocationDisplay.textContent = state.storeLocation || 'Lotte Mart Grocery – Puri Indah';
    if (el.headerCurrentStoreName) el.headerCurrentStoreName.textContent = state.storeLocation || 'Lotte Mart Grocery – Puri Indah';
    if (el.sessionShoppingDate) el.sessionShoppingDate.value = state.shoppingDate;
    if (el.budgetLimitInput) el.budgetLimitInput.value = formatNumberDots(state.budgetLimit);
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

  // ==========================================
  // STORE LOCATION MODAL HANDLERS (PERSIS SCREENSHOT 2)
  // ==========================================
  const SCREENSHOT_STORE_LIST = [
    'Lotte Mart Grocery – Puri Indah',
    'Super Indo – Intercon Kebon Jeruk',
    'Indomaret Fresh – Kemanggisan',
    'Grand Lucky Superstore – Meruya',
    'Alfamidi Super – Palmerah',
    'Hypermart – Puri Indah',
    'Pasar Tradisional Puri Indah'
  ];

  function openStoreLocationModal() {
    renderStoreLocationCardsList();
    if (el.storeLocationModal) {
      el.storeLocationModal.style.display = 'flex';
    }
    if (window.lucide && el.storeLocationModal) {
      window.lucide.createIcons({ root: el.storeLocationModal });
    }
  }

  function closeStoreLocationModal() {
    if (el.storeLocationModal) {
      el.storeLocationModal.style.display = 'none';
    }
  }

  function setStoreLocation(storeName) {
    const trimmed = (storeName || '').trim();
    if (!trimmed) return;

    state.storeLocation = trimmed;
    window.SmartData.SmartStorage.saveStoreLocation(trimmed);

    if (el.sessionStoreLocation) el.sessionStoreLocation.value = trimmed;
    if (el.sessionLocationDisplay) el.sessionLocationDisplay.textContent = trimmed;
    if (el.headerCurrentStoreName) el.headerCurrentStoreName.textContent = trimmed;

    syncStoreChips(trimmed);
    renderStoreLocationCardsList();
    renderGroceryList();
    renderShopeeCatalog();
    pushToFirestore();

    showToast(`Lokasi toko aktif: ${trimmed}`, 'info');
    if (window.soundCtrl) window.soundCtrl.playTick();
    closeStoreLocationModal();
  }

  function renderStoreLocationCardsList() {
    if (!el.storeLocationCardsList) return;
    el.storeLocationCardsList.innerHTML = '';

    // Gabungkan list 7 toko screenshot dengan custom stores dari storage
    const customStores = window.SmartData.SmartStorage.getCustomStores ? window.SmartData.SmartStorage.getCustomStores() : [];
    const allStores = [...SCREENSHOT_STORE_LIST];
    customStores.forEach(cs => {
      if (!allStores.some(s => s.toLowerCase() === cs.toLowerCase())) {
        allStores.push(cs);
      }
    });

    const activeNorm = (state.storeLocation || '').toLowerCase().replace(/[–—]/g, '-');

    allStores.forEach(storeName => {
      const row = document.createElement('div');
      const storeNorm = storeName.toLowerCase().replace(/[–—]/g, '-');
      const isActive = activeNorm === storeNorm || activeNorm.includes(storeNorm) || storeNorm.includes(activeNorm);

      row.className = `store-select-row ${isActive ? 'is-active' : ''}`;
      row.innerHTML = `
        <span class="store-row-title">${storeName}</span>
        ${isActive ? '<span class="store-active-badge">✓ Aktif</span>' : ''}
      `;

      row.addEventListener('click', () => {
        setStoreLocation(storeName);
      });

      el.storeLocationCardsList.appendChild(row);
    });
  }

  // Deteksi Lokasi Terdekat dengan GPS
  function handleDetectGpsStore() {
    if (!navigator.geolocation) {
      showToast('Fitur GPS tidak didukung browser ini.', 'warning');
      return;
    }

    if (el.detectGpsStoreBtn) {
      el.detectGpsStoreBtn.classList.add('detecting');
      el.detectGpsStoreBtn.innerHTML = `
        <i data-lucide="loader-2" class="spin-animation" style="width: 17px; height: 17px;"></i>
        <span>Mendeteksi Koordinat GPS...</span>
      `;
      if (window.lucide) window.lucide.createIcons({ root: el.detectGpsStoreBtn });
    }

    const resetBtn = () => {
      if (el.detectGpsStoreBtn) {
        el.detectGpsStoreBtn.classList.remove('detecting');
        el.detectGpsStoreBtn.innerHTML = `
          <i data-lucide="compass" style="width: 17px; height: 17px;"></i>
          <span>Deteksi Lokasi Terdekat (GPS)</span>
        `;
        if (window.lucide) window.lucide.createIcons({ root: el.detectGpsStoreBtn });
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resetBtn();
        // Koordinat toko di Jakarta Barat
        const STORE_COORDS = [
          { name: 'Lotte Mart Grocery – Puri Indah', lat: -6.1865, lng: 106.7350 },
          { name: 'Super Indo – Intercon Kebon Jeruk', lat: -6.1950, lng: 106.7580 },
          { name: 'Indomaret Fresh – Kemanggisan', lat: -6.1920, lng: 106.7860 },
          { name: 'Grand Lucky Superstore – Meruya', lat: -6.1980, lng: 106.7450 },
          { name: 'Alfamidi Super – Palmerah', lat: -6.2080, lng: 106.7930 },
          { name: 'Hypermart – Puri Indah', lat: -6.1880, lng: 106.7360 },
          { name: 'Pasar Tradisional Puri Indah', lat: -6.1850, lng: 106.7330 }
        ];

        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let closest = STORE_COORDS[0];
        let minDist = Infinity;

        STORE_COORDS.forEach(store => {
          const dLat = store.lat - userLat;
          const dLng = store.lng - userLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < minDist) {
            minDist = dist;
            closest = store;
          }
        });

        setStoreLocation(closest.name);
        showToast(`GPS terdeteksi! Memilih toko terdekat: ${closest.name}`, 'success');
      },
      (err) => {
        resetBtn();
        console.warn('GPS Error / Permintaan ditolak:', err);
        const defaultStore = 'Lotte Mart Grocery – Puri Indah';
        setStoreLocation(defaultStore);
        showToast(`Lokasi diset ke toko utama: ${defaultStore}`, 'info');
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }

  // Tambah Toko Baru dari Input
  function handleAddNewStoreSubmit() {
    if (!el.inputNewStoreName) return;
    const name = el.inputNewStoreName.value.trim();
    if (!name) {
      showToast('Masukkan nama toko / minimarket baru!', 'warning');
      return;
    }

    if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.addCustomStore) {
      window.SmartData.SmartStorage.addCustomStore(name);
    }

    el.inputNewStoreName.value = '';
    setStoreLocation(name);
    showToast(`Toko baru "${name}" berhasil ditambahkan & diaktifkan! 🎉`, 'success');
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
        el.inputUnitPrice.value = formatNumberDots(sug.defaultPrice);
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
      el.listCheckedStatus.textContent = checkedCount > 0 ? `• ${checkedCount} Dipilih` : '• Belum ada dipilih';
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

        // Discount tag text & Pajak PPN (Dihapus tulisan 5% off agar seimbang & rapi)
        let discountBadgeHtml = '';

        const taxBadgeHtml = item.taxPPN ? `<span class="discount-applied-badge" style="background: #FFF0F4; color: #D84A75; border-color: #FBCFE8;"><i data-lucide="receipt" style="width: 10px; height: 10px;"></i> PPN 11%</span>` : '';

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
          <!-- Baris 1: Tombol Centang Beli (Kiri) + Nama Barang Penuh Sebaris + Tombol Edit/Hapus (Kanan) -->
          <div class="card-top-line">
            <button class="cart-check-btn ${item.inCart ? 'checked' : ''}" data-action="toggle-cart" title="${item.inCart ? 'Dicentang untuk dibeli (Klik untuk batalkan)' : 'Klik centang saat ingin beli barang ini'}" aria-label="Tandai Beli">
              <i data-lucide="check" style="width: 16px; height: 16px;"></i>
            </button>
            <div class="card-name-block" data-action="edit" title="Klik untuk edit barang">
              <span class="item-name">${escapeHtml(item.name)}</span>
              <div class="card-sub-row">
                <span class="item-price-at">@ ${formatRp(pricing.finalUnitPrice)}/${item.unit || 'pcs'}</span>
                <span class="sub-sep">•</span>
                <span class="category-tag-mini">${catObj.name}</span>
                ${trendBadgeHtml}
                ${discountBadgeHtml}
                ${taxBadgeHtml}
              </div>
            </div>
            <div class="card-mini-actions-row">
              <button class="card-action-icon-btn" data-action="edit" title="Edit Barang" aria-label="Edit">
                <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="card-action-icon-btn delete" data-action="delete" title="Hapus Barang" aria-label="Hapus">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>

          <!-- Baris 2: Subtotal Harga Sebaris (Kiri) + Stepper Ramah Jari Layar HP (Kanan) -->
          <div class="card-bottom-line">
            <div class="card-price-stack" data-action="edit" title="Klik untuk edit barang">
              <span class="card-price-label">Subtotal:</span>
              ${pricing.totalSavings > 0 ? `<span class="card-original-price">${formatRp(pricing.normalTotal)}</span>` : ''}
              <span class="card-final-subtotal">${formatRp(pricing.finalSubtotal)}</span>
            </div>
            <div class="stepper-control-compact">
              <button class="stepper-btn-compact" data-action="qty-minus" aria-label="Kurangi Jumlah">−</button>
              <span class="stepper-value-compact">${item.qty}</span>
              <button class="stepper-btn-compact" data-action="qty-plus" aria-label="Tambah Jumlah">+</button>
            </div>
          </div>
          ${item.note ? `<div class="item-note-inline"><em>Catatan: ${escapeHtml(item.note)}</em></div>` : ''}
        `;

        // Card button click delegation
        card.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-action]');
          if (!btn) return;
          const action = btn.dataset.action;

          if (action === 'toggle-cart') {
            if (!item.inCart) {
              const p = calculateItemPricing(item);
              const budgetCheck = getCartBudgetStatus(p.finalSubtotal);
              if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
                const overAmt = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.potentialSpent - budgetCheck.limit);
                showToast(`🚨 Tidak dapat mencentang "${item.name}"! Total belanja melebihi pagu anggaran ${formatRp(budgetCheck.limit)} (Kelebihan ${formatRp(overAmt)}).`, 'danger');
                if (window.soundCtrl) window.soundCtrl.playWarning();
                showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
                return;
              }
            }
            item.inCart = !item.inCart;
            saveAndRefresh();
            if (window.soundCtrl) window.soundCtrl.playPop();
            if (item.inCart) {
              showToast(`"${item.name}" dicentang siap beli!`, 'success');
            }
          } else if (action === 'qty-plus') {
            const pricingNow = calculateItemPricing(item);
            const tempMore = { ...item, qty: (Number(item.qty) || 1) + 1 };
            const pricingMore = calculateItemPricing(tempMore);
            const costDiff = pricingMore.finalSubtotal - pricingNow.finalSubtotal;
            if (item.inCart) {
              const budgetCheck = getCartBudgetStatus(costDiff);
              if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
                const overAmt = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.potentialSpent - budgetCheck.limit);
                showToast(`🚨 Tidak dapat menambah kuantitas "${item.name}"! Total belanja melebihi pagu ${formatRp(budgetCheck.limit)} (Kelebihan ${formatRp(overAmt)}).`, 'danger');
                if (window.soundCtrl) window.soundCtrl.playWarning();
                showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
                return;
              }
            }
            item.qty = (Number(item.qty) || 1) + 1;
            saveAndRefresh();
            if (window.soundCtrl) window.soundCtrl.playTick();
          } else if (action === 'qty-minus') {
            if (item.qty > 1) {
              item.qty -= 1;
              saveAndRefresh();
              if (window.soundCtrl) window.soundCtrl.playTick();
            } else {
              // Langsung hapus saat kuantitas 0 tanpa minta persetujuan
              deleteItem(item.id);
            }
          } else if (action === 'edit') {
            openEditItemModal(item);
          } else if (action === 'delete') {
            // Langsung hapus barang tanpa minta persetujuan
            deleteItem(item.id);
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
    if (newStatus) {
      let totalIfAll = 0;
      state.activeItems.forEach(i => {
        const p = calculateItemPricing(i);
        totalIfAll += p.finalSubtotal;
      });
      const userBudget = state.currentUser && state.currentUser.budget ? Number(state.currentUser.budget) : null;
      const limit = (userBudget && userBudget > 0) ? userBudget : (state.budgetLimit || 400000);
      if (totalIfAll > limit) {
        showToast(`🚨 Tidak dapat mencentang semua barang! Total belanja ${formatRp(totalIfAll)} melebihi batas anggaran ${formatRp(limit)}.`, 'danger');
        if (window.soundCtrl) window.soundCtrl.playWarning();
        showOverbudgetWarningPopup(totalIfAll, limit);
        return;
      }
    }
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

    // Pagu Bulanan: Utamakan pagu bulanan dari akun aktif (misal Siti: Rp 400.000)
    const userBudget = state.currentUser && state.currentUser.budget ? Number(state.currentUser.budget) : null;
    const limit = (userBudget && userBudget > 0) ? userBudget : (state.budgetLimit || 400000);
    state.budgetLimit = limit;
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
      el.listCheckedStatus.textContent = checkedCount > 0 ? `• ${checkedCount} Dipilih` : '• Belum ada dipilih';
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

    // Subscribe ke listener REALTIME onSnapshot() - NO getDoc() / getDocs()
    // Setiap ada perubahan data di HP atau PC lain, listener aktif ini langsung menangkap mutasi & UI re-render seketika!
    syncMgr.listenToSession(cloudData => {
      if (!cloudData) return;

      const isFromOtherDevice = cloudData.updateDeviceId && cloudData.updateDeviceId !== syncMgr.deviceId;
      let hasChanged = false;

      // 1. Items array dari Firestore (tambah item, ubah qty, centang beli, atau hapus)
      if (Array.isArray(cloudData.items)) {
        const curJson = JSON.stringify(state.activeItems);
        const cloudJson = JSON.stringify(cloudData.items);
        if (curJson !== cloudJson) {
          state.activeItems = groupActiveItems(cloudData.items);
          window.SmartData.SmartStorage.saveActiveItems(state.activeItems);
          hasChanged = true;
        }
      }

      // 2. Wallet limit dari Firestore (ubah batas anggaran / limit dompet secara realtime)
      if (typeof cloudData.walletLimit === 'number' && cloudData.walletLimit > 0) {
        if (state.budgetLimit !== cloudData.walletLimit) {
          state.budgetLimit = cloudData.walletLimit;
          window.SmartData.SmartStorage.saveBudgetLimit(state.budgetLimit);
          if (state.currentUser) {
            state.currentUser.budget = cloudData.walletLimit;
            window.SmartData.SmartStorage.setCurrentUser(state.currentUser);
            window.SmartData.SmartStorage.updateUserBudget(state.currentUser.id || state.currentUser.email, cloudData.walletLimit);
          }
          if (el.budgetLimitInput) {
            el.budgetLimitInput.value = formatNumberDots(state.budgetLimit);
          }
          hasChanged = true;
        }
      }

      // 3. Store location dari Firestore (pindah supermarket)
      if (cloudData.storeLocation && cloudData.storeLocation !== state.storeLocation) {
        state.storeLocation = cloudData.storeLocation;
        window.SmartData.SmartStorage.saveStoreLocation(state.storeLocation);
        if (el.sessionStoreLocation) el.sessionStoreLocation.value = state.storeLocation;
        if (el.sessionLocationDisplay) el.sessionLocationDisplay.textContent = state.storeLocation;
        if (el.headerCurrentStoreName) el.headerCurrentStoreName.textContent = state.storeLocation;
        syncStoreChips(state.storeLocation);
        hasChanged = true;
      }

      // 4. Shopping date dari Firestore
      if (cloudData.shoppingDate && cloudData.shoppingDate !== state.shoppingDate) {
        state.shoppingDate = cloudData.shoppingDate;
        window.SmartData.SmartStorage.saveShoppingDate(state.shoppingDate);
        if (el.sessionShoppingDate) el.sessionShoppingDate.value = state.shoppingDate;
        hasChanged = true;
      }

      // Render ulang seluruh UI otomatis seketika tanpa perlu me-reload / F5 browser!
      if (hasChanged) {
        renderShopeeCatalog();
        renderGroceryList();
        updateBudgetSafetyMeter();
        renderAnggaranScreen();
        syncCartBadges();

        // Notifikasi realtime jika perubahan dibuat dari perangkat lain (HP -> PC atau PC -> HP)
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
  // MODAL: ADD / EDIT ITEM & DISCOUNT CALCULATOR (PERSIS SCREENSHOT 2)
  // ==========================================

  function setModalUnit(unit) {
    if (el.inputUnit) el.inputUnit.value = unit;
    if (el.unitSelectorChips) {
      el.unitSelectorChips.querySelectorAll('.unit-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === unit);
      });
    }
  }

  function applyDiscountPreset(formula) {
    if (el.inputDiscountFormula) {
      el.inputDiscountFormula.value = formula;
      updateModalCalculations();
    }
  }

  function openAddItemModal() {
    state.editingItemId = null;
    state.editingEtalaseProdId = null;
    if (el.modalTitle) el.modalTitle.textContent = 'Tambah Belanjaan Baru';
    if (el.saveBtnText) el.saveBtnText.textContent = 'Simpan ke Troli';
    if (el.inputItemName) el.inputItemName.value = '';
    if (el.inputCategory) el.inputCategory.value = 'bahan_pokok';
    if (el.inputUnit) el.inputUnit.value = 'kg';
    setModalUnit('kg');
    if (el.inputQty) el.inputQty.value = 1;
    if (el.inputUnitPrice) el.inputUnitPrice.value = '';
    if (el.inputDiscountFormula) el.inputDiscountFormula.value = '';
    if (el.inputTaxPPN) el.inputTaxPPN.checked = false;
    if (el.inputItemNote) el.inputItemNote.value = '';

    updateModalCalculations();
    checkModalPriceComparison();

    if (el.itemModal) el.itemModal.classList.add('open');
    setTimeout(() => {
      if (el.inputItemName) el.inputItemName.focus();
    }, 150);
  }

  function openEditItemModal(item) {
    state.editingItemId = item.id;
    state.editingEtalaseProdId = item.productId || null;
    if (el.modalTitle) el.modalTitle.textContent = 'Edit Item Belanja';
    if (el.saveBtnText) el.saveBtnText.textContent = 'Perbarui Barang';
    if (el.inputItemName) el.inputItemName.value = item.name;
    if (el.inputCategory) el.inputCategory.value = item.category || 'bahan_pokok';
    const unit = item.unit || 'pcs';
    if (el.inputUnit) el.inputUnit.value = unit;
    setModalUnit(unit);
    if (el.inputQty) el.inputQty.value = item.qty || 1;
    if (el.inputUnitPrice) el.inputUnitPrice.value = formatNumberDots(item.unitPrice || 0);

    // Diskon formula fleksibel (25%, 50% + 20%, Rp 5000)
    let formula = item.discountFormula || '';
    if (!formula) {
      if (item.discountType === 'percent' && item.discountValue) formula = `${item.discountValue}%`;
      else if (item.discountType === 'amount' && item.discountValue) formula = `Rp ${formatNumberDots(item.discountValue)}`;
      else if (item.discountType === 'stacked' && (item.stackedDiscount?.val1 || item.stackedDiscount?.val2)) {
        formula = `${item.stackedDiscount.val1}% + ${item.stackedDiscount.val2}%`;
      }
    }
    if (el.inputDiscountFormula) el.inputDiscountFormula.value = formula;
    if (el.inputTaxPPN) el.inputTaxPPN.checked = !!item.taxPPN;
    if (el.inputItemNote) el.inputItemNote.value = item.note || '';

    updateModalCalculations();
    checkModalPriceComparison();
    if (el.itemModal) el.itemModal.classList.add('open');
    setTimeout(() => {
      if (el.inputItemName) el.inputItemName.focus();
    }, 150);
  }

  function closeItemModal() {
    state.editingItemId = null;
    state.editingEtalaseProdId = null;
    if (el.itemModal) el.itemModal.classList.remove('open');
  }

  // Live Reactive Discount Simulator Calculation inside Modal (Persis Screenshot 2)
  function updateModalCalculations() {
    const qty = Math.max(1, Number(el.inputQty?.value) || 1);
    const unitPrice = Math.max(0, parseCurrencyInput(el.inputUnitPrice?.value) || 0);

    const formula = el.inputDiscountFormula ? el.inputDiscountFormula.value.trim() : '';
    const parsed = parseDiscountFormula(formula, unitPrice);
    const discountAmount = Math.round(parsed.discountAmount);
    const discountPercent = parsed.discountPercent;

    const discountedUnitPrice = Math.max(0, unitPrice - discountAmount);
    const discountedSubtotal = Math.round(qty * discountedUnitPrice);

    let taxAmount = 0;
    const hasPPN = el.inputTaxPPN ? el.inputTaxPPN.checked : false;
    if (hasPPN) {
      taxAmount = Math.round(discountedSubtotal * 0.11);
    }
    const finalSubtotal = discountedSubtotal + taxAmount;

    // Tampilkan Breakdown Persis Screenshot 2
    if (el.liveNormalPrice) el.liveNormalPrice.textContent = formatRp(unitPrice);
    if (el.liveDiscountDeduction) {
      el.liveDiscountDeduction.textContent = `${formatRp(discountAmount)} (${discountPercent}%)`;
    }
    if (el.liveDiscountedPrice) {
      el.liveDiscountedPrice.textContent = formatRp(discountedUnitPrice);
    }
    if (el.liveTaxRow && el.liveTaxAmount) {
      if (hasPPN) {
        el.liveTaxRow.style.display = 'flex';
        el.liveTaxAmount.textContent = `+ ${formatRp(taxAmount)}`;
      } else {
        el.liveTaxRow.style.display = 'none';
      }
    }
    if (el.liveFinalSubtotal) {
      el.liveFinalSubtotal.textContent = formatRp(finalSubtotal);
    }
  }

  // Real-time Price Comparison Insight inside Modal (Persis Screenshot 2: ↓ Harga turun)
  // Catatan: Kotak antar toko di Screenshot 4 sudah dihapus sesuai instruksi user
  function checkModalPriceComparison() {
    const name = el.inputItemName ? el.inputItemName.value : '';
    const price = parseCurrencyInput(el.inputUnitPrice ? el.inputUnitPrice.value : 0) || 0;
    if (!name.trim() || price <= 0) {
      if (el.priceComparisonNotice) el.priceComparisonNotice.style.display = 'none';
      return;
    }

    const trend = detectPriceTrend(name, price, state.storeLocation);
    if (!el.priceComparisonNotice) return;
    el.priceComparisonNotice.style.display = 'block';

    const storeShort = (trend.store || state.storeLocation || 'Toko Ini').split(/[–—-]/)[0].trim();
    let badgeClass = 'drop';
    let icon = 'arrow-down';
    let text = '';

    if (trend.status === 'drop') {
      badgeClass = 'drop';
      icon = 'arrow-down';
      text = `Harga turun (${formatRp(trend.pastPrice)} di ${storeShort} • ${trend.period || '26 September 2026'})`;
    } else if (trend.status === 'up') {
      badgeClass = 'up';
      icon = 'arrow-up';
      text = `Harga naik (${formatRp(trend.pastPrice)} di ${storeShort} • ${trend.period || '26 September 2026'})`;
    } else if (trend.status === 'stable') {
      badgeClass = 'stable';
      icon = 'equal';
      text = `Harga stabil (${formatRp(trend.pastPrice)} di ${storeShort} • ${trend.period || '26 September 2026'})`;
    } else {
      badgeClass = 'stable';
      icon = 'info';
      text = `Barang baru di ${storeShort} (Acuan belanja berikutnya)`;
    }

    el.priceComparisonNotice.innerHTML = `
      <div class="modal-price-trend-badge ${badgeClass}">
        <i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>
        <span>${text}</span>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons({ root: el.priceComparisonNotice });
  }

  // Save Item from Modal (Persis Screenshot 2: dengan formula diskon & PPN 11%)
  function saveItemFromModal() {
    const name = el.inputItemName.value.trim();
    const category = el.inputCategory.value;
    const unit = el.inputUnit.value || 'pcs';
    const rawPrice = parseCurrencyInput(el.inputUnitPrice.value);
    const rawQty = Number(el.inputQty.value);

    if (!name) {
      showToast('Silakan masukkan nama barang belanjaan.', 'warning');
      if (el.inputItemName) el.inputItemName.focus();
      return;
    }

    if (!el.inputUnitPrice.value.trim() || isNaN(rawPrice) || rawPrice <= 0) {
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
    const note = el.inputItemNote ? el.inputItemNote.value.trim() : '';
    const discountFormula = el.inputDiscountFormula ? el.inputDiscountFormula.value.trim() : '';
    const taxPPN = el.inputTaxPPN ? el.inputTaxPPN.checked : false;

    // Backward compatible discount fields
    let discountType = 'none';
    let discountValue = 0;
    if (discountFormula) {
      const parsed = parseDiscountFormula(discountFormula, unitPrice);
      if (parsed.discountAmount > 0) {
        discountType = 'percent';
        discountValue = parsed.discountPercent;
      }
    }

    // 1. UPDATE OVERRIDE DI ETALASE JIKA DIEDIT DARI ETALASE ATAU TERKAIT PRODUK ETALASE
    const etalaseProdId = state.editingEtalaseProdId;
    if (etalaseProdId) {
      saveEtalaseOverride(etalaseProdId, {
        name,
        price: unitPrice,
        unit,
        category
      });
      updateStoreProductPrice(name, unitPrice, state.storeLocation, false);
      updateStoreProductPrice(etalaseProdId, unitPrice, state.storeLocation, false);
    }

    if (state.editingItemId) {
      // Edit existing
      let idx = state.activeItems.findIndex(i => i.id === state.editingItemId);
      if (idx === -1) {
        idx = state.activeItems.findIndex(i => isSameGroceryItem(i, { id: state.editingItemId, name }));
      }
      if (idx !== -1) {
        const oldItem = state.activeItems[idx];
        const oldPricing = calculateItemPricing(oldItem);
        const oldCost = oldItem.inCart ? oldPricing.finalSubtotal : 0;
        const candidateItem = {
          ...oldItem,
          name,
          category,
          unit,
          qty,
          unitPrice,
          discountFormula,
          discountType,
          discountValue,
          taxPPN,
          note
        };
        const targetProdId = candidateItem.productId || oldItem.productId || etalaseProdId;
        if (targetProdId) {
          saveEtalaseOverride(targetProdId, {
            name,
            price: unitPrice,
            unit,
            category
          });
        }
        const match = findMatchingShopeeProduct({ name: oldItem.name });
        if (match) {
          saveEtalaseOverride(match.id, {
            name,
            price: unitPrice,
            unit,
            category
          });
        }

        const candidatePricing = calculateItemPricing(candidateItem);
        const candidateCost = candidateItem.inCart ? candidatePricing.finalSubtotal : 0;
        const costDiff = candidateCost - oldCost;

        if (costDiff > 0) {
          const budgetCheck = getCartBudgetStatus(costDiff);
          if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
            const overAmt = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.potentialSpent - budgetCheck.limit);
            showToast(`🚨 Tidak dapat menyimpan perubahan "${name}"! Total belanja melebihi pagu anggaran ${formatRp(budgetCheck.limit)} (Kelebihan ${formatRp(overAmt)}). Kurangi kuantitas barang!`, 'danger');
            if (window.soundCtrl) window.soundCtrl.playWarning();
            showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
            return;
          }
        }

        state.activeItems[idx] = candidateItem;

        // Perbarui harga toko di katalog / etalase & benchmark
        updateStoreProductPrice(name, unitPrice, state.storeLocation, false);
        if (oldItem.productId) {
          updateStoreProductPrice(oldItem.productId, unitPrice, state.storeLocation, false);
        }
        if (oldItem.name && oldItem.name !== name) {
          updateStoreProductPrice(oldItem.name, unitPrice, state.storeLocation, false);
        }

        // Perbarui custom etalase jika barang ini ada di custom etalase
        if (window.SmartData && window.SmartData.SmartStorage && window.SmartData.SmartStorage.getCustomEtalaseProducts) {
          const customList = window.SmartData.SmartStorage.getCustomEtalaseProducts();
          let customUpdated = false;
          customList.forEach(cp => {
            if (cp.id === oldItem.productId || cp.id === oldItem.id || isSameGroceryItem(cp, { name: oldItem.name })) {
              cp.name = name;
              cp.price = unitPrice;
              cp.category = category;
              cp.unit = unit;
              customUpdated = true;
            }
          });
          if (customUpdated) {
            window.SmartData.SmartStorage.saveCustomEtalaseProducts(customList);
          }
        }

        showToast(`"${name}" berhasil diperbarui!`, 'success');
      }
      state.editingItemId = null;
    } else if (etalaseProdId) {
      // Diedit langsung dari etalase: sinkronkan juga barang di troli jika ada
      state.activeItems.forEach(it => {
        if (it.productId === etalaseProdId || isSameGroceryItem(it, { id: etalaseProdId, name })) {
          it.name = name;
          it.unitPrice = unitPrice;
          it.unit = unit;
          it.category = category;
        }
      });
      showToast(`"${name}" di etalase berhasil diperbarui!`, 'success');
    } else {
      // Add new or group: check overbudget protection
      const candidateItem = {
        name,
        category,
        unit,
        qty,
        unitPrice,
        discountFormula,
        discountType,
        discountValue,
        taxPPN,
        inCart: true
      };
      const candidatePricing = calculateItemPricing(candidateItem);
      const budgetCheck = getCartBudgetStatus(candidatePricing.finalSubtotal);
      if (budgetCheck.isOverbudget || budgetCheck.wouldBeOverbudget) {
        const overAmt = budgetCheck.excess > 0 ? budgetCheck.excess : (budgetCheck.potentialSpent - budgetCheck.limit);
        showToast(`🚨 Tidak dapat menambahkan "${name}"! Total belanja melebihi pagu anggaran ${formatRp(budgetCheck.limit)} (Kelebihan ${formatRp(overAmt)}).`, 'danger');
        if (window.soundCtrl) window.soundCtrl.playWarning();
        showOverbudgetWarningPopup(budgetCheck.potentialSpent, budgetCheck.limit);
        return;
      }

      // Add new: check if same item already exists in cart, group if so!
      const existing = state.activeItems.find(i => isSameGroceryItem(i, { name, category, unit }));
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + qty;
        if (unitPrice > 0) existing.unitPrice = unitPrice;
        if (discountFormula) existing.discountFormula = discountFormula;
        if (taxPPN) existing.taxPPN = taxPPN;
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
          discountFormula,
          discountType,
          discountValue,
          taxPPN,
          inCart: true,
          note
        };
        state.activeItems.unshift(newItem);
        showToast(`"${name}" ditambahkan ke troli!`, 'success');
        if (window.soundCtrl) window.soundCtrl.playSuccess();
      }
      updateStoreProductPrice(name, unitPrice, state.storeLocation);
    }

    state.activeItems = groupActiveItems(state.activeItems);
    saveAndRefresh();
    closeItemModal();
    if (window.soundCtrl) window.soundCtrl.playPop();
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
    el.budgetLimitInput.value = formatNumberDots(state.budgetLimit);
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
    const val = parseCurrencyInput(el.budgetLimitInput.value);
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
      if (el.profileLocation) {
        el.profileLocation.innerHTML = `<i data-lucide="map-pin" style="width: 12px; height: 12px; color: var(--primary); flex-shrink: 0;"></i><span>Kost di ${escapeHtml(user.city || 'Yogyakarta')}</span>`;
        if (window.lucide) window.lucide.createIcons({ root: el.profileLocation });
      }
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
          }
          if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
            window.SmartData.FirestoreRealtimeSync.setSessionUser(u.id);
          }
          state.activeItems = window.SmartData.SmartStorage.getActiveItems();
          state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
          updateBudgetSafetyMeter();
          renderAnggaranScreen();
          renderGroceryList();
          renderShopeeCatalog();
          renderHistoryScreen();
          syncCartBadges();
          pushToFirestore();
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
        state.budgetLimit = Number(res.user.budget);
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
      }
      const isRemember = el.rememberMeCheckbox ? el.rememberMeCheckbox.checked : true;
      localStorage.setItem('sg_remember_me', isRemember ? 'true' : 'false');
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user.id);
      }
      state.activeItems = window.SmartData.SmartStorage.getActiveItems();
      state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
      updateBudgetSafetyMeter();
      renderAnggaranScreen();
      renderGroceryList();
      renderShopeeCatalog();
      renderHistoryScreen();
      renderUserProfile();
      syncCartBadges();
      pushToFirestore();
      showToast(`Selamat datang kembali, ${res.user.name}! 👋`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewKatalog');
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
    const budget = parseCurrencyInput(el.regBudget.value) || 400000;

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
      state.activeItems = []; // Bersih untuk akun baru
      state.historyTrips = []; // Bersih untuk akun baru
      window.SmartData.SmartStorage.saveBudgetLimit(budget);
      window.SmartData.SmartStorage.saveActiveItems([]);
      window.SmartData.SmartStorage.saveHistoryTrips([]);
      localStorage.setItem('sg_remember_me', 'true');
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user.id);
      }
      renderUserProfile();
      updateBudgetSafetyMeter();
      renderGroceryList();
      renderShopeeCatalog();
      renderHistoryScreen();
      renderAnggaranScreen();
      syncCartBadges();
      pushToFirestore();
      showToast(`Akun berhasil dibuat! Halo ${res.user.name} 🎉`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewKatalog');
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
        state.budgetLimit = Number(res.user.budget);
        window.SmartData.SmartStorage.saveBudgetLimit(res.user.budget);
      }
      if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
        window.SmartData.FirestoreRealtimeSync.setSessionUser(res.user.id);
      }
      state.activeItems = window.SmartData.SmartStorage.getActiveItems();
      state.historyTrips = window.SmartData.SmartStorage.getHistoryTrips();
      updateBudgetSafetyMeter();
      renderAnggaranScreen();
      renderGroceryList();
      renderShopeeCatalog();
      renderHistoryScreen();
      renderUserProfile();
      syncCartBadges();
      pushToFirestore();
      showToast(`Masuk sebagai ${res.user.name}!`, 'success');
      if (window.soundCtrl) window.soundCtrl.playSuccess();
      switchTab('viewKatalog');
    } else {
      showToast(res.message, 'danger');
    }
  }

  function handleLogout() {
    window.SmartData.SmartStorage.logoutUser();
    state.currentUser = null;
    localStorage.removeItem('sg_remember_me');
    if (window.SmartData && window.SmartData.FirestoreRealtimeSync) {
      window.SmartData.FirestoreRealtimeSync.setSessionUser(null);
    }
    showAuthGate(false);
    renderUserProfile();
    showToast('Kamu telah keluar dari akun.', 'info');
    if (window.soundCtrl) window.soundCtrl.playTick();
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

    // Install Prompt Listener (Prompt di layar utama dinonaktifkan sesuai permintaan)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      if (el.pwaBanner) el.pwaBanner.style.display = 'none';
    });

    if (el.pwaInstallBtn) {
      el.pwaInstallBtn.addEventListener('click', async () => {
        if (state.deferredPrompt) {
          state.deferredPrompt.prompt();
          const { outcome } = await state.deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            showToast('Terima kasih telah memasang Smart Grocery!', 'success');
          }
          state.deferredPrompt = null;
        }
        if (el.pwaBanner) el.pwaBanner.style.display = 'none';
      });
    }
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
    if (el.gateGoogleLoginBtn) {
      el.gateGoogleLoginBtn.addEventListener('click', handleGoogleSignIn);
    }
    if (el.gateGoogleRegBtn) {
      el.gateGoogleRegBtn.addEventListener('click', handleGoogleSignIn);
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

    // Modal Pemilihan Lokasi Toko Belanja (Persis Screenshot 2 & Header Top Bar)
    if (el.headerStoreLocationBtn) {
      el.headerStoreLocationBtn.addEventListener('click', openStoreLocationModal);
    }
    if (el.openLocationModalBtn) {
      el.openLocationModalBtn.addEventListener('click', openStoreLocationModal);
    }
    if (el.closeStoreLocationModalBtn) {
      el.closeStoreLocationModalBtn.addEventListener('click', closeStoreLocationModal);
    }
    if (el.storeLocationModal) {
      el.storeLocationModal.addEventListener('click', (e) => {
        if (e.target === el.storeLocationModal) {
          closeStoreLocationModal();
        }
      });
    }
    if (el.detectGpsStoreBtn) {
      el.detectGpsStoreBtn.addEventListener('click', handleDetectGpsStore);
    }
    if (el.submitNewStoreBtn) {
      el.submitNewStoreBtn.addEventListener('click', handleAddNewStoreSubmit);
    }
    if (el.inputNewStoreName) {
      el.inputNewStoreName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddNewStoreSubmit();
        }
      });
    }

    // Modal 7: Google Account Chooser Listeners
    if (el.closeGoogleModalBtn) {
      el.closeGoogleModalBtn.addEventListener('click', closeGoogleAccountModal);
    }
    if (el.googleAccountModal) {
      el.googleAccountModal.addEventListener('click', (e) => {
        if (e.target === el.googleAccountModal) {
          closeGoogleAccountModal();
        }
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
        showAuthGate(true);
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
        showAuthGate(true);
      });
    }
    if (el.menuSwitchAccountBtn) {
      el.menuSwitchAccountBtn.addEventListener('click', () => {
        showAuthGate(true);
      });
    }
    if (el.menuThemeToggleBtn) {
      el.menuThemeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (el.gateThemeToggleBtn) {
      el.gateThemeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (el.menuSoundToggleBtn) {
      el.menuSoundToggleBtn.addEventListener('click', () => el.soundToggleBtn.click());
    }

    // Add to Etalase triggers
    if (el.openAddEtalaseModalBtnTop) {
      el.openAddEtalaseModalBtnTop.addEventListener('click', openAddEtalaseModal);
    }
    if (el.openAddEtalaseModalBtn) {
      el.openAddEtalaseModalBtn.addEventListener('click', openAddEtalaseModal);
    }
    if (el.closeAddEtalaseModalBtn) {
      el.closeAddEtalaseModalBtn.addEventListener('click', closeAddEtalaseModal);
    }
    if (el.cancelAddEtalaseBtn) {
      el.cancelAddEtalaseBtn.addEventListener('click', closeAddEtalaseModal);
    }
    if (el.saveAddEtalaseBtn) {
      el.saveAddEtalaseBtn.addEventListener('click', saveAddEtalase);
    }
    if (el.addEtalaseModal) {
      el.addEtalaseModal.addEventListener('click', (e) => {
        if (e.target === el.addEtalaseModal) {
          closeAddEtalaseModal();
        }
      });
    }

    // Etalase Unit Selector Chips
    if (el.etalaseUnitChips) {
      const uChips = el.etalaseUnitChips.querySelectorAll('.unit-chip');
      uChips.forEach(chip => {
        chip.addEventListener('click', () => {
          uChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (el.etalaseUnit) el.etalaseUnit.value = chip.getAttribute('data-unit') || 'pcs';
        });
      });
    }

    // Etalase Emoji Selector Chips
    if (el.quickEmojiChips) {
      const eChips = el.quickEmojiChips.querySelectorAll('.emoji-pick-btn');
      eChips.forEach(chip => {
        chip.addEventListener('click', () => {
          eChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const em = chip.getAttribute('data-emoji') || '🛍️';
          if (el.etalaseEmoji) el.etalaseEmoji.value = em;
        });
      });
    }

    if (el.etalaseEmoji) {
      el.etalaseEmoji.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (el.quickEmojiChips) {
          const eChips = el.quickEmojiChips.querySelectorAll('.emoji-pick-btn');
          eChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-emoji') === val));
        }
      });
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

    // Form submit listener
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
      itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveItemFromModal();
      });
    }

    // Enter key shortcuts across all inputs to quickly save item
    [el.inputItemName, el.inputUnitPrice, el.inputQty, el.inputDiscountFormula, el.inputItemNote].forEach(inp => {
      if (inp) {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            saveItemFromModal();
          }
        });
      }
    });

    // Unit selector chips in Modal (Persis Screenshot 2)
    if (el.unitSelectorChips) {
      el.unitSelectorChips.querySelectorAll('.unit-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const unit = btn.dataset.unit || 'pcs';
          setModalUnit(unit);
          if (window.soundCtrl) window.soundCtrl.playTick();
        });
      });
    }

    // Discount Preset Chips in Modal (Persis Screenshot 2)
    if (el.discountPresetChips) {
      el.discountPresetChips.querySelectorAll('.dis-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const formula = btn.dataset.formula || btn.textContent.trim();
          applyDiscountPreset(formula);
          if (window.soundCtrl) window.soundCtrl.playPop();
        });
      });
    }

    // Realtime modal calculations on input changes (Persis Screenshot 2)
    if (el.inputQty) {
      ['input', 'change'].forEach(evt => el.inputQty.addEventListener(evt, updateModalCalculations));
    }
    if (el.inputUnitPrice) {
      ['input', 'change', 'keyup'].forEach(evt => {
        el.inputUnitPrice.addEventListener(evt, () => {
          updateModalCalculations();
          checkModalPriceComparison();
        });
      });
    }
    if (el.inputDiscountFormula) {
      ['input', 'change'].forEach(evt => el.inputDiscountFormula.addEventListener(evt, updateModalCalculations));
    }
    if (el.inputTaxPPN) {
      el.inputTaxPPN.addEventListener('change', updateModalCalculations);
    }
    if (el.inputItemName) {
      ['input', 'change', 'keyup'].forEach(evt => {
        el.inputItemName.addEventListener(evt, () => {
          checkModalPriceComparison();
        });
      });
    }

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
        el.budgetLimitInput.value = formatNumberDots(btn.dataset.preset);
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
  window.openEditItemModal = openEditItemModal;
  window.openEditEtalaseProductModal = openEditEtalaseProductModal;
  window.saveEtalaseOverride = saveEtalaseOverride;
  window.saveItemFromModal = saveItemFromModal;
  window.closeItemModal = closeItemModal;
  window.setModalUnit = setModalUnit;
  window.applyDiscountPreset = applyDiscountPreset;
  window.showAuthGate = showAuthGate;
  window.hideAuthGate = hideAuthGate;
  window.gateQuickLogin = gateQuickLogin;
  window.switchGateTab = switchGateTab;
  window.switchAuthTab = switchAuthTab;
  window.toggleTheme = toggleTheme;
  window.openAddEtalaseModal = openAddEtalaseModal;
  window.closeAddEtalaseModal = closeAddEtalaseModal;
  window.saveAddEtalase = saveAddEtalase;
  window.handleFloatingBudgetClick = handleFloatingBudgetClick;
  window.checkBudgetThresholdAndWarn = checkBudgetThresholdAndWarn;
  window.closeOverbudgetWarningPopup = closeOverbudgetWarningPopup;
  window.formatCategory = formatCategory;
  window.formatRp = formatRp;
  window.formatNumberDots = formatNumberDots;
  window.parseCurrencyInput = parseCurrencyInput;
  window.renderShopeeCatalog = renderShopeeCatalog;
  window.handleGoogleSignIn = handleGoogleSignIn;
  window.confirmGoogleAccount = confirmGoogleAccount;
  window.submitCustomGoogleAccount = submitCustomGoogleAccount;
  window.openGoogleAccountModal = openGoogleAccountModal;
  window.closeGoogleAccountModal = closeGoogleAccountModal;
  window.openStoreLocationModal = openStoreLocationModal;
  window.closeStoreLocationModal = closeStoreLocationModal;
  window.setStoreLocation = setStoreLocation;

  // Start app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
