import { useRef, useState } from 'react'
import v1 from '../video/1.mp4'
import v2 from '../video/2.mp4'
import v3 from '../video/3.mp4'
import v4 from '../video/4.mp4'

const VIDEOS = [
  { src: v1, title: 'The Problem: Patient Frustration',  duration: '0:45', tag: 'Getting Started' },
  { src: v2, title: 'Smart Booking with VitaCare',       duration: '0:38', tag: 'AI Feature'      },
  { src: v3, title: 'All-in-One Health Management',      duration: '0:52', tag: 'Doctors'         },
  { src: v4, title: 'Zero Wait, Instant Care',           duration: '1:00', tag: 'Dashboard'       },
]

const TAG_COLORS = {
  'Getting Started': { bg: '#DBEAFE', color: '#1E40AF' },
  'AI Feature':      { bg: '#EDE9FE', color: '#5B21B6' },
  'Doctors':         { bg: '#DCFCE7', color: '#166534' },
  'Dashboard':       { bg: '#FEF9C3', color: '#854D0E' },
}

function VideoCard({ video }) {
  const videoRef  = useRef(null)
  const [playing, setPlaying]   = useState(false)
  const [hovered, setHovered]   = useState(false)

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else         { el.play();  setPlaying(true)  }
  }

  const tagStyle = TAG_COLORS[video.tag] || { bg: '#F1F5F9', color: '#475569' }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: 'white',
        border: '1px solid #E2E8F0',
        boxShadow: hovered
          ? '0 20px 48px rgba(79,70,229,0.18), 0 4px 12px rgba(0,0,0,0.08)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'pointer',
        flexShrink: 0,
        width: '100%',
      }}
      onClick={toggle}
    >
      {/* Video wrapper */}
      <div style={{ position: 'relative', background: '#0F172A', aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          src={video.src}
          controls={playing}
          muted
          loop
          playsInline
          onEnded={() => setPlaying(false)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Play overlay — hide when playing */}
        {!playing && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.2s',
          }}>
            {/* Play button circle */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transform: hovered ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.25s ease',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#4F46E5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(0,0,0,0.72)',
          color: 'white', fontSize: 11, fontWeight: 700,
          padding: '3px 8px', borderRadius: 6,
          fontFamily: 'monospace',
          backdropFilter: 'blur(4px)',
        }}>
          {video.duration}
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
            background: tagStyle.bg, color: tagStyle.color,
            textTransform: 'uppercase', letterSpacing: 0.4,
          }}>
            {video.tag}
          </span>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', lineHeight: 1.4, margin: 0 }}>
          {video.title}
        </p>
      </div>
    </div>
  )
}

export default function QuickVideos() {
  return (
    <section style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#EEF2FF', borderRadius: 50,
          padding: '6px 16px', marginBottom: 12,
        }}>
          <span style={{ fontSize: 14 }}>▶️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Video Guides
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
          Quick Short Videos
        </h2>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Discover quick tips and feature highlights — all under 1 minute.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
      }}>
        {VIDEOS.map((v, i) => <VideoCard key={i} video={v} />)}
      </div>
    </section>
  )
}
