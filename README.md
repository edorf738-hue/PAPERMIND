# PaperMind

> "Upload dokumen → AI memahami → User bebas bertanya"

---

## Tim Kelompok 1 — Mata Kuliah Kecerdasan Buatan

| No | Nama | NPM |
|----|------|-----|
| 1 | Dhika Adithya | 241111005 |
| 2 | Audy Nur Azzahra | 241111017 |
| 3 | Edo Rizki Firnando | 241111043 |
| 4 | Selpiana | 241111053 |

**Dosen:** Rikky Wisnu Nugraha, S.T., M.Kom., MOS., MCE., MTA.
**Universitas:** Universitas Widyatama

---

## Deskripsi

PaperMind adalah platform web berbasis AI yang memungkinkan pengguna untuk mengupload dokumen dan berdiskusi dengan AI berdasarkan isi dokumen tersebut. AI hanya menjawab berdasarkan isi dokumen yang diupload, sehingga jawaban tetap akurat dan tidak keluar dari konteks.

---

## Fitur Utama

- Upload Dokumen — Support PDF, Word, PowerPoint, Excel, TXT, Markdown
- Document Insight — Topik, kata kunci, penulis, tahun muncul otomatis
- Chat dengan AI — Tanya apa saja seputar isi dokumen
- Citation — Setiap jawaban AI disertai referensi halaman dan paragraf
- Suggested Questions — AI generate pertanyaan otomatis dari dokumen
- Template Aksi — Ringkas, Quiz, Research Gap, Metodologi, Terjemah
- Quiz Interaktif — Pilihan ganda dan essay dengan penilaian AI
- History — Riwayat chat tersimpan per user
- Dark dan Light Mode
- Auth — Login/Register atau langsung pakai tanpa login (guest mode)

---

## Tech Stack

```
Frontend   : React + Vite + Tailwind CSS
Backend    : FastAPI (Python)
AI         : Groq API (llama-3.3-70b-versatile)
Database   : Supabase (PostgreSQL)
Auth       : Supabase Auth
PDF Parser : PyMuPDF + Tesseract OCR
```

---

## Struktur Folder

```
PAPERMIND/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── lib/
│       └── supabase.js
├── public/
└── .env.example
```
## Screenshot

![Demo PaperMind](https://github.com/user-attachments/assets/fa03e2b8-e96b-40cf-b1f6-2cc379c80182)

