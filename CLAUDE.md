# PaperMind — Project Context

Web app untuk upload dan chat dengan dokumen penelitian menggunakan AI.

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + React Router v7
- **Backend**: FastAPI (Python) + uvicorn, jalan lokal di `http://localhost:8000`
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: Groq API — llama-3.3-70b-versatile (analisis & chat)

## Cara Jalankan

```bash
# Backend (dari folder backend/)
cd backend
python -m uvicorn main:app --reload

# Frontend (dari root)
npm run dev
```

## Env Variables

### Frontend (`/.env`)
```
VITE_N8N_UPLOAD_WEBHOOK=http://localhost:8000/upload
VITE_N8N_CHAT_WEBHOOK=http://localhost:8000/chat
VITE_SUPABASE_URL=https://bngelbndymurjwjscdkh.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

### Backend (`/backend/.env`)
```
SUPABASE_URL=https://bngelbndymurjwjscdkh.supabase.co
SUPABASE_SERVICE_KEY=<service_role key>
GROQ_API_KEY=<groq key>
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
```

## Struktur Folder Penting

```
PaperMind/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── requirements.txt
│   └── .env             # JANGAN dicommit
├── src/
│   ├── pages/
│   │   ├── Workspace.jsx   # Halaman utama, semua state ada di sini
│   │   ├── Auth.jsx        # Login + Register (tab toggle)
│   │   └── History.jsx     # Halaman riwayat sesi
│   ├── components/
│   │   ├── Sidebar.jsx     # Sidebar (collapsed = icon strip 52px, expanded = full)
│   │   ├── Topbar.jsx      # Header (logo, theme, export, new session) — NO hamburger
│   │   ├── ChatArea.jsx    # Area chat dengan ReactMarkdown
│   │   ├── InputArea.jsx   # Input pesan
│   │   ├── UploadZone.jsx  # Drag & drop upload
│   │   └── DocumentInsight.jsx
│   ├── context/
│   │   ├── AuthContext.jsx  # Supabase auth — email/password di-trim() sebelum dikirim
│   │   └── ThemeContext.jsx # Dark/light mode
│   └── lib/
│       └── supabase.js     # createClient dengan anon key
└── CLAUDE.md
```

## Backend Endpoints

| Method | Path | Fungsi |
|---|---|---|
| GET | /health | Cek status server |
| POST | /upload | Upload + ekstrak + analisis dokumen, terima `user_id` dari form |
| POST | /chat | Chat dengan AI berdasarkan dokumen sesi |
| GET | /session/{id} | Ambil dokumen + riwayat chat satu sesi |
| DELETE | /session/{id} | Hapus sesi + chat history dari Supabase |
| GET | /sessions?user_id= | Ambil semua sesi milik satu user |

## Supabase Schema

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  document_text text,
  metadata jsonb,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL,  -- 'user' atau 'assistant'
  content text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.chat_history TO service_role;
```

## Fitur yang Sudah Jalan

- [x] Upload dokumen multi-format: PDF, Word (.docx/.doc), PowerPoint (.pptx/.ppt), Excel (.xlsx/.xls), TXT, Markdown (.md)
- [x] OCR untuk PDF image-based (Tesseract — fallback ind+eng → eng)
- [x] Logging OCR di terminal backend (lihat apakah OCR dipanggil)
- [x] Analisis dokumen otomatis (judul, topik, penulis, tahun, suggested questions)
- [x] Chat AI dengan context dokumen + riwayat percakapan
- [x] Smart truncation dokumen: ≤40k karakter kirim semua, >40k → head 28k + tail 12k
- [x] Simpan sesi ke Supabase, restore dari history
- [x] Auth login/register via Supabase (email/password di-trim)
- [x] Dark/light mode
- [x] Sidebar collapsible: collapsed = icon strip 52px, expanded = full width
- [x] Sidebar resizable (drag kanan-kiri, min 180px max 480px)
- [x] Toggle button sidebar ADA DI DALAM sidebar (bukan di header)
- [x] Render markdown di chat AI (via react-markdown)
- [x] Export PDF (window.print)
- [x] Riwayat lokal di localStorage — untuk guest
- [x] Hapus riwayat (hapus dari Supabase + localStorage, konfirmasi inline)
- [x] History per-user: login → fetch dari Supabase; guest → localStorage
- [x] Template sidebar: Ringkas, Quiz (dialog), Gap, Metode, Kelebihan & Kekurangan, Terjemah
- [x] Quiz dialog: pilih jumlah soal (5/10/20), tipe (pilgan/essay/keduanya), toggle jawaban
- [x] Support format lama: .xls (via xlrd<2.0), .doc/.ppt (via python-docx/pptx, fallback error jika binary Word 97-2003)
- [x] Friendly rate limit error: parse pesan Groq 429 → tampilkan limit/used/retry dalam Bahasa Indonesia

## Logika History (User vs Guest)

| Kondisi | Sumber history | Disimpan di |
|---|---|---|
| Login | Supabase (`GET /sessions?user_id=`) | Supabase (permanent) |
| Guest | localStorage | Browser (hilang kalau clear storage) |

## Template Sidebar

| Label | Behavior |
|---|---|
| Ringkas | Langsung kirim ke AI |
| Quiz | Buka dialog (jumlah, tipe, toggle jawaban) |
| Gap | Langsung kirim ke AI |
| Metode | Langsung kirim ke AI |
| Kelebihan & Kekurangan | Langsung kirim ke AI |
| Terjemah | Langsung kirim ke AI |

- Template disable (abu-abu) kalau belum ada dokumen diupload
- `onSendTemplate` di Workspace = `handleSend` langsung (bypass input field)

## Hal Penting / Catatan Teknis

- **Resize handle** ada di `Workspace.jsx` sebagai `<div>` sibling antara `<Sidebar>` dan `<main>` — JANGAN dipindah ke dalam `<aside>` karena overflow-hidden memblokir drag events
- **VITE_N8N_UPLOAD_WEBHOOK** dan **VITE_N8N_CHAT_WEBHOOK** namanya mengandung "N8N" tapi sudah diarahkan ke backend FastAPI lokal
- **Tesseract OCR** perlu diinstall terpisah di Windows: https://github.com/UB-Mannheim/tesseract/wiki
- Backend menggunakan `service_role` key (bukan anon key) agar bisa bypass RLS Supabase
- `parse_json_from_ai()` di backend menangani respons AI yang tidak bersih JSON
- **Chat model**: llama-3.3-70b-versatile (bukan 8b-instant — terlalu kecil, sering abaikan system prompt)
- **History filter**: chat_history yang mengandung "tidak dapat membuka/mengakses" difilter sebelum dikirim ke AI (mencegah kontaminasi)
- **Email Confirmation Supabase**: pastikan di-OFF di dashboard — Authentication → Providers → Email
- **Format lama (.doc/.ppt)**: python-docx/pptx bisa baca format XML (Word/PPT 2007+). Format binary Word 97-2003 tidak didukung — user diminta convert ke .docx/.pptx
- **xlrd**: harus pakai versi `<2.0` karena xlrd 2.x menghapus support .xls. Install: `pip install "xlrd<2.0"`
- **Rate limit Groq**: `parse_rate_limit_error()` di backend parse error 429 dan return pesan ramah (limit/used/retry)
