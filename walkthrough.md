# Walkthrough: Integrasi AI Agent & Frontend

Semua perubahan kode untuk menyambungkan AI Agent dengan Web UI Anda telah berhasil saya implementasikan! Berikut adalah rangkuman dari apa yang telah dikerjakan dan panduan cara mengujinya.

## Apa Saja yang Berubah?

### 1. Migrasi ke FastAPI (Backend)
- File baru `backend/main.py` dan `backend/agent.py` telah dibuat.
- Mengganti alur kaku `workflow.py` dengan arsitektur **ReAct Agent** (Reasoning and Acting) dari LlamaIndex.
- Agen kini memiliki 2 alat (Tools):
  1. `sql_procurement_tool`: Agen bisa menerjemahkan bahasa natural Anda menjadi perintah SQL secara mandiri untuk mengecek Supabase.
  2. `contract_terms_tool`: Agen bisa mencari referensi aturan di dalam PDF via ChromaDB.

### 2. Live Audit via WebSockets
- FastAPI kini menyediakan jalur komunikasi dua arah di alamat `ws://localhost:8000/ws/audit`.
- Setiap kali agen berpikir (menghubungi LLM Gemini) atau menggunakan alat (misalnya, sukses membaca SQL atau membaca kontrak), proses tersebut akan dipancarkan (broadcast) langsung ke *Live Audit Trail*.

### 3. Pembaruan React UI (Frontend)
- `App.tsx` telah dirombak.
- *Chatbox* (kolom input) di kiri bawah layar kini benar-benar berfungsi dan akan mengirimkan teks Anda ke Backend FastAPI (`http://localhost:8000/chat`).
- *Live Audit Trail* di panel kanan kini kosong di awal dan akan terisi **secara langsung (real-time)** dengan log aktivitas dari *Agent* di Backend ketika Anda sedang chatting.

---

## Cara Menjalankan Sistem Penuh

Anda perlu menjalankan dua server berbeda secara bersamaan:

### Langkah 1: Jalankan Backend (Terminal 1)
Buka terminal baru, pindah ke folder backend, dan jalankan server FastAPI menggunakan `uvicorn`.
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
> [!NOTE]  
> Jika muncul pesan `Uvicorn running on http://127.0.0.1:8000`, berarti backend Anda sudah siap menerima pesan dari frontend.

### Langkah 2: Jalankan Frontend (Terminal 2)
Buka terminal baru lainnya, masuk ke folder frontend, dan jalankan server Vite (React).
```bash
cd frontend
npm run dev
```

### Langkah 3: Uji Coba Chat
Buka browser dan masuk ke URL Vite (biasanya `http://localhost:5173`). Di kolom input chat kiri bawah, cobalah mengirim pesan ini:
> *"Coba cari tahu berapa banyak barang yang sudah kita beli dari Apex Chemicals di database, lalu cocokkan dengan aturan diskon volumenya di dokumen kontrak."*

Perhatikan layar Anda! Di bagian panel kanan (*Live Audit*), Anda akan melihat teks yang muncul seiring dengan AI yang sedang bekerja memanggil alat SQL lalu memanggil alat ChromaDB sebelum ia akhirnya membalas Anda di panel kiri.
