import { useRef, useState } from 'react'

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export default function UploadZone({ onUpload, isUploading, error }) {
  const fileRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const ALLOWED = ['.pdf','.docx','.doc','.pptx','.ppt','.xlsx','.xls','.txt','.md']
  const isAllowed = (file) => ALLOWED.some(ext => file.name.toLowerCase().endsWith(ext))

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && isAllowed(file)) onUpload(file)
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileRef.current?.click()}
        className={`
          w-full max-w-md border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950'
            : error
              ? 'border-red-300 dark:border-red-700 bg-white dark:bg-slate-800'
              : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-slate-800'}
        `}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Menganalisis dokumen…</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">AI sedang memproses PDF kamu</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              : error ? 'bg-red-100 dark:bg-red-950 text-red-500 dark:text-red-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              {error
                ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                : <UploadIcon />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isDragging ? 'Lepas untuk upload' : error ? 'Upload gagal — coba lagi' : 'Upload dokumen PDF'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Drag & drop atau klik untuk memilih file
              </p>
            </div>
            <p className="text-[11px] text-slate-300 dark:text-slate-600">PDF · Word · PPT · Excel · TXT · Maks. 100MB</p>
          </div>
        )}
      </div>

      {error && !isUploading && (
        <div className="w-full max-w-md flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
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
    </div>
  )
}
