# PaperMind

"Upload dokumen → AI memahami → User bebas bertanya"

---

TIM KELOMPOK 1

Dhika Adithya         - 241111005
Audy Nur Azzahra      - 241111017
Edo Rizki Firnando    - 241111043
Selpiana              - 241111053

Mata Kuliah  : Kecerdasan Buatan
Dosen        : Rikky Wisnu Nugraha, S.T., M.Kom., MOS., MCE., MTA.
Universitas  : Universitas Widyatama

---

PaperMind adalah platform web berbasis AI yang memungkinkan pengguna 
untuk mengupload dokumen dan berdiskusi dengan AI berdasarkan isi 
dokumen tersebut. AI hanya menjawab berdasarkan isi dokumen yang 
diupload, sehingga jawaban tetap akurat dan tidak keluar dari konteks.
Dibangun sebagai tugas mata kuliah Kecerdasan Buatan.

---

FITUR UTAMA

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

TECH STACK

Frontend   : React + Vite + Tailwind CSS
Backend    : FastAPI (Python)
AI         : Groq API (llama-3.3-70b-versatile)
Database   : Supabase (PostgreSQL)
Auth       : Supabase Auth
PDF Parser : PyMuPDF + Tesseract OCR

---

STRUKTUR FOLDER

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
