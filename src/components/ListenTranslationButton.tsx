import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { toast } from 'sonner'
import { speakText, stopSpeaking } from '../lib/speakText'
import { ACTION_BUTTON_CLASS } from './actionButtonClass'

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
    const cancelRef = useRef<(() => void) | null>(null)

    useEffect(() => {
        return () => {
            cancelRef.current?.()
            cancelRef.current = null
            stopSpeaking()
        }
    }, [])

    function handleClick() {
        const trimmed = text.trim()
        if (!trimmed) return

        if (speaking) {
            cancelRef.current?.()
            cancelRef.current = null
            stopSpeaking()
            setSpeaking(false)
            return
        }

        try {
            setSpeaking(true)
            cancelRef.current = speakText(trimmed, speechLang, {
                onEnd: () => {
                    cancelRef.current = null
                    setSpeaking(false)
                },
                onError: (message) => toast.error(message),
            })
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Không thể phát âm.')
            setSpeaking(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!text.trim() || disabled}
            title={speaking ? 'Dừng phát âm' : 'Nghe bản dịch vừa nhận'}
            aria-label={
                speaking
                    ? `Dừng nghe — ${languageLabel}`
                    : `Nghe bản dịch — ${languageLabel}`
            }
            aria-pressed={speaking}
            className={ACTION_BUTTON_CLASS}
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
