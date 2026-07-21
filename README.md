# Relay Setting Checker / PROTEKSI PT. PLN UIT JBM — UI v119

UI v119 dibuat dari UI v118 dan mempertahankan perbaikan event GitHub Pages yang telah berhasil pada UI v117.

## File utama

- `index.html`: file utama untuk GitHub Pages.
- `relay-setting-checker-ui-v119-lengkap.html`: salinan identik `index.html`.
- `APPS_SCRIPT_DATABASE_SETTING.gs`: Apps Script lengkap untuk migrasi Google Sheets Database Setting.
- `supabase-setup.sql`: SQL lengkap Supabase.
- `AUDIT_LENGKAP_UI_V119.md`: hasil audit revisi.

## Perubahan UI v119

1. Nilai Excel dibaca dalam dua bentuk:
   - nilai tampilan untuk pengecekan setting dan PDF;
   - nilai mentah untuk menentukan tipe migrasi database.
2. Nilai migrasi diklasifikasikan menjadi `number`, `text`, atau `empty`.
3. Angka bertitik maupun berkoma, misalnya `0.25` dan `0,25`, dikirim sebagai JavaScript Number `0.25`.
4. Teks seperti `Enabled`, `Disabled`, atau `70 V` tetap dikirim sebagai teks jika pengali bernilai `1`.
5. Nilai teks dengan pengali selain `1` ditolak.
6. Apps Script menghitung ulang nilai akhir dan menulis angka dengan `setValue(Number)`.
7. Apps Script membaca ulang cell untuk memastikan nilai numerik tersimpan sebagai tipe Number.
8. Locale Google Sheets tetap menentukan tampilan koma, misalnya nilai internal `0.07` ditampilkan sebagai `0,07`.

Perubahan ini hanya berlaku pada tombol **Simpan ke Database**. Nilai pengecekan setting, perbandingan, selisih, status, tampilan web, riwayat, Generate BA, dan PDF tetap menggunakan nilai asli.

## Deployment GitHub Pages

1. Upload `index.html` UI v119 ke root repository.
2. Pastikan GitHub Pages menggunakan `main` dan `/root`.
3. Tunggu workflow deployment selesai.
4. Buka URL dengan `?v=119` lalu tekan `Ctrl + F5`.
5. Pastikan halaman Login menampilkan `UI v119 | Build 2026.07.22`.

## Deployment Apps Script

Apps Script wajib diperbarui dan deployment Web App lama harus diedit ke **New version**.

1. Buka project Apps Script lama.
2. Ganti seluruh kode dengan `APPS_SCRIPT_DATABASE_SETTING.gs` UI v119.
3. Save.
4. Pilih `Deploy → Manage deployments`.
5. Pilih Web App aktif dan klik Edit.
6. Pilih `New version`.
7. Gunakan `Execute as: Me` dan akses yang sama seperti deployment sebelumnya.
8. Klik Deploy.

Jika deployment lama diedit, URL `/exec` tetap sama.

## Supabase

Tidak perlu menjalankan ulang `supabase-setup.sql`. UI v119 tidak mengubah struktur tabel Supabase.
