# Relay Setting Checker / PROTEKSI PT. PLN UIT JBM — UI v118

## File utama

- `index.html` adalah file utama untuk root repository GitHub Pages.
- `relay-setting-checker-ui-v118-lengkap.html` adalah salinan identik.
- `supabase-setup.sql` tetap lengkap dan tidak berubah dari UI v117.
- `APPS_SCRIPT_DATABASE_SETTING.gs` diperbarui dan harus di-deploy ulang sebagai Web App.

## Perubahan UI v118

UI v118 menggunakan UI v117 sebagai baseline dan menambahkan kolom **Pengali Migrasi Database** pada tabel Pengaturan Pengecekan Setting.

Aturan:

1. Nilai default pengali adalah `1`.
2. Kolom kosong juga dianggap `1`.
3. Pengali hanya digunakan ketika tombol **Simpan ke Database** dijalankan.
4. Pengali tidak memengaruhi pengecekan setting, nilai acuan, selisih, status, rekomendasi, riwayat, hasil web, maupun PDF Berita Acara.
5. Contoh `70 V × 0,001 = 0,07` untuk penyimpanan dalam kV.
6. Contoh `1.250 A × 0,001 = 1,25` untuk penyimpanan dalam kA.
7. Pengali harus berupa angka lebih besar dari `0` dan menerima koma atau titik desimal.
8. Nilai nonnumerik tetap dapat dimigrasikan jika pengali `1`. Nilai nonnumerik dengan pengali selain `1` tidak dikirim dan dilaporkan gagal validasi.
9. Parameter tanpa mapping tetap dilewati dan tidak dianggap gagal.
10. Nilai asli dan pengali dikirim ke Apps Script. Apps Script menghitung ulang nilai akhir sebelum menulis ke Google Sheets.

## Deployment GitHub Pages

1. Ekstrak ZIP.
2. Ganti `index.html` lama di root branch `main` dengan `index.html` UI v118.
3. Pastikan GitHub Pages menggunakan `main` dan `/root`.
4. Setelah workflow deployment hijau, buka URL dengan `?v=118`.
5. Tekan `Ctrl + F5`.
6. Pastikan halaman Login menampilkan `UI v118 | Build 2026.07.21`.

## Deployment Google Apps Script

Apps Script wajib diperbarui karena UI v118 menambahkan validasi dan perhitungan ulang pengali di sisi server.

1. Buka project Apps Script yang digunakan database setting.
2. Ganti seluruh isi script dengan `APPS_SCRIPT_DATABASE_SETTING.gs` UI v118.
3. Simpan.
4. Pilih **Deploy → Manage deployments**.
5. Edit deployment Web App yang aktif.
6. Pilih versi baru dan klik **Deploy**.
7. Pastikan URL `/exec` tetap sama. Jika URL berubah, perbarui pada Pengaturan Menu.

## Supabase

Tidak perlu menjalankan ulang `supabase-setup.sql`. Properti `databaseMigrationMultiplier` disimpan di dalam kolom `payload` pada `setting_references`.
