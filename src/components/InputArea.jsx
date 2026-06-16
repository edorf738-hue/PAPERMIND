import { useState, useRef, useEffect } from 'react'

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

export default function InputArea({ onSend, isLoading, hasDocument, prefill, onClearPrefill }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (prefill) {
      setValue(prefill)
      onClearPrefill()
      textareaRef.current?.focus()
    }
  }, [prefill, onClearPrefill])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || !hasDocument) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={hasDocument ? 'Tanyakan sesuatu tentang dokumen…' : 'Upload dokumen terlebih dahulu…'}
            disabled={!hasDocument || isLoading}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none leading-relaxed disabled:cursor-not-allowed"
            style={{ minHeight: '22px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading || !hasDocument}
            className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-1.5">
          Enter untuk kirim · Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  )
}
