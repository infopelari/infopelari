# MASTER BLUEPRINT: INFOPELARI.ID

## 1. KONSEP & TAMPILAN (UI/UX)
- **Nama Website:** infopelari.id
- **Bentuk Website:** Responsif untuk dibuka disemua device (PC, Laptop, Tablet, HP)
- **Tema Visual:** Dark Mode (Latar Gelap) dengan aksen Hijau Neon/Kuning Stabilo (High-Visibility).
- **Navbar (Sticky):** Muncul kembali saat di-scroll ke atas.
- **Isi Navbar:** Logo (kiri), Kolom Pencarian (Search Bar), Menu "Cari Event", Tombol "Posting Event" (warna kontras). Tautan "About Us" dan "Contact/Pasang Iklan" dirancang sebagai **Sleek Overlay Modals** (Modal melayang premium).
- **Hero Section (Slider Iklan Hero):** Di bawah navbar, terdapat slider poster besar (landscape) untuk event unggulan/berbayar. 
  - Poster/gambar, urutan, dan masa aktif sewa iklan dikelola penuh oleh Admin melalui Dashboard Admin.
  - **Sistem Poster Default (Fallback):** Jika semua poster iklan berbayar habis masa sewanya (atau kosong), slider akan menampilkan satu gambar default permanen (misal: Poster promosi infopelari.id atau penawaran "Pasang Iklan Anda di Sini").
  - **Konsistensi Rasio Poster:** Semua gambar slider dipaksa menggunakan rasio aspek landscape standar (misal `16:9` atau `21:9`) menggunakan CSS `object-fit: cover` untuk mencegah gambar gepeng/terdistorsi.
- **Sistem Dropdown Premium (Searchable Combobox):** 
  - Seluruh elemen dropdown (baik pada Filter Pencarian di Beranda maupun Formulir Input Panitia) wajib dirancang secara kustom sebagai **Searchable Dropdown (Combobox)**.
  - Terdapat kolom pencarian teks mini di bagian paling atas ketika dropdown dibuka untuk menyaring opsi secara instan.
  - Skema visual dropdown: Latar belakang abu-abu sangat gelap, teks putih, border menyala neon hijau saat aktif.
  - Mendukung navigasi keyboard penuh (Panah Atas/Bawah, Enter, Escape).
- **Layout Daftar Event:** 
  - Pilihan Tampilan: **Compact Horizontal Card** (Default) dan **Calendar View** (Tampilan kalender bulanan interaktif).
  - Poster Card Konsisten: Poster event pada card dipaksa menggunakan rasio aspek persegi (`1:1` / square) menggunakan CSS `object-fit: cover` agar tampilan grid tetap rapi.
  - **Pemotongan Teks Preview Deskripsi (Text Truncation):** Untuk menjaga kerapian bentuk kartu di beranda, deskripsi event yang dimuat pada card wajib dibersihkan dari tag HTML dan dipotong secara ketat maksimal **120 karakter pertama** diakhiri dengan tanda "...". Teks lengkap berformat Rich Text hanya akan ditampilkan di halaman detail.
  - Badge Khusus: 
    - **Verified Badge** (Neon checkmark untuk event terverifikasi).
    - **Status Event Special Badge:** **"EVENT DIUNDUR"** (Kuning cerah) atau **"EVENT DIBATALKAN"** (Merah menyala) jika terjadi perubahan status dari penyelenggara.
  - Fitur **Sorting** dengan pilihan default "Event Terdekat".
- **Footer:** Informasi singkat website, link sosial media (IG, TikTok, Strava), dan Copyright.

