import jsPDF from 'jspdf'

function stripMarkdown(text = '') {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/gs, '$1')
    .replace(/\*(.*?)\*/gs, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*+] /gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const C = {
  dark:    [15, 23, 42],
  gray:    [100, 116, 139],
  blue:    [59, 130, 246],
  emerald: [16, 185, 129],
  line:    [226, 232, 240],
  muted:   [148, 163, 184],
  amber:   [245, 158, 11],
  red:     [239, 68, 68],
}

export function exportToPDF(docInfo, messages) {
  if (!docInfo) return

  const pdf    = new jsPDF({ unit: 'mm', format: 'a4' })
  const PW     = 210, PH = 297
  const ML     = 20,  MR = 20
  const CW     = PW - ML - MR
  const MT     = 16
  const HDR_H  = 14
  const FTR_H  = 12
  const TOP    = MT + HDR_H + 2
  const BOTTOM = PH - FTR_H - 8

  let y       = TOP
  let pageNum = 1

  // ── Style helpers ──────────────────────────────────────────

  const ss = (size, weight, color) => {
    pdf.setFontSize(size)
    pdf.setFont('helvetica', weight)
    pdf.setTextColor(...color)
  }

  const checkBreak = (needed = 8) => {
    if (y + needed > BOTTOM) {
      drawFooter()
      pdf.addPage()
      pageNum++
      drawRunningHeader()
      y = TOP
    }
  }

  // Write multi-line block; returns height used
  const block = (text, size, weight, color, indent = 0, gap = null) => {
    const lh = gap ?? (size * 0.4 + 1.6)
    ss(size, weight, color)
    const lines = pdf.splitTextToSize(String(text), CW - indent)
    lines.forEach(line => {
      checkBreak(lh + 2)
      pdf.text(line, ML + indent, y)
      y += lh
    })
  }

  const hLine = (color = C.line, w = 0.25) => {
    pdf.setDrawColor(...color)
    pdf.setLineWidth(w)
    pdf.line(ML, y, PW - MR, y)
  }

  // ── Headers / footer ──────────────────────────────────────

  const drawFirstHeader = () => {
    ss(14, 'bold', C.blue)
    pdf.text('PaperMind', ML, MT + 8)

    ss(8, 'normal', C.gray)
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    pdf.text(dateStr, PW - MR, MT + 8, { align: 'right' })

    pdf.setDrawColor(...C.blue)
    pdf.setLineWidth(0.6)
    pdf.line(ML, MT + 11, PW - MR, MT + 11)
  }

  const drawRunningHeader = () => {
    ss(7.5, 'normal', C.muted)
    pdf.text('PaperMind', ML, MT + 7)
    const name = (docInfo?.name || '').slice(0, 68)
    if (name) pdf.text(name, ML + 22, MT + 7)
    pdf.setDrawColor(...C.line)
    pdf.setLineWidth(0.2)
    pdf.line(ML, MT + 10, PW - MR, MT + 10)
  }

  const drawFooter = () => {
    pdf.setDrawColor(...C.line)
    pdf.setLineWidth(0.2)
    pdf.line(ML, PH - FTR_H, PW - MR, PH - FTR_H)
    ss(7.5, 'normal', C.muted)
    pdf.text('Dibuat dengan PaperMind', ML, PH - FTR_H + 5)
    pdf.text(`Halaman ${pageNum}`, PW - MR, PH - FTR_H + 5, { align: 'right' })
  }

  // ── Build exchanges ───────────────────────────────────────
  //
  // Pair each user message with its immediate AI / quiz_result response.
  // Orphaned user messages (quiz without a result) are dropped so we never
  // render bare "Pertanyaan:" blocks with nothing following them.

  const pool = messages.filter(m =>
    m.role === 'quiz_result' ||
    m.role === 'user' ||
    (m.role === 'ai' && !m.quiz)
  )

  const exchanges = []
  for (let i = 0; i < pool.length; i++) {
    const m    = pool[i]
    const next = pool[i + 1]

    if (m.role === 'user') {
      if (next && (next.role === 'ai' || next.role === 'quiz_result')) {
        exchanges.push({ q: m, a: next })
        i++ // next already consumed
      }
      // else: orphaned question (quiz without Selesai) — skip
    } else if (m.role === 'ai' || m.role === 'quiz_result') {
      // standalone answer without a user question (edge case)
      exchanges.push({ q: null, a: m })
    }
  }

  // ── Render ─────────────────────────────────────────────────

  drawFirstHeader()
  y = TOP

  // Document title
  block(docInfo.name || 'Laporan PaperMind', 13, 'bold', C.dark)
  y += 4

  // Info rows
  const LPAD = 30
  const infoRows = [
    ['Penulis',    docInfo.author],
    ['Tahun',      docInfo.year],
    ['Topik',      docInfo.topic],
    ['Kata Kunci', Array.isArray(docInfo.keywords)
      ? docInfo.keywords.join(', ') : docInfo.keywords],
    ['Halaman',    docInfo.pages ? `${docInfo.pages} halaman` : null],
  ].filter(([, v]) => v && String(v).trim())

  infoRows.forEach(([label, value]) => {
    checkBreak(7)
    ss(8.5, 'bold', C.gray)
    pdf.text(`${label}:`, ML, y)
    ss(8.5, 'normal', C.dark)
    const vLines = pdf.splitTextToSize(String(value), CW - LPAD)
    vLines.forEach((vl, vi) => {
      if (vi > 0) { checkBreak(4.5); y += 0 }
      pdf.text(vl, ML + LPAD, y)
      if (vi < vLines.length - 1) y += 4.5
    })
    y += 5.5
  })

  y += 5

  // Section divider
  hLine(C.line, 0.5)
  y += 5
  ss(9.5, 'bold', C.dark)
  pdf.text('PERCAKAPAN', ML, y)
  y += 3
  hLine(C.line, 0.5)
  y += 8

  if (exchanges.length === 0) {
    ss(9, 'italic', C.muted)
    pdf.text('Belum ada percakapan.', ML, y)
    y += 8
  }

  exchanges.forEach(({ q, a }, idx) => {
    const num = String(idx + 1)

    // ── Question block ──
    if (q) {
      checkBreak(16)

      // Number chip
      ss(7.5, 'bold', C.muted)
      pdf.text(num, ML, y)

      // Label
      ss(8.5, 'bold', C.blue)
      pdf.text('Pertanyaan', ML + 6, y)
      y += 5

      block(q.content, 9.5, 'normal', C.dark, 6)
      y += 4
    }

    // ── Answer block ──
    if (a.role === 'ai') {
      checkBreak(12)
      ss(8.5, 'bold', C.emerald)
      pdf.text('Jawaban AI', ML + 6, y)
      y += 5

      const clean = stripMarkdown(a.content)
      block(clean, 9.5, 'normal', C.dark, 6)

      if (a.citations?.length > 0) {
        y += 2
        checkBreak(5)
        const cite = 'Referensi: ' +
          a.citations.map(c =>
            `Hal. ${c.page}${c.paragraph ? `, Par. ${c.paragraph}` : ''}`
          ).join(' · ')
        block(cite, 7.5, 'italic', C.muted, 6)
      }

    } else if (a.role === 'quiz_result') {
      let data = {}
      try { data = JSON.parse(a.content) } catch {}
      const { total_score = 0, pilgan_correct, pilgan_total, essay_avg, essay_total } = data
      const scoreCol = total_score >= 70 ? C.emerald
        : total_score >= 50 ? C.amber : C.red

      checkBreak(22)
      ss(8.5, 'bold', C.muted)
      pdf.text('Hasil Quiz', ML + 6, y)
      y += 5

      ss(11, 'bold', scoreCol)
      pdf.text(`Skor: ${total_score}%`, ML + 6, y)
      y += 5.5

      ss(8.5, 'normal', C.dark)
      if (pilgan_total > 0) {
        checkBreak(5)
        pdf.text(`Pilihan ganda: ${pilgan_correct}/${pilgan_total} benar`, ML + 6, y)
        y += 5
      }
      if (essay_total > 0) {
        checkBreak(5)
        pdf.text(`Essay: ${essay_avg}/100`, ML + 6, y)
        y += 5
      }
    }

    // Separator after each complete exchange
    y += 5
    checkBreak(4)
    hLine(C.line, 0.2)
    y += 7
  })

  drawFooter()

  // ── Save file ─────────────────────────────────────────────
  const safeName = (docInfo.name || 'dokumen')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  const dateTag = new Date().toISOString().slice(0, 10)
  pdf.save(`PaperMind-${safeName}-${dateTag}.pdf`)
}
