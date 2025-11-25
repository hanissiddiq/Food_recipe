# Food_recipe
# 🍲 Aplikasi **Kumpulan Resep Masakan Nusantara**

**Frontend:** Next.js 16\
**Backend API:** Laravel 12

Project ini merupakan aplikasi pengelolaan resep masakan Nusantara
dengan fitur CRUD (Create, Read, Update, Delete).\
Frontend dibangun menggunakan Next.js 16, sementara backend menggunakan
Laravel 12 sebagai penyedia API.

------------------------------------------------------------------------

## 📁 Struktur Project

    /food_recipe_frontend   → Next.js 16 (UI/UX)
    /food_recipe_backend    → Laravel 12 (REST API)

------------------------------------------------------------------------

# 🚀 Cara Menjalankan Project

## 1. ▶️ Menjalankan Frontend (Next.js 16)

    cd food_recipe_frontend
    npm install
    npm run dev

Akses:

    http://localhost:3000

------------------------------------------------------------------------

## 2. 🛠️ Menjalankan Backend API (Laravel 12)

    cd food_recipe_backend
    composer install

### Buat database:

    db_food_recipe

### Jalankan migrasi & seeder:

    php artisan migrate
    php artisan db:seed
    php artisan serve

Akses backend:

    http://localhost:8000

------------------------------------------------------------------------

# 📡 Dokumentasi API

## GET Semua Resep

    GET http://localhost:8000/api/recipes

## GET Detail Resep

    GET http://localhost:8000/api/recipes/{id}

## POST Create Resep

    POST http://localhost:8000/api/recipes

Body:

``` json
{
  "title": "Kue Alakadar",
  "ingredients": "Tepung Maizena, Telur, Terigu",
  "steps": "Larutkan Tepung Maizena, Campurkan Tepung Terigu & Tambahkan telur",
  "image": null
}
```

## PUT Update Resep

    PUT http://localhost:8000/api/recipes/{id}

## DELETE Hapus Resep

    DELETE http://localhost:8000/api/recipes/{id}

------------------------------------------------------------------------

# 🎨 Fitur

-   CRUD resep masakan\
-   Upload gambar\
-   UI modern Next.js\
-   REST API Laravel\
-   Database MySQL

------------------------------------------------------------------------

# ❤️ Kontribusi

Silakan buat pull request atau issue jika menemukan bug.

------------------------------------------------------------------------

# 📜 Lisensi

MIT License

<hr>
<img width="1918" height="1041" alt="Image" src="https://github.com/user-attachments/assets/c3a20093-5cf9-4930-b360-9bad37092189" />

<img width="1920" height="1036" alt="Image" src="https://github.com/user-attachments/assets/90f08630-0ff5-482c-88b7-9fca7eecdc6a" />

<img width="1918" height="1042" alt="Image" src="https://github.com/user-attachments/assets/b6ee85dc-404c-442d-9e89-364b031968ee" />

<img width="404" height="857" alt="Image" src="https://github.com/user-attachments/assets/87dfb73f-f05b-4781-aa76-3271c43dd79c" />

<img width="397" height="852" alt="Image" src="https://github.com/user-attachments/assets/dc51f4c4-f5ab-4dca-ad13-f300964a04c8" />

<img width="396" height="853" alt="Image" src="https://github.com/user-attachments/assets/4bf4dc6c-3609-4b17-b161-1245130e4c41" />

<img width="398" height="853" alt="Image" src="https://github.com/user-attachments/assets/7f8a7975-22c9-428a-a685-5b9038223cbd" />