## 2. ARSITEKTUR DATABASE (Pondasi Data)
Tabel database dengan kolom-kolom berikut:
- **Identitas Event:**
  - Nama Event (Teks - *Validasi: Unik berdasarkan nama dan tanggal mulai untuk mencegah duplikasi*).
  - Poster (Gambar - dengan sistem kompresi otomatis di sisi frontend & batas maksimal ukuran upload, misal 2MB, dikonversi otomatis ke format WebP ringan).
  - Deskripsi Event (Teks panjang/Rich Text: Syarat & Ketentuan, Deskripsi Umum, dll)
  - Tipe Event (Multi-select Checkbox: Road Run, Trail Run, Charity Run, Fun Run, Virtual Run - *memungkinkan satu event memiliki lebih dari satu tipe, misal Road Run sekaligus Charity*).
  - **Status Penyelenggaraan:** `status_penyelenggaraan` (Enum: Normal, Diundur, Dibatalkan - *default: Normal - Hanya Admin yang dapat mengaktifkan status warning ini demi menghindari sabotase/informasi palsu*).
  - **Status Verifikasi:** `is_verified` (Boolean: Ya/Tidak)
- **Kontak Pengirim (Wajib/Mandatory - Bersifat internal untuk kebutuhan verifikasi Admin):**
  - Nama Pengirim (Teks)
  - Email Pengirim (Teks)
  - Nomor WhatsApp/Telepon (Teks)
  - **Persetujuan Privasi (Kepatuhan UU PDP Indonesia):** `consent_privasi` (Boolean - Harus bernilai `True` saat submit formulir, sebagai bukti sah panitia menyetujui penyimpanan data kontak internal mereka).
- **Lokasi & Rute:**
  - Provinsi (Dropdown Terikat - *Searchable*)
  - **Kota/Kabupaten:** (Dropdown Terikat - *Searchable* - *Sistem memuat daftar Kota/Kabupaten resmi di Indonesia secara dinamis setelah Provinsi dipilih*).
  - **Zona Waktu Event:** `zona_waktu` (Enum: WIB, WITA, WIT - *Sangat krusial untuk event di luar Jawa agar pelari antar-pulau tidak salah memperkirakan waktu start dan tenggat waktu pendaftaran*).
  - **Region Cluster (Grouping untuk Pencarian Terdekat):** (Enum: Jabodetabek, Joglosemar, Bali-Lombok, Jawa Timur, Sumatera, Sulawesi, Virtual/Online, dll)
  - Detail Alamat/Start Point (Teks)
  - Link Google Maps (URL)
  - **Link Peta Rute / Course Map (GPX / Strava):** (URL - Opsional)
  - *Validasi Logika Virtual:* Jika tipe event hanya mencakup **Virtual Run**, maka pengisian `Provinsi`, `Kota`, `Google Maps Link`, dan `Zona Waktu` otomatis dilewati (menjadi opsional / bypass) dan `Region Cluster` diisi otomatis sebagai `Virtual/Online`.
- **Waktu & Durasi:** 
  - Tanggal Mulai Event (Tanggal - *Bisa bersifat tentatif jika bendera is_tentative bernilai True*).
  - Tanggal Selesai Event (Tanggal - *Opsional, untuk event multi-hari seperti festival lari 2 hari atau ultra-maraton lintas hari. Jika kosong, default disamakan dengan Tanggal Mulai Event*).
  - Tanggal Batas Pendaftaran / Deadline (Tanggal)
  - **Bendera Tanggal Tentatif:** `is_tentative` (Boolean - *Jika panitia belum menetapkan tanggal pasti tetapi sudah mengumumkan bulan event, misal "Oktober 2026", sistem akan menampilkan "Tentatif / TBC" di UI dan mengabaikan deadline pendaftaran sampai tanggal pasti ditetapkan*).
  - *Validasi Logika Tanggal:* `Tanggal Batas Pendaftaran` wajib sebelum atau sama dengan `Tanggal Mulai Event` (jika tidak bersifat tentatif).
- **Jadwal & Tarif Spesifik (Tabel Dinamis dengan Tiered Pricing):** Kolom khusus untuk mengisi multiple sub-event:
  - `[ Kategori Jarak (5K, 10K, HM, FM, Ultra, dll) | Tanggal Pelaksanaan | Jam Start | Cut Off Time (Opsional) ]`
  - **Spesifikasi Khusus Medan Trail:** `[ Elevation Gain (EG) dalam meter | Poin ITRA/UTMB Index (Opsional) ]`
  - Di dalam setiap kategori jarak, terdapat sub-tabel/array untuk **Tier Harga** (Multi-tier Pricing):
    - `[ Nama Tier (Early Bird, Presale, Normal, dll) | Harga Tiket | Tanggal Mulai Tier | Tanggal Selesai Tier ]`
  - **Fasilitas Peserta Standard (Semua pendaftar dapat):** `[ Checkbox Multi-select: Jersey, Finisher Tee, Medali, Refreshment, Bib (Nomor Dada) ]`
