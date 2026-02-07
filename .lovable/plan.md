

# 🧘 Platform Pijat Panggilan Profesional
### Rencana Implementasi Lengkap dengan React + Supabase

---

## 📋 Ringkasan Proyek

Platform pemesanan jasa pijat panggilan berbasis web (PWA) dengan 3 role utama: **Pelanggan**, **Mitra (Terapis)**, dan **Admin**. Desain professional & trustworthy dengan fokus mobile-first.

---

## 🎨 Konsep Desain

### Style Guide
- **Warna Utama**: Deep teal/green (#0D9488) - menyimbolkan kesehatan & relaksasi
- **Warna Sekunder**: Warm gold (#D4A574) - professional & premium
- **Background**: Soft cream/white dengan sentuhan natural
- **Typography**: Clean, readable fonts (Inter/Plus Jakarta Sans)
- **Elemen Visual**: Rounded corners, subtle shadows, nature-inspired icons

### Prinsip UX
- Booking dalam **≤ 3 langkah**
- Mobile-first responsive design
- PWA installable (seperti aplikasi native)
- Loading cepat & animasi halus

---

## 👥 Fitur Per Role

### 1️⃣ PELANGGAN (Customer)

**Autentikasi**
- Registrasi & Login (Email, Google, Phone/WhatsApp)
- Verifikasi email/phone
- Lupa password

**Booking System**
- Browse katalog layanan pijat
- Pilih jenis layanan (Traditional, Aromatherapy, Sport, dll)
- Pilih tanggal & jam
- Input lokasi dengan Maps/GPS
- Sistem rekomendasi mitra terdekat & aktif
- Estimasi harga otomatis (termasuk dynamic pricing jam sibuk)
- Checkout & pembayaran (Midtrans)

**Tracking & History**
- Status order real-time:
  - 🟡 Menunggu Mitra
  - 🟢 Diterima
  - 🔵 Dalam Perjalanan
  - ✅ Selesai
- Riwayat pesanan lengkap
- Download invoice/receipt

**Interaksi**
- Rating & review mitra (bintang + komentar)
- Tombol bantuan / laporan masalah
- Chat dengan mitra (opsional)
- Favorit mitra

---

### 2️⃣ MITRA (Terapis)

**Registrasi & Verifikasi**
- Pendaftaran dengan upload dokumen:
  - KTP (wajib)
  - Foto profil (wajib)
  - Sertifikat pijat (opsional)
- Status verifikasi admin

**Dashboard Mitra**
- Toggle status: Aktif / Nonaktif
- Pengaturan profil:
  - Jam kerja
  - Hari libur
  - Radius layanan
  - Spesialisasi

**Manajemen Order**
- Notifikasi order baru
- Terima / tolak pesanan
- Lihat jadwal kerja (kalender)
- Navigasi ke lokasi pelanggan

**Keuangan**
- Laporan pendapatan (harian/mingguan/bulanan)
- Saldo wallet
- Request penarikan dana
- Riwayat transaksi

**Performa**
- Rating & review dari pelanggan
- Statistik order (total, completed, cancelled)
- Badge/level mitra

---

### 3️⃣ ADMIN

**Dashboard Utama**
- Overview statistik (order, revenue, users)
- Grafik perkembangan bisnis
- Alert & notifikasi penting

**Manajemen Users**
- Verifikasi akun mitra (approve/reject dokumen)
- Verifikasi pelanggan
- Suspend / blacklist akun
- View detail semua users

**Manajemen Layanan**
- CRUD jenis layanan pijat
- Pengaturan harga base
- Konfigurasi dynamic pricing (jam sibuk)

**Manajemen Order**
- Monitor semua order
- Handle dispute/komplain
- Override status order
- Refund management

**Keuangan**
- Verifikasi pembayaran manual (jika ada)
- Pengaturan komisi platform
- Approve penarikan dana mitra
- Laporan keuangan lengkap
- Escrow management

**Monetisasi**
- Biaya pendaftaran mitra
- Paket membership (Free/Pro/Elite)
- Boost mitra (prioritas tampil)
- Manajemen promo & voucher

---

## 💳 Sistem Pembayaran

### Metode Pembayaran (via Midtrans)
- QRIS
- Virtual Account (BCA, BNI, Mandiri, dll)
- E-wallet (GoPay, OVO, Dana, ShopeePay)
- Cash (untuk kasus tertentu)

### Escrow System
1. Pelanggan bayar → Dana masuk escrow
2. Order dikerjakan
3. Order selesai → Dana release ke saldo mitra (minus komisi)
4. Jika ada komplain → Dana ditahan, admin investigasi

---

## 🔒 Keamanan & Etika

- Terms & Conditions tegas (layanan pijat profesional)
- Panic button untuk mitra
- Tombol laporan untuk pelanggan
- GPS tracking saat order aktif
- Blacklist system
- Verifikasi dokumen ketat
- Audit log untuk admin

---

## 📱 Halaman yang Akan Dibuat

### Public Pages
1. **Landing Page** - Hero, layanan, testimoni, CTA
2. **Login** - Multi-method auth
3. **Register Pelanggan**
4. **Register Mitra**
5. **Kebijakan & Syarat**
6. **About Us**

### Customer Pages
7. **Dashboard Pelanggan**
8. **Browse Layanan**
9. **Detail Layanan**
10. **Booking Flow** (pilih waktu, lokasi, mitra)
11. **Checkout & Payment**
12. **Order Tracking**
13. **Riwayat Order**
14. **Review & Rating**
15. **Profil Pelanggan**
16. **Bantuan**

### Mitra Pages
17. **Dashboard Mitra**
18. **Order Masuk**
19. **Jadwal Kerja**
20. **Pengaturan Layanan**
21. **Wallet & Penarikan**
22. **Laporan Pendapatan**
23. **Profil Mitra**

### Admin Pages
24. **Admin Dashboard**
25. **Manajemen Users**
26. **Verifikasi Mitra**
27. **Manajemen Layanan**
28. **Manajemen Order**
29. **Keuangan & Komisi**
30. **Promo & Membership**
31. **Laporan & Analytics**
32. **Settings**

---

## 🗄️ Struktur Database (Supabase)

### Core Tables
- `profiles` - Data user umum
- `user_roles` - Role management (admin, mitra, customer)
- `mitra_profiles` - Data khusus mitra (dokumen, radius, dll)
- `services` - Jenis layanan pijat
- `bookings` - Order/pemesanan
- `booking_status_logs` - Tracking status
- `payments` - Transaksi pembayaran
- `mitra_wallets` - Saldo mitra
- `withdrawals` - Request penarikan
- `reviews` - Rating & review
- `reports` - Laporan masalah
- `memberships` - Paket membership mitra
- `promos` - Voucher & promo

---

## 🚀 Tahapan Implementasi

### Phase 1: Foundation
- Setup Supabase (database, auth)
- Struktur folder & komponen UI dasar
- Landing page
- Auth system (register, login, logout)
- Role-based routing

### Phase 2: Customer Features
- Browse & detail layanan
- Booking flow (3 langkah)
- Maps integration untuk lokasi
- Midtrans payment integration
- Order tracking real-time
- Riwayat & review

### Phase 3: Mitra Features
- Dashboard mitra
- Registrasi dengan upload dokumen
- Accept/reject order
- Jadwal & ketersediaan
- Wallet & penarikan

### Phase 4: Admin Features
- Admin dashboard
- Verifikasi mitra
- Manajemen order & dispute
- Laporan keuangan
- Settings & konfigurasi

### Phase 5: Advanced Features
- PWA setup (installable)
- Push notifications
- Dynamic pricing
- Membership & boost
- Analytics dashboard

---

## 🎯 Hasil Akhir

Website PWA profesional dengan:
- ✅ 3 Role lengkap (Customer, Mitra, Admin)
- ✅ Booking ≤ 3 langkah
- ✅ Payment gateway Midtrans
- ✅ Real-time tracking
- ✅ Escrow system
- ✅ Maps integration
- ✅ Mobile-first responsive
- ✅ Installable sebagai app
- ✅ Scalable architecture
- ✅ Siap production

