import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

function BookmarkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 max-w-[75%]">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-xl px-3.5 py-2.5">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

function preprocessMarkdown(text) {
  if (!text) return text

  // Already has proper newline-separated numbered list — leave it alone
  if (/^[ \t]*\d+[).]\s/m.test(text)) return text

  // Detect inline numbered list: "1) item ... 2) item" or "1. item ... 2. item"
  const hasInlineList = /\b1[).]\s.+\b2[).]\s/.test(text)
  if (!hasInlineList) return text

  const markerMatch = text.match(/\b(1)([).])/)
  if (!markerMatch) return text
  const sep = markerMatch[2] // ")" or "."
  const escapedSep = sep === ')' ? '\\)' : '\\.'

  const listStart = text.search(new RegExp(`\\b1${escapedSep}\\s`))
  if (listStart < 0) return text

  const intro = text.slice(0, listStart).trimEnd().replace(/[,;：:]\s*$/, '') + ':'
  const listPart = text.slice(listStart)

  // Try comma/semicolon split first (most common: "1. a, 2. b")
  const commaSplitRe = new RegExp(`,\\s*(?:(?:dan|and|atau|or)\\s+)?(?=\\d+${escapedSep}\\s)`)
  let items = listPart.split(commaSplitRe)

  // Fallback: space-only split (e.g. "1. a 2. b 3. c")
  if (items.length < 2) {
    const spaceSplitRe = new RegExp(`(?=\\b[2-9]${escapedSep}\\s|\\b[1-9]\\d${escapedSep}\\s)`)
    items = listPart.split(spaceSplitRe).filter(s => s.trim())
  }

  if (items.length < 2) return text

  const lines = items.map(item =>
    item.replace(new RegExp(`^(\\d+)${escapedSep}\\s*`), '$1. ').trim().replace(/[,.]$/, '')
  )

  return intro + '\n' + lines.join('\n')
}

function safeContent(content) {
  if (!content) return content
  if (!content.trimStart().startsWith('{')) return content

  // Coba parse JSON normal dulu
  try {
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed.output === 'string') return parsed.output
  } catch {}

  // Fallback: AI kadang kirim JSON dengan kutip tidak di-escape di dalam string
  // Ekstrak nilai "output" langsung lewat regex greedy
  const m = content.match(/"output"\s*:\s*"([\s\S]*)"\s*,\s*"citations"/)
  if (m?.[1]) return m[1]

  return content
}

