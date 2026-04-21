export type TargetLanguageCode =
  | 'en'
  | 'ko'
  | 'ja'
  | 'zh'
  | 'th'
  | 'ru'

export type TargetLanguage = {
  code: TargetLanguageCode
  /** BCP 47 / HTML lang */
  htmlLang: string
  /** Phần sau `vi|` trong tham số langpair MyMemory */
  myMemoryTo: string
  label: string
  nativeLabel: string
}

export const TARGET_LANGUAGES: readonly TargetLanguage[] = [
  { code: 'en', htmlLang: 'en', myMemoryTo: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ko', htmlLang: 'ko', myMemoryTo: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'ja', htmlLang: 'ja', myMemoryTo: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  {
    code: 'zh',
    htmlLang: 'zh-Hans',
    myMemoryTo: 'zh-CN',
    label: 'Chinese',
    nativeLabel: '中文',
  },
  { code: 'th', htmlLang: 'th', myMemoryTo: 'th', label: 'Thai', nativeLabel: 'ไทย' },
  { code: 'ru', htmlLang: 'ru', myMemoryTo: 'ru', label: 'Russian', nativeLabel: 'Русский' },
] as const

export function getLanguageByCode(
  code: TargetLanguageCode,
): TargetLanguage | undefined {
  return TARGET_LANGUAGES.find((l) => l.code === code)
}
