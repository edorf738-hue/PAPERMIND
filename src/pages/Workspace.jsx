import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'
import DocumentInsight from '../components/DocumentInsight'
import ChatArea from '../components/ChatArea'
import InputArea from '../components/InputArea'
import UploadZone from '../components/UploadZone'
import { exportToPDF } from '../utils/exportPdf'

const UPLOAD_URL = import.meta.env.VITE_N8N_UPLOAD_WEBHOOK
const CHAT_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK
const BASE_URL = UPLOAD_URL ? new URL(UPLOAD_URL).origin : 'http://localhost:8000'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('papermind-history') || '[]')
  } catch {
    return []
  }
}

function saveToHistory(sessionId, documentName) {
  const history = loadHistory()
  if (history.some(h => h.sessionId === sessionId)) return
  const entry = {
    id: generateId(),
    sessionId,
    documentName,
    date: new Date().toISOString(),
  }
  localStorage.setItem('papermind-history', JSON.stringify([entry, ...history].slice(0, 50)))
}

export default function Workspace() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [pdfDoc, setPdfDoc] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const [history, setHistory] = useState(loadHistory)
  const [inputPrefill, setInputPrefill] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(210)

  const fetchUserHistory = useCallback(async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/sessions?user_id=${userId}`)
      if (!res.ok) return
      const data = await res.json()
      setHistory(data.sessions.map(s => ({
        id: s.session_id,
        sessionId: s.session_id,
        documentName: s.metadata?.name || 'Dokumen',
        date: s.created_at,
      })))
    } catch (err) {
      console.error('Fetch user history error:', err)
    }
  }, [])

  useEffect(() => {
    const sid = searchParams.get('session')
    if (sid) loadSession(sid)
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserHistory(user.id)
    } else {
      setHistory(loadHistory())
    }
  }, [user])

  const loadSession = async (sid) => {
    setIsLoadingSession(true)
    setPdfDoc(null)
    setMessages([])
    setSuggestedQuestions([])
    try {
      const res = await fetch(`${BASE_URL}/session/${sid}`)
      if (!res.ok) throw new Error('Sesi tidak ditemukan')
      const data = await res.json()
      setPdfDoc(data.document)
      setSessionId(sid)
      setMessages(data.messages || [])
    } catch (err) {
      console.error('Load session error:', err)
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handleUpload = useCallback(async (file) => {
    setIsUploading(true)
    setMessages([])
    setPdfDoc(null)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (user?.id) formData.append('user_id', user.id)

      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Upload gagal (${res.status})`)
      }

      const data = await res.json()
      setPdfDoc(data.document)
      setSessionId(data.sessionId)
      setSuggestedQuestions(data.suggestedQuestions || [])

      if (user) {
        fetchUserHistory(user.id)
      } else {
        saveToHistory(data.sessionId, data.document.name)
        setHistory(loadHistory())
      }
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError(err.message || 'Upload gagal. Pastikan backend sudah berjalan.')
    } finally {
      setIsUploading(false)
    }
  }, [user, fetchUserHistory])

  const handleSend = useCallback(async (text, displayText, options = {}) => {
    const userMsg = { id: generateId(), role: 'user', content: displayText ?? text }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          chatInput: text,
          action: 'sendMessage',
          userId: user?.id ?? null,
          isQuiz: options.isQuiz ?? false,
          quizType: options.quizType ?? 'pilgan',
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Request gagal (${res.status})`)
      }

      const data = await res.json()
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'ai',
        content: data.output || 'Maaf, tidak ada respons dari AI.',
        citations: data.citations || [],
        quiz: data.quiz || null,
      }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'error',
        content: err.message || 'Gagal mendapat respons. Coba lagi.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, user])

  const handleNewSession = () => {
    setPdfDoc(null)
    setMessages([])
    setSessionId(null)
    setSuggestedQuestions([])
    setUploadError('')
    navigate('/workspace', { replace: true })
  }

  const handleSelectHistory = (item) => {
    loadSession(item.sessionId)
    navigate('/workspace', { replace: true })
  }

  const handleDeleteHistory = useCallback(async (item) => {
    try {
      await fetch(`${BASE_URL}/session/${item.sessionId}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Delete session error:', err)
    }

    if (user) {
      fetchUserHistory(user.id)
    } else {
      const updated = loadHistory().filter(h => h.id !== item.id)
      localStorage.setItem('papermind-history', JSON.stringify(updated))
      setHistory(updated)
    }

    if (sessionId === item.sessionId) {
      setPdfDoc(null)
      setMessages([])
      setSessionId(null)
      setSuggestedQuestions([])
      navigate('/workspace', { replace: true })
    }
  }, [sessionId, user, fetchUserHistory, navigate])

  const handleQuizDone = useCallback((msgId, resultData) => {
    setMessages(prev => prev.map(msg =>
      msg.id === msgId
        ? { id: msg.id, role: 'quiz_result', content: JSON.stringify(resultData), citations: [] }
        : msg
    ))
  }, [])

  const handleSelectTemplate = (prompt) => setInputPrefill(prompt)
  const handleSelectQuestion = (q) => { if (pdfDoc) handleSend(q) }
  const handleExport = () => exportToPDF(pdfDoc, messages)
  const handleToggleSidebar = () => setSidebarOpen(prev => !prev)

  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMove = (e) => {
      const newWidth = Math.max(180, Math.min(480, startWidth + (e.clientX - startX)))
      setSidebarWidth(newWidth)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [sidebarWidth])

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
      <Topbar onNewSession={handleNewSession} onExport={handleExport} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          document={pdfDoc}
          history={history}
          onUpload={handleUpload}
          onSelectTemplate={handleSelectTemplate}
          onSendTemplate={handleSend}
          onSelectHistory={handleSelectHistory}
          onDeleteHistory={handleDeleteHistory}
          isOpen={sidebarOpen}
          width={sidebarWidth}
          onToggle={handleToggleSidebar}
        />

        {sidebarOpen && (
          <div
            onMouseDown={handleResizeMouseDown}
            className="w-1 shrink-0 cursor-col-resize bg-slate-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors"
          />
        )}

        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          {isLoadingSession ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <svg className="animate-spin w-8 h-8 text-blue-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <p className="text-sm text-slate-500 dark:text-slate-400">Memuat sesi…</p>
              </div>
            </div>
          ) : !pdfDoc && !isUploading ? (
            <UploadZone onUpload={handleUpload} isUploading={false} error={uploadError} />
          ) : isUploading ? (
            <UploadZone onUpload={handleUpload} isUploading={true} />
          ) : (
            <>
              <DocumentInsight document={pdfDoc} />
              <ChatArea
                messages={messages}
                suggestedQuestions={suggestedQuestions}
                isLoading={isLoading}
                onSelectQuestion={handleSelectQuestion}
                sessionId={sessionId}
                userId={user?.id ?? null}
                onQuizDone={handleQuizDone}
              />
              <InputArea
                onSend={handleSend}
                isLoading={isLoading}
                hasDocument={!!pdfDoc}
                prefill={inputPrefill}
                onClearPrefill={() => setInputPrefill('')}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
