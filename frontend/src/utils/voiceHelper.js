export function createSpeechRecognition(onResult, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const recognition = new SR()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = 'en-US'
  recognition.onresult = (e) => {
    const transcript = e.results[e.resultIndex][0].transcript
    if (e.results[e.resultIndex].isFinal) onResult(transcript)
  }
  recognition.onend = onEnd
  return recognition
}

export function speak(text, settings = {}) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const clean = text
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[😊😔🤒🚨💙]/g, '')
    .trim()
  const utterance = new SpeechSynthesisUtterance(clean)
  const voices = window.speechSynthesis.getVoices()
  const femaleVoice =
    voices.find(v => v.name.includes('Samantha')) ||
    voices.find(v => v.name.includes('Victoria')) ||
    voices.find(v => v.name.includes('Raveena')) ||
    voices.find(v => v.lang === 'en-IN') ||
    voices.find(v => v.lang === 'en-US') ||
    voices[0]
  if (femaleVoice) utterance.voice = femaleVoice
  utterance.rate = settings.rate ?? 0.9
  utterance.pitch = settings.pitch ?? 1.1
  utterance.volume = 0.9
  utterance.onstart = settings.onStart
  utterance.onend = settings.onEnd
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.speak(utterance)
  } else {
    window.speechSynthesis.speak(utterance)
  }
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window
}

export function isMicSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}
