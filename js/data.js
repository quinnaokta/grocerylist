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
  'pcs', 'kg', 'pack', 'liter', 'botol', 'sachet', 'box', 'roll', 'renceng', 'ikat', 'kaleng', 'karung', 'karung/5kg'
];

// Daftar Lokasi Toko & Supermarket untuk Komparasi Harga (Persis Screenshot 2 & Wilayah Jakarta - Tangerang)
const STORE_LOCATIONS = [
  // --- 7 LOKASI PILIHAN UTAMA (PERSIS SCREENSHOT 2) ---
  { id: 'lotte_mart_puri', name: 'Lotte Mart Grocery – Puri Indah', type: 'Supermarket Grosir', area: 'Puri Indah, Jakarta Barat', icon: '🏢', badge: 'Grosir Langganan', region: 'Jakarta' },
  { id: 'superindo_intercon', name: 'Super Indo – Intercon Kebon Jeruk', type: 'Supermarket', area: 'Kebon Jeruk, Jakarta Barat', icon: '🛒', badge: 'Supermarket', region: 'Jakarta' },
  { id: 'indomaret_kemanggisan', name: 'Indomaret Fresh – Kemanggisan', type: 'Minimarket Fresh', area: 'Kemanggisan, Jakarta Barat', icon: '🏪', badge: 'Minimarket Fresh', region: 'Jakarta' },
  { id: 'grand_lucky_meruya', name: 'Grand Lucky Superstore – Meruya', type: 'Superstore', area: 'Meruya, Jakarta Barat', icon: '✨', badge: 'Superstore', region: 'Jakarta' },
  { id: 'alfamidi_palmerah', name: 'Alfamidi Super – Palmerah', type: 'Minimarket Super', area: 'Palmerah, Jakarta Barat', icon: '🏪', badge: 'Minimarket', region: 'Jakarta' },
  { id: 'hypermart_puri', name: 'Hypermart – Puri Indah', type: 'Hypermarket', area: 'Puri Indah Mall, Jakarta Barat', icon: '🏬', badge: 'Hypermarket', region: 'Jakarta' },
  { id: 'pasar_puri', name: 'Pasar Tradisional Puri Indah', type: 'Pasar Tradisional', area: 'Puri Indah, Jakarta Barat', icon: '🥬', badge: 'Pasar Tradisional', region: 'Jakarta' },

  // --- LOKASI LAINNYA DI JAKARTA ---
  { id: 'grand_lucky_scbd', name: 'Grand Lucky Superstore - SCBD', type: 'Supermarket', area: 'SCBD, Jakarta Selatan', icon: '✨', badge: 'Superstore', region: 'Jakarta' },
  { id: 'farmers_market', name: 'Farmers Market - Kelapa Gading', type: 'Supermarket', area: 'Kelapa Gading, Jakarta Utara', icon: '🥦', badge: 'Supermarket Segar', region: 'Jakarta' },
  { id: 'hero_pim', name: 'Hero Supermarket - Pondok Indah Mall', type: 'Supermarket', area: 'Pondok Indah, Jakarta Selatan', icon: '🏪', badge: 'Supermarket', region: 'Jakarta' },
  { id: 'total_buah', name: 'Total Buah Segar - Rawamangun', type: 'Supermarket Segar', area: 'Rawamangun, Jakarta Timur', icon: '🍎', badge: 'Pasar Segar', region: 'Jakarta' },
  { id: 'transmart_cp', name: 'Transmart Carrefour - Cempaka Putih', type: 'Hypermarket', area: 'Cempaka Putih, Jakarta Pusat', icon: '🛍️', badge: 'Hypermarket', region: 'Jakarta' },
  { id: 'indomaret_kencana', name: 'Indomaret - Puri Kencana', type: 'Minimarket', area: 'Puri Kencana, Jakarta Barat', icon: '🏪', badge: 'Minimarket', region: 'Jakarta' },
  { id: 'alfamart_meruya', name: 'Alfamart - Meruya Ilir', type: 'Minimarket', area: 'Meruya Ilir, Jakarta Barat', icon: '🏪', badge: 'Minimarket', region: 'Jakarta' },

  // --- TANGERANG & TANGERANG SELATAN ---
  { id: 'aeon_bsd', name: 'AEON Store - BSD City Tangerang', type: 'Hypermarket', area: 'BSD City, Tangerang Selatan', icon: '🏬', badge: 'Hypermarket BSD', region: 'Tangerang' },
  { id: 'lotte_alsut', name: 'Lotte Mart Wholesale - Alam Sutera Tangerang', type: 'Supermarket Grosir', area: 'Alam Sutera, Kota Tangerang', icon: '🏢', badge: 'Grosir Alam Sutera', region: 'Tangerang' },
  { id: 'superindo_gs', name: 'Superindo - Gading Serpong Tangerang', type: 'Supermarket', area: 'Gading Serpong, Tangerang', icon: '🛒', badge: 'Supermarket Serpong', region: 'Tangerang' },
  { id: 'hypermart_karawaci', name: 'Hypermart - Cyberpark Lippo Karawaci', type: 'Hypermarket', area: 'Lippo Karawaci, Tangerang', icon: '🏬', badge: 'Hypermarket Karawaci', region: 'Tangerang' },
  { id: 'tiptop_ciputat', name: 'Tip Top Supermarket - Ciputat Tangerang', type: 'Supermarket', area: 'Ciputat, Tangerang Selatan', icon: '🏷️', badge: 'Supermarket Murah', region: 'Tangerang' },
  { id: 'harihari_bintaro', name: 'Hari Hari Pasar Swalayan - Bintaro Tangerang', type: 'Pasar Swalayan', area: 'Bintaro Jaya, Tangerang Selatan', icon: '🛒', badge: 'Swalayan Bintaro', region: 'Tangerang' }
];

