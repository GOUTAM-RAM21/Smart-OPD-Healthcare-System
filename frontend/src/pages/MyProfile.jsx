import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'
import { analyzeReportAgent } from '../utils/reportAnalyzer'
import InsightCard from '../components/InsightCard'

// ─── helpers ────────────────────────────────────────────────────────────────

function loadSavedReports() {
  const results = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('vitacare_report_')) {
      try { results.push({ key, ...JSON.parse(localStorage.getItem(key)) }) } catch {}
    }
  }
  return results.sort((a, b) => b.key.localeCompare(a.key))
}

const TYPE_LABELS = {
  BLOOD_TEST:   { label: 'Blood Test',   bg: '#DBEAFE', color: '#1E40AF' },
  IMAGING:      { label: 'Imaging',      bg: '#EDE9FE', color: '#5B21B6' },
  PRESCRIPTION: { label: 'Prescription', bg: '#FEF9C3', color: '#854D0E' },
  GENERAL:      { label: 'General',      bg: '#DCFCE7', color: '#166534' },
}

// ─── HealthRecords tab ───────────────────────────────────────────────────────

function HealthRecords() {
  const fileRef = useRef(null)
  const [dragging, setDragging]       = useState(false)
  const [analyzing, setAnalyzing]     = useState(false)
  const [step, setStep]               = useState('')
  const [currentResult, setCurrentResult] = useState(null)
  const [savedReports, setSavedReports]   = useState(loadSavedReports)
  const [viewingReport, setViewingReport] = useState(null)

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['pdf', 'jpg', 'jpeg', 'png']
    const ext = file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      toast.error('Only PDF, JPG, PNG files are supported.')
      return
    }
    setAnalyzing(true)
    setCurrentResult(null)
    setViewingReport(null)
    try {
      const result = await analyzeReportAgent(file, setStep)
      setCurrentResult(result)
      setSavedReports(loadSavedReports())
      toast.success('Analysis complete! 🎉')
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please try again.')
    }
    setAnalyzing(false)
    setStep('')
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const deleteReport = (key) => {
    localStorage.removeItem(key)
    setSavedReports(loadSavedReports())
    if (viewingReport?.key === key) setViewingReport(null)
    if (currentResult?.key === key) setCurrentResult(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !analyzing && fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#4F46E5' : '#CBD5E1'}`,
          borderRadius: 20,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: analyzing ? 'not-allowed' : 'pointer',
          background: dragging ? '#EEF2FF' : '#F8FAFC',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 6 }}>
          Upload Medical Report
        </div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
          Drag & drop or click to browse · PDF, JPG, PNG supported
        </div>
        <button
          disabled={analyzing}
          style={{
            background: analyzing ? '#94A3B8' : 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            color: 'white', border: 'none', borderRadius: 50,
            padding: '10px 28px', fontWeight: 600, fontSize: 14,
            cursor: analyzing ? 'not-allowed' : 'pointer',
          }}
        >
          {analyzing ? '⏳ Analyzing...' : '🔍 Browse & Analyze'}
        </button>
      </div>

      {/* Loading steps */}
      {analyzing && (
        <div style={{ background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius: 16, padding: '20px 24px', border: '1px solid #C7D2FE' }}>
          <div style={{ fontWeight: 700, color: '#3730A3', marginBottom: 14, fontSize: 14 }}>🤖 VitaCare AI is working...</div>
          {['📄 Reading your report...', '🧠 Classifying report type...', '🔬 Extracting test values...', '💡 Generating health insights...'].map((s, i) => {
            const stepIdx = ['📄', '🧠', '🔬', '💡'].findIndex(e => step.startsWith(e))
            const done = stepIdx > i
            const active = stepIdx === i
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, opacity: done || active ? 1 : 0.35 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: done ? '#10B981' : active ? '#4F46E5' : '#E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: 'white', fontWeight: 700,
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, color: active ? '#3730A3' : done ? '#166534' : '#64748B', fontWeight: active ? 600 : 400 }}>{s}</span>
                {active && <span style={{ fontSize: 11, color: '#4F46E5', animation: 'pulse 1s infinite' }}>●</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* Current analysis result */}
      {currentResult && !analyzing && (
        <InsightCard result={currentResult} onClose={() => setCurrentResult(null)} />
      )}

      {/* Previous Reports */}
      {savedReports.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 12 }}>
            📂 Previous Reports ({savedReports.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedReports.map(r => {
              const typeInfo = TYPE_LABELS[r.reportType] || TYPE_LABELS.GENERAL
              const isViewing = viewingReport?.key === r.key
              return (
                <div key={r.key}>
                  <div style={{
                    background: 'white', border: '1px solid #E2E8F0', borderRadius: 14,
                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    {/* Status dot */}
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      background: r.hasAbnormal ? '#EF4444' : '#10B981',
                    }} />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                          {r.fileName}
                        </span>
                        <span style={{ background: typeInfo.bg, color: typeInfo.color, padding: '1px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {typeInfo.label}
                        </span>
                        {r.hasAbnormal && (
                          <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                            ⚠️ Abnormal
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>📅 {r.date}</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => { setViewingReport(isViewing ? null : r); setCurrentResult(null) }}
                        style={{
                          background: isViewing ? '#EEF2FF' : 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                          color: isViewing ? '#4F46E5' : 'white',
                          border: isViewing ? '1px solid #C7D2FE' : 'none',
                          borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {isViewing ? 'Close' : 'View Analysis'}
                      </button>
                      <button
                        onClick={() => deleteReport(r.key)}
                        style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Inline InsightCard for this report */}
                  {isViewing && (
                    <div style={{ marginTop: 8 }}>
                      <InsightCard result={r} onClose={() => setViewingReport(null)} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {savedReports.length === 0 && !analyzing && !currentResult && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🩺</div>
          <div style={{ fontSize: 14 }}>No reports uploaded yet. Upload your first report above!</div>
        </div>
      )}
    </div>
  )
}

// ─── Profile tab ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const { backendUrl, token, userData, setUserData, loadUserProfileData } = useAppContext()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({})
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    if (userData) setForm({
      name:    userData.name    || '',
      phone:   userData.phone   || '',
      address: userData.address || { line1: '', line2: '' },
      gender:  userData.gender  || '',
      dob:     userData.dob     || '',
    })
  }, [userData])

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        { ...form, address: JSON.stringify(form.address) },
        { headers: { token } }
      )
      if (data.success) { toast.success('Profile updated!'); await loadUserProfileData(); setEditing(false) }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    setSaving(false)
  }

  if (!userData) return <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>Loading profile...</div>

  const fields = [
    { label: 'Full Name',   key: 'name',   type: 'text' },
    { label: 'Phone',       key: 'phone',  type: 'tel' },
    { label: 'Gender',      key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { label: 'Date of Birth', key: 'dob', type: 'date' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: getAvatarColor(userData.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 22, flexShrink: 0 }}>
          {getInitials(userData.name)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#0F172A' }}>{userData.name}</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{userData.email}</div>
        </div>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          disabled={saving}
          style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : editing ? 'Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
        {fields.map(f => (
          <div key={f.key} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{f.label}</div>
            {editing ? (
              f.type === 'select'
                ? <select value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: '#0F172A', background: 'transparent' }}>
                    <option value="">Select</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                : <input type={f.type} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: '#0F172A', background: 'transparent' }} />
            ) : (
              <div style={{ fontSize: 14, color: form[f.key] ? '#0F172A' : '#CBD5E1' }}>{form[f.key] || '—'}</div>
            )}
          </div>
        ))}

        {/* Address */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', gridColumn: 'span 2' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Address</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input placeholder="Line 1" value={form.address?.line1 || ''} onChange={e => setForm(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                style={{ border: 'none', borderBottom: '1px solid #E2E8F0', outline: 'none', fontSize: 14, color: '#0F172A', paddingBottom: 4, width: '100%' }} />
              <input placeholder="Line 2" value={form.address?.line2 || ''} onChange={e => setForm(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                style={{ border: 'none', borderBottom: '1px solid #E2E8F0', outline: 'none', fontSize: 14, color: '#0F172A', paddingBottom: 4, width: '100%' }} />
            </div>
          ) : (
            <div style={{ fontSize: 14, color: form.address?.line1 ? '#0F172A' : '#CBD5E1' }}>
              {form.address?.line1 ? `${form.address.line1}${form.address.line2 ? ', ' + form.address.line2 : ''}` : '—'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main MyProfile page ──────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',  label: '👤 Profile' },
  { id: 'records',  label: '🩺 Health Records' },
]

export default function MyProfile() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { token } = useAppContext()

  const [tab, setTab] = useState(location.hash === '#records' ? 'records' : 'profile')

  useEffect(() => {
    if (location.hash === '#records') setTab('records')
  }, [location.hash])

  if (!token) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
      Please <a href="/login" style={{ color: '#4F46E5' }}>login</a> to view your profile.
    </div>
  )

  return (
    <div className="py-8 page-enter">
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>My Dashboard</h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 24, gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 600, border: 'none', background: 'none',
              cursor: 'pointer', color: tab === t.id ? '#4F46E5' : '#64748B',
              borderBottom: tab === t.id ? '2px solid #4F46E5' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileTab />}
      {tab === 'records' && <HealthRecords />}
    </div>
  )
}
