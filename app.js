/* =========================================
   VARIABEL PENYIMPAN STATUS (STATE)
   ========================================= */
let cartState = [];         // Menyimpan produk yang dimasukkan ke keranjang
let currentCategory = 'all'; // Menyimpan kategori yang sedang aktif dipilih

/* =========================================
   1. SAAT HALAMAN PERTAMA KALI DIMUAT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Menampilkan teks nama dan slogan kafe dari file data.js ke HTML
  document.getElementById('cafeName').innerText = CAFE_INFO.nama;
  document.getElementById('cafeSlogan').innerText = CAFE_INFO.slogan;
  
  // Memanggil fungsi untuk merender tombol kategori dan daftar menu
  renderCategories();
  renderMenu();
});

/* =========================================
   2. MENAMPILKAN TOMBOL KATEGORI KE LAYAR
   ========================================= */
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  
  // Membuat elemen tombol kategori secara otomatis menggunakan map()
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="btn-cat ${cat.id === currentCategory ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
      ${cat.label}
    </button>
  `).join('');
}

/* =========================================
   3. MENAMPILKAN DAFTAR KARTU MENU KE HTML
   ========================================= */
function renderMenu(data = MENU_DATA) {
  const container = document.getElementById('menuContainer');
  
  // Jika hasil pencarian menu kosong
  if (data.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#9ca3af; padding:30px;">Menu tidak ditemukan...</p>`;
    return;
  }

  // Mengubah data array objek menu menjadi elemen HTML kartu menu
  container.innerHTML = data.map(item => `
    <div class="card-item ${!item.isAvailable ? 'sold-out' : ''}">
      <div class="img-container">
        <img src="${item.foto}" alt="${item.nama}">
        ${item.isRecommended ? `<span class="badge-rec">Favorit</span>` : ''}
      </div>
      <div class="item-details">
        <div>
          <h3>${item.nama}</h3>
          <p class="desc">${item.deskripsi}</p>
        </div>
        <div class="item-bottom">
          <span class="item-price">Rp ${item.harga.toLocaleString('id-ID')}</span>
          ${item.isAvailable 
            ? `<button class="btn-add" onclick="addToCart('${item.id}')">+ Tambah</button>`
            : `<button class="btn-disabled" disabled>Habis</button>`
          }
        </div>
      </div>
    </div>
  `).join('');
}

/* =========================================
   4. LOGIKA SAAT KATEGORI DIKLIK
   ========================================= */
function selectCategory(catId) {
  currentCategory = catId;
  renderCategories();
  filterData(); // Menyaring menu sesuai kategori baru
}

/* =========================================
   5. LOGIKA PENCARIAN MENU SECARA REAL-TIME
   ========================================= */
function handleSearch() {
  filterData();
}

/* =========================================
   6. MENYARING DATA BERDASARKAN KATEGORI & PENCARIAN
   ========================================= */
function filterData() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = MENU_DATA.filter(item => {
    const matchCat = (currentCategory === 'all' || item.kategori === currentCategory);
    const matchName = item.nama.toLowerCase().includes(keyword);
    return matchCat && matchName;
  });

  renderMenu(filtered);
}

/* =========================================
   7. MENAMBAHKAN PRODUK KE DALAM KERANJANG
   ========================================= */
function addToCart(itemId) {
  const existing = cartState.find(i => i.id === itemId);
  
  if (existing) {
    existing.qty += 1; // Jika sudah ada di keranjang, tambahkan jumlahnya (qty)
  } else {
    const itemData = MENU_DATA.find(i => i.id === itemId);
    cartState.push({ ...itemData, qty: 1 }); // Jika belum ada, masukkan sebagai item baru
  }
  
  updateUI(); // Perbarui tampilan total harga di bawah layar
}

/* =========================================
   8. MENGUBAH JUMLAH PRODUK DI MODAL KERANJANG (+ / -)
   ========================================= */
function changeQty(itemId, change) {
  const item = cartState.find(i => i.id === itemId);
  
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      // Jika jumlahnya 0 atau kurang, hapus dari keranjang
      cartState = cartState.filter(i => i.id !== itemId);
    }
  }
  
  updateUI();
  renderCartModalItems();
}

/* =========================================
   9. MEMPERBARUI NOMINAL ANGKA PADA BILAH BAWAH
   ========================================= */
function updateUI() {
  const totalItems = cartState.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cartState.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);

  document.getElementById('cartCount').innerText = `${totalItems} Item`;
  document.getElementById('cartTotal').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
  document.getElementById('modalTotal').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

/* =========================================
   10. MEMBUKA & MENUTUP MODAL KERANJANG (POP-UP)
   ========================================= */
function openCartModal() {
  if (cartState.length === 0) {
    alert("Keranjang kamu masih kosong!");
    return;
  }
  renderCartModalItems();
  document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
  document.getElementById('cartModal').style.display = 'none';
}

/* =========================================
   11. MENAMPILKAN DAFTAR ITEM DI DALAM MODAL
   ========================================= */
function renderCartModalItems() {
  const container = document.getElementById('cartItemList');
  
  container.innerHTML = cartState.map(item => `
    <div class="cart-item-row">
      <div>
        <strong>${item.nama}</strong><br>
        <small>Rp ${item.harga.toLocaleString('id-ID')}</small>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

/* =========================================
   12. MENGIRIM PESANAN OTOMATIS KE WHATSAPP KASIR
   ========================================= */
function processCheckoutWA() {
  const tableNum = document.getElementById('tableNumber').value;
  
  // Validasi: Pastikan nomor meja sudah diisi oleh pelanggan
  if (!tableNum) {
    alert("Harap isi nomor meja kamu terlebih dahulu di bagian atas!");
    return;
  }

  // Menyusun format teks pesan WhatsApp
  let text = `*PESANAN BARU - ${CAFE_INFO.nama}*\n`;
  text += `📍 *Nomor Meja:* ${tableNum}\n`;
  text += `-----------------------------------\n`;

  cartState.forEach((item, index) => {
    text += `${index + 1}. ${item.nama} x${item.qty} = Rp ${(item.harga * item.qty).toLocaleString('id-ID')}\n`;
  });

  const total = cartState.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
  text += `-----------------------------------\n`;
  text += `*TOTAL BAYAR:* Rp ${total.toLocaleString('id-ID')}\n\n`;
  text += `_Mohon segera diproses, terima kasih!_`;

  // Membuka tautan WhatsApp dengan format teks yang sudah di-encode
  const waURL = `https://wa.me/${CAFE_INFO.nomorWA}?text=${encodeURIComponent(text)}`;
  window.open(waURL, '_blank');
}
