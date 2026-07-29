import type { ReactNode } from 'react'
import type { TargetLanguageCode } from '../constants/languages'
import { getLanguageByCode } from '../constants/languages'
import { CopyTranslationButton } from './CopyTranslationButton'
import { ListenTranslationButton } from './ListenTranslationButton'
import { Spinner3DotsFade } from './Spinner3DotsFade'

type TranslationResultsProps = {
    language: TargetLanguageCode
    text: string
    hasSourceText: boolean
    isTranslating: boolean
}

export function TranslationResults({
    language,
    text,
    hasSourceText,
    isTranslating,
}: TranslationResultsProps) {
    const meta = getLanguageByCode(language)
    const label = meta?.label ?? language
    const blockId = `out-${language}`

    let body: ReactNode = null
    if (hasSourceText && isTranslating) {
        body = (
            <div className="flex items-center justify-center py-6">
                <Spinner3DotsFade className="scale-110" />
            </div>
        )
    } else if (hasSourceText && text) {
        body = text
    }

    return (
        <section aria-labelledby="translation-results-heading">
            <h2
                id="translation-results-heading"
                className="mb-3 text-sm font-semibold tracking-tight text-slate-900"
            >
                Kết quả dịch
            </h2>

            <article
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                aria-labelledby={`${blockId}-title`}
            >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h3
                            id={`${blockId}-title`}
                            className="text-base font-semibold text-slate-900"
                        >
                            {meta?.nativeLabel ?? language}
                        </h3>
                        <p className="text-xs text-slate-500">{label}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <ListenTranslationButton
                            text={text}
                            speechLang={meta?.speechLang ?? meta?.htmlLang ?? 'en-US'}
                            languageLabel={label}
                            disabled={isTranslating}
                        />
                        <CopyTranslationButton
                            text={text}
                            languageLabel={label}
                            disabled={isTranslating}
                        />
                    </div>
                </div>

                <div
                    id={blockId}
                    lang={meta?.htmlLang}
                    dir="auto"
                    className={
                        hasSourceText
                            ? 'min-h-[3.5rem] whitespace-pre-wrap break-words rounded-xl bg-slate-50 px-3 py-3 text-base leading-relaxed text-slate-900 sm:text-[1.0625rem]'
                            : 'min-h-0'
                    }
                >
                    {body}
                </div>
            </article>
        </section>
    )
}
