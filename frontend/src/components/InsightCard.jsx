import { useState } from 'react'
import { askFollowUp } from '../utils/reportAnalyzer'

const TYPE_LABELS = {
  BLOOD_TEST:   { label: 'Blood Test',   bg: '#DBEAFE', color: '#1E40AF' },
  IMAGING:      { label: 'Imaging',      bg: '#EDE9FE', color: '#5B21B6' },
  PRESCRIPTION: { label: 'Prescription', bg: '#FEF9C3', color: '#854D0E' },
  GENERAL:      { label: 'General',      bg: '#DCFCE7', color: '#166534' },
}

const STATUS_STYLE = {
  normal: { bg: '#DCFCE7', color: '#166534', icon: '✓', label: 'Normal' },
  high:   { bg: '#FEE2E2', color: '#991B1B', icon: '↑', label: 'High' },
  low:    { bg: '#DBEAFE', color: '#1E40AF', icon: '↓', label: 'Low' },
}

function parseInsightSections(text) {
  const sections = {}
  const headings = ['📋 Report Type', '🔬 Test Results & Analysis', '⚠️ Abnormal Values', '💊 Health Summary', '✅ Recommendations', '⚕️ Disclaimer']
  headings.forEach((h, i) => {
    const start = text.indexOf(h)
    if (start === -1) return
    const nextIdx = headings.slice(i + 1).map(nh => text.indexOf(nh)).find(p => p > start) ?? text.length
    sections[h] = text.slice(start + h.length, nextIdx).trim()
  })
  return sections
}

export default function InsightCard({ result, onClose }) {
  const [followUpQ, setFollowUpQ]   = useState('')
  const [followUpA, setFollowUpA]   = useState('')
  const [fqLoading, setFqLoading]   = useState(false)

  const typeInfo = TYPE_LABELS[result.reportType] || TYPE_LABELS.GENERAL
  const sections = parseInsightSections(result.aiInsight)

  const handleDownload = () => {
    const blob = new Blob([
      `VitaCare AI Report Analysis\n${'='.repeat(40)}\n`,
      `File: ${result.fileName}\nDate: ${result.date}\nType: ${typeInfo.label}\n\n`,
      result.aiInsight,
    ], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VitaCare_Analysis_${result.fileName.replace(/\.[^.]+$/, '')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFollowUp = async () => {
    if (!followUpQ.trim() || fqLoading) return
    setFqLoading(true)
    setFollowUpA('')
    try {
      const ans = await askFollowUp(followUpQ, result.aiInsight)
      setFollowUpA(ans)
    } catch {
      setFollowUpA('Sorry, kuch problem ho gayi. Please dobara try karo.')
    }
    setFqLoading(false)
  }

  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(79,70,229,0.10)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED,#06b6d4)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>VitaCare AI Analysis</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: typeInfo.bg, color: typeInfo.color, padding: '2px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              {typeInfo.label}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              📄 {result.fileName} · {result.date}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDownload}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            ⬇️ Download
          </button>
          {onClose && (
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '7px 12px', fontSize: 14, cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Abnormal alert banner */}
        {result.hasAbnormal && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#991B1B', fontSize: 13, marginBottom: 2 }}>Kuch values abnormal hain</div>
              <div style={{ fontSize: 12, color: '#B91C1C' }}>Neeche highlighted values dekho aur doctor se zaroor milein.</div>
            </div>
          </div>
        )}

        {/* Structured data table */}
        {result.extractedData.length > 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>🔬 Test Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.extractedData.map((row, i) => {
                const s = STATUS_STYLE[row.status] || STATUS_STYLE.normal
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: s.bg, borderRadius: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{row.parameter}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: s.color }}>{row.value} {row.unit}</span>
                        <span style={{ background: 'rgba(255,255,255,0.7)', color: s.color, padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{s.label}</span>
                      </div>
                      {row.normalRange && (
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Normal range: {row.normalRange}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* AI insight sections */}
        {Object.entries(sections).map(([heading, content]) => {
          if (!content) return null
          const isAbnormal = heading.includes('Abnormal')
          const isRec = heading.includes('Recommendations')
          const isDisclaimer = heading.includes('Disclaimer')

          const bg = isAbnormal ? '#FEF2F2' : isRec ? '#F0FDF4' : isDisclaimer ? '#F8FAFC' : '#EEF2FF'
          const headingColor = isAbnormal ? '#991B1B' : isRec ? '#166534' : isDisclaimer ? '#94A3B8' : '#3730A3'
          const textColor = isAbnormal ? '#B91C1C' : isRec ? '#15803D' : isDisclaimer ? '#94A3B8' : '#4338CA'

          return (
            <div key={heading} style={{ background: bg, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: headingColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{heading}</div>
              <div style={{ fontSize: 13, color: textColor, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{content}</div>
            </div>
          )
        })}

        {/* Follow-up Q&A */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: 16, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>💬 Follow-up Question Poocho</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={followUpQ}
              onChange={e => setFollowUpQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFollowUp()}
              placeholder="e.g. Hemoglobin low hai toh kya khaana chahiye?"
              style={{ flex: 1, padding: '9px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, outline: 'none', background: 'white' }}
            />
            <button onClick={handleFollowUp} disabled={fqLoading || !followUpQ.trim()}
              style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: 'white', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: fqLoading ? 'not-allowed' : 'pointer', opacity: fqLoading ? 0.7 : 1, whiteSpace: 'nowrap' }}>
              {fqLoading ? '⏳' : 'Ask →'}
            </button>
          </div>
          {followUpA && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'white', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700, color: '#4F46E5' }}>Aarohi: </span>{followUpA}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
