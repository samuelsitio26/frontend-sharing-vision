# Frontend Sharing Vision - Article Dashboard

Dashboard artikel untuk Test Frontend Sharing Vision, dibuat dengan **React (Vite)** dan **React Router**. Aplikasi ini memakai REST API dari repository backend:
https://github.com/samuelsitio26/backend-sharing-vision

## Fitur (sesuai soal)

**Dashboard**

1. **All Posts**: tab **Published**, **Drafts**, dan **Trashed**. Setiap tab menampilkan tabel berisi title, category, dan action (ikon edit dan ikon trash).
   - Ikon **edit** membuka halaman Edit Article. Title, content, dan category bisa diubah, dengan tombol **Publish** dan **Draft**.
   - Ikon **trash** memindahkan artikel ke tab Trashed. Di tab Trashed, ikon trash menghapus artikel secara permanen (dengan konfirmasi).
2. **Add New**: form berisi Title, Content, dan Category dengan tombol **Publish** dan **Draft**.
3. **Preview**: menampilkan artikel berstatus Publish dalam bentuk blog, dengan pagination (4 artikel per halaman).

Validasi di form mengikuti aturan backend: title minimal 20 karakter, content minimal 200 karakter, category minimal 3 karakter.

## Teknologi

- React 19 dan Vite
- React Router (`react-router-dom`)
- Fetch API untuk memanggil backend

## Prasyarat

1. [Node.js](https://nodejs.org/) versi 20.19 atau lebih baru (cek dengan `node -v`)
2. Backend sudah berjalan di `http://localhost:8080` (lihat README repository backend)

## Cara Menjalankan

```bash
git clone https://github.com/samuelsitio26/frontend-sharing-vision.git
cd frontend-sharing-vision
npm install
npm run dev
```

Buka alamat yang muncul di terminal, biasanya `http://localhost:5173`.

Urutan yang disarankan:

1. Nyalakan MySQL (misalnya lewat Laragon) dan pastikan database `article` sudah dibuat.
2. Jalankan backend (`go run main.go`).
3. Jalankan frontend (`npm run dev`).

### Mengubah alamat backend

Secara default frontend memanggil `http://localhost:8080`. Untuk mengubahnya, buat file `.env` di folder utama project:

```
VITE_API_URL=http://alamat-backend-kamu
```

Restart `npm run dev` setelah mengubah `.env`.

### Build untuk produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/`.

## Struktur Project

```
src
├── api.js              # fungsi pemanggilan API backend
├── App.jsx             # layout menu dan daftar halaman
├── main.jsx            # pintu masuk aplikasi, memasang router
├── index.css           # tampilan
├── components
│   └── Icons.jsx       # ikon edit dan trash
└── pages
    ├── AllPosts.jsx    # tab, tabel, edit, trash
    ├── PostForm.jsx    # form Add New dan Edit
    └── Preview.jsx     # tampilan blog dan pagination
```

## Halaman dan Alamat

| Alamat | Halaman |
|---|---|
| `/posts` | All Posts (tab Published, Drafts, Trashed) |
| `/posts/new` | Add New |
| `/posts/:id/edit` | Edit Article |
| `/preview` | Preview blog dengan pagination |

## Catatan

- Jika backend tidak berjalan, halaman menampilkan pesan "Tidak bisa terhubung ke server".
- Project ini dibuat dengan bantuan AI sebagai alat bantu belajar dan penulisan kode, lalu diuji sendiri bersama backend.