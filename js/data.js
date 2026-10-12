// Data structures, Initial Benchmark Catalog, and Storage Manager

const CATEGORIES = [
  { id: 'all', name: 'Semua', icon: 'sparkles' },
  { id: 'bahan_pokok', name: 'Bahan Pokok', icon: 'wheat', color: '#E05A7E' },
  { id: 'mandi_cuci', name: 'Mandi & Cuci', icon: 'sparkle', color: '#D84A75' },
  { id: 'camilan_minum', name: 'Camilan & Minum', icon: 'cup-soda', color: '#FA5252' },
  { id: 'bumbu_dapur', name: 'Bumbu Dapur', icon: 'flame', color: '#E64980' },
  { id: 'kebutuhan_kos', name: 'Kebutuhan Kos', icon: 'home', color: '#BE4BDB' },
  { id: 'kesehatan', name: 'Kesehatan', icon: 'heart-pulse', color: '#20C997' }
];

const UNITS = [
  'pcs', 'kg', 'pack', 'liter', 'botol', 'sachet', 'box', 'roll', 'renceng', 'ikat', 'kaleng'
];

// Pre-seeded Benchmark Prices from previous months (Anak Rantau Standard Supermarket)
const INITIAL_BENCHMARK_PRICES = {
  'beras ramos 5kg': { lastPrice: 74500, previousMonth: 'September 2026', unit: 'pack', category: 'bahan_pokok' },
  'telur ayam negeri 1kg': { lastPrice: 29000, previousMonth: 'September 2026', unit: 'kg', category: 'bahan_pokok' },
  'indomie goreng': { lastPrice: 3100, previousMonth: 'September 2026', unit: 'pcs', category: 'bahan_pokok' },
  'minyak goreng 2l': { lastPrice: 34500, previousMonth: 'September 2026', unit: 'botol', category: 'bahan_pokok' },
  'sabun cuci piring 750ml': { lastPrice: 13500, previousMonth: 'September 2026', unit: 'pack', category: 'mandi_cuci' },
  'sabun mandi cair refil 450ml': { lastPrice: 22000, previousMonth: 'September 2026', unit: 'pack', category: 'mandi_cuci' },
  'shampoo 170ml': { lastPrice: 24500, previousMonth: 'September 2026', unit: 'botol', category: 'mandi_cuci' },
  'pasta gigi 190g': { lastPrice: 15000, previousMonth: 'September 2026', unit: 'pcs', category: 'mandi_cuci' },
  'deterjen bubuk 800g': { lastPrice: 19500, previousMonth: 'September 2026', unit: 'pack', category: 'mandi_cuci' },
  'susu uht 1 liter': { lastPrice: 19800, previousMonth: 'September 2026', unit: 'box', category: 'camilan_minum' },
  'kopi sachet isi 10': { lastPrice: 14000, previousMonth: 'September 2026', unit: 'pack', category: 'camilan_minum' },
  'teh celup kotak': { lastPrice: 6500, previousMonth: 'September 2026', unit: 'box', category: 'camilan_minum' },
  'bawang merah 250g': { lastPrice: 11000, previousMonth: 'September 2026', unit: 'pack', category: 'bumbu_dapur' },
  'kecap manis 520ml': { lastPrice: 18500, previousMonth: 'September 2026', unit: 'botol', category: 'bumbu_dapur' },
  'tisu gulung 4 roll': { lastPrice: 16000, previousMonth: 'September 2026', unit: 'pack', category: 'kebutuhan_kos' }
};

// Initial active grocery list demonstrating features:
// - normal items
// - regular discount item
// - stacked discount item (Diskon 10% + Promo Member 5%)
// - price dropped item (cheaper than benchmark)
// - price increased item (more expensive than benchmark)
const INITIAL_ACTIVE_ITEMS = [
  {
    id: 'item-1',
    name: 'Beras Ramos 5kg',
    category: 'bahan_pokok',
    unit: 'pack',
    qty: 1,
    unitPrice: 72000, // Benchmark 74.500 -> Cheaper by 2.500!
    discountType: 'none',
    discountValue: 0,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: true,
    note: 'Promo toko akhir pekan'
  },
  {
    id: 'item-2',
    name: 'Telur Ayam Negeri 1kg',
    category: 'bahan_pokok',
    unit: 'kg',
    qty: 1,
    unitPrice: 30500, // Benchmark 29.000 -> More expensive by 1.500
    discountType: 'none',
    discountValue: 0,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: true,
    note: 'Cari yang cangkang mulus'
  },
  {
    id: 'item-3',
    name: 'Indomie Goreng',
    category: 'bahan_pokok',
    unit: 'pcs',
    qty: 10,
    unitPrice: 3100, // Benchmark 3.100 -> Stabil
    discountType: 'percent', // 10% discount
    discountValue: 10,
    stackedDiscount: { enabled: true, type: 'percent', value: 5 }, // Stacked 5% Member card!
    inCart: false,
    note: 'Stok darurat akhir bulan'
  },
  {
    id: 'item-4',
    name: 'Sabun Mandi Cair Refil 450ml',
    category: 'mandi_cuci',
    unit: 'pack',
    qty: 1,
    unitPrice: 22000,
    discountType: 'amount', // Potongan langsung Rp 3.000
    discountValue: 3000,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: true,
    note: 'Varian Sakura'
  },
  {
    id: 'item-5',
    name: 'Susu UHT 1 Liter',
    category: 'camilan_minum',
    unit: 'box',
    qty: 2,
    unitPrice: 19800,
    discountType: 'none',
    discountValue: 0,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: false,
    note: 'Full Cream'
  }
];