- **Informasi Race Pack Collection (RPC) / Pengambilan Bib:**
  - Lokasi RPC (Teks)
  - Tanggal Mulai RPC (Tanggal)
  - Tanggal Selesai RPC (Tanggal)
  - Syarat & Detail RPC (Teks)
- **Kolom Hadiah & Fasilitas Tambahan (Fleksibel/Free Text):**
  - **Detail Hadiah Juara / Podium (Rich Text):** Kolom bebas khusus untuk menulis rincian hadiah bagi pemenang kompetisi.
  - **Fasilitas Unik / Kustom (Teks / Tags):** Kolom input bebas berupa teks singkat atau tags untuk menulis item di luar standar (misal: "Kaos Kaki Lari", "Dry Bag 5L", "Voucher Belanja").
  - **Promo / Diskon Komunitas (Teks / Opsional):** Keterangan diskon khusus untuk grup lari/komunitas.
- **Kategori Jarak (Multi-select):** 5K, 5-10km, 10K, 11-21km, HM, 22-42km, FM, Ultra.
- **Jarak Kustom & Pemetaan Filter Pencarian:** 
  - Kolom teks manual (contoh: untuk menulis "7K" atau "12K").
  - *Logika Pemetaan Backend:* Jika panitia menginput jarak kustom, backend secara otomatis menduplikasi nilai tersebut dan memetakannya ke dalam kategori filter pencarian standar (misal: "7K" otomatis masuk ke filter cluster `5-10km`, "12K" masuk ke filter cluster `11-21km`).
  - *Deduplikasi Array Kategori:* Sebelum data disimpan di database, sistem backend secara otomatis menyaring dan menghapus duplikasi kategori jarak (deduplikasi array) agar tidak ada badge ganda pada halaman visual.
- **Label/Sertifikasi:** Multi-select (WA Elite, WA Gold, WA, AIMS, WMM, PASI, ARRS, ITRA, UTMB).
- **Link Pendaftaran & Referensi:**
  - URL Pendaftaran Resmi (Ke website panitia - *Sanitasi: Wajib valid diawali http/https*)
  - URL Referensi (Bukti/sumber info untuk verifikasi admin - *Sanitasi: Wajib valid*)
- **Sistem Pelaporan Error (Crowdsourced Quality Control):**
  - `jumlah_laporan_link_mati` (Integer - *Menghitung jumlah laporan dari pengunjung jika link pendaftaran rusak/mati*).
- **Pengaturan Slider Iklan (Hero Section):**
  - `is_featured` (Boolean: Ya/Tidak)
  - `featured_order` (Integer: Menentukan urutan tampil di slider)
  - `featured_start_date` (Tanggal Mulai Sewa Iklan)
  - `featured_end_date` (Tanggal Selesai Sewa Iklan)
- **Status:** Pending (Default), Published, dan Edit-Pending.
- **Kunci Akses:** `edit_token` (String/Token unik yang di-generate otomatis untuk akses edit mandiri oleh panitia).
  - *Validasi Kadaluwarsa:* Token otomatis dihapus dan tidak aktif setelah 30 hari pasca Tanggal Selesai Event.
  - *Sistem Penguncian Hari H:* Token edit mandiri otomatis **dikunci dan dinonaktifkan** bagi panitia begitu tanggal hari ini masuk/melewati `Tanggal Mulai Event` (Hari H). Panitia tidak boleh mengubah data event apa pun setelah acara dimulai demi menjaga integritas data sejarah perlombaan. Segala perubahan pasca Hari H hanya boleh dilakukan manual oleh Admin.

