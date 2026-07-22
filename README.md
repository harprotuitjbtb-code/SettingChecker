# Relay Setting Checker / PROTEKSI PT. PLN UIT JBM — UI v120

UI v120 menggunakan UI v119 sebagai baseline dan mempertahankan seluruh fitur lama. Perubahan utamanya adalah penambahan identitas Jenis Relai dan Redundansi Relai, serta pencocokan migrasi database berdasarkan tiga kolom terpisah: Gardu Induk, Bay, dan Redundansi.

## File utama

- `index.html`: file utama untuk GitHub Pages.
- `relay-setting-checker-ui-v120-lengkap.html`: salinan identik HTML lengkap.
- `APPS_SCRIPT_DATABASE_SETTING.gs`: Apps Script v120 untuk migrasi strict GI + Bay + Redundansi.
- `supabase-setup.sql`: SQL lengkap Supabase, tidak berubah dan tidak perlu dijalankan ulang untuk v120.
- `AUDIT_LENGKAP_UI_V120.md`: hasil audit syntax dan fungsi kritis.

## Perubahan v120

1. Isian baru pada Pengecekan Setting dan Logic:
   - Jenis Relai;
   - Redundansi Relai: `-`, `LPA`, atau `LPB`.
2. Pilihan awal Jenis Relai: LCD, Distance, Differential, dan OCR.
3. Admin dapat menambah, mengubah, dan menghapus Jenis Relai di Pengaturan Menu.
4. Jenis Relai dan Redundansi disimpan dalam persistensi pemeriksaan dan Riwayat Pemeriksaan.
5. PDF menampilkan Jenis Relai dan Redundansi di atas Merk Relai.
6. PDF tanpa redundansi tetap menampilkan `Redundansi Relai : -`.
7. Nama file PDF memakai suffix ` LPA` atau ` LPB` tanpa tanda hubung tambahan.
8. Migrasi database mencocokkan tiga kolom terpisah secara strict:
   - Gardu Induk;
   - Bay;
   - Redundansi.
9. Posisi ketiga kolom diatur menggunakan huruf kolom Google Sheets, misalnya `D`, `F`, dan `H`.
10. Untuk relai tanpa redundansi, cell kolom Redundansi pada database harus kosong.
11. Tidak ada fallback antara LPA, LPB, dan baris tanpa redundansi.
12. Klasifikasi Number/Text/Empty dan Pengali Migrasi Database dari UI v119 tetap dipertahankan.

## Deployment

### GitHub Pages

Ganti `index.html` di root branch `main`, tunggu deployment selesai, lalu buka URL dengan `?v=120` dan lakukan `Ctrl + F5`.

### Google Apps Script

Apps Script wajib diperbarui dan di-deploy ulang melalui:

`Deploy → Manage deployments → pilih Web App aktif → Edit → New version → Deploy`

Edit deployment lama agar URL `/exec` tetap sama.

### Supabase

Tidak perlu menjalankan ulang `supabase-setup.sql`. Data Jenis Relai dan posisi kolom database tersimpan di payload `app_settings` yang sudah tersedia.
