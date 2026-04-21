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
            <span className="font-medium leading-tight text-neutral-950">
                {lang.nativeLabel}
            </span>
            <span className="text-xs font-normal leading-tight text-neutral-600">
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
                    className="h-auto min-h-11 rounded-xl border-neutral-200 bg-white py-2.5 text-left hover:bg-neutral-50 data-[state=open]:border-neutral-300 data-[state=open]:ring-2 data-[state=open]:ring-neutral-950/10"
                    iconColor="#171717"
                >
                    <SelectValue placeholder="Chọn ngôn ngữ đích" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-neutral-200 bg-white" position="popper">
                    {TARGET_LANGUAGES.map((lang) => (
                        <SelectItem
                            key={lang.code}
                            value={lang.code}
                            className="rounded-lg py-2 focus:bg-neutral-100 data-[highlighted]:bg-neutral-100"
                        >
                            {languageItemLabel(lang)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
