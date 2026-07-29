export type TargetLanguageCode =
  | 'en'
  | 'ko'
  | 'ja'
  | 'zh'
  | 'th'
  | 'ru'
  | 'kk'

export type TargetLanguage = {
  code: TargetLanguageCode
  /** BCP 47 / HTML lang */
  htmlLang: string
  /** Phần sau `vi|` trong tham số langpair MyMemory */
  myMemoryTo: string
  /** BCP 47 cho Web Speech API (SpeechSynthesis) */
  speechLang: string
  label: string
  nativeLabel: string
}

export const TARGET_LANGUAGES: readonly TargetLanguage[] = [
  {
    code: 'en',
    htmlLang: 'en',
    myMemoryTo: 'en',
    speechLang: 'en-US',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    code: 'ko',
    htmlLang: 'ko',
    myMemoryTo: 'ko',
    speechLang: 'ko-KR',
    label: 'Korean',
    nativeLabel: '한국어',
  },
  {
    code: 'ja',
    htmlLang: 'ja',
    myMemoryTo: 'ja',
    speechLang: 'ja-JP',
    label: 'Japanese',
    nativeLabel: '日本語',
  },
  {
    code: 'zh',
    htmlLang: 'zh-Hans',
    myMemoryTo: 'zh-CN',
    speechLang: 'zh-CN',
    label: 'Chinese',
    nativeLabel: '中文',
  },
  {
    code: 'th',
    htmlLang: 'th',
    myMemoryTo: 'th',
    speechLang: 'th-TH',
    label: 'Thai',
    nativeLabel: 'ไทย',
  },
  {
    code: 'ru',
    htmlLang: 'ru',
    myMemoryTo: 'ru',
    speechLang: 'ru-RU',
    label: 'Russian',
    nativeLabel: 'Русский',
  },
  {
    code: 'kk',
    htmlLang: 'kk',
    myMemoryTo: 'kk',
    speechLang: 'kk-KZ',
    label: 'Kazakh',
    nativeLabel: 'Қазақша',
  },
] as const

export function getLanguageByCode(
  code: TargetLanguageCode,
): TargetLanguage | undefined {
  return TARGET_LANGUAGES.find((l) => l.code === code)
}