## 3. SISTEM FILTER & NAVIGASI (LOGIKA PINTAR)
- **Logika Filter & Pencarian PINTAR (Semua drop-down didukung fitur Filter Search internal):**
  - Jika tidak ada filter yang dipilih, sistem secara default menampilkan **Semua Event (All)**.
  - **Dropdown Searchable (Provinsi, Kota, Bulan, dll):** Di bagian teratas panel pilihan setiap dropdown filter, wajib terdapat input pencarian mini yang menyaring daftar pilihan secara real-time saat diketik.
  - **Resolusi Dependensi Otomatis:** Jika user mengosongkan dropdown "Provinsi" tetapi mengetik/mengisi kolom "Kota", sistem secara pintar akan melakukan pencarian berbasis kota tersebut dan otomatis menyesuaikan hasil provinsi yang relevan.
  - Jika kategori jarak tidak dicentang, semua kategori jarak akan otomatis dimunculkan.
- **Urutan Tampilan (Sorting):** Default diurutkan berdasarkan **"Event Terdekat"** (berdasarkan Tanggal Mulai Event terdekat, dengan event berlabel "Tentatif/TBC" diposisikan di urutan paling bawah pada bulan perkiraannya).
- **Strategi SEO & Open Graph (OG) Dinamis (Kunci Pertumbuhan Organik):**
  - Setiap halaman detail event akan secara dinamis men-generate meta tags untuk mesin pencari (Google SEO) dan sosial media sharing (WhatsApp, IG, Twitter):
    - `Meta Title`: `[Nama Event] [Tahun] - Jadwal Lari Resmi | infopelari.id`
    - `Meta Description`: `Informasi pendaftaran resmi event lari [Nama Event] di [Kota], [Provinsi]. Jadwal Kategori: [Jarak]. Cek detail dan daftar sekarang!`
    - `OG Image`: Secara dinamis menggunakan `Poster Event` sebagai gambar pratinjau (*preview card*) saat link dibagikan di WhatsApp/grup pelari.
- **Navigasi Halaman Detail:** Klik kartu event membuka halaman baru di Tab yang Sama dengan tampilan Full Page.
- **UX Design Tampilan Halaman Detail (Urutan Elemen dari Atas ke Bawah):**
  1. **Header:** Tombol kembali (Back), Nama Event ukuran besar, **Verified Badge** (jika terverifikasi), dan badge status darurat jika event **DIUNDUR** atau **DIBATALKAN**.
  2. **Poster Utama:** Poster dalam ukuran penuh/besar agar detail kecil terlihat jelas.
  3. **Section Info Cepat (Badges):** Barisan ikon/badge kecil (Tipe: Road/Trail/Charity; Jarak: 5K, 10K, HM, FM; Label: AIMS, WA, dll).
  4. **Deskripsi & Syarat Ketentuan:** Teks lengkap informasi event.
  5. **Tabel Jadwal & Detail Tarif (Fitur Utama):** Tabel rapi di bawah poster dengan kolom `[ Kategori Jarak | Tanggal Pelaksanaan | Jam Start | Cut Off Time / EG / ITRA | Info Harga | Fasilitas Standard ]`. Jam pelaksanaan otomatis dilengkapi label zona waktu (misal: `05:00 WITA`).
  6. **Link Peta Rute / Course Map:** Jika diisi, memunculkan tombol mencolok **"Lihat Peta Rute Resmi"** (membuka link GPX/Strava eksternal di tab baru).
  7. **Detail Pengambilan Race Pack (RPC Info Box):** Bagian khusus berlatar belakang kontras yang menyajikan informasi jelas tentang lokasi, tanggal, dan syarat pengambilan Race Pack.
  8. **Detail Hadiah Juara, Fasilitas Unik, & Diskon Komunitas:** Menampilkan bagian khusus dengan ikon piala/kado yang berisi rincian teks bebas mengenai Hadiah Juara/Podium, fasilitas kustom, serta kode diskon komunitas.
  9. **Lokasi:** Integrasi Google Maps (jika tersedia/disematkan) or minimal teks alamat lengkap lokasi start. (Bypass kosong jika bertipe Virtual Run).
  10. **Tombol Aksi (Sticky Button):** Tombol "DAFTAR SEKARANG" menempel di bagian bawah layar HP (sticky bottom). 
      - **Siklus Otomatis Berdasarkan Tanggal & Status Darurat:** 
        - Jika `status_penyelenggaraan` adalah `Dibatalkan`, tombol mati berwarna merah bertuliskan **"EVENT DIBATALKAN"**.
        - Selama tanggal hari ini **belum melewati** `Tanggal Batas Pendaftaran (Deadline)`, tombol aktif bertuliskan **"DAFTAR SEKARANG"** (warna neon).
        - Begitu tanggal hari ini **melewati** `Tanggal Batas Pendaftaran (Deadline)`, tombol otomatis menjadi abu-abu non-aktif bertuliskan **"REGISTRATION CLOSED"**.
        - *Khusus Event Tentatif:* Jika `is_tentative` aktif, tombol bertuliskan **"TANGGAL BELUM DIUMUMKAN"** (warna kuning pudar, non-aktif).
  11. **Pelaporan Mandiri Publik (Crowdsourced Quality):** Di pojok bawah detail event, terdapat tombol kecil *"Laporkan Link Bermasalah / Pendaftaran Error"*.