// Pre-seeded Benchmark Prices per Store (Histori Harga Toko yang Sama & Komparasi Antartoko)
const STORE_BENCHMARK_PRICES = {
  // 1. Lotte Mart Grocery – Puri Indah (Grosir Langganan)
  'Lotte Mart Grocery – Puri Indah': {
    'beras rojolele': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'beras 5kg': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'beras ramos 5kg': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'pack', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur ayam 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur ayam negeri 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'garam 500g': { lastPrice: 5000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Lotte Mart Grocery – Puri Indah' },
    'garam dapur 250g': { lastPrice: 5000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Lotte Mart Grocery – Puri Indah' },
    'minyak goreng 2l': { lastPrice: 43000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'sabun mandi': { lastPrice: 15000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Lotte Mart Grocery – Puri Indah' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'sabun cuci piring 750ml': { lastPrice: 13500, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Lotte Mart Grocery – Puri Indah' }
  },
  'Lotte Mart Grocery - Puri Indah': {
    'beras rojolele': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'beras 5kg': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'beras ramos 5kg': { lastPrice: 68000, previousMonth: '26 September 2026', unit: 'pack', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur ayam 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'telur ayam negeri 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'garam 500g': { lastPrice: 5000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Lotte Mart Grocery – Puri Indah' },
    'garam dapur 250g': { lastPrice: 5000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Lotte Mart Grocery – Puri Indah' },
    'minyak goreng 2l': { lastPrice: 43000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'sabun mandi': { lastPrice: 15000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Lotte Mart Grocery – Puri Indah' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Lotte Mart Grocery – Puri Indah' },
    'sabun cuci piring 750ml': { lastPrice: 13500, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Lotte Mart Grocery – Puri Indah' }
  },

  // 2. Super Indo – Intercon Kebon Jeruk
  'Super Indo – Intercon Kebon Jeruk': {
    'beras rojolele': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'beras 5kg': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'telur 1kg': { lastPrice: 31000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'telur ayam 1kg': { lastPrice: 31000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'garam 500g': { lastPrice: 4900, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Super Indo – Intercon Kebon Jeruk' },
    'minyak goreng 2l': { lastPrice: 38500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'sabun mandi': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Super Indo – Intercon Kebon Jeruk' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'sabun cuci piring 750ml': { lastPrice: 13800, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Super Indo – Intercon Kebon Jeruk' }
  },
  'Superindo - Intercon Kebon Jeruk': {
    'beras rojolele': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'beras 5kg': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'telur 1kg': { lastPrice: 31000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'garam 500g': { lastPrice: 4900, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Super Indo – Intercon Kebon Jeruk' },
    'minyak goreng 2l': { lastPrice: 38500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' },
    'sabun mandi': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Super Indo – Intercon Kebon Jeruk' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Super Indo – Intercon Kebon Jeruk' }
  },

  // 3. Indomaret Fresh – Kemanggisan
  'Indomaret Fresh – Kemanggisan': {
    'beras rojolele': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'beras 5kg': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'telur 1kg': { lastPrice: 33500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'telur ayam 1kg': { lastPrice: 33500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'garam 500g': { lastPrice: 5500, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Indomaret Fresh – Kemanggisan' },
    'minyak goreng 2l': { lastPrice: 39500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'sabun mandi': { lastPrice: 16000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Indomaret Fresh – Kemanggisan' },
    'indomie goreng': { lastPrice: 3200, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Indomaret Fresh – Kemanggisan' },
    'sabun cuci piring 750ml': { lastPrice: 14200, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Indomaret Fresh – Kemanggisan' }
  },

  // 4. Grand Lucky Superstore – Meruya
  'Grand Lucky Superstore – Meruya': {
    'beras rojolele': { lastPrice: 75000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'beras 5kg': { lastPrice: 75000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'telur 1kg': { lastPrice: 34000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'telur ayam 1kg': { lastPrice: 34000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'garam 500g': { lastPrice: 6000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Grand Lucky Superstore – Meruya' },
    'minyak goreng 2l': { lastPrice: 44000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'sabun mandi': { lastPrice: 17000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Grand Lucky Superstore – Meruya' },
    'indomie goreng': { lastPrice: 3300, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Grand Lucky Superstore – Meruya' },
    'sabun cuci piring 750ml': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Grand Lucky Superstore – Meruya' }
  },

  // 5. Alfamidi Super – Palmerah
  'Alfamidi Super – Palmerah': {
    'beras rojolele': { lastPrice: 71500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'beras 5kg': { lastPrice: 71500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'telur 1kg': { lastPrice: 33000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'telur ayam 1kg': { lastPrice: 33000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'garam 500g': { lastPrice: 5300, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Alfamidi Super – Palmerah' },
    'minyak goreng 2l': { lastPrice: 39900, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'sabun mandi': { lastPrice: 15500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Alfamidi Super – Palmerah' },
    'indomie goreng': { lastPrice: 3200, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Alfamidi Super – Palmerah' },
    'sabun cuci piring 750ml': { lastPrice: 13900, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Alfamidi Super – Palmerah' }
  },

  // 6. Hypermart – Puri Indah
  'Hypermart – Puri Indah': {
    'beras rojolele': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'beras 5kg': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'telur 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'telur ayam 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'garam 500g': { lastPrice: 5100, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hypermart – Puri Indah' },
    'minyak goreng 2l': { lastPrice: 40500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'sabun mandi': { lastPrice: 15200, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hypermart – Puri Indah' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'sabun cuci piring 750ml': { lastPrice: 13600, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Hypermart – Puri Indah' }
  },
  'Hypermart - Puri Indah Mall': {
    'beras rojolele': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'beras 5kg': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'telur 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'garam 500g': { lastPrice: 5100, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hypermart – Puri Indah' },
    'minyak goreng 2l': { lastPrice: 40500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' },
    'sabun mandi': { lastPrice: 15200, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hypermart – Puri Indah' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hypermart – Puri Indah' }
  },

  // 7. Pasar Tradisional Puri Indah
  'Pasar Tradisional Puri Indah': {
    'beras rojolele': { lastPrice: 65000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'beras 5kg': { lastPrice: 65000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'telur 1kg': { lastPrice: 28500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'telur ayam 1kg': { lastPrice: 28500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'garam 500g': { lastPrice: 4000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Pasar Tradisional Puri Indah' },
    'minyak goreng 2l': { lastPrice: 36000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'sabun mandi': { lastPrice: 14000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Pasar Tradisional Puri Indah' },
    'indomie goreng': { lastPrice: 3000, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Pasar Tradisional Puri Indah' },
    'sabun cuci piring 750ml': { lastPrice: 13000, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Pasar Tradisional Puri Indah' }
  },
  'Indomaret - Puri Kencana': {
    'beras rojolele': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'beras 5kg': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'beras ramos 5kg': { lastPrice: 73000, previousMonth: '26 September 2026', unit: 'pack', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'telur 1kg': { lastPrice: 33500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'telur ayam 1kg': { lastPrice: 33500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'garam 500g': { lastPrice: 5500, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Indomaret - Puri Kencana' },
    'minyak goreng 2l': { lastPrice: 39500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'sabun mandi': { lastPrice: 16000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Indomaret - Puri Kencana' },
    'indomie goreng': { lastPrice: 3200, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Indomaret - Puri Kencana' },
    'sabun cuci piring 750ml': { lastPrice: 14000, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Indomaret - Puri Kencana' }
  },
  'Alfamart - Meruya Ilir': {
    'beras rojolele': { lastPrice: 72500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Alfamart - Meruya Ilir' },
    'beras 5kg': { lastPrice: 72500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Alfamart - Meruya Ilir' },
    'telur 1kg': { lastPrice: 34000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Alfamart - Meruya Ilir' },
    'garam 500g': { lastPrice: 5500, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Alfamart - Meruya Ilir' },
    'minyak goreng 2l': { lastPrice: 39000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Alfamart - Meruya Ilir' },
    'sabun mandi': { lastPrice: 15500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Alfamart - Meruya Ilir' },
    'indomie goreng': { lastPrice: 3200, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Alfamart - Meruya Ilir' },
    'sabun cuci piring 750ml': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Alfamart - Meruya Ilir' }
  },
  'Superindo - Intercon Kebon Jeruk': {
    'beras rojolele': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Superindo - Intercon Kebon Jeruk' },
    'beras 5kg': { lastPrice: 69500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Superindo - Intercon Kebon Jeruk' },
    'telur 1kg': { lastPrice: 31000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Superindo - Intercon Kebon Jeruk' },
    'garam 500g': { lastPrice: 4900, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Superindo - Intercon Kebon Jeruk' },
    'minyak goreng 2l': { lastPrice: 38500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Superindo - Intercon Kebon Jeruk' },
    'sabun mandi': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Superindo - Intercon Kebon Jeruk' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Superindo - Intercon Kebon Jeruk' },
    'sabun cuci piring 750ml': { lastPrice: 13200, previousMonth: '26 September 2026', unit: 'pack', category: 'mandi_cuci', store: 'Superindo - Intercon Kebon Jeruk' }
  },
  'Hypermart - Puri Indah Mall': {
    'beras rojolele': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart - Puri Indah Mall' },
    'beras 5kg': { lastPrice: 70000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart - Puri Indah Mall' },
    'telur 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hypermart - Puri Indah Mall' },
    'garam 500g': { lastPrice: 5200, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hypermart - Puri Indah Mall' },
    'minyak goreng 2l': { lastPrice: 40500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hypermart - Puri Indah Mall' },
    'sabun mandi': { lastPrice: 15200, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hypermart - Puri Indah Mall' },
    'indomie goreng': { lastPrice: 3150, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hypermart - Puri Indah Mall' }
  },
  'Grand Lucky Superstore - SCBD': {
    'beras rojolele': { lastPrice: 73500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore - SCBD' },
    'beras 5kg': { lastPrice: 73500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore - SCBD' },
    'telur 1kg': { lastPrice: 34000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Grand Lucky Superstore - SCBD' },
    'garam 500g': { lastPrice: 5500, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Grand Lucky Superstore - SCBD' },
    'minyak goreng 2l': { lastPrice: 43500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Grand Lucky Superstore - SCBD' },
    'sabun mandi': { lastPrice: 16000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Grand Lucky Superstore - SCBD' },
    'indomie goreng': { lastPrice: 3200, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Grand Lucky Superstore - SCBD' }
  },
  'Farmers Market - Kelapa Gading': {
    'beras rojolele': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Farmers Market - Kelapa Gading' },
    'beras 5kg': { lastPrice: 72000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Farmers Market - Kelapa Gading' },
    'telur 1kg': { lastPrice: 33000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Farmers Market - Kelapa Gading' },
    'garam 500g': { lastPrice: 5300, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Farmers Market - Kelapa Gading' },
    'minyak goreng 2l': { lastPrice: 41000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Farmers Market - Kelapa Gading' },
    'sabun mandi': { lastPrice: 15500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Farmers Market - Kelapa Gading' },
    'indomie goreng': { lastPrice: 3150, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Farmers Market - Kelapa Gading' }
  },
  'Hero Supermarket - Pondok Indah Mall': {
    'beras rojolele': { lastPrice: 74500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hero Supermarket - Pondok Indah Mall' },
    'beras 5kg': { lastPrice: 74500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hero Supermarket - Pondok Indah Mall' },
    'telur 1kg': { lastPrice: 34500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hero Supermarket - Pondok Indah Mall' },
    'garam 500g': { lastPrice: 5600, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hero Supermarket - Pondok Indah Mall' },
    'minyak goreng 2l': { lastPrice: 44000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hero Supermarket - Pondok Indah Mall' },
    'sabun mandi': { lastPrice: 16500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hero Supermarket - Pondok Indah Mall' },
    'indomie goreng': { lastPrice: 3250, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hero Supermarket - Pondok Indah Mall' }
  },
  'Total Buah Segar - Rawamangun': {
    'beras rojolele': { lastPrice: 71000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Total Buah Segar - Rawamangun' },
    'beras 5kg': { lastPrice: 71000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Total Buah Segar - Rawamangun' },
    'telur 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Total Buah Segar - Rawamangun' },
    'garam 500g': { lastPrice: 5000, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Total Buah Segar - Rawamangun' },
    'minyak goreng 2l': { lastPrice: 40000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Total Buah Segar - Rawamangun' },
    'sabun mandi': { lastPrice: 15000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Total Buah Segar - Rawamangun' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Total Buah Segar - Rawamangun' }
  },
  'Transmart Carrefour - Cempaka Putih': {
    'beras rojolele': { lastPrice: 70500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Transmart Carrefour - Cempaka Putih' },
    'beras 5kg': { lastPrice: 70500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Transmart Carrefour - Cempaka Putih' },
    'telur 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Transmart Carrefour - Cempaka Putih' },
    'garam 500g': { lastPrice: 5100, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Transmart Carrefour - Cempaka Putih' },
    'minyak goreng 2l': { lastPrice: 40000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Transmart Carrefour - Cempaka Putih' },
    'sabun mandi': { lastPrice: 15200, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Transmart Carrefour - Cempaka Putih' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Transmart Carrefour - Cempaka Putih' }
  },

  // TANGERANG & TANGERANG SELATAN
  'AEON Store - BSD City Tangerang': {
    'beras rojolele': { lastPrice: 71000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'AEON Store - BSD City Tangerang' },
    'beras 5kg': { lastPrice: 71000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'AEON Store - BSD City Tangerang' },
    'telur 1kg': { lastPrice: 32500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'AEON Store - BSD City Tangerang' },
    'garam 500g': { lastPrice: 5200, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'AEON Store - BSD City Tangerang' },
    'minyak goreng 2l': { lastPrice: 39500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'AEON Store - BSD City Tangerang' },
    'sabun mandi': { lastPrice: 15000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'AEON Store - BSD City Tangerang' },
    'indomie goreng': { lastPrice: 3150, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'AEON Store - BSD City Tangerang' }
  },
  'Lotte Mart Wholesale - Alam Sutera Tangerang': {
    'beras rojolele': { lastPrice: 67500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'beras 5kg': { lastPrice: 67500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'telur 1kg': { lastPrice: 31500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'garam 500g': { lastPrice: 4800, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'minyak goreng 2l': { lastPrice: 42500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'sabun mandi': { lastPrice: 14800, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' },
    'indomie goreng': { lastPrice: 3050, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Lotte Mart Wholesale - Alam Sutera Tangerang' }
  },
  'Superindo - Gading Serpong Tangerang': {
    'beras rojolele': { lastPrice: 69000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Superindo - Gading Serpong Tangerang' },
    'beras 5kg': { lastPrice: 69000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Superindo - Gading Serpong Tangerang' },
    'telur 1kg': { lastPrice: 30500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Superindo - Gading Serpong Tangerang' },
    'garam 500g': { lastPrice: 4900, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Superindo - Gading Serpong Tangerang' },
    'minyak goreng 2l': { lastPrice: 38000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Superindo - Gading Serpong Tangerang' },
    'sabun mandi': { lastPrice: 14500, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Superindo - Gading Serpong Tangerang' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Superindo - Gading Serpong Tangerang' }
  },
  'Hypermart - Cyberpark Lippo Karawaci': {
    'beras rojolele': { lastPrice: 69800, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'beras 5kg': { lastPrice: 69800, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'telur 1kg': { lastPrice: 32000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'garam 500g': { lastPrice: 5100, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'minyak goreng 2l': { lastPrice: 39800, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'sabun mandi': { lastPrice: 15000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hypermart - Cyberpark Lippo Karawaci' },
    'indomie goreng': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hypermart - Cyberpark Lippo Karawaci' }
  },
  'Tip Top Supermarket - Ciputat Tangerang': {
    'beras rojolele': { lastPrice: 66500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'beras 5kg': { lastPrice: 66500, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'telur 1kg': { lastPrice: 29500, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'garam 500g': { lastPrice: 4500, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'minyak goreng 2l': { lastPrice: 36500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'sabun mandi': { lastPrice: 13800, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Tip Top Supermarket - Ciputat Tangerang' },
    'indomie goreng': { lastPrice: 2950, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Tip Top Supermarket - Ciputat Tangerang' }
  },
  'Hari Hari Pasar Swalayan - Bintaro Tangerang': {
    'beras rojolele': { lastPrice: 67000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'beras 5kg': { lastPrice: 67000, previousMonth: '26 September 2026', unit: 'karung/5kg', category: 'bahan_pokok', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'telur 1kg': { lastPrice: 30000, previousMonth: '26 September 2026', unit: 'kg', category: 'bahan_pokok', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'garam 500g': { lastPrice: 4700, previousMonth: '26 September 2026', unit: 'pack', category: 'bumbu_dapur', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'minyak goreng 2l': { lastPrice: 37500, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'sabun mandi': { lastPrice: 14000, previousMonth: '26 September 2026', unit: 'pcs', category: 'mandi_cuci', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' },
    'indomie goreng': { lastPrice: 3000, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok', store: 'Hari Hari Pasar Swalayan - Bintaro Tangerang' }
  }
};

// Pre-seeded Benchmark Prices from previous months (Lotte Mart Grocery - Puri Indah & Benchmark Standar)
const INITIAL_BENCHMARK_PRICES = {
  ...STORE_BENCHMARK_PRICES['Lotte Mart Grocery - Puri Indah'],
  'indomie ayam bawang': { lastPrice: 3100, previousMonth: '26 September 2026', unit: 'pcs', category: 'bahan_pokok' },
  'minyak goreng 1l': { lastPrice: 18000, previousMonth: '26 September 2026', unit: 'botol', category: 'bahan_pokok' },
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

// Initial active grocery list (Kosong saat pertama kali log on / buat akun baru)
const INITIAL_ACTIVE_ITEMS = [];

// Initial historical trips (Kosong untuk akun baru agar tidak ada riwayat belanja palsu)
const INITIAL_HISTORY_TRIPS = [];

// Autocomplete suggestion catalog for Anak Rantau
const GROCERY_SUGGESTIONS = [
  { name: 'Beras Rojolele', category: 'bahan_pokok', unit: 'karung/5kg', defaultPrice: 74000 },
  { name: 'Beras Ramos 5kg', category: 'bahan_pokok', unit: 'pack', defaultPrice: 73000 },
  { name: 'Telur 1kg', category: 'bahan_pokok', unit: 'kg', defaultPrice: 28000 },
  { name: 'Telur Ayam Negeri 1kg', category: 'bahan_pokok', unit: 'kg', defaultPrice: 29500 },
  { name: 'Minyak Goreng 2L', category: 'bahan_pokok', unit: 'botol', defaultPrice: 43000 },
  { name: 'Garam 500g', category: 'bumbu_dapur', unit: 'pack', defaultPrice: 5000 },
  { name: 'Sabun Mandi', category: 'mandi_cuci', unit: 'pcs', defaultPrice: 15000 },
  { name: 'Indomie Goreng', category: 'bahan_pokok', unit: 'pcs', defaultPrice: 3100 },
  { name: 'Indomie Ayam Bawang', category: 'bahan_pokok', unit: 'pcs', defaultPrice: 3100 },
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

  // Active Grocery Cart Items (Bersih saat pertama kali log on / buat akun baru)
  static getActiveItems() {
    const user = this.getCurrentUser();
    const userKey = user && user.id ? `active_items_${user.id}` : null;
    let items = userKey ? this.get(userKey, null) : null;
    if (items === null) {
      items = this.get('active_items', []);
    }
    // Filter item demo statis bawaan agar tidak langsung muncul di keranjang pengguna baru
    if (Array.isArray(items)) {
      items = items.filter(i => !['item-1', 'item-2', 'item-3', 'item-4', 'item-5'].includes(i.id));
    } else {
      items = [];
    }
    return items;
  }

  static saveActiveItems(items) {
    const cleanItems = Array.isArray(items) ? items : [];
    this.set('active_items', cleanItems);
    const user = this.getCurrentUser();
    if (user && user.id) {
      this.set(`active_items_${user.id}`, cleanItems);
    }
  }

  // Budget Limit (Selaras 100% dengan pagu bulanan akun pengguna aktif)
  static getBudgetLimit() {
    const user = this.getCurrentUser();
    if (user && user.budget) return Number(user.budget);
    return this.get('budget_limit', 400000); // Default Rp 400.000
  }

  static saveBudgetLimit(amount) {
    const val = Number(amount) || 400000;
    this.set('budget_limit', val);
    const user = this.getCurrentUser();
    if (user) {
      user.budget = val;
      this.setCurrentUser(user);
    }
  }

  // Store Location
  static getStoreLocation() {
    return this.get('store_location', 'Lotte Mart Grocery - Puri Indah');
  }

  static saveStoreLocation(loc) {
    this.set('store_location', loc || 'Lotte Mart Grocery - Puri Indah');
  }

  // Custom Store Price Overrides (Per-toko agar update harga langsung tercermin di etalase toko tersebut)
  static getCustomStorePrices(storeName) {
    const all = this.get('store_prices_map', {});
    const norm = (storeName || '').toLowerCase().replace(/[–—]/g, '-').trim();
    return all[norm] || {};
  }

  static saveStoreProductPrice(storeName, productName, price) {
    const all = this.get('store_prices_map', {});
    const norm = (storeName || '').toLowerCase().replace(/[–—]/g, '-').trim();
    if (!all[norm]) all[norm] = {};
    const normProd = (productName || '').toLowerCase().trim();
    all[norm][normProd] = Number(price);
    this.set('store_prices_map', all);
  }

  // Shopping Date
  static getShoppingDate() {
    const today = new Date().toISOString().split('T')[0];
    return this.get('shopping_date', today);
  }

  static saveShoppingDate(date) {
    this.set('shopping_date', date);
  }

  // Historical Shopping Trips (Bersih untuk akun baru, tanpa trip palsu)
  static getHistoryTrips() {
    const user = this.getCurrentUser();
    const userKey = user && user.id ? `history_trips_${user.id}` : null;
    let trips = userKey ? this.get(userKey, null) : null;
    if (trips === null) {
      trips = this.get('history_trips', []);
    }
    // Bersihkan trip demo statis lama (trip-sep-2026, trip-aug-2026) agar riwayat akun baru tidak otomatis terisi
    if (Array.isArray(trips)) {
      trips = trips.filter(t => t && t.id !== 'trip-sep-2026' && t.id !== 'trip-aug-2026');
    } else {
      trips = [];
    }
    return trips;
  }

  static saveHistoryTrips(trips) {
    const cleanTrips = Array.isArray(trips) ? trips : [];
    this.set('history_trips', cleanTrips);
    const user = this.getCurrentUser();
    if (user && user.id) {
      this.set(`history_trips_${user.id}`, cleanTrips);
    }
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
    return { success: false, message: 'Email atau password salah. Silakan periksa kembali.' };
  }

  static updateUserBudget(identifier, newBudget) {
    const users = this.getUsers();
    const cleanId = String(identifier || '').trim().toLowerCase();
    const budgetNum = Number(newBudget) || 450000;
    
    let updated = false;
    users.forEach(u => {
      if ((u.id && String(u.id).toLowerCase() === cleanId) || (u.email && u.email.toLowerCase() === cleanId)) {
        u.budget = budgetNum;
        updated = true;
      }
    });
    if (updated) {
      this.saveUsers(users);
    }
    
    const current = this.getCurrentUser();
    if (current && ((current.id && String(current.id).toLowerCase() === cleanId) || (current.email && current.email.toLowerCase() === cleanId))) {
      current.budget = budgetNum;
      this.setCurrentUser(current);
    }
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

    // Akun Baru: Keranjang belanja & riwayat belanja akun baru dijamin bersih 100%
    this.set(`active_items_${newUser.id}`, []);
    this.set(`history_trips_${newUser.id}`, []);
    this.set('active_items', []);
    this.set('history_trips', []);

    return { success: true, user: newUser };
  }

  // Google OAuth Login or Register Helper (Persis Screenshot 1)
  static loginOrRegisterGoogleUser(googlePayload) {
    const users = this.getUsers();
    const cleanEmail = (googlePayload.email || '').trim().toLowerCase();
    
    let found = users.find(u => u.email.toLowerCase() === cleanEmail);
    let isNew = false;

    if (!found) {
      isNew = true;
      found = {
        id: 'user-google-' + (googlePayload.uid || Date.now()),
        name: googlePayload.displayName || googlePayload.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: 'google_oauth_auth_token',
        role: 'Anak Kos Hemat',
        city: 'Jakarta Barat',
        budget: 450000,
        avatar: '👩‍💻',
        photoURL: googlePayload.photoURL || null,
        isGoogleAuth: true,
        createdAt: new Date().toISOString()
      };

      users.push(found);
      this.saveUsers(users);

      // Pastikan keranjang dan riwayat kosong untuk akun baru
      this.set(`active_items_${found.id}`, []);
      this.set(`history_trips_${found.id}`, []);
      this.set('active_items', []);
      this.set('history_trips', []);
    } else {
      if (googlePayload.displayName && (!found.name || found.name.includes('@'))) {
        found.name = googlePayload.displayName;
      }
      if (googlePayload.photoURL) {
        found.photoURL = googlePayload.photoURL;
      }
      this.saveUsers(users);
    }

    this.setCurrentUser(found);
    return { success: true, user: found, isNew };
  }

  // Custom Store Locations (Persis Screenshot 2: Tambah Toko / Tempat Belanja Baru)
  static getCustomStores() {
    return this.get('custom_stores_list', []);
  }

  static addCustomStore(storeName) {
    const trimmed = (storeName || '').trim();
    if (!trimmed) return null;
    const list = this.getCustomStores();
    const exists = list.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      list.push(trimmed);
      this.set('custom_stores_list', list);
    }
    return trimmed;
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

const DEFAULT_USERS = [];

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
    this.sessionId = this.getCurrentSessionId(); // Scoped per akun pengguna agar keranjang akun baru tidak terkontaminasi
    this.deviceId = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6);
    this.isReady = false;
    this.isApplyingCloudUpdate = false;
    this.statusListeners = [];
  }

  getCurrentSessionId() {
    try {
      const user = SmartStorage.getCurrentUser();
      if (user && (user.id || user.email)) {
        const safe = String(user.id || user.email).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        return `session_${safe}`;
      }
    } catch (e) {}
    return 'active_shared_session';
  }

  setSessionUser(userId, onCloudDataCallback) {
    const safe = String(userId || '').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    this.sessionId = safe ? `session_${safe}` : 'active_shared_session';
    if (this.db) {
      this.sessionDocRef = this.db.collection('shopping_sessions').doc(this.sessionId);
      if (typeof onCloudDataCallback === 'function') {
        this.listenToSession(onCloudDataCallback);
      }
    }
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

      this.sessionId = this.getCurrentSessionId();
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
        storeLocation: sessionData.storeLocation || 'Lotte Mart Grocery - Puri Indah',
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
  STORE_LOCATIONS,
  STORE_BENCHMARK_PRICES,
  SmartStorage,
  FIREBASE_CONFIG,
  FirestoreRealtimeSync: new FirestoreRealtimeSync()
};

