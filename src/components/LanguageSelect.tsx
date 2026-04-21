import { useId } from 'react'
import type { TargetLanguageCode } from '../constants/languages'
import { TARGET_LANGUAGES } from '../constants/languages'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../lib/ui/select'
import { FieldLabel } from './FieldLabel'

type LanguageSelectProps = {
    value: TargetLanguageCode
    onChange: (code: TargetLanguageCode) => void
    disabled?: boolean
}

function languageItemLabel(lang: (typeof TARGET_LANGUAGES)[number]) {
    return (
        <span className="flex flex-col items-start gap-0.5 py-0.5 text-left">
            <span className="font-medium leading-tight text-zinc-900">
                {lang.nativeLabel}
            </span>
            <span className="text-xs font-normal leading-tight text-zinc-500">
                {lang.label}
            </span>
        </span>
    )
}

export function LanguageSelect({ value, onChange, disabled }: LanguageSelectProps) {
    const triggerId = useId()

    return (
        <div className="w-full">
            <FieldLabel>Ngôn ngữ đích</FieldLabel>

            <Select
                value={value}
                onValueChange={(v) => onChange(v as TargetLanguageCode)}
                disabled={disabled}
            >
                <SelectTrigger
                    id={triggerId}
                    title="Chọn một ngôn ngữ đích"
                    className="h-auto min-h-11 cursor-pointer rounded-xl border-indigo-200 bg-indigo-50/80 py-2.5 text-left hover:bg-indigo-50/90 data-[state=open]:border-indigo-400 data-[state=open]:ring-2 data-[state=open]:ring-indigo-500/20"
                    iconColor="rgb(79 70 229)"
                >
                    <SelectValue placeholder="Chọn ngôn ngữ đích" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-200" position="popper">
                    {TARGET_LANGUAGES.map((lang) => (
                        <SelectItem
                            key={lang.code}
                            value={lang.code}
                            className="cursor-pointer rounded-lg py-2 focus:bg-indigo-50"
                        >
                            {languageItemLabel(lang)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
