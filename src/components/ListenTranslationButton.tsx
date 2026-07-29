import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { toast } from 'sonner'
import { speakText, stopSpeaking } from '../lib/speakText'

type ListenTranslationButtonProps = {
  text: string
  speechLang: string
  languageLabel: string
  disabled?: boolean
}

export function ListenTranslationButton({
  text,
  speechLang,
  languageLabel,
  disabled,
}: ListenTranslationButtonProps) {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  function handleClick() {
    if (!text.trim()) return

    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }

    try {
      setSpeaking(true)
      speakText(text, speechLang, {
        onEnd: () => setSpeaking(false),
        onError: (message) => {
          toast.error(message)
          setSpeaking(false)
        },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Không thể phát âm.'
      toast.error(msg)
      setSpeaking(false)
    }
  }

  const isDisabled = !text.trim() || disabled
  const label = speaking
    ? `Dừng nghe — ${languageLabel}`
    : `Nghe bản dịch — ${languageLabel}`

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      title={speaking ? 'Dừng phát âm' : 'Nghe bản dịch vừa nhận'}
      aria-label={label}
      aria-pressed={speaking}
      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      {speaking ? (
        <VolumeX className="h-4 w-4 text-indigo-600" aria-hidden strokeWidth={2} />
      ) : (
        <Volume2 className="h-4 w-4 text-slate-600" aria-hidden strokeWidth={2} />
      )}
      <span>{speaking ? 'Dừng' : 'Nghe'}</span>
    </button>
  )
}
