import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type CopyTranslationButtonProps = {
    text: string
    languageLabel: string
    disabled?: boolean
}

export function CopyTranslationButton({
    text,
    languageLabel,
    disabled,
}: CopyTranslationButtonProps) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            try {
                const ta = document.createElement('textarea')
                ta.value = text
                ta.setAttribute('readonly', '')
                ta.style.position = 'fixed'
                ta.style.left = '-9999px'
                document.body.appendChild(ta)
                ta.select()
                document.execCommand('copy')
                document.body.removeChild(ta)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2000)
            } catch {
                /* ignore */
            }
        }
    }

    const label = copied
        ? `Đã sao chép (${languageLabel})`
        : `Sao chép bản dịch — ${languageLabel}`

    const isDisabled = !text || disabled

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={isDisabled}
            title={
                copied
                    ? 'Đã sao chép vào clipboard'
                    : 'Sao chép toàn bộ nội dung khối này'
            }
            aria-label={label}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
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
