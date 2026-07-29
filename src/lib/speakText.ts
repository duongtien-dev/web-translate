type SpeakOptions = {
  onEnd?: () => void
  onError?: (message: string) => void
}

function pickVoice(speechLang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const primary = speechLang.toLowerCase()
  const base = primary.split('-')[0]

  return (
    voices.find((v) => v.lang.toLowerCase() === primary) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(`${base}-`)) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  )
}

/**
 * Đọc văn bản bằng Web Speech API (miễn phí, không cần API key).
 * Chọn giọng gần nhất với `speechLang` nếu trình duyệt có sẵn.
 */
export function speakText(
  text: string,
  speechLang: string,
  options: SpeakOptions = {},
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    throw new Error('Trình duyệt không hỗ trợ đọc văn bản (Speech Synthesis).')
  }

  const trimmed = text.trim()
  if (!trimmed) return

  window.speechSynthesis.cancel()

  const start = () => {
    const utter = new SpeechSynthesisUtterance(trimmed)
    utter.lang = speechLang

    const match = pickVoice(speechLang)
    if (match) {
      utter.voice = match
      utter.lang = match.lang
    }

    utter.onend = () => options.onEnd?.()
    utter.onerror = () => {
      options.onError?.('Không thể phát âm bản dịch.')
      options.onEnd?.()
    }

    window.speechSynthesis.speak(utter)
  }

  // Chrome đôi khi trả về danh sách giọng rỗng lần đầu — đợi voiceschanged.
  if (window.speechSynthesis.getVoices().length === 0) {
    const onVoices = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      start()
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoices)
    // Fallback nếu sự kiện không tới
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      if (!window.speechSynthesis.speaking) start()
    }, 400)
    return
  }

  start()
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
}