// Initial historical trips
const INITIAL_HISTORY_TRIPS = [
  {
    id: 'trip-sep-2026',
    date: '2026-09-15',
    title: 'Belanja Tengah Bulan September',
    totalSpent: 382400,
    totalBudget: 450000,
    totalSaved: 36200,
    itemsCount: 14,
    items: [
      { name: 'Beras Ramos 5kg', qty: 1, unit: 'pack', finalPrice: 74500, category: 'bahan_pokok' },
      { name: 'Minyak Goreng 2L', qty: 1, unit: 'botol', finalPrice: 34500, category: 'bahan_pokok' },
      { name: 'Telur Ayam Negeri 1kg', qty: 1, unit: 'kg', finalPrice: 29000, category: 'bahan_pokok' },
      { name: 'Deterjen Bubuk 800g', qty: 1, unit: 'pack', finalPrice: 19500, category: 'mandi_cuci' },
      { name: 'Sabun Cuci Piring 750ml', qty: 1, unit: 'pack', finalPrice: 13500, category: 'mandi_cuci' },
      { name: 'Kopi Sachet isi 10', qty: 2, unit: 'pack', finalPrice: 28000, category: 'camilan_minum' },
      { name: 'Indomie Goreng', qty: 15, unit: 'pcs', finalPrice: 46500, category: 'bahan_pokok' }
    ]
  },
  {
    id: 'trip-aug-2026',
    date: '2026-08-18',
    title: 'Belanja Awal Semester Kost',
    totalSpent: 429000,
    totalBudget: 450000,
    totalSaved: 41500,
    itemsCount: 18,
    items: [
      { name: 'Beras Ramos 5kg', qty: 1, unit: 'pack', finalPrice: 75000, category: 'bahan_pokok' },
      { name: 'Peralatan Mandi Lengkap', qty: 1, unit: 'pack', finalPrice: 65000, category: 'mandi_cuci' },
      { name: 'Tisu Gulung 4 roll', qty: 2, unit: 'pack', finalPrice: 32000, category: 'kebutuhan_kos' },
      { name: 'Minyak Goreng 2L', qty: 1, unit: 'botol', finalPrice: 35000, category: 'bahan_pokok' }
    ]
  }
];

