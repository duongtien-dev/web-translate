import { FieldLabel } from './FieldLabel'

type SourceTextareaProps = {
    id: string
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function SourceTextarea({
    id,
    value,
    onChange,
    disabled,
}: SourceTextareaProps) {
    return (
        <div>
            <FieldLabel>
                Văn bản nguồn (tiếng Việt)
            </FieldLabel>
            <textarea
                id={id}
                name="source-vi"
                lang="vi"
                dir="auto"
                rows={8}
                disabled={disabled}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ví dụ: Xin chào"
                title="Nhập tiếng Việt — có thể dán văn bản dài"
                className="min-h-[12rem] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 shadow-sm transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-slate-50 motion-reduce:transition-none sm:min-h-[14rem] sm:text-[1.0625rem]"
                spellCheck
            />
        </div>
    )
}
