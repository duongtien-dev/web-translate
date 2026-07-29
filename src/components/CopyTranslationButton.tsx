import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { ACTION_BUTTON_CLASS } from './actionButtonClass'

type CopyTranslationButtonProps = {
    text: string
    languageLabel: string
    disabled?: boolean
}

async function writeClipboard(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
    }

    // Fallback môi trường không có Clipboard API
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    if (!ok) throw new Error('Copy failed')
}

export function CopyTranslationButton({
    text,
    languageLabel,
    disabled,
}: CopyTranslationButtonProps) {
    const [copied, setCopied] = useState(false)
    const resetTimer = useRef(0)

    useEffect(() => {
        return () => window.clearTimeout(resetTimer.current)
    }, [])

    async function handleCopy() {
        if (!text) return
        try {
            await writeClipboard(text)
            setCopied(true)
            window.clearTimeout(resetTimer.current)
            resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Không thể sao chép vào clipboard.')
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!text || disabled}
            title={copied ? 'Đã sao chép vào clipboard' : 'Sao chép toàn bộ nội dung khối này'}
            aria-label={
                copied
                    ? `Đã sao chép (${languageLabel})`
                    : `Sao chép bản dịch — ${languageLabel}`
            }
            className={ACTION_BUTTON_CLASS}
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-600" aria-hidden strokeWidth={2.5} />
            ) : (
                <Copy className="h-4 w-4 text-slate-600" aria-hidden strokeWidth={2} />
            )}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
    )
}
