# Panduan Deployment HybridMind (Tanpa GitHub)

Karena Anda tidak memiliki akses ke repositori GitHub utama, cara terbaik untuk men-deploy aplikasi ini adalah menggunakan **Command Line Interface (CLI)**. Cara ini memungkinkan Anda mengunggah kode langsung dari komputer Anda ke server cloud tanpa perlu menghubungkannya dengan GitHub.

Berikut adalah arsitektur deployment kita:
- **Frontend (React/Vite):** Deploy ke **Vercel** via `Vercel CLI`.
- **Backend (FastAPI):** Deploy ke **Railway** via `Railway CLI` (Karena Vercel tidak mendukung WebSockets dan penyimpanan lokal untuk ChromaDB).

---

## 🚀 Langkah 1: Deploy Frontend ke Vercel (via CLI)

Pastikan Anda sudah login ke terminal Vercel sebelumnya (seperti yang baru saja Anda lakukan).

### 1. Persiapan Kode
Pastikan *base URL* backend di `App.tsx` sudah menggunakan *environment variable* (sudah kita lakukan sebelumnya):
```javascript
const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/audit";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/chat";
```

### 2. Deploy via Terminal
Buka terminal di VS Code, masuk ke folder `frontend`, dan jalankan perintah:
```bash
cd frontend
vercel
```
Jawab beberapa pertanyaan (*default* cukup tekan Enter). Dalam waktu kurang dari semenit, Vercel akan memberikan URL publik Anda (contoh: `https://onus-hybridmind.vercel.app`).

*(Frontend sudah selesai!)*

---

## 🚄 Langkah 2: Deploy Backend ke Railway (via CLI)

Untuk backend, kita menggunakan **Railway**. Railway sangat mirip dengan Vercel tapi didesain untuk *backend* yang berjalan terus menerus (*long-running*) dan mendukung WebSockets.

### 1. Install Railway CLI
Buka terminal baru, dan jalankan perintah ini untuk menginstal Railway CLI:
```bash
npm i -g @railway/cli
```

### 2. Login ke Railway
Jalankan perintah ini untuk login (akan membuka browser):
```bash
railway login
```
*(Jika Anda belum punya akun, buat dulu di [railway.app](https://railway.app) menggunakan akun GitHub atau Email Anda).*

### 3. Inisialisasi Proyek
Masuk ke folder `backend` Anda:
```bash
cd backend
```
Lalu buat proyek baru di Railway dengan perintah:
```bash
railway init
```
Beri nama proyek Anda (misal: `hybridmind-backend`).

### 4. Atur Environment Variables
Sebelum kode diunggah, kita perlu memasukkan API Key ke server Railway. Jalankan:
```bash
railway variables set GOOGLE_API_KEY="isi_api_key_gemini_anda"
railway variables set SUPABASE_DB_URL="isi_url_supabase_anda"
```

### 5. Deploy Kode Backend
Sekarang, unggah kode komputer Anda langsung ke server Railway:
```bash
railway up
```
Tunggu beberapa menit hingga proses *build* selesai. Railway akan mendeteksi `requirements.txt` dan `main.py` (FastAPI) secara otomatis.

### 6. Dapatkan URL Publik API Anda
Jalankan perintah ini untuk membuatkan URL publik (domain) gratis untuk backend Anda:
```bash
railway domain
```
Anda akan mendapatkan URL seperti: `https://hybridmind-backend-production.up.railway.app`

---

## 🔗 Langkah 3: Menghubungkan Keduanya

Sekarang kita punya URL Backend, mari hubungkan ke Frontend Vercel kita.

1. Buka [Dashboard Vercel](https://vercel.com) di browser Anda.
2. Buka proyek `onus-hybridmind` yang tadi Anda deploy.
3. Masuk ke tab **Settings** > **Environment Variables**.
4. Tambahkan dua variabel berikut:
   - Key: `VITE_API_URL` | Value: `https://hybridmind-backend-production.up.railway.app/chat`
   - Key: `VITE_WS_URL` | Value: `wss://hybridmind-backend-production.up.railway.app/ws/audit` *(Wajib pakai `wss://` bukan `ws://`)*
5. Simpan variabel tersebut.
6. Masuk ke tab **Deployments** di Vercel, klik titik tiga (`...`) pada deployment terbaru Anda, lalu pilih **Redeploy**.

**Selesai!** Proyek HybridMind Anda sekarang sudah sepenuhnya ter-deploy di Vercel (Frontend) dan Railway (Backend) tanpa menggunakan GitHub sama sekali!
