import type { TargetLanguageCode } from '../constants/languages'
import { getLanguageByCode } from '../constants/languages'
import { CopyTranslationButton } from './CopyTranslationButton'
import { Spinner3DotsFade } from './Spinner3DotsFade'

type TranslationResultsProps = {
  orderedCodes: TargetLanguageCode[]
  results: Partial<Record<TargetLanguageCode, string>>
  hasSourceText: boolean
  isTranslating: boolean
}

export function TranslationResults({
  orderedCodes,
  results,
  hasSourceText,
  isTranslating,
}: TranslationResultsProps) {
  return (
    <section aria-labelledby="translation-results-heading">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2
          id="translation-results-heading"
          className="text-sm font-semibold tracking-tight text-slate-900"
        >
          Kết quả dịch
        </h2>
      </div>

      <div className="space-y-4">
        {orderedCodes.map((code) => {
          const meta = getLanguageByCode(code)
          const text = results[code] ?? ''
          const blockId = `out-${code}`

          return (
            <article
              key={code}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              aria-labelledby={`${blockId}-title`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3
                    id={`${blockId}-title`}
                    className="text-base font-semibold text-slate-900"
                  >
                    {meta?.nativeLabel ?? code}
                  </h3>
                  <p className="text-xs text-slate-500">{meta?.label}</p>
                </div>
                <CopyTranslationButton
                  text={text}
                  languageLabel={meta?.label ?? code}
                  disabled={isTranslating}
                />
              </div>
              <div
                id={blockId}
                lang={meta?.htmlLang}
                dir="auto"
                className={
                  hasSourceText
                    ? 'min-h-[3.5rem] whitespace-pre-wrap break-words rounded-xl bg-slate-50 px-3 py-3 text-base leading-relaxed text-slate-900 sm:text-[1.0625rem]'
                    : 'min-h-0 whitespace-pre-wrap break-words rounded-xl bg-transparent px-0 py-0 text-base leading-relaxed text-slate-900 sm:text-[1.0625rem]'
                }
              >
                {!hasSourceText ? null : isTranslating ? (
                  <div className="flex items-center justify-center py-6">
                    <Spinner3DotsFade className="scale-110" />
                  </div>
                ) : text ? (
                  text
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
