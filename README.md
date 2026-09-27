Letakkan file MP4 Anda di folder ini dengan nama `hero.mp4` sehingga path menjadi `assets/hero.mp4`.

Atau ubah sumber video di file `index.html` (elemen `<video>`) ke path lain jika Anda ingin menggunakan nama berbeda.

Catatan penting:
- Jika video diambil dari server lain (URL eksternal), browser dapat memblokir pembacaan pixel (sampling) karena CORS. Untuk agar warna otomatis berubah, video harus di-host di domain yang sama atau melayani header CORS yang mengizinkan pembacaan.
- Untuk pengujian lokal cepat, jalankan server HTTP sederhana di folder proyek:

```bash
# Python 3
python -m http.server 8000

# lalu buka http://localhost:8000/ di browser
```

- Jika file terlalu besar, pertimbangkan untuk meng-encode ulang dengan bitrate lebih rendah untuk mempercepat loading.
