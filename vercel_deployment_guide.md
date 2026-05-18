# Panduan Deployment HybridMind

Apakah proyek ini bisa di-*upload* ke Vercel?
**Jawabannya: BISA untuk Frontend, tapi TIDAK DISARANKAN untuk Backend.**

Berikut adalah penjelasan arsitekturnya dan panduan langkah demi langkah untuk men-deploy aplikasi ini ke internet.

---

## 🏗️ Mengapa Backend Tidak Cocok di Vercel?

Vercel sangat luar biasa untuk *frontend*, tetapi memiliki keterbatasan teknis untuk *backend* kita:

1. **WebSockets (`/ws/audit`) tidak didukung:** Vercel menggunakan *Serverless Functions* yang bersifat *stateless* dan berumur pendek (hanya beberapa detik). Fitur unggulan kita, yaitu *Live Audit Trail* yang menggunakan koneksi WebSocket *real-time*, **tidak akan berfungsi** di Vercel.
2. **Database Lokal (ChromaDB):** Saat ini kita menggunakan ChromaDB yang menyimpan data vektor secara lokal di folder `./chroma_db`. Di lingkungan *serverless* Vercel, setiap *request* bisa dijalankan di server yang berbeda, dan file lokal akan terhapus (*ephemeral*).

> [!TIP]
> **Arsitektur Deployment Terbaik:**
> - **Frontend (React/Vite):** Deploy ke **Vercel** (Gratis, super cepat, HMR).
> - **Backend (FastAPI):** Deploy ke **Render** atau **Railway** (Mendukung WebSockets dan penyimpanan persisten).

---

## 🚀 Langkah 1: Deploy Frontend ke Vercel

Vercel adalah rumah terbaik untuk proyek React + Vite kita.

### Persiapan Repo
Pastikan Anda sudah memisahkan *base URL* backend di `App.tsx` menjadi variabel lingkungan (environment variable) agar dinamis, bukan *hardcoded* `localhost:8000`.
Contoh perubahan di `App.tsx`:
```javascript
// Dari:
const ws = new WebSocket("ws://localhost:8000/ws/audit");
const response = await fetch("http://localhost:8000/chat", ...);

// Menjadi:
const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/audit";
const ws = new WebSocket(wsUrl);

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/chat";
const response = await fetch(apiUrl, ...);
```

### Cara Deploy (via Dashboard Vercel)
1. Buat akun / Login ke [Vercel.com](https://vercel.com).
2. Klik **"Add New..."** > **"Project"**.
3. Hubungkan akun GitHub Anda dan pilih repositori `Onus-HybridMind`.
4. Pada bagian **Framework Preset**, Vercel akan otomatis mendeteksi **Vite**.
5. Pada bagian **Root Directory**, klik Edit dan pilih folder `frontend`.
6. Klik **Deploy**.
7. Dalam waktu kurang dari 1 menit, UI HybridMind Anda sudah *live* di internet!

---

## 🚄 Langkah 2: Deploy Backend ke Render / Railway

Untuk menjalankan FastAPI, WebSockets, dan LlamaIndex, Anda membutuhkan server yang berjalan terus-menerus (*long-running process*). **Render.com** menyediakan paket gratis yang cocok untuk ini.

### Cara Deploy (via Render)
1. Buat akun / Login ke [Render.com](https://render.com).
2. Klik **"New +"** dan pilih **"Web Service"**.
3. Hubungkan akun GitHub Anda dan pilih repositori `Onus-HybridMind`.
4. Isi konfigurasi berikut:
   - **Name:** hybridmind-api
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Buka bagian **Environment Variables** dan tambahkan rahasia Anda:
   - `GOOGLE_API_KEY` = `isi_api_key_gemini_anda`
   - `SUPABASE_DB_URL` = `isi_url_supabase_anda`
6. Pilih instance **Free** dan klik **Create Web Service**.

> [!WARNING]
> Render *Free tier* akan "tertidur" (*spin down*) jika tidak ada aktivitas selama 15 menit. Request pertama setelah tertidur akan memakan waktu 30-60 detik untuk pemanasan. Untuk presentasi *hackathon*, pastikan Anda memancing servernya terlebih dahulu sesaat sebelum demo!

---

## 🔗 Langkah 3: Menghubungkan Keduanya

Setelah Backend selesai di-deploy di Render, Anda akan mendapatkan URL publik, misalnya: `https://hybridmind-api.onrender.com`.

1. Kembali ke Dashboard Vercel Anda.
2. Buka proyek Frontend Anda > **Settings** > **Environment Variables**.
3. Tambahkan dua variabel berikut:
   - Key: `VITE_API_URL` | Value: `https://hybridmind-api.onrender.com/chat`
   - Key: `VITE_WS_URL` | Value: `wss://hybridmind-api.onrender.com/ws/audit` *(Perhatikan penggunaan `wss://` bukan `ws://` untuk keamanan)*
4. Simpan, lalu lakukan **Redeploy** pada frontend Anda di Vercel.

**Selesai!** Proyek *Enterprise* Anda sekarang sepenuhnya *live* dan siap didemokan ke seluruh dunia.
