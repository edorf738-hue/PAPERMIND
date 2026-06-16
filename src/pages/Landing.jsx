import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Upload PDF',
    desc: 'Drag & drop dokumen penelitian kamu. Mendukung semua format jurnal dan thesis.',
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Analisis Otomatis',
    desc: 'AI langsung menganalisis topik, kata kunci, metodologi, dan struktur dokumen.',
    color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Chat dengan AI',
    desc: 'Ajukan pertanyaan apa saja — ringkasan, metodologi, quiz, atau analisis SWOT.',
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Kutipan Akurat',
    desc: 'Setiap jawaban dilengkapi referensi halaman dan paragraf dari dokumen asli.',
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950',
  },
]

const STEPS = [
  { n: '01', title: 'Upload Dokumen', desc: 'Upload PDF jurnal, thesis, atau laporan penelitian kamu.' },
  { n: '02', title: 'AI Menganalisis', desc: 'PaperMind memproses dan memahami seluruh isi dokumen secara otomatis.' },
  { n: '03', title: 'Mulai Berdiskusi', desc: 'Ajukan pertanyaan apa saja dan dapatkan jawaban dengan kutipan akurat.' },
]

function WorkspaceMockup() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200 dark:shadow-slate-900 overflow-hidden">
      {/* Topbar */}
      <div className="h-9 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-3">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
            <div className="w-1.5 h-2 border border-white rounded-sm" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">PaperMind</span>
          <span className="text-[8px] px-1 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-500 border border-blue-100 dark:border-blue-800">Beta</span>
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-14 rounded bg-slate-100 dark:bg-slate-700" />
          <div className="h-5 w-16 rounded bg-blue-600" />
        </div>
      </div>
      {/* Body */}
      <div className="flex h-56">
        {/* Sidebar mock */}
        <div className="w-28 border-r border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 space-y-2">
          <div className="rounded-lg border border-slate-100 dark:border-slate-700 p-1.5 space-y-1">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-1 w-3/4 bg-slate-100 dark:bg-slate-700 rounded" />
            <div className="flex gap-0.5 mt-1">
              <div className="h-3 w-10 rounded-full bg-blue-100 dark:bg-blue-900" />
              <div className="h-3 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900" />
            </div>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {['Ringkas','Quiz','Gap','Metode'].map(t => (
              <div key={t} className="h-3.5 px-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[6px] text-slate-400 dark:text-slate-500 flex items-center">{t}</div>
            ))}
          </div>
          <div className="space-y-1 pt-1">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Main mock */}
        <div className="flex-1 flex flex-col">
          {/* Insight bar */}
          <div className="grid grid-cols-4 gap-1.5 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            {[
              { label: 'Topik', accent: 'border-blue-500' },
              { label: 'Hal.', accent: 'border-slate-300 dark:border-slate-600' },
              { label: 'Keywords', accent: 'border-violet-500' },
              { label: 'Bahasa', accent: 'border-slate-300 dark:border-slate-600' },
            ].map(({ label, accent }) => (
              <div key={label} className={`rounded bg-white dark:bg-slate-800 p-1.5 border-l-2 ${accent}`}>
                <div className="h-1 w-8 bg-slate-200 dark:bg-slate-600 rounded mb-1" />
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
          {/* Chat */}
          <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
            <div className="flex gap-1.5">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shrink-0" />
              <div className="bg-slate-100 dark:bg-slate-800 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg p-2 max-w-[80%]">
                <div className="space-y-1">
                  <div className="h-1.5 w-32 bg-slate-200 dark:bg-slate-600 rounded" />
                  <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
                  <div className="h-1.5 w-28 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
                <div className="flex gap-1 mt-1.5">
                  <div className="h-3 w-14 rounded-full bg-amber-100 dark:bg-amber-900" />
                  <div className="h-3 w-12 rounded-full bg-amber-100 dark:bg-amber-900" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-tl-lg rounded-tr-none rounded-br-lg rounded-bl-lg p-2 max-w-[60%]">
                <div className="h-1.5 w-20 bg-blue-400 rounded" />
              </div>
            </div>
          </div>
          {/* Input mock */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 rounded-xl px-2.5 py-1.5">
              <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-700 rounded" />
              <div className="w-5 h-5 rounded-full bg-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { isDark, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 tracking-tight">PaperMind</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Fitur</a>
            <a href="#how" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Cara Kerja</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              to="/workspace"
              className="h-8 px-4 text-sm font-medium rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Didukung Groq AI · Ultra-fast inference
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight mb-5">
          Baca Lebih Cerdas.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Pahami Lebih Dalam.
          </span>
        </h1>

        <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          Upload dokumen penelitianmu dan mulai berdiskusi dengan AI.
          PaperMind membantu kamu memahami, menganalisis, dan mendiskusikan
          jurnal ilmiah dengan mudah.
        </p>

        <div className="flex items-center justify-center gap-3 mb-14">
          <Link
            to="/workspace"
            className="h-10 px-6 text-sm font-semibold rounded-xl bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900 flex items-center gap-2"
          >
            Mulai Sekarang — Gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a
            href="#how"
            className="h-10 px-6 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center"
          >
            Cara Kerja
          </a>
        </div>

        <WorkspaceMockup />
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 dark:bg-slate-800/50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Semua yang kamu butuhkan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Dari upload hingga analisis mendalam, semua dalam satu platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Cara kerjanya sederhana</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Tiga langkah untuk mulai menganalisis dokumen penelitianmu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%_-_16px)] w-8 h-px bg-slate-200 dark:bg-slate-700 z-10" />
                )}
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl border-2 border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mx-auto mb-4">
                    {s.n}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-violet-600 dark:from-blue-700 dark:to-violet-700 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Siap mencoba PaperMind?</h2>
          <p className="text-sm text-blue-100 mb-8 max-w-md mx-auto leading-relaxed">
            Gratis untuk dicoba. Upload dokumen pertamamu dan lihat sendiri perbedaannya.
          </p>
          <Link
            to="/workspace"
            className="inline-flex h-10 items-center px-6 text-sm font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Mulai Sekarang — Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">PaperMind</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2025 PaperMind · AI untuk Dokumen Penelitian
          </p>
          <div className="flex gap-4">
            <Link to="/workspace" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Workspace</Link>
            <Link to="/history" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Riwayat</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
