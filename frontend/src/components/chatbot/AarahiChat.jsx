import { useState, useEffect, useRef, useCallback } from 'react'
import { getAarahiResponse } from '../../utils/aarahiFallback'
import { speak, stopSpeaking, createSpeechRecognition, isMicSupported } from '../../utils/voiceHelper'

const QUICK_REPLIES = [
  'I have a headache', 'Feeling tired', 'Check symptoms',
  'Book a doctor', 'Find specialist', 'Analyze report',
]

function AarahiAvatar({ state, size = 80 }) {
  const isOpen = state === 'speaking'
  const isListen = state === 'listening'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aaFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* bg circle */}
      <circle cx="50" cy="50" r="48" fill="url(#aaFaceGrad)" />
      {/* neck */}
      <rect x="43" y="74" width="14" height="10" rx="4" fill="#fde8d8" />
      {/* ears */}
      <ellipse cx="20" cy="52" rx="5" ry="7" fill="#fde8d8" />
      <ellipse cx="80" cy="52" rx="5" ry="7" fill="#fde8d8" />
      {/* earring */}
      <circle cx="80" cy="58" r="2.5" fill="#fbbf24" />
      {/* face */}
      <ellipse cx="50" cy="52" rx="28" ry="32" fill="#fde8d8" />
      {/* hair */}
      <path d="M22 42 Q24 18 50 16 Q76 18 78 42 Q72 28 50 26 Q28 28 22 42Z" fill="#3b0764" />
      {/* eyebrows */}
      <path d="M33 38 Q38 35 43 37" stroke="#3b0764" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M57 37 Q62 35 67 38" stroke="#3b0764" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="38" cy={isListen ? 44 : 45} rx="5" ry={isListen ? 6 : 5} fill="#1e1b4b" />
      <ellipse cx="62" cy={isListen ? 44 : 45} rx="5" ry={isListen ? 6 : 5} fill="#1e1b4b" />
      <circle cx="40" cy="43" r="1.5" fill="white" />
      <circle cx="64" cy="43" r="1.5" fill="white" />
      {/* nose */}
      <path d="M48 52 Q50 56 52 52" stroke="#e8b4a0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <ellipse cx="30" cy="58" rx="7" ry="4" fill="#f9a8d4" opacity="0.4" />
      <ellipse cx="70" cy="58" rx="7" ry="4" fill="#f9a8d4" opacity="0.4" />
      {/* mouth */}
      {isOpen ? (
        <ellipse cx="50" cy="66" rx="7" ry="5" fill="#be185d" />
      ) : (
        <path d="M42 64 Q50 70 58 64" stroke="#be185d" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="flex items-end gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-indigo-400 inline-block typing-dot"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

function SoundWave({ active }) {
  if (!active) return null
  return (
    <div className="flex items-center gap-0.5 h-8 px-2">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <span key={i} className="w-1 rounded-full bg-indigo-500 sound-bar"
          style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

let msgIdCounter = Date.now()
function makeId() { return ++msgIdCounter }

export default function AarahiChat() {
  const [isOpen, setIsOpen]       = useState(false)
  const [messages, setMessages]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('prescripto-chat') || '[]') } catch { return [] }
  })
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping]   = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted]     = useState(() => localStorage.getItem('prescripto-muted') === 'true')
  const [unread, setUnread]       = useState(0)
  const [aarahiState, setAarahiState] = useState('idle')
  const [showQuick, setShowQuick] = useState(true)

  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const recognRef   = useRef(null)
  const greetedRef  = useRef(false)

  // persist messages
  useEffect(() => {
    const trimmed = messages.slice(-30)
    localStorage.setItem('prescripto-chat', JSON.stringify(trimmed))
  }, [messages])

  // persist mute
  useEffect(() => {
    localStorage.setItem('prescripto-muted', isMuted)
  }, [isMuted])

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // greeting on first open
  useEffect(() => {
    if (!isOpen || greetedRef.current || messages.length > 0) return
    greetedRef.current = true
    const hour = new Date().getHours()
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const msg = `${greet}! 😊 I'm Aarohi, your health assistant on Prescripto. How are you feeling today? I'm here to help! 💙`
    setTimeout(() => {
      addMessage('assistant', msg)
      if (!isMuted) speak(msg, {
        onStart: () => { setIsSpeaking(true); setAarahiState('speaking') },
        onEnd:   () => { setIsSpeaking(false); setAarahiState('idle') },
      })
    }, 500)
  }, [isOpen])

  // focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const addMessage = useCallback((role, text) => {
    setMessages(prev => [...prev, { id: makeId(), role, text, ts: Date.now() }])
  }, [])

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return
    setShowQuick(false)
    addMessage('user', text)
    setInputText('')
    setIsTyping(true)
    setAarahiState('thinking')

    const delay = Math.random() * 700 + 800
    setTimeout(() => {
      const response = getAarahiResponse(text)
      addMessage('assistant', response)
      setIsTyping(false)
      setAarahiState('idle')
      if (!isMuted) {
        speak(response, {
          onStart: () => { setIsSpeaking(true); setAarahiState('speaking') },
          onEnd:   () => { setIsSpeaking(false); setAarahiState('idle') },
        })
      }
    }, delay)
  }, [addMessage, isMuted])

  const handleOpen = () => {
    setIsOpen(true)
    setUnread(0)
  }

  const handleClose = () => {
    stopSpeaking()
    setIsSpeaking(false)
    setAarahiState('idle')
    setIsOpen(false)
  }

  const handleSend = () => sendMessage(inputText)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const toggleMic = () => {
    if (isListening) {
      recognRef.current?.stop()
      setIsListening(false)
      setAarahiState('idle')
      return
    }
    const recog = createSpeechRecognition(
      (transcript) => {
        setInputText(transcript)
        setIsListening(false)
        setAarahiState('idle')
        setTimeout(() => sendMessage(transcript), 500)
      },
      () => { setIsListening(false); setAarahiState('idle') }
    )
    if (!recog) return
    recognRef.current = recog
    recog.start()
    setIsListening(true)
    setAarahiState('listening')
  }

  const toggleMute = () => {
    if (!isMuted) stopSpeaking()
    setIsMuted(m => !m)
  }

  const micSupported = isMicSupported()

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {/* Chat panel */}
        {isOpen && (
          <div className="chat-panel w-[380px] max-w-[calc(100vw-48px)] h-[520px] bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative flex flex-col items-center pt-5 pb-4 px-4 overflow-hidden flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed, #06b6d4)', borderRadius: '24px 24px 0 0' }}>
              {/* Decorative circles */}
              <div className="absolute top-[-20px] left-[-20px] w-32 h-32 rounded-full bg-white/10 float-circle" style={{ animationDelay: '0s' }} />
              <div className="absolute bottom-[-30px] right-[-10px] w-24 h-24 rounded-full bg-white/10 float-circle" style={{ animationDelay: '2s' }} />
              <div className="absolute top-4 right-20 w-12 h-12 rounded-full bg-white/10 float-circle" style={{ animationDelay: '4s' }} />

              {/* Top buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm transition-colors">
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AarahiAvatar state={aarahiState} size={72} />
              <p className="text-white font-semibold text-base mt-2">Aarohi</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${aarahiState === 'thinking' ? 'bg-amber-400 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-white/80 text-xs">
                  {aarahiState === 'thinking' ? 'Thinking...' : 'Health Assistant'}
                </span>
                <SoundWave active={isSpeaking} />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>A</div>
                  )}
                  <div className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-[18px_18px_4px_18px] msg-user'
                      : 'text-gray-700 bg-white border border-slate-200 rounded-[18px_18px_18px_4px] msg-bot'
                  }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' } : { borderLeft: '3px solid rgba(95,111,255,0.4)' }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              {showQuick && messages.length <= 1 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {QUICK_REPLIES.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>A</div>
                  <div className="bg-white border border-slate-200 rounded-[18px_18px_18px_4px]"
                    style={{ borderLeft: '3px solid rgba(95,111,255,0.4)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 px-3 py-3 rounded-b-3xl">
              <div className="flex items-center gap-2">
                {micSupported && (
                  <button onClick={toggleMic}
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all relative ${
                      isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>
                    {isListening && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50" />}
                    {isListening ? (
                      <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>
                )}
                <input ref={inputRef} value={inputText} onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type or speak to Aarohi..."
                  className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition-all" />
                <button onClick={handleSend} disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Aarohi provides general health info · Not medical advice
              </p>
            </div>
          </div>
        )}

        {/* FAB button */}
        <div className="relative">
          <span className="absolute inset-0 rounded-full glow-ring" />
          {unread > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-10 font-bold">
              {unread}
            </span>
          )}
          <button onClick={isOpen ? handleClose : handleOpen}
            title="Chat with Aarohi"
            className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
            style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>
            {isOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <AarahiAvatar state="idle" size={44} />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
