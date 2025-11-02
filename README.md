# 🎮 AI Quiz Game

## 🧠 Project Title
**AI Quiz Game — Interactive Learning with AI Evaluation**

---

## 📖 Description
AI Quiz Game adalah aplikasi kuis interaktif berbasis web yang memungkinkan pengguna menjawab pertanyaan dan mendapatkan evaluasi otomatis dari kecerdasan buatan (AI).  
Game ini menggabungkan pembelajaran dan hiburan — pemain akan diberi skor dan umpan balik secara langsung berdasarkan kualitas jawaban mereka.

Aplikasi ini dibangun menggunakan **React + TypeScript + TailwindCSS** di sisi frontend dan **Express.js + Replicate API** di sisi backend.  
AI (model IBM Granite via Replicate) menilai jawaban pengguna secara objektif berdasarkan konteks dan kriteria penilaian yang telah ditentukan.

---

## 🧰 Technologies Used

### Frontend
- ⚛ **React 18 + TypeScript** — Framework utama untuk UI interaktif  
- 💨 **Tailwind CSS** — Styling cepat dan responsif  
- ⚡ **Vite** — Build tool modern untuk pengembangan cepat  

### Backend
- 🧩 **Node.js + Express 4** — Server API dan penyaji file statis  
- 🔐 **Dotenv** — Manajemen environment variables  
- 🤖 **Replicate API (IBM Granite 3.3-8B Instruct)** — Model AI evaluator  

---

## 🌟 Features

✅ **AI-Powered Evaluation** — Jawaban pemain dinilai oleh model AI menggunakan prompt terstruktur.  
✅ **Dynamic Scoring System** — Skor dan tingkat akurasi otomatis berdasarkan penilaian AI atau fallback similarity.  
✅ **Interactive Avatar** — Avatar ekspresif dengan animasi (happy, sad, neutral, thinking).  
✅ **Offline Fallback Logic** — Jika AI gagal merespons, sistem tetap menilai berdasarkan kemiripan jawaban.  
✅ **Single Deployment Server** — Backend Express menyajikan frontend sekaligus API.  
✅ **Production Ready** — Siap dideploy ke platform seperti Railway, Render, atau Vercel.  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone repository
```bash
git clone https://github.com/username/quiz-ai.git
cd quiz-ai
````

### 2️⃣ Install dependencies

```bash
pnpm install
```

### 3️⃣ Tambahkan environment variable

Buat file `.env` di root project:

```
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 4️⃣ Build aplikasi untuk production

```bash
pnpm run build
```

### 5️⃣ Jalankan server

```bash
pnpm start
```

Server akan berjalan di:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🤖 AI Support Explanation

Aplikasi ini menggunakan **model AI IBM Granite (via Replicate API)** untuk mengevaluasi jawaban pengguna.

Setiap kali pengguna mengirim jawaban:

1. Frontend mengirim prompt ke endpoint `/api/evaluate`.
2. Backend mengirim permintaan ke Replicate API dengan prompt berisi:

   * Pertanyaan
   * Jawaban ideal
   * Jawaban pengguna
   * Kriteria penilaian (Excellent / Good / Fair / Poor)
3. AI mengembalikan hasil evaluasi seperti:

   ```
   AKURASI: good
   POIN: 17
   FEEDBACK: Jawaban sudah benar sebagian besar!
   ```
4. Jika API gagal (rate limit, token invalid, model nonaktif), backend otomatis menjalankan **fallback similarity** — menghitung kesamaan teks antara jawaban pengguna dan jawaban ideal.

Dengan sistem ini, aplikasi tetap berfungsi penuh **meskipun tanpa koneksi langsung ke model AI**.

---

## 🧑‍💻 Author

- Created by **Leo Prangs Tobing**
- 🎨 For Capstone Project in **Bootcamp: Hacktiv8 x IBM Skillsbuild Code Generation**
- 🌐 [hacktiv8/ibm](https://www.hacktiv8.com/projects/ibm#register)

- [![LinkedIn](https://img.shields.io/badge/LinkedIn-leoptobing-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/leoptobing/)