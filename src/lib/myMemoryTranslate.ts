import type { TargetLanguageCode } from '../constants/languages'
import { getLanguageByCode } from '../constants/languages'

/** @see https://mymemory.translated.net/doc/spec.php */
export const MYMEMORY_GET_URL = 'https://api.mymemory.translated.net/get'

type MyMemoryResponse = {
    responseData?: { translatedText?: string }
    responseDetails?: string
    responseStatus?: number
    quotaFinished?: boolean
}

function reasonMessage(reason: unknown): string {
    if (reason instanceof Error) return reason.message
    if (typeof reason === 'string') return reason
    return 'Lỗi không xác định'
}

async function translateOne(
    text: string,
    langpairTarget: string,
    signal: AbortSignal,
): Promise<string> {
    const url = new URL(MYMEMORY_GET_URL)
    url.searchParams.set('q', text)
    url.searchParams.set('langpair', `vi|${langpairTarget}`)

    const res = await fetch(url, { method: 'GET', signal })
    const raw = await res.text()

    let data: MyMemoryResponse
    try {
        data = JSON.parse(raw) as MyMemoryResponse
    } catch {
        throw new Error(raw.slice(0, 200) || `HTTP ${res.status}`)
    }

    if (!res.ok || (data.responseStatus != null && data.responseStatus !== 200)) {
        throw new Error(
            data.responseDetails ||
            (data.responseStatus != null
                ? `MYMEMORY ${data.responseStatus}`
                : `HTTP ${res.status}`),
        )
    }

    const translated = data.responseData?.translatedText
    if (!translated) {
        throw new Error(
            data.responseDetails ||
            (data.quotaFinished ? 'Hết quota miễn phí.' : 'Không có bản dịch.'),
        )
    }

    return translated
}

/** Nhiều ngôn ngữ đích — mỗi cặp vi|xx một request GET song song. */
export async function translateMyMemoryBatch(
    text: string,
    targets: TargetLanguageCode[],
    signal: AbortSignal,
): Promise<{
    results: Partial<Record<TargetLanguageCode, string>>
    errors: string[]
}> {
    const settled = await Promise.allSettled(
        targets.map(async (code) => {
            const to = getLanguageByCode(code)?.myMemoryTo ?? code
            return { code, translated: await translateOne(text, to, signal) }
        }),
    )

    return settled.reduce(
        (acc, s, i) => {
            const code = targets[i]
            if (s.status === 'fulfilled') {
                acc.results[s.value.code] = s.value.translated
            } else {
                acc.errors.push(`${code}: ${reasonMessage(s.reason)}`)
            }
            return acc
        },
        {
            results: {} as Partial<Record<TargetLanguageCode, string>>,
            errors: [] as string[],
        },
    )
}
