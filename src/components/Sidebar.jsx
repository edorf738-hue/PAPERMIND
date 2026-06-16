import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TEMPLATES = [
  { label: 'Ringkas',              type: 'direct', prompt: 'Ringkas dokumen ini dalam 5 poin utama.' },
  { label: 'Quiz',                 type: 'dialog'  },
  { label: 'Gap',                  type: 'direct', prompt: 'Temukan research gap dalam dokumen ini.' },
  { label: 'Metode',               type: 'direct', prompt: 'Jelaskan metodologi yang digunakan dalam dokumen ini.' },
  { label: 'Kelebihan & Kekurangan', type: 'direct', prompt: 'Jelaskan kelebihan dan kekurangan penelitian dalam dokumen ini.' },
  { label: 'Terjemah',             type: 'direct', prompt: 'Terjemahkan ringkasan dokumen ini ke Bahasa Indonesia.' },
]

function FileIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function HistoryIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14" />
      <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
  )
}

function UploadIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function UserIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function formatTimeLabel(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} mnt lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const ICON_BTN = "w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"

export default function Sidebar({ document, history, onUpload, onSelectTemplate, onSendTemplate, onSelectHistory, onDeleteHistory, isOpen, width, onToggle }) {
  const fileRef = useRef(null)
  const { user, signOut } = useAuth()
  const [deletingId, setDeletingId] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizCount, setQuizCount] = useState('10')
  const [quizType, setQuizType] = useState('pilgan')
  const handleTemplateClick = (t) => {
    if (!document) return
    if (t.type === 'dialog') {
      setQuizOpen(prev => !prev)
      return
    }
    onSendTemplate(t.prompt)
  }

  const handleSendQuiz = () => {
    const typeLabel = quizType === 'pilgan' ? 'pilihan ganda' : quizType === 'essay' ? 'essay' : 'pilihan ganda dan essay'
    const displayText = `Buatkan ${quizCount} soal ${typeLabel}`
    const fullPrompt = `Buatkan ${quizCount} soal ${typeLabel} dari dokumen ini.`
    onSendTemplate(fullPrompt, displayText, { isQuiz: true, quizType })
    setQuizOpen(false)
  }

  // Collapsed icon-strip
  if (!isOpen) {
    return (
      <aside className="w-[52px] shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center py-2 gap-0.5">
        {/* Expand button */}
        <button
          onClick={onToggle}
          title="Buka sidebar"
          className={ICON_BTN}
        >
          <ChevronRightIcon />
        </button>

        <div className="w-6 border-t border-slate-100 dark:border-slate-800 my-1" />

        {/* Upload */}
        <button
          onClick={() => fileRef.current?.click()}
          title="Upload dokumen"
          className={`${ICON_BTN} ${document ? 'text-blue-500 dark:text-blue-400' : ''}`}
        >
          <UploadIcon />
        </button>

        {/* File indicator — only when doc is loaded */}
        {document && (
          <button
            title={document.name}
            className={`${ICON_BTN} text-blue-500 dark:text-blue-400`}
          >
            <FileIcon size={15} />
          </button>
        )}

        <div className="flex-1" />

        {/* History */}
        <Link
          to="/history"
          title="Riwayat"
          className={ICON_BTN}
        >
          <HistoryIcon />
        </Link>

        <div className="w-6 border-t border-slate-100 dark:border-slate-800 my-1" />

        {/* User */}
        {user ? (
          <button
            onClick={signOut}
            title={`Keluar (${user.email})`}
            className={ICON_BTN}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white leading-none">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
          </button>
        ) : (
          <Link to="/auth" title="Masuk" className={ICON_BTN}>
            <UserIcon />
          </Link>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.md"
          className="hidden"
          onChange={e => {
            if (e.target.files?.[0]) onUpload(e.target.files[0])
            e.target.value = ''
          }}
        />
      </aside>
    )
  }

  // Expanded full sidebar
  return (
    <aside
      style={{ width: `${width}px` }}
      className="shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col overflow-hidden"
    >
      {/* Sidebar header with collapse button */}
      <div className="h-9 flex items-center justify-end px-2 shrink-0">
        <button
          onClick={onToggle}
          title="Tutup sidebar"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Document Card */}
      <div className="px-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        {document ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-500 dark:text-blue-400 shrink-0">
                <FileIcon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate leading-snug">{document.name}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {document.pages} hal · {document.size}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {document.topic && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 truncate max-w-[130px]">
                  {document.topic}
                </span>
              )}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                Loaded
              </span>
            </div>

            {(document.author || document.year || document.type) && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-0.5">
                {document.author && <p className="truncate">{document.author}</p>}
                <p className="truncate">{[document.year, document.type].filter(Boolean).join(' · ')}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-1">Belum ada dokumen</p>
        )}

        <button
          onClick={() => fileRef.current?.click()}
          className="mt-2 w-full h-7 text-[11px] font-medium text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          + Upload dokumen baru
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.md"
          className="hidden"
          onChange={e => {
            if (e.target.files?.[0]) onUpload(e.target.files[0])
            e.target.value = ''
          }}
        />
      </div>

      {/* Templates */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Templates</p>
        <div className="flex flex-wrap gap-1">
          {TEMPLATES.map(t => (
            <button
              key={t.label}
              onClick={() => handleTemplateClick(t)}
              disabled={!document}
              title={!document ? 'Upload dokumen dulu' : undefined}
              className={`text-[11px] px-2 py-1 rounded-full transition-colors
                ${!document
                  ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : t.type === 'dialog' && quizOpen
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Quiz dialog */}
        {quizOpen && (
          <div className="mt-2 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 mb-1.5">Jumlah soal</p>
              <div className="flex gap-1">
                {['5', '10', '20'].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuizCount(n)}
                    className={`flex-1 h-6 text-[11px] font-medium rounded-lg transition-colors ${
                      quizCount === n
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 mb-1.5">Tipe soal</p>
              <div className="flex flex-col gap-1">
                {[
                  { value: 'pilgan', label: 'Pilihan Ganda' },
                  { value: 'essay', label: 'Essay' },
                  { value: 'keduanya', label: 'Keduanya' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setQuizType(opt.value)}
                    className={`h-6 text-[11px] font-medium rounded-lg transition-colors ${
                      quizType === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setQuizOpen(false)}
                className="flex-1 h-7 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSendQuiz}
                className="flex-1 h-7 text-[11px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Buat Soal →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-slate-400 dark:text-slate-500"><HistoryIcon /></span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Riwayat</p>
        </div>
        {history.length === 0 ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1">Belum ada riwayat</p>
        ) : (
          <div className="space-y-0.5">
            {history.slice(0, 12).map(item => (
              <div key={item.id} className="group relative">
                {deletingId === item.id ? (
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Hapus riwayat ini?</p>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => { onDeleteHistory(item); setDeletingId(null) }}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectHistory(item)}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors pr-8"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0"><MessageIcon /></span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate leading-snug">{item.documentName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatTimeLabel(item.date)}</p>
                      </div>
                    </div>
                  </button>
                )}

                {deletingId !== item.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingId(item.id) }}
                    title="Hapus riwayat"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {user ? (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate min-w-0">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 ml-1"
              title="Keluar"
            >
              <LogOutIcon />
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="w-full h-7 text-[11px] font-medium rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            Masuk / Daftar
          </Link>
        )}
      </div>
    </aside>
  )
}
