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
    productId: 'sp-1',
    name: 'Beras Ramos Super 5kg',
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
    productId: 'sp-2',
    name: 'Telur Ayam Negeri 1kg',
    category: 'bahan_pokok',
    unit: 'kg',
    qty: 1,
    unitPrice: 29500,
    discountType: 'none',
    discountValue: 0,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: true,
    note: 'Cari yang cangkang mulus'
  },
  {
    id: 'item-3',
    productId: 'sp-3',
    name: 'Indomie Goreng Original 85g',
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
    productId: 'sp-10',
    name: 'Sabun Mandi Biore Guard 450ml',
    category: 'mandi_cuci',
    unit: 'pack',
    qty: 1,
    unitPrice: 21500,
    discountType: 'amount', // Potongan langsung Rp 3.000
    discountValue: 3000,
    stackedDiscount: { enabled: false, type: 'percent', value: 0 },
    inCart: true,
    note: 'Varian Sakura'
  },
  {
    id: 'item-5',
    productId: 'sp-16',
    name: 'Ultra Milk Susu UHT Full Cream 1L',
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

  // Store Location
  static getStoreLocation() {
    return this.get('store_location', 'Superindo Kaliurang');
  }

  static saveStoreLocation(loc) {
    this.set('store_location', loc || 'Superindo Kaliurang');
  }

  // Shopping Date
  static getShoppingDate() {
    const today = new Date().toISOString().split('T')[0];
    return this.get('shopping_date', today);
  }

  static saveShoppingDate(date) {
    this.set('shopping_date', date);
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

  // User Authentication & Profile Data
  static getUsers() {
    return this.get('users_list', DEFAULT_USERS);
  }

  static saveUsers(users) {
    this.set('users_list', users);
  }

  static getCurrentUser() {
    return this.get('current_user', null);
  }

  static setCurrentUser(user) {
    this.set('current_user', user);
  }

  static logoutUser() {
    localStorage.removeItem('sg_current_user');
  }

  static loginUser(email, password) {
    const users = this.getUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const found = users.find(u => 
      (u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail) && 
      u.password === cleanPass
    );

    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Email atau password salah. Coba akun demo atau cek kembali.' };
  }

  static registerUser(userData) {
    const users = this.getUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    if (!userData.name || !userData.email || !userData.password) {
      return { success: false, message: 'Nama, email, dan password wajib diisi!' };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email sudah terdaftar! Silakan login.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'Mahasiswa Rantau',
      city: userData.city || 'Yogyakarta',
      budget: Number(userData.budget) || 450000,
      avatar: userData.avatar || '🎒',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  // Reset to initial demo data
  static resetToDemo() {
    localStorage.removeItem('sg_active_items');
    localStorage.removeItem('sg_budget_limit');
    localStorage.removeItem('sg_history_trips');
    localStorage.removeItem('sg_benchmark_prices');
    localStorage.removeItem('sg_current_user');
    localStorage.removeItem('sg_users_list');
  }
}

const DEFAULT_USERS = [
  {
    id: 'user-budi',
    name: 'Budi Santoso',
    email: 'budi@rantau.id',
    password: '123',
    role: 'Mahasiswa Rantau',
    city: 'Yogyakarta',
    budget: 450000,
    avatar: '👨‍🎓'
  },
  {
    id: 'user-siti',
    name: 'Siti Rahma',
    email: 'siti@rantau.id',
    password: '123',
    role: 'Anak Kos Hemat',
    city: 'Bandung',
    budget: 400000,
    avatar: '👩‍💻'
  }
];

// Pre-seeded Catalog of Shopee-style Product Store for Anak Rantau
const SHOPEE_PRODUCTS = [
  {
    id: 'sp-1',
    name: 'Beras Ramos Super 5kg',
    category: 'bahan_pokok',
    unit: 'pack',
    price: 72000,
    originalPrice: 76000,
    discountPercent: 5,
    rating: 4.9,
    soldCount: '1.8rb',
    emoji: '🍚',
    badge: 'Shopee Garansi',
    description: 'Beras pulen berkualitas, alami tanpa pemutih & pengawet.'
  },
  {
    id: 'sp-2',
    name: 'Telur Ayam Negeri 1kg',
    category: 'bahan_pokok',
    unit: 'kg',
    price: 29500,
    originalPrice: 32000,
    discountPercent: 8,
    rating: 4.8,
    soldCount: '920',
    emoji: '🥚',
    badge: 'Termurah',
    description: 'Telur segar pilihan dari peternakan lokal terpercaya.'
  },
  {
    id: 'sp-3',
    name: 'Indomie Goreng Original 85g',
    category: 'bahan_pokok',
    unit: 'pcs',
    price: 3100,
    originalPrice: 3500,
    discountPercent: 11,
    rating: 5.0,
    soldCount: '5.4rb',
    emoji: '🍜',
    badge: 'Star+',
    description: 'Mie instan favorit sejuta anak kos, rasa legendaris.'
  },
  {
    id: 'sp-4',
    name: 'Indomie Kuah Ayam Bawang 69g',
    category: 'bahan_pokok',
    unit: 'pcs',
    price: 3100,
    originalPrice: 3500,
    discountPercent: 11,
    rating: 4.9,
    soldCount: '3.1rb',
    emoji: '🍲',
    badge: 'Star+',
    description: 'Kuah gurih lezat cocok untuk santapan malam anak kos.'
  },
  {
    id: 'sp-5',
    name: 'Minyak Goreng Bimoli 2 Liter',
    category: 'bahan_pokok',
    unit: 'botol',
    price: 34000,
    originalPrice: 38500,
    discountPercent: 12,
    rating: 4.9,
    soldCount: '2.6rb',
    emoji: '🍳',
    badge: 'Flash Sale',
    description: 'Minyak kelapa sawit murni jernih dengan Omega 9.'
  },
  {
    id: 'sp-6',
    name: 'Gula Pasir Gulaku Premium 1kg',
    category: 'bahan_pokok',
    unit: 'pack',
    price: 17500,
    originalPrice: 19000,
    discountPercent: 8,
    rating: 4.8,
    soldCount: '890',
    emoji: '🧂',
    badge: 'Shopee Mall',
    description: 'Gula tebu murni butiran putih higienis.'
  },
  {
    id: 'sp-7',
    name: 'Sarden ABC Saus Tomat 155g',
    category: 'bahan_pokok',
    unit: 'kaleng',
    price: 11000,
    originalPrice: 12500,
    discountPercent: 12,
    rating: 4.7,
    soldCount: '620',
    emoji: '🥫',
    badge: 'Hemat Kos',
    description: 'Ikan sarden lezat kaya protein & saus tomat gurih.'
  },
  {
    id: 'sp-8',
    name: 'Kornet Sapi Pronas 198g',
    category: 'bahan_pokok',
    unit: 'kaleng',
    price: 22000,
    originalPrice: 24500,
    discountPercent: 10,
    rating: 4.8,
    soldCount: '440',
    emoji: '🥩',
    badge: 'Shopee Garansi',
    description: 'Kornet daging sapi olahan lezat untuk oseng & nasi goreng.'
  },
  {
    id: 'sp-9',
    name: 'Fiesta Crispy Nugget 500g',
    category: 'bahan_pokok',
    unit: 'pack',
    price: 38000,
    originalPrice: 43000,
    discountPercent: 12,
    rating: 4.9,
    soldCount: '1.2rb',
    emoji: '🍗',
    badge: 'Star+',
    description: 'Nugget ayam renyah praktis tinggal goreng saat lapar.'
  },
  {
    id: 'sp-10',
    name: 'Sabun Mandi Biore Guard 450ml',
    category: 'mandi_cuci',
    unit: 'pack',
    price: 21500,
    originalPrice: 26000,
    discountPercent: 17,
    rating: 4.9,
    soldCount: '2.1rb',
    emoji: '🧼',
    badge: 'Diskon 17%',
    description: 'Sabun cair antibakterial wangi segar tahan seharian.'
  },
  {
    id: 'sp-11',
    name: 'Sunlight Jeruk Nipis 750ml',
    category: 'mandi_cuci',
    unit: 'pack',
    price: 13500,
    originalPrice: 15500,
    discountPercent: 13,
    rating: 4.9,
    soldCount: '4.8rb',
    emoji: '🍋',
    badge: 'Paling Laris',
    description: 'Hilangkan lemak membandel 10x lebih cepat & irit.'
  },
  {
    id: 'sp-12',
    name: 'Shampoo Pantene Anti Ketombe 170ml',
    category: 'mandi_cuci',
    unit: 'botol',
    price: 24500,
    originalPrice: 28000,
    discountPercent: 13,
    rating: 4.8,
    soldCount: '1.4rb',
    emoji: '🧴',
    badge: 'Shopee Mall',
    description: 'Rambut segar bersih bebas ketombe untuk aktivitas padat.'
  },
  {
    id: 'sp-13',
    name: 'Pasta Gigi Pepsodent Fresh 190g',
    category: 'mandi_cuci',
    unit: 'pcs',
    price: 15000,
    originalPrice: 17000,
    discountPercent: 12,
    rating: 4.9,
    soldCount: '3.6rb',
    emoji: '🪥',
    badge: 'Shopee Garansi',
    description: 'Perlindungan gigi berlubang maksimal dengan fluoride.'
  },
  {
    id: 'sp-14',
    name: 'Deterjen Daia Putih 800g',
    category: 'mandi_cuci',
    unit: 'pack',
    price: 19500,
    originalPrice: 22500,
    discountPercent: 13,
    rating: 4.8,
    soldCount: '1.9rb',
    emoji: '🧺',
    badge: 'Hemat Kos',
    description: 'Busa melimpah cucian bersih cemerlang wangi tahan lama.'
  },
  {
    id: 'sp-15',
    name: 'Molto Pewangi Pink Renceng (6s)',
    category: 'mandi_cuci',
    unit: 'renceng',
    price: 6000,
    originalPrice: 7500,
    discountPercent: 20,
    rating: 4.8,
    soldCount: '1.1rb',
    emoji: '🌸',
    badge: 'Diskon 20%',
    description: 'Pewangi & pelembut pakaian konsentrat aroma floral.'
  },
  {
    id: 'sp-16',
    name: 'Ultra Milk Susu UHT Full Cream 1L',
    category: 'camilan_minum',
    unit: 'box',
    price: 19800,
    originalPrice: 22000,
    discountPercent: 10,
    rating: 5.0,
    soldCount: '4.2rb',
    emoji: '🥛',
    badge: 'Star+',
    description: 'Susu cair segar sumber kalsium & fosfor untuk energi belajar.'
  },
  {
    id: 'sp-17',
    name: 'Kopi Kapal Api Special Mix 10s',
    category: 'camilan_minum',
    unit: 'pack',
    price: 14000,
    originalPrice: 16000,
    discountPercent: 13,
    rating: 4.9,
    soldCount: '3.8rb',
    emoji: '☕',
    badge: 'Paling Laris',
    description: 'Kopi mantap racikan legendaris peneman lembur tugas kuliah.'
  },
  {
    id: 'sp-18',
    name: 'SariWangi Teh Celup Asli 25s',
    category: 'camilan_minum',
    unit: 'box',
    price: 6500,
    originalPrice: 8000,
    discountPercent: 19,
    rating: 4.8,
    soldCount: '2.5rb',
    emoji: '🍵',
    badge: 'Termurah',
    description: 'Teh hitam alami harum semerbak untuk relaksasi di kos.'
  },
  {
    id: 'sp-19',
    name: 'Sari Roti Roti Tawar Spesial',
    category: 'camilan_minum',
    unit: 'pack',
    price: 16500,
    originalPrice: 18000,
    discountPercent: 8,
    rating: 4.8,
    soldCount: '950',
    emoji: '🍞',
    badge: 'Shopee Garansi',
    description: 'Roti tawar empuk higienis, sarapan kilat anak rantau.'
  },
  {
    id: 'sp-20',
    name: 'Biskuit Roma Kelapa 300g',
    category: 'camilan_minum',
    unit: 'pack',
    price: 9500,
    originalPrice: 11500,
    discountPercent: 17,
    rating: 4.9,
    soldCount: '1.7rb',
    emoji: '🍪',
    badge: 'Flash Sale',
    description: 'Biskuit renyah kelapa asli lezat dicelup teh atau kopi.'
  },
  {
    id: 'sp-21',
    name: 'Bawang Merah Brebes Pilihan 250g',
    category: 'bumbu_dapur',
    unit: 'pack',
    price: 11000,
    originalPrice: 13000,
    discountPercent: 15,
    rating: 4.7,
    soldCount: '780',
    emoji: '🧅',
    badge: 'Pasar Segar',
    description: 'Bawang merah wangi aromatik bumbu dasar masakan sedap.'
  },
  {
    id: 'sp-22',
    name: 'Bawang Putih Kating 250g',
    category: 'bumbu_dapur',
    unit: 'pack',
    price: 12000,
    originalPrice: 14000,
    discountPercent: 14,
    rating: 4.7,
    soldCount: '690',
    emoji: '🧄',
    badge: 'Pasar Segar',
    description: 'Bawang putih kating siung bulat rasa tajam aromatik.'
  },
  {
    id: 'sp-23',
    name: 'Kecap Manis Bango 520ml',
    category: 'bumbu_dapur',
    unit: 'botol',
    price: 18500,
    originalPrice: 21500,
    discountPercent: 14,
    rating: 4.9,
    soldCount: '3.1rb',
    emoji: '🥢',
    badge: 'Shopee Mall',
    description: 'Kedelai hitam Mallika alami, kental hitam manis pas.'
  },
  {
    id: 'sp-24',
    name: 'Saus Sambal ABC Asli 335ml',
    category: 'bumbu_dapur',
    unit: 'botol',
    price: 14500,
    originalPrice: 16500,
    discountPercent: 12,
    rating: 4.8,
    soldCount: '2.0rb',
    emoji: '🌶️',
    badge: 'Star+',
    description: 'Cabai segar pilihan pedas mantap untuk gorengan & mie.'
  },
  {
    id: 'sp-25',
    name: 'Paseo Tisu Wajah 250 Sheets',
    category: 'kebutuhan_kos',
    unit: 'pack',
    price: 13000,
    originalPrice: 16000,
    discountPercent: 19,
    rating: 4.9,
    soldCount: '3.3rb',
    emoji: '🧻',
    badge: 'Diskon 19%',
    description: 'Tisu wajah ekstra lembut 100% serat alami higienis.'
  },
  {
    id: 'sp-26',
    name: 'Tisu Toilet Gulung 4 Roll',
    category: 'kebutuhan_kos',
    unit: 'pack',
    price: 16000,
    originalPrice: 19000,
    discountPercent: 16,
    rating: 4.8,
    soldCount: '1.2rb',
    emoji: '🧻',
    badge: 'Hemat Kos',
    description: 'Tisu gulung tebal daya serap tinggi untuk kamar mandi kos.'
  },
  {
    id: 'sp-27',
    name: 'SuperPell Pembersih Lantai 800ml',
    category: 'kebutuhan_kos',
    unit: 'pack',
    price: 11500,
    originalPrice: 14000,
    discountPercent: 18,
    rating: 4.8,
    soldCount: '1.4rb',
    emoji: '🧹',
    badge: 'Shopee Garansi',
    description: 'Lantai kilau bersih higienis dengan aroma apple fresh.'
  },
  {
    id: 'sp-28',
    name: 'Minyak Kayu Putih Cap Lang 60ml',
    category: 'kesehatan',
    unit: 'botol',
    price: 23000,
    originalPrice: 26500,
    discountPercent: 13,
    rating: 5.0,
    soldCount: '2.7rb',
    emoji: '🌿',
    badge: 'Shopee Mall',
    description: 'Hangatkan badan, atasi perut kembung & gigitan nyamuk di kos.'
  },
  {
    id: 'sp-29',
    name: 'Tolak Angin Cair Box (5 Sachet)',
    category: 'kesehatan',
    unit: 'box',
    price: 18500,
    originalPrice: 21000,
    discountPercent: 12,
    rating: 5.0,
    soldCount: '3.9rb',
    emoji: '🍯',
    badge: 'Paling Laris',
    description: 'Herbal alami terstandar jaga imun saat cuaca tak menentu.'
  }
];

// Firebase Configuration for Multi-Device Realtime Cloud Firestore
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA4-z4Tb4q9kOe7Rywf9YV2Xv-8-K5B3BE",
  authDomain: "smartgrocery-app-65895.firebaseapp.com",
  projectId: "smartgrocery-app-65895",
  storageBucket: "smartgrocery-app-65895.firebasestorage.app",
  messagingSenderId: "159154578335",
  appId: "1:159154578335:web:a43e9f13eddcb8e785d3aa"
};

class FirestoreRealtimeSync {
  constructor() {
    this.db = null;
    this.sessionDocRef = null;
    this.unsubscribeListener = null;
    this.sessionId = 'active_shared_session'; // Default shared session for instant multi-device sync
    this.deviceId = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);
    this.isReady = false;
    this.isApplyingCloudUpdate = false;
    this.statusListeners = [];
  }

  init() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK belum termuat atau offline. Menggunakan LocalStorage fallback.');
      this.notifyStatus('offline');
      return false;
    }

    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      this.db = firebase.firestore();

      this.sessionDocRef = this.db.collection('shopping_sessions').doc(this.sessionId);
      this.isReady = true;
      this.notifyStatus('connected');
      return true;
    } catch (e) {
      console.error('Firebase init error:', e);
      this.notifyStatus('offline');
      return false;
    }
  }

  onStatusChange(fn) {
    if (typeof fn === 'function') this.statusListeners.push(fn);
  }

  notifyStatus(status) {
    this.statusListeners.forEach(fn => {
      try { fn(status); } catch (e) { console.error(e); }
    });
  }

  // Realtime multi-device listener via onSnapshot() - NO getDoc() / getDocs()
  listenToSession(onCloudDataCallback) {
    if (!this.isReady || !this.sessionDocRef) {
      this.notifyStatus('offline');
      return null;
    }

    if (this.unsubscribeListener) {
      try { this.unsubscribeListener(); } catch (e) {}
    }

    this.notifyStatus('syncing');

    // Live real-time stream via onSnapshot() - fires on every cloud mutation instantly
    this.unsubscribeListener = this.sessionDocRef.onSnapshot(
      (docSnapshot) => {
        this.notifyStatus('connected');
        if (docSnapshot && docSnapshot.exists) {
          const cloudData = docSnapshot.data();
          this.isApplyingCloudUpdate = true;
          try {
            if (typeof onCloudDataCallback === 'function') {
              onCloudDataCallback(cloudData);
            }
          } finally {
            setTimeout(() => {
              this.isApplyingCloudUpdate = false;
            }, 60);
          }
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot error (offline / network):', error);
        this.notifyStatus('offline');
      }
    );

    return this.unsubscribeListener;
  }

  // Push local mutation to Firestore
  async pushSession(sessionData) {
    if (this.isApplyingCloudUpdate) return; // Prevent echo feedback loop
    if (!this.isReady || !this.sessionDocRef) return;

    try {
      this.notifyStatus('syncing');
      const payload = {
        storeLocation: sessionData.storeLocation || 'Superindo Kaliurang',
        shoppingDate: sessionData.shoppingDate || new Date().toISOString().split('T')[0],
        walletLimit: Number(sessionData.walletLimit) || 450000,
        items: sessionData.items || [],
        totalSpent: Number(sessionData.totalSpent) || 0,
        totalSavings: Number(sessionData.totalSavings) || 0,
        checkedCount: Number(sessionData.checkedCount) || 0,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: sessionData.updatedBy || 'Smart Grocery User',
        updateDeviceId: this.deviceId
      };

      await this.sessionDocRef.set(payload, { merge: true });
      this.notifyStatus('connected');
    } catch (e) {
      console.warn('Gagal push ke Firestore:', e);
      this.notifyStatus('offline');
    }
  }
}

window.SmartData = {
  CATEGORIES,
  UNITS,
  GROCERY_SUGGESTIONS,
  SHOPEE_PRODUCTS,
  DEFAULT_USERS,
  SmartStorage,
  FIREBASE_CONFIG,
  FirestoreRealtimeSync: new FirestoreRealtimeSync()
};

