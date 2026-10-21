/* =========================================
   INFORMASI UTAMA KAFE
   ========================================= */
const CAFE_INFO = {
  nama: "Kopi Senja Utama",
  slogan: "Sensasi Kopi Lokal Berkualitas",
  nomorWA: "6281234567890", // Ganti dengan nomor WhatsApp kasir (format internasional tanpa tanda '+')
  alamat: "Jl. Pemuda No. 45, Malang"
};

/* =========================================
   KATEGORI MENU
   ========================================= */
const CATEGORIES = [
  { id: "all", label: "Semua Menu" },
  { id: "kopi", label: "☕ Kopi" },
  { id: "non-kopi", label: "🍵 Non-Kopi" },
  { id: "makanan", label: "🍽️ Makanan Berat" },
  { id: "camilan", label: "🍟 Camilan" }
];

/* =========================================
   DAFTAR ITEM MENU
   ========================================= */
const MENU_DATA = [
  {
    id: "m1",
    nama: "Es Kopi Susu Senja",
    kategori: "kopi",
    harga: 18000,
    deskripsi: "Espresso ganda dengan gula aren murni dan susu segar.",
    foto: "assets/kopi-senja.jpg", // Pastikan file gambar ada di folder assets
    isRecommended: true,  // True = Muncul label "Favorit"
    isAvailable: true    // True = Menu tersedia, False = Menu habis
  },
  {
    id: "m2",
    nama: "Matcha Latte",
    kategori: "non-kopi",
    harga: 22000,
    deskripsi: "Bubuk matcha premium diseduh dengan susu UHT lembut.",
    foto: "assets/kopi-senja.jpg",
    isRecommended: false,
    isAvailable: true
  },
  {
    id: "m3",
    nama: "Roti Bakar Cokelat Keju",
    kategori: "camilan",
    harga: 15000,
    deskripsi: "Roti gandum tebal dengan selai cokelat dan parutan keju.",
    foto: "assets/roti-bakar.jpg",
    isRecommended: true,
    isAvailable: true
  },
  {
    id: "m4",
    nama: "Nasi Goreng Spesial",
    kategori: "makanan",
    harga: 25000,
    deskripsi: "Nasi goreng bumbu rempah khas dengan telur mata sapi.",
    foto: "assets/roti-bakar.jpg",
    isRecommended: false,
    isAvailable: false // Contoh menu yang sedang habis
  }
];
