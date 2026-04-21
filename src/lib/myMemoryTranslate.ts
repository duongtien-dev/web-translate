import type { TargetLanguageCode } from '../constants/languages'
import { getLanguageByCode } from '../constants/languages'

/** @see https://mymemory.translated.net/doc/spec.php */
export const MYMEMORY_GET_URL = 'https://api.mymemory.translated.net/get'

type MyMemoryResponse = {
  responseData?: {
    translatedText?: string
    match?: number
  }
  responseDetails?: string
  responseStatus?: number
  quotaFinished?: boolean
}

async function translateOne(
  text: string,
  langpairTarget: string,
  signal: AbortSignal,
): Promise<string> {
  const url = new URL(MYMEMORY_GET_URL)
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `vi|${langpairTarget}`)

  const res = await fetch(url.toString(), {
    method: 'GET',
    signal,
  })

  const raw = await res.text()
  let data: MyMemoryResponse
  try {
    data = JSON.parse(raw) as MyMemoryResponse
  } catch {
    throw new Error(raw.slice(0, 200) || `HTTP ${res.status}`)
  }

  if (!res.ok) {
    throw new Error(data.responseDetails || `HTTP ${res.status}`)
  }

  if (
    typeof data.responseStatus === 'number' &&
    data.responseStatus !== 200
  ) {
    throw new Error(
      data.responseDetails || `MYMEMORY ${data.responseStatus}`,
    )
  }

  const translated = data.responseData?.translatedText
  if (typeof translated !== 'string' || translated.length === 0) {
    const hint =
      data.responseDetails ||
      (data.quotaFinished ? 'Hết quota miễn phí.' : 'Không có bản dịch.')
    throw new Error(hint)
  }

  return translated
}

/**
 * Nhiều ngôn ngữ đích — mỗi cặp vi|xx một request GET song song.
 */
export async function translateMyMemoryBatch(
  text: string,
  targets: TargetLanguageCode[],
  signal: AbortSignal,
): Promise<{
  results: Partial<Record<TargetLanguageCode, string>>
  errors: string[]
}> {
  const results: Partial<Record<TargetLanguageCode, string>> = {}
  const errors: string[] = []

  const settled = await Promise.allSettled(
    targets.map(async (code) => {
      const meta = getLanguageByCode(code)
      const to = meta?.myMemoryTo ?? code
      const translated = await translateOne(text, to, signal)
      return { code, translated }
    }),
  )

  for (let i = 0; i < settled.length; i++) {
    const s = settled[i]
    const code = targets[i]
    if (s.status === 'fulfilled') {
      results[s.value.code] = s.value.translated
    } else {
      const reason = s.reason
      const m =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : 'Lỗi không xác định'
      errors.push(`${code}: ${m}`)
    }
  }

  return { results, errors }
}
