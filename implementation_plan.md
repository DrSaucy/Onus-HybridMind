# Integrasi Frontend dan Backend untuk Agen AI Dinamis

Dokumen ini menjelaskan rancangan arsitektur untuk mengubah *Proof of Concept* (PoC) AI Agent yang saat ini bersifat statis, menjadi agen percakapan sesungguhnya (seperti Gemini/ChatGPT) yang terhubung ke Frontend Anda dengan fitur *Live Audit*.

## Menjawab Pertanyaan Anda

**1. Apakah data yang diambil sudah dari SQL atau masih statis?**
Saat ini, data yang diambil **masih 100% statis/dummy**. Pada file `backend/sql_tool.py`, teman Anda baru membuat `MockSQLEngine` yang selalu mengembalikan teks: *"Total quantity is 12000 and total paid is $1,200,000"*. Walaupun file `setup_postgres.py` sudah berhasil menanam data ke database Supabase, agen AI saat ini belum benar-benar membaca database tersebut.

**2. Bagaimana cara agar agen bisa diajak mengobrol dan terintegrasi dengan Frontend?**
Untuk mencapai hal ini, kita harus merombak arsitektur dari yang awalnya **"Hardcoded Workflow"** menjadi **"ReAct Agent (Reasoning and Acting)"**, dan menjembatani komunikasi dengan Frontend menggunakan **FastAPI**.

---

## Rencana Arsitektur & Perubahan

### Tahap 1: Membangun API Backend (FastAPI)
Frontend (React) tidak bisa memanggil file Python secara langsung. Kita membutuhkan server perantara.
* **REST API (`/chat`)**: Endpoint untuk menerima pesan dari pengguna dan mengembalikan balasan dari AI.
* **WebSocket (`/ws/audit`)**: Endpoint *real-time* agar Backend bisa mengirim log aktivitas agen ("Agen sedang mencari di SQL", "Agen membaca PDF") secara langsung ke fitur *Live Audit* di Frontend tanpa harus menunggu balasan selesai.

### Tahap 2: Menghidupkan Integrasi SQL Asli
Kita akan menghapus `MockSQLEngine` di `sql_tool.py` dan menggantinya dengan `NLSQLTableQueryEngine` dari LlamaIndex. 
* LlamaIndex akan terhubung ke PostgreSQL Supabase Anda menggunakan *URL Connection String*.
* AI akan bisa menerjemahkan pertanyaan bahasa natural pengguna (misal: "Berapa total pengeluaran untuk vendor A?") menjadi kueri SQL sungguhan secara otomatis.

### Tahap 3: Mengubah Workflow menjadi "ReAct Agent"
File `workflow.py` saat ini kaku (hanya bisa mengecek diskon Q1). Kita akan menggantinya menjadi agen dinamis menggunakan `FunctionCallingAgent` atau `ReActAgent` dari LlamaIndex.
* **Konsep *Tools***: Kita akan membekali agen dengan dua *alat* (Tools):
  1. `query_database_tool` (Terhubung ke SQL)
  2. `query_contract_tool` (Terhubung ke ChromaDB)
* **Cara Kerja Baru**: Saat pengguna bertanya di *roomchat*, AI akan **berpikir sendiri** alat mana yang harus dipakai. Jika ditanya soal transaksi, ia pakai alat SQL. Jika ditanya soal aturan/kontrak, ia pakai alat ChromaDB. Jika disuruh membandingkan (seperti mencari *discrepancy*), ia akan memakai keduanya lalu menyimpulkan hasilnya ke pengguna.

## User Review Required

> [!IMPORTANT]  
> Apakah Anda setuju dengan pendekatan arsitektur ini? Jika disetujui, kita bisa mulai mengerjakannya secara bertahap, dimulai dari mengubah `sql_tool.py` menjadi SQL asli, mengonversi Workflow menjadi ReAct Agent, lalu membuat server FastAPI untuk disambungkan ke Frontend React Anda.
