type SpeakOptions = {
    onEnd?: () => void
    onError?: (message: string) => void
}

function hasSpeech(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(speechLang: string): SpeechSynthesisVoice | undefined {
    const primary = speechLang.toLowerCase()
    const base = primary.split('-')[0]
    const voices = window.speechSynthesis.getVoices()

    return (
        voices.find((v) => v.lang.toLowerCase() === primary) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(`${base}-`)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(base))
    )
}

/**
 * Đọc văn bản bằng Web Speech API.
 * Trả về hàm hủy để tránh race khi load voices / unmount.
 */
export function speakText(
    text: string,
    speechLang: string,
    options: SpeakOptions = {},
): () => void {
    if (!hasSpeech()) {
        throw new Error('Trình duyệt không hỗ trợ đọc văn bản (Speech Synthesis).')
    }

    const trimmed = text.trim()
    if (!trimmed) return () => undefined

    let cancelled = false
    let fallbackTimer = 0

    window.speechSynthesis.cancel()

    const start = () => {
        if (cancelled) return

        const utter = new SpeechSynthesisUtterance(trimmed)
        utter.lang = speechLang

        const match = pickVoice(speechLang)
        if (match) {
            utter.voice = match
            utter.lang = match.lang
        }

        utter.onend = () => {
            if (!cancelled) options.onEnd?.()
        }
        utter.onerror = (e) => {
            // cancel() cố ý → không toast lỗi
            if (cancelled || e.error === 'interrupted' || e.error === 'canceled') {
                options.onEnd?.()
                return
            }
            options.onError?.('Không thể phát âm bản dịch.')
            options.onEnd?.()
        }

        window.speechSynthesis.speak(utter)
    }

    const cleanupVoices = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
        window.clearTimeout(fallbackTimer)
    }

    const onVoices = () => {
        cleanupVoices()
        start()
    }

    // Chrome: getVoices() đôi khi rỗng lần đầu
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', onVoices)
        fallbackTimer = window.setTimeout(() => {
            cleanupVoices()
            start()
        }, 400)
    } else {
        start()
    }

    return () => {
        cancelled = true
        cleanupVoices()
        window.speechSynthesis.cancel()
    }
}

export function stopSpeaking(): void {
    if (!hasSpeech()) return
    window.speechSynthesis.cancel()
}