- **Aksi Tombol Daftar:** Membuka link pendaftaran eksternal penyelenggara di Tab Baru.

## 4. ALUR KERJA SISTEM (WORKFLOW)
- **Input Publik, Proteksi Duplikasi, & Anti-Spam Bot:** Panitia mengisi formulir "Pasang Event".
  - *Dropdown Searchable & Terikat:* Pengisian lokasi menggunakan komponen Combobox Searchable. Panitia memilih Provinsi terlebih dahulu, kemudian sistem membatasi daftar Kota/Kabupaten yang dapat dipilih secara dinamis.
  - *Anti-Spam Bot:* Form dilengkapi sistem keamanan **Invisible Honeypot / CAPTCHA** di sisi frontend untuk mencegah serangan bot spamming iklan otomatis.
  - *Persetujuan Privasi:* Panitia wajib mencentang checkbox consent privasi (UU PDP Indonesia).
  - *Anti-Duplikasi:* Sebelum masuk database, sistem memeriksa duplikasi nama dan tanggal mulai.
- **Sistem Edit Mandiri Panitia & Keamanan Anti-Spam:** Setelah berhasil submit, sistem memberikan **Secure Edit Link** yang berisi token unik. Panitia bisa mengedit data kapan saja menggunakan link tersebut selama event belum memasuki Hari H.
  - *Sistem Keamanan:* Setiap kali panitia melakukan pengeditan data melalui link token, status event akan **otomatis diturunkan kembali menjadi 'Pending'** dan disembunyikan dari halaman publik untuk mencegah trik "Bait-and-Switch".
  - **Sistem Pengiriman Email Bukti Posting (Transactional Email):** Begitu panitia berhasil melakukan submit formulir, sistem secara otomatis mengirimkan email bukti tanda terima postingan yang berisi detail event dan **Secure Edit Link** langsung ke email terdaftar panitia menggunakan layanan transaksional gratis **Resend**. Ini memastikan link edit tersimpan aman di kotak masuk email mereka.
