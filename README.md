# SOA Online Store

## Deskripsi
SOA Online Store adalah aplikasi toko online sederhana yang dibangun menggunakan konsep **Service-Oriented Architecture (SOA)**.

Sistem ini terdiri dari beberapa service yang saling berkomunikasi secara langsung menggunakan REST API tanpa menggunakan API Gateway maupun message broker.

---

## Arsitektur Sistem

Aplikasi terdiri dari 3 service utama:

1. **User Service**  
   Mengelola data user

2. **Product Service**  
   Mengelola data produk

3. **Order Service**  
   Mengelola transaksi order dan berkomunikasi dengan User Service dan Product Service

---

## Teknologi yang Digunakan

- Node.js
- Express.js
- REST API
- Postman (untuk testing API)

---

## Cara Menjalankan Aplikasi

Jalankan masing-masing service pada terminal yang berbeda:

### 1. User Service
```bash
cd user-service
node index.js

cd user-service
node index.js

cd product-service
node index.js

cd order-service
node index.js

Endpoint API
User Service (Port 3001)
GET /users → Menampilkan semua user
POST /users → Menambahkan user
Product Service (Port 3002)
GET /products → Menampilkan semua produk
POST /products → Menambahkan produk
Order Service (Port 3003)
GET /orders → Menampilkan semua order
GET /orders/:id → Menampilkan order berdasarkan ID
POST /orders → Membuat order

{
  "name": "Ari",
  "email": "ari@mail.com"
}

{
  "name": "Laptop",
  "price": 7000000,
  "stock": 10
}

{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}

Error Handling

Sistem akan menampilkan error jika:

User tidak ditemukan
Product tidak ditemukan
Data tidak valid

Contoh:

{
  "message": "User not found or User Service unavailable"
}

Dokumentasi API

Link Postman:
https://ariyudawidnyana15-8603012.postman.co/workspace/ariyuda's-Workspace~4492382d-9e83-4f57-8c89-83bac129767b/collection/54136707-5de98933-c84d-4ada-8536-4c1240d3bd28?action=share&creator=54136707

Video Demo

Link Video:
https://drive.google.com/file/d/12DAd4Ay0hspS-Gr5SPz5HNey5_u-AyfH/view?usp=sharing


Repository

GitHub:
https://github.com/Ariyuda11/Project-SOA-Online-Store

Anggota Kelompok:
I Gede Ariyuda Widnyana (1204230013)
Rafi Aditya Rizaldi (1204220035)
muhammad keanu firdaus santoso (1204230124)
ahda ibnu afada (1204202098)

Kesimpulan

Aplikasi ini berhasil mengimplementasikan konsep SOA dengan komunikasi antar service secara langsung menggunakan REST API.
