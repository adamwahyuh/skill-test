# Install
Clone Repo
```
git clone https://github.com/adamwahyuh/skill-test
```

Using docker
```bash
docker-compose up --build -d
```

Open in
```
http://127.0.0.1:3000/
```

# App Shell
```bash
docker exec -it adam_skill_test_app sh
```
Run Test
```bash
npm run test
```

# Schema
- Duplikat Data : Sesuai dengan instruksi brief, endpoint bulk ingest wajib bersifat idempoten. Saya mendefinisikan sebuah artikel sebagai "duplikat" jika memiliki URL yang sama. Dengan menerapkan constraint UNIQUE pada kolom url

- Tipe data : Saya membuat rancangan tipe data sangat diperketat, karena data yang disediakan (seed_mentions) sangat bervariatif seperti engagement berupa angka dan juga ada yang berupa string "123" maka dari itu saya menggunakan tipe data integer untuk menyamakan semua row, dan ini memaksa aplikasi harus menormalisasi datanya terlebih dahulu sebelum insert ke database.

- content : Saya merancang kolom content ini menggunakan tipe data 'text' untuk menyimpan data yang sangat banyak dan secara utuh apa adanya, karena di sana juga bisa memasukan tag-tag html ataupun fungsi dari javascript. jadi aplikasi harus mesanitasi/mensterilkan data terlebih dahulu agar tidak terkena XSS.

# Rule Duplicate
- Saya mendefinisikan sebuah data sebagai duplikat jika memiliki URL (url) yang sama persis.
### why
Karena jika sama urlnya berarti mengacu kepada data yang sama, judul artikel bisa saja direvisi oleh editor, dan angka engagement pasti terus berubah seiring waktu, tetapi URL artikel tersebut umumnya tetap permanen.

# Assumtion brief unclear
- Sanitasi HTML: Brief menyebutkan adanya raw HTML dan injeksi skrip seperti <script>alert(1)</script> di dalam konten. Saya berasumsi bahwa service backend ini murni difungsikan sebagai sistem penyimpanan dan pencarian data mentah. Tanggung jawab untuk melakukan sanitasi HTML (mencegah XSS) diserahkan kepada layer frontend atau analis yang merender data tersebut
- Fotmat Datetime : Terdapat beberapa macam varian format datetime di seed_mentions.json, dan tidak ada ketentuan format apa yang wajib dipakai jadi saya memakai format "YYYY-MM-DD"

# Trade off
- Mengabaikan Pembaruan Data (ON CONFLICT DO NOTHING): Saat mendeteksi URL duplikat pada bulk ingest, saya memilih untuk mengabaikan baris tersebut secara keseluruhan daripada melakukan pembaruan. Alasan: Meskipun ini berarti kita kehilangan data engagement terbaru jika artikel yang sama ditarik ulang, saya memprioritaskan kecepatan insert masal dan jaminan mutlak untuk syarat idempotensi sesuai brief

# Time Spent

Setidaknya saya menghabiskan waktu 8 jam an untuk mengerjakan semua ini, lebih cepat karena dibantu ai untuk brainsroming dan mencari jalan keluar jika saya bertemu dengan deadend.

- Sesi 1 (3 jam) memahami dan memikirkan aplikasi ini dibangun dengan stack apa, dan bagaimana struktur-struktur aplikasi
- Sesi 2 (1 jam) menginisiasikan/setup applikasi, seperti konfigurasi nodejs, ts, database
- Sesi 3 (4 jam) developing app sampai selesai

# Rencana kedepannya
- Memperketat keamanan aplikasi, seperti menerapkan authentikasi
- Membuat tampilan frontend
- Improvement Testing Aplikasi