import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { TargetLanguageCode } from '../constants/languages'
import { translateMyMemoryBatch } from '../lib/myMemoryTranslate'
import { LanguageSelect } from './LanguageSelect'
import { PageHeader } from './PageHeader'
import { SourceTextarea } from './SourceTextarea'
import { TranslationResults } from './TranslationResults'

const SOURCE_FIELD_ID = 'source-vi-text'
/** Debounce tránh spam API mỗi lần gõ. */
const DEBOUNCE_MS = 2000

function isAbortError(e: unknown): boolean {
    return e instanceof DOMException && e.name === 'AbortError'
}

export function TranslateWorkspace() {
    const [sourceText, setSourceText] = useState('')
    const [selected, setSelected] = useState<TargetLanguageCode>('en')
    const [results, setResults] = useState<
        Partial<Record<TargetLanguageCode, string>>
    >({})
    const [loading, setLoading] = useState(false)

    const trimmed = sourceText.trim()
    const hasSource = trimmed.length > 0

    useEffect(() => {
        const ac = new AbortController()

        if (!hasSource) {
            return () => ac.abort()
        }

        const timer = window.setTimeout(() => {
            void (async () => {
                if (ac.signal.aborted) return
                setLoading(true)
                setResults({})
                try {
                    const { results: next, errors } = await translateMyMemoryBatch(
                        trimmed,
                        [selected],
                        ac.signal,
                    )
                    if (ac.signal.aborted) return
                    setResults(next)
                    if (errors.length) toast.error(errors.join(' '))
                } catch (e) {
                    if (ac.signal.aborted || isAbortError(e)) return
                    const msg = e instanceof Error ? e.message : 'Lỗi không xác định'
                    toast.error(`Dịch thất bại: ${msg}`)
                    setResults({})
                } finally {
                    if (!ac.signal.aborted) setLoading(false)
                }
            })()
        }, DEBOUNCE_MS)

        return () => {
            window.clearTimeout(timer)
            ac.abort()
            setLoading(false)
        }
    }, [hasSource, trimmed, selected])

    return (
        <div className="min-h-dvh bg-linear-to-b from-slate-50 to-white pb-16 pt-6 sm:pb-20 sm:pt-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <PageHeader />

                <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                    <LanguageSelect value={selected} onChange={setSelected} />
                    <SourceTextarea
                        id={SOURCE_FIELD_ID}
                        value={sourceText}
                        onChange={setSourceText}
                    />
                    <TranslationResults
                        language={selected}
                        text={hasSource ? (results[selected] ?? '') : ''}
                        hasSourceText={hasSource}
                        isTranslating={loading && hasSource}
                    />
                </div>
            </div>
        </div>
    )
}