// Autocomplete suggestion catalog for Anak Rantau
const GROCERY_SUGGESTIONS = [
  { name: 'Beras Ramos 5kg', category: 'bahan_pokok', unit: 'pack', defaultPrice: 73000 },
  { name: 'Telur Ayam Negeri 1kg', category: 'bahan_pokok', unit: 'kg', defaultPrice: 29500 },
  { name: 'Indomie Goreng', category: 'bahan_pokok', unit: 'pcs', defaultPrice: 3100 },
  { name: 'Indomie Ayam Bawang', category: 'bahan_pokok', unit: 'pcs', defaultPrice: 3100 },
  { name: 'Minyak Goreng 2L', category: 'bahan_pokok', unit: 'botol', defaultPrice: 34000 },
  { name: 'Minyak Goreng 1L', category: 'bahan_pokok', unit: 'botol', defaultPrice: 17500 },
  { name: 'Susu UHT 1 Liter', category: 'camilan_minum', unit: 'box', defaultPrice: 19800 },
  { name: 'Susu Kental Manis Kaleng', category: 'bahan_pokok', unit: 'kaleng', defaultPrice: 12500 },
  { name: 'Sabun Mandi Cair Refil 450ml', category: 'mandi_cuci', unit: 'pack', defaultPrice: 21500 },
  { name: 'Sabun Cuci Piring 750ml', category: 'mandi_cuci', unit: 'pack', defaultPrice: 13500 },
  { name: 'Shampoo 170ml', category: 'mandi_cuci', unit: 'botol', defaultPrice: 24500 },
  { name: 'Pasta Gigi 190g', category: 'mandi_cuci', unit: 'pcs', defaultPrice: 15000 },
  { name: 'Deterjen Bubuk 800g', category: 'mandi_cuci', unit: 'pack', defaultPrice: 19500 },
  { name: 'Pewangi Pakaian Sachet', category: 'mandi_cuci', unit: 'renceng', defaultPrice: 6000 },
  { name: 'Kopi Sachet isi 10', category: 'camilan_minum', unit: 'pack', defaultPrice: 14000 },
  { name: 'Teh Celup Kotak', category: 'camilan_minum', unit: 'box', defaultPrice: 6500 },
  { name: 'Roti Tawar Gandum', category: 'camilan_minum', unit: 'pack', defaultPrice: 16500 },
  { name: 'Biskuit Roma Kelapa', category: 'camilan_minum', unit: 'pack', defaultPrice: 9500 },
  { name: 'Sarden Kaleng 155g', category: 'bahan_pokok', unit: 'kaleng', defaultPrice: 11000 },
  { name: 'Kornet Sapi 198g', category: 'bahan_pokok', unit: 'kaleng', defaultPrice: 22000 },
  { name: 'Nugget Ayam 500g', category: 'bahan_pokok', unit: 'pack', defaultPrice: 38000 },
  { name: 'Bawang Merah 250g', category: 'bumbu_dapur', unit: 'pack', defaultPrice: 11000 },
  { name: 'Bawang Putih 250g', category: 'bumbu_dapur', unit: 'pack', defaultPrice: 12000 },
  { name: 'Kecap Manis 520ml', category: 'bumbu_dapur', unit: 'botol', defaultPrice: 18500 },
  { name: 'Saus Sambal 335ml', category: 'bumbu_dapur', unit: 'botol', defaultPrice: 14500 },
  { name: 'Garam Dapur 250g', category: 'bumbu_dapur', unit: 'pack', defaultPrice: 3500 },
  { name: 'Gula Pasir 1kg', category: 'bahan_pokok', unit: 'pack', defaultPrice: 17500 },
  { name: 'Tisu Gulung 4 roll', category: 'kebutuhan_kos', unit: 'pack', defaultPrice: 16000 },
  { name: 'Tisu Wajah 250 sheet', category: 'kebutuhan_kos', unit: 'pack', defaultPrice: 13000 },
  { name: 'Pembersih Lantai 800ml', category: 'kebutuhan_kos', unit: 'pack', defaultPrice: 11500 },
  { name: 'Kamper Kamar Mandi', category: 'kebutuhan_kos', unit: 'pack', defaultPrice: 14000 },
  { name: 'Minyak Kayu Putih 60ml', category: 'kesehatan', unit: 'botol', defaultPrice: 23000 },
  { name: 'Plester Luka isi 10', category: 'kesehatan', unit: 'box', defaultPrice: 7500 },
  { name: 'Tolak Angin Sachet isi 5', category: 'kesehatan', unit: 'box', defaultPrice: 18500 }
];

class SmartStorage {
  static get(key, defaultValue) {
    try {
      const data = localStorage.getItem('sg_' + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage read error', e);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem('sg_' + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Active Grocery Cart Items
  static getActiveItems() {
    return this.get('active_items', INITIAL_ACTIVE_ITEMS);
  }

  static saveActiveItems(items) {
    this.set('active_items', items);
  }

  // Budget Limit
  static getBudgetLimit() {
    return this.get('budget_limit', 450000); // Default Rp 450.000
  }

  static saveBudgetLimit(amount) {
    this.set('budget_limit', Number(amount) || 450000);
  }

  // Historical Shopping Trips
  static getHistoryTrips() {
    return this.get('history_trips', INITIAL_HISTORY_TRIPS);
  }

  static saveHistoryTrips(trips) {
    this.set('history_trips', trips);
  }

  // Price Benchmark Catalog
  static getBenchmarks() {
    return this.get('benchmark_prices', INITIAL_BENCHMARK_PRICES);
  }

  static updateBenchmark(itemName, price, unit, category) {
    const benchmarks = this.getBenchmarks();
    const key = itemName.trim().toLowerCase();
    const now = new Date();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentMonthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    benchmarks[key] = {
      lastPrice: Number(price),
      previousMonth: currentMonthLabel,
      unit: unit || 'pcs',
      category: category || 'bahan_pokok',
      updatedAt: now.toISOString()
    };

    this.set('benchmark_prices', benchmarks);
  }

  // Reset to initial demo data
  static resetToDemo() {
    localStorage.removeItem('sg_active_items');
    localStorage.removeItem('sg_budget_limit');
    localStorage.removeItem('sg_history_trips');
    localStorage.removeItem('sg_benchmark_prices');
  }
}

window.SmartData = {
  CATEGORIES,
  UNITS,
  GROCERY_SUGGESTIONS,
  SmartStorage
};