function AIBubble({ message }) {
  const text = safeContent(message.content)
  return (
    <div className="flex items-start gap-2.5 max-w-[80%]">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      </div>
      <div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-xl px-3.5 py-2.5">
          <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-1 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-1 mb-2">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                h1: ({ children }) => <h1 className="text-base font-bold mb-2 mt-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5 mt-1">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-1">{children}</h3>,
                code: ({ children }) => <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-slate-300 dark:border-slate-600 pl-3 italic text-slate-600 dark:text-slate-400 mb-2">{children}</blockquote>,
              }}
            >
              {preprocessMarkdown(text)}
            </ReactMarkdown>
          </div>
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5 pl-0.5">
            {message.citations.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              >
                <BookmarkIcon />
                Hal. {c.page}{c.paragraph ? `, Par. ${c.paragraph}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function UserBubble({ message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-blue-600 dark:bg-blue-500 rounded-tl-xl rounded-tr-none rounded-br-xl rounded-bl-xl px-3.5 py-2.5">
        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}

function ErrorBubble({ message }) {
  return (
    <div className="flex items-start gap-2.5 max-w-[80%]">
      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-xl px-3.5 py-2.5">
        <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">{message.content}</p>
      </div>
    </div>
  )
}

const QUIZ_BASE_URL = (() => {
  try { return new URL(import.meta.env.VITE_N8N_UPLOAD_WEBHOOK).origin } catch { return 'http://localhost:8000' }
})()

function QuizResultBubble({ message }) {
  let data = {}
  try { data = JSON.parse(message.content) } catch { return null }
  const { total_score, pilgan_correct, pilgan_total, essay_avg, essay_total } = data
  const scoreColor = total_score >= 70 ? 'text-emerald-700 dark:text-emerald-400'
    : total_score >= 50 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400'
  const barWidth = `${Math.max(4, total_score)}%`

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quiz Selesai</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Skor akhir</span>
            <span className={`text-sm font-bold ${scoreColor}`}>{total_score}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${total_score >= 70 ? 'bg-emerald-500' : total_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: barWidth }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {pilgan_total > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilihan ganda: <span className="font-medium text-slate-700 dark:text-slate-300">{pilgan_correct}/{pilgan_total} benar</span>
            </p>
          )}
          {essay_total > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essay: <span className="font-medium text-slate-700 dark:text-slate-300">{essay_avg}/100</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const RetryIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
)

function QuizBubble({ quiz, sessionId, userId, msgId, onDone }) {
  const [answers, setAnswers] = useState({})
  const [essayInputs, setEssayInputs] = useState({})
  const [essayGrades, setEssayGrades] = useState({})
  const [gradingIdx, setGradingIdx] = useState(null)
  const [done, setDone] = useState(false)

  const questions = quiz?.questions || []
  const isEssayQ = (q) => q.type === 'essay' || !q.options?.length
  const pilganIdxs = questions.map((_, i) => i).filter(i => !isEssayQ(questions[i]))
  const essayIdxs = questions.map((_, i) => i).filter(i => isEssayQ(questions[i]))

  const handleSelect = (qIdx, letter) => {
    if (answers[qIdx]) return
    setAnswers(prev => ({ ...prev, [qIdx]: letter }))
  }

  const handleSubmitEssay = async (qIdx) => {
    const userAnswer = (essayInputs[qIdx] || '').trim()
    if (!userAnswer) return
    setGradingIdx(qIdx)
    try {
      const res = await fetch(`${QUIZ_BASE_URL}/grade-essay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question: questions[qIdx].question, user_answer: userAnswer }),
      })
      const data = await res.json()
      setEssayGrades(prev => ({ ...prev, [qIdx]: data }))
    } catch {
      setEssayGrades(prev => ({ ...prev, [qIdx]: { score: 0, feedback: 'Gagal menilai. Coba lagi.', ideal_answer: '' } }))
    } finally {
      setGradingIdx(null)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setEssayInputs({})
    setEssayGrades({})
    setDone(false)
  }

  const handleDone = async () => {
    const resultData = {
      total_score: totalScore,
      pilgan_correct: pilganCorrect,
      pilgan_total: pilganIdxs.length,
      essay_avg: essayAvgScore,
      essay_total: essayIdxs.length,
    }
    if (onDone) {
      onDone(msgId, resultData)
    } else {
      setDone(true)
    }
    try {
      await fetch(`${QUIZ_BASE_URL}/save-quiz-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, user_id: userId ?? null, ...resultData }),
      })
    } catch { /* silently fail */ }
  }

  const isFinished = questions.length > 0
    && pilganIdxs.every(i => !!answers[i])
    && essayIdxs.every(i => !!essayGrades[i])

  const pilganCorrect = pilganIdxs.filter(i => answers[i] === questions[i].answer).length
  const essayAvgScore = essayIdxs.length > 0
    ? Math.round(essayIdxs.reduce((s, i) => s + (essayGrades[i]?.score || 0), 0) / essayIdxs.length)
    : null
  const totalScore = isFinished && questions.length > 0
    ? Math.round(((pilganCorrect + essayIdxs.reduce((s, i) => s + (essayGrades[i]?.score || 0) / 100, 0)) / questions.length) * 100)
    : 0
  const scoreColor = totalScore >= 70 ? 'text-emerald-700 dark:text-emerald-400'
    : totalScore >= 50 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400'

  return (
    <div className="flex items-start gap-2.5 max-w-[85%]">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      </div>
      <div className="flex-1 space-y-4">
        {questions.map((q, qIdx) => {
          if (isEssayQ(q)) {
            const grade = essayGrades[qIdx]
            const isGrading = gradingIdx === qIdx
            const isGraded = !!grade
            return (
              <div key={qIdx} className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 py-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 uppercase tracking-wide">Essay</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {qIdx + 1}. {q.question}
                </p>
                <textarea
                  value={essayInputs[qIdx] || ''}
                  onChange={(e) => { if (!isGraded) setEssayInputs(prev => ({ ...prev, [qIdx]: e.target.value })) }}
                  disabled={isGraded || isGrading}
                  placeholder="Tulis jawabanmu di sini..."
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-70 disabled:cursor-default transition-colors"
                />
                {!isGraded && (
                  <button
                    onClick={() => handleSubmitEssay(qIdx)}
                    disabled={!essayInputs[qIdx]?.trim() || isGrading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    {isGrading ? (
                      <>
                        <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Menilai...
                      </>
                    ) : 'Kirim Jawaban'}
                  </button>
                )}
                {isGraded && (
                  <div className="space-y-2">
                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      grade.score >= 70 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : grade.score >= 50 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                    }`}>
                      {grade.score}/100
                    </span>
                    <div className="px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                      {grade.feedback && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Feedback: </span>{grade.feedback}
                        </p>
                      )}
                      {grade.ideal_answer && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Jawaban ideal: </span>{grade.ideal_answer}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          }

          const selected = answers[qIdx]
          const answered = !!selected
          return (
            <div key={qIdx} className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 py-3 space-y-2.5">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-1.5">
                {(q.options || []).map((opt) => {
                  const letter = opt[0]
                  const isSelected = selected === letter
                  const isCorrect = q.answer === letter
                  let cls = 'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border '
                  if (!answered) {
                    cls += 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer'
                  } else if (isCorrect) {
                    cls += 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 font-medium cursor-default'
                  } else if (isSelected) {
                    cls += 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 text-red-700 dark:text-red-300 cursor-default'
                  } else {
                    cls += 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 opacity-60 cursor-default'
                  }
                  return (
                    <button key={letter} onClick={() => handleSelect(qIdx, letter)} disabled={answered} className={cls}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {answered && q.explanation && (
                <div className="flex items-start gap-1.5 px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className={`text-xs mt-0.5 font-bold shrink-0 ${selected === q.answer ? 'text-emerald-600' : 'text-red-500'}`}>
                    {selected === q.answer ? '✓' : '✗'}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}

        {isFinished && !done && (
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 border border-blue-200 dark:border-blue-800 text-center space-y-3">
            <div>
              {pilganIdxs.length > 0 && essayIdxs.length === 0 && (
                <>
                  <p className={`text-sm font-semibold ${scoreColor}`}>Kamu menjawab {pilganCorrect} dari {questions.length} soal dengan benar!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Skor: {totalScore}%</p>
                </>
              )}
              {essayIdxs.length > 0 && pilganIdxs.length === 0 && (
                <p className={`text-sm font-semibold ${scoreColor}`}>Rata-rata skor essay: {essayAvgScore}/100</p>
              )}
              {pilganIdxs.length > 0 && essayIdxs.length > 0 && (
                <>
                  <p className={`text-sm font-semibold ${scoreColor}`}>Skor akhir: {totalScore}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pilihan ganda: {pilganCorrect}/{pilganIdxs.length} benar · Essay: {essayAvgScore}/100
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={handleRetry} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                <RetryIcon /> Ulangi Quiz
              </button>
              <button onClick={handleDone} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Selesai
              </button>
            </div>
          </div>
        )}

        {done && (
          <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className={`text-sm font-semibold ${scoreColor}`}>
              {pilganIdxs.length > 0 && essayIdxs.length === 0
                ? `Skor akhir: ${pilganCorrect}/${questions.length} (${totalScore}%)`
                : essayIdxs.length > 0 && pilganIdxs.length === 0
                ? `Skor akhir: ${essayAvgScore}/100`
                : `Skor akhir: ${totalScore}% · PG ${pilganCorrect}/${pilganIdxs.length} · Essay ${essayAvgScore}/100`}
            </p>
            <button onClick={handleRetry} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <RetryIcon /> Ulangi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const SUGGESTED = [
  'Apa tujuan utama penelitian ini?',
  'Metodologi apa yang digunakan?',
  'Apa kesimpulan utamanya?',
  'Apa keterbatasan penelitian?',
  'Buatkan 10 soal kuis',
  'Research gap penelitian?',
]

export default function ChatArea({ messages, suggestedQuestions, isLoading, onSelectQuestion, sessionId, userId, onQuizDone }) {
  const bottomRef = useRef(null)
  const questions = suggestedQuestions?.length ? suggestedQuestions : SUGGESTED

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-6 py-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200 dark:shadow-blue-900">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mulai berdiskusi</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Ajukan pertanyaan atau pilih salah satu di bawah</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectQuestion(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map(msg => {
            if (msg.role === 'user') return <UserBubble key={msg.id} message={msg} />
            if (msg.role === 'error') return <ErrorBubble key={msg.id} message={msg} />
            if (msg.role === 'quiz_result') return <QuizResultBubble key={msg.id} message={msg} />
            if (msg.quiz) return <QuizBubble key={msg.id} msgId={msg.id} quiz={msg.quiz} sessionId={sessionId} userId={userId} onDone={onQuizDone} />
            return <AIBubble key={msg.id} message={msg} />
          })}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
