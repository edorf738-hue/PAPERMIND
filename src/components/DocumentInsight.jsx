export default function DocumentInsight({ document }) {
  if (!document) return null

  const cards = [
    {
      label: 'Topik Utama',
      value: document.topic || '—',
      accent: 'border-blue-500 dark:border-blue-400',
      valueClass: 'text-slate-800 dark:text-slate-200 font-medium',
    },
    {
      label: 'Jumlah Halaman',
      value: document.pages ? `${document.pages} halaman` : '—',
      accent: 'border-slate-300 dark:border-slate-600',
      valueClass: 'text-slate-800 dark:text-slate-200 font-medium',
    },
    {
      label: 'Kata Kunci',
      value: Array.isArray(document.keywords) ? document.keywords.slice(0, 3).join(', ') : (document.keywords || '—'),
      accent: 'border-violet-500 dark:border-violet-400',
      valueClass: 'text-slate-800 dark:text-slate-200 font-medium',
    },
    {
      label: 'Bahasa',
      value: document.language || '—',
      accent: 'border-slate-300 dark:border-slate-600',
      valueClass: 'text-slate-800 dark:text-slate-200 font-medium',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
      {cards.map(card => (
        <div
          key={card.label}
          className={`bg-white dark:bg-slate-800 rounded-lg p-2.5 border-l-2 ${card.accent} shadow-sm`}
        >
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">{card.label}</p>
          <p className={`text-xs ${card.valueClass} leading-snug line-clamp-2`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