- **Dashboard Admin:**
  - Admin login ke `/admin` dengan kredensial aman (menggunakan sistem Role-Based Access Control / RBAC).
  - Tampilan berupa tabel sederhana berisi daftar antrean (Pending), nama event, kontak pengirim, dan link referensi.
  - Memiliki kontrol penuh atas Hero Section (Slider Iklan): Menambah poster, mengatur urutan, menetapkan masa aktif sewa (`start_date` & `end_date`), dan menghapus poster slider.
  - **Tombol Verifikasi & Kontrol Status Darurat (Diundur / Dibatalkan):** 
    - *Logika Kontrol:* Perubahan status darurat (`status_penyelenggaraan`) menjadi "Diundur" or "Dibatalkan" **hanya boleh diaktifkan secara sah oleh Admin** di Dashboard Admin demi menghindari sabotase/informasi palsu. 
    - *Alur Request:* Panitia hanya bisa mengajukan permohonan penundaan/pembatalan dengan menyertakan tautan pernyataan resmi panitia melalui link edit mandiri mereka. Pengajuan ini akan masuk ke antrean *Pending* Admin untuk ditinjau dan diaktifkan secara sah oleh Admin.
  - **Sistem Peringatan Link Mati (Broken Link Alert):** Jika suatu event menerima minimal 3 laporan link bermasalah dari publik, sistem akan memunculkan tanda peringatan merah pada dashboard admin.
- **Moderasi:** Admin mengecek kebenaran data & kontak pengirim, mengedit jika ada salah ketik, lalu menekan tombol "Approve" (Publish) or "Reject" (Tolak).
- **Otomatisasi & Siklus Event:**
  - **Supabase Active Heartbeat (Pencegahan Hibernasi DB):** Sistem dikonfigurasi dengan *ping* (API request ringan) otomatis berkala dari layanan eksternal UptimeRobot **setiap 3 hari sekali** untuk mencegah database gratisan Supabase masuk ke masa hibernasi otomatis (*Auto-Pause*).
  - **Auto-Expired Ads (Hero Slider Fallback):** Slider iklan secara otomatis menurunkan poster yang telah melewati `featured_end_date`. Gambar iklan dikompresi otomatis ke format WebP. Jika tidak ada poster aktif, sistem menaikkan **Gambar Poster Default**.
  - **Registration Closed:** Jika tanggal saat ini melewati 'Tanggal Deadline', sistem otomatis mengubah tombol daftar menjadi "Registration Closed" (warna abu-abu).
  - **Deteksi Tier Harga Aktif:** Sistem setiap hari memperbarui harga aktif berdasarkan tanggal mulai-selesai tier harga.
  - **Event Selesai (Arsip Akurat Multi-Hari):** Jika tanggal saat ini melewati **`Tanggal Selesai Event`**, event secara otomatis diberi label/badge "Event Selesai".
  - **Auto-Hide (Sembunyi Otomatis):** Event yang sudah berstatus "Event Selesai" tetap ditampilkan sebagai arsip/portofolio selama **1 bulan (30 hari)** setelah tanggal selesai event. Setelah melewati batas waktu 30 hari tersebut, sistem akan menyembunyikan event secara otomatis dari halaman utama/pencarian aktif.
  - **Pembersihan Token Kadaluwarsa:** Sistem secara otomatis menghapus token edit (`edit_token`) yang sudah berumur lebih dari 30 hari pasca selesainya event demi keamanan.

## 5. TAMPILAN & AKSES DASHBOARD ADMIN
- **Pintu Masuk (Login):** Anda akan memiliki link khusus, misalnya `infopelari.id/admin`. Anda masuk menggunakan email dan password yang Anda daftarkan.
- **Halaman Utama Admin (Dashboard):** Tampilannya harus berupa tabel sederhana yang berisi:
  - **Daftar Antrean (Pending):** Event yang baru masuk dari publik. Anda bisa melihat Nama Event, Kontak Pengirim, dan Link Referensinya.
  - **Tombol Verifikasi & Status:** Di sebelah tiap baris event, harus ada tombol "Setujui" (Publish dengan opsional centang "Verified"), atau "Tolak".
  - **Fitur Edit:** Tombol untuk memperbaiki data yang salah (misal panitia salah tulis tanggal).
- **Manajemen Slider Iklan:** Tab khusus untuk mengunggah gambar promosi slider, mengatur indeks urutan, menginput tanggal mulai & selesai sewa iklan, serta menetapkan/mengubah **Gambar Poster Default (Fallback)**.
- **Keamanan:** Pastikan halaman ini terkunci. Hanya Anda yang punya akses, menggunakan fitur "Role-based Access Control" (RBAC) untuk memastikan pengunjung biasa tidak bisa masuk ke sana.
